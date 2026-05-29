"""Comprehensive country/bloc name → (code, Chinese) map.

- Chinese names use Taiwan (中華民國) conventions.
- Codes are international-common abbreviations (UK not GB) / ISO-2 for countries.
- Covers all ~195 countries plus the WTO RTA name variants
  ("Korea, Republic of", "Moldova, Republic of", ...) and major blocs.

Run `python -m backend.scrapers.country_names` to (re)generate the app's
countries.ts registry from this single source of truth.
"""
from __future__ import annotations

# canonical: code -> (zh, en)
COUNTRIES: dict[str, tuple[str, str]] = {
    "US": ("美國", "United States"), "CN": ("中國", "China"), "JP": ("日本", "Japan"),
    "KR": ("韓國", "South Korea"), "TW": ("中華民國(臺灣)", "Taiwan"), "IN": ("印度", "India"),
    "UK": ("英國", "United Kingdom"), "AU": ("澳洲", "Australia"), "NZ": ("紐西蘭", "New Zealand"),
    "CA": ("加拿大", "Canada"), "MX": ("墨西哥", "Mexico"), "BR": ("巴西", "Brazil"),
    "AR": ("阿根廷", "Argentina"), "CL": ("智利", "Chile"), "PE": ("秘魯", "Peru"),
    "CO": ("哥倫比亞", "Colombia"), "UY": ("烏拉圭", "Uruguay"), "PY": ("巴拉圭", "Paraguay"),
    "EC": ("厄瓜多", "Ecuador"), "BO": ("玻利維亞", "Bolivia"), "VE": ("委內瑞拉", "Venezuela"),
    "SG": ("新加坡", "Singapore"), "MY": ("馬來西亞", "Malaysia"), "TH": ("泰國", "Thailand"),
    "VN": ("越南", "Vietnam"), "ID": ("印尼", "Indonesia"), "PH": ("菲律賓", "Philippines"),
    "BN": ("汶萊", "Brunei"), "KH": ("柬埔寨", "Cambodia"), "LA": ("寮國", "Laos"),
    "MM": ("緬甸", "Myanmar"), "HK": ("香港", "Hong Kong"), "MO": ("澳門", "Macao"),
    "CH": ("瑞士", "Switzerland"), "NO": ("挪威", "Norway"), "IS": ("冰島", "Iceland"),
    "LI": ("列支敦斯登", "Liechtenstein"), "TR": ("土耳其", "Türkiye"), "RU": ("俄羅斯", "Russia"),
    "UA": ("烏克蘭", "Ukraine"), "MD": ("摩爾多瓦", "Moldova"), "GE": ("喬治亞", "Georgia"),
    "AM": ("亞美尼亞", "Armenia"), "AZ": ("亞塞拜然", "Azerbaijan"), "KZ": ("哈薩克", "Kazakhstan"),
    "KG": ("吉爾吉斯", "Kyrgyzstan"), "UZ": ("烏茲別克", "Uzbekistan"), "TJ": ("塔吉克", "Tajikistan"),
    "TM": ("土庫曼", "Turkmenistan"), "IL": ("以色列", "Israel"), "JO": ("約旦", "Jordan"),
    "EG": ("埃及", "Egypt"), "MA": ("摩洛哥", "Morocco"), "TN": ("突尼西亞", "Tunisia"),
    "DZ": ("阿爾及利亞", "Algeria"), "LY": ("利比亞", "Libya"), "LB": ("黎巴嫩", "Lebanon"),
    "SY": ("敘利亞", "Syria"), "IQ": ("伊拉克", "Iraq"), "IR": ("伊朗", "Iran"),
    "SA": ("沙烏地阿拉伯", "Saudi Arabia"), "AE": ("阿聯酋", "United Arab Emirates"),
    "QA": ("卡達", "Qatar"), "KW": ("科威特", "Kuwait"), "BH": ("巴林", "Bahrain"),
    "OM": ("阿曼", "Oman"), "YE": ("葉門", "Yemen"), "ZA": ("南非", "South Africa"),
    "NG": ("奈及利亞", "Nigeria"), "KE": ("肯亞", "Kenya"), "MU": ("模里西斯", "Mauritius"),
    "GH": ("迦納", "Ghana"), "CI": ("象牙海岸", "Côte d'Ivoire"), "SN": ("塞內加爾", "Senegal"),
    "CM": ("喀麥隆", "Cameroon"), "ET": ("衣索比亞", "Ethiopia"), "TZ": ("坦尚尼亞", "Tanzania"),
    "UG": ("烏干達", "Uganda"), "RW": ("盧安達", "Rwanda"), "ZM": ("尚比亞", "Zambia"),
    "ZW": ("辛巴威", "Zimbabwe"), "MZ": ("莫三比克", "Mozambique"), "AO": ("安哥拉", "Angola"),
    "BW": ("波札那", "Botswana"), "NA": ("納米比亞", "Namibia"), "MG": ("馬達加斯加", "Madagascar"),
    "PK": ("巴基斯坦", "Pakistan"), "BD": ("孟加拉", "Bangladesh"), "LK": ("斯里蘭卡", "Sri Lanka"),
    "NP": ("尼泊爾", "Nepal"), "BT": ("不丹", "Bhutan"), "MV": ("馬爾地夫", "Maldives"),
    "AF": ("阿富汗", "Afghanistan"), "MN": ("蒙古", "Mongolia"), "CR": ("哥斯大黎加", "Costa Rica"),
    "PA": ("巴拿馬", "Panama"), "GT": ("瓜地馬拉", "Guatemala"), "HN": ("宏都拉斯", "Honduras"),
    "SV": ("薩爾瓦多", "El Salvador"), "NI": ("尼加拉瓜", "Nicaragua"), "DO": ("多明尼加", "Dominican Republic"),
    "CU": ("古巴", "Cuba"), "JM": ("牙買加", "Jamaica"), "TT": ("千里達及托巴哥", "Trinidad and Tobago"),
    "BB": ("巴貝多", "Barbados"), "BS": ("巴哈馬", "Bahamas"), "BZ": ("貝里斯", "Belize"),
    "GY": ("蓋亞那", "Guyana"), "SR": ("蘇利南", "Suriname"), "HT": ("海地", "Haiti"),
    "DE": ("德國", "Germany"), "FR": ("法國", "France"), "IT": ("義大利", "Italy"),
    "ES": ("西班牙", "Spain"), "NL": ("荷蘭", "Netherlands"), "BE": ("比利時", "Belgium"),
    "LU": ("盧森堡", "Luxembourg"), "PL": ("波蘭", "Poland"), "SE": ("瑞典", "Sweden"),
    "AT": ("奧地利", "Austria"), "DK": ("丹麥", "Denmark"), "FI": ("芬蘭", "Finland"),
    "IE": ("愛爾蘭", "Ireland"), "PT": ("葡萄牙", "Portugal"), "GR": ("希臘", "Greece"),
    "CZ": ("捷克", "Czechia"), "SK": ("斯洛伐克", "Slovakia"), "HU": ("匈牙利", "Hungary"),
    "RO": ("羅馬尼亞", "Romania"), "BG": ("保加利亞", "Bulgaria"), "HR": ("克羅埃西亞", "Croatia"),
    "SI": ("斯洛維尼亞", "Slovenia"), "LT": ("立陶宛", "Lithuania"), "LV": ("拉脫維亞", "Latvia"),
    "EE": ("愛沙尼亞", "Estonia"), "CY": ("賽普勒斯", "Cyprus"), "MT": ("馬爾他", "Malta"),
    "RS": ("塞爾維亞", "Serbia"), "BA": ("波士尼亞與赫塞哥維納", "Bosnia and Herzegovina"),
    "MK": ("北馬其頓", "North Macedonia"), "AL": ("阿爾巴尼亞", "Albania"), "ME": ("蒙特內哥羅", "Montenegro"),
    "XK": ("科索沃", "Kosovo"), "BY": ("白俄羅斯", "Belarus"), "AD": ("安道爾", "Andorra"),
    "SM": ("聖馬利諾", "San Marino"), "FO": ("法羅群島", "Faroe Islands"),
    "PG": ("巴布亞紐幾內亞", "Papua New Guinea"), "FJ": ("斐濟", "Fiji"), "WS": ("薩摩亞", "Samoa"),
    "TO": ("東加", "Tonga"), "VU": ("萬那杜", "Vanuatu"), "SB": ("索羅門群島", "Solomon Islands"),
    "KI": ("吉里巴斯", "Kiribati"), "FM": ("密克羅尼西亞", "Micronesia"),
    "NC": ("新喀里多尼亞", "New Caledonia"), "PF": ("法屬玻里尼西亞", "French Polynesia"),
    "BF": ("布吉納法索", "Burkina Faso"), "ML": ("馬利", "Mali"), "NE": ("尼日", "Niger"),
    "TD": ("查德", "Chad"), "MR": ("茅利塔尼亞", "Mauritania"), "GN": ("幾內亞", "Guinea"),
    "BJ": ("貝南", "Benin"), "TG": ("多哥", "Togo"), "GA": ("加彭", "Gabon"),
    "CG": ("剛果共和國", "Congo"), "CD": ("剛果民主共和國", "DR Congo"), "CF": ("中非共和國", "Central African Republic"),
    "GQ": ("赤道幾內亞", "Equatorial Guinea"), "DJ": ("吉布地", "Djibouti"), "SO": ("索馬利亞", "Somalia"),
    "ER": ("厄利垂亞", "Eritrea"), "SS": ("南蘇丹", "South Sudan"), "SD": ("蘇丹", "Sudan"),
    "MW": ("馬拉威", "Malawi"), "LS": ("賴索托", "Lesotho"), "SZ": ("史瓦帝尼", "Eswatini"),
    "BI": ("蒲隆地", "Burundi"), "KM": ("葛摩", "Comoros"), "CV": ("維德角", "Cabo Verde"),
    "GM": ("甘比亞", "Gambia"), "GW": ("幾內亞比索", "Guinea-Bissau"), "LR": ("賴比瑞亞", "Liberia"),
    "SL": ("獅子山", "Sierra Leone"), "ST": ("聖多美普林西比", "São Tomé and Príncipe"),
    "SC": ("塞席爾", "Seychelles"), "AG": ("安地卡及巴布達", "Antigua and Barbuda"),
    "DM": ("多米尼克", "Dominica"), "GD": ("格瑞那達", "Grenada"), "KN": ("聖克里斯多福及尼維斯", "Saint Kitts and Nevis"),
    "LC": ("聖露西亞", "Saint Lucia"), "VC": ("聖文森及格瑞那丁", "Saint Vincent and the Grenadines"),
    # Blocs / organisations
    "EU": ("歐盟", "European Union"), "EFTA": ("歐洲自由貿易聯盟", "EFTA"),
    "ASEAN": ("東協", "ASEAN"), "GCC": ("海灣合作委員會", "Gulf Cooperation Council"),
    "MERCOSUR": ("南方共同市場", "Mercosur"), "CARICOM": ("加勒比共同體", "CARICOM"),
    "CPTPP": ("CPTPP 成員", "CPTPP Members"), "SACU": ("南部非洲關稅同盟", "SACU"),
    "EAEU": ("歐亞經濟聯盟", "Eurasian Economic Union"), "CACM": ("中美洲共同市場", "Central American Common Market"),
    "CAN": ("安第斯共同體", "Andean Community"), "SADC": ("南部非洲發展共同體", "SADC"),
    "COMESA": ("東南非共同市場", "COMESA"), "EAC": ("東非共同體", "East African Community"),
    "ECOWAS": ("西非國家經濟共同體", "ECOWAS"), "CEMAC": ("中非經濟暨貨幣共同體", "CEMAC"),
    "AFCFTA": ("非洲大陸自由貿易區", "AfCFTA"), "WTO-JSI": ("WTO 成員", "WTO Members"),
}

