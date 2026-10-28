import test from 'node:test';
import assert from 'node:assert/strict';
import { mountBoot } from '../src/boot.js';

class Events {
  handlers = new Map();
  addEventListener(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(fn);
  }
  removeEventListener(type, fn) { this.handlers.get(type)?.delete(fn); }
  dispatch(type, event = {}) {
    for (const fn of [...(this.handlers.get(type) || [])]) fn(event);
  }
  listenerCount() { return [...this.handlers.values()].reduce((sum, set) => sum + set.size, 0); }
}

class Node extends Events {
  constructor(tagName, doc) {
    super();
    this.tagName = tagName;
    this.ownerDocument = doc;
    this.children = [];
    this.attributes = new Map();
    this.styleValues = new Map();
    this.style = { setProperty: (name, value) => this.styleValues.set(name, value) };
    this.clientWidth = 1280;
    this.clientHeight = 820;
    this.textContent = '';
  }
  append(...nodes) {
    for (const node of nodes) {
      node.remove();
      node.parentNode = this;
      this.children.push(node);
    }
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  toggleAttribute(name, enabled) {
    if (enabled) this.setAttribute(name, ''); else this.attributes.delete(name);
  }
  contains(node) { return this === node || this.children.some(child => child.contains(node)); }
  get isConnected() { return this === this.ownerDocument.body || !!this.parentNode?.isConnected; }
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(child => child !== this);
    this.parentNode = null;
  }
  replaceWith(node) {
    const parent = this.parentNode;
    if (!parent) return;
    const index = parent.children.indexOf(this);
    this.remove();
    node.parentNode = parent;
    parent.children.splice(index, 0, node);
  }
  focus() { this.ownerDocument.activeElement = this; }
}

function environment({ reduced = false, noCanvas = false } = {}) {
  const document = { baseURI: 'file:///theme/preview.html' };
  const allNodes = [];
  const canvasCalls = [];
  const context = {
    setTransform: (...args) => canvasCalls.push(['transform', ...args]),
    fillRect: (...args) => canvasCalls.push(['rect', ...args]),
    fillText: (...args) => canvasCalls.push(['text', ...args]),
  };
  document.createElement = tag => {
    const node = new Node(tag, document);
    if (tag === 'canvas') node.getContext = () => noCanvas ? null : context;
    allNodes.push(node);
    return node;
  };
  document.body = document.createElement('body');
  document.activeElement = document.body;
  const window = new Events();
  let clock = 0;
  let counter = 1;
  const timers = new Map();
  const frames = new Map();
  window.innerWidth = 1280;
  window.innerHeight = 820;
  window.devicePixelRatio = 3;
  window.performance = { now: () => clock };
  window.setTimeout = (fn, delay) => {
    const id = counter++;
    timers.set(id, { fn, at: clock + delay });
    return id;
  };
  window.clearTimeout = id => timers.delete(id);
  window.requestAnimationFrame = fn => { const id = counter++; frames.set(id, fn); return id; };
  window.cancelAnimationFrame = id => frames.delete(id);
  const media = new Events();
  media.matches = reduced;
  window.matchMedia = () => media;
  document.defaultView = window;
  function advance(ms, { animation = true } = {}) {
    clock += ms;
    if (animation) {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(fn => fn(clock));
    }
    for (const [id, timer] of [...timers]) {
      if (timer.at <= clock && timers.has(id)) { timers.delete(id); timer.fn(); }
    }
  }
  const find = className => allNodes.findLast(node => node.className === className && node.isConnected);
  const root = () => document.body.children.find(node => node.attributes.has('data-mbcc-boot'));
  function assertClean() {
    assert.equal(root(), undefined, 'overlay removed');
    assert.equal(timers.size, 0, 'all timeouts cleared');
    assert.equal(frames.size, 0, 'all animation frames cleared');
    assert.equal(window.listenerCount(), 0, 'window listeners removed');
    assert.equal(media.listenerCount(), 0, 'media query listener removed');
    assert.ok(allNodes.every(node => node.listenerCount() === 0), 'DOM listeners removed');
  }
  return { document, window, media, timers, frames, allNodes, canvasCalls, advance, find, root, assertClean };
}

