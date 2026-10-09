import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { CATEGORY_LABELS, TERMS, aliasText, type Term, type TermCategory } from '@/data/terms';
import { WTO_GLOSSARY, type WtoGlossaryEntry } from '@/data/wto-glossary';
import { ORGANIZATIONS } from '@/data/organizations';
import { usePageWidth } from '@/hooks/use-desktop';
import CardGrid from '@/components/card-grid';

const LETTERS = [...new Set(WTO_GLOSSARY.map(e => e.en[0]?.toUpperCase()).filter(l => l && /[A-Z]/.test(l)))].sort();
const firstSentence = (s: string) => (s.match(/^[^。]*。/)?.[0] ?? s).slice(0, 90);

/** 專有名詞資料庫:常用名詞(附來源)+ 國際組織 + 經濟部國際貿易署《WTO小辭典》。 */
export default function Glossary() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const page = usePageWidth(1000);
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState(LETTERS[0] ?? 'A');

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return null;
    const hit = (...xs: (string | undefined)[]) => xs.some(x => x?.toLowerCase().includes(q));
    const terms = TERMS.filter(t => hit(t.zh, t.original, t.abbr, ...(t.aliases ?? []).map(aliasText)));
    const wto = WTO_GLOSSARY.filter(e => hit(e.zh, e.en)).slice(0, 80);
    const orgs = ORGANIZATIONS.filter(o => hit(o.nameZh, o.abbrZh, o.name, o.abbr));
    return { terms, wto, orgs };
  }, [q]);

  const byCategory = useMemo(() => {
    const m = new Map<TermCategory, Term[]>();
    for (const t of TERMS) { if (!m.has(t.category)) m.set(t.category, []); m.get(t.category)!.push(t); }
    return [...m.entries()];
  }, []);

  const TermCard = ({ t }: { t: Term }) => (
    <Pressable onPress={() => router.push(`/term/${t.id}` as never)} style={[styles.card, { backgroundColor: c.backgroundElement }]}>
      <Text style={{ color: c.text, fontSize: 15, fontWeight: '700' }}>{t.zh}</Text>
      <Text style={{ color: c.textSecondary, fontSize: 12 }}>{t.abbr ? `${t.original}, ${t.abbr}` : t.original}</Text>
      <Text style={{ color: c.textSecondary, fontSize: 12, lineHeight: 17 }} numberOfLines={2}>{firstSentence(t.definition)}</Text>
      {!!t.aiNote && <Text style={{ color: '#b45309', fontSize: 11 }}>含 AI 翻譯/撰寫</Text>}
    </Pressable>
  );
  const WtoRow = ({ e }: { e: WtoGlossaryEntry }) => (
    <Pressable onPress={() => router.push(`/term/${e.id}` as never)} style={[styles.row, { borderBottomColor: c.backgroundElement }]}>
      <Text style={{ color: c.text, fontSize: 14, fontWeight: '600' }}>{e.zh}</Text>
      <Text style={{ color: c.textSecondary, fontSize: 12, flex: 1 }} numberOfLines={1}>{e.en}</Text>
      <Ionicons name="chevron-forward" size={14} color={c.textSecondary} />
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={[{ padding: 16, gap: 18 }, page]}>
      <Text style={{ color: c.textSecondary, fontSize: 13, lineHeight: 20 }}>
        名詞說明以官方與國際組織資料為優先,其次是研究與學術機構;每個名詞都附 APA 格式的來源。
        找不到權威來源而由 AI 翻譯或撰寫的部分會特別標示。協定、動態等頁面中的藍色虛線文字可以點,會直接開啟這裡的說明。
      </Text>

      <View style={[styles.search, { backgroundColor: c.backgroundElement }]}>
        <Ionicons name="search" size={16} color={c.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="搜尋中文或英文,例如 最惠國待遇、MFN、rules of origin"
          placeholderTextColor={c.textSecondary}
          style={[styles.input, { color: c.text }]}
        />
        {!!query && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={c.textSecondary} />
          </Pressable>
        )}
      </View>

      {results ? (
        <View style={{ gap: 14 }}>
          {results.terms.length + results.wto.length + results.orgs.length === 0 && (
            <Text style={{ color: c.textSecondary }}>找不到符合「{query}」的名詞。</Text>
          )}
          {results.terms.length > 0 && (
            <CardGrid gap={8}>{results.terms.map(t => <TermCard key={t.id} t={t} />)}</CardGrid>
          )}
          {results.orgs.length > 0 && (
            <View style={{ gap: 4 }}>
              <Text style={[styles.section, { color: c.text }]}>國際組織</Text>
              {results.orgs.map(o => (
                <Pressable key={o.code} onPress={() => router.push(`/org/${o.code}`)} style={[styles.row, { borderBottomColor: c.backgroundElement }]}>
                  <Text style={{ color: c.text, fontSize: 14, fontWeight: '600' }}>{o.nameZh}</Text>
                  <Text style={{ color: c.textSecondary, fontSize: 12, flex: 1 }} numberOfLines={1}>{o.name}</Text>
                  <Ionicons name="chevron-forward" size={14} color={c.textSecondary} />
                </Pressable>
              ))}
            </View>
          )}
          {results.wto.length > 0 && (
            <View style={{ gap: 4 }}>
              <Text style={[styles.section, { color: c.text }]}>WTO 小辭典</Text>
              {results.wto.map(e => <WtoRow key={e.id} e={e} />)}
            </View>
          )}
        </View>
      ) : (
        <>
          {byCategory.map(([cat, terms]) => (
            <View key={cat} style={{ gap: 8 }}>
              <Text style={[styles.section, { color: c.text }]}>{CATEGORY_LABELS[cat]}</Text>
              <CardGrid gap={8}>{terms.map(t => <TermCard key={t.id} t={t} />)}</CardGrid>
            </View>
          ))}

          <View style={{ gap: 8 }}>
            <Text style={[styles.section, { color: c.text }]}>國際組織</Text>
            <View style={styles.wrap}>
              {ORGANIZATIONS.map(o => (
                <Pressable key={o.code} onPress={() => router.push(`/org/${o.code}`)} style={[styles.pill, { backgroundColor: c.backgroundElement }]}>
                  <Text style={{ color: c.text, fontSize: 13 }}>{o.abbrZh ?? o.nameZh}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={[styles.section, { color: c.text }]}>WTO 小辭典({WTO_GLOSSARY.length} 個詞條)</Text>
            <Text style={{ color: c.textSecondary, fontSize: 12, lineHeight: 18 }}>
              經濟部國際貿易署(2025)。WTO小辭典〔資料集〕。政府資料開放平臺。依政府資料開放授權條款第1版使用。
            </Text>
            <View style={styles.wrap}>
              {LETTERS.map(l => (
                <Pressable key={l} onPress={() => setLetter(l)} style={[styles.letter, { backgroundColor: letter === l ? '#2563eb' : c.backgroundElement }]}>
                  <Text style={{ color: letter === l ? '#fff' : c.text, fontSize: 12, fontWeight: '700' }}>{l}</Text>
                </Pressable>
              ))}
            </View>
            <View>
              {WTO_GLOSSARY.filter(e => e.en[0]?.toUpperCase() === letter).map(e => <WtoRow key={e.id} e={e} />)}
            </View>
          </View>
        </>
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  input: { flex: 1, fontSize: 14, paddingVertical: 2 },
  section: { fontSize: 16, fontWeight: '800' },
  card: { borderRadius: 10, padding: 12, gap: 3, flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  letter: { width: 30, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
});