# WTO RTA name variants → canonical code
ALIASES: dict[str, str] = {
    "united states": "US", "united states of america": "US",
    "china": "CN", "japan": "JP",
    "korea, republic of": "KR", "republic of korea": "KR", "korea": "KR",
    "taiwan": "TW", "separate customs territory of taiwan, penghu, kinmen and matsu": "TW",
    "chinese taipei": "TW", "india": "IN",
    "european union": "EU", "european communities": "EU",
    "efta": "EFTA", "european free trade association": "EFTA",
    "european free trade association (efta)": "EFTA",
    "asean": "ASEAN", "association of southeast asian nations": "ASEAN",
    "association of southeast asian nations (asean)": "ASEAN",
    "united kingdom": "UK", "australia": "AU", "new zealand": "NZ", "canada": "CA",
    "mexico": "MX", "brazil": "BR", "argentina": "AR", "chile": "CL", "peru": "PE",
    "colombia": "CO", "uruguay": "UY", "paraguay": "PY", "ecuador": "EC",
    "bolivia": "BO", "bolivia, plurinational state of": "BO", "plurinational state of bolivia": "BO",
    "venezuela": "VE", "venezuela, bolivarian republic of": "VE",
    "singapore": "SG", "malaysia": "MY", "thailand": "TH",
    "viet nam": "VN", "vietnam": "VN", "indonesia": "ID", "philippines": "PH",
    "brunei darussalam": "BN", "brunei": "BN", "cambodia": "KH",
    "lao people's democratic republic": "LA", "laos": "LA", "myanmar": "MM",
    "hong kong, china": "HK", "macao, china": "MO", "switzerland": "CH",
    "norway": "NO", "iceland": "IS", "liechtenstein": "LI",
    "turkey": "TR", "türkiye": "TR", "russian federation": "RU", "russia": "RU",
    "ukraine": "UA", "moldova, republic of": "MD", "moldova": "MD", "republic of moldova": "MD",
    "georgia": "GE", "armenia": "AM", "azerbaijan": "AZ", "kazakhstan": "KZ",
    "kyrgyz republic": "KG", "kyrgyzstan": "KG", "uzbekistan": "UZ", "tajikistan": "TJ",
    "turkmenistan": "TM", "israel": "IL", "jordan": "JO", "egypt": "EG", "morocco": "MA",
    "tunisia": "TN", "algeria": "DZ", "lebanese republic": "LB", "lebanon": "LB",
    "syrian arab republic": "SY", "iraq": "IQ", "iran": "IR",
    "saudi arabia": "SA", "kingdom of saudi arabia": "SA",
    "united arab emirates": "AE", "qatar": "QA", "kuwait": "KW", "bahrain": "BH",
    "oman": "OM", "yemen": "YE",
    "gulf cooperation council (gcc)": "GCC", "gulf cooperation council": "GCC",
    "the gulf cooperation council (gcc)": "GCC",
    "south africa": "ZA", "nigeria": "NG", "kenya": "KE", "mauritius": "MU",
    "ghana": "GH", "côte d'ivoire": "CI", "cote d'ivoire": "CI", "ivory coast": "CI",
    "senegal": "SN", "cameroon": "CM", "ethiopia": "ET",
    "tanzania": "TZ", "tanzania, united republic of": "TZ", "united republic of tanzania": "TZ",
    "uganda": "UG", "rwanda": "RW", "zambia": "ZM", "zimbabwe": "ZW", "mozambique": "MZ",
    "angola": "AO", "botswana": "BW", "namibia": "NA", "madagascar": "MG",
    "pakistan": "PK", "bangladesh": "BD", "sri lanka": "LK", "nepal": "NP",
    "bhutan": "BT", "maldives": "MV", "afghanistan": "AF", "mongolia": "MN",
    "costa rica": "CR", "panama": "PA", "guatemala": "GT", "honduras": "HN",
    "el salvador": "SV", "nicaragua": "NI", "dominican republic": "DO", "cuba": "CU",
    "jamaica": "JM", "trinidad and tobago": "TT", "barbados": "BB", "bahamas": "BS",
    "belize": "BZ", "guyana": "GY", "suriname": "SR", "haiti": "HT",
    "germany": "DE", "france": "FR", "italy": "IT", "spain": "ES", "netherlands": "NL",
    "belgium": "BE", "luxembourg": "LU", "poland": "PL", "sweden": "SE", "austria": "AT",
    "denmark": "DK", "finland": "FI", "ireland": "IE", "portugal": "PT", "greece": "GR",
    "czech republic": "CZ", "czechia": "CZ", "slovak republic": "SK", "slovakia": "SK",
    "hungary": "HU", "romania": "RO", "bulgaria": "BG", "croatia": "HR", "slovenia": "SI",
    "lithuania": "LT", "latvia": "LV", "estonia": "EE", "cyprus": "CY", "malta": "MT",
    "serbia": "RS", "bosnia and herzegovina": "BA", "north macedonia": "MK",
    "the former yugoslav republic of macedonia": "MK", "albania": "AL", "montenegro": "ME",
    "kosovo": "XK", "belarus": "BY", "andorra": "AD", "san marino": "SM", "faroe islands": "FO",
    "papua new guinea": "PG", "fiji": "FJ", "samoa": "WS", "tonga": "TO", "vanuatu": "VU",
    "solomon islands": "SB", "kiribati": "KI",
    "burkina faso": "BF", "mali": "ML", "niger": "NE", "chad": "TD", "mauritania": "MR",
    "guinea": "GN", "benin": "BJ", "togo": "TG", "gabon": "GA",
    "congo": "CG", "democratic republic of the congo": "CD", "central african republic": "CF",
    "equatorial guinea": "GQ", "djibouti": "DJ", "somalia": "SO", "eritrea": "ER",
    "south sudan": "SS", "sudan": "SD", "malawi": "MW", "lesotho": "LS",
    "eswatini": "SZ", "swaziland": "SZ", "burundi": "BI", "comoros": "KM",
    "cabo verde": "CV", "cape verde": "CV", "gambia": "GM", "guinea-bissau": "GW",
    "liberia": "LR", "sierra leone": "SL", "seychelles": "SC",
    "antigua and barbuda": "AG", "dominica": "DM", "grenada": "GD",
    "saint kitts and nevis": "KN", "saint lucia": "LC",
    "saint vincent and the grenadines": "VC",
    "southern african customs union (sacu)": "SACU", "sacu": "SACU",
    "central american common market (cacm)": "CACM",
    "andean community": "CAN", "mercosur": "MERCOSUR",
    "southern common market (mercosur)": "MERCOSUR", "caricom": "CARICOM",
}


