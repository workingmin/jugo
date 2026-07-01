# Web 原型双主题设计

## 目标

为 `v0.2.0-planning` Web prototype demo 提供两套系统级全局主题：

- 日间专业浅色模式：适合负责人办公评审、团队协作和结构化信息扫描。
- 夜间创作深色模式：适合长时间创作、剧情梳理和低照度环境下查看画布。

两套主题使用同一套语义化 token。页面和组件不直接引用具体色值，只引用 token 名称，后续通过 `data-theme="light"` / `data-theme="dark"` 切换。

## 设计原则

1. 工作台优先：界面服务于项目管理、世界观、分支树、矩阵时序和节拍板，不做营销页式视觉。
2. 高可读性：正文、标签、批注、校验状态必须在两套主题下清晰可辨。
3. 低干扰：大面积背景保持克制，强调色只用于主操作、选中态、状态提醒和画布关键节点。
4. 同构切换：浅色和深色主题保持布局、组件尺寸、信息层级一致。
5. 语义优先：颜色按用途命名，避免在组件里写死 `blue`、`gray`、`dark` 等具体色名。

## 主题 A：日间专业浅色模式

### 使用场景

- 需求评审会议。
- 负责人查看全局结构、校验报告和批注。
- 团队成员白天办公协作。

### 视觉气质

干净、理性、清晰。背景使用带轻微纸张感的冷暖中性底色，主操作使用偏文学编辑器气质的酒红 / 批注红，辅助入口使用墨蓝灰，避免旧版青绿工具感。

### 核心色板

| Token | 色值 | 用途 |
| --- | --- | --- |
| `--color-bg-app` | `#F7F5F7` | 应用整体背景 |
| `--color-bg-surface` | `#FFFFFF` | 顶栏、侧栏、详情面板、弹窗 |
| `--color-bg-subtle` | `#EEEAF0` | 工具栏、表头、轻量分区背景 |
| `--color-bg-canvas` | `#FAF8FA` | 矩阵时序、分支树、节拍板画布底色 |
| `--color-text-primary` | `#211B20` | 主要文字 |
| `--color-text-secondary` | `#5F5660` | 次级文字、说明 |
| `--color-text-muted` | `#887D86` | 弱提示、时间、辅助信息 |
| `--color-border` | `#DCD4DC` | 常规边框 |
| `--color-border-strong` | `#BFAFBB` | 面板分隔、选区边界 |
| `--color-primary` | `#8F3F5F` | 主按钮、当前视图、关键选中态 |
| `--color-primary-hover` | `#74314D` | 主按钮悬浮 |
| `--color-primary-soft` | `#F4E6EC` | 选中背景、轻量主色标签 |
| `--color-accent` | `#4F638D` | AI 工具、特殊入口、隐藏结局 |
| `--color-accent-soft` | `#E7ECF5` | AI / 特殊入口轻背景 |
| `--color-success` | `#2F7D68` | 已解决、同步成功 |
| `--color-warning` | `#A86D32` | 伏笔待回收、节奏风险 |
| `--color-danger` | `#B84A4A` | 冲突、删除、严重问题 |
| `--color-info` | `#4F6FA6` | 系统信息、定位提示 |

## 主题 B：夜间创作深色模式

### 使用场景

- 夜间长时间创作。
- 编剧查看节拍、分支和单场细节。
- 需要降低屏幕亮度但仍保持结构判断能力的场景。

### 视觉气质

沉稳、聚焦、不压抑。避免纯黑背景和大面积深绿，使用夜稿纸黑、墨紫灰和柔和酒红作为主色，配合墨蓝灰区分 AI / 特殊入口。

### 核心色板

