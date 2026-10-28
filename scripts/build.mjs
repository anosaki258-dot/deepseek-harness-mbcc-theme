import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFile(resolve(root,path),'utf8');
await mkdir(resolve(root,'lib'),{recursive:true});
let css = await read('src/theme.css');
for (const [file, family, weight] of [['mbcc-text-medium.woff2','MBCCText',500],['mbcc-ui-semibold.woff2','MBCCUI',650],['mbcc-ui-bold.woff2','MBCCUI',700],['mbcc-ui-black.woff2','MBCCUI',900]]) {
  const bytes = await readFile(resolve(root,'assets/fonts',file));
  css = `@font-face{font-family:${family};src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2');font-weight:${weight};font-display:swap}\n` + css;
}
for (const [name,file] of [['city','urban-city.svg'],['map','urban-map.svg'],['field','urban-city.svg']]) {
  const asset = Buffer.from(await read('assets/'+file)).toString('base64');
  css += `\nhtml[data-mbcc-active]{--mbcc-${name}:url("data:image/svg+xml;base64,${asset}");}`;
}
const strip = value => value.replace(/^import .+;\s*$/gm,'').replace(/^export /gm,'');
const sources = await Promise.all(['src/boot.js','src/runtime.js','src/tokens.js','src/client.js'].map(read));
const client = `/* dsh-theme-mbcc 0.1.0 | MIT; embedded Noto fonts: OFL-1.1 */\nwindow.__ModuleLoader__.load({id:'dsh-theme-mbcc',factory(require){\n'use strict';\nconst MBCC_STYLE=${JSON.stringify(css)};\n${sources.map(strip).join('\n')}\nreturn {inject,apply};\n}});\n`;
await writeFile(resolve(root,'lib/client.js'),client);
await writeFile(resolve(root,'lib/index.js'),await read('src/index.js'));
await writeFile(resolve(root,'lib/art-loader.js'),await read('src/art-loader.js'));
console.log(`Built client (${Buffer.byteLength(client)} bytes) and Host entries. No external assets or install hooks.`);
