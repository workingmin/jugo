# 世界观编辑页：思维导图 + 百科仓库方案评估

## 背景

当前 `v0.2.0-planning` Web prototype 的项目编辑页已经将「世界观」作为项目内主内容区之一。现有 demo 的世界观编辑仍偏向简单表单 / 抽屉，不足以表达专业小说、剧本创作者从零搭建世界观的真实工作流。

本方案评估将项目编辑页内的世界观编辑区域调整为：

- 左侧导航栏 + 右侧内容区。
- 左侧一级入口为「思维导图」和「百科仓库」。
- 「思维导图」作为世界观 0-1 搭建主画布。
- 点击项目顶栏「保存」时，将思维导图内容同步生成结构化百科知识库，作为资料归档、审核校验和 AI 上下文仓库。

## 结论

该设计方向可行，并且更符合专业创作者的前期世界观搭建习惯。建议进入 v0.2 Web prototype demo 的下一轮页面设计，但需要明确主次关系：

| 模块 | 产品定位 | 数据定位 |
| --- | --- | --- |
| 思维导图 | 0-1 世界观搭建、发散构思、关系梳理主画布 | 创作源数据 |
| 百科仓库 | 人物、势力、地点、规则、伏笔等结构化归档 | 派生 + 可人工补充的知识库 |
| 审核校验仓库 | 人设冲突、规则冲突、伏笔遗漏、AI 上下文约束 | 基于百科仓库生成的校验索引 |

不建议把思维导图和百科仓库做成两个完全独立的数据源。否则用户在思维导图改动后，百科条目可能不同步；用户在百科条目精修后，反向映射到思维导图也会变复杂。更稳妥的 MVP 策略是：

1. 思维导图节点保存稳定 `node_id`。
2. 保存时由思维导图节点生成或更新百科条目。
3. 百科条目保留 `source_node_id`，标记来源节点。
4. 百科中人工补充字段与导图派生字段分开存储，避免下次同步被覆盖。
5. 冲突、缺字段、重复实体等问题进入审核校验仓库。

## 竞品 CreateAUniverse 功能树分析

`competitor-static-html/CreateAUniverse-单世界思维导图功能树页面.html` 是一个导出的 HTML 片段。从页面结构看，它更像 React 组件渲染后的自研功能树，而不是直接基于成熟思维导图库实现：

- 类名形态为 `_mindmapLayout_ax31j_450`、`_groupNode_ax31j_714`、`_moduleHeader_ax31j_937`，符合 CSS Modules 编译后的命名特征。
- 图标使用内联 `lucide` SVG，例如 `lucide-globe`、`lucide-users`、`lucide-map`。
- DOM 结构是中心 root node + 左右 side section + group branch + module branch + connector div。
- 片段中未出现 React Flow、G6、X6、Mind Elixir、jsMind、markmap 的典型容器、脚本引用、canvas 节点或 nodes / edges 数据结构。

因此，竞品这页应理解为「自研的世界构建功能树 / 脑图式导航组件」，不是完整的可自由编辑 mindmap canvas。它的价值主要在信息架构：把世界观拆成更专业的系统级目录。

竞品一级系统：

| 一级系统 | 二级模块 |
| --- | --- |
| 世界观总览 | 世界观设定 |
| 地理系统 | 地理详情、地点管理、FMG地图编辑器 |
| 人物系统 | 人物关系图、人物档案、复杂关系网络、能力技能 |
| 历史系统 | 时间线、关键转折 |
| 文化系统 | 宗教信仰、语言文字、艺术娱乐 |
| 社会结构 | 政治体系、经济系统、外交关系 |
| 创作管理 | 伏笔管理、灵感库 |
| 工具与设置 | 姓名生成 |

其中「工具与设置」更接近编辑器辅助能力和项目配置入口，不属于最终世界观设定集，后续 v0.2 demo 不把它作为固定世界观节点或百科仓库目录。

对比后判断：当前原设计中的「人物、势力、地点、世界规则、伏笔线索、道具 / 历史事件 / 术语」更像 AI 校验和百科数据模型的最小分类，适合 MVP，但作为专业世界观编辑页略显粗糙。后续应把导航层升级为「世界构建系统分类」，同时保留底层实体类型，避免只做表单仓库而缺少创作工作台的完整感。

## 可行性评估

### 产品可行性

