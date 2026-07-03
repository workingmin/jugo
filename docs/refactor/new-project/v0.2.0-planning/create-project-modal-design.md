# 新建项目弹窗页面设计

## 目标

`新建项目` 弹窗用于在项目管理首页完成作品初始化。它不是完整项目配置页，而是一个低阻力的创建入口，只收集会直接影响后续编辑工作区结构的必要信息。

本阶段确认弹窗包含三部分功能：

1. 输入项目名称。
2. 输入世界名称。
3. 选择创作模板。

## 设计原则

1. 项目和世界分离：项目是团队协作、版本管理、评审流程的管理容器；世界是小说 / 剧本内部的设定宇宙，会进入世界观根节点和百科仓库。
2. 模板选择前置：线性单结局和多分支多结局会决定项目编辑页可用主视图、默认落点和初始画布结构，必须在创建时明确。
3. 弹窗只做创建决策：不在此阶段加入封面、题材标签、团队成员、权限、AI 初始化向导等配置，避免分散核心流程。
4. 创建结果可预期：用户点击创建后，系统应直接进入对应模板的默认编辑落点。

## 页面结构

```html
<dialog class="create-project-modal" aria-labelledby="createProjectTitle">
  <header class="modal-header">
    <div>
      <p class="modal-kicker">新建项目</p>
      <h2 id="createProjectTitle">创建小说 / 互动剧本项目</h2>
    </div>
    <button aria-label="关闭新建项目弹窗">×</button>
  </header>

  <form class="create-project-form">
    <section aria-labelledby="projectNameLabel">
      <label id="projectNameLabel" for="projectName">项目名称</label>
      <input id="projectName" name="projectName" placeholder="例如：极夜航线" />
      <p class="field-help">用于项目管理、团队协作和顶部项目标题。</p>
    </section>

    <section aria-labelledby="worldNameLabel">
      <label id="worldNameLabel" for="worldName">世界名称</label>
      <input id="worldName" name="worldName" placeholder="例如：极夜星域" />
      <p class="field-help">用于世界观根节点、百科仓库和设定资料归档。</p>
    </section>

    <section aria-labelledby="templateLabel">
      <h3 id="templateLabel">选择创作模板</h3>
      <div class="template-options" role="radiogroup" aria-labelledby="templateLabel">
        <button type="button" role="radio" aria-checked="false">
          <strong>线性单结局</strong>
          <span>世界观 + 矩阵时序</span>
        </button>
        <button type="button" role="radio" aria-checked="false">
          <strong>多分支多结局</strong>
          <span>世界观 + 分支树</span>
        </button>
      </div>
    </section>

    <footer class="modal-actions">
      <button type="button">取消</button>
      <button type="submit">创建项目</button>
    </footer>
  </form>
</dialog>
```

## 字段定义

| 字段 | 必填 | 建议限制 | 用途 |
| --- | --- | --- | --- |
| `projectName` | 是 | 1-40 个字符 | 项目管理首页卡片标题、项目编辑页顶部标题、团队协作对象名称 |
| `worldName` | 是 | 1-40 个字符 | 世界观根节点标题、百科仓库根条目、后续 AI 上下文的世界名称 |
| `templateType` | 是 | `linear` / `branching` | 决定默认落点、项目编辑页主导航、初始画布与 mock 数据结构 |

## 模板选项

### 线性单结局

适用对象：

- 网文、影视剧本、短剧、单线小说。
- 以章节 / 幕 / 场的顺序推进为核心。

创建后初始化：

- 项目编辑页主导航仅展示 `世界观`、`矩阵时序`。
- 默认落点进入 `矩阵时序`。
- 世界观根节点使用 `worldName`。
- 矩阵时序初始化主线、人物线、反派线等轨道。

### 多分支多结局

适用对象：

- 互动小说、游戏剧情、多结局剧本。
- 以选择、分叉、收束和结局管理为核心。

创建后初始化：

- 项目编辑页主导航仅展示 `世界观`、`分支树`。
- 默认落点进入 `分支树`。
- 世界观根节点使用 `worldName`。
- 分支树初始化共同开端、关键选择、多个结局节点。

