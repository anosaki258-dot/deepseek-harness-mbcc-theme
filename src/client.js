import { mountTheme, safeArt } from './runtime.js';
import { mountBoot } from './boot.js';
import { tokenOverrides } from './tokens.js';

export const inject = ['theme'];
export function apply(ctx) {
  ctx.effect(() => {
    const options = window.__MBCC_THEME_CONFIG__ || {};
    const assets = safeArt(options.assets);
    const disposeTokens = ctx.theme.overrideTokens('dsh-theme-mbcc', tokenOverrides());
    let disposeTheme, boot;
    try {
      disposeTheme = mountTheme({document, window, styleText: MBCC_STYLE, assets, fullLayout: options.fullLayout !== false});
      if (options.startup !== false) boot = mountBoot({document, window, sealUrl: assets.seal});
    } catch (error) { boot?.dispose(); disposeTheme?.(); disposeTokens(); throw error; }
    return () => {
      boot?.dispose(); disposeTheme?.(); disposeTokens();
      if (window.__MBCC_THEME_CONFIG__ === options) delete window.__MBCC_THEME_CONFIG__;
    };
  });
}
