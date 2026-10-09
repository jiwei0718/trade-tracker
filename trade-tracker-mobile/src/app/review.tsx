import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useData } from '@/lib/data-context';
import { controlsAvailable, decideEvents, listPending, type PendingEvent } from '@/lib/n8n';
import { usePageWidth } from '@/hooks/use-desktop';
import { EVENT_TYPE_LABELS } from '@/components/event-row';
import TierChip from '@/components/tier-chip';

const TIER_RANK: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };

interface Story {
  key: string;
  events: PendingEvent[];
  agreementId: string | null;
  proposedName: string | null;
}

/** 待確認事件:一般媒體的報導、非官方來源宣稱的狀態改變、資料庫還沒有的新協定。只在這台電腦上可用。 */
export default function Review() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const page = usePageWidth(900);
  const { agreements, refresh } = useData();
  const [events, setEvents] = useState<PendingEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setEvents(await listPending()); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }, []);
  useEffect(() => { if (controlsAvailable) load(); }, [load]);

  const names = useMemo(() => new Map(agreements.map(a => [a.id, a.nameZh])), [agreements]);
  const stories = useMemo<Story[]>(() => {
    const groups = new Map<string, PendingEvent[]>();
    for (const e of events ?? []) {
      const k = e.story_key || `event-${e.id}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(e);
    }
    return [...groups.entries()].map(([key, evs]) => {
      evs.sort((a, b) => (TIER_RANK[a.new_value?.tier ?? 'C'] ?? 4) - (TIER_RANK[b.new_value?.tier ?? 'C'] ?? 4));
      return {
        key, events: evs,
        agreementId: evs.find(e => e.agreement_id)?.agreement_id ?? null,
        proposedName: evs.find(e => e.new_value?.proposed_name)?.new_value?.proposed_name ?? null,
      };
    });
  }, [events]);

  async function decide(story: Story, decision: 'approve' | 'reject') {
    setBusy(story.key);
    try {
      await decideEvents(story.events.map(e => e.id), decision);
      setEvents(prev => (prev ?? []).filter(e => !story.events.some(x => x.id === e.id)));
      if (decision === 'approve') refresh();
    } catch (e) {
      setError(`更新失敗:${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(null);
    }
  }

  if (!controlsAvailable) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary }}>待確認事件只能在這台電腦的協定追蹤 App 上審核。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={[{ padding: 16, gap: 12 }, page]}>
      <Text style={{ color: c.textSecondary, fontSize: 13, lineHeight: 20 }}>
        這些事件來自一般媒體、非官方來源宣稱的狀態改變,或是資料庫還沒有的協定,所以先不顯示。
        確認內容正確就按「採用」,會出現在「動態」頁;按「不採用」就撤回。同一件事的報導會一起處理。
      </Text>
      {!!error && <Text style={{ color: '#dc2626', fontSize: 13 }}>{error}</Text>}
      {events === null && !error && <ActivityIndicator style={{ marginTop: 24 }} />}
      {events !== null && stories.length === 0 && (
        <Text style={{ color: c.textSecondary, fontSize: 14, marginTop: 12 }}>目前沒有待確認的事件。</Text>
      )}

      {stories.map(story => {
        const main = story.events[0];
        const legacyId = main.new_value?.proposed_agreement_id;
        const title = story.agreementId
          ? names.get(story.agreementId) ?? story.agreementId
          : story.proposedName ? `新協定候選:${story.proposedName}`
          : legacyId ? `舊系統 AI 擷取(未驗證):${legacyId}` : '未對應協定';
        const summary = main.summary_zh
          ?? (legacyId ? `${EVENT_TYPE_LABELS[main.event_type] ?? main.event_type}:${JSON.stringify(main.new_value?.value ?? null).slice(0, 160)}` : '(沒有摘要)');
        return (
          <View key={story.key} style={[styles.card, { backgroundColor: c.backgroundElement }]}>
            <View style={styles.top}>
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>{main.event_date ?? main.detected_at.slice(0, 10)}</Text>
              <View style={styles.type}>
                <Text style={styles.typeText}>{EVENT_TYPE_LABELS[main.event_type] ?? main.event_type}</Text>
              </View>
              {!story.agreementId && !!story.proposedName && (
                <View style={[styles.type, { backgroundColor: '#f59e0b22' }]}>
                  <Text style={[styles.typeText, { color: '#b45309' }]}>資料庫還沒有</Text>
                </View>
              )}
            </View>
            {story.agreementId ? (
              <Pressable onPress={() => router.push(`/agreement/${story.agreementId}`)}>
                <Text style={styles.agreement}>{title}</Text>
              </Pressable>
            ) : (
              <Text style={[styles.agreement, { color: c.text }]}>{title}</Text>
            )}
            <Text style={{ color: c.text, fontSize: 14, lineHeight: 20 }}>{summary}</Text>

            <View style={{ gap: 4 }}>
              {story.events.map(e => (
                <Pressable key={e.id} onPress={() => e.source_url && Linking.openURL(e.source_url)} style={styles.source}>
                  <TierChip tier={e.new_value?.tier} />
                  <Ionicons name="open-outline" size={12} color={c.textSecondary} />
                  <Text style={{ color: c.textSecondary, fontSize: 12, flexShrink: 1 }} numberOfLines={1}>
                    {e.new_value?.publisher || e.source_id || '舊系統'}{e.new_value?.title ? ` · ${e.new_value.title}` : ''}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => decide(story, 'approve')}
                disabled={busy !== null}
                style={[styles.button, { backgroundColor: busy ? c.backgroundSelected : '#16a34a' }]}>
                <Ionicons name="checkmark" size={14} color="#fff" />
                <Text style={styles.buttonText}>採用{story.events.length > 1 ? `(${story.events.length} 則)` : ''}</Text>
              </Pressable>
              <Pressable
                onPress={() => decide(story, 'reject')}
                disabled={busy !== null}
                style={[styles.button, { backgroundColor: busy ? c.backgroundSelected : '#64748b' }]}>
                <Ionicons name="close" size={14} color="#fff" />
                <Text style={styles.buttonText}>不採用</Text>
              </Pressable>
              {busy === story.key && <ActivityIndicator size="small" />}
            </View>
          </View>
        );
      })}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { borderRadius: 12, padding: 14, gap: 8 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  type: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, backgroundColor: '#64748b18' },
  typeText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  agreement: { color: '#2563eb', fontSize: 15, fontWeight: '700' },
  source: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
