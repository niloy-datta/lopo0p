from fastapi import APIRouter

from ..services.leaderboard_service import fetch_top_100_entries

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("")
async def get_leaderboard():
    """
    Returns precomputed top-100 from a single Firestore document:
    leaderboards/top_100 (1 read, no collection scan).
    """
    try:
        return await fetch_top_100_entries()
    except Exception as e:
        print(f"[ERROR] Failed to fetch leaderboard: {e}")
        return []


@router.get("/colleges")
async def get_college_leaderboard():
    """Aggregate schools/colleges from real ranked student entries."""
    entries = await fetch_top_100_entries()
    groups: dict[str, dict] = {}
    for entry in entries:
        name = str(entry.get("collegeName") or entry.get("schoolName") or "").strip()
        if not name:
            continue
        group = groups.setdefault(name, {"total": 0, "count": 0, "top": 0})
        points = int(entry.get("points") or 0)
        group["total"] += points
        group["count"] += 1
        group["top"] = max(group["top"], points)

    rows = [
        {
            "name": name,
            "score": values["total"],
            "studentCount": values["count"],
            "topScore": values["top"],
            "avgScore": round(values["total"] / values["count"]),
        }
        for name, values in groups.items()
    ]
    rows.sort(key=lambda row: (-row["score"], row["name"]))
    return [{**row, "rank": index + 1} for index, row in enumerate(rows)]
