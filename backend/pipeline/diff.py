"""Produce events.json by diffing the new agreements.json against the previous one."""
from __future__ import annotations

import datetime as dt
from typing import Any


def diff_agreements(
    previous: list[dict[str, Any]],
    current: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Return list of event dicts describing what changed."""
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    prev_by_id = {a["id"]: a for a in previous}
    events: list[dict[str, Any]] = []

    for a in current:
        prev = prev_by_id.get(a["id"])

        # New agreement
        if not prev:
            events.append({
                "id": f"{a['id']}:new:{now}",
                "agreement_id": a["id"],
                "kind": "new_agreement",
                "from_value": None,
                "to_value": a["status"],
                "detected_at": now,
                "effective_date": _best_date(a.get("keyDates", {})),
                "sources": a.get("sources", []),
            })
            continue

        # Status changed
        if prev.get("status") != a.get("status"):
            events.append({
                "id": f"{a['id']}:status:{now}",
                "agreement_id": a["id"],
                "kind": "status_change",
                "from_value": prev.get("status"),
                "to_value": a["status"],
                "detected_at": now,
                "effective_date": _best_date(a.get("keyDates", {})),
                "sources": a.get("sources", []),
            })

        # New key date added
        prev_dates = set((prev.get("keyDates") or {}).keys())
        cur_dates = set((a.get("keyDates") or {}).keys())
        added = cur_dates - prev_dates
        for k in added:
            events.append({
                "id": f"{a['id']}:date_{k}:{now}",
                "agreement_id": a["id"],
                "kind": "date_added",
                "from_value": None,
                "to_value": f"{k}={a['keyDates'][k]}",
                "detected_at": now,
                "effective_date": a["keyDates"][k],
                "sources": a.get("sources", []),
            })

    return events


def _best_date(key_dates: dict[str, str]) -> str | None:
    for k in ("in_force", "signed", "concluded", "started", "proposed", "suspended", "cancelled"):
        if key_dates.get(k):
            return key_dates[k]
    return None
