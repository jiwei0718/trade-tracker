import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View, useColorScheme, useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-desktop';
import { useData } from '@/lib/data-context';
import { eventSortDate, isNewsworthy } from '@/lib/data-source';
import {
  buildGlobeModel, middle, shownAgreements,
  type Basis, type GlobeAgreement, type GlobeCamera, type GlobeFilter, type GlobeFocus, type GlobeModel,
} from '@/lib/globe-data';
import { STATUS_COLORS, STATUS_LABELS, TYPE_LABELS, type AgreementStatus, type AgreementType } from '@/data/types';
import { countryByCode } from '@/data/countries';
import { orgByCode } from '@/data/organizations';
import { placeNote, pointOf } from '@/data/geo';
import StatusBadge from '@/components/status-badge';
import YearSlider from '@/components/year-slider';

// three.js is large: load the globe only when this tab opens.
const GlobeView = lazy(() => import('@/components/globe/globe-view'));

const MIN_YEAR = 1947;
const THIS_YEAR = new Date().getFullYear();
const PULSE_DAYS = 30;
const NO_PULSE: string[] = [];
const PLAY_STEP_MS = 450;
const LIST_LIMIT = 30;
const HOME: Omit<GlobeCamera, 'seq'> = { lat: 22, lng: 121, altitude: 2.3 };
const LEGEND: AgreementStatus[] = ['in_force', 'signed', 'concluded', 'negotiating', 'suspended', 'expired', 'superseded', 'cancelled'];
const ENDED: (AgreementStatus | undefined)[] = ['expired', 'superseded', 'cancelled', 'suspended'];

type Palette = (typeof Colors)['light' | 'dark'];

