import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ConnectionMode,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow
} from '@xyflow/react'
import { getDefaultProjectView, getProjectById, saveLocalProject } from './data/projects.js'

const viewLabels = {
  worldview: '世界观',
  'branch-tree': '分支树',
  timeline: '矩阵时序'
}

const systemCatalog = [
  {
    id: 'overview',
    title: '世界观总览',
    icon: '◎',
    side: 'left',
    y: 40,
    modules: ['世界观设定', '核心概念', '基础规则摘要']
  },
  {
    id: 'geography',
    title: '地理系统',
    icon: '⌖',
    side: 'left',
    y: 190,
    modules: ['地理详情', '地点管理', '地图资源']
  },
  {
    id: 'characters',
    title: '人物系统',
    icon: '☷',
    side: 'left',
    y: 340,
    modules: ['人物档案', '人物关系图', '复杂关系网络', '能力技能']
  },
  {
    id: 'history',
    title: '历史系统',
    icon: '◷',
    side: 'left',
    y: 520,
    modules: ['时间线', '关键转折', '历史事件']
  },
  {
    id: 'culture',
    title: '文化系统',
    icon: '✦',
    side: 'right',
    y: 70,
    modules: ['宗教信仰', '语言文字', '艺术娱乐', '风俗禁忌']
  },
  {
    id: 'society',
    title: '社会结构',
    icon: '▥',
    side: 'right',
    y: 250,
    modules: ['政治体系', '经济系统', '外交关系', '组织 / 阵营']
  },
  {
    id: 'creation',
    title: '创作管理',
    icon: '✎',
    side: 'right',
    y: 430,
    modules: ['伏笔管理', '灵感库', '术语表']
  },
  {
    id: 'tools',
    title: '工具与设置',
    icon: '#',
    side: 'right',
    y: 580,
    modules: ['姓名生成', '模板配置', 'AI 上下文开关']
  }
]

const nodeTypes = {
  worldNode: WorldNode,
  noteNode: NoteNode
}

const nodeHandlePositions = [
  { id: 'left', position: Position.Left },
  { id: 'right', position: Position.Right },
  { id: 'top', position: Position.Top },
  { id: 'bottom', position: Position.Bottom }
]

const defaultKnowledgeSyncFields = ['title', 'summary', 'nodeType', 'tags']

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16
  },
  style: {
    stroke: 'var(--color-border-strong)',
    strokeWidth: 2
  }
}

const aiSessionEndpoint = import.meta.env.VITE_JUGO_AI_SESSION_URL || '/jugo-ai/session'

export function App() {
  const isProjectPage = window.location.pathname.endsWith('/project.html') || window.location.pathname.endsWith('project.html')

  useEffect(() => {
    const savedTheme = localStorage.getItem('jugo-theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light')
  }, [])

  return isProjectPage ? <ProjectWorkspace /> : <ProjectDashboard />
}

function ProjectDashboard() {
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [createForm, setCreateForm] = useState(createInitialProjectForm)
  const [createTouched, setCreateTouched] = useState({})
  const createErrors = validateCreateProjectForm(createForm)
  const canCreateProject = Object.keys(createErrors).length === 0

  function showToast(message) {
    setToast(message)
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => setToast(''), 2200)
  }

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('jugo-theme', nextTheme)
  }

  function updateCreateField(field, value) {
    setCreateForm((current) => ({ ...current, [field]: value }))
  }

  function markCreateFieldTouched(field) {
    setCreateTouched((current) => ({ ...current, [field]: true }))
  }

  function closeCreateModal() {
    setCreateOpen(false)
    setCreateForm(createInitialProjectForm())
    setCreateTouched({})
  }

  function submitCreateProject(event) {
    event.preventDefault()
    const nextErrors = validateCreateProjectForm(createForm)
    setCreateTouched({ projectName: true, worldName: true, templateType: true })

    if (Object.keys(nextErrors).length > 0) {
      showToast('请先完成新建项目信息')
      return
    }

    const now = new Date()
    const project = {
      id: `local-${now.getTime()}`,
      name: createForm.projectName.trim(),
      worldName: createForm.worldName.trim(),
      type: createForm.templateType,
      owner: '本地演示',
      updatedAt: formatProjectTimestamp(now),
      tags: createForm.templateType === 'branching'
        ? ['互动小说', '多结局', '本地演示']
        : ['小说剧本', '线性结构', '本地演示'],
      tracks: createForm.templateType === 'branching'
        ? ['主线', '关键选择', '结局线']
        : ['主线', '人物线', '反派线']
    }

    saveLocalProject(project)
    window.location.href = `./project.html?id=${project.id}&view=${getDefaultProjectView(project)}`
  }

  return (
    <>
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar" aria-label="项目管理导航">
          <div className="sidebar-head">
            <a className="brand" href="./" aria-label="JUGO 项目首页">
              <span className="brand-mark">J</span>
              <span>
                <strong>JUGO</strong>
                <small>v0.2.0-planning</small>
              </span>
            </a>
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label="切换主题">
              <span className="theme-icon" aria-hidden="true">{theme === 'dark' ? '☾' : '☼'}</span>
              <span className="theme-label">{theme === 'dark' ? '夜间' : '日间'}</span>
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="主导航">
            <a className="sidebar-link is-active" href="./">项目</a>
            <button className="sidebar-link" type="button" onClick={() => showToast('帮助中心将在需求评审稿确认后接入')}>帮助中心</button>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="empty-workspace" aria-label="空白项目引导">
            <div className="empty-workspace-content">
              <h1>开始创作你的小说 / 互动剧本</h1>
              <p>选择标准化模板后，系统将初始化对应的世界观主画布、评审路径和结构工作区。</p>
              <button className="primary-button large" type="button" onClick={() => setCreateOpen(true)}>新建项目</button>
            </div>
          </section>
        </main>
      </div>

      {isCreateOpen && (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="createTitle">
        <div className="modal">
          <header className="modal-header">
            <div>
              <p className="eyebrow">新建项目</p>
              <h2 id="createTitle">创建小说 / 互动剧本项目</h2>
            </div>
            <button className="icon-only" type="button" onClick={closeCreateModal} aria-label="关闭">×</button>
          </header>
          <form className="create-project-form" onSubmit={submitCreateProject} noValidate>
            <div className="create-project-fields">
              <label className="form-field" htmlFor="projectName">
                <span>项目名称</span>
                <input
                  autoFocus
                  id="projectName"
                  maxLength={40}
                  name="projectName"
                  onBlur={() => markCreateFieldTouched('projectName')}
                  onChange={(event) => updateCreateField('projectName', event.target.value)}
                  placeholder="例如：极夜航线"
                  type="text"
                  value={createForm.projectName}
                />
                <small>用于项目管理、团队协作和顶部项目标题。</small>
                {createTouched.projectName && createErrors.projectName && <em>{createErrors.projectName}</em>}
              </label>

              <label className="form-field" htmlFor="worldName">
                <span>世界名称</span>
                <input
                  id="worldName"
                  maxLength={40}
                  name="worldName"
                  onBlur={() => markCreateFieldTouched('worldName')}
                  onChange={(event) => updateCreateField('worldName', event.target.value)}
                  placeholder="例如：极夜星域"
                  type="text"
                  value={createForm.worldName}
                />
                <small>用于世界观根节点、百科仓库和设定资料归档。</small>
                {createTouched.worldName && createErrors.worldName && <em>{createErrors.worldName}</em>}
              </label>
            </div>

            <section className="template-section" aria-labelledby="templateTitle">
              <div className="template-section-head">
                <h3 id="templateTitle">选择创作模板</h3>
                {createTouched.templateType && createErrors.templateType && <em>{createErrors.templateType}</em>}
              </div>
              <div className="template-grid" role="radiogroup" aria-labelledby="templateTitle">
                <button
                  aria-checked={createForm.templateType === 'linear'}
                  className={`template-card ${createForm.templateType === 'linear' ? 'is-selected' : ''}`}
                  role="radio"
                  type="button"
                  onClick={() => {
                    updateCreateField('templateType', 'linear')
                    markCreateFieldTouched('templateType')
                  }}
                >
                  <span className="template-type">模板 1</span>
                  <strong>线性单结局</strong>
                  <p>适合网文、影视剧本、短剧。项目编辑页仅保留世界观和矩阵时序两个主内容区。</p>
                  <span className="template-flow">世界观 → 矩阵时序</span>
                </button>
                <button
                  aria-checked={createForm.templateType === 'branching'}
                  className={`template-card ${createForm.templateType === 'branching' ? 'is-selected' : ''}`}
                  role="radio"
                  type="button"
                  onClick={() => {
                    updateCreateField('templateType', 'branching')
                    markCreateFieldTouched('templateType')
                  }}
                >
                  <span className="template-type accent">模板 2</span>
                  <strong>多分支多结局</strong>
                  <p>适合互动小说、游戏剧情、多结局剧本。项目编辑页仅保留世界观和分支树两个主内容区。</p>
                  <span className="template-flow">世界观 → 分支树</span>
                </button>
              </div>
            </section>

            <footer className="modal-actions">
              <button className="secondary-button compact" type="button" onClick={closeCreateModal}>取消</button>
              <button className="primary-button compact" type="submit" disabled={!canCreateProject}>创建项目</button>
            </footer>
          </form>
        </div>
      </div>
      )}

      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </>
  )
}

