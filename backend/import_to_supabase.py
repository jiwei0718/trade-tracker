"""Import the existing agreement data into Supabase (re-runnable).

Run from repo root:
    npx tsx scripts/export-curated.ts            # refresh backend/.cache/curated.json
    python backend/import_to_supabase.py --dry-run
    python backend/import_to_supabase.py         # curated data only (the usual case)

Scope
- curated (default): countries, organizations and the hand-curated agreements. Use this
  after editing the app's curated data. Scraped agreements are left alone: since
  2026-10-09 the n8n flow "WTO 區域貿易協定資料庫同步" owns them, and data/agreements.json
  is an older snapshot that would undo its updates.
- all: the one-time bootstrap that also loads data/agreements.json and data/events.json.

Inputs
- backend/.cache/curated.json  curated agreements, details, article structures,
                               countries, organizations (exported from the app's TS)
- data/agreements.json         scraped agreements (WTO RTA-IS, WTO JSI pages)
- data/events.json             legacy events

Policy (from the 2026-10-03 data audit)
- Curated agreements: curated content wins. Live pipeline edits to them are ignored —
  the old LLM step had flipped WTO to "negotiating" and the e-commerce JSI to
  "in_force" with date "2027-MM".
- Agreements created only by the old LLM step are not imported (9 unverified rows,
  mostly duplicates). Their events are kept as status='pending' and hidden.
- LLM / heuristic status events that contradict corrected data are kept as 'retracted'.
- Invalid dates are dropped. Parties and provenance of imported agreements are replaced.

Needs SUPABASE_URL and SUPABASE_SECRET_KEY in .env (repo root).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

import requests

ROOT = Path(__file__).parent.parent
CURATED = ROOT / "backend" / ".cache" / "curated.json"
LIVE = ROOT / "data" / "agreements.json"
EVENTS = ROOT / "data" / "events.json"

TYPES = {"bilateral", "multilateral", "regional", "sectoral", "plurilateral",
         "jsi", "ministerial", "mou", "joint_declaration", "pilot"}
STATUSES = {"in_force", "signed", "concluded", "negotiating", "suspended",
            "cancelled", "proposed", "superseded", "expired"}
ERAS = {"pre_gatt", "gatt_era", "wto_birth", "fta_boom", "fragmentation", "post_liberation"}
DATE_KEYS = {"proposed", "started", "concluded", "signed", "in_force",
             "suspended", "cancelled", "expired", "superseded"}
DATE_RE = re.compile(r"^\d{4}(-\d{2}(-\d{2})?)?$")

SOURCE_IDS = {"WTO RTA-IS": "wto-rta-is", "WTO JSI page": "wto-jsi-pages"}
LLM_SOURCE = "LLM extraction"

# Scraped rows whose status was guessed wrongly; corrected and promoted to curated so
# later scraper runs cannot overwrite them.
CORRECTIONS = {
    "wto-jsi-sdr": {"status": "in_force", "key_dates": {"in_force": "2024-02"},
                    "note": "Reference Paper on Services Domestic Regulation in force since 2024-02-26"},
    "wto-jsi-ifd": {"status": "concluded", "key_dates": {"concluded": "2023-07"},
                    "note": "IFD Agreement text concluded July 2023; incorporation into Annex 4 still blocked"},
}
# Heuristic JSI page statuses are weak evidence.
CONFIDENCE = {"wto-rta-is": 0.95, "wto-jsi-pages": 0.60}


def load_env() -> dict[str, str]:
    env = {}
    for line in (ROOT / ".env").read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


def clean_dates(raw: dict | None, report: Counter, ctx: str) -> dict:
    out = {}
    for k, v in (raw or {}).items():
        if k in DATE_KEYS and isinstance(v, str) and DATE_RE.match(v):
            out[k] = v
        else:
            report[f"dropped date {ctx}:{k}={v}"] += 1
    return out


def source_names(a: dict) -> set[str]:
    return {s.get("name") for s in a.get("sources", []) if s.get("name")}


def agreement_row(a: dict, origin: str, detail: dict | None, structure, report: Counter) -> dict | None:
    if a.get("type") not in TYPES or a.get("status") not in STATUSES:
        report[f"skipped invalid type/status: {a['id']} ({a.get('type')}/{a.get('status')})"] += 1
        return None
    tv = a.get("tradeVolume")
    return {
        "id": a["id"],
        "name": a["name"],
        "name_zh": a.get("nameZh"),
        "full_name_zh": a.get("fullNameZh"),
        "short_name": a.get("shortName"),
        "type": a["type"],
        "status": a["status"],
        "era": a.get("era") if a.get("era") in ERAS else None,
        "key_dates": clean_dates(a.get("keyDates"), report, a["id"]),
        "latest_progress_date": a.get("latestProgressDate"),
        "latest_progress_note": a.get("latestProgressNote"),
        "trade_volume": tv if isinstance(tv, (int, float)) else None,
        "description": a.get("description"),
        "description_zh": a.get("descriptionZh"),
        "key_provisions": a.get("keyProvisions") or [],
        "tags": a.get("tags") or [],
        "superseded_by": a.get("supersededBy"),
        "parent_id": a.get("parentId"),
        "related_ids": a.get("relatedIds") or [],
        "significance": a.get("significance"),
        "latest_status": (detail or {}).get("latestStatus"),
        "indigo": (detail or {}).get("indigo"),
        "source_docs": (detail or {}).get("sourceDocs") or [],
        "article_structure": structure or a.get("articleStructure"),
        "origin": origin,
        "data_as_of": a.get("last_updated") if origin == "scraped" else None,
    }


def party_rows(a: dict) -> list[dict]:
    names, names_zh = a.get("partyNames") or [], a.get("partyNamesZh") or []
    rows, seen = [], set()
    for i, code in enumerate(a.get("parties") or []):
        if not code or code in seen:
            continue
        seen.add(code)
        rows.append({
            "agreement_id": a["id"], "party_code": code,
            "party_name": names[i] if i < len(names) else None,
            "party_name_zh": names_zh[i] if i < len(names_zh) else None,
            "ordinal": i,
        })
    return rows


def build(report: Counter, scope: str = "curated"):
    curated = json.loads(CURATED.read_text(encoding="utf-8"))
    live = json.loads(LIVE.read_text(encoding="utf-8"))["agreements"]
    legacy_events = json.loads(EVENTS.read_text(encoding="utf-8"))["events"]

    details, structures = curated["details"], curated["articleStructures"]
    curated_ids = {a["id"] for a in curated["agreements"]}

    agreements, parties, provenance = [], [], []
    excluded_llm: list[str] = []

    for a in curated["agreements"]:
        row = agreement_row(a, "curated", details.get(a["id"]), structures.get(a["id"]), report)
        if row:
            agreements.append(row)
            parties += party_rows(a)
    report["agreements curated"] = len(agreements)

    for a in live:
        if a["id"] in curated_ids:
            continue
        if scope != "all" and a["id"] not in CORRECTIONS:
            continue
        names = source_names(a)
        if names == {LLM_SOURCE} or not names:
            excluded_llm.append(a["id"])
            continue
        source_id = next((SOURCE_IDS[n] for n in names if n in SOURCE_IDS), None)
        row = agreement_row(a, "scraped", None, None, report)
        if not row:
            continue
        fix = CORRECTIONS.get(a["id"])
        if fix:
            row.update(status=fix["status"], key_dates=fix["key_dates"], origin="curated")
            report[f"corrected {a['id']} -> {fix['status']}"] += 1
        else:
            fetched = next((s.get("fetched_at") for s in a.get("sources", []) if s.get("fetched_at")), None)
            for field in ("status", "key_dates", "parties"):
                provenance.append({
                    "agreement_id": a["id"], "field": field,
                    "confidence": CONFIDENCE.get(source_id, 0.5), "source_tier": "S",
                    "source_label": next(iter(names & SOURCE_IDS.keys()), "unknown"),
                    "source_url": next((s.get("url") for s in a.get("sources", []) if s.get("url")), None),
                    "extracted_at": fetched or a.get("last_updated"),
                    "status": "active",
                })
        agreements.append(row)
        parties += party_rows(a)
        report[f"agreements scraped:{source_id}"] += 1

    ids = {r["id"] for r in agreements}
    known_ids = ids | {a["id"] for a in live}   # scraped rows already in the database
    for r in agreements:
        if r["parent_id"] and r["parent_id"] not in known_ids:
            report[f"dropped unknown parent_id {r['id']}->{r['parent_id']}"] += 1
            r["parent_id"] = None
    agreements.sort(key=lambda r: r["parent_id"] is not None)  # parents first
    report["agreements excluded (LLM-only, unverified)"] = len(excluded_llm)

    protected = curated_ids | set(CORRECTIONS)
    events = []
    for e in (legacy_events if scope == "all" else []):
        names = {s.get("name") for s in e.get("sources", [])}
        is_llm = LLM_SOURCE in names
        known = e["agreement_id"] in ids
        status = "active"
        if e["agreement_id"] in protected and e["kind"] in ("status_change", "date_added") and "WTO RTA-IS" not in names:
            status = "retracted"
        elif is_llm:
            status = "pending"
        new_value = e.get("to_value")
        if not known:
            new_value = {"proposed_agreement_id": e["agreement_id"], "value": new_value}
        eff = e.get("effective_date")
        events.append({
            "legacy_id": e["id"],
            "agreement_id": e["agreement_id"] if known else None,
            "event_type": e["kind"],
            "event_date": eff if isinstance(eff, str) and DATE_RE.match(eff) else None,
            "old_value": e.get("from_value"),
            "new_value": new_value,
            "source_id": next((SOURCE_IDS[n] for n in names if n in SOURCE_IDS), None),
            "source_url": next((s.get("url") for s in e.get("sources", []) if s.get("url")), None),
            "confidence": next((CONFIDENCE[SOURCE_IDS[n]] for n in names if n in SOURCE_IDS), None),
            "status": status,
            "by_tool": "gemini (legacy llm_extract)" if is_llm else None,
            "detected_at": e["detected_at"],
        })
        report[f"events {status}"] += 1

    countries = [{"code": c["code"], "name_zh": c["zh"], "name_en": c["en"],
                  "aliases": c.get("aliases") or []} for c in curated["countries"]]
    organizations = [{
        "code": o["code"], "name_zh": o["nameZh"], "abbr_zh": o.get("abbrZh"),
        "name_en": o["name"], "abbr": o.get("abbr"), "category": o.get("category"),
        "members": o.get("members") or [], "founded": o.get("founded"), "hq": o.get("hq"),
        "description_zh": o.get("descriptionZh"), "source_url": o.get("sourceUrl"),
    } for o in curated["organizations"]]

    report["parties"] = len(parties)
    report["provenance rows"] = len(provenance)
    report["countries"] = len(countries)
    report["organizations"] = len(organizations)
    return {
        "countries": countries, "organizations": organizations, "agreements": agreements,
        "parties": parties, "provenance": provenance, "events": events,
        "excluded_llm": excluded_llm, "ids": sorted(ids),
    }


class Rest:
    def __init__(self, url: str, key: str):
        self.base = f"{url}/rest/v1"
        self.s = requests.Session()
        self.s.headers.update({"apikey": key, "Content-Type": "application/json"})

    def upsert(self, table: str, rows: list[dict], on_conflict: str | None = None, batch: int = 200):
        params = {"on_conflict": on_conflict} if on_conflict else {}
        for i in range(0, len(rows), batch):
            r = self.s.post(f"{self.base}/{table}", params=params, json=rows[i:i + batch],
                            headers={"Prefer": "resolution=merge-duplicates,return=minimal"}, timeout=60)
            if r.status_code >= 300:
                raise SystemExit(f"{table} upsert failed ({r.status_code}): {r.text[:400]}")

    def delete_for(self, table: str, column: str, values: list[str], batch: int = 100):
        for i in range(0, len(values), batch):
            chunk = ",".join(f'"{v}"' for v in values[i:i + batch])
            r = self.s.delete(f"{self.base}/{table}", params={column: f"in.({chunk})"}, timeout=60)
            if r.status_code >= 300:
                raise SystemExit(f"{table} delete failed ({r.status_code}): {r.text[:400]}")

    def count(self, table: str, query: str = "") -> int:
        r = self.s.get(f"{self.base}/{table}?select=*{query}", headers={"Prefer": "count=exact", "Range": "0-0"}, timeout=60)
        return int(r.headers.get("content-range", "*/0").split("/")[-1])


STATUS_ZH = {"in_force": "已生效", "signed": "已簽署", "concluded": "談判完成", "negotiating": "談判中",
             "suspended": "已暫停", "cancelled": "已取消", "proposed": "提議中", "superseded": "已被取代",
             "expired": "已失效"}
DATE_ZH = {"proposed": "提議", "started": "啟動談判", "concluded": "完成談判", "signed": "簽署", "in_force": "生效",
           "suspended": "暫停", "cancelled": "取消", "expired": "失效", "superseded": "被取代"}


def curation_events(db: "Rest", rows: list[dict], corrections: frozenset[str] = frozenset()) -> list[dict]:
    """One event per status/date change between the curated rows and the database.

    Curated edits are real-world updates checked by hand (e.g. a signature the pipelines
    missed), so they belong in the 動態 feed like any other change. Ids in `corrections`
    are fixes of our own wrong data instead, logged as one 「資料更正」 event each.
    """
    existing: dict[str, dict] = {}
    ids = [r["id"] for r in rows]
    for i in range(0, len(ids), 100):
        chunk = ",".join(f'"{x}"' for x in ids[i:i + 100])
        r = db.s.get(f"{db.base}/agreements", params={"select": "id,status,key_dates", "id": f"in.({chunk})"},
                     timeout=60)
        r.raise_for_status()
        existing |= {x["id"]: x for x in r.json()}

    events = []

    def ev(row, type_, summary, date=None, field=None, old=None, new=None):
        note = row.get("latest_progress_note")
        events.append({
            "agreement_id": row["id"], "event_type": type_, "event_date": date, "field": field,
            "old_value": old, "new_value": new,
            "summary_zh": f"{summary}{note}" if note and type_ == "status_change" else summary,
            "source_id": "manual-curation", "source_url": ((row.get("source_docs") or [{}])[0]).get("url"),
            "confidence": 0.9, "status": "active",
        })

    for row in rows:
        name, dates, old = row["name_zh"] or row["name"], row["key_dates"], existing.get(row["id"])
        if old and row["id"] in corrections:
            # Fixing our own wrong data is not a real-world development: log it as a correction
            # (no event date, so it is not filed as a milestone in the agreement's history).
            changed = old["status"] != row["status"] or (old.get("key_dates") or {}) != dates
            if changed:
                before = STATUS_ZH.get(old["status"], old["status"])
                events.append({
                    "agreement_id": row["id"], "event_type": "field_update", "event_date": None,
                    "field": "status", "old_value": old["status"], "new_value": row["status"],
                    "summary_zh": f"資料更正:「{name}」原記為「{before}」,依官方資料更正為「{STATUS_ZH[row['status']]}」。",
                    "source_id": "manual-curation", "source_url": ((row.get("source_docs") or [{}])[0]).get("url"),
                    "confidence": 0.95, "status": "active",
                })
            continue
        if not old:
            # A newly curated agreement usually records a real development (a signature, an
            # entry into force), so the event takes that type and shows in the 動態 feed.
            note = row.get("latest_progress_note")
            milestone = {"signed": "signed", "in_force": "in_force", "concluded": "concluded"}.get(row["status"])
            kind = milestone or ("news" if note else "new_agreement")
            events.append({
                "agreement_id": row["id"], "event_type": kind,
                "event_date": (dates.get(row["status"]) if milestone else row.get("latest_progress_date")) or dates.get("signed"),
                "field": None, "old_value": None, "new_value": row["status"],
                "summary_zh": f"新增「{name}」({STATUS_ZH[row['status']]})。{note or ''}",
                "source_id": "manual-curation", "source_url": ((row.get("source_docs") or [{}])[0]).get("url"),
                "confidence": 0.9, "status": "active",
            })
            continue
        if old["status"] != row["status"]:
            ev(row, "status_change",
               f"「{name}」狀態由「{STATUS_ZH.get(old['status'], old['status'])}」更新為「{STATUS_ZH[row['status']]}」。",
               date=dates.get(row["status"]), field="status", old=old["status"], new=row["status"])
        old_dates = old.get("key_dates") or {}
        for k, v in dates.items():
            if k not in old_dates:
                ev(row, "date_added", f"「{name}」新增{DATE_ZH.get(k, k)}日期:{v}。", date=v,
                   field=f"key_dates.{k}", new=v)
            elif old_dates[k] != v:
                ev(row, "field_update", f"「{name}」的{DATE_ZH.get(k, k)}日期由 {old_dates[k]} 更正為 {v}。", date=v,
                   field=f"key_dates.{k}", old=old_dates[k], new=v)
        for k in old_dates.keys() - dates.keys():
            ev(row, "field_update", f"「{name}」移除{DATE_ZH.get(k, k)}日期(原為 {old_dates[k]})。",
               field=f"key_dates.{k}", old=old_dates[k])
    return events


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--dry-run", action="store_true", help="build and report, do not write")
    p.add_argument("--scope", choices=["curated", "all"], default="curated",
                   help="curated: hand-curated data only (default); all: one-time bootstrap incl. scraped rows")
    p.add_argument("--correction", default="",
                   help="comma-separated agreement ids whose changes fix wrong data (logged as 資料更正)")
    args = p.parse_args(argv)

    report: Counter = Counter()
    data = build(report, args.scope)
    print("── import plan ──")
    for k, v in sorted(report.items()):
        print(f"  {v:5d}  {k}")
    print("  excluded LLM-only ids:", ", ".join(data["excluded_llm"]))

    env = load_env()
    db = Rest(env["SUPABASE_URL"], env["SUPABASE_SECRET_KEY"])
    corrections = frozenset(x.strip() for x in args.correction.split(",") if x.strip())
    changes = curation_events(db, data["agreements"], corrections)
    print(f"── changes vs database: {len(changes)} events ──")
    for e in changes:
        print(f"  {e['event_type']:14} {e['summary_zh']}")
    if args.dry_run:
        print("dry run: nothing written")
        return 0

    db.upsert("countries", data["countries"], "code")
    db.upsert("organizations", data["organizations"], "code")
    db.upsert("agreements", data["agreements"], "id")
    db.delete_for("agreement_parties", "agreement_id", data["ids"])
    db.upsert("agreement_parties", data["parties"], "agreement_id,party_code")
    db.delete_for("field_provenance", "agreement_id", data["ids"])
    db.upsert("field_provenance", data["provenance"], "agreement_id,field")
    if data["events"]:
        db.upsert("events", data["events"], "legacy_id")
    if changes:
        r = db.s.post(f"{db.base}/events", json=changes, headers={"Prefer": "return=minimal"}, timeout=60)
        if r.status_code >= 300:
            raise SystemExit(f"events insert failed ({r.status_code}): {r.text[:400]}")

    print("── written (row counts in Supabase) ──")
    for table in ("countries", "organizations", "agreements", "agreement_parties",
                  "field_provenance", "events"):
        print(f"  {db.count(table):5d}  {table}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
