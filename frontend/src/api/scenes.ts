import http from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type {
  Scene,
  CreateSceneRequest,
  UpdateSceneRequest
} from '@/types/screenplay'

/**
 * 获取作品的所有场景
 */
export const getScenes = async (workId: string): Promise<Scene[]> => {
  const response = await http.get<ApiResponse<Scene[]>>(`/works/${workId}/scenes`)
  return response.data
}

/**
 * 获取单个场景详情
 */
export const getScene = async (workId: string, sceneId: string): Promise<Scene> => {
  const response = await http.get<ApiResponse<Scene>>(`/works/${workId}/scenes/${sceneId}`)
  return response.data
}

/**
 * 创建新场景
 */
export const createScene = async (data: CreateSceneRequest): Promise<Scene> => {
  const response = await http.post<ApiResponse<Scene>>(`/works/${data.workId}/scenes`, data)
  return response.data
}

/**
 * 更新场景
 */
export const updateScene = async (
  workId: string,
  sceneId: string,
  data: UpdateSceneRequest
): Promise<Scene> => {
  const response = await http.put<ApiResponse<Scene>>(
    `/works/${workId}/scenes/${sceneId}`,
    data
  )
  return response.data
}

/**
 * 删除场景
 */
export const deleteScene = async (workId: string, sceneId: string): Promise<void> => {
  await http.delete(`/works/${workId}/scenes/${sceneId}`)
}

/**
 * 批量更新场景顺序
 */
export const reorderScenes = async (
  workId: string,
  orders: Array<{ sceneId: string; order: number }>
): Promise<void> => {
  await http.put(`/works/${workId}/scenes/reorder`, { orders })
}

/**
 * 自动保存场景内容
 */
export const autoSaveScene = async (
  workId: string,
  sceneId: string,
  content: string
): Promise<void> => {
  await http.post(`/works/${workId}/scenes/${sceneId}/autosave`, { content })
}