function createInitialProjectForm() {
  return {
    projectName: '',
    worldName: '',
    templateType: ''
  }
}

function validateCreateProjectForm(form) {
  const errors = {}
  const projectName = form.projectName.trim()
  const worldName = form.worldName.trim()

  if (!projectName) {
    errors.projectName = '请输入项目名称'
  } else if (projectName.length > 40) {
    errors.projectName = '最多输入 40 个字符'
  }

  if (!worldName) {
    errors.worldName = '请输入世界名称'
  } else if (worldName.length > 40) {
    errors.worldName = '最多输入 40 个字符'
  }

  if (!form.templateType) {
    errors.templateType = '请选择创作模板'
  }

  return errors
}

function formatProjectTimestamp(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function createProjectInfoForm(project) {
  return {
    projectName: project.name || '',
    worldName: project.worldName || project.name || ''
  }
}

function validateProjectInfoForm(form) {
  const errors = {}
  const projectName = form.projectName.trim()
  const worldName = form.worldName.trim()

  if (!projectName) {
    errors.projectName = '请输入项目名称'
  } else if (projectName.length > 40) {
    errors.projectName = '最多输入 40 个字符'
  }

  if (!worldName) {
    errors.worldName = '请输入世界名称'
  } else if (worldName.length > 40) {
    errors.worldName = '最多输入 40 个字符'
  }

  return errors
}

function updateWorldviewRootTitle(draft, worldName) {
  return updateWorldviewRootNode(draft, { title: worldName })
}

function updateWorldviewRootNode(draft, patch) {
  return {
    ...draft,
    nodes: draft.nodes.map((node) => (
      node.id === 'root'
        ? {
            ...node,
            data: {
              ...node.data,
              ...(patch.title ? { title: patch.title } : {}),
              ...(patch.summary ? { summary: patch.summary } : {})
            }
          }
        : node
    ))
  }
}

function getWorldviewAgentContext(draft) {
  const rootNode = draft.nodes.find((node) => node.id === 'root')
  return {
    activeSection: draft.activeSection,
    selectedNodeId: draft.selectedNodeId,
    root: rootNode
      ? {
          title: rootNode.data.title,
          summary: rootNode.data.summary,
          syncStatus: rootNode.data.syncStatus
        }
      : null,
    nodeCount: draft.nodes.length
  }
}

function updateStoredProjectDraft(project) {
  const draftKey = `jugo-project-draft-${project.id}`
  const rawDraft = localStorage.getItem(draftKey)
  if (!rawDraft) return

  try {
    const parsedDraft = JSON.parse(rawDraft)
    const worldview = parsedDraft.worldview?.nodes
      ? updateWorldviewRootTitle(parsedDraft.worldview, project.worldName)
      : parsedDraft.worldview

    localStorage.setItem(draftKey, JSON.stringify({
      ...parsedDraft,
      projectName: project.name,
      worldName: project.worldName,
      worldview
    }))
  } catch {
    localStorage.removeItem(draftKey)
  }
}

function ProjectWorkspace() {
  const params = new URLSearchParams(window.location.search)
  const initialProject = getProjectById(params.get('id'))
  const [project, setProject] = useState(initialProject)
  const defaultView = getDefaultProjectView(project)
  const [activeView, setActiveViewState] = useState(() => normalizeView(project, params.get('view') || defaultView))
  const [saveStatus, setSaveStatus] = useState('')
  const [savePulse, setSavePulse] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [worldviewDraft, setWorldviewDraft] = useState(() => loadWorldviewDraft(project))
  const [isProjectInfoOpen, setProjectInfoOpen] = useState(false)
  const [projectInfoForm, setProjectInfoForm] = useState(() => createProjectInfoForm(project))
  const [projectInfoTouched, setProjectInfoTouched] = useState({})
  const projectInfoErrors = validateProjectInfoForm(projectInfoForm)
  const canSaveProjectInfo = Object.keys(projectInfoErrors).length === 0
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState(() => ([
    {
      role: 'assistant',
      content: '我是项目编辑 AI 助手。你可以让我修改项目名称、世界名称、切换视图，或更新世界观根节点摘要。'
    }
  ]))
  const [aiInput, setAiInput] = useState('')
  const [aiPending, setAiPending] = useState(false)

  const allowedViews = getAllowedViews(project)

  function setActiveView(view) {
    const nextView = normalizeView(project, view)
    setActiveViewState(nextView)
    const url = new URL(window.location.href)
    url.searchParams.set('id', project.id)
    url.searchParams.set('view', nextView)
    window.history.replaceState({}, '', url)
  }

  function saveProject() {
    const savedAt = new Date()
    const nextWorldviewDraft = markWorldviewSynced(worldviewDraft, savedAt)
    const syncableNodes = getSyncableNodes(nextWorldviewDraft.nodes)
    const knowledgeEntries = createKnowledgeEntries(nextWorldviewDraft.nodes)
    const syncSummary = {
      savedAt: savedAt.toISOString(),
      generatedCount: knowledgeEntries.length,
      pendingCount: syncableNodes.filter((node) => node.data.syncStatus === 'pending').length,
      issueCount: syncableNodes.filter((node) => node.data.syncStatus === 'issue').length,
      noteCount: nextWorldviewDraft.nodes.filter((node) => node.type === 'noteNode').length
    }

    localStorage.setItem(`jugo-project-draft-${project.id}`, JSON.stringify({
      projectId: project.id,
      projectName: project.name,
      worldName: project.worldName,
      activeView,
      worldview: nextWorldviewDraft,
      knowledgeEntries,
      syncSummary
    }))

    setWorldviewDraft(nextWorldviewDraft)
    setSyncResult(syncSummary)
    setSaveStatus(`已保存 ${formatSavedTime(savedAt)}`)
    setSavePulse(true)
    window.clearTimeout(saveProject.timer)
    saveProject.timer = window.setTimeout(() => setSavePulse(false), 1200)
  }

  function openProjectInfoModal() {
    setProjectInfoForm(createProjectInfoForm(project))
    setProjectInfoTouched({})
    setProjectInfoOpen(true)
  }

  function closeProjectInfoModal() {
    setProjectInfoOpen(false)
    setProjectInfoTouched({})
  }

  function updateProjectInfoField(field, value) {
    setProjectInfoForm((current) => ({ ...current, [field]: value }))
  }

  function markProjectInfoTouched(field) {
    setProjectInfoTouched((current) => ({ ...current, [field]: true }))
  }

  function applyProjectInfoPatch(patch) {
    const nextProject = {
      ...project,
      name: patch.projectName?.trim() || project.name,
      worldName: patch.worldName?.trim() || project.worldName,
      updatedAt: formatProjectTimestamp(new Date())
    }

    setProject(nextProject)
    saveLocalProject(nextProject)
    setWorldviewDraft((current) => updateWorldviewRootTitle(current, nextProject.worldName))
    updateStoredProjectDraft(nextProject)
    return nextProject
  }

  function submitProjectInfo(event) {
    event.preventDefault()
    const nextErrors = validateProjectInfoForm(projectInfoForm)
    setProjectInfoTouched({ projectName: true, worldName: true })

    if (Object.keys(nextErrors).length > 0) return

    applyProjectInfoPatch({
      projectName: projectInfoForm.projectName,
      worldName: projectInfoForm.worldName
    })
    setSaveStatus('项目信息已更新')
    setProjectInfoOpen(false)
  }

  function openAiAssistant() {
    setAiAssistantOpen(true)
  }

  function closeAiAssistant() {
    setAiAssistantOpen(false)
  }

  async function sendAiMessage(event) {
    event.preventDefault()
    const content = aiInput.trim()
    if (!content || aiPending) return

    const nextMessages = [...aiMessages, { role: 'user', content }]
    setAiMessages(nextMessages)
    setAiInput('')
    setAiPending(true)

    try {
      const response = await fetch(aiSessionEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            id: project.id,
            name: project.name,
            worldName: project.worldName,
            type: project.type,
            activeView
          },
          allowedViews,
          worldview: getWorldviewAgentContext(worldviewDraft),
          messages: nextMessages
        })
      })

      if (!response.ok) {
        throw new Error(`AI 会话服务返回 ${response.status}`)
      }

      const result = await response.json()
      const actionSummary = applyAiAgentActions(result.actions || [])
      setAiMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: actionSummary ? `${result.reply}\n${actionSummary}` : result.reply
        }
      ])
    } catch (error) {
      setAiMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: `AI 会话服务暂不可用：${error.message}`
        }
      ])
    } finally {
      setAiPending(false)
    }
  }

  function applyAiAgentActions(actions) {
    const applied = []

    actions.forEach((action) => {
      if (action.type === 'update_project_info') {
        const patch = {
          projectName: typeof action.projectName === 'string' ? action.projectName : '',
          worldName: typeof action.worldName === 'string' ? action.worldName : ''
        }
        if (patch.projectName.trim() || patch.worldName.trim()) {
          applyProjectInfoPatch(patch)
          applied.push('已更新项目信息')
        }
      }

      if (action.type === 'switch_view' && allowedViews.includes(action.view)) {
        setActiveView(action.view)
        applied.push(`已切换到${viewLabels[action.view]}`)
      }

      if (action.type === 'update_worldview_root') {
        const title = typeof action.title === 'string' ? action.title.trim() : ''
        const summary = typeof action.summary === 'string' ? action.summary.trim() : ''
        if (title || summary) {
          setWorldviewDraft((current) => updateWorldviewRootNode(current, { title, summary }))
          applied.push('已更新世界观根节点')
        }
      }
    })

    if (applied.length > 0) {
      setSaveStatus('AI 助手已执行修改')
    }

    return applied.length > 0 ? `执行结果：${applied.join('，')}。` : ''
  }

  return (
    <div className="workspace-shell">
      <header className="editor-topbar">
        <div className="editor-topbar-left">
          <a className="back-button" href="./" aria-label="返回项目管理页面">&lt;</a>
          <span className="project-title-label">{project.name}</span>
        </div>

        <nav className="editor-tabs" aria-label="项目主内容区">
          {allowedViews.map((view) => (
            <button
              className={`editor-tab ${view === activeView ? 'is-active' : ''}`}
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
            >
              {viewLabels[view]}
            </button>
          ))}
        </nav>

        <div className="editor-topbar-actions">
          <span className="save-status" aria-live="polite">{saveStatus}</span>
          <div className="project-tool-group" aria-label="项目工具">
            <button className="project-tool-button" type="button" onClick={openProjectInfoModal} aria-label="编辑项目信息">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button className="project-tool-button" type="button" onClick={openAiAssistant} aria-label="AI 助手">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v3"></path>
                <circle cx="12" cy="3" r="1"></circle>
                <rect x="5" y="7" width="14" height="12" rx="4"></rect>
                <path d="M9 13h.01"></path>
                <path d="M15 13h.01"></path>
                <path d="M9.5 16h5"></path>
                <path d="M3 12h2"></path>
                <path d="M19 12h2"></path>
              </svg>
            </button>
          </div>
          <button className={`save-button ${savePulse ? 'is-saved' : ''}`} type="button" onClick={saveProject}>保存</button>
        </div>
      </header>

      <main className={`workspace ${activeView === 'worldview' ? 'workspace--worldview' : ''}`}>
        {activeView === 'worldview' && (
          <WorldviewWorkbench
            draft={worldviewDraft}
            onDraftChange={setWorldviewDraft}
            syncResult={syncResult}
          />
        )}
        {activeView === 'timeline' && <TimelineView project={project} />}
        {activeView === 'branch-tree' && <BranchTreeView />}
      </main>

      {isProjectInfoOpen && (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="projectInfoTitle">
        <div className="modal project-info-modal">
          <header className="modal-header">
            <div>
              <p className="eyebrow">项目设置</p>
              <h2 id="projectInfoTitle">编辑项目信息</h2>
            </div>
            <button className="icon-only" type="button" onClick={closeProjectInfoModal} aria-label="关闭">×</button>
          </header>

          <form className="create-project-form" onSubmit={submitProjectInfo} noValidate>
            <div className="create-project-fields">
              <label className="form-field" htmlFor="projectInfoName">
                <span>项目名称</span>
                <input
                  autoFocus
                  id="projectInfoName"
                  maxLength={40}
                  name="projectInfoName"
                  onBlur={() => markProjectInfoTouched('projectName')}
                  onChange={(event) => updateProjectInfoField('projectName', event.target.value)}
                  placeholder="例如：极夜航线"
                  type="text"
                  value={projectInfoForm.projectName}
                />
                <small>用于项目管理、团队协作和顶部项目标题。</small>
                {projectInfoTouched.projectName && projectInfoErrors.projectName && <em>{projectInfoErrors.projectName}</em>}
              </label>

              <label className="form-field" htmlFor="projectInfoWorldName">
                <span>世界名称</span>
                <input
                  id="projectInfoWorldName"
                  maxLength={40}
                  name="projectInfoWorldName"
                  onBlur={() => markProjectInfoTouched('worldName')}
                  onChange={(event) => updateProjectInfoField('worldName', event.target.value)}
                  placeholder="例如：极夜星域"
                  type="text"
                  value={projectInfoForm.worldName}
                />
                <small>用于世界观根节点、百科仓库和设定资料归档。</small>
                {projectInfoTouched.worldName && projectInfoErrors.worldName && <em>{projectInfoErrors.worldName}</em>}
              </label>

              <div className="project-info-template" aria-label="创作模板">
                <span>创作模板</span>
                <strong>{project.typeLabel}</strong>
                <small>{project.type === 'branching' ? '项目编辑页保留世界观和分支树。' : '项目编辑页保留世界观和矩阵时序。'}</small>
              </div>
            </div>

            <footer className="modal-actions">
              <button className="secondary-button compact" type="button" onClick={closeProjectInfoModal}>取消</button>
              <button className="primary-button compact" type="submit" disabled={!canSaveProjectInfo}>保存设置</button>
            </footer>
          </form>
        </div>
      </div>
      )}

      {isAiAssistantOpen && (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="aiAssistantTitle">
        <div className="modal ai-assistant-modal">
          <header className="modal-header">
            <div>
              <p className="eyebrow">AI 助手</p>
              <h2 id="aiAssistantTitle">项目编辑会话</h2>
            </div>
            <button className="icon-only" type="button" onClick={closeAiAssistant} aria-label="关闭">×</button>
          </header>

          <div className="ai-chat-log" aria-live="polite">
            {aiMessages.map((message, index) => (
              <article className={`ai-chat-message is-${message.role}`} key={`${message.role}-${index}`}>
                <span>{message.role === 'user' ? '你' : 'AI 助手'}</span>
                <p>{message.content}</p>
              </article>
            ))}
            {aiPending && (
              <article className="ai-chat-message is-assistant">
                <span>AI 助手</span>
                <p>正在分析项目上下文...</p>
              </article>
            )}
          </div>

          <form className="ai-chat-composer" onSubmit={sendAiMessage}>
            <textarea
              value={aiInput}
              onChange={(event) => setAiInput(event.target.value)}
              placeholder="例如：把项目名称改为《极夜航线：重启》，并切换到世界观。"
              rows={3}
            />
            <button className="primary-button compact" type="submit" disabled={!aiInput.trim() || aiPending}>发送</button>
          </form>
        </div>
      </div>
      )}
    </div>
  )
}

