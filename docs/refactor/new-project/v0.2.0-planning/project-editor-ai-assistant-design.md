# 项目编辑页 AI 助手设计评审稿

## 背景

当前 `v0.2.0-planning` Web prototype 已在项目编辑页顶部操作区加入 AI 助手按钮，并实现了一个最小可用的会话弹窗与会话服务。但当前实现更接近「中文指令解析器」，只能处理少量固定动作，尚未形成面向小说 / 剧本项目编辑的 AI 工作流。

本设计稿用于重新确认「项目编辑 AI 助手」的产品定位、交互边界、可执行动作、数据契约和 Web demo 展示方式，便于评审当前实现与预期需求之间的差距。

## 当前 demo 现状

当前已实现能力：

| 模块 | 当前状态 |
| --- | --- |
| 入口 | 项目编辑页顶部导航栏右侧 AI 助手按钮 |
| UI | 弹窗式 chat 会话框 |
| 服务 | `jugo-ai-session` Node 服务，Nginx 通过 `/jugo-ai/` 代理 |
| 模型能力 | 有 key 时走 OpenAI-compatible chat completions，无 key 时走规则兜底 |
| 可执行动作 | 修改项目名称 / 世界名称、切换主视图、更新世界观根节点摘要 |
| 执行方式 | 后端返回 actions，前端直接应用到本地状态 |

当前主要问题：

| 问题 | 影响 |
| --- | --- |
| 动作范围过窄 | 无法支持真正的项目编辑，只能演示几个表层字段修改 |
| 缺少编辑前预览 | AI 返回动作后直接应用，用户没有确认、撤销和差异检查环节 |
| 缺少上下文检索 | 没有读取完整世界观、时序、分支树、百科仓库、校验结果等项目上下文 |
| 缺少 agent 任务态 | 没有「理解目标 -> 生成计划 -> 执行步骤 -> 汇报结果」的过程表达 |
| 缺少协作约束 | 没有多人编辑下的版本号、冲突检测、权限和审计记录 |
| 缺少领域动作模型 | 没有为小说 / 剧本编辑定义稳定的 action schema |
| 缺少失败处理 | 模型误判、动作不可执行、上下文过期时缺少明确降级路径 |

因此，当前 demo 可以保留作为技术验证，但不宜作为最终产品交互方案。

## 产品定位

项目编辑 AI 助手不应被设计成单纯聊天机器人，也不应被设计成完全自动改稿工具。更合适的定位是：

> 面向小说 / 剧本项目编辑页的「对话式编辑代理」，通过 chat 理解用户目标，通过 agent 工作流生成可审阅的编辑计划和变更草案，在用户确认后对项目内容执行受控修改。

核心原则：

1. Chat 负责表达意图、补充信息、解释建议。
2. Agent 负责读取上下文、拆解任务、生成动作、执行修改和汇报结果。
3. 所有会改变项目数据的动作默认先进入预览，不直接静默写入。
4. AI 只能调用系统声明过的项目编辑工具，不能编造不存在的操作。
5. 多人协作场景下，AI 修改必须遵守版本号、权限和冲突检查。

## 目标用户场景

| 场景 | 用户意图 | AI 助手应提供的能力 |
| --- | --- | --- |
| 快速定位 | “帮我打开世界观里人物系统” | 识别目标页面 / 节点并导航 |
| 设定补全 | “根据这个世界观补全三条宗教设定” | 基于上下文生成候选内容，写入前预览 |
| 结构整理 | “把这些地点归到地理系统下面” | 批量调整节点归属和百科分类 |
| 冲突检查 | “检查主角能力是否和世界规则冲突” | 读取相关节点，生成问题列表和定位入口 |
| 时序辅助 | “把第一幕之前的关键事件整理成时间线” | 从世界观 / 百科中生成矩阵时序草案 |
| 分支辅助 | “给这个选择扩展两个结局方向” | 在分支树生成候选分支与结局草案 |
| 统一改名 | “把北境联邦统一改成寒境议会” | 跨世界观、百科、时序、分支树做引用替换 |
| 团队协作 | “总结我今天改动了哪些设定” | 基于当前用户维度的操作历史生成摘要 |

