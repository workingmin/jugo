import http from '@/utils/request'
import type { ApiResponse, PaginationParams, PaginatedResponse } from '@/types/api'
import type {
  Chapter,
  CreateChapterRequest,
  UpdateChapterRequest,
  AIOperationRequest,
  AIOperationResponse
} from '@/types/editor'

/**
 * 获取作品的所有章节
 */
export const getChapters = async (workId: string): Promise<Chapter[]> => {
  const response = await http.get<ApiResponse<Chapter[]>>(`/works/${workId}/chapters`)
  return response.data
}

/**
 * 获取单个章节详情
 */
export const getChapter = async (workId: string, chapterId: string): Promise<Chapter> => {
  const response = await http.get<ApiResponse<Chapter>>(`/works/${workId}/chapters/${chapterId}`)
  return response.data
}

/**
 * 创建新章节
 */
export const createChapter = async (data: CreateChapterRequest): Promise<Chapter> => {
  const response = await http.post<ApiResponse<Chapter>>(`/works/${data.workId}/chapters`, data)
  return response.data
}

/**
 * 更新章节
 */
export const updateChapter = async (
  workId: string,
  chapterId: string,
  data: UpdateChapterRequest
): Promise<Chapter> => {
  const response = await http.put<ApiResponse<Chapter>>(
    `/works/${workId}/chapters/${chapterId}`,
    data
  )
  return response.data
}

/**
 * 删除章节
 */
export const deleteChapter = async (workId: string, chapterId: string): Promise<void> => {
  await http.delete(`/works/${workId}/chapters/${chapterId}`)
}

/**
 * 批量更新章节顺序
 */
export const reorderChapters = async (
  workId: string,
  orders: Array<{ chapterId: string; order: number }>
): Promise<void> => {
  await http.put(`/works/${workId}/chapters/reorder`, { orders })
}

/**
 * 自动保存章节内容
 */
export const autoSaveChapter = async (
  workId: string,
  chapterId: string,
  content: string
): Promise<void> => {
  await http.post(`/works/${workId}/chapters/${chapterId}/autosave`, { content })
}

/**
 * AI 续写
 */
export const aiContinue = async (data: AIOperationRequest): Promise<AIOperationResponse> => {
  const response = await http.post<ApiResponse<AIOperationResponse>>(
    `/ai/continue`,
    data
  )
  return response.data
}

/**
 * AI 改写
 */
export const aiRewrite = async (data: AIOperationRequest): Promise<AIOperationResponse> => {
  const response = await http.post<ApiResponse<AIOperationResponse>>(
    `/ai/rewrite`,
    data
  )
  return response.data
}

/**
 * AI 扩写
 */
export const aiExpand = async (data: AIOperationRequest): Promise<AIOperationResponse> => {
  const response = await http.post<ApiResponse<AIOperationResponse>>(
    `/ai/expand`,
    data
  )
  return response.data
}

/**
 * AI 润色
 */
export const aiPolish = async (data: AIOperationRequest): Promise<AIOperationResponse> => {
  const response = await http.post<ApiResponse<AIOperationResponse>>(
    `/ai/polish`,
    data
  )
  return response.data
}
