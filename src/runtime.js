const OWNED = 'data-mbcc-owned';
const activeThemes = new WeakMap();

export function safeArt(assets = {}) {
  if (!assets || typeof assets !== 'object' || Array.isArray(assets)) return {};
  return Object.fromEntries(Object.entries(assets).filter(([key, value]) =>
    ['seal','wordmark','city','field','map'].includes(key) && typeof value === 'string' &&
    /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(value) && value.length <= 12 * 1024 * 1024));
}

/** Own only the nodes, observers and attributes installed by this invocation. */
export function mountTheme({ document: doc, window: win, styleText, assets = {}, fullLayout = true }) {
  activeThemes.get(doc)?.();
  const html = doc.documentElement;
  const previous = { active: html.getAttribute('data-mbcc-active'), layout: html.getAttribute('data-mbcc-layout') };
  const owned = new Set();
  const observed = new Set();
  let stopped = false, frame = 0;
  function own(node) { node.setAttribute(OWNED, ''); node.setAttribute('translate','no'); owned.add(node); return node; }
  function element(tag, className, text) {
    const node = doc.createElement(tag); if (className) node.className = className;
    if (text) node.textContent = text; return node;
  }
  function image(source, className) {
    const img = element('img', className); img.src = source; img.alt = ''; img.decoding = 'async';
    return img;
  }
  assets = safeArt(assets);
  html.setAttribute('data-mbcc-active', '0.1.0');
  if (fullLayout) html.setAttribute('data-mbcc-layout', '');
  const css = own(element('style')); css.id = 'mbcc-plugin-style';
  css.textContent = styleText + '\nhtml[data-mbcc-active]{' +
    Object.entries(assets).map(([key, value]) => `--mbcc-${key}:url("${value}");`).join('') + '}';
  doc.head.append(css);
  doc.getElementById('mbcc-preboot')?.remove();

  if (fullLayout) {
    const mast = own(element('header')); mast.id = 'mbcc-masthead'; mast.setAttribute('aria-hidden', 'true');
    const identity = element('div', 'identity');
    identity.append(assets.seal ? image(assets.seal) : element('span', 'monogram', 'M / B'));
    const name = element('div', 'name', 'MBCC / DEEPSEEK HARNESS');
    name.append(element('small', '', 'MINOS BUREAU OF CRISIS CONTROL')); identity.append(name);
    const archive = element('div', 'archive', 'RESTRICTED ACCESS');
    archive.append(element('small', '', 'CLASSIFIED OPERATION TERMINAL'));
    const paper = element('div', 'paper'); paper.append(element('span', '', 'CONFIDENTIAL PAPER'), element('b', '', 'MBCC—S—028'));
    mast.append(element('div', 'mbcc-mast-city'), identity, archive, paper, element('div', 'mbcc-registration'));
    doc.body.append(mast);
  }

  function dossier(kind) {
    const root = own(element('div', 'mbcc-' + kind + '-dossier'));
    root.setAttribute('aria-hidden','true');
    if (kind === 'sidebar') {
      root.append(element('div','dossier-code','M.B.C.C. / S—028'));
      root.append(assets.wordmark ? image(assets.wordmark) : element('strong','dossier-wordmark','MBCC'));
      const caption = element('div','dossier-caption','米诺斯危机管理局');
      caption.append(element('small','','MINOS BUREAU OF CRISIS CONTROL')); root.append(caption,element('div','dossier-barcode'));
    } else if (kind === 'guide') {
      const caption = element('div','city-caption');
      caption.append(element('span','',assets.city ? '原作美术档案' : '都市空间 / 原创示意'),element('b','',assets.city ? '狄斯城 / DIS CITY' : 'URBAN FIELD ARCHIVE'));
      root.append(element('div','city-print'),caption,element('small','','MINOS / FIELD ARCHIVE'));
    } else {
      const label = element('div','hero-file-label','CONFIDENTIAL PAPER'); label.append(element('span','','MINOS / 01'));
      root.append(label);
      root.append(assets.seal ? image(assets.seal,'hero-file-seal') : element('div','hero-file-seal hero-file-monogram','M'));
      const copy = element('div','hero-file-copy');
      copy.append(element('small','','MINOS BUREAU OF CRISIS CONTROL'),element('strong','','米诺斯危机管理局'),element('span','','局长专属终端 / DIRECTOR WORKSTATION'));
      root.append(copy,element('div','hero-file-code'),element('div','hero-file-edge','CONTROL UNDER SURVEILLANCE'));
    }
    return root;
  }
  const resize = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(schedule) : null;
  function update() {
    frame = 0;
    if (stopped || !fullLayout) return;
    // Version-specific DOM compatibility layer, never a replacement chat UI.
    for (const [selector, kind] of [['.kB3qhq_regionArea','sidebar'],['.F6Huca_guide','guide'],['._8tPydW_root','hero']]) {
      for (const parent of doc.querySelectorAll(selector)) {
        let art = [...parent.children].find(child => child.hasAttribute(OWNED) && child.classList.contains('mbcc-' + kind + '-dossier'));
        if (!art) { art = dossier(kind); parent.append(art); }
        if (!observed.has(parent)) { resize?.observe(parent); observed.add(parent); }
        if (kind === 'sidebar') {
          const bounds = parent.getBoundingClientRect(); let bottom = bounds.top;
          for (const row of parent.querySelectorAll('[role=row],[role=treeitem]')) {
            const box = row.getBoundingClientRect(); if (box.height) bottom = Math.max(bottom,box.bottom);
          }
          art.hidden = bounds.height < 250 || bounds.bottom - bottom < 215;
        }
      }
    }
    // Disconnected native panels must not accumulate references across sessions.
    for (const node of owned) if (!node.isConnected) owned.delete(node);
    for (const parent of observed) if (!parent.isConnected) { resize?.unobserve(parent); observed.delete(parent); }
  }
  function schedule() { if (!stopped && fullLayout && !frame) frame = win.requestAnimationFrame(update); }
  const observer = fullLayout && typeof win.MutationObserver === 'function' ? new win.MutationObserver(schedule) : null;
  observer?.observe(doc.body,{ childList:true, subtree:true });
  doc.body.addEventListener('scroll',schedule,{capture:true,passive:true});
  win.addEventListener('resize',schedule,{passive:true});
  schedule();
  function dispose() {
    if (stopped) return; stopped = true;
    observer?.disconnect(); resize?.disconnect(); if (frame) win.cancelAnimationFrame(frame);
    observed.clear();
    doc.body.removeEventListener('scroll',schedule,true); win.removeEventListener('resize',schedule);
    for (const node of owned) node.remove(); owned.clear();
    if (html.getAttribute('data-mbcc-active') === '0.1.0') {
      for (const [key,value] of Object.entries(previous)) {
        const attr = 'data-mbcc-' + key; if (value === null) html.removeAttribute(attr); else html.setAttribute(attr,value);
      }
    }
    if (activeThemes.get(doc) === dispose) activeThemes.delete(doc);
  }
  activeThemes.set(doc,dispose);
  return dispose;
}