## 首期 Web Demo 范围

v0.2.0-planning 的 Web demo 目标是评审产品流程，不追求完整 AI 编辑能力。建议将首期范围控制在可以被直观看到的闭环：

| 优先级 | 能力 | Demo 表达 |
| --- | --- | --- |
| P0 | AI 会话弹窗 / 抽屉 | 用户能打开、输入指令、看到 AI 回复 |
| P0 | 上下文感知 | AI 回复中能识别当前项目、项目类型、当前视图、选中节点 |
| P0 | 动作预览 | AI 给出待执行变更列表，用户点击确认后应用 |
| P0 | 世界观节点编辑 | 新增 / 修改 / 移动 / 折叠世界观节点 |
| P0 | 百科条目同步 | AI 可修改百科字段，并提示会同步到导图节点 |
| P1 | 矩阵时序草案 | 线性项目中可生成事件卡片草案 |
| P1 | 分支树草案 | 多分支项目中可生成选择节点 / 结局节点草案 |
| P1 | 校验建议 | 对设定缺字段、重复命名、明显冲突给出检查结果 |
| P2 | 跨模块批量修改 | 统一改名、批量归类、批量生成摘要 |

首期不做：

- 不做长篇正文创作和章节正文改写。
- 不做跨项目模板复用。
- 不做多人实时协同编辑的完整后端锁机制。
- 不做自动发布、自动提交、自动覆盖团队成员内容。
- 不做无限制文件系统 agent。

## 页面交互设计

项目编辑页保持当前顶部导航栏。AI 助手入口放在右侧按钮组中，点击后打开会话弹窗。为避免遮挡画布，正式交互更推荐右侧抽屉；Web demo 可先使用弹窗，但弹窗内必须加入「任务状态」和「变更预览」区域。

Markdown Preview 原型如下：