function WorldviewWorkbench({ draft, onDraftChange, syncResult }) {
  const [selectedNodeId, setSelectedNodeId] = useState(draft.selectedNodeId || 'root')
  const selectedNode = draft.nodes.find((node) => node.id === selectedNodeId) || draft.nodes[0]
  const selectedHasChildren = selectedNode ? hasNodeChildren(draft.nodes, selectedNode.id) : false
  const selectedExpanded = selectedNode?.data.expanded !== false
  const knowledgeEntries = useMemo(() => createKnowledgeEntries(draft.nodes), [draft.nodes])
  const hiddenNodeIds = useMemo(() => getCollapsedNodeIds(draft.nodes), [draft.nodes])
  const syncableNodes = useMemo(() => getSyncableNodes(draft.nodes), [draft.nodes])

  const openKnowledgeEntry = useCallback((nodeId) => {
    const node = draft.nodes.find((item) => item.id === nodeId)
    if (!node || !isKnowledgeSyncNode(node)) return

    setSelectedNodeId(nodeId)
    onDraftChange((current) => ({
      ...current,
      activeSection: 'knowledge',
      selectedNodeId: nodeId,
      activeKnowledgeEntryId: node.data.knowledgeEntryId || `entry-${nodeId}`
    }))
  }, [draft.nodes, onDraftChange])

  const toggleNodeExpand = useCallback((nodeId) => {
    const targetNode = draft.nodes.find((node) => node.id === nodeId)
    const isCollapsing = targetNode?.data.expanded !== false
    const hiddenByToggle = isCollapsing ? getDescendantIds(draft.nodes, nodeId) : []

    if (hiddenByToggle.includes(selectedNodeId)) {
      setSelectedNodeId(nodeId)
    }

    onDraftChange((current) => ({
      ...current,
      selectedNodeId: hiddenByToggle.includes(current.selectedNodeId) ? nodeId : current.selectedNodeId,
      nodes: current.nodes.map((node) => (
        node.id === nodeId
          ? { ...node, data: { ...node.data, expanded: node.data.expanded === false } }
          : node
      ))
    }))
  }, [draft.nodes, onDraftChange, selectedNodeId])

  const renderNodes = useMemo(() => draft.nodes.map((node) => {
    const hasChildren = hasNodeChildren(draft.nodes, node.id)
    return {
      ...node,
      hidden: hiddenNodeIds.has(node.id),
      data: {
        ...node.data,
        nodeId: node.id,
        hasChildren,
        collapsedChildrenCount: countDescendants(draft.nodes, node.id),
        childCount: countDirectChildren(draft.nodes, node.id),
        canOpenKnowledge: isKnowledgeSyncNode(node),
        onOpenKnowledge: isKnowledgeSyncNode(node) ? openKnowledgeEntry : undefined,
        onToggleExpand: hasChildren ? toggleNodeExpand : undefined
      }
    }
  }), [draft.nodes, hiddenNodeIds, openKnowledgeEntry, toggleNodeExpand])

  const renderEdges = useMemo(() => draft.edges.map((edge) => ({
    ...edge,
    hidden: hiddenNodeIds.has(edge.source) || hiddenNodeIds.has(edge.target)
  })), [draft.edges, hiddenNodeIds])

  const onNodesChange = useCallback((changes) => {
    onDraftChange((current) => ({
      ...current,
      nodes: applyNodeChanges(changes, current.nodes)
    }))
  }, [onDraftChange])

  const onEdgesChange = useCallback((changes) => {
    onDraftChange((current) => ({
      ...current,
      edges: applyEdgeChanges(changes, current.edges)
    }))
  }, [onDraftChange])

  const onConnect = useCallback((connection) => {
    onDraftChange((current) => ({
      ...current,
      edges: addEdge({
        ...connection,
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        type: 'smoothstep',
        animated: true
      }, current.edges)
    }))
  }, [onDraftChange])

  function setSection(section) {
    onDraftChange((current) => ({ ...current, activeSection: section }))
  }

  function addCustomNode() {
    const parent = getAttachableParent(selectedNode, draft.nodes)
    const customId = `custom-${Date.now()}`
    const customNode = {
      id: customId,
      type: 'worldNode',
      position: {
        x: parent.position.x + 230,
        y: parent.position.y + 90
      },
      data: {
        title: '自增设定节点',
        nodeType: 'custom',
        summary: '可删除节点；删除后来源百科条目归档为废弃。',
        syncStatus: 'pending',
        locked: false,
        count: 0,
        icon: '+',
        parentId: parent.id,
        depth: Number(parent.data.depth || 0) + 1,
        expanded: true,
        tags: ['自增设定'],
        knowledgeEntryId: `entry-${customId}`,
        syncScope: 'knowledge-entry',
        syncDirection: 'map-to-knowledge',
        syncFields: defaultKnowledgeSyncFields,
        syncVersion: 0,
        sourceBinding: 'bound',
        lastSyncedAt: null
      }
    }
    onDraftChange((current) => ({
      ...current,
      nodes: [
        ...current.nodes,
        customNode
      ],
      edges: [
        ...current.edges,
        {
          id: `${parent.id}-${customId}`,
          source: parent.id,
          target: customId,
          ...getHorizontalHandles(parent, customNode),
          type: 'smoothstep',
          animated: true
        }
      ],
      selectedNodeId: customId
    }))
    setSelectedNodeId(customId)
  }

  function addNoteNode() {
    const parent = getAttachableParent(selectedNode, draft.nodes)
    const noteId = `note-${Date.now()}`
    const noteNode = {
      id: noteId,
      type: 'noteNode',
      position: {
        x: parent.position.x + 190,
        y: parent.position.y - 130
      },
      data: {
        title: '创作便签',
        nodeType: 'note',
        summary: '记录灵感、待确认设定或团队评审意见；保存时不进入百科仓库。',
        syncStatus: 'notSynced',
        locked: false,
        count: 0,
        icon: '!',
        parentId: parent.id,
        depth: Number(parent.data.depth || 0) + 1,
        expanded: true,
        tags: ['画布便签'],
        syncScope: 'canvas-note',
        syncDirection: 'none',
        syncFields: [],
        syncVersion: 0,
        sourceBinding: 'canvas-only',
        lastSyncedAt: null
      }
    }

    onDraftChange((current) => ({
      ...current,
      nodes: [...current.nodes, noteNode],
      edges: [
        ...current.edges,
        {
          id: `${parent.id}-${noteId}`,
          source: parent.id,
          target: noteId,
          sourceHandle: 'top',
          targetHandle: 'bottom',
          type: 'smoothstep',
          style: {
            stroke: 'var(--color-accent)',
            strokeWidth: 2,
            strokeDasharray: '6 5'
          }
        }
      ],
      selectedNodeId: noteId
    }))
    setSelectedNodeId(noteId)
  }

  function clearFixedNode() {
    if (!selectedNode?.data.locked) return
    updateNode(selectedNode.id, {
      summary: '固定业务节点已清空内容，目录节点保留以维持百科同步路径。',
      syncStatus: 'pending',
      count: 0
    })
  }

  function enrichWithAi() {
    if (!selectedNode) return
    updateNode(selectedNode.id, {
      summary: `${selectedNode.data.title}已生成百科字段建议，等待创作者确认后写入知识库。`,
      syncStatus: 'suggested'
    })
  }

  function updateNode(nodeId, patch) {
    onDraftChange((current) => ({
      ...current,
      nodes: current.nodes.map((node) => (
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...patch } }
          : node
      ))
    }))
  }

  function deleteCustomNode() {
    if (!selectedNode || selectedNode.data.locked) return
    const deletedIds = new Set([selectedNode.id, ...getDescendantIds(draft.nodes, selectedNode.id)])
    const deletedKnowledgeNodes = draft.nodes.filter((node) => deletedIds.has(node.id) && isKnowledgeSyncNode(node))
    onDraftChange((current) => ({
      ...current,
      nodes: current.nodes.filter((node) => !deletedIds.has(node.id)),
      edges: current.edges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)),
      archivedEntries: [
        ...(current.archivedEntries || []),
        ...deletedKnowledgeNodes.map((node) => ({
          title: node.data.title,
          sourceNodeId: node.id,
          knowledgeEntryId: node.data.knowledgeEntryId,
          archivedAt: new Date().toISOString(),
          reason: '用户删除自增导图节点，百科条目解除来源绑定并归档为废弃'
        }))
      ],
      selectedNodeId: 'root'
    }))
    setSelectedNodeId('root')
  }

  return (
    <section className="worldview-workbench" aria-label="世界观编辑">
      <aside className="worldview-nav" aria-label="世界观导航">
        <button className={`worldview-nav-primary ${draft.activeSection === 'mindmap' ? 'is-active' : ''}`} type="button" onClick={() => setSection('mindmap')}>思维导图</button>
        <button className={`worldview-nav-primary ${draft.activeSection === 'knowledge' ? 'is-active' : ''}`} type="button" onClick={() => setSection('knowledge')}>百科仓库</button>
        <div className="worldview-nav-groups">
          {systemCatalog.map((group) => (
            <button key={group.id} type="button" onClick={() => setSection('knowledge')}>
              <span>{group.icon}</span>
              {group.title}
            </button>
          ))}
        </div>
      </aside>

      <section className="worldview-content">
        {draft.activeSection === 'mindmap' ? (
          <div className="world-map-shell">
            <div className="world-map-toolbar">
              <button className="secondary-button" type="button" onClick={addCustomNode}>新增节点</button>
              <button className="secondary-button" type="button" onClick={addNoteNode}>添加便签</button>
              <button className="secondary-button" type="button" onClick={() => selectedNode && toggleNodeExpand(selectedNode.id)} disabled={!selectedHasChildren}>
                {selectedExpanded ? '折叠子级' : '展开子级'}
              </button>
              <button className="secondary-button" type="button" onClick={clearFixedNode} disabled={!selectedNode?.data.locked}>清空固定节点</button>
              <button className="secondary-button" type="button" onClick={deleteCustomNode} disabled={!selectedNode || selectedNode.data.locked}>删除自增 / 便签</button>
              <button className="primary-button" type="button" onClick={enrichWithAi} disabled={!selectedNode || !isKnowledgeSyncNode(selectedNode)}>AI 补全百科字段</button>
            </div>

            <div className="world-map-canvas">
              <ReactFlow
                nodes={renderNodes}
                edges={renderEdges}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionMode={ConnectionMode.Loose}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => {
                  setSelectedNodeId(node.id)
                  onDraftChange((current) => ({ ...current, selectedNodeId: node.id }))
                }}
                fitView
                minZoom={0.35}
                maxZoom={1.6}
              >
                <Background color="var(--color-grid-line)" gap={28} />
                <Controls showInteractive={false} />
                <MiniMap pannable zoomable nodeStrokeWidth={3} />
                <Panel className="world-map-panel" position="top-left">
                  世界观 0-1 主画布
                </Panel>
              </ReactFlow>
            </div>

            <div className="world-map-statusbar">
              {selectedNode && <span>当前 {selectedNode.data.title}</span>}
              {selectedNode && <span>{getNodeKindLabel(selectedNode)}</span>}
              {selectedNode && <span>{getSyncLabel(selectedNode.data.syncStatus)}</span>}
              <span>节点 {draft.nodes.length}</span>
              <span>百科源 {syncableNodes.length}</span>
              <span>便签 {draft.nodes.filter((node) => node.type === 'noteNode').length}</span>
              <span>隐藏 {hiddenNodeIds.size}</span>
              <span>待同步 {syncableNodes.filter((node) => node.data.syncStatus === 'pending').length}</span>
              <span>校验建议 {syncableNodes.filter((node) => node.data.syncStatus === 'issue' || node.data.syncStatus === 'suggested').length}</span>
              {syncResult && <span>百科条目 {syncResult.generatedCount}</span>}
            </div>
          </div>
        ) : (
          <KnowledgeRepository
            activeEntryId={draft.activeKnowledgeEntryId}
            entries={knowledgeEntries}
            archivedEntries={draft.archivedEntries || []}
            syncResult={syncResult}
          />
        )}
      </section>
    </section>
  )
}