export default function GlobeTab() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const desktop = useIsDesktop();
  const { height } = useWindowDimensions();
  const { agreements, events, loading } = useData();

  const [year, setYear] = useState<number | null>(null);
  const [basis, setBasis] = useState<Basis>('in_force');
  const [historic, setHistoric] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [choropleth, setChoropleth] = useState(true);
  const [pulseOn, setPulseOn] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [focus, setFocus] = useState<GlobeFocus | null>(null);
  const [camera, setCamera] = useState<GlobeCamera | null>(null);

  const model = useMemo(() => buildGlobeModel(agreements), [agreements]);
  const filter = useMemo<GlobeFilter>(
    () => ({ year, basis, historic, types: type ? [type] : [] }),
    [year, basis, historic, type],
  );
  const shown = useMemo(() => shownAgreements(model, filter), [model, filter]);

  // Timeline playback: one year per step, ending on today's picture.
  const yearRef = useRef(year);
  yearRef.current = year;
  useEffect(() => {
    if (!playing) return;
    if (yearRef.current == null) setYear(MIN_YEAR);
    const t = setInterval(() => {
      const next = (yearRef.current ?? MIN_YEAR) + 1;
      if (next > THIS_YEAR) { setPlaying(false); setYear(null); } else setYear(next);
    }, PLAY_STEP_MS);
    return () => clearInterval(t);
  }, [playing]);

  // News in the last 30 days: counted per country or bloc for the side panel, and pulsed on the
  // globe where the agreement is drawn (both ends of a pair, or the middle of a many-party one,
  // so one WTO document does not light up seventy countries).
  const { recent, pulse } = useMemo(() => {
    const cutoff = new Date(Date.now() - PULSE_DAYS * 864e5).toISOString().slice(0, 10);
    const byNode = new Map<string, number>();
    const spots = new Set<string>();
    for (const e of events) {
      const a = e.agreementId ? model.agreements[e.agreementId] : undefined;
      if (!a || !isNewsworthy(e) || eventSortDate(e) < cutoff) continue;
      a.nodes.forEach(code => byNode.set(code, (byNode.get(code) ?? 0) + 1));
      if (a.nodes.length > 2) spots.add(a.id);
      else a.nodes.forEach(code => spots.add(code));
    }
    return { recent: byNode, pulse: [...spots] };
  }, [events, model]);

  const fly = useCallback((f: GlobeFocus | null, altitude = 2.4) => {
    setFocus(f);
    const at = f ? focusPoint(model, f) : HOME;
    if (at) setCamera(prev => ({ ...at, altitude: f ? altitude : HOME.altitude, seq: (prev?.seq ?? 0) + 1 }));
  }, [model]);

  const onSelect = useCallback(async (f: GlobeFocus | null) => setFocus(f), []);

  // Opened from a country, organization or agreement page (「在地球儀上查看」): select it and fly
  // there, on today's picture, including ended agreements when the selection is one.
  const params = useLocalSearchParams<{ focus?: string; t?: string }>();
  useEffect(() => {
    const m = /^(node|agreement):(.+)$/.exec(params.focus ?? '');
    if (!m || !agreements.length) return;
    const f: GlobeFocus = { kind: m[1] as GlobeFocus['kind'], id: m[2] };
    setPlaying(false);
    setYear(null);
    setType(null);
    if (f.kind === 'agreement' && ENDED.includes(model.agreements[f.id]?.status)) setHistoric(true);
    fly(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.focus, params.t, agreements.length]);

  const types = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of Object.values(model.agreements)) m.set(a.type, (m.get(a.type) ?? 0) + 1);
    return [...m.entries()].sort((x, y) => y[1] - x[1]);
  }, [model]);

  const globeHeight = desktop ? undefined : Math.min(460, Math.round(height * 0.5));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: c.backgroundElement }]}>
        <Text style={[styles.title, { color: c.text }]}>地球儀</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>
          拖拉旋轉、滾輪或雙指縮放;點國家、集團或弧線查看協定
        </Text>
      </View>

      <View style={{ flex: 1, flexDirection: desktop ? 'row' : 'column' }}>
        <View style={[styles.globeArea, desktop ? { flex: 1 } : { height: globeHeight }]}>
          {agreements.length === 0 ? (
            <Centered text={loading ? '載入協定資料…' : '沒有協定資料'} />
          ) : (
            <GlobeErrorBoundary>
            <Suspense fallback={<Centered text="載入地球儀…" />}>
              <GlobeView
                model={model}
                filter={filter}
                focus={focus}
                pulse={pulseOn ? pulse : NO_PULSE}
                choropleth={choropleth}
                camera={camera}
                onSelect={onSelect}
                dom={{ style: { flex: 1 } }}
              />
            </Suspense>
            </GlobeErrorBoundary>
          )}
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{year ?? '今天'}</Text>
          </View>
        </View>

        <ScrollView
          style={desktop ? { width: 380, flexGrow: 0, flexShrink: 0, borderLeftWidth: 1, borderLeftColor: c.backgroundElement } : { flex: 1 }}
          contentContainerStyle={{ padding: 14, gap: 14 }}>
          {/* Timeline */}
          <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
            <View style={styles.rowBetween}>
              <Pressable
                onPress={() => setPlaying(p => !p)}
                style={[styles.playBtn, { backgroundColor: '#2563eb' }]}
                accessibilityLabel={playing ? '暫停' : '播放時間軸'}>
                <Ionicons name={playing ? 'pause' : 'play'} size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '700' }}>{playing ? '暫停' : '播放'}</Text>
              </Pressable>
              <Segmented
                c={c}
                value={basis}
                options={[['in_force', '依生效年'], ['signed', '依簽署年']]}
                onChange={v => setBasis(v as Basis)}
              />
            </View>
            <YearSlider
              min={MIN_YEAR}
              max={THIS_YEAR}
              value={year ?? THIS_YEAR}
              onChange={setYear}
              onGrab={() => setPlaying(false)}
            />
            <View style={styles.rowBetween}>
              <Text style={{ color: c.textSecondary, fontSize: 12, flex: 1 }}>
                {year == null
                  ? '目前的協定(含已簽署、談判中)'
                  : `${year} 年${basis === 'in_force' ? '已生效' : '已簽署'}且尚未失效的協定`}
              </Text>
              {year != null && (
                <Pressable onPress={() => { setPlaying(false); setYear(null); }}>
                  <Text style={styles.link}>回到今天</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Layers and filters */}
          <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
            <Toggle c={c} label="顯示已失效、暫停或被取代的協定" value={historic} onChange={setHistoric} disabled={year != null} />
            <Toggle c={c} label="依協定數量為國家上色" value={choropleth} onChange={setChoropleth} />
            <Toggle c={c} label={`最近 ${PULSE_DAYS} 天有動態的地方(${pulse.length} 處)`} value={pulseOn} onChange={setPulseOn} />
            <View style={styles.chips}>
              <Chip c={c} label="全部類型" active={!type} onPress={() => setType(null)} />
              {types.map(([t, n]) => (
                <Chip key={t} c={c} label={`${TYPE_LABELS[t as AgreementType] ?? t} ${n}`} active={type === t} onPress={() => setType(type === t ? null : t)} />
              ))}
            </View>
            <View style={styles.rowBetween}>
              <Pressable onPress={() => fly({ kind: 'node', id: 'TW' })} style={[styles.actionBtn, { borderColor: c.backgroundSelected }]}>
                <Ionicons name="location" size={14} color="#2563eb" />
                <Text style={styles.link}>臺灣視角</Text>
              </Pressable>
              <Pressable onPress={() => fly(null)} style={[styles.actionBtn, { borderColor: c.backgroundSelected }]}>
                <Ionicons name="refresh" size={14} color="#2563eb" />
                <Text style={styles.link}>重設視角</Text>
              </Pressable>
            </View>
          </View>

          {focus ? (
            <FocusPanel
              c={c}
              model={model}
              focus={focus}
              shown={shown}
              recent={recent}
              onFocus={f => fly(f)}
              onClose={() => setFocus(null)}
            />
          ) : (
            <Overview c={c} model={model} shown={shown} />
          )}
          <Text style={{ color: c.textSecondary, fontSize: 11, lineHeight: 16 }}>
            國界:Natural Earth(公有領域);地球繪製:globe.gl、three.js(MIT 授權)。集團畫在總部或成員國中心,
            三方以上的協定從各締約方連到協定中心點。
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/** Where the camera should look for a selection. */
function focusPoint(m: GlobeModel, f: GlobeFocus): { lat: number; lng: number } | null {
  if (f.kind === 'node') {
    // A country reached only through its blocs has no node of its own.
    const p = m.nodes[f.id] ?? pointOf(f.id);
    return p ? ('lat' in p ? p : { lat: p[0], lng: p[1] }) : null;
  }
  if (f.kind === 'agreement') {
    const hub = m.hubs.find(h => h.id === f.id);
    if (hub) return hub;
    const first = m.agreements[f.id]?.nodes[0];
    return first ? m.nodes[first] : null;
  }
  const [x, y] = f.id.split('~').map(code => m.nodes[code]);
  if (!x || !y) return null;
  const [lat, lng] = middle([[x.lat, x.lng], [y.lat, y.lng]]);
  return { lat, lng };
}

const yearOf = (a: GlobeAgreement) => a.inForce ?? a.signed ?? 0;
const byYearDesc = (x: GlobeAgreement, y: GlobeAgreement) => yearOf(y) - yearOf(x);

/** Heading for a country or bloc: Chinese name with the original. */
function nodeTitle(m: GlobeModel, code: string): { zh: string; original?: string } {
  const org = orgByCode(code);
  if (org) return { zh: org.nameZh, original: org.name };
  const country = countryByCode(code);
  if (country) return { zh: country.zh, original: country.en };
  const n = m.nodes[code];
  return { zh: n?.nameZh ?? code, original: n && n.name !== n.nameZh ? n.name : undefined };
}

function Overview({ c, model, shown }: { c: Palette; model: GlobeModel; shown: Map<string, AgreementStatus> }) {
  const [open, setOpen] = useState(false);
  const off = model.offGlobe.filter(o => shown.has(o.id));
  const drawn = [...shown.entries()].filter(([id]) => model.agreements[id].nodes.length > 0);
  const byStatus = new Map<AgreementStatus, number>();
  drawn.forEach(([, s]) => byStatus.set(s, (byStatus.get(s) ?? 0) + 1));

  return (
    <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
      <Text style={[styles.cardTitle, { color: c.text }]}>地球上的 {drawn.length} 個協定</Text>
      <View style={{ gap: 6 }}>
        {LEGEND.filter(s => byStatus.has(s)).map(s => (
          <View key={s} style={styles.legendRow}>
            <View style={[styles.legendLine, { backgroundColor: STATUS_COLORS[s] }]} />
            <Text style={{ color: c.text, fontSize: 13, flex: 1 }}>{STATUS_LABELS[s]}</Text>
            <Text style={{ color: c.textSecondary, fontSize: 12 }}>{byStatus.get(s)}</Text>
          </View>
        ))}
      </View>
      <Text style={{ color: c.textSecondary, fontSize: 12, lineHeight: 18 }}>
        弧線越粗,代表同一對國家或集團之間的協定越多。紫色標籤是集團,點選後會標出成員國。
      </Text>
      {off.length > 0 && (
        <>
          <Pressable onPress={() => setOpen(o => !o)} style={styles.rowBetween}>
            <Text style={{ color: c.text, fontSize: 13, fontWeight: '700' }}>沒有畫在地球上的協定({off.length})</Text>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={c.textSecondary} />
          </Pressable>
          {open && off
            .map(o => ({ o, a: model.agreements[o.id] }))
            .sort((x, y) => byYearDesc(x.a, y.a))
            .map(({ o, a }) => (
              <AgreementRow key={o.id} c={c} a={a} status={shown.get(o.id)!} note={o.reason} />
            ))}
        </>
      )}
    </View>
  );
}

type Section = { label: string; items: GlobeAgreement[] };

/** Heading and agreement lists for the selection (a plain function: no reassigned locals in render). */
function describeFocus(model: GlobeModel, focus: GlobeFocus, shown: Map<string, AgreementStatus>): {
  title: { zh: string; original?: string }; sections: Section[];
} {
  const pick = (ids: string[]) => ids.filter(id => shown.has(id)).map(id => model.agreements[id]).sort(byYearDesc);
  if (focus.kind === 'node') {
    const code = focus.id;
    const ids = [...shown.keys()].filter(id => model.agreements[id].reach.includes(code));
    const isDirect = (id: string) => model.agreements[id].parties.includes(code) || model.agreements[id].nodes.includes(code);
    const direct = ids.filter(isDirect);
    const via = ids.filter(id => !isDirect(id));
    return {
      title: nodeTitle(model, code),
      sections: [
        { label: model.nodes[code]?.group ? '以集團名義簽署' : '直接簽署', items: pick(direct) },
        { label: '透過所屬集團', items: pick(via) },
      ],
    };
  }
  if (focus.kind === 'link') {
    const [x, y] = focus.id.split('~');
    const ids = [...shown.keys()].filter(id => model.agreements[id].nodes.includes(x) && model.agreements[id].nodes.includes(y));
    return { title: { zh: `${model.nodes[x]?.nameZh ?? x} – ${model.nodes[y]?.nameZh ?? y}` }, sections: [{ label: '協定', items: pick(ids) }] };
  }
  const a = model.agreements[focus.id];
  return { title: { zh: a?.nameZh ?? focus.id, original: a && a.name !== a.nameZh ? a.name : undefined }, sections: [] };
}

/** Cut the lists to `limit` agreements in total, keeping their order. */
function limitSections(sections: Section[], limit: number): Section[] {
  const out: Section[] = [];
  let left = limit;
  for (const s of sections) {
    if (!s.items.length) continue;
    const items = s.items.slice(0, Math.max(0, left));
    left -= items.length;
    out.push({ label: `${s.label}(${s.items.length})`, items });
  }
  return out;
}

function NodeExtra({ c, model, code, recent, onFocus }: {
  c: Palette; model: GlobeModel; code: string; recent: Map<string, number>; onFocus: (f: GlobeFocus) => void;
}) {
  const node = model.nodes[code];
  const note = placeNote(code);
  const org = orgByCode(code);
  const country = org ? undefined : countryByCode(code);
  const page = org ? `/org/${org.code}` : country ? `/country/${code}` : null;
  return (
    <View style={{ gap: 8 }}>
      {note && <Text style={{ color: c.textSecondary, fontSize: 12 }}>地球上的位置:{note}</Text>}
      {node?.nameByTool && (
        <Text style={{ color: c.textSecondary, fontSize: 12 }}>
          中文名稱為本工具翻譯(AI 翻譯):依原文逐詞翻譯,組織名稱採臺灣常見譯法,未找到官方譯名。
        </Text>
      )}
      {recent.get(code) ? (
        <Text style={{ color: '#ea580c', fontSize: 12 }}>最近 {PULSE_DAYS} 天有 {recent.get(code)} 則相關動態</Text>
      ) : null}
      {node?.group && node.members.length > 0 && (
        <View style={styles.chips}>
          {node.members.map(m => (
            <Chip key={m} c={c} label={countryByCode(m)?.zh ?? model.nodes[m]?.nameZh ?? m} onPress={() => onFocus({ kind: 'node', id: m })} />
          ))}
        </View>
      )}
      {page && (
        <Pressable onPress={() => router.push(page as any)}>
          <Text style={styles.link}>{country ? '開啟國家頁' : '開啟組織頁'} ›</Text>
        </Pressable>
      )}
    </View>
  );
}

function AgreementExtra({ c, model, id, shown, onFocus }: {
  c: Palette; model: GlobeModel; id: string; shown: Map<string, AgreementStatus>; onFocus: (f: GlobeFocus) => void;
}) {
  const a = model.agreements[id];
  if (!a) return null;
  const status = shown.get(a.id);
  return (
    <View style={{ gap: 8 }}>
      {status && <StatusBadge status={status} size="s" />}
      <View style={styles.chips}>
        {a.nodes.map(code => (
          <Chip key={code} c={c} label={model.nodes[code]?.nameZh ?? code} onPress={() => onFocus({ kind: 'node', id: code })} />
        ))}
      </View>
      <Pressable onPress={() => router.push(`/agreement/${a.id}`)}>
        <Text style={styles.link}>開啟協定頁 ›</Text>
      </Pressable>
    </View>
  );
}

function FocusPanel({ c, model, focus, shown, recent, onFocus, onClose }: {
  c: Palette; model: GlobeModel; focus: GlobeFocus; shown: Map<string, AgreementStatus>; recent: Map<string, number>;
  onFocus: (f: GlobeFocus) => void; onClose: () => void;
}) {
  const [all, setAll] = useState(false);
  useEffect(() => setAll(false), [focus]);

  const { title, sections } = describeFocus(model, focus, shown);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const visible = limitSections(sections, all ? Infinity : LIST_LIMIT);

  return (
    <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: c.text }]}>{title.zh}</Text>
          {title.original && <Text style={{ color: c.textSecondary, fontSize: 12 }}>{title.original}</Text>}
        </View>
        <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="取消選取">
          <Ionicons name="close" size={20} color={c.textSecondary} />
        </Pressable>
      </View>
      {focus.kind === 'node' && <NodeExtra c={c} model={model} code={focus.id} recent={recent} onFocus={onFocus} />}
      {focus.kind === 'agreement' && <AgreementExtra c={c} model={model} id={focus.id} shown={shown} onFocus={onFocus} />}
      {focus.kind !== 'agreement' && total === 0 && (
        <Text style={{ color: c.textSecondary, fontSize: 13 }}>目前的篩選條件下沒有協定。</Text>
      )}
      {visible.map(s => (
        <View key={s.label} style={{ gap: 6 }}>
          <Text style={{ color: c.textSecondary, fontSize: 12, fontWeight: '700' }}>{s.label}</Text>
          {s.items.map(a => (
            <AgreementRow key={a.id} c={c} a={a} status={shown.get(a.id)!}
              onLocate={a.nodes.length ? () => onFocus({ kind: 'agreement', id: a.id }) : undefined} />
          ))}
        </View>
      ))}
      {!all && total > LIST_LIMIT && (
        <Pressable onPress={() => setAll(true)}>
          <Text style={styles.link}>顯示全部 {total} 個協定</Text>
        </Pressable>
      )}
    </View>
  );
}