<div style="border:1px solid #d0d7de; border-radius:12px; padding:14px; background:#f6f8fa; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
<div style="border:1px solid #999; border-radius:8px; background:#fff; overflow:hidden;">
<div style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:12px; padding:10px 14px; border-bottom:1px solid #d0d7de;">
<div style="display:flex; align-items:center; gap:10px;">
<button type="button" style="width:30px; height:30px; border:1px solid #d0d7de; border-radius:6px; background:#fff;">&lt;</button>
<strong>极夜航线</strong>
</div>
<div style="display:flex; gap:8px;">
<button type="button" style="padding:6px 12px; border:1px solid #8f3f5f; border-radius:6px; background:#f4e6ec; color:#8f3f5f; font-weight:700;">世界观</button>
<button type="button" style="padding:6px 12px; border:1px solid #d0d7de; border-radius:6px; background:#fff;">矩阵时序</button>
</div>
<div style="display:flex; justify-content:flex-end; align-items:center; gap:8px;">
<button type="button" title="项目设置" style="width:32px; height:32px; border:1px solid #d0d7de; border-radius:6px; background:#fff;">⚙</button>
<button type="button" title="AI 助手" style="width:32px; height:32px; border:1px solid #8f3f5f; border-radius:6px; background:#8f3f5f; color:#fff;">AI</button>
<button type="button" style="height:32px; padding:0 14px; border:1px solid #8f3f5f; border-radius:6px; background:#8f3f5f; color:#fff; font-weight:700;">保存</button>
</div>
</div>
<div style="display:grid; grid-template-columns:220px 1fr 380px; min-height:420px;">
<aside style="border-right:1px solid #d0d7de; padding:14px; background:#fff;">
<strong>世界观导航</strong>
<div style="display:grid; gap:8px; margin-top:12px;">
<button type="button" style="text-align:left; padding:8px 10px; border:1px solid #8f3f5f; border-radius:6px; background:#f4e6ec;">思维导图</button>
<button type="button" style="text-align:left; padding:8px 10px; border:1px solid #d0d7de; border-radius:6px; background:#fff;">百科仓库</button>
</div>
</aside>
<main style="padding:14px; background:#fbfcfd;">
<div style="height:100%; min-height:360px; border:1px dashed #8c959f; border-radius:8px; display:grid; place-items:center; color:#57606a;">项目编辑主画布</div>
</main>
<aside style="border-left:1px solid #d0d7de; background:#fff; display:grid; grid-template-rows:auto 1fr auto;">
<header style="padding:14px; border-bottom:1px solid #d0d7de;">
<div style="font-size:12px; color:#8f3f5f; font-weight:800;">AI 助手</div>
<strong>项目编辑会话</strong>
<div style="margin-top:6px; font-size:12px; color:#57606a;">当前上下文：世界观 / 思维导图 / 选中节点「极夜星域」</div>
</header>
<div style="display:grid; gap:10px; align-content:start; padding:14px; overflow:auto;">
<div style="border:1px solid #d0d7de; border-radius:8px; padding:10px; background:#f6f8fa;">
<strong style="font-size:13px;">你</strong>
<p style="margin:6px 0 0;">帮我把极夜星域补全三条基础世界规则。</p>
</div>
<div style="border:1px solid #e8c4d0; border-radius:8px; padding:10px; background:#fff7fa;">
<strong style="font-size:13px;">AI 助手</strong>
<p style="margin:6px 0;">我会基于当前世界观根节点生成 3 条规则草案，并准备新增为子节点。</p>
<ol style="margin:8px 0 0 18px; color:#57606a;">
<li>读取当前世界观根节点摘要。</li>
<li>生成规则节点候选。</li>
<li>等待你确认后写入思维导图。</li>
</ol>
</div>
<section style="border:1px solid #8f3f5f; border-radius:8px; padding:10px; background:#fff;">
<strong>待确认变更</strong>
<ul style="margin:8px 0 0 18px;">
<li>新增节点：永夜周期</li>
<li>新增节点：航线禁区</li>
<li>新增节点：星灯能源</li>
</ul>
<div style="display:flex; gap:8px; justify-content:flex-end; margin-top:10px;">
<button type="button" style="height:30px; padding:0 10px; border:1px solid #d0d7de; border-radius:6px; background:#fff;">取消</button>
<button type="button" style="height:30px; padding:0 10px; border:1px solid #8f3f5f; border-radius:6px; background:#8f3f5f; color:#fff;">确认应用</button>
</div>
</section>
</div>
<form style="display:grid; gap:8px; padding:12px; border-top:1px solid #d0d7de;">
<textarea rows="3" placeholder="输入项目编辑指令..." style="resize:none; padding:10px; border:1px solid #d0d7de; border-radius:6px;"></textarea>
<button type="button" style="height:34px; border:1px solid #8f3f5f; border-radius:6px; background:#8f3f5f; color:#fff; font-weight:700;">发送</button>
</form>
</aside>
</div>
</div>
</div>

## 会话流程

AI 助手的标准任务流程建议如下：

<ol style="display:grid; gap:8px; margin:10px 0 0 20px;">
<li><strong>接收指令</strong>：用户在会话框输入自然语言。</li>
<li><strong>识别意图</strong>：判断是问答、导航、生成草案、修改内容、检查冲突还是批量操作。</li>
<li><strong>读取上下文</strong>：按当前页面、选中节点、项目类型和用户权限加载必要上下文。</li>
<li><strong>生成计划</strong>：将复杂指令拆成可执行步骤，并向用户解释将要修改哪些对象。</li>
<li><strong>生成变更</strong>：输出结构化 actions 和 diff preview。</li>
<li><strong>用户确认</strong>：用户确认后才应用会改变项目内容的 actions。</li>
<li><strong>执行写入</strong>：前端或后端按 action schema 更新项目草稿。</li>
<li><strong>保存与同步</strong>：触发项目保存、世界观同步百科、校验状态更新。</li>
<li><strong>汇报结果</strong>：说明已完成的修改、未完成的项和需要用户补充的信息。</li>
</ol>

