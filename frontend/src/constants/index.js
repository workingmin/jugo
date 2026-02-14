// Application constants - 应用常量

// Work types - 作品类型
export const WORK_TYPES = {
  NOVEL: 'novel',
  SCREENPLAY: 'screenplay',
};

// Work status - 作品状态
export const WORK_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
};

// Genre tags - 题材标签
export const GENRE_TAGS = {
  NOVEL: [
    '都市', '玄幻', '言情', '武侠', '科幻',
    '历史', '军事', '悬疑', '灵异', '游戏',
  ],
  SCREENPLAY: [
    '短剧', '电影', '话剧', '网剧', '微电影',
    '情景剧', '舞台剧', '音乐剧',
  ],
};

// Style tags - 风格标签
export const STYLE_TAGS = [
  '轻松', '热血', '悬疑', '治愈', '搞笑',
  '虐心', '甜宠', '爽文', '黑暗', '励志',
];

// Export formats - 导出格式
export const EXPORT_FORMATS = {
  TXT: { value: 'txt', label: 'TXT文本', icon: '📄' },
  DOCX: { value: 'docx', label: 'Word文档', icon: '📝' },
  PDF: { value: 'pdf', label: 'PDF文档', icon: '📕' },
  EPUB: { value: 'epub', label: 'EPUB电子书', icon: '📚' },
};

// AI functions - AI功能
export const AI_FUNCTIONS = {
  CONTINUE: { key: 'continue', label: '续写', icon: '✍️' },
  POLISH: { key: 'polish', label: '润色', icon: '✨' },
  EXPAND: { key: 'expand', label: '扩写', icon: '📝' },
  REWRITE: { key: 'rewrite', label: '改写', icon: '🔄' },
  OUTLINE: { key: 'outline', label: '大纲生成', icon: '📋' },
  CONVERT: { key: 'convert', label: '格式转换', icon: '🔀' },
};

// Auto-save interval - 自动保存间隔 (毫秒)
export const AUTO_SAVE_INTERVAL = 30000; // 30秒

// Navigation menu items - 导航菜单项
export const NAV_MENU_ITEMS = [
  {
    key: 'works',
    label: '我的作品',
    icon: '📚',
    path: '/works',
  },
  {
    key: 'divider1',
    type: 'divider',
  },
  {
    key: 'novel',
    label: '小说创作',
    icon: '📖',
    path: '/editor/novel',
  },
  {
    key: 'screenplay',
    label: '剧本创作',
    icon: '🎬',
    path: '/editor/screenplay',
  },
  {
    key: 'divider2',
    type: 'divider',
  },
  {
    key: 'tutorial',
    label: '使用教程',
    icon: '📘',
    path: '/tutorial',
  },
  {
    key: 'profile',
    label: '个人中心',
    icon: '👤',
    path: '/profile',
  },
  {
    key: 'about',
    label: '关于我们',
    icon: 'ℹ️',
    path: '/about',
  },
];

// Screenplay format templates - 剧本格式模板
export const SCREENPLAY_TEMPLATES = {
  SCENE: '场景{number}：[地点]-[时间]-[内/外景]',
  CHARACTER: '角色：[角色名]',
  DIALOGUE: '台词：[内容]',
  ACTION: '动作：[描述]',
  NARRATION: '旁白：[内容]',
  SHOT: '[镜头：[景别]，[描述]]',
};

// Snowflake method steps - 雪花写作法步骤
export const SNOWFLAKE_STEPS = [
  {
    step: 1,
    title: '核心概括',
    description: '用一句话概括你的故事',
    placeholder: '例如：一个程序员通过AI创作平台实现了作家梦想',
  },
  {
    step: 2,
    title: '扩展大纲',
    description: '将故事扩展为三幕结构',
    placeholder: '第一幕：起因\n第二幕：发展\n第三幕：结局',
  },
  {
    step: 3,
    title: '角色设定',
    description: '创建主要角色卡片',
    placeholder: '角色名、性格、背景、目标、冲突',
  },
  {
    step: 4,
    title: '正文创作',
    description: '开始详细创作',
    placeholder: '基于大纲和角色设定开始写作',
  },
];

// Member levels - 会员等级
export const MEMBER_LEVELS = {
  FREE: { key: 'free', label: '免费用户', color: '#9CA3AF' },
  MONTHLY: { key: 'monthly', label: '月度会员', color: '#10B981' },
  YEARLY: { key: 'yearly', label: '年度会员', color: '#F59E0B' },
  LIFETIME: { key: 'lifetime', label: '终身会员', color: '#1E40AF' },
};
