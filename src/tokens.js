export const PALETTE = Object.freeze({
  '--dsw-alias-bg-base': '#0d0d0f', '--dsw-alias-bg-layer-1': '#171719',
  '--dsw-alias-bg-layer-2': '#202022', '--dsw-alias-bg-layer-3': '#29282b',
  '--dsw-alias-bg-module-platform': '#161618', '--dsw-alias-bg-overlay': '#1c1b1e',
  '--dsw-alias-label-primary': '#dedbd5', '--dsw-alias-label-primary-bluish': '#dedbd5',
  '--dsw-alias-label-secondary': '#b6b1af', '--dsw-alias-label-tertiary': '#928b8c',
  '--dsw-alias-label-caption': '#8b8385', '--dsw-alias-label-primary-foreground': '#f4e8e5',
  '--dsw-alias-border-l1': '#ffffff12', '--dsw-alias-border-l2': '#ffffff20',
  '--dsw-alias-border-l3': '#ffffff30', '--dsw-alias-border-l4': '#ffffff48',
  '--dsw-alias-brand-primary': '#a45358', '--dsw-alias-brand-text': '#cc979d',
  '--dsw-alias-link': '#d3979f', '--dsw-alias-state-business-primary': '#bc7985',
  '--dsw-alias-button-primary-fill': '#742b37', '--dsw-alias-button-primary-hover': '#913a48',
  '--dsw-alias-button-primary-dimmed': '#46232c', '--dsw-alias-button-ghost-active-fill': '#7e39482d',
  '--dsw-alias-button-ghost-active-border': '#9b586666', '--dsw-alias-interactive-bg-hover': '#ffffff0c',
  '--dsw-alias-interactive-bg-active': '#7935413d', '--dsw-alias-interactive-bg-hover-accent': '#86404422',
  '--dsw-specific-sidebar-fill': '#0b0b0d', '--dsw-specific-sidebar-nav-item-active': '#71304335',
  '--dsw-specific-sidebar-nav-item-active-accent': '#af6065', '--dsw-specific-sidebar-nav-item-hover': '#ffffff09',
  '--dsw-specific-input-major': '#1d1c20', '--dsw-specific-bubble': '#252327',
  '--dsw-specific-menu': '#211f23', '--dsw-menu-surface-fill': '#211f23',
  '--dsw-alias-menu-group-header-fill': '#1d1b20', '--dsw-alias-markdown-code-block': '#111114',
  '--dsw-alias-markdown-code-block-banner': '#1b1a1e', '--dsw-alias-markdown-inline-code': '#29262c',
  '--dsw-alias-tooltip-bg': '#29262d', '--dsw-alias-settings-card-fill': '#1b1a1e',
  '--dsw-alias-settings-card-stroke': '#ffffff26', '--dsw-focus-ring-color': '#cb8b98',
});

export function tokenOverrides() {
  return Object.fromEntries(Object.entries(PALETTE).map(([key,value]) => [key,{light:value,dark:value}]));
}