## AI 助手模式

建议把 AI 助手的行为分成四类，避免所有请求都被当作“立即修改”。

| 模式 | 写入项目数据 | 典型指令 | 交互要求 |
| --- | --- | --- | --- |
| 问答模式 | 否 | “这个节点是什么意思？” | 只回答，不生成 actions |
| 导航模式 | 否 / 轻量状态 | “打开分支树” | 可直接切换视图，但应可撤回 |
| 草案模式 | 否 | “给我三个设定方案” | 生成候选，不写入 |
| 编辑模式 | 是 | “把这些方案加入世界观” | 必须显示变更预览并等待确认 |
| 校验模式 | 否 / 可生成任务 | “检查设定冲突” | 输出问题列表和定位入口 |

## 上下文设计

AI 助手不应一次性拿到整个项目所有数据。上下文应按任务动态加载，避免成本、隐私和误改风险。

### 基础上下文

每次会话请求都应包含：

```json
{
  "sessionId": "ai-session-xxx",
  "userId": "user-xxx",
  "project": {
    "id": "linear-aurora",
    "name": "极夜航线",
    "worldName": "极夜星域",
    "type": "linear",
    "version": 12
  },
  "ui": {
    "activeView": "worldview",
    "activeSection": "mindmap",
    "selectedNodeId": "root"
  },
  "capabilities": [
    "worldview.node.create",
    "worldview.node.update",
    "worldview.node.move",
    "knowledge.entry.update",
    "timeline.event.create"
  ]
}
```

### 按需上下文

| 上下文 | 何时读取 |
| --- | --- |
| 当前选中节点详情 | 用户提到“这个节点”“当前设定” |
| 当前节点邻居关系 | 用户要求整理、移动、补全子节点 |
| 百科条目字段 | 用户要求补充档案、规则、地理、人物信息 |
| 矩阵时序事件 | 用户要求整理剧情时间线 |
| 分支树节点 | 用户要求扩展选择、分支和结局 |
| 校验报告 | 用户要求检查冲突、遗漏或重复 |
| 最近编辑记录 | 用户要求总结改动或回滚变更 |

## Action Schema 草案

AI 只能返回声明过的动作。动作需要区分「可直接执行」和「必须确认后执行」。

### 通用返回结构

```json
{
  "reply": "我会新增 3 个世界规则节点，请确认后应用。",
  "mode": "edit",
  "requiresConfirmation": true,
  "plan": [
    "读取当前世界观根节点",
    "生成三个规则节点",
    "写入思维导图并标记待同步百科"
  ],
  "actions": [],
  "preview": []
}
```

### 建议首期动作

| Action | 用途 | 是否需要确认 |
| --- | --- | --- |
| `navigate.view` | 切换世界观 / 矩阵时序 / 分支树 | 否 |
| `navigate.worldview_section` | 切换思维导图 / 百科仓库 | 否 |
| `project.info.update` | 修改项目名称、世界名称 | 是 |
| `worldview.node.create` | 新增世界观节点 | 是 |
| `worldview.node.update` | 修改节点标题、摘要、类型、便签 | 是 |
| `worldview.node.move` | 调整父节点 / 分类 | 是 |
| `worldview.node.archive` | 归档用户自增节点 | 是 |
| `knowledge.entry.update` | 修改百科条目字段 | 是 |
| `timeline.event.create` | 创建矩阵时序事件草案 | 是 |
| `branch.node.create` | 创建分支树选择 / 结局节点草案 | 是 |
| `validation.issue.create` | 生成校验建议 | 否 |

