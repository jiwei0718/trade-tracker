"""Parse WTO RTA-IS agreement names into parties and a Chinese name.

WTO names mix several patterns:
    "Slovak Republic - Romania Free Trade Agreement"         parties + suffix
    "EC - Egypt Interim Agreement of 1977"                    EC = European Communities (not Ecuador)
    "EFTA - Central America - Accession of Guatemala"         accession
    "Colombia - Northern Triangle (El Salvador, Guatemala, Honduras)"   member list
    "Chile - Costa Rica (Chile - Central America)"            redundant context in parentheses
    "EC (25) Enlargement", "ASEAN Free Trade Area (AFTA)"     whole-name agreements

parse(name) returns (codes, english_names, chinese_names, name_zh). Unknown pieces keep
their English text, so nothing is lost; add them to the tables below.
"""
from __future__ import annotations

import re

from .country_names import ALIASES, COUNTRIES

# Blocs, groupings and historic states that appear as parties: lower-case name → (code, zh)
PARTIES: dict[str, tuple[str, str]] = {
    "ec": ("EU", "歐洲共同體"), "eec": ("EU", "歐洲經濟共同體"),
    "european communities": ("EU", "歐洲共同體"), "european community": ("EU", "歐洲共同體"),
    "eu": ("EU", "歐盟"), "european union": ("EU", "歐盟"),
    "efta": ("EFTA", "歐洲自由貿易聯盟"), "asean": ("ASEAN", "東協"),
    "apta": ("APTA", "亞太貿易協定"), "cacm": ("CACM", "中美洲共同市場"),
    "comesa": ("COMESA", "東南非共同市場"), "cptpp": ("CPTPP", "跨太平洋夥伴全面進步協定"),
    "eac": ("EAC", "東非共同體"), "eastern african community (eac)": ("EAC", "東非共同體"),
    "eaeu": ("EAEU", "歐亞經濟聯盟"), "eurasian economic union (eaeu)": ("EAEU", "歐亞經濟聯盟"),
    "laia": ("LAIA", "拉丁美洲整合協會"), "sadc": ("SADC", "南部非洲發展共同體"),
    "safta": ("SAFTA", "南亞自由貿易協定"), "sacu": ("SACU", "南部非洲關稅同盟"),
    "gcc": ("GCC", "海灣合作委員會"), "mercosur": ("MERCOSUR", "南方共同市場"),
    "central european free trade agreement (cefta)": ("CEFTA", "中歐自由貿易協定"),
    "pacific alliance": ("PACIFIC-ALLIANCE", "太平洋聯盟"),
    "central america": ("CENTRAL-AMERICA", "中美洲"),
    "northern triangle": ("NORTHERN-TRIANGLE", "北三角"),
    "pacific states": ("PACIFIC-STATES", "太平洋國家"),
    "cariforum states": ("CARIFORUM", "加勒比論壇國家"),
    "eastern and southern africa states": ("ESA", "東部與南部非洲國家"),
    "west africa": ("WEST-AFRICA", "西非"),
    "overseas countries and territories": ("OCT", "海外國家與領地"),
    "overseas countries and territories 1": ("OCT", "海外國家與領地"),
    "equatorial customs union": ("UDE", "赤道關稅同盟"),
    "serbia and montenegro": ("CS", "塞爾維亞與蒙特內哥羅"),
    "palestine": ("PS", "巴勒斯坦"),
    "czechoslovakia": ("CSK", "捷克斯洛伐克"),
    "czech and slovak federal republic": ("CSK", "捷克斯洛伐克聯邦"),
    "german democratic republic": ("DDR", "東德"),
    "yugoslavia, socialist federal republic of": ("YU", "南斯拉夫"),
    "upper volta": ("BF", "上伏塔(今布吉納法索)"),
    "southern rhodesia": ("ZW", "南羅德西亞(今辛巴威)"),
    "us": ("US", "美國"), "syria": ("SY", "敘利亞"), "cefta": ("CEFTA", "中歐自由貿易協定"),
}

