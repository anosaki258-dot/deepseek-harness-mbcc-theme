import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { mountTheme, safeArt } from '../src/runtime.js';

function fixture() {
  const { document } = parseHTML('<html><head></head><body><main class="_8tPydW_root"></main><aside class="F6Huca_guide"></aside><section class="kB3qhq_regionArea"></section></body></html>');
  const frames = new Map(), listeners = new Map(); let serial=0, disconnected=0;
  const parents = new Set();
  const window = {
    requestAnimationFrame(fn) { const id=++serial; frames.set(id,fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    addEventListener(name,fn) { listeners.set(name,fn); },
    removeEventListener(name,fn) { if(listeners.get(name)===fn)listeners.delete(name); },
    ResizeObserver: class { observe(el) { parents.add(el); } unobserve(el) { parents.delete(el); } disconnect() { parents.clear(); disconnected++; } },
    MutationObserver: class { observe() {} disconnect() { disconnected++; } },
  };
  const tick = () => { const callbacks=[...frames.values()]; frames.clear(); for(const cb of callbacks)cb(); };
  return {document,window,tick,frames,listeners,parents,get disconnected(){return disconnected;}};
}

test('full layout attaches decorations; disable restores DOM, preferences and observers',() => {
  const f=fixture(), html=f.document.documentElement;
  html.setAttribute('data-mbcc-active','earlier');
  const native=f.document.querySelector('main'); native.innerHTML='<button>Native action</button>';
  const dispose=mountTheme({...f,styleText:'/* owned CSS */'}); f.tick();
  assert.equal(f.document.querySelectorAll('[data-mbcc-owned]').length,5);
  assert.equal(f.parents.size,3);
  assert.equal(native.querySelector('button').textContent,'Native action');
  dispose(); dispose();
  assert.equal(f.document.querySelectorAll('[data-mbcc-owned]').length,0);
  assert.equal(html.getAttribute('data-mbcc-active'),'earlier');
  assert.equal(html.hasAttribute('data-mbcc-layout'),false);
  assert.equal(f.frames.size,0); assert.equal(f.listeners.size,0); assert.equal(f.parents.size,0);
  assert.equal(native.querySelector('button').textContent,'Native action');
});
test('palette-only mode does not reserve space or add art',() => {
  const f=fixture(), dispose=mountTheme({...f,styleText:'',fullLayout:false}); f.tick();
  assert.equal(f.document.getElementById('mbcc-masthead'),null);
  assert.equal(f.document.querySelectorAll('[data-mbcc-owned]').length,1);
  assert.equal(f.document.documentElement.hasAttribute('data-mbcc-layout'),false);
  dispose();
});
test('repeated activation cannot let stale disposer break the active theme',() => {
  const f=fixture(), first=mountTheme({...f,styleText:'first'});
  const second=mountTheme({...f,styleText:'second'}); first(); f.tick();
  assert.equal(f.document.querySelectorAll('#mbcc-masthead').length,1);
  assert.equal(f.document.documentElement.getAttribute('data-mbcc-active'),'0.1.0');
  second(); assert.equal(f.document.documentElement.hasAttribute('data-mbcc-active'),false);
});
test('removed panels are released by ResizeObserver',() => {
  const f=fixture(), dispose=mountTheme({...f,styleText:''}); f.tick();
  const parent=f.document.querySelector('main'); parent.remove();
  f.listeners.get('resize')(); f.tick(); assert.equal(f.parents.has(parent),false); dispose();
});
test('asset boundary rejects URLs, HTML, unknown keys and invalid types',() => {
  assert.deepEqual(safeArt(null),{}); assert.deepEqual(safeArt(['x']),{});
  assert.deepEqual(safeArt({seal:'https://example.com/logo.png',map:'data:image/svg+xml,<svg/>',other:'data:image/png;base64,AAAA'}),{});
  assert.equal(safeArt({seal:'data:image/png;base64,AAAA'}).seal,'data:image/png;base64,AAAA');
});
test('built ModuleLoader entry activates, then releases its token layer and config',async() => {
  const f=fixture(); let entry,cleanup,tokenReleased=0;
  f.window.__MBCC_THEME_CONFIG__={startup:false,fullLayout:true};
  f.window.__ModuleLoader__={load(value){entry=value;}};
  vm.runInNewContext(await readFile(new URL('../lib/client.js',import.meta.url),'utf8'),{window:f.window,document:f.document,URL,WeakMap,Map,Set,console});
  assert.equal(entry.id,'dsh-theme-mbcc');
  const plugin=entry.factory(()=>{throw Error('No runtime dependencies expected');});
  plugin.apply({effect(fn){cleanup=fn();},theme:{overrideTokens(id,tokens){
    assert.equal(id,'dsh-theme-mbcc'); assert.equal(tokens['--dsw-alias-bg-base'].light,'#0d0d0f');
    return ()=>{tokenReleased++;};
  }}});
  f.tick(); cleanup(); assert.equal(tokenReleased,1); assert.equal(f.window.__MBCC_THEME_CONFIG__,undefined);
  assert.equal(f.document.querySelectorAll('[data-mbcc-owned]').length,0);
});
