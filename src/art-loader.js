import { realpath, readFile, stat } from 'node:fs/promises';
import { isAbsolute, join, relative, sep } from 'node:path';

// Only these five explicit PNGs can cross the Host/Client boundary. Never scan
// profiles, load arbitrary SVG/HTML, follow remote URLs or execute user files.
export const ART_FILES = Object.freeze({ seal: 'mbcc-seal.png', wordmark: 'mbcc-original-wordmark.png', city: 'mbcc-official-discity.png', field: 'mbcc-field-record.png', map: 'mbcc-official-map.png' });
export async function loadLocalArt(directory = '') {
  if (!directory) return {};
  if (!isAbsolute(directory)) throw new Error('artDirectory must be an absolute local directory');
  const root = await realpath(directory);
  if (!(await stat(root)).isDirectory()) throw new Error('artDirectory must be a directory');
  const result = {};
  for (const [key, name] of Object.entries(ART_FILES)) {
    let file;
    try { file = await realpath(join(root, name)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    const inside = relative(root, file);
    if (inside === '..' || inside.startsWith('..' + sep) || isAbsolute(inside)) throw new Error('Artwork symlinks must stay inside artDirectory');
    const info = await stat(file);
    if (!info.isFile() || info.size > 8 * 1024 * 1024) throw new Error('Artwork must be a PNG file smaller than 8 MiB');
    const bytes = await readFile(file);
    if (!bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Artwork must have a valid PNG signature');
    result[key] = 'data:image/png;base64,' + bytes.toString('base64');
  }
  return result;
}
