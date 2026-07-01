const projects = [
  {
    id: 'linear-aurora',
    name: '极夜航线',
    type: 'linear',
    typeLabel: '线性单结局',
    owner: '林舟',
    updatedAt: '2026-07-01 18:20',
    stage: '矩阵时序评审',
    tags: ['科幻悬疑', '三幕结构', '伏笔校验'],
    summary: '远航舰队在极夜星域发现失联殖民地，主角必须在救援与封锁之间完成选择。',
    health: '2 个待处理问题',
    tracks: ['主线', '女主线', '反派线']
  },
  {
    id: 'branching-city',
    name: '雾城回声',
    type: 'branching',
    typeLabel: '多分支多结局',
    owner: '周曼',
    updatedAt: '2026-07-01 17:45',
    stage: '分支树评审',
    tags: ['互动小说', '隐藏结局', '任务分配'],
    summary: '玩家在雾城调查旧案，不同阵营信任值将打开三条结局线路和一个隐藏终点。',
    health: '4 个待处理问题',
    tracks: ['主线', '警署线', '财团线']
  },
  {
    id: 'linear-court',
    name: '青铜王庭',
    type: 'linear',
    typeLabel: '线性单结局',
    owner: '陈越',
    updatedAt: '2026-06-30 22:10',
    stage: '世界观补全',
    tags: ['玄幻', '势力关系', '人物弧光'],
    summary: '没落王族在青铜王庭重建秩序，人物动机和阵营关系需要在全局设定中统一约束。',
    health: '1 个待处理问题',
    tracks: ['主线', '王庭线', '宗门线']
  },
  {
    id: 'branching-summer',
    name: '夏日终局',
    type: 'branching',
    typeLabel: '多分支多结局',
    owner: '林舟',
    updatedAt: '2026-06-29 15:05',
    stage: '节拍细化',
    tags: ['恋爱冒险', '多结局', '节拍批注'],
    summary: '四名角色在毕业旅行中走向不同结局，当前重点是校验分支体量和情感线收束。',
    health: '3 个待处理问题',
    tracks: ['主线', '情感线', '隐藏线']
  }
]

const state = {
  view: 'projects',
  search: '',
  type: 'all',
  owner: 'all'
}

const els = {
  html: document.documentElement,
  themeToggle: document.querySelector('#themeToggle'),
  themeIcon: document.querySelector('.theme-icon'),
  themeLabel: document.querySelector('.theme-label'),
  stateOptions: document.querySelectorAll('.state-option'),
  projectsState: document.querySelector('#projectsState'),
  emptyState: document.querySelector('#emptyState'),
  projectGrid: document.querySelector('#projectGrid'),
  projectSearch: document.querySelector('#projectSearch'),
  typeFilter: document.querySelector('#typeFilter'),
  ownerFilter: document.querySelector('#ownerFilter'),
  summaryTotal: document.querySelector('#summaryTotal'),
  summaryLinear: document.querySelector('#summaryLinear'),
  summaryBranching: document.querySelector('#summaryBranching'),
  createModal: document.querySelector('#createModal'),
  toast: document.querySelector('#toast')
}

function setTheme(theme) {
  els.html.dataset.theme = theme
  localStorage.setItem('jugo-theme', theme)
  const isDark = theme === 'dark'
  els.themeIcon.textContent = isDark ? '☾' : '☼'
  els.themeLabel.textContent = isDark ? '夜间' : '日间'
}

function getCurrentTheme() {
  return els.html.dataset.theme === 'dark' ? 'dark' : 'light'
}

function showToast(message) {
  els.toast.textContent = message
  els.toast.classList.add('is-visible')
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove('is-visible')
  }, 2400)
}

function setView(view) {
  state.view = view
  els.stateOptions.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.state === view)
  })
  els.projectsState.classList.toggle('is-hidden', view !== 'projects')
  els.emptyState.classList.toggle('is-hidden', view !== 'empty')
}

function updateSummary(items) {
  els.summaryTotal.textContent = items.length
  els.summaryLinear.textContent = items.filter((item) => item.type === 'linear').length
  els.summaryBranching.textContent = items.filter((item) => item.type === 'branching').length
}