function NodeHandles() {
  return nodeHandlePositions.flatMap((handle) => [
    <Handle
      className={`node-handle node-handle-${handle.id} node-handle-target`}
      id={handle.id}
      key={`${handle.id}-target`}
      position={handle.position}
      type="target"
    />,
    <Handle
      className={`node-handle node-handle-${handle.id} node-handle-source`}
      id={handle.id}
      key={`${handle.id}-source`}
      position={handle.position}
      type="source"
    />
  ])
}

function WorldNode({ data, selected }) {
  return (
    <div className={`world-node ${selected ? 'is-selected' : ''} ${data.locked ? 'is-locked' : ''}`}>
      <NodeHandles />
      <div className="mindmap-node-row">
        <span className="world-node-icon">{data.icon || '0'}</span>
        <strong>{data.title}</strong>
        <span className="mindmap-node-count">{data.childCount || 0}</span>
        <button
          className="node-action-button node-toggle-button nodrag"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            data.onToggleExpand?.(data.nodeId)
          }}
          disabled={!data.hasChildren}
          aria-label={data.expanded === false ? '展开子级节点' : '隐藏子级节点'}
        >
          {data.expanded === false ? '+' : '-'}
        </button>
        <button
          className="node-action-button node-enter-button nodrag"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            data.onOpenKnowledge?.(data.nodeId)
          }}
          disabled={!data.canOpenKnowledge}
          aria-label="进入百科栏编辑"
        >
          →
        </button>
      </div>
    </div>
  )
}

