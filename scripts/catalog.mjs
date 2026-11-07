import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function within(base, relative) {
  const resolved = path.resolve(base, relative);
  if (resolved === base || !resolved.startsWith(`${base}${path.sep}`)) throw new Error(`Path escapes repository: ${relative}`);
  return resolved;
}
export async function validateCatalog(entries, base = root) {
  if (!Array.isArray(entries)) throw new Error('registry.json must be an array');
  const seen = new Set();
  for (const entry of entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id || '') || seen.has(entry.id)) throw new Error(`Invalid or duplicate id: ${entry.id}`);
    seen.add(entry.id);
    if (!['skill','mcp','workflow'].includes(entry.kind)) throw new Error(`Unknown kind: ${entry.kind}`);
    for (const key of ['title','summary','path','docs','status','version','icon','accent']) {
      if (typeof entry[key] !== 'string' || !entry[key].trim()) throw new Error(`Missing ${key}: ${entry.id}`);
    }
    if (!Array.isArray(entry.tags) || !entry.tags.length || entry.tags.some(t => typeof t !== 'string')) throw new Error(`Missing tags: ${entry.id}`);
    if (!Array.isArray(entry.requires) || entry.requires.some(t => typeof t !== 'string')) throw new Error(`Invalid dependencies: ${entry.id}`);
    const source = within(base, entry.path);
    if (!(await stat(source)).isDirectory()) throw new Error(`Missing source directory: ${entry.path}`);
    const expectedPrefix = {skill:'skills/',mcp:'mcp/',workflow:'workflows/'}[entry.kind];
    if (!entry.path.startsWith(expectedPrefix)) throw new Error(`Wrong source directory: ${entry.id}`);
    if (!/^\/docs\/[a-z0-9/-]+$/.test(entry.docs)) throw new Error(`Invalid docs route: ${entry.id}`);
    const document = within(base, `content${entry.docs}.mdx`);
    await stat(document);
    if (entry.kind === 'skill') {
      const text = await readFile(path.join(source, 'SKILL.md'), 'utf8');
      const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const metadata = match ? parse(match[1]) : null;
      if (metadata?.name !== entry.id || !metadata.description) throw new Error(`Invalid SKILL.md frontmatter: ${entry.id}`);
    }
  }
  return entries;
}
export async function generate() {
  const entries = await validateCatalog(JSON.parse(await readFile(path.join(root,'registry.json'),'utf8')));
  const text = JSON.stringify(entries, null, 2) + '\n';
  await mkdir(path.join(root,'public'), {recursive:true});
  await writeFile(path.join(root,'public/catalog.json'), text);
  await writeFile(path.join(root,'lib/catalog.generated.json'), text);
  console.log(`Catalog checked and generated: ${entries.length} entries`);
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  generate().catch(error => {console.error(error.message); process.exitCode=1;});
}