def normalize_party(name: str) -> tuple[str, str, str]:
    """Return (code, en_name, zh_name) for a party name string."""
    en = name.strip()
    key = en.lower().strip()
    code = ALIASES.get(key)
    if code and code in COUNTRIES:
        zh, en_canon = COUNTRIES[code]
        return code, en_canon, zh
    if en.upper() in COUNTRIES:  # already a code
        zh, en_canon = COUNTRIES[en.upper()]
        return en.upper(), en_canon, zh
    return en, en, en  # unknown: english fallback


def _gen_countries_ts() -> str:
    """Emit the app's countries.ts from this single source of truth."""
    # zh aliases (Taiwan variants for a few key ones)
    extra = {
        "TW": ["台灣", "臺灣", "中華民國", "Chinese Taipei", "台", "臺"],
        "UK": ["GB", "Britain", "Great Britain", "英"],
        "US": ["USA", "America", "美"],
        "CN": ["PRC", "中"], "KR": ["South Korea", "南韓", "韓"], "JP": ["日"],
        "HK": ["港"], "SG": ["星"],
    }
    lines = []
    for code, (zh, en) in COUNTRIES.items():
        al = [zh, en, code] + extra.get(code, [])
        al = sorted(set(al))
        al_str = ", ".join('"' + a.replace('"', '\\"') + '"' for a in al)
        lines.append(f'  {{ code: "{code}", zh: "{zh}", en: "{en.replace(chr(34), chr(92)+chr(34))}", aliases: [{al_str}] }},')
    body = "\n".join(lines)
    return (
        "// AUTO-GENERATED from backend/scrapers/country_names.py — do not edit by hand.\n"
        "export interface Country { code: string; zh: string; en: string; aliases: string[]; }\n\n"
        "export const COUNTRIES: Country[] = [\n" + body + "\n];\n\n"
        "const BY_CODE = new Map(COUNTRIES.map(c => [c.code, c]));\n"
        "export function countryByCode(code: string): Country | undefined { return BY_CODE.get(code); }\n"
        "export function countryDisplay(code: string, fallback?: string): string { return BY_CODE.get(code)?.zh ?? fallback ?? code; }\n"
        "export function countryMatchesQuery(code: string, query: string): boolean {\n"
        "  const q = query.trim().toLowerCase();\n"
        "  if (!q) return true;\n"
        "  const c = BY_CODE.get(code);\n"
        "  if (!c) return code.toLowerCase().includes(q);\n"
        "  if (c.code.toLowerCase().includes(q)) return true;\n"
        "  if (c.zh.includes(query)) return true;\n"
        "  if (c.en.toLowerCase().includes(q)) return true;\n"
        "  return c.aliases.some(a => a.toLowerCase().includes(q) || a.includes(query));\n"
        "}\n"
    )


if __name__ == "__main__":
    import pathlib
    out = pathlib.Path(__file__).resolve().parents[2] / "trade-tracker-mobile" / "src" / "data" / "countries.ts"
    out.write_text(_gen_countries_ts(), encoding="utf-8")
    print("wrote", out, f"({len(COUNTRIES)} countries)")