### 示例：新增世界观节点

```json
{
  "type": "worldview.node.create",
  "target": {
    "parentNodeId": "root"
  },
  "payload": {
    "nodeType": "world_rule",
    "title": "永夜周期",
    "summary": "极夜星域每 183 天进入一次完整永夜期，航线必须依赖星灯能源维持导航。"
  },
  "preview": {
    "label": "新增世界规则节点",
    "before": null,
    "after": "永夜周期"
  }
}
```

### 示例：百科字段反向同步导图

```json
{
  "type": "knowledge.entry.update",
  "target": {
    "entryId": "entry-world-rule-night-cycle",
    "sourceNodeId": "node-night-cycle"
  },
  "payload": {
    "fields": {
      "definition": "永夜周期是极夜星域的基础天文规则。",
      "constraints": "永夜期普通航线关闭，军方航线需要星灯许可。"
    },
    "syncBackToMindmap": true
  },
  "preview": {
    "label": "更新百科条目，并同步节点摘要",
    "before": "永夜周期",
    "after": "永夜周期：补充定义与约束"
  }
}
```

## 确认与撤销

所有写入类动作需要进入「待确认变更」列表。列表至少展示：

| 字段 | 说明 |
| --- | --- |
| 变更对象 | 项目、世界观节点、百科条目、时间线事件、分支节点 |
| 变更类型 | 新增、修改、移动、归档、生成建议 |
| 修改前 | 原标题、原摘要、原父节点、原字段 |
| 修改后 | 新标题、新摘要、新父节点、新字段 |
| 风险提示 | 是否影响百科同步、是否可能覆盖他人修改 |

确认后写入项目草稿，并生成一条 AI 操作记录。用户应能在本次会话内撤销最近一次 AI 应用的变更。

## 多人协作与版本

项目是多人团队共同创作，AI 助手不能只按本地状态静默更新。正式版需要加入：

| 机制 | 目的 |
| --- | --- |
| `baseVersion` | AI 生成动作时绑定项目版本 |
| `targetVersion` | 应用动作后生成新版本 |
| 乐观锁 | 应用前确认目标对象未被他人修改 |
| 冲突提示 | 若对象已变化，要求用户重新生成或手动合并 |
| 用户维度会话 | AI 历史、上次上下文和操作记录归属于当前用户 |
| 审计日志 | 记录 AI 生成、用户确认、实际写入的完整过程 |

## 服务架构建议

首期 demo 可继续使用当前 Node 会话服务，但应从“直接返回 actions”升级为“会话状态 + 工具调用 + 变更预览”。

```text
Project Editor UI
  ├─ Chat Panel
  ├─ Context Collector
  ├─ Change Preview
  └─ Action Executor
       │
       ▼
AI Session Service
  ├─ Intent Router
  ├─ Context Planner
  ├─ Model Adapter
  ├─ Tool Registry
  ├─ Action Validator
  └─ Audit Logger
       │
       ▼
Project Domain APIs
  ├─ Project Info
  ├─ Worldview Mindmap
  ├─ Knowledge Base
  ├─ Matrix Timeline
  ├─ Branch Tree
  └─ Validation Report
```

Demo 阶段可以先把 `Project Domain APIs` 模拟为前端 localStorage 和内存状态；但 action schema 应尽量接近正式后端契约。

## 与项目编辑模块的关系

### 世界观

AI 助手应优先支持世界观，因为世界观是项目设定和后续 AI 上下文的源头。

首期动作：

- 新增思维导图节点。
- 修改节点标题、摘要、类型。
- 把用户自增节点归档。
- 把百科条目字段反向同步到导图节点。
- 生成缺字段 / 冲突 / 重复命名建议。

### 百科仓库

AI 不应只生成自由文本百科，而应写入结构化字段。

首期动作：

