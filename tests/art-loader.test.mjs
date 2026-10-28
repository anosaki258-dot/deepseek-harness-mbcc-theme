import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,writeFile,symlink,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadLocalArt } from '../src/art-loader.js';
test('local import allows fixed PNG names, not unrelated files or escapes',async() => {
  const dir=await mkdtemp(join(tmpdir(),'mbcc-art-'));
  const outside=await mkdtemp(join(tmpdir(),'mbcc-outside-'));
  try {
    const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+cZxkAAAAASUVORK5CYII=','base64');
    await writeFile(join(dir,'mbcc-seal.png'),png); await writeFile(join(dir,'account.json'),'not read');
    assert.deepEqual(Object.keys(await loadLocalArt(dir)),['seal']);
    await writeFile(join(dir,'mbcc-official-map.png'),'not a png');
    await assert.rejects(loadLocalArt(dir),/PNG signature/);
    await rm(join(dir,'mbcc-official-map.png'));
    await symlink(join(outside,'outside.png'),join(dir,'mbcc-official-map.png'));
    // Dangling outside links behave as missing; actual external files are denied.
    await writeFile(join(outside,'outside.png'),png);
    try { await assert.rejects(loadLocalArt(dir),/stay inside/); }
    finally { await rm(join(outside,'outside.png')); }
  } finally { await rm(dir,{recursive:true,force:true}); await rm(outside,{recursive:true,force:true}); }
});
test('empty directory is opt-in and remote/relative locations are rejected',async()=>{
  assert.deepEqual(await loadLocalArt(),{});
  await assert.rejects(loadLocalArt('https://example.com'),/absolute local/);
  await assert.rejects(loadLocalArt('assets'),/absolute local/);
});
