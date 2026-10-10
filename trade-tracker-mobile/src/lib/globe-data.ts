/**
 * 3D 地球儀的資料模型:把協定轉成國家/集團節點與弧線。
 *
 * - 兩方的協定:一條弧線;同一對締約方的多個協定合併成一條,粗細依數量。
 * - 三方以上:在締約方中心放一個協定中心點,從每個締約方拉一條線過去。
 * - 只有一個節點(例如集團內部協定):不畫弧線,點選該集團時列出。
 * - 集團成員和集團本身同時列為締約方時,只畫集團。
 *
 * 模型只含可序列化的資料,地球元件(DOM 元件)在 Android 上也能直接收到。
 */
import type { AgreementStatus, TradeAgreement } from '@/data/types';
import { countryByCode } from '@/data/countries';
import { orgByCode } from '@/data/organizations';
import { groupMembers, groupNames, isGroup, nodeCode, notOnGlobeReason, pointOf } from '@/data/geo';

export type Basis = 'in_force' | 'signed';

export interface GlobeAgreement {
  id: string;
  nameZh: string;
  name: string;
  status: AgreementStatus;
  type: string;
  inForce?: number;   // years
  signed?: number;
  end?: number;       // year it expired, was superseded or cancelled
  parties: string[];
  /** Party codes plus the members of any bloc party: who the agreement reaches. */
  reach: string[];
  /** Codes of the nodes it is drawn between (empty when it is not on the globe). */
  nodes: string[];
}

export interface GlobeNode {
  code: string;
  nameZh: string;
  name: string;
  lat: number;
  lng: number;
  group: boolean;
  /** The Chinese name is this tool's translation. */
  nameByTool?: boolean;
  /** A bloc's member countries (empty for countries). */
  members: string[];
  /** Agreements drawn without an arc because this node is their only placed party. */
  internal: string[];
}

export interface GlobeLink {
  id: string;
  a: string;            // node code
  b: string;            // node code, or the agreement id for a spoke to a hub
  startLat: number; startLng: number; endLat: number; endLng: number;
  agreementIds: string[];
  spoke?: boolean;
}

/** The middle point of an agreement with three or more placed parties. */
export interface GlobeHub { id: string; lat: number; lng: number }

export interface GlobeModel {
  agreements: Record<string, GlobeAgreement>;
  nodes: Record<string, GlobeNode>;
  links: GlobeLink[];
  hubs: GlobeHub[];
  offGlobe: { id: string; reason: string }[];
}

export interface GlobeFilter {
  /** null: today's picture; a year: what was in force (or signed) that year. */
  year: number | null;
  basis: Basis;
  /** Today's picture also shows agreements that have ended. */
  historic: boolean;
  /** Agreement types to show; empty means all. */
  types: string[];
}

export const DEFAULT_FILTER: GlobeFilter = { year: null, basis: 'in_force', historic: false, types: [] };

/** What is selected on the globe: a country or bloc, a pair link or spoke, or one agreement. */
export type GlobeFocus = { kind: 'node' | 'link' | 'agreement'; id: string };

/** Where the camera should fly; a new `seq` repeats the same move. */
export interface GlobeCamera { lat: number; lng: number; altitude: number; seq: number }

// Agreements no longer operating: hidden from today's picture unless asked for, and ended on the timeline.
const ENDED: AgreementStatus[] = ['expired', 'superseded', 'cancelled', 'suspended'];
const STATUS_RANK: AgreementStatus[] = [
  'in_force', 'signed', 'concluded', 'negotiating', 'proposed', 'suspended', 'superseded', 'expired', 'cancelled',
];

const year = (d?: string) => (d ? parseInt(d.slice(0, 4), 10) || undefined : undefined);

function names(code: string, a: TradeAgreement, i: number): { nameZh: string; name: string; nameByTool?: boolean } {
  const c = countryByCode(code);
  if (c) return { nameZh: c.zh, name: c.en };
  const o = orgByCode(code);
  if (o) return { nameZh: o.abbrZh ?? o.nameZh, name: o.name };
  const g = groupNames(code);
  return {
    nameZh: g.zh ?? (a.partyNamesZh[i] || a.partyNames[i] || code),
    name: g.en ?? (a.partyNames[i] || code),
    nameByTool: g.zh ? g.zhByTool : undefined,
  };
}

