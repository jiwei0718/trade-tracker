"""Check agreements in Supabase for status/date contradictions (read-only).

    python backend/audit_agreements.py            # all problems
    python backend/audit_agreements.py --curated  # only hand-curated agreements

Rules
- The status must agree with the dates: e.g. "negotiating" with a signature date,
  "signed" with an entry-into-force date already in the past.
- Dates must be in order: proposed ≤ started ≤ concluded ≤ signed ≤ in_force ≤ expired.
- No future entry into force for an agreement marked in force.
- Hand-curated agreements agree with the WTO RTA row that has the same parties: whether
  it is in force, and the signature, entry-into-force and inactive months. Pairs that are
  different agreements between the same parties go in DIFFERENT_AGREEMENTS; accepted
  differences in KNOWN_EXCEPTIONS.

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
    # Curated vs WTO, checked 2026-10-10:
    ("asean-japan", "signed 2008-04 vs WTO 2008-03"),     # signing completed 14 April 2008
    ("asean-korea", "in_force 2007-06 vs WTO 2010-01"),   # goods agreement applied from June 2007
    ("cer-anzcerta", "signed 1983-03 vs WTO 1982-12"),
    ("eu-uk-tca", "in_force 2021-05 vs WTO 2021-01"),     # provisional 2021-01, in force 2021-05
}

# Curated agreement vs WTO row with the same parties that is a different agreement.
DIFFERENT_AGREEMENTS = {
    ("auto-pact-1965", "wto-rta-canada-us-free-trade-agreement-cusfta"),
    ("cer-anzcerta", "wto-rta-australia-new-zealand-free-trade-agreement"),
    ("cotonou", "wto-rta-first-convention-of-lom"), ("cotonou", "wto-rta-second-convention-of-lom"),
    ("cotonou", "wto-rta-third-convention-of-lom"),
    ("lome-convention", "wto-rta-second-convention-of-lom"), ("lome-convention", "wto-rta-third-convention-of-lom"),
    ("eu-chile-modern", "wto-rta-eu-chile-association-agreement"),
    ("eu-mexico-modern", "wto-rta-eu-mexico"),
    ("eu-turkey-customs", "wto-rta-ec-t-rkiye-additional-protocol"),
    ("eu-turkey-customs", "wto-rta-ec-t-rkiye-association-agreement-of-1973"),
    ("eu-turkey-customs", "wto-rta-eec-t-rkiye-association-agreement-of-1963"),
    ("eu-us-talks", "wto-rta-eu-us-ttip"),
    ("korea-singapore-dpa", "wto-rta-korea-republic-of-singapore"),
    ("nafta", "wto-rta-united-states-mexico-canada-agreement-usmca-cusma-t-mec"),
    ("singapore-australia-dea", "wto-rta-singapore-australia"),
    ("uk-singapore-dea", "wto-rta-united-kingdom-singapore"),
    ("us-jordan-art", "wto-rta-united-states-jordan"),
    ("usmca", "wto-rta-north-american-free-trade-agreement-nafta"),
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


def compare_with_wto(curated: dict, wto: dict) -> list[str]:
    """Differences between a curated agreement and the WTO row with the same parties."""
    c, w = curated.get("key_dates") or {}, wto.get("key_dates") or {}
    out = []
    if (curated["status"] == "in_force") != (wto["status"] == "in_force"):
        out.append(f"status {curated['status']} vs WTO {wto['status']}")
    for k in ("signed", "in_force", "expired"):
        if c.get(k) and w.get(k) and month(c[k]) != month(w[k]):
            out.append(f"{k} {c[k]} vs WTO {w[k]}")
    return [p for p in out if (curated["id"], p) not in KNOWN_EXCEPTIONS]


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--curated", action="store_true", help="only hand-curated agreements")
    args = p.parse_args(argv)

    env = load_env()
    db = Rest(env["SUPABASE_URL"], env["SUPABASE_SECRET_KEY"])
    rows = []
    for start in range(0, 10000, 1000):
        r = db.s.get(f"{db.base}/agreements_full", params={
            "select": "id,name_zh,origin,status,key_dates,parties", "tags": "not.cs.{wto-delisted}",
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

    # Curated agreements against the official WTO record of the same parties.
    wto_by_parties = defaultdict(list)
    for a in rows:
        if a["origin"] == "scraped" and a["id"].startswith("wto-rta-"):
            wto_by_parties[frozenset(a.get("parties") or [])].append(a)
    for a in rows:
        if a["origin"] != "curated" or len(a.get("parties") or []) < 2:
            continue
        for w in wto_by_parties.get(frozenset(a["parties"]), []):
            if (a["id"], w["id"]) in DIFFERENT_AGREEMENTS:
                continue
            for problem in compare_with_wto(a, w):
                found["curated vs WTO"].append((a["id"], a.get("name_zh") or "", a["status"], w["id"], problem))

    total = sum(len(v) for v in found.values())
    print(f"checked {len(rows)} agreements, {total} problems")
    for origin in sorted(found):
        print(f"\n── {origin} ({len(found[origin])}) ──")
        for row in found[origin]:
            print(f"  {row[0]:45.45} {row[1][:16]:16} {row[2]:11} {row[4]}   {row[3]}")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
