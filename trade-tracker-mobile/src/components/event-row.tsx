import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import type { TradeAgreement } from '@/data/types';
import { STATUS_LABELS } from '@/data/types';
import { eventSortDate, type AgreementEvent } from '@/lib/data-source';
import { useData } from '@/lib/data-context';
import { Colors } from '@/constants/theme';
import TierChip from './tier-chip';

export const EVENT_TYPE_LABELS: Record<string, string> = {
  new_agreement: '新增協定',
  status_change: '狀態變更',
  date_added: '新增日期',
  started: '啟動談判',
  concluded: '完成談判',
  signed: '簽署',
  in_force: '生效',
  suspended: '暫停',
  cancelled: '取消',
  expired: '失效',
  superseded: '被取代',
  accession: '加入／接受',
  new_document: '新官方文件',
  ministerial: '部長會議／總理事會',
  field_update: '資料更新',
  news: '新聞',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  new_document: '#16a34a',
  ministerial: '#7c3aed',
  accession: '#0891b2',
  signed: '#2563eb',
  in_force: '#16a34a',
  status_change: '#d97706',
  news: '#64748b',
};

const statusLabel = (v: unknown) => STATUS_LABELS[v as keyof typeof STATUS_LABELS] ?? String(v ?? '?');

/** Text for legacy events that have no summary (status/date changes from the old pipeline). */
function legacyText(e: AgreementEvent): string {
  if (e.type === 'status_change') return `狀態:${statusLabel(e.oldValue)} → ${statusLabel(e.newValue)}`;
  if (e.type === 'date_added') return `新增日期:${String(e.newValue ?? '')}`;
  if (e.type === 'new_agreement') return `加入資料庫(狀態:${statusLabel(e.newValue)})`;
  return EVENT_TYPE_LABELS[e.type] ?? e.type;
}

interface Props {
  event: AgreementEvent;
  agreement?: TradeAgreement;
  /** Hide the agreement name (e.g. inside that agreement's own page). */
  hideAgreement?: boolean;
}

export default function EventRow({ event: e, agreement, hideAgreement }: Props) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const typeColor = EVENT_TYPE_COLORS[e.type] ?? '#64748b';
  const { sources } = useData();
  const date = eventSortDate(e);
  const sourceName = sources.find(s => s.sourceId === e.sourceId)?.nameZh;
  const sourceText = e.symbol ?? e.publisher ?? sourceName ?? e.sourceId ?? '';
  const [showRelated, setShowRelated] = useState(false);
  const related = e.related ?? [];

  return (
    <View style={[styles.row, { borderColor: c.backgroundElement }]}>
      <View style={styles.top}>
        <Text style={[styles.date, { color: c.textSecondary }]}>{date}</Text>
        <View style={[styles.type, { backgroundColor: typeColor + '18' }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>{EVENT_TYPE_LABELS[e.type] ?? e.type}</Text>
        </View>
        <TierChip tier={e.tier} />
        {!!e.byTool && <Text style={[styles.ai, { color: c.textSecondary }]}>AI 摘要</Text>}
      </View>

      {!hideAgreement && e.agreementId && (
        <Pressable onPress={() => router.push(`/agreement/${e.agreementId}`)}>
          <Text style={styles.agreement} numberOfLines={1}>{agreement?.nameZh ?? e.agreementId}</Text>
        </Pressable>
      )}

      <Text style={[styles.summary, { color: c.text }]}>{e.summaryZh ?? legacyText(e)}</Text>

      {!!e.sourceUrl && (
        <Pressable onPress={() => Linking.openURL(e.sourceUrl!)} style={styles.source} hitSlop={6}>
          <Ionicons name="open-outline" size={12} color={c.textSecondary} />
          <Text style={[styles.sourceText, { color: c.textSecondary }]} numberOfLines={1}>
            {sourceText}{e.title && e.title !== sourceText ? ` · ${e.title}` : ''}
          </Text>
        </Pressable>
      )}

      {related.length > 0 && (
        <View style={styles.related}>
          <Pressable onPress={() => setShowRelated(v => !v)} hitSlop={6} style={styles.relatedToggle}>
            <Ionicons name={showRelated ? 'chevron-down' : 'chevron-forward'} size={12} color={c.textSecondary} />
            <Text style={[styles.relatedText, { color: c.textSecondary }]}>另有 {related.length} 則報導</Text>
          </Pressable>
          {showRelated && related.map(r => (
            <Pressable key={r.id} onPress={() => r.sourceUrl && Linking.openURL(r.sourceUrl)} style={styles.relatedItem} hitSlop={4}>
              <Text style={[styles.relatedText, { color: c.textSecondary }]} numberOfLines={1}>
                {r.eventDate ?? ''} · {r.publisher ?? r.sourceId ?? ''}{r.title ? ` · ${r.title}` : ''}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 10, borderBottomWidth: 1, gap: 4 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  date: { fontSize: 12, fontFamily: 'ui-monospace' },
  type: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  typeText: { fontSize: 11, fontWeight: '700' },
  ai: { fontSize: 10 },
  agreement: { color: '#2563eb', fontSize: 13, fontWeight: '700' },
  summary: { fontSize: 14, lineHeight: 20 },
  source: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sourceText: { fontSize: 11, flexShrink: 1 },
  related: { gap: 3, marginTop: 2 },
  relatedToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  relatedItem: { paddingLeft: 16 },
  relatedText: { fontSize: 11 },
});