## 交互流程

1. 用户在项目管理首页点击 `新建项目`。
2. 弹窗打开，默认聚焦 `项目名称` 输入框。
3. 用户输入项目名称。
4. 用户输入世界名称。
5. 用户选择一个创作模板。
6. 当三个必填项都有效时，`创建项目` 按钮可点击。
7. 点击 `创建项目` 后，系统创建本地 demo 项目，并按模板默认落点跳转：
   - `linear`：进入 `project.html?id={projectId}&view=timeline`。
   - `branching`：进入 `project.html?id={projectId}&view=branch-tree`。

## 校验与错误状态

| 场景 | 页面反馈 |
| --- | --- |
| 项目名称为空 | 输入框下方显示 `请输入项目名称` |
| 世界名称为空 | 输入框下方显示 `请输入世界名称` |
| 未选择创作模板 | 模板区显示 `请选择创作模板` |
| 名称超过长度 | 显示 `最多输入 40 个字符` |
| 项目名称与本地已有项目重复 | Web demo 阶段可提示 `当前项目名称已存在，可继续创建演示项目`，正式版再做团队空间内唯一性策略 |

模板不建议默认选中。原因是模板会影响后续工作区结构，误选成本较高，应要求用户显式确认。

## 视觉布局建议

1. 弹窗宽度建议为 `720px - 860px`，PC 端居中展示。
2. 项目名称和世界名称采用上下排列，便于用户理解两者不是同一概念。
3. 模板卡片采用两列并排，卡片内显示模板名称、适用创作类型、创建后主视图。
4. 主按钮为 `创建项目`，位于右下角；次按钮 `取消` 位于其左侧。
5. 不在弹窗内放大段说明文字，必要解释用输入框下方短帮助文本承载。
6. 移动端或窄屏下模板卡片改为单列，弹窗变为底部全宽面板或近全屏面板。

## 与现有页面的关系

项目管理首页：

- 空白态中央 `新建项目` 按钮触发该弹窗。
- 后续有项目列表后，右上角或侧栏操作区的 `新建项目` 也复用同一弹窗。

项目编辑页：

- 顶部标题显示 `projectName`。
- 世界观根节点显示 `worldName`。
- 模板决定顶部主内容区按钮：
  - `linear`：`世界观`、`矩阵时序`。
  - `branching`：`世界观`、`分支树`。

世界观页面：

- 根节点标题从项目名称调整为世界名称。
- 百科仓库根条目同步使用世界名称。

## Demo 数据建议

创建成功后可生成如下本地数据：

```json
{
  "id": "local-{timestamp}",
  "projectName": "极夜航线",
  "worldName": "极夜星域",
  "templateType": "linear",
  "createdAt": "2026-07-03T00:00:00.000Z",
  "updatedAt": "2026-07-03T00:00:00.000Z"
}
```

Web demo 阶段可以继续使用 `localStorage` 保存创建结果：

- `jugo-projects`：项目列表。
- `jugo-project-draft-{projectId}`：项目编辑草稿。

## 首批不做

1. 不做题材、字数、目标平台等扩展配置。
2. 不做团队成员邀请和权限设置。
3. 不做封面图上传。
4. 不做跨项目模板库选择。
5. 不做 AI 自动生成世界观向导。
6. 不做真实后端保存和多人协作锁定。

这些能力可以在项目创建后的设置页或正式版需求阶段再拆分。

## Web Demo 修改验收点

确认该设计后，Web demo 修改应满足：

1. 点击项目管理首页 `新建项目` 打开新弹窗。
2. 弹窗包含项目名称、世界名称、创作模板三块内容。
3. 未完成必填项时不能创建。
4. 创建线性项目后进入矩阵时序页面。
5. 创建多分支项目后进入分支树页面。
6. 项目编辑页顶部标题显示项目名称。
7. 世界观根节点和百科根条目显示世界名称。
8. 现有日间 / 夜间主题下弹窗样式都可读、可操作。
