export const projects = [
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

export function getProjectById(projectId) {
  return projects.find((project) => project.id === projectId) || projects[0]
}

export function getDefaultProjectView(project) {
  return project.type === 'branching' ? 'branch-tree' : 'timeline'
}

export function getDefaultProjectByType(type) {
  return projects.find((project) => project.type === type) || projects[0]
}
