# Third-party notices

## Project identity and license scope

**dsh-theme-mbcc** is an unofficial fan-made visual theme for DeepSeek Harness. It is not developed, sponsored, or endorsed by DeepSeek or the creators of **Path to Nowhere / 无期迷途**. Names are used to identify the host application and the artistic inspiration.

The [MIT license](./LICENSE) covers this project's own code, documentation, and programmatically authored textures. It does not grant rights to third-party fonts, application code, trademarks, logos, game art, or user-supplied images.

## Bundled font software

The default package includes static WOFF2 derivatives of **Noto Sans SC**:

- `assets/fonts/mbcc-text-medium.woff2` — weight 500.
- `assets/fonts/mbcc-ui-semibold.woff2` — weight 650.
- `assets/fonts/mbcc-ui-bold.woff2` — weight 700.
- `assets/fonts/mbcc-ui-black.woff2` — weight 900.

Copyright 2014–2021 Adobe, with Reserved Font Name **Source**.

These font files are distributed under the **SIL Open Font License 1.1**, not MIT. Their modifications are static weight instantiation, glyph subsetting, and WOFF2 encoding. See the complete [OFL text](./assets/fonts/OFL.txt), [font notice](./assets/fonts/FONT-NOTICE.md), and [file metadata](./assets/fonts/font-manifest.json).

Upstream references: [Google Fonts Noto Sans SC](https://github.com/google/fonts/tree/main/ofl/notosanssc), [official OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/OFL.txt).

The retained internal name `Noto Sans SC Thin` comes from the variable font's original naming table; the actual static weights are recorded above. It is not a claim that the theme uses a thin rendering weight.

## Optional artwork supplied by the user

No official Path to Nowhere images, logos, game wordmark, or website font are bundled with the default source/package. The following optional filenames are recognized in the local directory configured by `artDirectory`:

| Local filename | Identified artwork | Original source reference |
|---|---|---|
| `mbcc-seal.png` | MBCC emblem | [Official website image](https://static.aisnogames.com/aisnoweb/aisno/wqmtcn/_next/static/media/logo-icon.bb5d7d84.png) |
| `mbcc-original-wordmark.png` | Path to Nowhere wordmark | [Official website image](https://static.aisnogames.com/aisnoweb/aisno/activity-cn/img/logo.323d2f0e73a31b4cab4f.png) |
| `mbcc-official-discity.png` | DisCity scene | [Official website image](https://static.aisnogames.com/aisnoweb/aisno/wqmtcn/_next/static/media/p4_edge008.a1b22645.png) |
| `mbcc-field-record.png` | MBCC office archive image | [Official website image](https://static.aisnogames.com/aisnoweb/aisno/wqmtcn/_next/static/media/p4_mbcc_new.ae8f2235.png) |
| `mbcc-official-map.png` | Map/background panel | [Official website image](https://static.aisnogames.com/aisnoweb/aisno/wqmtcn/_next/static/media/p4_bgright.3d0058c9.png) |

The [official game website](https://www.aisnogames.com/home) is listed for attribution and source identification. These URLs are not a statement that redistribution is permitted. Copyright and trademark rights remain with their respective owners. Users must have the necessary rights for the images they choose to supply and for any subsequent sharing. This project does not relicense those images or automatically upload them to GitHub.

The website's **MF LangSong (Noncommercial)** font is not included. Neither are files or extracted glyph outlines from macOS fonts such as Songti, DIN Condensed, Baskerville, Arial Black, or Courier New. A CSS font fallback may refer to a font already installed on the user's system without bundling its font software.

## Host application

DeepSeek Harness is a separate application. This repository does not redistribute its application bundle, `app.asar`, extracted source modules, or user profile. The theme uses the host's Bundle mechanism and includes a version-specific visual compatibility layer for **0.2.1-rc.3**. Interface names and CSS selectors are not presented as stable public APIs.

Host project: [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness).
