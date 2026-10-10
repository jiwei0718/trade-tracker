'use dom';

/**
 * 3D 地球(Expo DOM 元件):電腦版直接執行,Android 版在 WebView 裡執行。
 * 只負責畫圖與回報點選;篩選、側欄與換頁都在外層的原生畫面處理。
 *
 * 使用的免費資源:globe.gl / three.js(MIT 授權)、Natural Earth 國界(公有領域,經 world-atlas 提供)。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { MeshPhongMaterial } from 'three';
import { feature } from 'topojson-client';
import countries110 from 'world-atlas/countries-110m.json';

import { STATUS_COLORS, type AgreementStatus } from '@/data/types';
import { codeForFeature, pointOf } from '@/data/geo';
import { countryByCode } from '@/data/countries';
import {
  bestStatus, involves, shownAgreements,
  type GlobeCamera, type GlobeFilter, type GlobeFocus, type GlobeLink, type GlobeModel, type GlobeNode,
} from '@/lib/globe-data';

interface Props {
  model: GlobeModel;
  filter: GlobeFilter;
  focus: GlobeFocus | null;
  /** Node codes (or hub agreement ids) with news in the last 30 days: drawn with pulsing rings. */
  pulse: string[];
  /** Shade countries by how many agreements they have. */
  choropleth: boolean;
  camera: GlobeCamera | null;
  onSelect: (focus: GlobeFocus | null) => Promise<void>;
  dom?: import('expo/dom').DOMProps;
}

/** A line drawn for a selection: to a partner, or (member) between a bloc and a member. */
interface FocusArc {
  id: string; a: string; b: string;
  startLat: number; startLng: number; endLat: number; endLng: number;
  member: boolean;
  ids: string[];
}

/** Position of a node, or of a bloc member that is not itself a party anywhere. */
function place(m: GlobeModel, code: string): [number, number] | null {
  const n = m.nodes[code];
  return n ? [n.lat, n.lng] : pointOf(code);
}

interface CountryFeature { type: 'Feature'; id?: string; properties: { name: string }; geometry: object; code?: string }

const topo = countries110 as any;
const FEATURES: CountryFeature[] = (feature(topo, topo.objects.countries) as any).features.map((f: CountryFeature) => ({
  ...f, code: codeForFeature(f.id, f.properties?.name),
}));
const POLYGON_CODES = new Set(FEATURES.map(f => f.code).filter(Boolean));

const GLOBE_MATERIAL = new MeshPhongMaterial({ color: '#0b1a33', emissive: '#050d1c', shininess: 6 });
const SPACE = '#020617';
const LAND = 'rgba(51, 65, 85, 0.85)';
const AUTO_ROTATE_RESUME_MS = 30_000;

const CAMERA_FOV = 50; // globe.gl's default vertical field of view, degrees

/**
 * Camera altitude (in globe radii) at which the whole globe fits the view with some margin.
 * A narrow, tall view (phone, small window) needs the camera further out than a wide one.
 */
function fitAltitude(w: number, h: number): number {
  if (!w || !h) return 0;
  const half = ((CAMERA_FOV / 2) * Math.PI) / 180;
  const horizontal = Math.atan(Math.tan(half) * (w / h));
  return 1 / Math.sin(0.72 * Math.min(half, horizontal)) - 1;
}