/** Spherical middle of points (lat, lng), safe across the 180° line. */
export function middle(points: [number, number][]): [number, number] {
  let x = 0, y = 0, z = 0;
  for (const [lat, lng] of points) {
    const la = (lat * Math.PI) / 180, lo = (lng * Math.PI) / 180;
    x += Math.cos(la) * Math.cos(lo); y += Math.cos(la) * Math.sin(lo); z += Math.sin(la);
  }
  return [(Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI, (Math.atan2(y, x) * 180) / Math.PI];
}

export function buildGlobeModel(list: TradeAgreement[]): GlobeModel {
  const agreements: Record<string, GlobeAgreement> = {};
  const nodes: Record<string, GlobeNode> = {};
  const pairs = new Map<string, GlobeLink>();
  const links: GlobeLink[] = [];
  const hubs: GlobeHub[] = [];
  const offGlobe: { id: string; reason: string }[] = [];

  const node = (party: string, a: TradeAgreement, i: number): GlobeNode | null => {
    const code = nodeCode(party);
    if (nodes[code]) return nodes[code];
    const p = pointOf(code);
    if (!p) return null;
    const group = isGroup(code);
    nodes[code] = {
      code, ...names(code, a, i), lat: p[0], lng: p[1], group, members: group ? groupMembers(code) : [], internal: [],
    };
    return nodes[code];
  };

  for (const a of list) {
    if (a.parentId) continue;
    const k = a.keyDates;
    const reach = new Set(a.parties);
    a.parties.forEach(p => { reach.add(nodeCode(p)); groupMembers(p).forEach(m => reach.add(m)); });
    agreements[a.id] = {
      id: a.id, nameZh: a.nameZh, name: a.name, status: a.status, type: a.type,
      inForce: year(k.in_force), signed: year(k.signed),
      end: year(k.expired ?? k.superseded ?? k.cancelled ?? k.suspended),
      parties: a.parties,
      reach: [...reach],
      nodes: [],
    };

    // Parties to draw: placed ones, minus members of a bloc that is itself a party.
    const blocMembers = new Set(a.parties.flatMap(p => groupMembers(p)));
    const placed: GlobeNode[] = [];
    let reason: string | undefined;
    a.parties.forEach((code, i) => {
      if (blocMembers.has(code) && !groupMembers(code).length) return;
      const n = node(code, a, i);
      if (n) { if (!placed.includes(n)) placed.push(n); }
      else reason ??= notOnGlobeReason(code) ?? '締約方位置不明';
    });

    if (placed.length === 0 || (reason && placed.length < 2)) {
      offGlobe.push({ id: a.id, reason: reason ?? '締約方位置不明' });
      continue;
    }
    agreements[a.id].nodes = placed.map(n => n.code);
    if (placed.length === 1) {
      placed[0].internal.push(a.id);
    } else if (placed.length === 2) {
      const [x, y] = [placed[0], placed[1]].sort((m, n) => m.code.localeCompare(n.code));
      const id = `${x.code}~${y.code}`;
      let link = pairs.get(id);
      if (!link) {
        link = { id, a: x.code, b: y.code, startLat: x.lat, startLng: x.lng, endLat: y.lat, endLng: y.lng, agreementIds: [] };
        pairs.set(id, link);
        links.push(link);
      }
      link.agreementIds.push(a.id);
    } else {
      const [lat, lng] = middle(placed.map(n => [n.lat, n.lng]));
      hubs.push({ id: a.id, lat, lng });
      for (const n of placed) {
        links.push({
          id: `${a.id}>${n.code}`, a: n.code, b: a.id, spoke: true,
          startLat: n.lat, startLng: n.lng, endLat: lat, endLng: lng, agreementIds: [a.id],
        });
      }
    }
  }
  return { agreements, nodes, links, hubs, offGlobe };
}

/** The status to draw an agreement with under the filter, or null when it is hidden. */
export function shownStatus(a: GlobeAgreement, f: GlobeFilter): AgreementStatus | null {
  if (f.types.length && !f.types.includes(a.type)) return null;
  if (f.year == null) {
    if (ENDED.includes(a.status)) return f.historic ? a.status : null;
    return a.status;
  }
  const start = f.basis === 'signed' ? (a.signed ?? a.inForce) : (a.inForce ?? (a.status === 'in_force' ? a.signed : undefined));
  if (start == null || start > f.year) return null;
  if (a.end != null && a.end <= f.year) return null;
  return a.inForce != null && a.inForce <= f.year ? 'in_force' : 'signed';
}

/** The most advanced status among the shown agreements of a link (green beats grey). */
export function bestStatus(statuses: AgreementStatus[]): AgreementStatus | null {
  let best: AgreementStatus | null = null;
  for (const s of statuses) if (!best || STATUS_RANK.indexOf(s) < STATUS_RANK.indexOf(best)) best = s;
  return best;
}

/** Shown agreements of the model, with the status each is drawn in. */
export function shownAgreements(m: GlobeModel, f: GlobeFilter): Map<string, AgreementStatus> {
  const out = new Map<string, AgreementStatus>();
  for (const a of Object.values(m.agreements)) {
    const s = shownStatus(a, f);
    if (s) out.set(a.id, s);
  }
  return out;
}

/** Does the agreement involve this party, directly or through a bloc it belongs to? */
export function involves(a: GlobeAgreement, code: string): boolean {
  return a.reach.includes(code);
}