可行。小说、剧本和互动叙事的世界观搭建通常不是先从表单开始，而是先从「核心设定 -> 人物 / 势力 / 地点 / 规则 -> 关系和约束」逐步展开。思维导图天然适合 0-1 阶段的发散和归纳。

该方案能解决当前简单世界观表单的几个问题：

- 空白表单对创作者启发不足。
- 世界观条目之间的关系不直观。
- 结构化百科适合归档，但不适合第一步构思。
- AI 校验需要结构化数据，不能只依赖自由文本。

### 交互可行性

可行，但需要把「保存同步」做成可解释状态，而不是黑盒转换。

保存后建议展示三类反馈：

| 状态 | 含义 | UI 表达 |
| --- | --- | --- |
| 已同步 | 导图节点已成功生成 / 更新百科条目 | 保存状态、同步时间 |
| 待补全 | 节点缺少类型、描述、关系等必要字段 | 节点角标、右侧校验提示 |
| 有冲突 | 同名实体、关系矛盾、规则冲突 | 审核校验列表、定位按钮 |

### 技术可行性

可行。关键不是画布本身，而是定义稳定的数据模型和同步规则。

最低可行链路：

<ol style="display:grid; gap:8px; margin:10px 0 0 20px;">
<li>读取思维导图节点。</li>
<li>点击项目顶栏「保存」。</li>
<li>执行节点归一化，补齐稳定 ID、节点类型和父子关系。</li>
<li>按节点类型生成或更新百科条目。</li>
<li>根据父子关系和自定义连线生成关系索引。</li>
<li>生成校验任务和待补全提示。</li>
<li>更新百科仓库与审核校验仓库。</li>
</ol>

需要提前规避的风险：

- 导图节点只有文本标题时，无法可靠判断它是人物、势力、地点还是规则。
- 用户手动调整导图布局后，不应影响知识库语义。
- 用户删除导图节点时，百科条目是删除、归档还是解除来源关系，需要明确。
- 多人协作时，保存同步必须有版本号和冲突处理。

## 页面布局建议

世界观主内容区建议采用局部双栏，不影响项目编辑页顶部导航。页面布局用 HTML 结构表达如下，后续 demo 也应优先以可渲染 HTML / CSS 原型描述布局，不再用 ASCII 框图表达页面结构：

<div style="border:1px solid #d0d7de; border-radius:10px; padding:12px; background:#fafbfc; font-family:system-ui, -apple-system, sans-serif;">
<div style="border:1px solid #999; border-radius:8px; padding:10px 12px; margin-bottom:10px; background:#fff;">
<strong>项目编辑页顶栏</strong><br>
<div style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:12px; margin-top:8px;">
<span>← 项目标题</span>
<span style="padding:4px 10px; border:1px solid #d0d7de; border-radius:6px;">世界观 / 矩阵时序或分支树</span>
<span style="text-align:right;">保存</span>
</div>
</div>
<div style="display:grid; grid-template-columns:220px 1fr; gap:12px;">
<div style="border:1px solid #999; border-radius:8px; padding:12px; background:#fff;">
<strong>左侧导航栏</strong>
<div style="display:grid; gap:8px; margin-top:10px;">
<button type="button" style="text-align:left; padding:8px 10px; border:1px solid #8f3f5f; border-radius:6px; background:#f4e6ec;">思维导图</button>
<button type="button" style="text-align:left; padding:8px 10px; border:1px solid #d0d7de; border-radius:6px; background:#fff;">百科仓库</button>
<div style="margin-left:10px; display:grid; gap:6px; color:#57606a;">
<span>世界观总览</span>
<span>地理系统</span>
<span>人物系统</span>
<span>历史系统</span>
<span>文化系统</span>
<span>社会结构</span>
<span>创作管理</span>
</div>
</div>
</div>
<div style="border:1px solid #999; border-radius:8px; padding:12px; background:#fff;">
<strong>右侧内容区</strong>
<div style="display:grid; grid-template-rows:auto minmax(220px,1fr) auto; gap:10px; margin-top:10px;">
<div style="border:1px solid #d0d7de; border-radius:6px; padding:8px;">工具条：新增节点 / 节点类型 / 折叠展开 / 导入导出 / 定位问题</div>
<div style="border:1px dashed #8c959f; border-radius:8px; padding:16px; min-height:220px;">世界观思维导图画布，或百科条目列表 + 详情编辑区</div>
<div style="border:1px solid #d0d7de; border-radius:6px; padding:8px;">状态栏：节点数量 / 待同步 / 校验问题 / 最近保存时间</div>
</div>
</div>
</div>
</div>

