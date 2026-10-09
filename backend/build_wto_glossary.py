"""Turn the Bureau of Foreign Trade's WTO glossary (open data) into the app's term list.

    python backend/build_wto_glossary.py

Source: 經濟部國際貿易署《WTO小辭典》, https://data.gov.tw/dataset/22660
(CSV: https://www.trade.gov.tw/OpenData/getOpenData.aspx?oid=F94E6AF8DAA9FC01),
used under the Open Government Data License, version 1.0. backend/data/ keeps the copy
this file was built from.
"""
from __future__ import annotations

import csv
import io
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC = ROOT / "backend" / "data" / "boft_wto_glossary.csv"
OUT = ROOT / "trade-tracker-mobile" / "src" / "data" / "wto-glossary.json"
CJK = re.compile(r"[㐀-鿿]")

# Rows where the English and Chinese parts are not separated by a space.
FIXED = {
    "DDA杜哈發展議程": ("Doha Development Agenda (DDA)", "杜哈發展議程"),
    "Modality減讓模式": ("Modality", "減讓模式"),
    "修正後京都公約（Revised Kyoto Convention）": ("Revised Kyoto Convention", "修正後京都公約"),
    "世界關務組織(WCO)": ("World Customs Organization (WCO)", "世界關務組織"),
    "Agreement on Basic Telecommunications Services": ("Agreement on Basic Telecommunications Services", "基本電信服務協定"),
}


def split(term: str) -> tuple[str, str]:
    t = re.sub(r"\s+", " ", term.replace("　", " ")).strip()
    if t in FIXED:
        return FIXED[t]
    toks = t.split(" ")
    i = next((k for k, tok in enumerate(toks) if CJK.search(tok)), len(toks))
    en, zh = " ".join(toks[:i]).strip(), " ".join(toks[i:]).strip()
    # "（TRIPS） 與貿易…" or "countries（LDC）低度開發國家": English bits glued to the Chinese name
    m = re.match(r"^([A-Za-z][^㐀-鿿]*?)([㐀-鿿].*)$", zh)
    if m and ("（" in m.group(1) or "(" in m.group(1) or m.group(1)[0].islower() or m.group(1).startswith("Tariff")):
        en, zh = f"{en} {m.group(1).strip()}", m.group(2)
    m = re.match(r"^[（(]([^）)]+)[）)]\s*(.+)$", zh)
    if m:
        en, zh = f"{en} ({m.group(1)})", m.group(2)
    zh = re.sub(r"\d{4}/\d{1,2}/\d{1,2}$", "", zh).strip()       # stray update dates
    en = en.replace("（", " (").replace("）", ")").replace("  ", " ").strip()
    return en, zh


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def main() -> None:
    rows = list(csv.reader(io.StringIO(SRC.read_bytes().decode("utf-8-sig"))))[1:]
    out, seen = [], set()
    for r in rows:
        if len(r) < 3 or not r[1].strip():
            continue
        en, zh = split(r[1])
        definition = re.sub(r"\s+\n", "\n", r[2].strip())
        key = (en.lower(), zh)
        if key in seen:
            continue
        seen.add(key)
        base = "wto-" + (slug(en) or slug(zh) or str(len(out)))
        tid, n = base, 2
        while any(o["id"] == tid for o in out):
            tid, n = f"{base}-{n}", n + 1
        out.append({"id": tid, "en": en, "zh": zh, "definition": definition})
    out.sort(key=lambda e: e["en"].lower())
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {OUT.name}: {len(out)} entries")


if __name__ == "__main__":
    main()
