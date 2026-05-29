import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const DOMAINS = [
  { code: 'A', name: '促進電子商務', en: 'Facilitating Electronic Commerce', issues: 7 },
  { code: 'B', name: '開放性與電子商務', en: 'Openness and Electronic Commerce', issues: 5 },
  { code: 'C', name: '信任與電子商務', en: 'Trust and Electronic Commerce', issues: 6 },
  { code: 'D', name: '跨境資料流動與資料在地化', en: 'Cross-Border Data Flows and Data Localisation', issues: 2 },
  { code: 'E', name: '廣義數位經濟議題', en: 'Broader Digital Economy Issues', issues: 8 },
];

export default function IndigoMethodology() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={[styles.hero, { backgroundColor: '#2563eb15', borderColor: '#2563eb40' }]}>
        <Text style={[styles.title, { color: c.text }]}>INDIGO 數位貿易整合與開放指數</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>
          OECD Index of Digital Trade Integration and Openness
        </Text>
      </View>

      <Section c={c} title="這是什麼">
        OECD 貿易委員會於 2025 年 9 月正式發布的指數，系統性衡量各國在數位貿易國際規範承諾的廣度與深度，涵蓋 2000–2024 年、193 個國家。分為貿易脈絡（INDIGO-t）與非貿易脈絡（INDIGO-i）兩種。指數範圍 0 至 1，數值越高代表承諾越深、覆蓋越廣。
      </Section>

      <Section c={c} title="⚠️ 重要說明：本工具的分數是「試算」">
        OECD INDIGO 官方是「<Text style={{ fontWeight: '800' }}>國家層級</Text>」評分（193 國），並非逐一協定評分。本應用程式對個別協定顯示的 INDIGO-t 分數，是<Text style={{ fontWeight: '800', color: '#dc2626' }}>依 OECD 公開方法論自行試算的估計值</Text>，並非 OECD 官方數字。引用研究文獻的數字會註明來源。精確評分需逐條判讀條文的「應/致力」語言。
      </Section>

      <Section c={c} title="計分方式（INDIGO-t）">
        共 28 項具體議題，分屬五大政策領域。每項依條文約束強度給分：
      </Section>

      <View style={{ gap: 6 }}>
        <ScoreRule c={c} color="#16a34a" label="強制語言" detail="「應」shall / shall not" pts="1 分" />
        <ScoreRule c={c} color="#d97706" label="努力語言" detail="「致力」shall endeavour / should" pts="0.5 分" />
        <ScoreRule c={c} color="#9ca3af" label="未涵蓋" detail="協議未涉及該議題" pts="0 分" />
      </View>

      <Text style={{ color: c.textSecondary, fontSize: 13, lineHeight: 20 }}>
        28 項得分加總後除以 28，換算為 0–1 的比例分數，即為協議總分。
      </Text>

      <Section c={c} title="五大政策領域（共 28 議題）" />
      <View style={{ gap: 8 }}>
        {DOMAINS.map(d => (
          <View key={d.code} style={[styles.domainRow, { backgroundColor: c.backgroundElement }]}>
            <View style={[styles.domainBadge, { backgroundColor: '#1e3a5f' }]}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>{d.code}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.text, fontWeight: '700', fontSize: 14 }}>{d.name}</Text>
              <Text style={{ color: c.textSecondary, fontSize: 11 }}>{d.en}</Text>
            </View>
            <Text style={{ color: c.textSecondary, fontSize: 12 }}>{d.issues} 議題</Text>
          </View>
        ))}
      </View>

      <Section c={c} title="參考基準（研究文獻試算）">
        WTO JSI 穩定文本 0.41 · DEPA 0.57 · 英星 DEA 0.64 · 臺日數位貿易協議 0.48
      </Section>

      <Pressable
        onPress={() => Linking.openURL('https://www.oecd.org/en/publications/methodology-for-the-oecd-index-of-digital-trade-integration-and-openness-indigo_b6d01a7b-en.html')}
        style={[styles.linkBtn, { backgroundColor: '#2563eb' }]}>
        <Ionicons name="open-outline" size={16} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>OECD INDIGO 官方方法論報告</Text>
      </Pressable>

      <Text style={{ color: c.textSecondary, fontSize: 11, lineHeight: 16 }}>
        資料來源：OECD (2025), Methodology for the OECD Index of Digital Trade Integration and Openness (INDIGO), Technical Report. doi:10.1787/b6d01a7b-en
      </Text>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function Section({ title, children, c }: { title: string; children?: React.ReactNode; c: any }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: c.text, fontSize: 16, fontWeight: '800' }}>{title}</Text>
      {children && <Text style={{ color: c.text, fontSize: 14, lineHeight: 22 }}>{children}</Text>}
    </View>
  );
}

function ScoreRule({ c, color, label, detail, pts }: { c: any; color: string; label: string; detail: string; pts: string }) {
  return (
    <View style={[styles.ruleRow, { backgroundColor: c.backgroundElement }]}>
      <View style={[styles.ruleDot, { backgroundColor: color }]} />
      <Text style={{ color: c.text, fontWeight: '700', fontSize: 13, width: 64 }}>{label}</Text>
      <Text style={{ color: c.textSecondary, fontSize: 12, flex: 1 }}>{detail}</Text>
      <Text style={{ color, fontWeight: '800', fontSize: 13 }}>{pts}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  sub: { fontSize: 12, fontStyle: 'italic' },
  domainRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 },
  domainBadge: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8 },
  ruleDot: { width: 10, height: 10, borderRadius: 5 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 10 },
});
