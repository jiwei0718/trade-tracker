import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, Modal, Linking } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getAgreementById } from '@/lib/selectors';
import { useData } from '@/lib/data-context';
import { STATUS_COLORS, STATUS_LABELS, TYPE_LABELS, ERA_INFO } from '@/data/types';
import type { ArticleGroup, Article, IndigoScore, AgreementDetail } from '@/data/types';
import { ARTICLE_STRUCTURES } from '@/data/article-structures';
import { AGREEMENT_DETAILS } from '@/data/agreement-details';
import { countryDisplay } from '@/data/countries';
import { tagLabel } from '@/data/tags';
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
  const detail: AgreementDetail | undefined = AGREEMENT_DETAILS[a.id];
  const [statusOpen, setStatusOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

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
          {a.fullNameZh && (
            <Text style={[styles.fullName, { color: c.textSecondary }]}>{a.fullNameZh}</Text>
          )}
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{a.name}</Text>
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

        {/* Quick status banner */}
        {detail?.latestStatus && (
          <View style={[styles.statusBanner, { backgroundColor: '#ecfeff', borderColor: '#06b6d4' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <Ionicons name="pulse" size={15} color="#0e7490" />
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#0e7490' }}>最新進展</Text>
              {detail.latestStatus.asOf && (
                <Text style={{ fontSize: 10, color: '#0e7490' }}>· 截至 {detail.latestStatus.asOf}</Text>
              )}
              {detail.latestStatus.byTool && (
                <View style={styles.toolBadge}><Text style={styles.toolBadgeText}>AI 摘要</Text></View>
              )}
            </View>
            <Text style={{ color: '#164e63', fontSize: 13, lineHeight: 19 }}>
              {detail.latestStatus.summary}
            </Text>
            {detail.latestStatus.detail && (
              <Pressable onPress={() => setStatusOpen(true)} style={styles.detailLink}>
                <Text style={{ color: '#0891b2', fontSize: 12, fontWeight: '700' }}>看詳細全文 →</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* INDIGO score */}
        {detail?.indigo && <IndigoCard indigo={detail.indigo} c={c} />}

        {/* Volume */}
        {!!a.tradeVolume && (
          <View style={[styles.volumeCard, { backgroundColor: color + '15', borderColor: color + '40' }]}>
            <Text style={[styles.volumeLabel, { color: c.textSecondary }]}>估計貿易量</Text>
            <Text style={[styles.volumeValue, { color }]}>${a.tradeVolume.toLocaleString()}億 USD</Text>
          </View>
        )}

        {/* Official source documents */}
        {detail?.sourceDocs && detail.sourceDocs.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: c.text }]}>官方文件來源</Text>
            <View style={{ gap: 6 }}>
              {detail.sourceDocs.map((doc, i) => (
                <Pressable
                  key={i}
                  onPress={() => Linking.openURL(doc.url)}
                  style={[styles.docRow, { backgroundColor: c.backgroundElement }]}>
                  <Ionicons name="document-text-outline" size={16} color="#2563eb" />
                  <Text style={{ color: c.text, fontSize: 13, flex: 1 }}>{doc.label}</Text>
                  <Ionicons name="open-outline" size={14} color={c.textSecondary} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Related instruments / sub-agreements */}
        {a.relatedIds && a.relatedIds.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: c.text }]}>相關文件 / 子倡議</Text>
            <View style={{ gap: 6 }}>
              {a.relatedIds.map(rid => {
                const r = getAgreementById(rid, agreements);
                if (!r) return null;
                return (
                  <Pressable
                    key={rid}
                    onPress={() => router.push(`/agreement/${rid}`)}
                    style={[styles.docRow, { backgroundColor: '#7c3aed15', borderColor: '#7c3aed40', borderWidth: 1 }]}>
                    <Ionicons name="git-branch-outline" size={16} color="#7c3aed" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: c.text, fontSize: 13, fontWeight: '600' }}>{r.nameZh}</Text>
                      <Text style={{ color: c.textSecondary, fontSize: 11 }}>
                        {r.partyNamesZh.length} 個締約方{r.parties.includes('TW') ? '（含我國）' : ''}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={c.textSecondary} />
                  </Pressable>
                );
              })}
            </View>
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
            {a.parties.map((partyCode, i) => {
              const display = countryDisplay(partyCode, a.partyNamesZh[i] ?? partyCode);
              return (
                <Pressable
                  key={i}
                  onPress={() => partyCode && router.push(`/country/${partyCode}`)}
                  style={[styles.party, { backgroundColor: c.backgroundElement }]}>
                  <Text style={{ color: c.text, fontSize: 13 }}>{display}</Text>
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
            {a.latestProgressDate && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#16a34a' }]} />
                <Text style={[styles.timelineLabel, { color: '#16a34a', fontWeight: '700' }]}>最新進展</Text>
                <View style={[styles.timelineDate, { backgroundColor: '#dcfce7' }]}>
                  <Text style={{ color: '#15803d', fontSize: 12, fontFamily: 'ui-monospace' }}>{a.latestProgressDate}</Text>
                </View>
              </View>
            )}
          </View>
          {a.latestProgressNote && (
            <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 6, lineHeight: 17 }}>
              ⓘ {a.latestProgressNote}
            </Text>
          )}
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
                <ArticleGroupBlock key={i} group={g} c={c} onArticlePress={setActiveArticle} />
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
                  <Text style={{ color: '#1e40af', fontSize: 11, fontWeight: '600' }}>{tagLabel(t)}</Text>
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

      {/* Status detail modal */}
      <Modal visible={statusOpen} animationType="slide" onRequestClose={() => setStatusOpen(false)}>
        <View style={{ flex: 1, backgroundColor: c.background, paddingTop: 44 }}>
          <View style={[styles.modalHeader, { borderBottomColor: c.backgroundElement }]}>
            <Text style={{ color: c.text, fontWeight: '800', fontSize: 16, flex: 1 }} numberOfLines={1}>最新進展全文</Text>
            <Pressable onPress={() => setStatusOpen(false)} hitSlop={10}>
              <Ionicons name="close" size={24} color={c.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {detail?.latestStatus?.byTool && (
              <View style={[styles.toolBadge, { alignSelf: 'flex-start', marginBottom: 8 }]}>
                <Text style={styles.toolBadgeText}>AI 摘要整理（非官方文件）</Text>
              </View>
            )}
            <Text style={{ color: c.text, fontSize: 14, lineHeight: 24 }}>
              {detail?.latestStatus?.detail}
            </Text>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Article full-text viewer */}
      <Modal visible={!!activeArticle} animationType="slide" onRequestClose={() => setActiveArticle(null)}>
        <View style={{ flex: 1, backgroundColor: c.background, paddingTop: 44 }}>
          <View style={[styles.modalHeader, { borderBottomColor: c.backgroundElement }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#2563eb', fontWeight: '800', fontSize: 13 }}>{activeArticle?.num}</Text>
              <Text style={{ color: c.text, fontWeight: '700', fontSize: 15 }} numberOfLines={2}>{activeArticle?.zh}</Text>
            </View>
            <Pressable onPress={() => setActiveArticle(null)} hitSlop={10}>
              <Ionicons name="close" size={24} color={c.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
            <Text style={{ color: c.textSecondary, fontSize: 12, fontStyle: 'italic' }}>{activeArticle?.en}</Text>

            {activeArticle?.fullText ? (
              <>
                {activeArticle.fullText.original && (
                  <TextBlock c={c} label={`原文（${activeArticle.fullText.originalLang ?? '原文'}）`} text={activeArticle.fullText.original} />
                )}
                {activeArticle.fullText.en && (
                  <TextBlock c={c} label="English" text={activeArticle.fullText.en} />
                )}
                {activeArticle.fullText.zh && (
                  <TextBlock
                    c={c}
                    label="中文"
                    text={activeArticle.fullText.zh}
                    badge={activeArticle.fullText.zhSource === 'official' ? '官方翻譯' : '本工具翻譯'}
                    badgeOfficial={activeArticle.fullText.zhSource === 'official'}
                    badgeNote={activeArticle.fullText.zhSourceNote}
                  />
                )}
                {activeArticle.fullText.sourceUrl && (
                  <Pressable onPress={() => Linking.openURL(activeArticle.fullText!.sourceUrl!)} style={[styles.cta, { backgroundColor: '#2563eb' }]}>
                    <Ionicons name="open-outline" size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>官方條文來源</Text>
                  </Pressable>
                )}
              </>
            ) : (
              <View style={[styles.noTextCard, { backgroundColor: c.backgroundElement }]}>
                <Ionicons name="document-outline" size={28} color={c.textSecondary} />
                <Text style={{ color: c.text, fontWeight: '700', marginTop: 8, textAlign: 'center' }}>
                  本條全文尚未匯入
                </Text>
                <Text style={{ color: c.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
                  為確保正確性，本工具不自行生成官方條文。{'\n'}請點下方連結查閱官方文件全文。
                </Text>
                {detail?.sourceDocs?.[0] && (
                  <Pressable onPress={() => Linking.openURL(detail.sourceDocs![0].url)} style={[styles.cta, { backgroundColor: '#2563eb', marginTop: 12 }]}>
                    <Ionicons name="open-outline" size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>前往官方文件</Text>
                  </Pressable>
                )}
              </View>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function TextBlock({ c, label, text, badge, badgeOfficial, badgeNote }: { c: any; label: string; text: string; badge?: string; badgeOfficial?: boolean; badgeNote?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ color: c.textSecondary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>{label}</Text>
        {badge && (
          <View style={[styles.toolBadge, { backgroundColor: badgeOfficial ? '#dcfce7' : '#fee2e2' }]}>
            <Text style={[styles.toolBadgeText, { color: badgeOfficial ? '#15803d' : '#b91c1c' }]}>{badge}</Text>
          </View>
        )}
      </View>
      {badgeNote && <Text style={{ color: c.textSecondary, fontSize: 10 }}>{badgeNote}</Text>}
      <Text style={{ color: c.text, fontSize: 14, lineHeight: 22 }}>{text}</Text>
    </View>
  );
}

function ArticleGroupBlock({ group, c, onArticlePress }: { group: ArticleGroup; c: any; onArticlePress: (a: Article) => void }) {
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
            <Pressable key={i} style={styles.articleRow} onPress={() => onArticlePress(art)}>
              <Text style={styles.artNum}>{art.num}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.artZh, { color: c.text }]}>{art.zh}</Text>
                <Text style={[styles.artEn, { color: c.textSecondary }]}>{art.en}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={c.textSecondary} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function IndigoCard({ indigo, c }: { indigo: IndigoScore; c: any }) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(indigo.total * 100);
  const barColor = indigo.total >= 0.6 ? '#16a34a' : indigo.total >= 0.45 ? '#d97706' : '#dc2626';
  return (
    <View style={[styles.indigoCard, { backgroundColor: c.backgroundElement }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={[styles.indigoScoreBox, { backgroundColor: barColor + '22', borderColor: barColor }]}>
          <Text style={[styles.indigoScoreNum, { color: barColor }]}>{indigo.total.toFixed(2)}</Text>
          <Text style={{ color: barColor, fontSize: 9 }}>/ 1.00</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.text, fontWeight: '800', fontSize: 14 }}>INDIGO-t 數位貿易整合分數</Text>
          <Text style={{ color: c.textSecondary, fontSize: 11 }}>原始分 {indigo.raw}/{indigo.max}</Text>
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 3 }}>
            <View style={[styles.indigoTag, { backgroundColor: indigo.official ? '#dcfce7' : '#fee2e2' }]}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: indigo.official ? '#15803d' : '#b91c1c' }}>
                {indigo.official ? 'OECD 官方' : '本工具試算'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={{ color: c.textSecondary, fontSize: 10, marginTop: 6, lineHeight: 14 }}>{indigo.sourceNote}</Text>

      {indigo.domains && indigo.domains.length > 0 && (
        <>
          <Pressable onPress={() => setOpen(o => !o)} style={{ marginTop: 8 }}>
            <Text style={{ color: '#2563eb', fontSize: 12, fontWeight: '700' }}>
              {open ? '收合領域分數 ▲' : '看五大領域分數 ▼'}
            </Text>
          </Pressable>
          {open && (
            <View style={{ gap: 6, marginTop: 6 }}>
              {indigo.domains.map(d => (
                <View key={d.code}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: c.text, fontSize: 12, fontWeight: '600' }}>{d.code}. {d.name}</Text>
                    <Text style={{ color: c.textSecondary, fontSize: 11 }}>{d.raw}/{d.max} ({d.score.toFixed(2)})</Text>
                  </View>
                  <View style={{ height: 5, backgroundColor: c.background, borderRadius: 3, marginTop: 2 }}>
                    <View style={{ height: 5, borderRadius: 3, backgroundColor: '#2563eb', width: `${d.score * 100}%` }} />
                  </View>
                  {d.note && <Text style={{ color: c.textSecondary, fontSize: 10, marginTop: 1 }}>{d.note}</Text>}
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <Pressable onPress={() => router.push('/indigo-methodology')} style={{ marginTop: 8 }}>
        <Text style={{ color: '#2563eb', fontSize: 12, fontWeight: '700' }}>了解 INDIGO 方法論 →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', lineHeight: 28 },
  subtitle: { fontSize: 13, marginTop: 4 },
  fullName: { fontSize: 13, marginTop: 4, lineHeight: 18 },
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
  statusBanner: { padding: 12, borderRadius: 12, borderWidth: 1 },
  detailLink: { marginTop: 6, alignSelf: 'flex-start' },
  toolBadge: { backgroundColor: '#fee2e2', borderRadius: 999, paddingHorizontal: 6, paddingVertical: 1 },
  toolBadgeText: { fontSize: 9, fontWeight: '700', color: '#b91c1c' },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, borderRadius: 9 },
  indigoCard: { padding: 14, borderRadius: 12 },
  indigoScoreBox: { width: 56, height: 56, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  indigoScoreNum: { fontSize: 18, fontWeight: '800' },
  indigoTag: { borderRadius: 999, paddingHorizontal: 6, paddingVertical: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  noTextCard: { padding: 24, borderRadius: 12, alignItems: 'center' },
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