function renderOwnerFilter() {
  const owners = Array.from(new Set(projects.map((project) => project.owner)))
  owners.forEach((owner) => {
    const option = document.createElement('option')
    option.value = owner
    option.textContent = owner
    els.ownerFilter.appendChild(option)
  })
}

function getFilteredProjects() {
  const keyword = state.search.trim().toLowerCase()

  return projects.filter((project) => {
    const matchType = state.type === 'all' || project.type === state.type
    const matchOwner = state.owner === 'all' || project.owner === state.owner
    const haystack = [project.name, project.typeLabel, project.owner, project.stage, ...project.tags].join(' ').toLowerCase()
    const matchKeyword = !keyword || haystack.includes(keyword)
    return matchType && matchOwner && matchKeyword
  })
}

function renderTrackPreview(project) {
  return project.tracks.map((track, index) => {
    const offset = 14 + index * 23
    const width = 38 + index * 9
    return `
      <div class="preview-track">
        <span>${track}</span>
        <i style="left: ${offset}%; width: ${width}%"></i>
      </div>
    `
  }).join('')
}

function renderProjects() {
  const items = getFilteredProjects()
  updateSummary(items)

  if (!items.length) {
    els.projectGrid.innerHTML = `
      <div class="no-results">
        <strong>没有匹配的项目</strong>
        <p>调整搜索关键词或筛选条件后再查看。</p>
      </div>
    `
    return
  }

  els.projectGrid.innerHTML = items.map((project) => `
    <article class="project-card">
      <div class="project-preview ${project.type}">
        ${renderTrackPreview(project)}
      </div>
      <div class="project-body">
        <div class="project-title-row">
          <div>
            <h2>${project.name}</h2>
            <span class="project-type ${project.type}">${project.typeLabel}</span>
          </div>
          <span class="project-health">${project.health}</span>
        </div>
        <p class="project-summary">${project.summary}</p>
        <div class="tag-row">
          ${project.tags.map((tag) => `<span>${tag}</span>`).join('')}
        </div>
        <dl class="project-meta">
          <div>
            <dt>负责人</dt>
            <dd>${project.owner}</dd>
          </div>
          <div>
            <dt>阶段</dt>
            <dd>${project.stage}</dd>
          </div>
          <div>
            <dt>上次编辑</dt>
            <dd>${project.updatedAt}</dd>
          </div>
        </dl>
      </div>
      <footer class="project-actions">
        <button class="secondary-button" type="button" data-toast="复制项目将在后续原型阶段接入">复制</button>
        <button class="secondary-button" type="button" data-toast="全量大纲导出将在后续原型阶段接入">导出</button>
        <button class="primary-button compact" type="button" data-open-project="${project.id}">打开项目</button>
      </footer>
    </article>
  `).join('')
}

function openCreateModal() {
  els.createModal.classList.remove('is-hidden')
}

function closeCreateModal() {
  els.createModal.classList.add('is-hidden')
}

function bindEvents() {
  els.themeToggle.addEventListener('click', () => {
    setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark')
  })

  els.stateOptions.forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.state))
  })

  els.projectSearch.addEventListener('input', (event) => {
    state.search = event.target.value
    renderProjects()
  })

  els.typeFilter.addEventListener('change', (event) => {
    state.type = event.target.value
    renderProjects()
  })

  els.ownerFilter.addEventListener('change', (event) => {
    state.owner = event.target.value
    renderProjects()
  })

  document.addEventListener('click', (event) => {
    const openCreate = event.target.closest('[data-open-create]')
    const closeModal = event.target.closest('[data-close-modal]')
    const toastButton = event.target.closest('[data-toast]')
    const projectButton = event.target.closest('[data-open-project]')
    const templateButton = event.target.closest('[data-template]')

    if (openCreate) openCreateModal()
    if (closeModal || event.target === els.createModal) closeCreateModal()
    if (toastButton) showToast(toastButton.dataset.toast)
    if (projectButton) showToast('项目工作台页面将在下一阶段接入')
    if (templateButton) {
      const label = templateButton.dataset.template === 'linear' ? '线性单结局' : '多分支多结局'
      closeCreateModal()
      setView('projects')
      showToast(`已选择${label}模板，后续将进入项目工作台`)
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCreateModal()
  })
}

function init() {
  setTheme(getCurrentTheme())
  renderOwnerFilter()
  renderProjects()
  bindEvents()
}

init()
