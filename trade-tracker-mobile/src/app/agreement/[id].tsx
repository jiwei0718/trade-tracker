import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getAgreementById } from '@/lib/selectors';
import { useData } from '@/lib/data-context';
import { STATUS_COLORS, STATUS_LABELS, TYPE_LABELS, ERA_INFO } from '@/data/types';
import type { ArticleGroup } from '@/data/types';
import { ARTICLE_STRUCTURES } from '@/data/article-structures';
import { Colors } from '@/constants/theme';
import StatusBadge from '@/components/status-badge';
import { useWatchlist } from '@/lib/watchlist';

const DATE_LABEL: Record<string, string> = {
  proposed: '提議',
  started: '談判啟動',
  concluded: '談判完成',
  signed: '正式簽署',
  in_force: '正式生效',
  suspended: '暫停',
  cancelled: '取消',
  expired: '失效',
  superseded: '被取代',
};

export default function AgreementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { hasItem, toggle, setSnapshot } = useWatchlist();
  const { agreements } = useData();

  const a = getAgreementById(id ?? '', agreements);
  const starred = a ? hasItem(a.id) : false;

  // Record snapshot when a watched agreement is viewed (initial baseline)
  useEffect(() => {
    if (a && starred) setSnapshot(a.id, a.status);
  }, [a, starred, setSnapshot]);

  if (!a) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background }}>
        <Text style={{ color: c.text }}>找不到此協定</Text>
      </View>
    );
  }

  const color = STATUS_COLORS[a.status];
  const eraInfo = ERA_INFO[a.era];
  const structure = a.articleStructure ?? ARTICLE_STRUCTURES[a.id];
  const totalArticles = structure?.reduce((s, g) => s + g.articles.length, 0) ?? 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: a.shortName ?? a.nameZh,
          headerRight: () => (
            <Pressable onPress={() => toggle(a.id)} hitSlop={10} style={{ marginRight: 10 }}>
              <Ionicons
                name={starred ? 'star' : 'star-outline'}
                size={22}
                color={starred ? '#f59e0b' : c.textSecondary}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Title */}
        <View>
          <Text style={[styles.title, { color: c.text }]}>{a.nameZh}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{a.name}</Text>
          {a.shortName && <Text style={[styles.short, { color: c.textSecondary }]}>{a.shortName}</Text>}
        </View>

        {/* Badges */}
        <View style={styles.badgesRow}>
          <StatusBadge status={a.status} />
          <View style={[styles.metaBadge, { backgroundColor: c.backgroundElement }]}>
            <Text style={{ color: c.text, fontSize: 12 }}>{TYPE_LABELS[a.type]}</Text>
          </View>
          <Pressable
            onPress={() => router.push(`/era/${a.era}`)}
            style={[styles.metaBadge, { backgroundColor: '#0ea5e920', borderColor: '#0ea5e940', borderWidth: 1 }]}>
            <Text style={{ color: '#0ea5e9', fontSize: 12, fontWeight: '600' }}>{eraInfo.label}</Text>
          </Pressable>
          {a.tags?.includes('post-liberation-day') && (
            <View style={[styles.metaBadge, { backgroundColor: '#fecaca' }]}>
              <Text style={{ color: '#991b1b', fontSize: 12, fontWeight: '700' }}>★ 解放日後</Text>
            </View>
          )}
        </View>

        {/* Volume */}
        {a.tradeVolume && (
          <View style={[styles.volumeCard, { backgroundColor: color + '15', borderColor: color + '40' }]}>
            <Text style={[styles.volumeLabel, { color: c.textSecondary }]}>估計貿易量</Text>
            <Text style={[styles.volumeValue, { color }]}>${a.tradeVolume.toLocaleString()}億 USD</Text>
          </View>
        )}

        {/* Significance highlight */}
        {a.significance && (
          <View style={[styles.sigCard, { backgroundColor: '#fef3c7', borderColor: '#fbbf24' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <Ionicons name="bulb" size={14} color="#92400e" />
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#92400e' }}>歷史意義</Text>
            </View>
            <Text style={{ color: '#78350f', fontSize: 13, lineHeight: 18 }}>{a.significance}</Text>
          </View>
        )}

        {/* Parties */}
        <View>
          <Text style={[styles.sectionTitle, { color: c.text }]}>締約方</Text>
          <View style={styles.partiesWrap}>
            {a.partyNamesZh.map((p, i) => {
              const partyCode = a.parties[i];
              return (
                <Pressable
                  key={i}
                  onPress={() => partyCode && !['MULTI', 'WORLD', 'EU', 'ASEAN'].includes(partyCode) && router.push(`/country/${partyCode}`)}
                  style={[styles.party, { backgroundColor: c.backgroundElement }]}>
                  <Text style={{ color: c.text, fontSize: 13 }}>{p}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Timeline */}
        <View>
          <Text style={[styles.sectionTitle, { color: c.text }]}>關鍵時間節點</Text>
          <View style={{ gap: 8 }}>
            {Object.entries(a.keyDates)
              .filter(([, v]) => v)
              .sort(([, a], [, b]) => (a ?? '').localeCompare(b ?? ''))
              .map(([k, v]) => (
                <View key={k} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: c.textSecondary }]} />
                  <Text style={[styles.timelineLabel, { color: c.textSecondary }]}>{DATE_LABEL[k] ?? k}</Text>
                  <View style={[styles.timelineDate, { backgroundColor: c.backgroundElement }]}>
                    <Text style={{ color: c.text, fontSize: 12, fontFamily: 'ui-monospace' }}>{v}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {/* Description */}
        <View>
          <Text style={[styles.sectionTitle, { color: c.text }]}>說明</Text>
          <Text style={[styles.body, { color: c.text }]}>{a.descriptionZh}</Text>
          <Text style={[styles.bodyEn, { color: c.textSecondary }]}>{a.description}</Text>
        </View>

        {/* Provisions */}
        {a.keyProvisions && a.keyProvisions.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: c.text }]}>主要條款</Text>
            <View style={{ gap: 6 }}>
              {a.keyProvisions.map((p, i) => (
                <View key={i} style={styles.provision}>
                  <Text style={{ color: '#2563eb', marginTop: 1 }}>•</Text>
                  <Text style={{ color: c.text, fontSize: 14, flex: 1 }}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Article structure (條文架構) */}
        {structure && structure.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: c.text }]}>
              條文架構（{totalArticles} 條）
            </Text>
            <Text style={{ color: c.textSecondary, fontSize: 11, marginBottom: 8, marginTop: -4 }}>
              依主題分組 · 點主題展開／收合
            </Text>
            <View style={{ gap: 8 }}>
              {structure.map((g, i) => (
                <ArticleGroupBlock key={i} group={g} c={c} />
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        {a.tags && a.tags.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: c.text }]}>標籤</Text>
            <View style={styles.partiesWrap}>
              {a.tags.map((t, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: '#dbeafe' }]}>
                  <Text style={{ color: '#1e40af', fontSize: 11, fontWeight: '600' }}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Compare CTA */}
        <Pressable
          onPress={() => router.push(`/compare?seed=${a.id}`)}
          style={[styles.cta, { backgroundColor: '#16a34a' }]}>
          <Ionicons name="swap-horizontal" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700' }}>與其他協定比較</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

function ArticleGroupBlock({ group, c }: { group: ArticleGroup; c: any }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={[styles.groupCard, { borderColor: c.backgroundElement }]}>
      <Pressable
        onPress={() => setOpen(o => !o)}
        style={[styles.groupHeader, { backgroundColor: '#1e3a5f' }]}>
        <Text style={styles.groupTitle}>{group.theme}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.groupCount}>{group.articles.length}</Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#fff" />
        </View>
      </Pressable>
      {group.themeEn && open && (
        <Text style={[styles.groupEn, { color: c.textSecondary }]}>{group.themeEn}</Text>
      )}
      {open && (
        <View style={{ padding: 10, gap: 8 }}>
          {group.articles.map((art, i) => (
            <View key={i} style={styles.articleRow}>
              <Text style={styles.artNum}>{art.num}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.artZh, { color: c.text }]}>{art.zh}</Text>
                <Text style={[styles.artEn, { color: c.textSecondary }]}>{art.en}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', lineHeight: 28 },
  subtitle: { fontSize: 13, marginTop: 4 },
  short: { fontSize: 12, marginTop: 2 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  metaBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  volumeCard: { padding: 14, borderRadius: 12, borderWidth: 1 },
  volumeLabel: { fontSize: 12 },
  volumeValue: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  sigCard: { padding: 12, borderRadius: 10, borderWidth: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  partiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  party: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timelineDot: { width: 8, height: 8, borderRadius: 4 },
  timelineLabel: { fontSize: 13, flex: 1 },
  timelineDate: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  body: { fontSize: 14, lineHeight: 22 },
  bodyEn: { fontSize: 12, lineHeight: 18, marginTop: 8, fontStyle: 'italic' },
  provision: { flexDirection: 'row', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12 },
  groupCard: { borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 9 },
  groupTitle: { color: '#fff', fontWeight: '800', fontSize: 14 },
  groupCount: { color: '#cbd5e1', fontSize: 12, fontWeight: '700' },
  groupEn: { fontSize: 10, fontStyle: 'italic', paddingHorizontal: 12, paddingTop: 6 },
  articleRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  artNum: { color: '#2563eb', fontWeight: '800', fontSize: 12, minWidth: 56 },
  artZh: { fontSize: 13, fontWeight: '600', lineHeight: 17 },
  artEn: { fontSize: 10, fontStyle: 'italic', lineHeight: 14 },
});
