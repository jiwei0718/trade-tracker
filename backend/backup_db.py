"""Back up every Supabase table to a local file (read-only on the database).

    python backend/backup_db.py            # writes %LOCALAPPDATA%\\trade-tracker\\backups\\db-YYYY-MM-DD.json.gz
    python backend/backup_db.py --keep 20  # keep the 20 newest backups (default 12)

Curated agreements also live in the app's TypeScript and WTO rows can be fetched again, but
events, review decisions, run history and source items exist only in the database. The
backup goes outside OneDrive and outside the (public) repository.

Needs SUPABASE_URL and SUPABASE_SECRET_KEY in .env (repo root).
"""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import json
import os
import sys
from pathlib import Path

from import_to_supabase import Rest, load_env

TABLES = ["countries", "organizations", "agreements", "agreement_parties", "field_provenance", "events",
          "sources", "source_items", "source_runs", "pipeline_runs", "update_settings", "update_requests"]
PAGE = 1000


def fetch_all(db: Rest, table: str) -> list[dict]:
    rows: list[dict] = []
    while True:
        r = db.s.get(f"{db.base}/{table}", params={"select": "*"},
                     headers={"Range": f"{len(rows)}-{len(rows) + PAGE - 1}"}, timeout=120)
        if r.status_code >= 300:
            raise SystemExit(f"{table}: read failed ({r.status_code}): {r.text[:300]}")
        page = r.json()
        rows += page
        if len(page) < PAGE:
            return rows


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--keep", type=int, default=12, help="how many backups to keep")
    args = p.parse_args(argv)

    env = load_env()
    db = Rest(env["SUPABASE_URL"], env["SUPABASE_SECRET_KEY"])
    data = {"created_at": dt.datetime.now(dt.timezone.utc).isoformat(), "tables": {}}
    for table in TABLES:
        data["tables"][table] = fetch_all(db, table)
        print(f"  {len(data['tables'][table]):6d}  {table}")

    folder = Path(os.environ.get("LOCALAPPDATA", Path.home())) / "trade-tracker" / "backups"
    folder.mkdir(parents=True, exist_ok=True)
    out = folder / f"db-{dt.date.today().isoformat()}.json.gz"
    with gzip.open(out, "wt", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")

    old = sorted(folder.glob("db-*.json.gz"))[:-args.keep]
    for f in old:
        f.unlink()
    if old:
        print(f"removed {len(old)} older backup(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