# Agreements whose name is not a list of parties: English name → (Chinese name, party codes)
WHOLE: dict[str, tuple[str, list[str]]] = {
    "ASEAN Free Trade Area (AFTA)": ("東協自由貿易區 (AFTA)", ["ASEAN"]),
    "ASEAN Free Trade Area (AFTA) - Inactive": ("東協自由貿易區 (AFTA)(舊版)", ["ASEAN"]),
    "ASEAN Trade in Services Agreement (ATISA)": ("東協服務貿易協定 (ATISA)", ["ASEAN"]),
    "African Common Market": ("非洲共同市場", ["African Common Market"]),
    "African Continental Free Trade Area (AfCFTA)": ("非洲大陸自由貿易區 (AfCFTA)", ["AfCFTA"]),
    "Agadir Agreement": ("阿加迪爾協定(埃及、約旦、摩洛哥、突尼西亞)", ["EG", "JO", "MA", "TN"]),
    "Andean Community (CAN)": ("安地斯共同體 (CAN)", ["CAN"]),
    "Arab Common Market": ("阿拉伯共同市場", ["Arab Common Market"]),
    "Arusha  Agreement": ("阿魯沙協定", ["Arusha Agreement"]),
    "Asia Pacific Trade Agreement (APTA)": ("亞太貿易協定 (APTA)", ["APTA"]),
    "Australia - New Zealand Closer Economic Relations Trade Agreement (ANZCERTA)":
        ("澳紐更緊密經濟關係貿易協定 (ANZCERTA)", ["AU", "NZ"]),
    "Bay of Bengal Initiative on Multi-Sectoral Technical and Economic Cooperation (BIMSTEC)":
        ("孟加拉灣多領域技術及經濟合作倡議 (BIMSTEC)", ["BIMSTEC"]),
    "Borneo Free Trade Area": ("婆羅洲自由貿易區", ["Borneo Free Trade Area"]),
    "Canada - US Free Trade Agreement (CUSFTA)": ("加拿大–美國自由貿易協定 (CUSFTA)", ["CA", "US"]),
    "Caribbean Community and Common Market (CARICOM)": ("加勒比共同體與共同市場 (CARICOM)", ["CARICOM"]),
    "Caribbean Free Trade Association (CARIFTA)": ("加勒比自由貿易協會 (CARIFTA)", ["CARIFTA"]),
    "Central American Free Trade Area": ("中美洲自由貿易區", ["CENTRAL-AMERICA"]),
    "Central European Free Trade Agreement (CEFTA)": ("中歐自由貿易協定 (CEFTA)", ["CEFTA"]),
    "Central American Common Market (CACM)": ("中美洲共同市場 (CACM)", ["CACM"]),
    "Southern Common Market (MERCOSUR)": ("南方共同市場 (MERCOSUR)", ["MERCOSUR"]),
    "Central European Free Trade Agreement (CEFTA) 2006": ("中歐自由貿易協定 (CEFTA 2006)", ["CEFTA"]),
    "Common Economic Zone (CEZ)": ("共同經濟區 (CEZ)", ["CEZ"]),
    "Common Market for Eastern and Southern Africa (COMESA)": ("東南非共同市場 (COMESA)", ["COMESA"]),
    "Commonwealth of Independent States (CIS)": ("獨立國家國協 (CIS)", ["CIS"]),
    "Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP)":
        ("跨太平洋夥伴全面進步協定 (CPTPP)", ["CPTPP"]),
    "Dominican Republic - Central America - United States Free Trade Agreement (CAFTA-DR)":
        ("多明尼加–中美洲–美國自由貿易協定 (CAFTA-DR)", ["DO", "CENTRAL-AMERICA", "US"]),
    "EC – Overseas Countries and Territories 1 (OCT)": ("歐洲共同體–海外國家與領地 (OCT)", ["EU", "OCT"]),
    "EU – Overseas Countries and Territories (OCT)": ("歐盟–海外國家與領地 (OCT)", ["EU", "OCT"]),
    "EU - US TTIP": ("歐盟–美國跨大西洋貿易與投資夥伴協定 (TTIP)", ["EU", "US"]),
    "EU Treaty": ("歐盟條約", ["EU"]),
    "East African Community (EAC)": ("東非共同體 (EAC)", ["EAC"]),
    "Economic Community of West African States (ECOWAS)": ("西非國家經濟共同體 (ECOWAS)", ["ECOWAS"]),
    "Economic Cooperation Organization (ECO)": ("經濟合作組織 (ECO)", ["ECO"]),
    "Economic and Monetary Community of Central Africa (CEMAC)": ("中非經濟暨貨幣共同體 (CEMAC)", ["CEMAC"]),
    "Eurasian Economic Community (EAEC)": ("歐亞經濟共同體 (EAEC)", ["EAEC"]),
    "Eurasian Economic Union (EAEU)": ("歐亞經濟聯盟 (EAEU)", ["EAEU"]),
    "European Economic Area (EEA)": ("歐洲經濟區 (EEA)", ["EU", "IS", "LI", "NO"]),
    "Finland-European Free Trade Association (FINEFTA)": ("芬蘭–歐洲自由貿易聯盟 (FINEFTA)", ["FI", "EFTA"]),
    "First Convention of Lomé": ("第一次洛美公約", ["EU", "ACP"]),
    "Second Convention of Lomé": ("第二次洛美公約", ["EU", "ACP"]),
    "Third Convention of Lomé": ("第三次洛美公約", ["EU", "ACP"]),
    "GUAM": ("古阿姆集團 (GUAM)", ["GE", "UA", "AZ", "MD"]),
    "Global System of Trade Preferences among Developing Countries (GSTP)":
        ("開發中國家全球貿易優惠制度 (GSTP)", ["GSTP"]),
    "Gulf Cooperation Council (GCC)": ("海灣合作委員會 (GCC)", ["GCC"]),
    "Gulf Cooperation Council (GCC) [inactive]": ("海灣合作委員會 (GCC)(舊版)", ["GCC"]),
    "Latin American Free Trade Association (LAFTA)": ("拉丁美洲自由貿易協會 (LAFTA)", ["LAFTA"]),
    "Latin American Integration Association (LAIA)": ("拉丁美洲整合協會 (LAIA)", ["LAIA"]),
    "Melanesian Spearhead Group (MSG)": ("美拉尼西亞先鋒集團 (MSG)", ["MSG"]),
    "North American Free Trade Agreement (NAFTA)": ("北美自由貿易協定 (NAFTA)", ["US", "CA", "MX"]),
    "Pacific Agreement on Closer Economic Relations Plus (PACER Plus)":
        ("太平洋更緊密經濟關係協定 (PACER Plus)", ["PACER Plus"]),
    "Pacific Alliance": ("太平洋聯盟", ["CL", "CO", "MX", "PE"]),
    "Pacific Island Countries Trade Agreement (PICTA)": ("太平洋島國貿易協定 (PICTA)", ["PICTA"]),
    "Pan-Arab Free Trade Area (PAFTA)": ("大阿拉伯自由貿易區 (PAFTA)", ["PAFTA"]),
    "Protocol on Trade Negotiations (PTN)": ("貿易談判議定書 (PTN)", ["PTN"]),
    "South Asian Free Trade Agreement (SAFTA)": ("南亞自由貿易協定 (SAFTA)", ["SAFTA"]),
    "South Asian Preferential Trade Arrangement (SAPTA)": ("南亞優惠貿易安排 (SAPTA)", ["SAPTA"]),
    "Southern African Development Community (SADC)": ("南部非洲發展共同體 (SADC)", ["SADC"]),
    "Southern African Customs Union (SACU)": ("南部非洲關稅同盟 (SACU)", ["SACU"]),
    "The Cross-Straits Economic Cooperation Framework Agreement (ECFA)":
        ("海峽兩岸經濟合作架構協議 (ECFA)", ["CN", "TW"]),
    "Trade in Services Agreement between Armenia, Belarus, Kazakhstan, the Kyrgyz Republic, "
    "the Russian Federation, Tajikistan and Uzbekistan":
        ("亞美尼亞等七國服務貿易協定", ["AM", "BY", "KZ", "KG", "RU", "TJ", "UZ"]),
    "Trans-Pacific Strategic Economic Partnership": ("跨太平洋策略性經濟夥伴協定 (P4)", ["BN", "CL", "NZ", "SG"]),
    "Treaty on a Free Trade Area between members of the Commonwealth of Independent States (CIS)":
        ("獨立國家國協自由貿易區條約", ["CIS"]),
    "Tripartite Agreement": ("三方協定(埃及、印度、南斯拉夫)", ["EG", "IN", "YU"]),
    "United States-Mexico-Canada Agreement (USMCA/CUSMA/T-MEC)": ("美墨加協定 (USMCA)", ["US", "MX", "CA"]),
    "West African Economic and Monetary Union (WAEMU)": ("西非經濟暨貨幣聯盟 (WAEMU)", ["WAEMU"]),
    "Yaoundé I": ("第一次雅溫得公約", ["EU", "AASM"]),
    "Yaoundé II": ("第二次雅溫得公約", ["EU", "AASM"]),
}

