# MBCC · DeepSeek Harness Theme

[English](./README.en.md)

**dsh-theme-mbcc 0.1.0** 是 DeepSeek Harness 的非官方粉丝视觉主题，以《无期迷途》的都市机构档案语汇为灵感：炭黑画布、克制的暗红印刷色、厚重中文、档案层次与流动数据启动演出。

通过原生 **Bundle 插件**安装，不修改 `app.asar`、应用安装包或代码签名。兼容版本精确锁定为 **DeepSeek Harness 0.2.1-rc.3**；新版本需要重新适配和验证。

## 外观与边界

- 全工作台共享黑红材质与档案版式，覆盖对话、输入区、侧栏和工具区。
- 正文与界面使用随包提供的 Noto Sans SC 字体，分别采用 500、650、700、900 字重。
- 可跳过的流动数据启动动画，支持系统减少动态效果偏好。
- 默认使用项目自行编写的程序纹理和文字标识，原作美术可从用户本地目录选配。
- 保留原生侧栏宽度和拖动行为。此插件不包含早期本机补丁版的栏宽修改，因此不会与旧截图逐像素一致。

动画里的“认证”“接入”等文字只是视觉演出，不执行身份认证、密钥校验或权限变更。主题不替代应用的安全机制。

本项目与 DeepSeek 及《无期迷途》官方无隶属或背书关系。原作图片、徽记和官网字体不随公开包提供。

![公开版在原生 Harness 中的真实界面](./docs/preview.jpg)

上图来自不含账号凭据的隔离 Harness 环境，使用公开包自带图形；不是生成的效果图。右侧栏由原生拖动调整。验证范围见 [0.1.0 验证记录](./docs/verification.md)。

![启动演出真实画面](./docs/startup.jpg)

## 安装

先确认应用版本为 **0.2.1-rc.3**。如果使用过修改 `app.asar` 的旧主题版，请先从自己的原版备份恢复，或重新安装官方同版本应用，再安装本插件，避免两套样式叠加。不要删除应用的用户资料目录。

### 从 GitHub 安装

在 DeepSeek Harness 的插件管理页打开安装入口，将以下内容粘贴到包地址输入框：

```text
github:anosaki258-dot/deepseek-harness-mbcc-theme
```

安装后启用 **dsh-theme-mbcc**。若当前页面没有重新加载主题，请重启 DeepSeek Harness。

这是 GitHub 包地址，不表示该名称已经发布到 npm。仓库中的已构建 `lib` 产物用于原生插件加载。

### 从本地 tarball 安装

可直接[下载已构建的插件安装包](https://github.com/anosaki258-dot/deepseek-harness-mbcc-theme/raw/refs/heads/main/downloads/dsh-theme-mbcc-0.1.0.tgz)，[校验 SHA-256](./downloads/SHA256SUMS.txt)。下载后，将完整文件路径填入 Harness 的插件安装框。

若要自己构建，在仓库目录执行：


```sh
npm install
npm run build
npm test
npm pack
```

将生成的 `dsh-theme-mbcc-0.1.0.tgz` 的完整本地路径粘贴到应用插件安装框，然后启用。不要把 tgz 解压后覆盖应用目录。

## 配置

在 Host 的 **dsh-theme-mbcc Bundle 配置**中设置以下字段；这是插件配置对象，不是完整的应用配置文件：

```json
{
  "startup": true,
  "fullLayout": true,
  "artDirectory": ""
}
```

| 配置项 | 默认值 | 含义 |
|---|---|---|
| `startup` | `true` | 播放启动动画；设为 `false` 后直接进入工作台。 |
| `fullLayout` | `true` | 启用完整档案装饰与布局样式；不改变原生栏宽常量。 |
| `artDirectory` | `""` | 可选的本地图片目录；留空时使用默认自制外观。 |

修改配置、启用或停用主题后，建议重启应用。未启用 HMR 的 Host 必须重启，单独刷新浏览器页面不足以重建服务端模块图。

### 可选原作元素

把自己有权使用的图片放在一个本地文件夹中，并将 `artDirectory` 设为该文件夹的完整路径。图片会提供给该 Host 的所有连接客户端，请勿使用私密图片。修改配置后重启 Host。支持以下精确文件名，按需提供：

```text
mbcc-seal.png
mbcc-original-wordmark.png
mbcc-official-discity.png
mbcc-field-record.png
mbcc-official-map.png
```

这些文件分别用于徽记、标题、狄斯城场景、办公室档案和地图底板。图片不属于插件发布包，也不会自动上传到仓库。缺少可选图片时使用默认视觉回退。请不要将自己的图片文件夹、个人路径配置或账号截图提交到公开仓库。

来源说明和权利边界见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。官网公开可访问的图片并不因此被本项目授予再分发许可。

## 停用与卸载

在原生插件管理页停用或卸载 **dsh-theme-mbcc**。若界面仍显示缓存样式，重启应用。无需恢复 `app.asar`，因为本插件不修改它；卸载插件也无需删除对话、工作区或账号资料。

## 开发与验证

```sh
npm install
npm run build
npm test
npm pack
```

发布前提交与源码对应的构建产物，检查 `npm pack` 清单只包含插件需要的文件。不要打包原版应用、ASAR、应用源码快照、用户资料、原作图片或个人实机截图。

此主题包含针对 **0.2.1-rc.3** 的视觉选择器兼容层。宿主升级可能改变结构或样式，未验证版本不应直接扩大兼容范围。构建与自动化测试不等于所有系统上的实机安装或在线模型调用验证；实际验证结果以对应版本的发布说明为准。

## 许可

项目自行编写的代码、文档与程序纹理采用 [MIT](./LICENSE)。随包 Noto 字体及其子集继续采用 [SIL OFL 1.1](./assets/fonts/OFL.txt)，详见 [字体说明](./assets/fonts/FONT-NOTICE.md)。原作名称、标识和用户自备美术仍归各自权利人，不能统一视为 MIT 素材。
