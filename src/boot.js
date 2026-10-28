/**
 * MBCC-inspired startup presentation. This is a visual theme effect, not an
 * authentication implementation. No remote resources or application APIs.
 */
const activeBoots = new WeakMap();

const STYLES = `
[data-mbcc-boot]{position:fixed;inset:0;z-index:2147483000;isolation:isolate;overflow:hidden;display:grid;place-items:center;background:#070708;color:#dedbd5;font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;opacity:1;transition:opacity .5s ease;box-sizing:border-box;color-scheme:dark}
[data-mbcc-boot] *{box-sizing:border-box}
[data-mbcc-boot][data-exiting]{opacity:0;pointer-events:none}
[data-mbcc-boot] .mbcc-boot-rain{position:absolute;inset:0;width:100%;height:100%;opacity:.7;z-index:-3}
[data-mbcc-boot] .mbcc-boot-vignette{position:absolute;inset:0;pointer-events:none;z-index:-2;background:radial-gradient(ellipse at 50% 40%,#07070830 10%,#070708d9 85%),linear-gradient(90deg,#52232b12 1px,transparent 1px),linear-gradient(#d5cec505 1px,transparent 1px);background-size:auto,84px 84px,84px 84px}
[data-mbcc-boot] .mbcc-boot-frame{position:absolute;inset:24px;border:1px solid #6c656134;pointer-events:none;z-index:-1}
[data-mbcc-boot] .mbcc-boot-frame:before,[data-mbcc-boot] .mbcc-boot-frame:after{content:"";position:absolute;left:-1px;top:-1px;width:42px;height:4px;background:#7c303b}
[data-mbcc-boot] .mbcc-boot-frame:after{left:auto;top:auto;right:-1px;bottom:-1px}
[data-mbcc-boot] .mbcc-boot-corner{position:absolute;left:42px;top:40px;font:600 10px/1.7 ui-monospace,"SFMono-Regular",Consolas,monospace;letter-spacing:.2em;color:#9a928b}
[data-mbcc-boot] .mbcc-boot-content{width:min(520px,calc(100% - 72px));display:flex;align-items:center;flex-direction:column;gap:16px;text-align:center}
[data-mbcc-boot] .mbcc-boot-seal{display:block;width:min(340px,38vh,65vw);height:min(340px,38vh,65vw);object-fit:contain;filter:grayscale(1) brightness(.85);opacity:.9}
[data-mbcc-boot] .mbcc-boot-wordmark{font:900 clamp(70px,14vw,144px)/1 Georgia,"Times New Roman",serif;letter-spacing:-.065em;padding-right:.065em;color:#d0cbc2;text-shadow:0 2px 0 #000}
[data-mbcc-boot] .mbcc-boot-caption{font:600 9px/1.5 ui-monospace,"SFMono-Regular",Consolas,monospace;letter-spacing:.24em;color:#91857e}
[data-mbcc-boot] .mbcc-boot-rule{height:1px;width:100%;margin-top:2px;background:#59504b59;position:relative}
[data-mbcc-boot] .mbcc-boot-rule:before{content:"";position:absolute;left:0;top:-1px;height:3px;width:var(--mbcc-boot-progress,0%);background:#8c3542;transition:width .18s linear}
[data-mbcc-boot] .mbcc-boot-title{margin:2px 0 0;min-height:1.4em;font-size:clamp(22px,4vw,32px);line-height:1.4;font-weight:900;letter-spacing:.1em;color:#e2ded5}
[data-mbcc-boot] .mbcc-boot-code{font:600 11px/1.5 ui-monospace,"SFMono-Regular",Consolas,monospace;letter-spacing:.25em;color:#ab777d;min-height:17px}
[data-mbcc-boot] .mbcc-boot-steps{width:100%;margin:4px 0 0;padding:0;list-style:none;text-align:left;font:600 11px/1.7 ui-monospace,"SFMono-Regular",Consolas,monospace;color:#68635e}
[data-mbcc-boot] .mbcc-boot-step{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #7c736417;padding:5px 0}
[data-mbcc-boot] .mbcc-boot-step[data-state=active]{color:#b5aaa0}
[data-mbcc-boot] .mbcc-boot-step[data-state=done]{color:#938b82}
[data-mbcc-boot] .mbcc-boot-step span:last-child{flex:none;color:#8c515a;letter-spacing:.1em}
[data-mbcc-boot] .mbcc-boot-footer{position:absolute;bottom:38px;left:42px;right:42px;display:flex;align-items:center;justify-content:space-between;gap:16px;color:#817c74;font-size:10px;line-height:1.6;letter-spacing:.04em}
[data-mbcc-boot] .mbcc-boot-skip{border:1px solid #70645c75;border-radius:0;background:#171516;color:#c8c1b6;padding:8px 12px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;line-height:1.4;letter-spacing:.06em;flex:none}
[data-mbcc-boot] .mbcc-boot-skip:hover{background:#292025;border-color:#9c6570}
[data-mbcc-boot] .mbcc-boot-skip:focus-visible{outline:2px solid #b17d85;outline-offset:3px}
[data-mbcc-boot][data-reduced-motion] .mbcc-boot-rain{display:none}
[data-mbcc-boot][data-reduced-motion],[data-mbcc-boot][data-reduced-motion] .mbcc-boot-rule:before{transition:none}
@media(max-height:670px){[data-mbcc-boot] .mbcc-boot-content{gap:8px}[data-mbcc-boot] .mbcc-boot-seal{width:min(230px,27vh);height:min(230px,27vh)}[data-mbcc-boot] .mbcc-boot-wordmark{font-size:min(100px,18vh)}[data-mbcc-boot] .mbcc-boot-corner{top:27px}[data-mbcc-boot] .mbcc-boot-footer{bottom:26px}[data-mbcc-boot] .mbcc-boot-step{padding:3px 0}}
@media(max-width:480px){[data-mbcc-boot] .mbcc-boot-frame{inset:12px}[data-mbcc-boot] .mbcc-boot-corner{left:24px;top:25px;font-size:8px}[data-mbcc-boot] .mbcc-boot-footer{left:24px;right:24px;bottom:24px}[data-mbcc-boot] .mbcc-boot-caption{font-size:8px;letter-spacing:.13em}[data-mbcc-boot] .mbcc-boot-steps{font-size:10px}}
`;

