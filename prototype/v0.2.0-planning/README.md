# JUGO v0.2.0-planning Web 原型

本目录是 `v0.2.0-planning` 需求评审阶段的 Web 原型 demo 工作区。它不继承旧 `web-prototype/` 的页面结构和产品逻辑，后续 demo 应围绕新版本的评审链路展开。

## 原型目标

- 用可交互页面演示新版本核心产品方向。
- 支撑需求评审，而不是提前绑定最终技术架构。
- 清晰区分线性项目和多分支项目两条创作 / 评审流程。

## 页面 demo 范围

| 页面 | 用途 | 来源草稿 |
| --- | --- | --- |
| 项目管理首页 | 项目列表、空白引导、新建项目模板选择 | `project-dashboard-design.md` |
| 世界观知识库 | 人物、势力、地点、规则、伏笔的结构化设定库 | `worldview-knowledge-base-design.md` |
| 分支树视图 | 多分支、多结局项目的顶层结构和任务分配 | `branch-tree-multi-ending-view-design.md` |
| 矩阵时序视图 | 横向时间轴、纵向轨道、剧情卡片和分支过滤 | `matrix-timeline-view-design.md` |
| 节拍板视图 | 从时序下钻到单场剧情细化和批注 | `beat-board-view-design.md` |
| 全局校验报告 | 人设冲突、伏笔未回收、时序断层、分支失衡提示 | 从各页面校验能力汇总 |

## 评审演示链路

### 线性单结局项目

```text
项目首页 -> 新建线性项目 -> 世界观 -> 矩阵时序 -> 节拍板 -> 全局校验报告
```

### 多分支多结局项目

```text
项目首页 -> 新建多分支项目 -> 世界观 -> 分支树 -> 筛选单分支 -> 矩阵时序 -> 节拍板 -> 全局校验报告
```

## 实施约束

- 原型优先展示页面结构、关键交互和评审流程，不接真实后端。
- 使用 mock 数据表达世界观、分支、时序和节拍之间的联动。
- 使用日间专业浅色模式和夜间创作深色模式两套全局主题。
- 不复用旧 `web-prototype/` 的小说 / 剧本编辑器页面作为新版本入口。
- 如后续需要工程化实现，应在本目录内独立初始化，不覆盖旧原型。

主题设计文档：[../../docs/refactor/new-project/v0.2.0-planning/web-prototype-theme-design.md](../../docs/refactor/new-project/v0.2.0-planning/web-prototype-theme-design.md)

主题 token 初稿：[src/styles/theme.css](src/styles/theme.css)

## 当前可运行页面

项目管理首页已实现为静态页面：

```text
index.html
```

当前能力：

- 日间专业浅色模式 / 夜间创作深色模式切换。
- 项目管理首页使用左侧固定导航侧边栏 + 右侧自适应主内容面板。
- 左侧侧边栏保留产品 logo、主题切换、项目和帮助中心入口。
- 首页默认清空旧 demo 本地状态，并展示空白态项目管理工作台。
- 新建项目模板选择弹窗。
- 打开线性单结局项目时，默认进入矩阵时序页面，顶部仅保留「世界观」「矩阵时序」切换。
- 打开多分支多结局项目时，默认进入分支树页面，顶部仅保留「世界观」「分支树」切换。
- 项目编辑页左上角使用「<」返回项目管理页面，并在其后显示项目标题。
- 项目编辑页右上角提供「保存」按钮，当前 demo 使用 localStorage 模拟保存世界观草稿。
- 当前可运行 demo 不提供节拍板作为项目编辑页主内容区入口，单场细化保留为后续正式版下钻能力。

本阶段不接真实后端，按钮操作使用前端模拟反馈。

本地语法检查：

```bash
npm run check
```

## 当前部署

开发环境访问地址：

```text
https://devh.lingxi.fyi/
```

静态部署目录：

```text
/data/web/jugo/v0.2.0-planning/
```

Nginx vhost：

```text
/usr/local/nginx/conf/vhost/devh.lingxi.fyi.conf
```

本次仅将站点根路径切到 JUGO v0.2 原型，保留了现有 `/api/`、`/openim/`、`/storage/` 和旧 demo 子路径代理 / alias。切换前备份文件：

```text
/usr/local/nginx/conf/vhost/devh.lingxi.fyi.conf.bak-jugo-v020-20260701
```