# Trailing descriptions: English → Chinese. Longest first; "{y}" is a year.
SUFFIXES: list[tuple[str, str]] = [
    (r"Deep and Comprehensive Free Trade Area", "深度與全面自由貿易區"),
    (r"Closer Economic Relations Trade Agreement", "更緊密經濟關係貿易協定"),
    (r"Free[- ]Trade Agreement", "自由貿易協定"),
    (r"Free Trade Area", "自由貿易區"),
    (r"Interim Agreement of (\d{4})", "臨時協定({0})"),
    (r"Interim Agreement", "臨時協定"),
    (r"Association Agreement of (\d{4})", "聯繫協定({0})"),
    (r"Association Agreement", "聯繫協定"),
    (r"Association", "聯繫協定"),
    (r"Cooperation Agreement", "合作協定"),
    (r"Europe Agreement", "歐洲協定"),
    (r"Additional Protocol", "附加議定書"),
    (r"Trade Agreement", "貿易協定"),
    (r"Customs Union", "關稅同盟"),
    (r"Agreement of (\d{4})", "協定({0})"),
    (r"Agreement", "協定"),
    (r"Protocol", "議定書"),
    (r"EPA", "經濟夥伴協定"),
]
_SUFFIX_RES = [(re.compile(rf"^(?P<head>.+?)\s+{pat}$"), zh) for pat, zh in SUFFIXES]

