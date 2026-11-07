import { cp, lstat, mkdir, readdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root, within } from './catalog.mjs';

async function noSymlinks(directory) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const full = path.join(directory,entry.name);
    if ((await lstat(full)).isSymbolicLink()) throw new Error(`Refusing symlink: ${full}`);
    if (entry.isDirectory()) await noSymlinks(full);
  }
}
export async function installSkill(id, targetRoot, {base = root, dryRun = false} = {}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Invalid skill id');
  const entries = JSON.parse(await readFile(path.join(base,'registry.json'),'utf8'));
  const entry = entries.find(item => item.id === id && item.kind === 'skill');
  if (!entry) throw new Error(`Unknown skill: ${id}`);
  const source = within(base,entry.path);
  const destination = within(path.resolve(targetRoot),id);
  await noSymlinks(source);
  try { await lstat(destination); throw new Error(`Already installed: ${destination}. Preserve or move your existing copy before installing.`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (dryRun) return destination;
  await mkdir(path.resolve(targetRoot), {recursive:true});
  await cp(source,destination,{recursive:true,errorOnExist:true,force:false});
  return destination;
}
async function main() {
  const args=process.argv.slice(2);
  const id=args.shift();
  if (!id) throw new Error('Usage: npm run skill:install -- <skill-id> [--client codex|claude] [--target <skills-directory>] [--dry-run]');
  const options={};
  while(args.length) {
    const key=args.shift();
    if(key==='--dry-run') options.dryRun=true;
    else if(['--client','--target'].includes(key) && args.length) options[key.slice(2)]=args.shift();
    else throw new Error(`Unknown or incomplete option: ${key}`);
  }
  const client=options.client || 'codex';
  if(!['codex','claude'].includes(client)) throw new Error('Supported clients: codex, claude');
  const target=options.target || (client==='codex' && process.env.CODEX_HOME
    ? path.join(process.env.CODEX_HOME,'skills') : path.join(os.homedir(),`.${client}`,'skills'));
  const destination=await installSkill(id,target,options);
  console.log(`${options.dryRun?'Would install':'Installed'} ${id}: ${destination}`);
  console.log('Required: '+JSON.parse(await readFile(path.join(root,'registry.json'),'utf8')).find(e=>e.id===id).requires.join(', '));
}
if(process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url) {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
