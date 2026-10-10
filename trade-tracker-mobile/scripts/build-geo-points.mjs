/**
 * 產生 3D 地球儀用的國家標示點:src/data/geo-points.json
 *
 * 資料:Natural Earth 1:50m 國界(公有領域),由 world-atlas 套件提供。
 * 方法:取每個國家面積最大的一塊陸地,計算離海岸線最遠的點(polylabel),
 *       避免像法國、美國這種有海外領土的國家,標示點落在海上。
 * 執行:node scripts/build-geo-points.mjs(只有更新國家清單或套件時才需要重跑)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoArea } from 'd3-geo';
import polylabel from 'polylabel';

const require = createRequire(import.meta.url);
const { feature } = require('topojson-client');
const iso = require('i18n-iso-countries');
const atlasVersion = require('world-atlas/package.json').version;

const root = new URL('..', import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'));
const features = feature(topo, topo.objects.countries).features;

// Codes this tool uses that differ from ISO 3166-1 alpha-2, and features without a numeric id.
const TOOL_CODE = { GB: 'UK' };
const BY_NAME = { Kosovo: 'XK' };

// Small states missing from the 1:50m layer: capital city coordinates (lat, lng).
const MANUAL = {
  TV: [-8.52, 179.2],    // Funafuti
  MV: [4.18, 73.51],     // Malé
  BH: [26.23, 50.59],    // Manama
  SG: [1.35, 103.82],
  HK: [22.32, 114.17],
  MO: [22.2, 113.55],
  LI: [47.14, 9.52],
  SM: [43.94, 12.45],
  MC: [43.74, 7.42],
  AD: [42.51, 1.52],
  MT: [35.9, 14.51],
  NR: [-0.53, 166.93],
  MH: [7.09, 171.38],
  PW: [7.5, 134.62],
  KI: [1.45, 173.03],
  TO: [-21.14, -175.2],
  WS: [-13.83, -171.76],
  FM: [6.92, 158.16],
  KN: [17.3, -62.72],
  AG: [17.12, -61.85],
  DM: [15.3, -61.39],
  LC: [13.91, -60.98],
  VC: [13.16, -61.23],
  GD: [12.06, -61.75],
  BB: [13.1, -59.6],
  ST: [0.34, 6.73],
  SC: [-4.62, 55.45],
  KM: [-11.7, 43.26],
  MU: [-20.16, 57.5],
  CV: [14.93, -23.51],
  CK: [-21.21, -159.78],
  NU: [-19.06, -169.87],
  PS: [31.9, 35.2],      // Ramallah
};

// Where the largest landmass is not where people look for the country (lat, lng).
const OVERRIDE = {
  KI: [1.45, 173.03],    // Tarawa, not Kiritimati
  NZ: [-41.29, 174.78],  // Wellington, between the two main islands
  CL: [-33.45, -70.67],  // Santiago, not the Atacama
  MY: [3.5, 102.0],      // Peninsular Malaysia, not Borneo
  CA: [57.0, -102.0],    // central Canada; the largest-landmass point sits far west
};

/** The largest polygon of a feature, with its area (steradians). */
function largestPolygon(geometry) {
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  let best = polys[0];
  let bestArea = -1;
  for (const p of polys) {
    // A ring wound the wrong way measures as the rest of the globe: take the smaller side.
    const raw = geoArea({ type: 'Polygon', coordinates: p });
    const a = Math.min(raw, 4 * Math.PI - raw);
    if (a > bestArea) { bestArea = a; best = p; }
  }
  return { polygon: best, area: bestArea };
}

function labelPoint(polygon) {
  const [lng, lat] = polylabel(polygon, 0.05);
  return [Math.round(lat * 100) / 100, Math.round(lng * 100) / 100];
}

const countriesTs = readFileSync(new URL('src/data/countries.ts', root), 'utf8');
const toolCodes = [...countriesTs.matchAll(/code: "([^"]+)"/g)].map(m => m[1]);

// Some dependencies share their sovereign's numeric code (Ashmore and Cartier Is. is 036 like
// Australia): keep the largest landmass found for each code.
const best = {};
const n3 = {};
for (const f of features) {
  let code = f.id ? iso.numericToAlpha2(f.id) : BY_NAME[f.properties.name];
  if (!code || !f.geometry) continue;
  code = TOOL_CODE[code] ?? code;
  if (f.id) n3[f.id] = code;
  const lp = largestPolygon(f.geometry);
  if (!best[code] || lp.area > best[code].area) best[code] = lp;
}
const points = Object.fromEntries(Object.entries(best).map(([code, lp]) => [code, labelPoint(lp.polygon)]));
for (const [code, p] of Object.entries(MANUAL)) points[code] ??= p;
Object.assign(points, OVERRIDE);
delete points.AQ;

const missing = toolCodes.filter(c => c.length === 2 && !points[c] && !['EU'].includes(c));
const sorted = Object.fromEntries(Object.entries(points).sort(([a], [b]) => a.localeCompare(b)));
const out = {
  source: `Natural Earth 1:50m admin-0 countries (public domain), world-atlas ${atlasVersion}; ` +
    'label point = pole of inaccessibility of the largest polygon; small states without a polygon use the capital.',
  points: sorted,
  n3,
  nameToCode: BY_NAME,
};
writeFileSync(new URL('src/data/geo-points.json', root), JSON.stringify(out, null, 0).replace(/\],"/g, '],\n"') + '\n');
console.log(`${Object.keys(points).length} points; tool codes without a point: ${missing.join(' ') || '(none)'}`);
