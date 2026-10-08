"""Python worker for n8n.

Runs the existing, tested scrapers and returns rows shaped for the Supabase tables.
n8n calls it on the internal Docker network (http://worker:8000). The worker never
writes to the database: n8n compares the rows with the database and decides what to
write, so every step stays visible on the n8n canvas.
"""
from __future__ import annotations

import datetime as dt
from collections import Counter

from fastapi import FastAPI, HTTPException

from backend.import_to_supabase import agreement_row, party_rows
from backend.scrapers import wto_rta

app = FastAPI(title="trade-tracker worker")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/sources/wto-rta-is/fetch")
def fetch_wto_rta() -> dict:
    """Download the WTO RTA-IS bulk export and return agreement + party rows."""
    fetched_at = dt.datetime.now(dt.timezone.utc).isoformat()
    raw = wto_rta.fetch()
    if not raw:
        raise HTTPException(status_code=502, detail="WTO RTA-IS export returned no rows")

    warnings: Counter = Counter()
    agreements, parties, urls = [], [], {}
    for a in raw:
        row = agreement_row(a, "scraped", None, None, warnings)
        if not row:
            continue
        row["data_as_of"] = fetched_at
        agreements.append(row)
        parties.extend(party_rows(a))
        urls[a["id"]] = a.get("sourceUrl") or wto_rta.LIST_URL

    dupes = [k for k, n in Counter(r["id"] for r in agreements).items() if n > 1]
    if dupes:
        raise HTTPException(status_code=500, detail=f"duplicate agreement ids: {dupes}")

    return {
        "source_id": "wto-rta-is",
        "fetched_at": fetched_at,
        "count": len(agreements),
        "agreements": agreements,
        "parties": parties,
        "source_urls": urls,  # id → the agreement's page on RTA-IS
        "warnings": dict(warnings),
    }
