import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {root,validateCatalog,within} from '../scripts/catalog.mjs';
import {installSkill} from '../scripts/install-skill.mjs';

const entries=JSON.parse(await readFile(path.join(root,'registry.json'),'utf8'));
test('every catalog entry has real source, docs and valid skill metadata',async()=>{
  assert.equal((await validateCatalog(entries)).length,entries.length);
});
test('catalog refuses duplicate identities and paths outside the repository',async()=>{
  await assert.rejects(()=>validateCatalog([...entries,entries[0]]),/duplicate/);
  await assert.rejects(()=>validateCatalog([{...entries[0],path:'../private-skill'}]),/escapes/);
  assert.throws(()=>within(root,'../another-project'),/escapes/);
});
test('catalog rejects an advertised tool whose detail page is missing',async()=>{
  await assert.rejects(()=>validateCatalog([{...entries[0],docs:'/docs/missing-page'}]),/ENOENT/);
});
test('installer copies complete skill and preserves existing user changes',async()=>{
  const directory=await mkdtemp(path.join(os.tmpdir(),'swell-toolbox-'));
  const installed=await installSkill('toolbox-maintainer',directory);
  const document=path.join(installed,'SKILL.md');
  assert.equal(await readFile(document,'utf8'),await readFile(path.join(root,'skills/toolbox-maintainer/SKILL.md'),'utf8'));
  await writeFile(document,'my local changes');
  await assert.rejects(()=>installSkill('toolbox-maintainer',directory),/Already installed/);
  assert.equal(await readFile(document,'utf8'),'my local changes');
});
test('dry-run writes nothing and invalid ids cannot escape selected destination',async()=>{
  const directory=await mkdtemp(path.join(os.tmpdir(),'swell-toolbox-dry-'));
  const destination=await installSkill('comic-translate',directory,{dryRun:true});
  await assert.rejects(()=>readFile(path.join(destination,'SKILL.md')),/ENOENT/);
  await assert.rejects(()=>installSkill('../escape',directory),/Invalid/);
  await assert.rejects(()=>installSkill('filesystem',directory),/Unknown skill/);
});