function NoteNode({ data, selected }) {
  return (
    <div className={`note-node ${selected ? 'is-selected' : ''}`}>
      <NodeHandles />
      <div className="mindmap-node-row">
        <span className="note-node-icon">{data.icon || '0'}</span>
        <strong>{data.title}</strong>
        <span className="mindmap-node-count">{data.childCount || 0}</span>
        <button
          className="node-action-button node-toggle-button nodrag"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            data.onToggleExpand?.(data.nodeId)
          }}
          disabled={!data.hasChildren}
          aria-label={data.expanded === false ? '展开子级节点' : '隐藏子级节点'}
        >
          {data.expanded === false ? '+' : '-'}
        </button>
        <button
          className="node-action-button node-enter-button nodrag"
          type="button"
          disabled
          aria-label="便签不进入百科栏"
        >
          →
        </button>
      </div>
    </div>
  )
}

function KnowledgeRepository({ activeEntryId, entries, archivedEntries, syncResult }) {
  return (
    <div className="knowledge-repository">
      <header className="knowledge-head">
        <div>
          <p className="detail-kicker">百科仓库</p>
          <h2>由思维导图同步生成的结构化条目</h2>
        </div>
        {syncResult && (
          <span className="knowledge-sync-badge">
            已同步 {syncResult.generatedCount} 条
          </span>
        )}
      </header>
      <div className="knowledge-grid">
        {entries.map((entry) => (
          <article className={`knowledge-card ${entry.id === activeEntryId ? 'is-active' : ''}`} key={entry.id}>
            <span>{entry.category}</span>
            <strong>{entry.title}</strong>
            <p>{entry.summary}</p>
            <small>来源节点：{entry.sourceNodeId}</small>
            <small>百科条目：{entry.id}</small>
            <small>同步字段：{entry.syncFields.join(' / ')}</small>
            <small>同步状态：{entry.syncLabel} · v{entry.syncVersion}</small>
          </article>
        ))}
      </div>
      {archivedEntries.length > 0 && (
        <section className="archived-panel">
          <h3>废弃归档</h3>
          {archivedEntries.map((entry) => (
            <p key={`${entry.title}-${entry.archivedAt}`}>{entry.title}：{entry.reason}</p>
          ))}
        </section>
      )}
    </div>
  )
}

