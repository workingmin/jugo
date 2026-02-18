import http from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type {
  Character,
  CreateCharacterRequest,
  UpdateCharacterRequest
} from '@/types/screenplay'

/**
 * 获取作品的所有角色
 */
export const getCharacters = async (workId: string): Promise<Character[]> => {
  const response = await http.get<ApiResponse<Character[]>>(`/works/${workId}/characters`)
  return response.data
}

/**
 * 获取单个角色详情
 */
export const getCharacter = async (workId: string, characterId: string): Promise<Character> => {
  const response = await http.get<ApiResponse<Character>>(
    `/works/${workId}/characters/${characterId}`
  )
  return response.data
}

/**
 * 创建新角色
 */
export const createCharacter = async (data: CreateCharacterRequest): Promise<Character> => {
  const response = await http.post<ApiResponse<Character>>(
    `/works/${data.workId}/characters`,
    data
  )
  return response.data
}

/**
 * 更新角色
 */
export const updateCharacter = async (
  workId: string,
  characterId: string,
  data: UpdateCharacterRequest
): Promise<Character> => {
  const response = await http.put<ApiResponse<Character>>(
    `/works/${workId}/characters/${characterId}`,
    data
  )
  return response.data
}

/**
 * 删除角色
 */
export const deleteCharacter = async (workId: string, characterId: string): Promise<void> => {
  await http.delete(`/works/${workId}/characters/${characterId}`)
}

/**
 * 获取角色出场统计
 */
export const getCharacterAppearances = async (
  workId: string,
  characterId: string
): Promise<{ sceneIds: string[]; count: number }> => {
  const response = await http.get<ApiResponse<{ sceneIds: string[]; count: number }>>(
    `/works/${workId}/characters/${characterId}/appearances`
  )
  return response.data
}
