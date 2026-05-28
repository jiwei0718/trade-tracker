import { ScrollView, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface Entry {
  zh: string;
  en: string;
  note: string;
  examples?: string[];
}

// 文書類型 (Document types)
const DOC_TYPES: Entry[] = [
  {
    zh: '條約',
    en: 'Treaty',
    note: '國家間最正式、最具拘束力的法律文件，通常需立法機關批准。',
    examples: ['羅馬條約 (Treaty of Rome)', '馬斯垂克條約 (Treaty of Maastricht)', '亞松森條約 (Treaty of Asunción) — Mercosur'],
  },
  {
    zh: '公約 / 盟約',
    en: 'Convention / Covenant',
    note: '多邊性、訂立國際規範的條約。Convention 多用於專業議題（如海運、智財）；Covenant 多用於人權。',
    examples: ['維也納條約法公約 (Vienna Convention on the Law of Treaties)', '國際勞工組織公約 (ILO Conventions)'],
  },
  {
    zh: '協定',
    en: 'Agreement',
    note: '本應用程式最常見的類型。涵蓋雙邊與多邊貿易協定，正式程度低於 Treaty 但仍具法律拘束力。',
    examples: ['北美自由貿易協定 (NAFTA)', '歐盟–日本經濟夥伴關係協定 (EU–Japan EPA)'],
  },
  {
    zh: '協議',
    en: 'Arrangement',
    note: '較不正式、技術性、行政性的安排，常不具完整法律拘束力。',
    examples: ['行政協議 (Administrative Arrangement)', '雙邊清算協議 (Bilateral Clearing Arrangement)'],
  },
  {
    zh: '備忘錄',
    en: 'Memorandum of Understanding (MOU)',
    note: '雙方意向書，記錄合作意願與框架，通常不具法律拘束力。',
    examples: ['台美貿易倡議備忘錄 (US–Taiwan Trade Initiative MOU)'],
  },
  {
    zh: '聯合聲明',
    en: 'Joint Declaration',
    note: '雙方共同發布的政治性聲明，宣示立場或承諾方向。',
    examples: ['中英聯合聲明 (Sino-British Joint Declaration)'],
  },
  {
    zh: '先導計畫',
    en: 'Pilot Project',
    note: '正式協定前的試行性計畫，測試可行性。',
    examples: ['數位貿易先導計畫 (Digital Trade Pilot Project)'],
  },
];

// 協定相關專有名詞 (Trade-specific terminology)
const TRADE_TERMS: Entry[] = [
  {
    zh: '自由貿易協定',
    en: 'Free Trade Agreement, FTA',
    note: '消除締約方間多數商品關稅與貿易壁壘的協定。',
  },
  {
    zh: '經濟夥伴協定',
    en: 'Economic Partnership Agreement, EPA',
    note: '範圍比 FTA 廣，涵蓋投資、服務、政府採購、永續發展等。',
  },
  {
    zh: '全面經濟夥伴協定',
    en: 'Comprehensive Economic Partnership Agreement, CEPA',
    note: '更全面的 EPA，常見於印度與亞洲國家之間。',
  },
  {
    zh: '優惠貿易協定',
    en: 'Preferential Trade Agreement, PTA',
    note: '提供部分商品優惠關稅，但未達 FTA 的全面性。',
  },
  {
    zh: '關稅同盟',
    en: 'Customs Union',
    note: '成員間消除關稅 + 採共同對外關稅。例：歐盟–土耳其關稅同盟。',
  },
  {
    zh: '共同市場',
    en: 'Common Market',
    note: '在關稅同盟基礎上加入勞動力、資本自由流動。例：南方共同市場 (Mercosur)、歐洲單一市場。',
  },
  {
    zh: '聯繫協定',
    en: 'Association Agreement',
    note: '歐盟與第三國建立特殊政治經濟關係的協定。例：EU–Mercosur Association Agreement。',
  },
  {
    zh: '最惠國待遇',
    en: 'Most-Favoured-Nation, MFN',
    note: 'WTO 核心原則之一：對任一成員的優惠須無差別地給予所有成員。',
  },
  {
    zh: '國民待遇',
    en: 'National Treatment',
    note: '進口商品進入市場後須與本國商品同等待遇。',
  },
  {
    zh: '原產地規則',
    en: 'Rules of Origin',
    note: '判定商品是否享有 FTA 優惠的標準。',
  },
  {
    zh: '反傾銷',
    en: 'Anti-Dumping',
    note: '針對以低於正常價格出口的商品所採取的關稅措施。',
  },
  {
    zh: '保障措施',
    en: 'Safeguard Measures',
    note: '進口激增傷害國內產業時可暫時限制進口的措施。',
  },
  {
    zh: '爭端解決',
    en: 'Dispute Settlement',
    note: 'WTO 與多數 FTA 中處理會員間貿易糾紛的程序。',
  },
  {
    zh: '投資人對地主國爭端解決機制',
    en: 'Investor-State Dispute Settlement, ISDS',
    note: '允許投資人對地主國政府直接提起國際仲裁的機制。',
  },
];

// 重要機構 (Major institutions)
const INSTITUTIONS: Entry[] = [
  { zh: '世界貿易組織',          en: 'World Trade Organization, WTO',                            note: '主導全球多邊貿易規則的常設組織，1995年取代 GATT。' },
  { zh: '關稅暨貿易總協定',      en: 'General Agreement on Tariffs and Trade, GATT',             note: 'WTO 的前身，1947–1994 主導多邊貿易自由化。' },
  { zh: '歐洲經濟共同體',        en: 'European Economic Community, EEC',                          note: '1957–1993 歐洲統合的雛形，後併入歐盟。' },
  { zh: '歐洲自由貿易聯盟',      en: 'European Free Trade Association, EFTA',                     note: '瑞士、挪威、冰島、列支敦斯登。歐盟之外的歐洲貿易區。' },
  { zh: '東南亞國家協會',        en: 'Association of Southeast Asian Nations, ASEAN',             note: '10 個東南亞國家組成的政治經濟組織。' },
  { zh: '南方共同市場',          en: 'Southern Common Market, Mercosur / Mercosul',               note: '巴西、阿根廷、烏拉圭、巴拉圭組成的南美共同市場。' },
  { zh: '海灣合作委員會',        en: 'Gulf Cooperation Council, GCC',                             note: '沙烏地、阿聯酋、卡達、科威特、巴林、阿曼。' },
  { zh: '跨太平洋夥伴全面進步協定', en: 'CPTPP',                                                  note: '原 TPP 美國退出後由其他11國重組而成。' },
  { zh: '區域全面經濟夥伴關係協定', en: 'Regional Comprehensive Economic Partnership, RCEP',     note: '中、日、韓、澳、紐、東協15國的大型協定。' },
];

export default function Glossary() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, gap: 18 }}>
      <Text style={[styles.intro, { color: c.text }]}>
        本應用使用的中文用語對照。半形括號 (...) 內為原文。
      </Text>

      <Section title="文書類型 (Document Types)" sub="從拘束力最強到最弱排列" entries={DOC_TYPES} c={c} />
      <Section title="貿易協定專有名詞 (Trade Terminology)" entries={TRADE_TERMS} c={c} />
      <Section title="重要機構 (Major Institutions)" entries={INSTITUTIONS} c={c} />

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function Section({ title, sub, entries, c }: { title: string; sub?: string; entries: Entry[]; c: any }) {
  return (
    <View style={{ gap: 8 }}>
      <View>
        <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
        {sub && <Text style={[styles.sectionSub, { color: c.textSecondary }]}>{sub}</Text>}
      </View>
      <View style={{ gap: 8 }}>
        {entries.map((e, i) => (
          <View key={i} style={[styles.card, { backgroundColor: c.backgroundElement }]}>
            <View style={styles.cardHead}>
              <Text style={[styles.zh, { color: c.text }]}>{e.zh}</Text>
              <Text style={[styles.en, { color: c.textSecondary }]}>({e.en})</Text>
            </View>
            <Text style={[styles.note, { color: c.text }]}>{e.note}</Text>
            {e.examples && e.examples.length > 0 && (
              <View style={{ marginTop: 4 }}>
                {e.examples.map((ex, j) => (
                  <Text key={j} style={[styles.example, { color: c.textSecondary }]}>· {ex}</Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 13, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  sectionSub: { fontSize: 11, marginTop: 2 },
  card: { padding: 12, borderRadius: 10, gap: 4 },
  cardHead: { flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' },
  zh: { fontSize: 15, fontWeight: '800' },
  en: { fontSize: 12 },
  note: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  example: { fontSize: 11, lineHeight: 16 },
});