- 补全定义、别名、约束、关联对象、出场位置。
- 标记来源节点。
- 标记人工编辑字段，避免下次导图同步覆盖。

### 矩阵时序

线性单结局项目中，AI 可从世界观和百科生成事件卡片草案。

首期动作：

- 新增事件草案。
- 归类到主线 / 人物线 / 反派线。
- 根据世界观规则提示事件冲突。

### 分支树

多分支多结局项目中，AI 可生成选择节点和结局方向草案。

首期动作：

- 新增选择节点草案。
- 新增结局节点草案。
- 检查分支是否缺少收束或条件说明。

## 权限与安全边界

AI 助手必须遵守以下边界：

| 边界 | 规则 |
| --- | --- |
| 删除 | 固定业务节点不能删除，只能清空内容；用户自增节点可归档 |
| 覆盖 | 不直接覆盖人工编辑字段，除非用户明确确认 |
| 跨模块修改 | 必须展示影响范围 |
| 批量操作 | 必须分组预览，不允许一句话静默改全项目 |
| 权限 | 用户无权限的模块不出现在 capabilities 中 |
| 模型输出 | 所有 actions 必须经 schema 校验 |
| 密钥 | AI key 只存在服务端环境变量，不进入前端和仓库 |

## 当前实现与目标差距

| 设计目标 | 当前实现 | 差距 |
| --- | --- | --- |
| 会话 + agent 工作流 | 只有简单 chat 和直接 actions | 缺任务计划、工具调用、执行状态 |
| 写入前预览 | 无 | 高优先级缺口 |
| 世界观节点操作 | 只支持根节点摘要 | 缺新增、移动、归档、类型字段 |
| 百科条目操作 | 无 | 缺结构化字段和同步规则 |
| 矩阵时序 / 分支树 | 只能切换视图 | 缺草案生成和节点编辑动作 |
| 上下文读取 | 只传项目基础信息和世界观根节点 | 缺选中节点、邻居、百科、时序、分支、校验报告 |
| 多人协作 | 无 | 缺版本号、冲突检测、审计 |
| 模型约束 | 只有 prompt 限制 | 缺 action schema validator 和工具白名单 |
| 失败处理 | 只显示服务不可用 | 缺动作不可执行、上下文过期、权限不足提示 |

## Web Demo 调整建议

下一轮 demo 建议按以下顺序修改：

1. 把 AI 弹窗从「聊天记录 + 输入框」升级为「聊天记录 + 任务计划 + 待确认变更」。
2. 后端返回 `mode`、`plan`、`requiresConfirmation`、`actions`、`preview`。
3. 前端收到写入类 action 时先进入预览区，不立即应用。
4. 增加 `worldview.node.create`、`worldview.node.update` 两个首批领域动作。
5. 让 AI 能读取当前选中世界观节点，而不是只读取 root。
6. 应用动作后更新思维导图，并把节点标记为 `pending`，等待项目保存时同步百科。
7. 保留 fallback-agent，但让 fallback-agent 也返回同样的结构，方便无真实 key 时演示。

## 待评审问题

需要进一步确认：

1. AI 助手的首期重点是「世界观编辑」还是「跨世界观 / 时序 / 分支树的项目级编辑」？
2. 写入类动作是否一律要求用户确认，还是允许部分低风险动作直接执行？
3. AI 会话 UI 应保持弹窗，还是改为右侧抽屉以便边看画布边操作？
4. 世界观节点新增、百科条目补全、时序事件生成、分支节点生成，哪个应作为第一条完整闭环？
5. 是否需要在 v0.2 demo 中展示多人协作冲突，还是只在文档中保留正式版设计？
6. AI 生成内容进入项目后，是否需要标记 `ai_generated`、`human_edited`、`review_required` 等状态？
7. 项目保存按钮是否应统一保存 AI 应用结果，还是 AI 确认后立即写入草稿并等待保存？

