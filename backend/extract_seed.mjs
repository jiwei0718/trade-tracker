// One-off: convert the TS data file to JSON seed.
// Usage: node backend/extract_seed.mjs
import { agreements } from '../trade-tracker-mobile/src/data/agreements.ts';
import { writeFileSync } from 'fs';

const out = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  generator: 'seed-export',
  count: agreements.length,
  agreements,
};
writeFileSync('data/seed/agreements.seed.json', JSON.stringify(out, null, 2), 'utf-8');
console.log(`Wrote ${agreements.length} agreements to data/seed/agreements.seed.json`);