ACRONYM = re.compile(r"\s*\(([A-Za-z0-9/\-]+(?: Plus)?)\)$")   # "(PATCRA)", "(CAFTA-DR)", "(PACER Plus)"
LONG_WITH_ACRONYM = re.compile(r"[A-Z][A-Za-z ]+? \(([A-Z]{2,})\)")   # "Eastern African Community (EAC)"
ENLARGEMENT = re.compile(r"^(EC|EU) \((\d+)\) Enlargement$")


def lookup(name: str) -> tuple[str, str, str] | None:
    """(code, en, zh) for a single party name, or None."""
    key = re.sub(r"\s+", " ", name).strip().lower()
    if key in PARTIES:
        code, zh = PARTIES[key]
        return code, name.strip(), zh
    code = ALIASES.get(key)
    if code and code in COUNTRIES:
        zh, en = COUNTRIES[code]
        return code, en, zh
    return None


def lookup_many(text: str) -> list[tuple[str, str, str]] | None:
    """A party, or a list like "Colombia, Ecuador and Peru" / "Russian Federation / Belarus"."""
    one = lookup(text)
    if one:
        return [one]
    pieces = [p for p in re.split(r"\s*/\s*|,\s*|\s+and\s+", text) if p.strip()]
    if len(pieces) > 1:
        found = [lookup(p) for p in pieces]
        if all(found):
            return found  # type: ignore[return-value]
    return None