| Token | 色值 | 用途 |
| --- | --- | --- |
| `--color-bg-app` | `#171519` | 应用整体背景 |
| `--color-bg-surface` | `#242027` | 顶栏、侧栏、详情面板、弹窗 |
| `--color-bg-subtle` | `#2D2831` | 工具栏、表头、轻量分区背景 |
| `--color-bg-canvas` | `#1C1920` | 矩阵时序、分支树、节拍板画布底色 |
| `--color-text-primary` | `#ECE8EC` | 主要文字 |
| `--color-text-secondary` | `#C5BAC4` | 次级文字、说明 |
| `--color-text-muted` | `#978B96` | 弱提示、时间、辅助信息 |
| `--color-border` | `#443B45` | 常规边框 |
| `--color-border-strong` | `#665867` | 面板分隔、选区边界 |
| `--color-primary` | `#D58AA6` | 主按钮、当前视图、关键选中态 |
| `--color-primary-hover` | `#E7A4BB` | 主按钮悬浮 |
| `--color-primary-soft` | `#3A2430` | 选中背景、轻量主色标签 |
| `--color-accent` | `#91A4D8` | AI 工具、特殊入口、隐藏结局 |
| `--color-accent-soft` | `#263049` | AI / 特殊入口轻背景 |
| `--color-success` | `#6BC0A5` | 已解决、同步成功 |
| `--color-warning` | `#D2A15E` | 伏笔待回收、节奏风险 |
| `--color-danger` | `#E07373` | 冲突、删除、严重问题 |
| `--color-info` | `#93A9E8` | 系统信息、定位提示 |

## 共享语义 Token

### 文字与层级

| Token | 建议 |
| --- | --- |
| `--font-family-base` | `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif` |
| `--font-size-xs` | `12px` |
| `--font-size-sm` | `13px` |
| `--font-size-md` | `14px` |
| `--font-size-lg` | `16px` |
| `--font-size-xl` | `20px` |
| `--line-height-tight` | `1.35` |
| `--line-height-base` | `1.55` |

标题不使用夸张字号。工作台内的面板标题建议 `14px` 或 `16px`，页面级标题建议 `20px`。

### 尺寸与圆角

| Token | 值 | 用途 |
| --- | --- | --- |
| `--radius-sm` | `4px` | 输入框、标签、工具按钮 |
| `--radius-md` | `6px` | 普通按钮、列表项 |
| `--radius-lg` | `8px` | 项目卡片、弹窗、详情面板 |
| `--height-topbar` | `56px` | 项目内全局顶部栏 |
| `--width-left-panel` | `260px` | 常规左侧栏 |
| `--width-right-panel` | `340px` | 常规右侧详情栏 |
| `--gap-xs` | `4px` | 标签内部间距 |
| `--gap-sm` | `8px` | 紧凑控件间距 |
| `--gap-md` | `12px` | 表单和卡片内部间距 |
| `--gap-lg` | `16px` | 面板内部间距 |
| `--gap-xl` | `24px` | 页面级区块间距 |

### 阴影

浅色模式可以使用轻微阴影；深色模式优先使用边框和背景层级，减少发灰阴影。

| Token | 浅色 | 深色 |
| --- | --- | --- |
| `--shadow-panel` | `0 8px 24px rgba(23, 32, 38, 0.08)` | `0 12px 28px rgba(0, 0, 0, 0.28)` |
| `--shadow-popover` | `0 14px 36px rgba(23, 32, 38, 0.16)` | `0 16px 40px rgba(0, 0, 0, 0.42)` |

## 业务颜色

业务颜色用于跨页面保持含义一致，尤其是分支、轨道、伏笔和校验报告。

### 轨道颜色

| 轨道 | 浅色 | 深色 |
| --- | --- | --- |
| 主线 | `#8F3F5F` | `#D58AA6` |
| 女主线 / 情感线 | `#C86D88` | `#F0A1B8` |
| 反派线 | `#4F638D` | `#91A4D8` |
| 势力线 | `#7B5EA7` | `#B7A0DC` |
| 伏笔线 | `#A86D32` | `#D2A15E` |

### 分支结局颜色

| 类型 | 浅色 | 深色 |
| --- | --- | --- |
| 好结局 | `#2F7D68` | `#6BC0A5` |
| 坏结局 | `#B84A4A` | `#E07373` |
| 隐藏结局 | `#7B5EA7` | `#B7A0DC` |
| 中立结局 | `#64748B` | `#A3ADB8` |

### 校验等级

| 等级 | 语义 | 颜色 |
| --- | --- | --- |
| `critical` | 阻断评审，必须修改 | `--color-danger` |
| `warning` | 影响质量，需要确认 | `--color-warning` |
| `info` | 建议优化或提示定位 | `--color-info` |
| `resolved` | 已处理 | `--color-success` |