const PHASES = [
  ['正在建立终端链路', '01 / TERMINAL LINK'],
  ['正在读取档案索引', '02 / ARCHIVE INDEX'],
  ['正在校验界面组件', '03 / INTERFACE CHECK'],
  ['欢迎归来，局长', 'ACCESS GRANTED'],
];
const STEP_LABELS = ['01 终端链路 / TERMINAL', '02 档案索引 / ARCHIVE', '03 界面组件 / INTERFACE', '04 主题演出 / PRESENTATION'];

function localSealUrl(value, document) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, document.baseURI || 'file:///');
    // Assets may be bundled as data, blob or a local/same-origin URL. Do not
    // initiate an external request when mounting this presentation.
    if (['file:', 'data:', 'blob:', 'app:', 'dsh:'].includes(url.protocol)) return value;
    const base = new URL(document.baseURI || 'file:///');
    if (url.origin === base.origin && ['http:', 'https:'].includes(url.protocol)) return value;
  } catch { /* Fall back to the wordmark for invalid or external URLs. */ }
  return null;
}

/**
 * Mount the startup overlay and start it immediately.
 * @param {{document?: Document, window?: Window, sealUrl?: string, durationMs?: number}} options
 * @returns {{dispose: () => void, replay: () => void}}
 */
export function mountBoot({ document: doc = globalThis.document, window: win = doc?.defaultView || globalThis.window, sealUrl, durationMs = 6500 } = {}) {
  if (!doc?.body || !win?.requestAnimationFrame) throw new TypeError('mountBoot requires a ready document and window.');
  const value = Number(durationMs);
  const duration = Math.min(10000, Math.max(1000, Number.isFinite(value) ? value : 6500));
  const listeners = [];
  const timers = new Set();
  let root = null;
  let canvas = null;
  let context = null;
  let raf = null;
  let running = false;
  let mediaQuery = null;
  let reduced = false;
  let previousFocus = null;
  let width = 0;
  let height = 0;
  let streams = [];
  let started = 0;
  let lastFrame = 0;
  let lastPhase = -1;
  let lastDone = -1;
  let title;
  let code;
  let rule;
  let rows;

  const now = () => win.performance?.now?.() ?? Date.now();
  function element(tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  }
  function later(callback, delay) {
    const timer = win.setTimeout(() => { timers.delete(timer); if (running) callback(); }, delay);
    timers.add(timer);
  }
  function dispose() {
    running = false;
    if (raf !== null) win.cancelAnimationFrame(raf);
    raf = null;
    timers.forEach(timer => win.clearTimeout(timer));
    timers.clear();
    listeners.splice(0).forEach(remove => remove());
    const restoreFocus = root?.contains?.(doc.activeElement);
    root?.remove();
    root = canvas = context = null;
    streams = [];
    if (restoreFocus && previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true });
    previousFocus = null;
    if (activeBoots.get(doc) === controller) activeBoots.delete(doc);
  }
  function resize() {
    if (!canvas || !root) return;
    width = Math.max(1, root.clientWidth || win.innerWidth || 1280);
    height = Math.max(1, root.clientHeight || win.innerHeight || 720);
    const dpr = Math.min(2, Math.max(1, win.devicePixelRatio || 1));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (context) {
      context.fillStyle = '#070708';
      context.fillRect(0, 0, width, height);
      context.font = '600 12px ui-monospace, SFMono-Regular, Consolas, monospace';
    }
    streams = Array.from({ length: Math.ceil(width / 24) }, (_, i) => ({
      x: 12 + i * 24,
      y: Math.random() * height,
      speed: 55 + Math.random() * 115,
      accumulator: 0,
      red: Math.random() > .67,
    }));
  }
  function update(elapsed) {
    const progress = Math.min(1, elapsed / duration);
    const phase = Math.min(3, Math.floor(progress / .25));
    if (phase !== lastPhase) {
      lastPhase = phase;
      root.setAttribute('data-phase', String(phase + 1));
      title.textContent = PHASES[phase][0];
      code.textContent = PHASES[phase][1];
    }
    const done = progress >= .75 ? 4 : Math.floor(progress / .1875);
    if (done !== lastDone) {
      lastDone = done;
      rows.forEach((row, i) => {
        row.item.setAttribute('data-state', i < done ? 'done' : i === done ? 'active' : 'waiting');
        row.state.textContent = i < done ? 'PASS' : i === done ? 'CHECK' : 'WAIT';
      });
    }
    rule.style.setProperty('--mbcc-boot-progress', `${Math.round(progress * 100)}%`);
    if (progress >= .9) root.setAttribute('data-exiting', '');
  }
  function draw(dt) {
    if (!context || reduced) return;
    context.fillStyle = `rgba(7,7,8,${Math.min(.4, Math.max(.055, dt * 4))})`;
    context.fillRect(0, 0, width, height);
    for (const stream of streams) {
      stream.accumulator += stream.speed * dt;
      while (stream.accumulator >= 17) {
        stream.accumulator -= 17;
        stream.y += 17;
        if (stream.y > height + 32) stream.y = -Math.random() * height * .35;
        const char = '0123456789ABCDEF/:+'.charAt(Math.floor(Math.random() * 19));
        context.fillStyle = stream.red ? '#9e4b57' : '#87807a';
        context.fillText(char, stream.x, stream.y);
      }
    }
  }
  function frame() {
    if (!running) return;
    const time = now();
    const elapsed = time - started;
    if (elapsed >= duration) { dispose(); return; }
    update(elapsed);
    draw(Math.min(.08, Math.max(0, (time - lastFrame) / 1000)));
    lastFrame = time;
    raf = win.requestAnimationFrame(frame);
  }
  function replay() {
    dispose();
    const current = activeBoots.get(doc);
    if (current && current !== controller) current.dispose();
    activeBoots.set(doc, controller);
    running = true;
    lastPhase = lastDone = -1;
    previousFocus = doc.activeElement;
    root = element('section');
    root.setAttribute('data-mbcc-boot', '');
    root.setAttribute('translate', 'no');
    root.setAttribute('aria-label', 'MBCC 主题启动演出');
    const style = element('style');
    style.textContent = STYLES;
    canvas = element('canvas', 'mbcc-boot-rain');
    canvas.setAttribute('aria-hidden', 'true');
    try { context = canvas.getContext('2d', { alpha: false }); } catch { context = null; }
    const vignette = element('div', 'mbcc-boot-vignette');
    vignette.setAttribute('aria-hidden', 'true');
    const border = element('div', 'mbcc-boot-frame');
    border.setAttribute('aria-hidden', 'true');
    const corner = element('div', 'mbcc-boot-corner', 'MINOS / PERSONAL TERMINAL\nSTARTUP PRESENTATION');
    const content = element('div', 'mbcc-boot-content');
    const seal = localSealUrl(sealUrl, doc);
    const wordmark = element('div', 'mbcc-boot-wordmark', 'MBCC');
    if (seal) {
      const image = element('img', 'mbcc-boot-seal');
      image.alt = 'MBCC 徽记';
      image.src = seal;
      listen(image, 'error', () => { image.replaceWith(wordmark); });
      content.append(image);
    } else content.append(wordmark);
    content.append(element('div', 'mbcc-boot-caption', 'MINOS BUREAU OF CRISIS CONTROL'));
    rule = element('div', 'mbcc-boot-rule');
    rule.setAttribute('aria-hidden', 'true');
    title = element('h1', 'mbcc-boot-title');
    title.setAttribute('aria-live', 'polite');
    title.setAttribute('aria-atomic', 'true');
    code = element('div', 'mbcc-boot-code');
    code.setAttribute('aria-hidden', 'true');
    const steps = element('ol', 'mbcc-boot-steps');
    steps.setAttribute('aria-hidden', 'true');
    rows = STEP_LABELS.map(label => {
      const item = element('li', 'mbcc-boot-step');
      const state = element('span', null, 'WAIT');
      item.append(element('span', null, label), state);
      steps.append(item);
      return { item, state };
    });
    content.append(rule, title, code, steps);
    const footer = element('div', 'mbcc-boot-footer');
    const skip = element('button', 'mbcc-boot-skip', '跳过 / ESC');
    skip.type = 'button';
    skip.setAttribute('aria-label', '跳过启动演出，进入工作台');
    footer.append(element('span', null, '认证文字仅为主题视觉演出，不代表真实安全认证。'), skip);
    root.append(style, canvas, vignette, border, corner, content, footer);
    doc.body.append(root);
    mediaQuery = win.matchMedia?.('(prefers-reduced-motion: reduce)') || null;
    reduced = !!mediaQuery?.matches;
    const applyReducedMotion = event => {
      reduced = !!event.matches;
      root?.toggleAttribute('data-reduced-motion', reduced);
      resize();
    };
    root.toggleAttribute('data-reduced-motion', reduced);
    if (mediaQuery?.addEventListener) listen(mediaQuery, 'change', applyReducedMotion);
    else if (mediaQuery?.addListener) {
      mediaQuery.addListener(applyReducedMotion);
      listeners.push(() => mediaQuery.removeListener(applyReducedMotion));
    }
    listen(win, 'resize', resize);
    listen(win, 'keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation?.();
        dispose();
      }
    }, { capture: true });
    listen(skip, 'click', dispose);
    resize();
    started = lastFrame = now();
    update(0);
    // The timeout also releases the overlay when rAF is throttled in a hidden
    // window. It is removed by every disposal path, including replay.
    later(dispose, duration);
    raf = win.requestAnimationFrame(frame);
    skip.focus?.({ preventScroll: true });
  }
  const controller = { dispose, replay };
  replay();
  return controller;
}
