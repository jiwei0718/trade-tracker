import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { CATEGORY_LABELS, SOURCE_TIER_LABELS, termById, type TermSource } from '@/data/terms';
import { WTO_GLOSSARY_SOURCE, wtoEntryByEn, wtoEntryById } from '@/data/wto-glossary';
import { usePageWidth } from '@/hooks/use-desktop';
import TermText, { TermScope } from '@/components/term-text';

/** 名詞說明頁:常用名詞(src/data/terms.ts)或《WTO小辭典》詞條(id 以 wto- 開頭)。 */
export default function TermPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const page = usePageWidth(820);
  const [showOfficial, setShowOfficial] = useState(false);

  const term = termById(id);
  const wto = term?.wtoGlossaryEn ? wtoEntryByEn(term.wtoGlossaryEn) : wtoEntryById(id);

  if (!term && !wto) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Stack.Screen options={{ title: '名詞說明' }} />
        <Text style={{ color: c.textSecondary }}>找不到這個名詞。</Text>
      </View>
    );
  }

  const zh = term?.zh ?? wto!.zh;
  const original = term ? (term.abbr ? `${term.original}, ${term.abbr}` : term.original) : wto!.en;
  const sources: TermSource[] = term ? term.sources : [WTO_GLOSSARY_SOURCE];

  return (
    <TermScope resetKey={id} self={`term:${id}`}>
      <Stack.Screen options={{ title: zh }} />
      <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={[{ padding: 16, gap: 16 }, page]}>
        <View style={{ gap: 4 }}>
          <Text style={[styles.title, { color: c.text }]}>{zh}</Text>
          <Text style={{ color: c.textSecondary, fontSize: 15 }}>{original}</Text>
          <View style={styles.chips}>
            <View style={[styles.chip, { backgroundColor: '#2563eb18' }]}>
              <Text style={{ color: '#2563eb', fontSize: 11, fontWeight: '700' }}>
                {term ? CATEGORY_LABELS[term.category] : 'WTO 小辭典'}
              </Text>
            </View>
            {!!term?.aliases?.length && (
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>
                也稱:{term.aliases.map(x => (typeof x === 'string' ? x : `${x.zh}(${x.original})`)).join('、')}
              </Text>
            )}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={[styles.section, { color: c.text }]}>{term ? '解釋' : '官方名詞解釋'}</Text>
          <TermText style={[styles.body, { color: c.text }]}>{term ? term.definition : wto!.definition}</TermText>
        </View>

        {!!term?.aiNote && (
          <View style={[styles.aiBox, { borderColor: '#f59e0b66', backgroundColor: '#f59e0b14' }]}>
            <Ionicons name="sparkles-outline" size={14} color="#b45309" />
            <Text style={{ color: c.text, fontSize: 13, lineHeight: 19, flex: 1 }}>
              <Text style={{ fontWeight: '700', color: '#b45309' }}>AI 翻譯/撰寫說明:</Text>{term.aiNote}
            </Text>
          </View>
        )}

        {term && wto && (
          <View style={{ gap: 6 }}>
            <Pressable onPress={() => setShowOfficial(v => !v)} style={styles.toggle}>
              <Ionicons name={showOfficial ? 'chevron-down' : 'chevron-forward'} size={14} color={c.textSecondary} />
              <Text style={{ color: c.textSecondary, fontSize: 13, fontWeight: '600' }}>
                《WTO小辭典》官方全文:{wto.zh}({wto.en})
              </Text>
            </Pressable>
            {showOfficial && <Text style={[styles.body, { color: c.text }]}>{wto.definition}</Text>}
          </View>
        )}

        <View style={{ gap: 8 }}>
          <Text style={[styles.section, { color: c.text }]}>資料來源</Text>
          {sources.length === 0 && (
            <Text style={{ color: c.textSecondary, fontSize: 13 }}>尚無權威來源,請見上方 AI 翻譯/撰寫說明。</Text>
          )}
          {(term && wto && !sources.some(s => s.url === WTO_GLOSSARY_SOURCE.url) ? [...sources, WTO_GLOSSARY_SOURCE] : sources).map((s, i) => (
            <View key={i} style={[styles.source, { borderColor: c.backgroundElement }]}>
              <Text style={{ color: c.textSecondary, fontSize: 11, fontWeight: '700' }}>{SOURCE_TIER_LABELS[s.tier]}</Text>
              <Text style={{ color: c.text, fontSize: 13, lineHeight: 19 }} selectable>{s.apa}</Text>
              {!!s.url && (
                <Pressable onPress={() => Linking.openURL(s.url!)} style={styles.link} hitSlop={6}>
                  <Ionicons name="open-outline" size={12} color="#2563eb" />
                  <Text style={{ color: '#2563eb', fontSize: 12 }}>開啟來源</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {!!term?.related?.length && (
          <View style={{ gap: 8 }}>
            <Text style={[styles.section, { color: c.text }]}>相關名詞</Text>
            <View style={styles.chips}>
              {term.related.map(r => {
                const t = termById(r);
                return t ? (
                  <Pressable key={r} onPress={() => router.push(`/term/${r}` as never)} style={[styles.related, { backgroundColor: c.backgroundElement }]}>
                    <Text style={{ color: c.text, fontSize: 13 }}>{t.zh}</Text>
                  </Pressable>
                ) : null;
              })}
            </View>
          </View>
        )}

        <Pressable onPress={() => router.push('/glossary')} style={styles.link}>
          <Ionicons name="book-outline" size={14} color="#2563eb" />
          <Text style={{ color: '#2563eb', fontSize: 13 }}>瀏覽所有名詞</Text>
        </Pressable>
        <View style={{ height: 24 }} />
      </ScrollView>
    </TermScope>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 4 },
  chip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  section: { fontSize: 15, fontWeight: '800' },
  body: { fontSize: 15, lineHeight: 24 },
  aiBox: { flexDirection: 'row', gap: 8, borderWidth: 1, borderRadius: 10, padding: 10, alignItems: 'flex-start' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  source: { gap: 4, borderTopWidth: 1, paddingTop: 8 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  related: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
});
