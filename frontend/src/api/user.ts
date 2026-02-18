/**
 * 用户相关API接口
 */

import { http } from '@/utils/request'
import type { User, UpdateUserRequest, UpdatePasswordRequest } from '@/types/user'
import type { ApiResponse } from '@/types/api'

/**
 * 获取当前用户信息
 */
export const getUserInfo = async (): Promise<User> => {
  const response = await http.get<ApiResponse<User>>('/users/me')
  return response.data
}

/**
 * 更新用户信息
 */
export const updateUserInfo = async (data: UpdateUserRequest): Promise<User> => {
  const response = await http.patch<ApiResponse<User>>('/users/me', data)
  return response.data
}

/**
 * 修改密码
 */
export const updatePassword = async (data: UpdatePasswordRequest): Promise<void> => {
  await http.patch('/users/me/password', data)
}

/**
 * 上传头像
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await http.post<ApiResponse<{ url: string }>>('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.url
}

export default {
  getUserInfo,
  updateUserInfo,
  updatePassword,
  uploadAvatar,
}