def parse(name: str) -> tuple[list[str], list[str], list[str], str]:
    raw = re.sub(r"\s+", " ", name).strip()
    if name in WHOLE or raw in WHOLE:
        zh, codes = WHOLE.get(name) or WHOLE[raw]
        ens, zhs = [], []
        for c in codes:
            if c in COUNTRIES:
                zhs.append(COUNTRIES[c][0]); ens.append(COUNTRIES[c][1])
            else:
                hit = next((v for v in PARTIES.values() if v[0] == c), None)
                zhs.append(hit[1] if hit else c); ens.append(c)
        return codes, ens, zhs, zh

    m = ENLARGEMENT.match(raw)
    if m:
        who = "歐洲共同體" if m.group(1) == "EC" else "歐盟"
        return ["EU"], [m.group(0)], [who], f"{who}擴大({m.group(2)} 國)"

    text, tail = raw, ""
    if re.search(r"\s*-\s*Inactive$|\s*\[inactive\]$", text, re.I):
        text, tail = re.sub(r"\s*-\s*Inactive$|\s*\[inactive\]$", "", text, flags=re.I), "(舊版)"
    # "Long Name (ACR)" for a known bloc → just "ACR"
    for m in list(LONG_WITH_ACRONYM.finditer(text)):
        if lookup(m.group(1)):
            text = text.replace(m.group(0), m.group(1))
    text = re.sub(r",\s+Interim Agreement$", " Interim Agreement", text)
    acronym = ""
    m = ACRONYM.search(text)
    if m and sum(ch.isupper() for ch in m.group(1)) >= 2:
        acronym, text = f" ({m.group(1)})", text[:m.start()]

    # Parentheses: member lists are kept, repeated context ("(Chile - Central America)") is dropped.
    members: list[tuple[str, str, str]] = []
    paren_zh = ""
    m = re.search(r"\s*\(([^()]*)\)", text)
    if m:
        inner = m.group(1)
        text = (text[:m.start()] + text[m.end():]).strip()
        if inner in ("Interim Agreement", "Association Agreement"):
            text = f"{text} {inner}"
        elif " - " not in inner:
            found = lookup_many(inner)
            if found:
                members = found
                paren_zh = "(" + "、".join(f[2] for f in found) + ")"

    parts = [p.strip() for p in re.split(r"\s+-\s+|\s+–\s+", text) if p.strip()]
    suffix_zh = ""
    if parts:
        last = parts[-1]
        if not lookup_many(last):
            for rx, zh in _SUFFIX_RES:
                m = rx.match(last)
                if m and lookup_many(m.group("head")):
                    parts[-1] = m.group("head")
                    suffix_zh = zh.format(*m.groups()[1:]) if m.groups()[1:] else zh
                    break

    codes, ens, zhs, labels = [], [], [], []
    for p in parts:
        acc = re.match(r"^Accession of\s+(?:the\s+)?(.+)$", p, re.I)
        target = acc.group(1) if acc else p
        found = lookup_many(target)
        if found:
            label = "、".join(f[2] for f in found) + ("加入" if acc else "")
            for f in found:
                if f[0] not in codes:
                    codes.append(f[0]); ens.append(f[1]); zhs.append(f[2])
        else:
            label = p
            if p not in codes:
                codes.append(p); ens.append(p); zhs.append(p)
        labels.append(label)
    if members:
        labels[-1] += paren_zh
        for f in members:
            if f[0] not in codes:
                codes.append(f[0]); ens.append(f[1]); zhs.append(f[2])

    name_zh = "–".join(labels) + suffix_zh + acronym + tail
    return codes, ens, zhs, name_zh