test('four-stage presentation advances, draws data rain, then fully cleans up', () => {
  const env = environment();
  mountBoot(env);
  assert.equal(env.root().getAttribute('data-phase'), '1');
  assert.match(env.find('mbcc-boot-footer').children[0].textContent, /不代表真实安全认证/);
  const canvas = env.find('mbcc-boot-rain');
  assert.equal(canvas.width, 2560, 'pixel ratio capped at 2');
  env.advance(1700);
  assert.equal(env.root().getAttribute('data-phase'), '2');
  env.advance(1700);
  assert.equal(env.root().getAttribute('data-phase'), '3');
  env.advance(1700);
  assert.equal(env.root().getAttribute('data-phase'), '4');
  assert.equal(env.find('mbcc-boot-title').textContent, '欢迎归来，局长');
  assert.equal(env.find('mbcc-boot-code').textContent, 'ACCESS GRANTED');
  assert.ok(env.canvasCalls.some(call => call[0] === 'text'), 'rain paints characters');
  env.advance(800);
  assert.equal(env.root().getAttribute('data-exiting'), '');
  env.advance(600);
  env.assertClean();
});

test('Escape skips without reaching the underlying application and restores focus', () => {
  const env = environment();
  const input = env.document.createElement('input');
  env.document.body.append(input);
  input.focus();
  const boot = mountBoot(env);
  let prevented = false;
  env.window.dispatch('keydown', { key: 'Escape', preventDefault: () => { prevented = true; } });
  assert.ok(prevented);
  assert.equal(env.document.activeElement, input);
  boot.dispose();
  env.assertClean();
});

test('skip button disposes, and replay creates one fresh animation', () => {
  const env = environment();
  const boot = mountBoot(env);
  env.find('mbcc-boot-skip').dispatch('click');
  env.assertClean();
  boot.replay();
  assert.equal(env.document.body.children.length, 1);
  assert.equal(env.timers.size, 1);
  assert.equal(env.frames.size, 1);
  boot.replay();
  assert.equal(env.document.body.children.length, 1);
  assert.equal(env.timers.size, 1);
  assert.equal(env.frames.size, 1);
  boot.dispose();
  env.assertClean();
});

test('a second mount disposes the previous instance for the same document', () => {
  const env = environment();
  const first = mountBoot(env);
  const second = mountBoot(env);
  assert.equal(env.document.body.children.length, 1);
  assert.equal(env.timers.size, 1);
  first.replay();
  assert.equal(env.document.body.children.length, 1);
  assert.equal(env.timers.size, 1);
  first.dispose();
  second.dispose();
  env.assertClean();
});

test('resize rebuilds backing dimensions and is detached on disposal', () => {
  const env = environment();
  const boot = mountBoot(env);
  env.root().clientWidth = 420;
  env.root().clientHeight = 600;
  env.window.dispatch('resize');
  assert.equal(env.find('mbcc-boot-rain').width, 840);
  assert.equal(env.find('mbcc-boot-rain').height, 1200);
  boot.dispose();
  env.assertClean();
});

test('reduced motion disables rain and responds to a live preference change', () => {
  const env = environment({ reduced: true });
  const boot = mountBoot(env);
  assert.equal(env.root().getAttribute('data-reduced-motion'), '');
  env.advance(1200);
  assert.equal(env.canvasCalls.filter(call => call[0] === 'text').length, 0);
  env.media.dispatch('change', { matches: false });
  assert.equal(env.root().getAttribute('data-reduced-motion'), null);
  for (let i = 0; i < 4; i++) env.advance(50);
  assert.ok(env.canvasCalls.some(call => call[0] === 'text'));
  boot.dispose();
  env.assertClean();
});

test('timeout releases overlay with suspended rAF, capped at ten seconds', () => {
  const env = environment();
  mountBoot({ ...env, durationMs: 60000 });
  env.advance(9999, { animation: false });
  assert.ok(env.root());
  env.advance(1, { animation: false });
  env.assertClean();
});

test('missing Canvas context still presents and completes normally', () => {
  const env = environment({ noCanvas: true });
  mountBoot({ ...env, durationMs: 1000 });
  env.advance(1000);
  env.assertClean();
});

test('bundled seal is large, errors fall back to text, external assets are rejected', () => {
  const env = environment();
  const boot = mountBoot({ ...env, sealUrl: './assets/mbcc.png' });
  assert.equal(env.find('mbcc-boot-seal').src, './assets/mbcc.png');
  assert.match(env.allNodes.find(node => node.tagName === 'style').textContent, /340px/);
  env.find('mbcc-boot-seal').dispatch('error');
  assert.equal(env.find('mbcc-boot-seal'), undefined);
  assert.equal(env.find('mbcc-boot-wordmark').textContent, 'MBCC');
  boot.dispose();
  mountBoot({ ...env, sealUrl: 'https://external.example/mark.png' }).dispose();
  env.assertClean();
});

test('rejects mounting before the document is ready', () => {
  assert.throws(() => mountBoot({ document: {}, window: {} }), /ready document/);
});
