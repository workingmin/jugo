import { getDefaultProjectView, getProjectById } from './data/projects.js'

const params = new URLSearchParams(window.location.search)
const project = getProjectById(params.get('id'))

const viewLabels = {
  worldview: '世界观',
  'branch-tree': '分支树',
  timeline: '矩阵时序'
}

const defaultView = getDefaultProjectView(project)
let activeView = normalizeView(params.get('view') || defaultView)

const els = {
  editorTabs: document.querySelector('#editorTabs'),
  projectTitleLabel: document.querySelector('#projectTitleLabel'),
  reviewPath: document.querySelector('#reviewPath'),
  workspaceCanvas: document.querySelector('#workspaceCanvas'),
  detailPanel: document.querySelector('#detailPanel'),
  worldviewDrawer: document.querySelector('#worldviewDrawer')
}

function getAllowedViews() {
  return project.type === 'branching'
    ? ['worldview', 'branch-tree']
    : ['worldview', 'timeline']
}

function normalizeView(view) {
  return getAllowedViews().includes(view) ? view : defaultView
}

function setView(view) {
  activeView = normalizeView(view)
  const url = new URL(window.location.href)
  url.searchParams.set('id', project.id)
  url.searchParams.set('view', activeView)
  window.history.replaceState({}, '', url)
  render()
}

function getReviewSteps() {
  if (project.type === 'branching') {
    return ['世界观', '分支树总览', '筛选单分支']
  }
  return ['世界观', '矩阵时序', '全局校验']
}

function renderShell() {
  els.projectTitleLabel.textContent = project.name
  els.editorTabs.innerHTML = getAllowedViews().map((view) => `
    <button class="editor-tab ${view === activeView ? 'is-active' : ''}" type="button" data-view="${view}">
      ${viewLabels[view]}
    </button>
  `).join('')
  els.reviewPath.innerHTML = getReviewSteps().map((step) => `<li>${step}</li>`).join('')
}

function renderTimeline() {
  els.workspaceCanvas.innerHTML = `
    <div class="canvas-toolbar">
      <span>章节刻度</span>
      <strong>第 1 章 - 第 12 章</strong>
      <button class="secondary-button" type="button" data-open-worldview>编辑世界观</button>
    </div>
    <div class="timeline-board">
      ${project.tracks.map((track, index) => `
        <div class="timeline-row">
          <span>${track}</span>
          <article class="timeline-card" style="--card-left: ${12 + index * 14}%; --card-width: ${34 + index * 4}%">
            <strong>${index === 0 ? '核心危机显现' : index === 1 ? '人物关系转折' : '伏笔压力上升'}</strong>
            <p>${track}在当前章节段落中的关键变化，后续正式版可从卡片详情继续细化单场内容。</p>
          </article>
        </div>
      `).join('')}
    </div>
  `

  els.detailPanel.innerHTML = `
    <p class="detail-kicker">矩阵时序</p>
    <h3>从结构进入创作</h3>
    <p>线性项目打开后先看全局时序和并行人物线，比强制进入世界观更接近续写和审稿习惯。</p>
    <button class="primary-button full-width" type="button" data-open-worldview>编辑世界观</button>
  `
}

function renderBranchTree() {
  els.workspaceCanvas.innerHTML = `
    <div class="canvas-toolbar">
      <span>分支结构</span>
      <strong>主线 + 3 条结局线路</strong>
      <button class="secondary-button" type="button" data-open-worldview>编辑世界观</button>
    </div>
    <div class="branch-board">
      <div class="branch-node start">共同开端</div>
      <div class="branch-node choice">关键选择</div>
      <div class="ending-column">
        <div class="branch-node good">好结局</div>
        <div class="branch-node neutral">中立结局</div>
        <div class="branch-node hidden">隐藏结局</div>
      </div>
    </div>
  `

  els.detailPanel.innerHTML = `
    <p class="detail-kicker">分支树</p>
    <h3>先确认顶层结构</h3>
    <p>多分支项目打开后先看分叉、结局和体量均衡，后续正式版再按单分支展开时序细化。</p>
    <button class="primary-button full-width" type="button" data-open-worldview>编辑世界观</button>
  `
}

function renderWorldview() {
  els.workspaceCanvas.innerHTML = `
    <div class="worldview-inline">
      <h2>世界观知识库</h2>
      <p>当前 demo 将完整知识库先简化为快速编辑面板。后续阶段会展开人物、势力、地点、规则和伏笔分类。</p>
      <button class="primary-button" type="button" data-open-worldview>打开世界观编辑</button>
    </div>
  `

  els.detailPanel.innerHTML = `
    <p class="detail-kicker">设定约束</p>
    <h3>作为辅助入口存在</h3>
    <p>世界观是底层约束，但不是所有项目每次打开的默认工作面。</p>
  `
}

function render() {
  renderShell()

  if (activeView === 'timeline') renderTimeline()
  if (activeView === 'branch-tree') renderBranchTree()
  if (activeView === 'worldview') renderWorldview()
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-view]')
    const openWorldview = event.target.closest('[data-open-worldview]')
    const closeWorldview = event.target.closest('[data-close-worldview]')

    if (viewButton) setView(viewButton.dataset.view)
    if (openWorldview) els.worldviewDrawer.classList.remove('is-hidden')
    if (closeWorldview || event.target === els.worldviewDrawer) els.worldviewDrawer.classList.add('is-hidden')
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') els.worldviewDrawer.classList.add('is-hidden')
  })
}

bindEvents()
render()
