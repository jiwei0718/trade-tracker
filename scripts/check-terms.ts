/**
 * 名詞資料庫檢查:每個詞條都要有中文名稱、原文、解釋與來源(APA 格式);
 * 沒有來源的部分要有 aiNote 說明是 AI 翻譯或撰寫。
 *
 *   npx tsx scripts/check-terms.ts
 */
import { TERMS } from '../trade-tracker-mobile/src/data/terms';

const problems: string[] = [];
const ids = new Set<string>();
for (const t of TERMS) {
  const where = `${t.id} (${t.zh})`;
  if (ids.has(t.id)) problems.push(`${where}: duplicate id`);
  ids.add(t.id);
  if (!t.zh?.trim()) problems.push(`${where}: no Chinese name`);
  if (!t.original?.trim()) problems.push(`${where}: no original`);
  if (!t.definition?.trim()) problems.push(`${where}: no definition`);
  if (!t.sources?.length && !t.aiNote) problems.push(`${where}: no source and no AI note`);
  for (const s of t.sources ?? []) {
    if (!s.apa?.trim()) problems.push(`${where}: source without APA text`);
    if (s.url && !/^https:\/\//.test(s.url)) problems.push(`${where}: non-https source ${s.url}`);
    if (/\.cn(\/|$)/.test(s.url ?? '')) problems.push(`${where}: mainland Chinese source ${s.url}`);
  }
  for (const r of t.related ?? []) if (!TERMS.some(x => x.id === r)) problems.push(`${where}: related term ${r} does not exist`);
}
console.log(`checked ${TERMS.length} terms, ${problems.length} problems`);
problems.forEach(p => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);
