import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException

from backend.app.routes import live_tests


def event(status="published", start_delta=-5, end_delta=30):
    now = datetime.now(timezone.utc)
    return {
        "id": "test-1",
        "status": status,
        "title": "Physics Live",
        "level": "ssc",
        "subject": "physics",
        "quizId": "set-1",
        "quizHref": "/ssc/physics/set/set-1",
        "startsAt": (now + timedelta(minutes=start_delta)).isoformat(),
        "endsAt": (now + timedelta(minutes=end_delta)).isoformat(),
        "durationMinutes": 20,
    }


class LiveTestStateTests(unittest.TestCase):
    def test_scheduled_states(self):
        self.assertEqual(live_tests._state(event(start_delta=5)), "upcoming")
        self.assertEqual(live_tests._state(event()), "active")
        self.assertEqual(live_tests._state(event(start_delta=-30, end_delta=-5)), "ended")

    def test_draft_is_not_publicly_active(self):
        self.assertEqual(live_tests._state(event(status="draft")), "draft")


class LiveTestAttemptTests(unittest.IsolatedAsyncioTestCase):
    async def test_second_start_reuses_the_same_user_attempt(self):
        saved = {"userId": "user-1", "submittedAt": None}
        with (
            patch.object(live_tests, "_get_event", AsyncMock(return_value=event())),
            patch.object(live_tests.firestore, "try_create_document", AsyncMock(side_effect=[True, False])) as create,
            patch.object(live_tests.firestore, "get_document", AsyncMock(return_value=saved)),
        ):
            first = await live_tests.start_live_test("test-1", {"id": "user-1", "name": "Student"})
            second = await live_tests.start_live_test("test-1", {"id": "user-1", "name": "Student"})

        self.assertTrue(first["created"])
        self.assertFalse(second["created"])
        self.assertEqual(create.await_count, 2)
        self.assertEqual(first["attempt"]["userId"], second["attempt"]["userId"])

    async def test_atomic_submission_claim_blocks_duplicate(self):
        saved = {
            "userId": "user-1",
            "submittedAt": None,
            "deadlineAt": (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat(),
        }
        payload = live_tests.LiveTestSubmission(answers=[], timeTaken=10)
        with (
            patch.object(live_tests, "_get_event", AsyncMock(return_value=event())),
            patch.object(live_tests.firestore, "get_document", AsyncMock(return_value=saved)),
            patch.object(live_tests.firestore, "try_create_document", AsyncMock(return_value=False)),
        ):
            with self.assertRaises(HTTPException) as caught:
                await live_tests.submit_live_test("test-1", payload, {"id": "user-1"})
        self.assertEqual(caught.exception.status_code, 409)


if __name__ == "__main__":
    unittest.main()
