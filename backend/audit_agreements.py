"""Check agreements in Supabase for status/date contradictions (read-only).

    python backend/audit_agreements.py            # all problems
    python backend/audit_agreements.py --curated  # only hand-curated agreements

Rules
- The status must agree with the dates: e.g. "negotiating" with a signature date,
  "signed" with an entry-into-force date already in the past.
- Dates must be in order: proposed ≤ started ≤ concluded ≤ signed ≤ in_force ≤ expired.
- No future entry into force for an agreement marked in force.

Some exceptions are real (CER entered into force before it was signed); list them in
KNOWN_EXCEPTIONS with the reason so they stop showing up.
"""
from __future__ import annotations

import argparse
import datetime as dt
import sys
from collections import defaultdict

from import_to_supabase import Rest, load_env

ORDER = ["proposed", "started", "concluded", "signed", "in_force", "expired"]
PRE_SIGNATURE = {"proposed", "negotiating"}

KNOWN_EXCEPTIONS = {
    # Australia–New Zealand CER: applied from 1983-01-01, formally signed 1983-03-28.
    ("cer-anzcerta", "in_force before signed"),
    # As published by the WTO RTA-IS (applied before the signature date):
    ("wto-rta-eu-ukraine", "in_force before signed"),            # EU trade preferences from 2014-04-23
    ("wto-rta-poland-faroe-islands", "in_force before signed"),
    ("wto-rta-slovak-republic-romania-free-trade-agreement", "in_force before signed"),
}


def month(d: str) -> str:
    """Compare dates at month precision: '2024', '2024-02' and '2024-02-26' all work."""
    return (d + "-01")[:7] if len(d) == 4 else d[:7]


def check(a: dict, today: str) -> list[str]:
    d, s = a.get("key_dates") or {}, a["status"]
    out = []
    if s in PRE_SIGNATURE and ("signed" in d or "in_force" in d):
        out.append(f"status {s} but has {'in_force' if 'in_force' in d else 'signed'} date")
    if s == "negotiating" and "concluded" in d and month(d["concluded"]) <= today:
        out.append(f"status negotiating but concluded {d['concluded']}")
    if s == "concluded" and "signed" in d and month(d["signed"]) <= today:
        out.append(f"status concluded but signed {d['signed']}")
    if s == "signed" and "in_force" in d and month(d["in_force"]) <= today:
        out.append(f"status signed but in force since {d['in_force']}")
    if s == "in_force" and "in_force" in d and month(d["in_force"]) > today:
        out.append(f"status in_force but entry into force is {d['in_force']} (future)")
    if s == "in_force" and "expired" in d and month(d["expired"]) <= today:
        out.append(f"status in_force but expired {d['expired']}")
    present = [(k, month(d[k])) for k in ORDER if k in d]
    for (k1, v1), (k2, v2) in zip(present, present[1:]):
        if v1 > v2:
            out.append(f"{k2} before {k1}" if (k2, k1) != ("in_force", "signed") else "in_force before signed")
    return [p for p in out if (a["id"], p) not in KNOWN_EXCEPTIONS]


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--curated", action="store_true", help="only hand-curated agreements")
    args = p.parse_args(argv)

    env = load_env()
    db = Rest(env["SUPABASE_URL"], env["SUPABASE_SECRET_KEY"])
    rows = []
    for start in range(0, 10000, 1000):
        r = db.s.get(f"{db.base}/agreements", params={
            "select": "id,name_zh,origin,status,key_dates", "tags": "not.cs.{wto-delisted}",
            "order": "id", "limit": 1000, "offset": start}, timeout=60)
        r.raise_for_status()
        rows += r.json()
        if len(r.json()) < 1000:
            break

    today = dt.date.today().isoformat()[:7]
    found = defaultdict(list)
    for a in rows:
        if args.curated and a["origin"] != "curated":
            continue
        for problem in check(a, today):
            found[a["origin"]].append((a["id"], a.get("name_zh") or "", a["status"], a.get("key_dates"), problem))

    total = sum(len(v) for v in found.values())
    print(f"checked {len(rows)} agreements, {total} problems")
    for origin in sorted(found):
        print(f"\n── {origin} ({len(found[origin])}) ──")
        for row in found[origin]:
            print(f"  {row[0]:45.45} {row[1][:16]:16} {row[2]:11} {row[4]}   {row[3]}")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
