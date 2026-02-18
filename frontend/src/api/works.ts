/**
 * 作品相关API接口
 */

import { http } from '@/utils/request'
import type {
  Work,
  CreateWorkRequest,
  UpdateWorkRequest,
  WorksQueryParams,
  WorksListResponse,
} from '@/types/work'
import type { ApiResponse } from '@/types/api'

/**
 * 获取作品列表
 */
export const getWorks = async (params?: WorksQueryParams): Promise<WorksListResponse> => {
  const response = await http.get<ApiResponse<WorksListResponse>>('/works', {
    params: {
      type: params?.type || 'all',
      status: params?.status || 'all',
      page: params?.page || 1,
      limit: params?.limit || 20,
      sort: params?.sort || 'updatedAt',
      search: params?.search,
    },
  })
  return response.data
}

/**
 * 获取作品详情
 */
export const getWorkDetail = async (workId: string): Promise<Work> => {
  const response = await http.get<ApiResponse<Work>>(`/works/${workId}`)
  return response.data
}

/**
 * 创建作品
 */
export const createWork = async (data: CreateWorkRequest): Promise<Work> => {
  const response = await http.post<ApiResponse<Work>>('/works', data)
  return response.data
}

/**
 * 更新作品信息
 */
export const updateWork = async (workId: string, data: UpdateWorkRequest): Promise<Work> => {
  const response = await http.patch<ApiResponse<Work>>(`/works/${workId}`, data)
  return response.data
}

/**
 * 删除作品
 */
export const deleteWork = async (workId: string): Promise<void> => {
  await http.delete(`/works/${workId}`)
}

export default {
  getWorks,
  getWorkDetail,
  createWork,
  updateWork,
  deleteWork,
}
