"""Rewrite fields we derive ourselves from WTO RTA-IS names (Chinese names, party codes).

    python backend/refresh_wto_derived.py --dry-run
    python backend/refresh_wto_derived.py

Use after improving the name parser (backend/scrapers/rta_names.py) and rebuilding the
worker. These are translation/parsing fixes, not real-world changes, so no events are
written; afterwards the n8n sync sees no difference. Curated and wto-delisted rows are
left alone.

Needs the worker running (http://localhost:8001) and SUPABASE_SECRET_KEY in .env.
"""
from __future__ import annotations

import argparse
import sys
from collections import defaultdict

import requests

from import_to_supabase import Rest, load_env

WORKER = "http://localhost:8001/sources/wto-rta-is/fetch"


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(argv)

    fetched = requests.post(WORKER, timeout=300).json()
    env = load_env()
    db = Rest(env["SUPABASE_URL"], env["SUPABASE_SECRET_KEY"])
    r = db.s.get(f"{db.base}/agreements_full", params={
        "select": "id,origin,name_zh,parties,tags", "id": "like.wto-rta-*", "limit": 2000}, timeout=60)
    r.raise_for_status()
    existing = {x["id"]: x for x in r.json()}

    parties_of = defaultdict(list)
    for row in fetched["parties"]:
        parties_of[row["agreement_id"]].append(row)

    rename, reparty = [], []
    for a in fetched["agreements"]:
        old = existing.get(a["id"])
        if not old or old["origin"] != "scraped" or "wto-delisted" in (old["tags"] or []):
            continue
        if old["name_zh"] != a["name_zh"]:
            rename.append({k: a[k] for k in ("id", "name", "name_zh", "type", "status")})
        if sorted(old["parties"] or []) != sorted(p["party_code"] for p in parties_of[a["id"]]):
            reparty.append(a["id"])

    print(f"Chinese names to update: {len(rename)}; party lists to rewrite: {len(reparty)}")
    for row in rename[:15]:
        print(f"  {existing[row['id']]['name_zh']}  →  {row['name_zh']}")
    if args.dry_run:
        print("dry run: nothing written")
        return 0

    db.upsert("agreements", rename, "id")
    db.delete_for("agreement_parties", "agreement_id", reparty)
    db.upsert("agreement_parties", [p for i in reparty for p in parties_of[i]], "agreement_id,party_code")
    print("written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
