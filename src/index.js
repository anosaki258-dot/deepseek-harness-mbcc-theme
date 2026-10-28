import z from '@deepseek-ai/schemastery';
import { loadLocalArt } from './art-loader.js';

export const Config = z.object({
  startup: z.boolean().default(true).description('启动时播放黑红数据认证演出；可跳过。'),
  fullLayout: z.boolean().default(true).description('全幅城市档案版式；关闭后仅保留主题配色。'),
  artDirectory: z.string().default('').description('可选：自备原作 PNG 素材的本地绝对目录。该 Host 的连接客户端均可读取图片，请勿使用私密图片。修改后重启。'),
});

export async function apply(ctx, config = {}) {
  let assets = {};
  if (config.artDirectory) {
    try { assets = await loadLocalArt(config.artDirectory); }
    catch { ctx.logger?.warn?.('MBCC: local artwork could not be loaded; using the included original graphics.'); }
  }
  const options = { startup: config.startup !== false, fullLayout: config.fullLayout !== false, assets };
  // Official Desktop IPC and Web index-injection hook, not an ASAR patch.
  ctx.on('webserver/index-inject', table => {
    table.push({ kind: 'global', name: '__MBCC_THEME_CONFIG__', value: options });
    table.push({ kind: 'html', placement: 'head', html: '<style id="mbcc-preboot">body{background:#090909}</style>' });
  });
}
