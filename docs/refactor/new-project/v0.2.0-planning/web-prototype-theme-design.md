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

干净、理性、清晰。背景使用接近白色的中性灰，主操作使用冷静青蓝色，状态色保持克制，避免旧版单一墨蓝观感。

### 核心色板

| Token | 色值 | 用途 |
| --- | --- | --- |
| `--color-bg-app` | `#F6F7F9` | 应用整体背景 |
| `--color-bg-surface` | `#FFFFFF` | 顶栏、侧栏、详情面板、弹窗 |
| `--color-bg-subtle` | `#EEF1F4` | 工具栏、表头、轻量分区背景 |
| `--color-bg-canvas` | `#F8FAFB` | 矩阵时序、分支树、节拍板画布底色 |
| `--color-text-primary` | `#172026` | 主要文字 |
| `--color-text-secondary` | `#52616B` | 次级文字、说明 |
| `--color-text-muted` | `#7D8B95` | 弱提示、时间、辅助信息 |
| `--color-border` | `#D7DEE5` | 常规边框 |
| `--color-border-strong` | `#B6C2CC` | 面板分隔、选区边界 |
| `--color-primary` | `#146C78` | 主按钮、当前视图、关键选中态 |
| `--color-primary-hover` | `#0F5964` | 主按钮悬浮 |
| `--color-primary-soft` | `#DDF1F3` | 选中背景、轻量主色标签 |
| `--color-accent` | `#8B5CF6` | AI 工具、特殊入口、隐藏结局 |
| `--color-accent-soft` | `#EEE8FF` | AI / 特殊入口轻背景 |
| `--color-success` | `#1F8A5B` | 已解决、同步成功 |
| `--color-warning` | `#B7791F` | 伏笔待回收、节奏风险 |
| `--color-danger` | `#C2413A` | 冲突、删除、严重问题 |
| `--color-info` | `#2F6FED` | 系统信息、定位提示 |

## 主题 B：夜间创作深色模式

### 使用场景

- 夜间长时间创作。
- 编剧查看节拍、分支和单场细节。
- 需要降低屏幕亮度但仍保持结构判断能力的场景。

### 视觉气质

沉稳、聚焦、不压抑。避免纯黑背景和大面积深蓝，使用炭黑、石墨灰和低饱和青绿作为主色，配合琥珀和紫色做状态区分。

### 核心色板

| Token | 色值 | 用途 |
| --- | --- | --- |
| `--color-bg-app` | `#151719` | 应用整体背景 |
| `--color-bg-surface` | `#202326` | 顶栏、侧栏、详情面板、弹窗 |
| `--color-bg-subtle` | `#292D31` | 工具栏、表头、轻量分区背景 |
| `--color-bg-canvas` | `#191C1F` | 矩阵时序、分支树、节拍板画布底色 |
| `--color-text-primary` | `#E7ECEF` | 主要文字 |
| `--color-text-secondary` | `#B4BEC6` | 次级文字、说明 |
| `--color-text-muted` | `#87919A` | 弱提示、时间、辅助信息 |
| `--color-border` | `#3A4046` | 常规边框 |
| `--color-border-strong` | `#56606A` | 面板分隔、选区边界 |
| `--color-primary` | `#4FB3BF` | 主按钮、当前视图、关键选中态 |
| `--color-primary-hover` | `#74CDD6` | 主按钮悬浮 |
| `--color-primary-soft` | `#17363B` | 选中背景、轻量主色标签 |
| `--color-accent` | `#A78BFA` | AI 工具、特殊入口、隐藏结局 |
| `--color-accent-soft` | `#30264A` | AI / 特殊入口轻背景 |
| `--color-success` | `#48B882` | 已解决、同步成功 |
| `--color-warning` | `#D6A84F` | 伏笔待回收、节奏风险 |
| `--color-danger` | `#E06A61` | 冲突、删除、严重问题 |
| `--color-info` | `#7FA8FF` | 系统信息、定位提示 |

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
| 主线 | `#146C78` | `#4FB3BF` |
| 女主线 / 情感线 | `#C06C84` | `#F09AAD` |
| 反派线 | `#8B5CF6` | `#A78BFA` |
| 势力线 | `#2F6FED` | `#7FA8FF` |
| 伏笔线 | `#B7791F` | `#D6A84F` |

### 分支结局颜色

| 类型 | 浅色 | 深色 |
| --- | --- | --- |
| 好结局 | `#1F8A5B` | `#48B882` |
| 坏结局 | `#C2413A` | `#E06A61` |
| 隐藏结局 | `#8B5CF6` | `#A78BFA` |
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
  --color-bg-app: #F6F7F9;
  --color-bg-surface: #FFFFFF;
  --color-bg-subtle: #EEF1F4;
  --color-bg-canvas: #F8FAFB;
  --color-text-primary: #172026;
  --color-text-secondary: #52616B;
  --color-text-muted: #7D8B95;
  --color-border: #D7DEE5;
  --color-border-strong: #B6C2CC;
  --color-primary: #146C78;
  --color-primary-hover: #0F5964;
  --color-primary-soft: #DDF1F3;
  --color-accent: #8B5CF6;
  --color-accent-soft: #EEE8FF;
  --color-success: #1F8A5B;
  --color-warning: #B7791F;
  --color-danger: #C2413A;
  --color-info: #2F6FED;
}

[data-theme="dark"] {
  --color-bg-app: #151719;
  --color-bg-surface: #202326;
  --color-bg-subtle: #292D31;
  --color-bg-canvas: #191C1F;
  --color-text-primary: #E7ECEF;
  --color-text-secondary: #B4BEC6;
  --color-text-muted: #87919A;
  --color-border: #3A4046;
  --color-border-strong: #56606A;
  --color-primary: #4FB3BF;
  --color-primary-hover: #74CDD6;
  --color-primary-soft: #17363B;
  --color-accent: #A78BFA;
  --color-accent-soft: #30264A;
  --color-success: #48B882;
  --color-warning: #D6A84F;
  --color-danger: #E06A61;
  --color-info: #7FA8FF;
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