## 组件使用规范

### 顶部全局操作栏

- 背景使用 `--color-bg-surface`。
- 底部分隔线使用 `--color-border`。
- 当前视图使用 `--color-primary-soft` 背景和 `--color-primary` 文本。
- 「全局校验」按钮使用 warning 或 danger 计数徽标，不常态使用红色主按钮。

### 侧边栏

- 背景使用 `--color-bg-surface`。
- 分类选中态使用 `--color-primary-soft`。
- 数量徽标使用 `--color-bg-subtle`，有冲突时切换为 warning / danger。

### 卡片

- 项目卡片、时序卡片、节拍卡片统一 `8px` 以下圆角。
- 卡片左侧或顶部使用轨道色短条表达归属，不使用整卡大面积强色。
- 批注红点只作为状态提示，避免把整张卡片染红。

### 画布

- 画布底色使用 `--color-bg-canvas`。
- 网格线使用低对比度边框色：
  - 浅色：`rgba(23, 32, 38, 0.08)`
  - 深色：`rgba(231, 236, 239, 0.08)`
- 拖拽 / 选中态使用 `--color-primary` 外框和 `--color-primary-soft` 背景。

### 表单与输入

- 输入框背景使用 `--color-bg-surface`。
- focus 使用 `--color-primary` 边框。
- 禁用态使用 `--color-bg-subtle` 和 `--color-text-muted`。

### 主题切换

- 顶栏右侧提供图标按钮切换日间 / 夜间。
- 用户切换后写入 `localStorage.theme`。
- 首次进入默认日间模式；如系统 `prefers-color-scheme: dark`，可默认夜间模式。

## CSS 变量草案

已同步落地到 `prototype/v0.2.0-planning/src/styles/theme.css`，后续原型初始化时可直接引入。核心变量如下：

```css
:root,
[data-theme="light"] {
  --color-bg-app: #F7F5F7;
  --color-bg-surface: #FFFFFF;
  --color-bg-subtle: #EEEAF0;
  --color-bg-canvas: #FAF8FA;
  --color-text-primary: #211B20;
  --color-text-secondary: #5F5660;
  --color-text-muted: #887D86;
  --color-border: #DCD4DC;
  --color-border-strong: #BFAFBB;
  --color-primary: #8F3F5F;
  --color-primary-hover: #74314D;
  --color-primary-soft: #F4E6EC;
  --color-accent: #4F638D;
  --color-accent-soft: #E7ECF5;
  --color-success: #2F7D68;
  --color-warning: #A86D32;
  --color-danger: #B84A4A;
  --color-info: #4F6FA6;
}

[data-theme="dark"] {
  --color-bg-app: #171519;
  --color-bg-surface: #242027;
  --color-bg-subtle: #2D2831;
  --color-bg-canvas: #1C1920;
  --color-text-primary: #ECE8EC;
  --color-text-secondary: #C5BAC4;
  --color-text-muted: #978B96;
  --color-border: #443B45;
  --color-border-strong: #665867;
  --color-primary: #D58AA6;
  --color-primary-hover: #E7A4BB;
  --color-primary-soft: #3A2430;
  --color-accent: #91A4D8;
  --color-accent-soft: #263049;
  --color-success: #6BC0A5;
  --color-warning: #D2A15E;
  --color-danger: #E07373;
  --color-info: #93A9E8;
}

:root {
  --font-family-base: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
  --line-height-tight: 1.35;
  --line-height-base: 1.55;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --height-topbar: 56px;
  --width-left-panel: 260px;
  --width-right-panel: 340px;
  --gap-xs: 4px;
  --gap-sm: 8px;
  --gap-md: 12px;
  --gap-lg: 16px;
  --gap-xl: 24px;
}
```

## 验收标准

- 两套主题都能覆盖项目首页、世界观、分支树、矩阵时序、节拍板和校验报告。
- 页面组件只引用语义 token，不直接写死主题色值。
- 浅色模式适合会议评审，深色模式适合长时间创作。
- 深色模式下正文、标签、卡片边界和校验状态保持可读。
- 主题切换不改变布局尺寸，不造成文字溢出或画布错位。
