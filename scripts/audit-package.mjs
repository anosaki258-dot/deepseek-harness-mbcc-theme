import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const issues=[];
async function scan(dir) {
  for(const row of await readdir(resolve(root,dir),{withFileTypes:true})) {
    const file=dir+'/'+row.name;
    if(row.isDirectory()) { if(!['node_modules','.git','private','test-results'].includes(row.name))await scan(file); continue; }
    if(/\.(app|asar|key|pem)$|^\.env/.test(row.name))issues.push('Unexpected delivery file: '+file);
    if(row.name.endsWith('.tgz')) {
      if(file !== './downloads/dsh-theme-mbcc-0.1.0.tgz') issues.push('Unexpected package: '+file);
      else {
        const sum=createHash('sha256').update(await readFile(resolve(root,file))).digest('hex');
        const recorded=await readFile(resolve(root,'downloads/SHA256SUMS.txt'),'utf8');
        if(!recorded.startsWith(sum+'  '+row.name))issues.push('Download checksum mismatch');
      }
    }
    if(/\.(js|mjs|md|json|yml|css|svg)$/.test(file)) {
      const text=await readFile(resolve(root,file),'utf8');
      const forbidden=[/\/Users\/[a-zA-Z0-9_-]+\//,/gh[pousr]_[A-Za-z0-9]{24,}/,/github_pat_[A-Za-z0-9_]{24,}/,/-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----/];
      if(forbidden.some(pattern=>pattern.test(text)))issues.push('Personal path/credential pattern: '+file);
    }
  }
}
await scan('.');
const bundle=await readFile(resolve(root,'lib/client.js'),'utf8');
for(const name of ['mbcc-songti-black','mbcc-din-condensed','mbcc-serif-semibold','mbcc-official-langsong'])if(bundle.includes(name))issues.push('Restricted font: '+name);
if(!bundle.startsWith('/* dsh-theme-mbcc'))issues.push('Missing built bundle');
for(const file of ['assets/fonts/OFL.txt','LICENSE','THIRD_PARTY_NOTICES.md','cordis.patch.yml'])if(!(await stat(resolve(root,file))).size)issues.push('Empty required file: '+file);
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
if(Object.keys(pkg.scripts).some(name=>/^(preinstall|install|postinstall|prepare)$/.test(name)))issues.push('Install lifecycle hook is forbidden');
if(issues.length){console.error(issues.join('\n'));process.exit(1);}
console.log('Package audit passed: no personal paths, credential patterns, restricted fonts or install hooks.');