function AgreementRow({ c, a, status, note, onLocate }: {
  c: Palette; a: GlobeAgreement; status: AgreementStatus; note?: string; onLocate?: () => void;
}) {
  const when = a.inForce ? `${a.inForce} 年生效` : a.signed ? `${a.signed} 年簽署` : null;
  return (
    <Pressable
      onPress={() => router.push(`/agreement/${a.id}`)}
      style={({ pressed }) => [styles.agRow, { backgroundColor: pressed ? c.backgroundSelected : c.background }]}>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ color: c.text, fontSize: 13, fontWeight: '600' }}>{a.nameZh}</Text>
        {a.name !== a.nameZh && <Text style={{ color: c.textSecondary, fontSize: 11 }}>{a.name}</Text>}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <StatusBadge status={status} size="s" />
          {when && <Text style={{ color: c.textSecondary, fontSize: 11 }}>{when}</Text>}
          {note && <Text style={{ color: c.textSecondary, fontSize: 11 }}>{note}</Text>}
        </View>
      </View>
      {onLocate && (
        <Pressable onPress={onLocate} hitSlop={8} accessibilityLabel="在地球上標出">
          <Ionicons name="locate-outline" size={18} color="#2563eb" />
        </Pressable>
      )}
    </Pressable>
  );
}