### 左侧导航栏

一级操作按钮：

| 一级入口 | 用途 |
| --- | --- |
| 思维导图 | 打开世界观主画布，用于新增、整理、关联和归类设定节点 |
| 百科仓库 | 打开结构化知识库目录，用于查看和细化由导图同步生成的条目 |

百科仓库二级 / 三级目录建议从简单实体分类升级为系统级目录：

<nav aria-label="百科仓库目录示例" style="border:1px solid #d0d7de; border-radius:10px; padding:14px; background:#fff;">
<strong>百科仓库</strong>
<div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:12px; margin-top:12px;">
<section style="border:1px solid #d0d7de; border-radius:8px; padding:10px;">
<strong>世界观总览</strong>
<ul>
<li>世界观设定</li>
<li>核心概念</li>
<li>基础规则摘要</li>
</ul>
</section>
<section style="border:1px solid #d0d7de; border-radius:8px; padding:10px;">
<strong>地理系统</strong>
<ul>
<li>地理详情</li>
<li>地点管理</li>
<li>地图编辑器 / 地图资源</li>
</ul>
</section>
<section style="border:1px solid #d0d7de; border-radius:8px; padding:10px;">
<strong>人物系统</strong>
<ul>
<li>人物档案</li>
<li>人物关系图</li>
<li>复杂关系网络</li>
<li>能力技能</li>
</ul>
</section>
<section style="border:1px solid #d0d7de; border-radius:8px; padding:10px;">
<strong>历史系统</strong>
<ul>
<li>时间线</li>
<li>关键转折</li>
<li>历史事件</li>
</ul>
</section>
<section style="border:1px solid #d0d7de; border-radius:8px; padding:10px;">
<strong>文化系统</strong>
<ul>
<li>宗教信仰</li>
<li>语言文字</li>
<li>艺术娱乐</li>
<li>风俗禁忌</li>
</ul>
</section>
<section style="border:1px solid #d0d7de; border-radius:8px; padding:10px;">
<strong>社会结构</strong>
<ul>
<li>政治体系</li>
<li>经济系统</li>
<li>外交关系</li>
<li>组织 / 阵营</li>
</ul>
</section>
<section style="border:1px solid #d0d7de; border-radius:8px; padding:10px;">
<strong>创作管理</strong>
<ul>
<li>伏笔管理</li>
<li>灵感库</li>
<li>术语表</li>
</ul>
</section>
</div>
</nav>

底层数据类型仍建议保留 `人物`、`势力`、`地点`、`规则`、`伏笔`、`道具`、`事件` 等稳定实体类型。导航层负责专业创作视角，数据层负责 AI 注入、校验和跨画布联动。姓名生成、模板配置、AI 上下文开关等工具类能力应放在项目设置、工具条或 AI 助手中，不进入世界观固定目录。

### 思维导图内容页

右侧内容区打开「思维导图」时，建议包含：

- 顶部工具条：新增节点、节点类型、折叠 / 展开、导入 Markdown、导出图片、定位未同步节点。
- 主画布：世界观根节点、分类节点、实体节点、关系线。画布区域需要支持纵向滚动，并预留大于首屏高度的内部画布空间。二级固定节点的纵向间距应根据三级模块数量和后续子树规模自适应展开，避免节点持续新增后被固定视口压缩或互相遮盖。
- 节点快捷操作：新增子节点、转换类型、标记 AI 约束、关联已有百科条目。
- 右侧浮动详情面板：当前节点标题、类型、摘要、标签、关联对象、是否同步百科。
- 底部状态栏：节点数量、待同步数量、校验问题数量、最近保存时间。

节点类型建议：

| 节点类型 | 示例 | 同步目标 |
| --- | --- | --- |
| 分类 | 人物、势力、地点、规则 | 不生成条目，只作为目录 |
| 人物 | 主角、反派、导师 | 人物百科条目 |
| 势力 | 王庭、财团、宗门 | 势力百科条目 |
| 地点 | 雾城、空间站、秘境 | 地点百科条目 |
| 规则 | 时间回溯规则、魔法代价 | 世界规则条目 |
| 伏笔 | 失踪的钥匙、旧案真相 | 伏笔线索条目 |
| 事件 | 战争、事故、审判 | 历史事件条目 |

### 百科仓库内容页