function TimelineView({ project }) {
  return (
    <section className="workspace-grid">
      <aside className="workspace-sidebar">
        <h2>评审路径</h2>
        <ol>
          <li>世界观</li>
          <li>矩阵时序</li>
          <li>全局校验</li>
        </ol>
      </aside>

      <section className="workspace-canvas" aria-live="polite">
        <div className="canvas-toolbar">
          <span>章节刻度</span>
          <strong>第 1 章 - 第 12 章</strong>
        </div>
        <div className="timeline-board">
          {project.tracks.map((track, index) => (
            <div className="timeline-row" key={track}>
              <span>{track}</span>
              <article className="timeline-card" style={{ '--card-left': `${12 + index * 14}%`, '--card-width': `${34 + index * 4}%` }}>
                <strong>{index === 0 ? '核心危机显现' : index === 1 ? '人物关系转折' : '伏笔压力上升'}</strong>
                <p>{track}在当前章节段落中的关键变化，后续正式版可从卡片详情继续细化单场内容。</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <aside className="workspace-detail">
        <h2>当前节点</h2>
        <div id="detailPanel">
          <p className="detail-kicker">矩阵时序</p>
          <h3>从结构进入创作</h3>
          <p>线性项目打开后先看全局时序和并行人物线，比强制进入世界观更接近续写和审稿习惯。</p>
        </div>
      </aside>
    </section>
  )
}

function BranchTreeView() {
  return (
    <section className="workspace-grid">
      <aside className="workspace-sidebar">
        <h2>评审路径</h2>
        <ol>
          <li>世界观</li>
          <li>分支树总览</li>
          <li>筛选单分支</li>
        </ol>
      </aside>

      <section className="workspace-canvas" aria-live="polite">
        <div className="canvas-toolbar">
          <span>分支结构</span>
          <strong>主线 + 3 条结局线路</strong>
        </div>
        <div className="branch-board">
          <div className="branch-node start">共同开端</div>
          <div className="branch-node choice">关键选择</div>
          <div className="ending-column">
            <div className="branch-node good">好结局</div>
            <div className="branch-node neutral">中立结局</div>
            <div className="branch-node hidden">隐藏结局</div>
          </div>
        </div>
      </section>

      <aside className="workspace-detail">
        <h2>当前节点</h2>
        <div id="detailPanel">
          <p className="detail-kicker">分支树</p>
          <h3>先确认顶层结构</h3>
          <p>多分支项目打开后先看分叉、结局和体量均衡，后续正式版再按单分支展开时序细化。</p>
        </div>
      </aside>
    </section>
  )
}

function getAllowedViews(project) {
  return project.type === 'branching'
    ? ['worldview', 'branch-tree']
    : ['worldview', 'timeline']
}

function normalizeView(project, view) {
  const allowedViews = getAllowedViews(project)
  return allowedViews.includes(view) ? view : getDefaultProjectView(project)
}

function formatSavedTime(date) {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function loadWorldviewDraft(project) {
  const rawDraft = localStorage.getItem(`jugo-project-draft-${project.id}`)
  if (rawDraft) {
    try {
      const parsed = JSON.parse(rawDraft)
      if (parsed.worldview?.nodes?.length && parsed.worldview?.edges?.length) {
        return normalizeWorldviewDraft(project, parsed.worldview)
      }
    } catch {
      localStorage.removeItem(`jugo-project-draft-${project.id}`)
    }
  }

  return normalizeWorldviewDraft(project, {
    activeSection: 'mindmap',
    nodes: createInitialNodes(project),
    edges: createInitialEdges(),
    selectedNodeId: 'root',
    archivedEntries: []
  })
}

function normalizeWorldviewDraft(project, draft) {
  const sourceNodes = draft.nodes?.length ? draft.nodes : createInitialNodes(project)
  const sourceEdges = draft.edges?.length ? draft.edges : createInitialEdges()
  const parentByEdge = new Map()

  sourceEdges.forEach((edge) => {
    if (edge.target && edge.source && !parentByEdge.has(edge.target)) {
      parentByEdge.set(edge.target, edge.source)
    }
  })

  const nodes = sourceNodes.map((node) => normalizeWorldviewNode(node, parentByEdge))
  const nodeIds = new Set(nodes.map((node) => node.id))
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const edges = sourceEdges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => normalizeWorldviewEdge(edge, nodesById))

  return {
    ...draft,
    activeSection: draft.activeSection || 'mindmap',
    nodes,
    edges,
    selectedNodeId: nodeIds.has(draft.selectedNodeId) ? draft.selectedNodeId : 'root',
    archivedEntries: draft.archivedEntries || []
  }
}

function normalizeWorldviewNode(node, parentByEdge) {
  const data = node.data || {}
  const type = node.type || (data.nodeType === 'note' ? 'noteNode' : 'worldNode')
  const nodeType = data.nodeType || (type === 'noteNode' ? 'note' : 'custom')
  const syncScope = type === 'noteNode' || nodeType === 'note' ? 'canvas-note' : 'knowledge-entry'
  const inferredParentId = node.id === 'root'
    ? null
    : data.parentId || inferCatalogParentId(node.id) || parentByEdge.get(node.id) || 'root'

  return {
    ...node,
    type,
    deletable: data.locked ? false : node.deletable,
    data: {
      ...data,
      title: data.title || data.text || '未命名节点',
      nodeType,
      summary: data.summary || data.note || '暂无摘要',
      syncStatus: data.syncStatus || (syncScope === 'canvas-note' ? 'notSynced' : 'pending'),
      locked: Boolean(data.locked),
      count: Number(data.count || 0),
      icon: data.icon || (syncScope === 'canvas-note' ? '!' : '+'),
      parentId: inferredParentId,
      depth: Number.isFinite(Number(data.depth)) ? Number(data.depth) : inferNodeDepth(node.id, inferredParentId),
      expanded: data.expanded !== false,
      tags: Array.isArray(data.tags) && data.tags.length ? data.tags : getDefaultNodeTags(nodeType),
      knowledgeEntryId: syncScope === 'knowledge-entry' ? data.knowledgeEntryId || `entry-${node.id}` : data.knowledgeEntryId || null,
      syncScope,
      syncDirection: syncScope === 'knowledge-entry' ? data.syncDirection || 'map-to-knowledge' : 'none',
      syncFields: syncScope === 'knowledge-entry' ? data.syncFields || defaultKnowledgeSyncFields : [],
      syncVersion: Number(data.syncVersion || 0),
      sourceBinding: syncScope === 'knowledge-entry' ? data.sourceBinding || 'bound' : 'canvas-only',
      lastSyncedAt: data.lastSyncedAt || null
    }
  }
}

function normalizeWorldviewEdge(edge, nodesById) {
  const sourceNode = nodesById.get(edge.source)
  const targetNode = nodesById.get(edge.target)
  const handles = edge.sourceHandle && edge.targetHandle
    ? {}
    : getHorizontalHandles(sourceNode, targetNode)

  return {
    ...edge,
    ...handles,
    type: edge.type || 'smoothstep'
  }
}

function createInitialNodes(project) {
  const worldName = project.worldName || project.name
  const nodes = [
    {
      id: 'root',
      type: 'worldNode',
      position: { x: 520, y: 300 },
      deletable: false,
      data: {
        title: worldName,
        nodeType: 'world-root',
        summary: '项目世界观根节点，保存时向百科仓库同步全部系统条目。',
        syncStatus: 'synced',
        locked: true,
        count: systemCatalog.length,
        icon: 'J',
        parentId: null,
        depth: 0,
        expanded: true,
        tags: ['世界观根节点'],
        knowledgeEntryId: 'entry-root',
        syncScope: 'knowledge-entry',
        syncDirection: 'map-to-knowledge',
        syncFields: defaultKnowledgeSyncFields,
        syncVersion: 0,
        sourceBinding: 'bound',
        lastSyncedAt: null
      }
    }
  ]

  systemCatalog.forEach((group) => {
    const x = group.side === 'left' ? 120 : 920
    nodes.push({
      id: group.id,
      type: 'worldNode',
      position: { x, y: group.y },
      deletable: false,
      data: {
        title: group.title,
        nodeType: 'system',
        summary: `${group.title}用于承载${group.modules.join('、')}等百科条目。`,
        syncStatus: group.id === 'overview' ? 'issue' : 'pending',
        locked: true,
        count: group.modules.length,
        icon: group.icon,
        parentId: 'root',
        depth: 1,
        expanded: true,
        tags: ['系统目录', group.title],
        knowledgeEntryId: `entry-${group.id}`,
        syncScope: 'knowledge-entry',
        syncDirection: 'map-to-knowledge',
        syncFields: defaultKnowledgeSyncFields,
        syncVersion: 0,
        sourceBinding: 'bound',
        lastSyncedAt: null
      }
    })

    group.modules.forEach((moduleTitle, index) => {
      nodes.push({
        id: `${group.id}-${index}`,
        type: 'worldNode',
        position: {
          x: group.side === 'left' ? x - 280 : x + 280,
          y: group.y + index * 78 - 28
        },
        deletable: false,
        data: {
          title: moduleTitle,
          nodeType: 'module',
          summary: `${moduleTitle}由思维导图节点同步生成，可在百科仓库补充结构化字段。`,
          syncStatus: 'pending',
          locked: true,
          count: 0,
          icon: group.icon,
          parentId: group.id,
          depth: 2,
          expanded: true,
          tags: [group.title, '百科模块'],
          knowledgeEntryId: `entry-${group.id}-${index}`,
          syncScope: 'knowledge-entry',
          syncDirection: 'map-to-knowledge',
          syncFields: defaultKnowledgeSyncFields,
          syncVersion: 0,
          sourceBinding: 'bound',
          lastSyncedAt: null
        }
      })
    })
  })

  return nodes
}

function createInitialEdges() {
  const edges = []
  systemCatalog.forEach((group) => {
    edges.push({
      id: `root-${group.id}`,
      source: 'root',
      target: group.id,
      sourceHandle: group.side === 'left' ? 'left' : 'right',
      targetHandle: group.side === 'left' ? 'right' : 'left',
      type: 'smoothstep',
      animated: group.id === 'overview'
    })

    group.modules.forEach((_, index) => {
      edges.push({
        id: `${group.id}-${group.id}-${index}`,
        source: group.id,
        target: `${group.id}-${index}`,
        sourceHandle: group.side === 'left' ? 'left' : 'right',
        targetHandle: group.side === 'left' ? 'right' : 'left',
        type: 'smoothstep'
      })
    })
  })
  return edges
}

function getAttachableParent(selectedNode, nodes) {
  if (!selectedNode || selectedNode.type === 'noteNode') {
    return nodes.find((node) => node.id === selectedNode?.data.parentId) || nodes.find((node) => node.id === 'root') || nodes[0]
  }
  return selectedNode
}

function hasNodeChildren(nodes, nodeId) {
  return nodes.some((node) => node.data?.parentId === nodeId)
}

function countDirectChildren(nodes, nodeId) {
  return nodes.filter((node) => node.data?.parentId === nodeId).length
}

function getDescendantIds(nodes, nodeId) {
  const childMap = createChildMap(nodes)
  const descendantIds = []

  function collect(currentId) {
    ;(childMap.get(currentId) || []).forEach((child) => {
      descendantIds.push(child.id)
      collect(child.id)
    })
  }

  collect(nodeId)
  return descendantIds
}

function countDescendants(nodes, nodeId) {
  return getDescendantIds(nodes, nodeId).length
}

function getCollapsedNodeIds(nodes) {
  const childMap = createChildMap(nodes)
  const hiddenIds = new Set()

  function hideChildren(nodeId) {
    ;(childMap.get(nodeId) || []).forEach((child) => {
      hiddenIds.add(child.id)
      hideChildren(child.id)
    })
  }

  nodes.forEach((node) => {
    if (node.data?.expanded === false) {
      hideChildren(node.id)
    }
  })

  return hiddenIds
}

function createChildMap(nodes) {
  const childMap = new Map()
  nodes.forEach((node) => {
    const parentId = node.data?.parentId
    if (!parentId) return
    if (!childMap.has(parentId)) {
      childMap.set(parentId, [])
    }
    childMap.get(parentId).push(node)
  })
  return childMap
}

function getHorizontalHandles(sourceNode, targetNode) {
  const targetIsRight = (targetNode?.position?.x || 0) >= (sourceNode?.position?.x || 0)
  return {
    sourceHandle: targetIsRight ? 'right' : 'left',
    targetHandle: targetIsRight ? 'left' : 'right'
  }
}

function inferCatalogParentId(nodeId) {
  if (systemCatalog.some((group) => group.id === nodeId)) {
    return 'root'
  }

  const group = systemCatalog.find((item) => nodeId.startsWith(`${item.id}-`))
  return group?.id || null
}

function inferNodeDepth(nodeId, parentId) {
  if (nodeId === 'root') return 0
  if (parentId === 'root') return 1
  if (parentId) return 2
  return 0
}

function getDefaultNodeTags(nodeType) {
  const tagsByType = {
    'world-root': ['世界观根节点'],
    system: ['系统目录'],
    module: ['百科模块'],
    custom: ['自增设定'],
    note: ['画布便签']
  }
  return tagsByType[nodeType] || ['世界观节点']
}

function getSyncableNodes(nodes) {
  return nodes.filter(isKnowledgeSyncNode)
}

function isKnowledgeSyncNode(node) {
  return node.type !== 'noteNode' && node.data?.syncScope !== 'canvas-note'
}

function markWorldviewSynced(draft, savedAt) {
  const savedAtIso = savedAt.toISOString()
  return {
    ...draft,
    nodes: draft.nodes.map((node) => {
      if (!isKnowledgeSyncNode(node)) {
        return node
      }

      return {
        ...node,
        data: {
          ...node.data,
          knowledgeEntryId: node.data.knowledgeEntryId || `entry-${node.id}`,
          syncScope: 'knowledge-entry',
          syncDirection: node.data.syncDirection || 'map-to-knowledge',
          syncFields: node.data.syncFields || defaultKnowledgeSyncFields,
          syncVersion: Number(node.data.syncVersion || 0) + 1,
          sourceBinding: node.data.sourceBinding || 'bound',
          lastSyncedAt: savedAtIso,
          syncStatus: node.data.syncStatus === 'issue' ? 'issue' : 'synced'
        }
      }
    })
  }
}

function createKnowledgeEntries(nodes) {
  return nodes
    .filter(isKnowledgeSyncNode)
    .map((node) => ({
      id: node.data.knowledgeEntryId || `entry-${node.id}`,
      title: node.data.title,
      category: getKnowledgeCategory(node.data.nodeType),
      summary: node.data.summary,
      tags: node.data.tags || [],
      sourceNodeId: node.id,
      sourceBinding: node.data.sourceBinding || 'bound',
      syncFields: node.data.syncFields || defaultKnowledgeSyncFields,
      syncDirection: node.data.syncDirection || 'map-to-knowledge',
      syncStatus: node.data.syncStatus,
      syncLabel: getSyncLabel(node.data.syncStatus),
      syncVersion: Number(node.data.syncVersion || 0),
      lastSyncedAt: node.data.lastSyncedAt,
      lockedSource: Boolean(node.data.locked)
    }))
}

function getKnowledgeCategory(nodeType) {
  const categoryMap = {
    system: '系统目录',
    module: '百科模块',
    custom: '自增条目',
    'world-root': '世界观根节点'
  }
  return categoryMap[nodeType] || '百科条目'
}

function getNodeKindLabel(node) {
  if (node.type === 'noteNode') return '画布便签'
  return node.data.locked ? '固定业务节点' : '用户自增节点'
}

function getSyncLabel(status) {
  const labels = {
    synced: '已同步',
    pending: '待补全',
    issue: '需校验',
    suggested: 'AI 建议',
    notSynced: '仅画布'
  }
  return labels[status] || '待同步'
}
