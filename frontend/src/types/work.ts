/**
 * 作品相关类型定义
 */

// 作品类型
export type WorkType = 'novel' | 'screenplay'

// 作品状态
export type WorkStatus = 'draft' | 'completed' | 'published'

// 作品信息
export interface Work {
  workId: string
  userId: string
  type: WorkType
  title: string
  topic?: string
  genre: string
  status: WorkStatus
  words: number
  numChapters?: number
  wordPerChapter?: number
  numScenes?: number
  targetDuration?: number
  coverImage?: string
  createdAt: string
  updatedAt: string
  metadata?: WorkMetadata
}

// 作品元数据
export interface WorkMetadata {
  snowflake?: {
    step1?: string
    step2?: string
    step3?: any[]
  }
  [key: string]: any
}

// 创建作品请求
export interface CreateWorkRequest {
  type: WorkType
  title: string
  topic?: string
  genre: string
  numChapters?: number
  wordPerChapter?: number
  numScenes?: number
  targetDuration?: number
}

// 更新作品请求
export interface UpdateWorkRequest {
  title?: string
  topic?: string
  genre?: string
  status?: WorkStatus
  coverImage?: string
}

// 作品列表查询参数
export interface WorksQueryParams {
  type?: WorkType | 'all'
  status?: WorkStatus | 'all'
  page?: number
  limit?: number
  sort?: 'updatedAt' | 'createdAt' | 'words' | 'title'
  search?: string
}

// 作品列表响应
export interface WorksListResponse {
  works: Work[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
