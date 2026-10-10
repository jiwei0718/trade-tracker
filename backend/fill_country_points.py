"""Fill countries.lat / countries.lng from the 3D globe's country points.

    python backend/fill_country_points.py --dry-run
    python backend/fill_country_points.py

The points come from trade-tracker-mobile/src/data/geo-points.json, which
trade-tracker-mobile/scripts/build-geo-points.mjs computes from Natural Earth (public domain).
Blocs listed in the countries table (EU, ASEAN...) keep empty coordinates: the globe places
them at their headquarters or members' centre (src/data/geo.ts), which is not a country point.

Needs SUPABASE_SECRET_KEY in .env.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from import_to_supabase import Rest, load_env

POINTS = Path(__file__).resolve().parents[1] / "trade-tracker-mobile" / "src" / "data" / "geo-points.json"


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(argv)

    points = json.loads(POINTS.read_text(encoding="utf-8"))["points"]
    env = load_env()
    db = Rest(env["SUPABASE_URL"], env["SUPABASE_SECRET_KEY"])
    r = db.s.get(f"{db.base}/countries", params={"select": "code,name_zh,name_en,aliases,lat,lng"}, timeout=60)
    r.raise_for_status()
    rows = r.json()

    changed, missing = [], []
    for row in rows:
        pt = points.get(row["code"])
        if not pt:
            missing.append(row["code"])
            continue
        if [row["lat"], row["lng"]] != pt:
            changed.append({**row, "lat": pt[0], "lng": pt[1]})

    print(f"{len(rows)} rows; {len(changed)} to update; without a country point: {' '.join(missing) or '(none)'}")
    if args.dry_run:
        print("dry run: nothing written")
        return 0
    db.upsert("countries", changed, "code")
    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