右侧内容区打开「百科仓库」时，建议采用列表 + 详情编辑：

- 左侧导航仍保留目录树。
- 右侧上方是当前分类的条目列表。
- 右侧下方或抽屉是条目详情。
- 条目详情区展示「来源导图节点」「同步时间」「人工补充字段」。
- 支持从百科条目跳回思维导图节点。

## 保存同步规则

保存按钮不应只是保存页面草稿，而是触发一个可解释的同步动作。

建议保存流程：

1. 读取当前思维导图完整数据。
2. 校验节点是否有稳定 ID、节点类型和父子关系。
3. 将导图节点归一化为 `WorldMapNode`。
4. 按节点类型生成或更新 `WorldEntry`。
5. 根据父子关系和自定义连线生成 `WorldRelation`。
6. 生成 `ValidationIssue`，例如同名人物、未分类节点、规则冲突、伏笔无回收节点。
7. 保存同步结果，反馈保存时间和问题数量。

MVP 阶段可以只模拟其中 1-4 步；正式产品需要补齐 5-7 步。

## 数据模型草案

| 对象 | 关键字段 | 用途 |
| --- | --- | --- |
| `WorldMapNode` | `id`、`project_id`、`parent_id`、`title`、`node_type`、`summary`、`tags[]`、`position`、`expanded`、`source`、`updated_at` | 保存思维导图节点、层级、布局和节点语义 |
| `WorldEntry` | `id`、`project_id`、`source_node_id`、`category`、`title`、`summary`、`generated_fields`、`manual_fields`、`ai_context_enabled`、`updated_at` | 保存百科仓库条目，区分导图派生字段和人工补充字段 |
| `WorldRelation` | `id`、`project_id`、`source_node_id`、`target_node_id`、`relation_type`、`description` | 保存人物、势力、地点、规则、事件之间的关系 |
| `ValidationIssue` | `id`、`project_id`、`issue_type`、`severity`、`source_node_id`、`target_entry_id`、`message`、`status` | 保存待补全、冲突、规则违背和伏笔回收问题 |

## 开源组件评估

### 推荐结论

如果下一步仍以静态 Web prototype 为主，优先评估 `Mind Elixir`。它是框架无关的 JavaScript 思维导图库，内置编辑、拖拽、撤销重做、导入导出和主题能力，接入当前 demo 成本较低。

如果后续按原计划迁移到 React + Vite 工程，优先评估 `React Flow`。它不是专门的思维导图库，但非常适合做可高度定制的节点编辑器，并且官方有 mind map app 教程，后续与百科仓库、AI 校验、协作状态集成更稳。

### 组件候选

| 工具 | 类型 | 许可 | 适配度 | 优点 | 风险 / 不足 |
| --- | --- | --- | --- | --- | --- |
| React Flow / xyflow | React 节点编辑器 | MIT | 高 | 节点、边、拖拽、缩放、MiniMap、Controls、Panel、保存恢复、白板能力完整；官方有 Mind Map App 教程 | 不是开箱即用的思维导图，需要自定义节点、布局和快捷键 |
| Mind Elixir | 专用思维导图库 | MIT | 高 | 框架无关，内置编辑、拖拽、多选、撤销重做、导出图片、主题、数据导入导出 | 对复杂业务节点和 React 状态管理的深度集成需要封装 |
| AntV G6 | 图可视化引擎 | MIT | 中高 | 适合复杂关系图、树图、知识图谱和后续审核校验可视化；布局、交互、主题、插件能力强 | 做专业编辑器需要较多定制，0-1 demo 成本高于 Mind Elixir / React Flow |
| Markmap | Markdown 转思维导图 | MIT | 中 | 适合从 Markdown 大纲快速生成思维导图，适合作为导入 / 预览工具 | 不适合作为主要可视化编辑器 |
| jsMind | 轻量思维导图库 | BSD | 中 | 纯 JavaScript，简单、成熟、接入成本低 | 交互和扩展能力相对传统，复杂专业编辑体验需要较多补齐 |
| Excalidraw | 白板 / 手绘图编辑器 | MIT | 中低 | 开源、成熟、无限画布、导出、撤销重做、箭头绑定能力好 | 数据语义偏图形对象，不适合作为结构化百科同步的主数据源 |
| tldraw | React 无限画布 SDK | 需单独确认商业许可 | 中低 | 画布基础设施强，协作、持久化、性能、定制能力好 | 更像白板 SDK，不是思维导图；商业使用需做许可证确认 |

