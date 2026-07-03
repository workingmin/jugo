export const projects = [
  {
    id: 'linear-aurora',
    name: '极夜航线',
    worldName: '极夜星域',
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
    worldName: '雾城',
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
    worldName: '青铜王庭',
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
    worldName: '夏日终局',
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

const localProjectsStorageKey = 'jugo-projects'

export function getProjectById(projectId) {
  return getLocalProjects().find((project) => project.id === projectId) || projects.find((project) => project.id === projectId) || projects[0]
}

export function getDefaultProjectView(project) {
  return project.type === 'branching' ? 'branch-tree' : 'timeline'
}

export function getDefaultProjectByType(type) {
  return projects.find((project) => project.type === type) || projects[0]
}

export function saveLocalProject(project) {
  const localProjects = getLocalProjects().filter((item) => item.id !== project.id)
  localStorage.setItem(localProjectsStorageKey, JSON.stringify([
    normalizeProject(project),
    ...localProjects
  ]))
}

function getLocalProjects() {
  if (typeof localStorage === 'undefined') return []

  try {
    const parsedProjects = JSON.parse(localStorage.getItem(localProjectsStorageKey) || '[]')
    return Array.isArray(parsedProjects)
      ? parsedProjects.map(normalizeProject).filter((project) => project.id && project.name)
      : []
  } catch {
    localStorage.removeItem(localProjectsStorageKey)
    return []
  }
}

function normalizeProject(project) {
  const type = project.type === 'branching' || project.templateType === 'branching' ? 'branching' : 'linear'
  const name = String(project.name || project.projectName || '').trim()
  const worldName = String(project.worldName || name).trim()

  return {
    id: String(project.id || ''),
    name,
    worldName,
    type,
    typeLabel: type === 'branching' ? '多分支多结局' : '线性单结局',
    owner: project.owner || '本地演示',
    updatedAt: project.updatedAt || formatLocalProjectTime(new Date()),
    stage: type === 'branching' ? '分支树评审' : '矩阵时序评审',
    tags: Array.isArray(project.tags) && project.tags.length
      ? project.tags
      : type === 'branching'
        ? ['互动小说', '多结局', '本地演示']
        : ['小说剧本', '线性结构', '本地演示'],
    summary: project.summary || `${worldName} 已初始化世界观主画布和 ${type === 'branching' ? '分支树' : '矩阵时序'} 工作区。`,
    health: project.health || '0 个待处理问题',
    tracks: Array.isArray(project.tracks) && project.tracks.length
      ? project.tracks
      : type === 'branching'
        ? ['主线', '关键选择', '结局线']
        : ['主线', '人物线', '反派线']
  }
}

function formatLocalProjectTime(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
