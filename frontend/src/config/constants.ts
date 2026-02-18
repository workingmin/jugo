/**
 * 全局常量配置
 */

// API相关
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1'
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/v1/ws'
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'JUGO AI写作平台'

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'jugo_token',
  REFRESH_TOKEN: 'jugo_refresh_token',
  USER_INFO: 'jugo_user_info',
  THEME: 'jugo_theme',
  EDITOR_SETTINGS: 'jugo_editor_settings',
}

// 作品类型
export const WORK_TYPES = {
  NOVEL: 'novel',
  SCREENPLAY: 'screenplay',
} as const

// 作品状态
export const WORK_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
} as const

// 题材类型
export const GENRES = [
  '都市',
  '玄幻',
  '武侠',
  '科幻',
  '历史',
  '军事',
  '悬疑',
  '言情',
  '其他',
]

// AI功能类型
export const AI_ACTIONS = {
  CONTINUE: 'continue',      // 续写
  POLISH: 'polish',          // 润色
  EXPAND: 'expand',          // 扩写
  REWRITE: 'rewrite',        // 改写
  OUTLINE: 'outline',        // 大纲生成
  NOVEL_TO_SCREENPLAY: 'novel_to_screenplay', // 小说转剧本
  SCREENPLAY_TO_NOVEL: 'screenplay_to_novel', // 剧本转小说
} as const

// 导出格式
export const EXPORT_FORMATS = {
  DOCX: 'docx',
  PDF: 'pdf',
  TXT: 'txt',
  MARKDOWN: 'md',
} as const

// 自动保存间隔（毫秒）
export const AUTO_SAVE_INTERVAL = 30000 // 30秒

// WebSocket心跳间隔（毫秒）
export const WS_HEARTBEAT_INTERVAL = 30000 // 30秒

// WebSocket重连间隔（毫秒）
export const WS_RECONNECT_INTERVAL = 5000 // 5秒

// 最大重连次数
export const MAX_RECONNECT_ATTEMPTS = 5

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
}

// 文件上传限制
export const UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}

// 编辑器配置
export const EDITOR_CONFIG = {
  MIN_WORDS_PER_CHAPTER: 500,
  MAX_WORDS_PER_CHAPTER: 10000,
  DEFAULT_WORDS_PER_CHAPTER: 1500,
  MIN_CHAPTERS: 1,
  MAX_CHAPTERS: 1000,
}

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  WORKS: '/works',
  NOVEL_EDITOR: '/editor/novel',
  SCREENPLAY_EDITOR: '/editor/screenplay',
  TUTORIAL: '/tutorial',
  PROFILE: '/profile',
  ABOUT: '/about',
}

export default {
  API_BASE_URL,
  WS_URL,
  APP_TITLE,
  STORAGE_KEYS,
  WORK_TYPES,
  WORK_STATUS,
  GENRES,
  AI_ACTIONS,
  EXPORT_FORMATS,
  AUTO_SAVE_INTERVAL,
  WS_HEARTBEAT_INTERVAL,
  WS_RECONNECT_INTERVAL,
  MAX_RECONNECT_ATTEMPTS,
  PAGINATION,
  UPLOAD_LIMITS,
  EDITOR_CONFIG,
  ROUTES,
}