### 候选资料来源

以下资料于 2026-07-02 查询：

- React Flow 官方文档：<https://reactflow.dev/>
- React Flow Mind Map App 教程：<https://reactflow.dev/learn/tutorials/mind-map-app-with-react-flow>
- React Flow Save and Restore 示例：<https://reactflow.dev/examples/interaction/save-and-restore>
- Mind Elixir 官方文档：<https://docs.mind-elixir.com/>
- Mind Elixir GitHub：<https://github.com/ssshooter/mind-elixir-core>
- AntV G6 官方站点：<https://g6.antv.antgroup.com/en>
- AntV G6 GitHub：<https://github.com/antvis/G6>
- Markmap 官方站点：<https://markmap.js.org/>
- Markmap GitHub：<https://github.com/markmap/markmap>
- jsMind GitHub：<https://github.com/hizzgdev/jsmind>
- Excalidraw GitHub：<https://github.com/excalidraw/excalidraw>
- tldraw 官方站点：<https://tldraw.dev/>
- tldraw GitHub：<https://github.com/tldraw/tldraw>

## v0.2 Web Prototype 建议实施范围

首轮 demo 不建议实现完整百科编辑器和真实同步算法。建议先验证交互闭环：

1. 世界观页面替换为左侧导航 + 右侧内容区。
2. 左侧展示「思维导图」「百科仓库」两个一级按钮。
3. 思维导图页展示可编辑 / 可展开的导图主画布。
4. 百科仓库展示由导图节点派生的系统级目录和示例条目，至少覆盖世界观总览、地理系统、人物系统、历史系统、文化系统、社会结构和创作管理。
5. 点击项目顶栏「保存」后，模拟同步状态：已生成百科条目、待补全节点、校验问题。
6. 文档中明确：当前 demo 的同步为前端 mock，正式产品需要服务端事务、版本和冲突处理。

## 验收标准

- 世界观内容区呈现左侧导航栏 + 右侧内容区。
- 左侧有「思维导图」「百科仓库」两个一级操作按钮。
- 点击「思维导图」进入世界观主画布。
- 世界观主画布支持上下滚动，连续新增节点后仍能通过纵向滚动查看下方节点。
- 二级固定节点应按子节点数量自适应分配纵向槽位，三级 / 四级节点展开后不能出现明显遮盖重叠。
- 点击「百科仓库」可展开世界观总览、地理系统、人物系统、历史系统、文化系统、社会结构和创作管理等系统级目录。
- 点击项目顶栏「保存」后，能表达从思维导图到百科仓库的同步结果。
- 页面文案能让评审理解：思维导图负责 0-1 搭建，百科仓库负责归档、审核校验和 AI 上下文。

## 已确认策略

- 百科条目被人工编辑后，点击保存允许反向更新对应思维导图节点。反向更新应只覆盖导图节点的标题、摘要、标签、节点类型等可同步字段，不覆盖导图布局、展开状态和用户手动调整的位置。
- 思维导图中的固定业务节点不能删除，只允许清空内容。固定业务节点包括世界观总览、地理系统、人物系统、历史系统、文化系统、社会结构和创作管理等系统级节点。该策略用于减少删除固定目录后带来的百科条目失联、校验路径失效和演示流程断裂问题。
- 「工具与设置」不作为世界观固定业务节点。姓名生成、模板配置、AI 上下文开关等能力属于编辑器工具或项目配置，不进入最终世界观设定集，也不作为生成「世界之书」内容依赖的资料来源。
- 用户自增的思维导图节点允许删除。删除后，关联百科条目不直接物理删除，而是解除 `source_node_id` 来源绑定，并归档为「废弃」状态，保留审计、恢复和误删处理空间。
- 多人协作下，保存同步采用乐观版本处理。保存时校验 `version` / `updated_at`，如果远端版本已变化，提示用户合并、覆盖或重新加载，不采用项目级锁或节点级锁作为 MVP 默认策略。
- 思维导图节点暂不支持跨项目模板复用。v0.2 demo 只验证单项目内的世界观搭建、百科同步和校验闭环，跨项目模板复用留到后续模板体系再设计。
- AI 参与两个环节：一是从导图节点自动补全百科字段，二是基于百科仓库生成校验检查建议。AI 输出应作为待确认建议进入编辑区，不直接静默覆盖用户已确认内容。