/** Can this browser draw 3D at all (WebGL switched off, very old graphics driver...)? */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** '#16a34a' → 'rgba(22, 163, 74, a)': the globe's shaders do not read 8-digit hex colours. */
function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Dark blue → light blue by share of the busiest country (log scale). */
function shade(n: number, max: number): string {
  if (!n) return LAND;
  const t = Math.log1p(n) / Math.log1p(max);
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgba(${mix(30, 96)}, ${mix(64, 165)}, ${mix(110, 250)}, 0.92)`;
}

function tip(title: string, lines: string[]): string {
  const esc = (s: string) => s.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]!));
  return `<div style="background:rgba(15,23,42,.92);color:#e2e8f0;padding:6px 10px;border-radius:8px;font:12px/1.5 system-ui,sans-serif;max-width:280px">`
    + `<b>${esc(title)}</b>${lines.map(l => `<br>${esc(l)}`).join('')}</div>`;
}

/** Keep one object per id across renders, so the globe only animates what really changed. */
function useStable<T extends { id: string }>(items: T[]): T[] {
  const cache = useRef(new Map<string, T>());
  return useMemo(() => items.map(it => {
    const prev = cache.current.get(it.id);
    if (prev) return prev;
    cache.current.set(it.id, it);
    return it;
  }), [items]);
}

export default function GlobeView({ model, filter, focus, pulse, choropleth, camera, onSelect }: Props) {
  const globe = useRef<GlobeMethods | undefined>(undefined);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const [webgl] = useState(hasWebGL);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shown = useMemo(() => shownAgreements(model, filter), [model, filter]);

  // Agreements in the current selection (null: everything shown).
  const focusIds = useMemo<Set<string> | null>(() => {
    if (!focus) return null;
    if (focus.kind === 'agreement') return new Set([focus.id]);
    if (focus.kind === 'link') {
      const [x, y] = focus.id.split('~');
      return new Set([...shown.keys()].filter(id => model.agreements[id].nodes.includes(x) && model.agreements[id].nodes.includes(y)));
    }
    return new Set([...shown.keys()].filter(id => involves(model.agreements[id], focus.id)));
  }, [focus, shown, model]);

  // A selected country, bloc or pair: lines straight to each partner (instead of to the middle of
  // a many-party agreement), plus dashed lines between a bloc and its members.
  const focusArcsRaw = useMemo<FocusArc[]>(() => {
    if (!focusIds || (focus?.kind !== 'node' && focus?.kind !== 'link')) return [];
    const out = new Map<string, FocusArc>();
    const add = (from: string, to: string, id: string | null) => {
      const f = place(model, from), t = place(model, to);
      if (!f || !t || from === to) return;
      const key = `${id ? 'f' : 'm'}:${from}>${to}`;
      let arc = out.get(key);
      if (!arc) {
        arc = { id: key, a: from, b: to, startLat: f[0], startLng: f[1], endLat: t[0], endLng: t[1], member: !id, ids: [] };
        out.set(key, arc);
      }
      if (id) arc.ids.push(id);
    };
    if (focus.kind === 'link') {
      const [x, y] = focus.id.split('~');
      focusIds.forEach(id => add(x, y, id));
      return [...out.values()];
    }
    const x = focus.id;
    for (const id of focusIds) {
      const a = model.agreements[id];
      if (a.nodes.includes(x)) { a.nodes.forEach(n => add(x, n, id)); continue; }
      for (const g of a.nodes) {
        if (!model.nodes[g]?.members.includes(x)) continue;
        a.nodes.forEach(n => add(g, n, id));
        add(x, g, null);
      }
    }
    model.nodes[x]?.members.forEach(m => add(x, m, null));
    return [...out.values()];
  }, [focus, focusIds, model]);
  const focusArcs = useStable(focusArcsRaw);

  const links = useStable(model.links);
  const arcState = useMemo(() => {
    const m = new Map<string, { status: AgreementStatus | null; count: number }>();
    if (focusArcsRaw.length) {
      for (const arc of focusArcsRaw) {
        m.set(arc.id, arc.member
          ? { status: null, count: 0 }
          : { status: bestStatus(arc.ids.map(id => shown.get(id)!)), count: arc.ids.length });
      }
      return m;
    }
    for (const l of links) {
      const ids = l.agreementIds.filter(id => shown.has(id) && (!focusIds || focusIds.has(id)));
      const status = bestStatus(ids.map(id => shown.get(id)!));
      if (status) m.set(l.id, { status, count: ids.length });
    }
    return m;
  }, [focusArcsRaw, links, shown, focusIds]);
  const arcs = useMemo<(GlobeLink | FocusArc)[]>(
    () => (focusArcsRaw.length ? focusArcs : links.filter(l => arcState.has(l.id))),
    [focusArcsRaw, focusArcs, links, arcState],
  );
  const starView = !focusArcsRaw.length;

  // Countries and blocs that take part in what is drawn.
  const active = useMemo(() => {
    const s = new Set<string>();
    for (const l of arcs) { s.add(l.a); if (!('spoke' in l && l.spoke)) s.add(l.b); }
    for (const n of Object.values(model.nodes)) {
      if (n.internal.some(id => shown.has(id) && (!focusIds || focusIds.has(id)))) s.add(n.code);
    }
    if (focus?.kind === 'node') s.add(focus.id);
    return s;
  }, [arcs, model, shown, focusIds, focus]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const id of shown.keys()) for (const code of model.agreements[id].reach) m.set(code, (m.get(code) ?? 0) + 1);
    return m;
  }, [shown, model]);
  const maxCount = useMemo(() => Math.max(1, ...[...counts.entries()].filter(([c]) => POLYGON_CODES.has(c)).map(([, n]) => n)), [counts]);

  // Countries lit up on the map: a selected bloc's members, or every party of a selected agreement.
  const focusMembers = useMemo(() => {
    if (focus?.kind === 'agreement') return new Set(model.agreements[focus.id]?.reach ?? []);
    if (focus?.kind !== 'node') return new Set<string>();
    return new Set(model.nodes[focus.id]?.members ?? []);
  }, [focus, model]);

  const hubs = useStable(model.hubs);
  const points = useMemo(() => {
    const small = Object.values(model.nodes).filter(n => !n.group && !POLYGON_CODES.has(n.code) && active.has(n.code));
    const hubPoints = starView ? hubs.filter(h => shown.has(h.id) && (!focusIds || focusIds.has(h.id))) : [];
    return [...small, ...hubPoints] as (GlobeNode | (typeof hubs)[number])[];
  }, [model, active, hubs, shown, focusIds, starView]);

  // Bloc labels. Without a selection only the busiest blocs are named (fewer on a phone), so the
  // labels do not bury the map; a selection names every bloc it involves.
  const narrow = size.w > 0 && size.w < 600;
  const labels = useMemo(() => {
    let groups = Object.values(model.nodes).filter(n => n.group && active.has(n.code));
    if (!focus) {
      const busy = (n: GlobeNode) => [...shown.keys()].filter(id => model.agreements[id].nodes.includes(n.code)).length;
      groups = groups.map(n => ({ n, k: busy(n) })).sort((x, y) => y.k - x.k).slice(0, narrow ? 8 : 24).map(x => x.n);
    }
    const named = focus?.kind === 'node' && model.nodes[focus.id] && !model.nodes[focus.id].group ? [model.nodes[focus.id]] : [];
    return [...groups, ...named].map(n => ({ ...n, id: `${n.code}:${focus?.id === n.code ? 1 : 0}` }));
  }, [model, active, focus, shown, narrow]);

  const rings = useMemo(
    () => pulse.map(id => model.nodes[id] ?? model.hubs.find(h => h.id === id)).filter(Boolean),
    [pulse, model],
  );

  // Slow spin while idle; stops when the user drags or selects something.
  const setAutoRotate = (on: boolean) => {
    const c = globe.current?.controls() as any;
    if (c) c.autoRotate = on;
  };
  useEffect(() => {
    clearTimeout(resumeTimer.current);
    setAutoRotate(!focus);
  }, [focus]);

  useEffect(() => {
    if (camera) globe.current?.pointOfView({ lat: camera.lat, lng: camera.lng, altitude: Math.max(camera.altitude, fitAltitude(size.w, size.h)) }, 1200);
  }, [camera]);

  const onReady = () => {
    const g = globe.current;
    if (!g) return;
    // Opened with a selection (from another page): start there instead of over Taiwan.
    const start = camera ?? { lat: 22, lng: 121, altitude: 2.2 };
    g.pointOfView({ lat: start.lat, lng: start.lng, altitude: Math.max(start.altitude, fitAltitude(size.w, size.h)) });
    const c = g.controls() as any;
    c.autoRotateSpeed = 0.35;
    c.autoRotate = !focus;
    c.addEventListener('start', () => { clearTimeout(resumeTimer.current); c.autoRotate = false; });
    c.addEventListener('end', () => {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => { if (!focusRef.current) c.autoRotate = true; }, AUTO_ROTATE_RESUME_MS);
    });
  };
  const focusRef = useRef(focus);
  focusRef.current = focus;

  const name = (code: string) => model.nodes[code]?.nameZh ?? countryByCode(code)?.zh ?? code;
  const select = (f: GlobeFocus | null) => { void onSelect(f); };

  return (
    <div ref={box} style={{ position: 'absolute', inset: 0, background: SPACE, overflow: 'hidden' }}>
      {!webgl && (
        <div style={{ color: '#cbd5e1', font: '14px/1.6 system-ui, sans-serif', padding: 24, textAlign: 'center', marginTop: '30%' }}>
          這台電腦的瀏覽器無法顯示 3D 畫面(WebGL 未啟用)。<br />旁邊的時間軸、篩選與協定清單仍可使用。
        </div>
      )}
      {webgl && size.w > 0 && (
        <Globe
          ref={globe}
          width={size.w}
          height={size.h}
          backgroundColor={SPACE}
          globeMaterial={GLOBE_MATERIAL}
          showAtmosphere
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.16}
          onGlobeReady={onReady}
          onGlobeClick={() => select(null)}

          polygonsData={FEATURES}
          polygonGeoJsonGeometry="geometry"
          polygonAltitude={(d: any) => (d.code && (d.code === focus?.id || d.code === hover) ? 0.018 : 0.006)}
          polygonCapColor={(d: any) => {
            const code = d.code as string | undefined;
            if (code && focus?.kind === 'node' && code === focus.id) return 'rgba(250, 204, 21, 0.9)';
            if (code && focusMembers.has(code)) return 'rgba(250, 204, 21, 0.45)';
            if (code && code === hover) return 'rgba(148, 163, 184, 0.95)';
            return choropleth && code ? shade(counts.get(code) ?? 0, maxCount) : LAND;
          }}
          polygonSideColor={() => 'rgba(15, 23, 42, 0.6)'}
          polygonStrokeColor={() => 'rgba(148, 163, 184, 0.35)'}
          polygonsTransitionDuration={250}
          polygonLabel={(d: any) => d.code
            ? tip(name(d.code), [`${counts.get(d.code) ?? 0} 個協定(含所屬集團)`])
            : tip(d.properties.name, ['不在本工具的國家清單'])}
          onPolygonHover={(d: any) => setHover(d?.code ?? null)}
          onPolygonClick={(d: any) => d.code && select({ kind: 'node', id: d.code })}

          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={(d: any) => {
            if (d.member) return 'rgba(250, 204, 21, 0.8)';
            const st = arcState.get(d.id)?.status;
            if (!st) return 'rgba(0, 0, 0, 0)';
            return rgba(STATUS_COLORS[st], focus ? 0.95 : d.spoke ? 0.45 : 0.7);
          }}
          arcStroke={(d: any) => {
            if (d.member) return 0.08;
            const n = arcState.get(d.id)?.count ?? 1;
            if (d.spoke) return focus ? 0.22 : 0.1;
            return Math.min(0.8, 0.12 + 0.12 * Math.log2(n));
          }}
          arcAltitudeAutoScale={0.3}
          arcDashLength={(d: any) => (d.member ? 0.04 : focus ? 0.5 : 1)}
          arcDashGap={(d: any) => (d.member ? 0.04 : focus ? 0.15 : 0)}
          arcDashAnimateTime={(d: any) => (d.member ? 6000 : focus ? 2500 : 0)}
          arcsTransitionDuration={700}
          arcLabel={(d: any) => {
            if (d.member) {
              const [bloc, member] = model.nodes[d.a]?.group ? [d.a, d.b] : [d.b, d.a];
              return tip(`${name(member)}是${name(bloc)}的成員`, []);
            }
            if (d.spoke) return tip(model.agreements[d.b]?.nameZh ?? d.b, [`${name(d.a)}為締約方`]);
            const ids: string[] = (d.ids ?? d.agreementIds).filter((id: string) => shown.has(id) && (!focusIds || focusIds.has(id)));
            return tip(`${name(d.a)} – ${name(d.b)}`, [
              ids.length === 1 ? model.agreements[ids[0]].nameZh : `${ids.length} 個協定`,
            ]);
          }}
          onArcClick={(d: any) => {
            if (d.member) return select({ kind: 'node', id: model.nodes[d.a]?.group ? d.b : d.a });
            if (d.spoke) return select({ kind: 'agreement', id: d.b });
            select({ kind: 'link', id: `${d.a}~${d.b}` });
          }}

          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.012}
          pointRadius={(d: any) => ('code' in d ? 0.45 : 0.3)}
          pointColor={(d: any) => {
            if ('code' in d) return d.code === focus?.id ? '#facc15' : '#e2e8f0';
            const st = shown.get(d.id);
            return st ? STATUS_COLORS[st] : '#94a3b8';
          }}
          pointsTransitionDuration={0}
          pointLabel={(d: any) => 'code' in d
            ? tip(d.nameZh, [`${counts.get(d.code) ?? 0} 個協定(含所屬集團)`])
            : tip(model.agreements[d.id]?.nameZh ?? d.id, ['三方以上協定的中心點'])}
          onPointClick={(d: any) => select('code' in d ? { kind: 'node', id: d.code } : { kind: 'agreement', id: d.id })}

          htmlElementsData={labels}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.02}
          htmlElement={(d: any) => {
            const el = document.createElement('div');
            const selected = d.code === focus?.id;
            el.textContent = d.nameZh;
            el.title = d.name;
            Object.assign(el.style, {
              pointerEvents: 'auto', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
              font: `600 ${selected ? 13 : narrow ? 10 : 11}px system-ui, sans-serif`, color: selected ? '#0f172a' : '#e2e8f0',
              background: selected ? '#facc15' : d.group ? 'rgba(124, 58, 237, 0.85)' : 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(226, 232, 240, 0.5)', borderRadius: '999px', padding: '1px 7px',
              transform: 'translate(-50%, -50%)',
            });
            // The orbit controls capture the pointer on pointerdown, which would swallow the click.
            el.addEventListener('pointerdown', e => e.stopPropagation());
            el.onclick = (e) => { e.stopPropagation(); select({ kind: 'node', id: d.code }); };
            return el;
          }}
          htmlElementVisibilityModifier={(el: HTMLElement, visible: boolean) => {
            el.style.opacity = visible ? '1' : '0';
            el.style.pointerEvents = visible ? 'auto' : 'none';
          }}

          ringsData={rings}
          ringLat="lat"
          ringLng="lng"
          ringAltitude={0.014}
          ringColor={() => (t: number) => `rgba(251, 146, 60, ${1 - t})`}
          ringMaxRadius={4}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1400}
        />
      )}
    </div>
  );
}
