/**
 * 章节状态
 */
export type ChapterStatus = 'draft' | 'writing' | 'completed'

/**
 * 章节接口
 */
export interface Chapter {
  chapterId: string
  workId: string
  title: string
  content: string
  order: number
  words: number
  status: ChapterStatus
  createdAt: string
  updatedAt: string
}

/**
 * 章节树节点（用于左侧章节管理）
 */
export interface ChapterTreeNode {
  key: string
  title: string
  chapterId: string
  words: number
  status: ChapterStatus
  children?: ChapterTreeNode[]
}

/**
 * AI 操作类型
 */
export type AIOperationType = 'continue' | 'rewrite' | 'expand' | 'polish'

/**
 * AI 设置接口
 */
export interface AISettings {
  model: string // AI 模型选择
  temperature: number // 创作温度 0-1
  maxTokens: number // 最大生成长度
  style: string // 写作风格
  tone: string // 语气
}

/**
 * AI 操作请求
 */
export interface AIOperationRequest {
  workId: string
  chapterId: string
  operation: AIOperationType
  selectedText?: string // 选中的文本（用于改写、扩写）
  context?: string // 上下文
  settings: AISettings
}

/**
 * AI 操作响应
 */
export interface AIOperationResponse {
  result: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * 编辑器状态
 */
export interface EditorState {
  currentWorkId: string | null
  currentChapterId: string | null
  chapters: Chapter[]
  currentChapter: Chapter | null
  isLoading: boolean
  isSaving: boolean
  lastSavedAt: string | null
  hasUnsavedChanges: boolean
}

/**
 * 问题检测类型
 */
export type IssueType = 'typo' | 'grammar' | 'logic' | 'style' | 'consistency'

/**
 * 问题检测结果
 */
export interface Issue {
  id: string
  type: IssueType
  severity: 'low' | 'medium' | 'high'
  message: string
  position: {
    start: number
    end: number
  }
  suggestion?: string
}

/**
 * 编辑器配置
 */
export interface EditorConfig {
  autoSaveInterval: number // 自动保存间隔（毫秒）
  fontSize: number // 字体大小
  lineHeight: number // 行高
  theme: 'light' | 'dark' // 主题
  showWordCount: boolean // 显示字数统计
  showPreview: boolean // 显示预览面板
}

/**
 * 章节创建请求
 */
export interface CreateChapterRequest {
  workId: string
  title: string
  order?: number
}

/**
 * 章节更新请求
 */
export interface UpdateChapterRequest {
  title?: string
  content?: string
  status?: ChapterStatus
  order?: number
}
