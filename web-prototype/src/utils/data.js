export const initialAppData = {
  currentUser: {
    name: '创作者',
    avatar: '创',
    memberLevel: '免费用户',
    totalWords: 125000,
    totalWorks: 8,
    totalTime: 45
  },
  works: [
    {
      id: 1,
      title: '都市情感小说',
      type: 'novel',
      genre: '都市情感',
      words: 35000,
      status: 'draft',
      createdAt: '2026-02-08',
      updatedAt: '2026-02-10'
    },
    {
      id: 2,
      title: '悬疑短剧剧本',
      type: 'script',
      genre: '悬疑推理',
      words: 12000,
      status: 'completed',
      createdAt: '2026-02-05',
      updatedAt: '2026-02-09'
    },
    {
      id: 3,
      title: '古装爱情剧本',
      type: 'script',
      genre: '古装爱情',
      words: 28000,
      status: 'draft',
      createdAt: '2026-02-01',
      updatedAt: '2026-02-08'
    }
  ],
  materials: [
    {
      id: 1,
      title: '霸道总裁角色模板',
      type: 'character',
      genre: '都市',
      content: '姓名：陆景琛\\n性格：外冷内热、霸道专情\\n背景：商业帝国继承人...'
    },
    {
      id: 2,
      title: '咖啡厅场景描述',
      type: 'scene',
      genre: '都市',
      content: '午后的阳光透过落地窗洒进咖啡厅...'
    }
  ]
}
