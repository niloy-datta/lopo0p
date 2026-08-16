import json
import uuid
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator

from .. import firestore
from ..core.security import require_admin, require_user
from ..models.quiz import QuizAnswer
from ..services.scoring import score_submission
from ..services.answer_loader import load_answers

router = APIRouter(prefix="/api/live-tests", tags=["live-tests"])


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _parse_dt(value: str) -> datetime:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Invalid event date") from exc


def _state(event: dict, now: Optional[datetime] = None) -> str:
    if event.get("status") != "published":
        return str(event.get("status") or "draft")
    current = now or _now()
    if current < _parse_dt(str(event["startsAt"])):
        return "upcoming"
    if current <= _parse_dt(str(event["endsAt"])):
        return "active"
    return "ended"


def _public_event(event: dict) -> dict:
    return {
        "id": event.get("id"),
        "title": event.get("title"),
        "level": event.get("level"),
        "subject": event.get("subject"),
        "quizId": event.get("quizId"),
        "quizHref": event.get("quizHref"),
        "startsAt": event.get("startsAt"),
        "endsAt": event.get("endsAt"),
        "durationMinutes": int(event.get("durationMinutes") or 30),
        "state": _state(event),
    }


class LiveTestUpsert(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    level: Literal["ssc", "hsc"]
    subject: str = Field(min_length=2, max_length=80, pattern=r"^[a-z0-9-]+$")
    quizId: str = Field(min_length=2, max_length=160, pattern=r"^[a-zA-Z0-9._-]+$")
    quizHref: str = Field(min_length=2, max_length=300)
    startsAt: str
    endsAt: str
    durationMinutes: int = Field(default=30, ge=5, le=180)
    status: Literal["draft", "published", "cancelled"] = "draft"

    @field_validator("quizHref")
    @classmethod
    def safe_href(cls, value: str) -> str:
        if not value.startswith("/") or value.startswith("//"):
            raise ValueError("quizHref must be a local path")
        return value


class LiveTestSubmission(BaseModel):
    answers: list[QuizAnswer]
    timeTaken: int = Field(ge=0, le=10800)


async def _get_event(test_id: str) -> dict:
    event = await firestore.get_document("live_tests", test_id)
    if not event:
        raise HTTPException(status_code=404, detail="Live test not found")
    return event


@router.get("")
async def list_live_tests():
    events = await firestore.get_all_documents("live_tests")
    visible = [event for event in events if event.get("status") == "published"]
    visible.sort(key=lambda item: str(item.get("startsAt") or ""), reverse=True)
    return [_public_event(event) for event in visible]


@router.get("/{test_id}")
async def get_live_test(test_id: str):
    event = await _get_event(test_id)
    if event.get("status") != "published":
        raise HTTPException(status_code=404, detail="Live test not found")
    return _public_event(event)


@router.post("/{test_id}/start")
async def start_live_test(test_id: str, user: dict = Depends(require_user)):
    event = await _get_event(test_id)
    if _state(event) != "active":
        raise HTTPException(status_code=409, detail="Live test is not active")
    user_id = str(user.get("id") or "")
    started_at = _now()
    deadline = min(
        _parse_dt(str(event["endsAt"])),
        started_at + timedelta(minutes=int(event.get("durationMinutes") or 30)),
    )
    created = await firestore.try_create_document(
        f"live_attempts/{test_id}/runs",
        user_id,
        {
            "userId": user_id,
            "testId": test_id,
            "name": user.get("name") or "শিক্ষার্থী",
            "collegeName": user.get("collegeName") or user.get("schoolName") or "",
            "startedAt": started_at.isoformat(),
            "deadlineAt": deadline.isoformat(),
            "submittedAt": None,
        },
    )
    attempt = await firestore.get_document(f"live_attempts/{test_id}/runs", user_id)
    return {"created": created, "attempt": attempt, "event": _public_event(event)}


@router.post("/{test_id}/submit")
async def submit_live_test(
    test_id: str,
    payload: LiveTestSubmission,
    user: dict = Depends(require_user),
):
    event = await _get_event(test_id)
    user_id = str(user.get("id") or "")
    attempt = await firestore.get_document(f"live_attempts/{test_id}/runs", user_id)
    if not attempt:
        raise HTTPException(status_code=409, detail="Start the live test before submitting")
    if attempt.get("submittedAt"):
        raise HTTPException(status_code=409, detail="Live test already submitted")
    if _now() > _parse_dt(str(attempt.get("deadlineAt"))):
        raise HTTPException(status_code=409, detail="Live test submission window has ended")

    claimed = await firestore.try_create_document(
        f"live_submission_claims/{test_id}/runs",
        user_id,
        {"claimedAt": _now().isoformat()},
    )
    if not claimed:
        raise HTTPException(status_code=409, detail="Live test already submitted")

    try:
        results = score_submission(
            subject=str(event["subject"]),
            quiz_id=str(event["quizId"]),
            submitted_answers=[{"id": item.id, "ans": item.ans} for item in payload.answers],
            user_rating=int(user.get("elo") or 1200),
        )
        submitted_at = _now().isoformat()
        await firestore.update_document(
            f"live_attempts/{test_id}/runs",
            user_id,
            {
                "submittedAt": submitted_at,
                "score": int(results["correctCount"]),
                "total": len(payload.answers),
                "accuracy": float(results["accuracy"]),
                "timeTaken": payload.timeTaken,
                "resultJson": json.dumps(results, ensure_ascii=False),
            },
        )
    except Exception:
        await firestore.delete_document(f"live_submission_claims/{test_id}/runs", user_id)
        raise
    # Do not reveal answer keys while competitors may still be taking the test.
    return {
        **results,
        "explanations": {},
        "correctAnswerIndexes": {},
        "liveTestId": test_id,
    }


@router.get("/{test_id}/leaderboard")
async def live_test_leaderboard(test_id: str):
    event = await _get_event(test_id)
    rows = await firestore.get_documents_at_path(f"live_attempts/{test_id}/runs")
    submitted = [row for row in rows if row.get("submittedAt")]
    submitted.sort(
        key=lambda row: (-int(row.get("score") or 0), int(row.get("timeTaken") or 0))
    )
    return {
        "event": _public_event(event),
        "entries": [
            {
                "rank": index + 1,
                "userId": row.get("userId"),
                "name": row.get("name") or "শিক্ষার্থী",
                "collegeName": row.get("collegeName") or "",
                "score": int(row.get("score") or 0),
                "total": int(row.get("total") or 0),
                "accuracy": float(row.get("accuracy") or 0),
                "timeTaken": int(row.get("timeTaken") or 0),
            }
            for index, row in enumerate(submitted[:100])
        ],
    }


@router.get("/admin/all")
async def admin_list_live_tests(admin: dict = Depends(require_admin)):
    del admin
    events = await firestore.get_all_documents("live_tests")
    events.sort(key=lambda item: str(item.get("startsAt") or ""), reverse=True)
    return [{**event, "state": _state(event)} for event in events]


@router.post("/admin", status_code=status.HTTP_201_CREATED)
async def create_live_test(payload: LiveTestUpsert, admin: dict = Depends(require_admin)):
    starts_at = _parse_dt(payload.startsAt)
    ends_at = _parse_dt(payload.endsAt)
    if ends_at <= starts_at:
        raise HTTPException(status_code=400, detail="endsAt must be after startsAt")
    if not load_answers(payload.subject, payload.quizId):
        raise HTTPException(status_code=400, detail="Private answer set not found for this quiz")
    test_id = uuid.uuid4().hex[:16]
    event = {
        **payload.model_dump(),
        "startsAt": starts_at.isoformat(),
        "endsAt": ends_at.isoformat(),
        "createdAt": _now().isoformat(),
        "createdBy": admin.get("id") or "admin",
    }
    await firestore.create_document("live_tests", test_id, event)
    return {"id": test_id, **event, "state": _state(event)}


@router.put("/admin/{test_id}")
async def update_live_test(
    test_id: str,
    payload: LiveTestUpsert,
    admin: dict = Depends(require_admin),
):
    del admin
    await _get_event(test_id)
    starts_at = _parse_dt(payload.startsAt)
    ends_at = _parse_dt(payload.endsAt)
    if ends_at <= starts_at:
        raise HTTPException(status_code=400, detail="endsAt must be after startsAt")
    if not load_answers(payload.subject, payload.quizId):
        raise HTTPException(status_code=400, detail="Private answer set not found for this quiz")
    update = {
        **payload.model_dump(),
        "startsAt": starts_at.isoformat(),
        "endsAt": ends_at.isoformat(),
        "updatedAt": _now().isoformat(),
    }
    saved = await firestore.update_document("live_tests", test_id, update)
    return {**saved, "state": _state(saved)}