function Toggle({ c, label, value, onChange, disabled }: {
  c: Palette; label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <View style={[styles.rowBetween, disabled && { opacity: 0.45 }]}>
      <Text style={{ color: c.text, fontSize: 13, flex: 1 }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} disabled={disabled} />
    </View>
  );
}

function Chip({ c, label, active, onPress }: { c: Palette; label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? '#2563eb' : c.background, borderColor: active ? '#2563eb' : c.backgroundSelected }]}>
      <Text style={{ color: active ? '#fff' : c.text, fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}

function Segmented({ c, value, options, onChange }: {
  c: Palette; value: string; options: [string, string][]; onChange: (v: string) => void;
}) {
  return (
    <View style={[styles.segment, { borderColor: c.backgroundSelected }]}>
      {options.map(([v, label]) => (
        <Pressable key={v} onPress={() => onChange(v)} style={[styles.segmentItem, value === v && { backgroundColor: '#2563eb' }]}>
          <Text style={{ color: value === v ? '#fff' : c.text, fontSize: 12 }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/** If the 3D globe fails to load or crashes, keep the page usable and say so. */
class GlobeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }}>
        <Text style={{ color: '#cbd5e1', textAlign: 'center', lineHeight: 22 }}>
          3D 地球無法顯示。旁邊的時間軸、篩選與協定清單仍可使用。
        </Text>
        <Pressable onPress={() => this.setState({ failed: false })}>
          <Text style={styles.link}>重試</Text>
        </Pressable>
      </View>
    );
  }
}

function Centered({ text }: { text: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <ActivityIndicator color="#93c5fd" />
      <Text style={{ color: '#cbd5e1' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  globeArea: { position: 'relative', backgroundColor: '#020617', overflow: 'hidden' },
  yearBadge: { pointerEvents: 'none', position: 'absolute', left: 16, bottom: 14, backgroundColor: 'rgba(15,23,42,0.75)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  yearText: { color: '#f8fafc', fontSize: 26, fontWeight: '800', fontVariant: ['tabular-nums'] },
  card: { borderRadius: 12, padding: 12, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  segment: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  segmentItem: { paddingHorizontal: 10, paddingVertical: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  link: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendLine: { width: 22, height: 4, borderRadius: 2 },
  agRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10 },
});
