# Font notices

The bundled WOFF2 files are static, subsetted derivatives of **Noto Sans SC**, made for this theme. They retain the upstream copyright notice and are distributed under the **SIL Open Font License 1.1** in [OFL.txt](./OFL.txt). The theme's source-code license does not replace the font license.

Upstream copyright: Copyright 2014–2021 Adobe, with Reserved Font Name **Source**.

Upstream font project and license:

- [Noto Sans SC in Google Fonts](https://github.com/google/fonts/tree/main/ofl/notosanssc)
- [Official OFL text](https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/OFL.txt), retrieved 2026-10-27.

| File | Static weight | Covered codepoints | Size |
|---|---:|---:|---:|
| `mbcc-text-medium.woff2` | 500 | 27,975 | 4,030,040 bytes |
| `mbcc-ui-semibold.woff2` | 650 | 672 | 88,116 bytes |
| `mbcc-ui-bold.woff2` | 700 | 656 | 85,736 bytes |
| `mbcc-ui-black.woff2` | 900 | 656 | 85,676 bytes |

Total font payload: **4,289,568 bytes** (about 4.09 MiB). The broad-coverage medium face supports arbitrary chat text; the three compact display subsets support the existing navigation, bold, and heavy-heading roles. Their combined overhead is about 254 KiB. They do not constitute complete Unicode or every CJK glyph coverage.

The files were created by instantiating the chosen variable-font weight, subsetting glyphs, and encoding WOFF2. They are static fonts, not variable fonts. Their retained internal family name is `Noto Sans SC Thin`, inherited from the variable font's original naming table; this string does **not** describe their actual weight. The `OS/2.usWeightClass` values are 500, 650, 700, and 900 respectively. Define the correct `font-weight` in each `@font-face` declaration and use project-specific CSS family aliases, such as `MBCCText` and `MBCCInterface`. The file hashes and actual metadata are recorded in [font-manifest.json](./font-manifest.json).

No font whose primary family name is the reserved name `Source` is bundled. The package does not include macOS system-font files or the website's MF LangSong Noncommercial font. Do not infer those fonts' redistribution rights from their availability on a machine or a public website.
