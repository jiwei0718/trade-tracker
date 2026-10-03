/**
 * 把 App 內策劃的資料(TypeScript)匯出成 JSON,供 backend/import_to_supabase.py 使用。
 *
 *   npx tsx scripts/export-curated.ts
 *
 * 輸出:backend/.cache/curated.json(已被 .gitignore 排除,每次匯入前重新產生)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { agreements } from '../trade-tracker-mobile/src/data/agreements';
import { AGREEMENT_DETAILS } from '../trade-tracker-mobile/src/data/agreement-details';
import { ARTICLE_STRUCTURES } from '../trade-tracker-mobile/src/data/article-structures';
import { COUNTRIES } from '../trade-tracker-mobile/src/data/countries';
import { ORGANIZATIONS } from '../trade-tracker-mobile/src/data/organizations';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'backend', '.cache', 'curated.json');
mkdirSync(dirname(out), { recursive: true });

writeFileSync(out, JSON.stringify({
  exported_at: new Date().toISOString(),
  agreements,
  details: AGREEMENT_DETAILS,
  articleStructures: ARTICLE_STRUCTURES,
  countries: COUNTRIES,
  organizations: ORGANIZATIONS,
}), 'utf-8');

console.log(
  `exported ${agreements.length} agreements, ${Object.keys(AGREEMENT_DETAILS).length} details, ` +
  `${Object.keys(ARTICLE_STRUCTURES).length} article structures, ${COUNTRIES.length} countries, ` +
  `${ORGANIZATIONS.length} organizations -> ${out}`,
);
