/**
 * 认证相关API接口
 */

import { http } from '@/utils/request'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/user'
import type { ApiResponse } from '@/types/api'

/**
 * 用户登录
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<ApiResponse<LoginResponse>>('/auth/login', data)
  return response.data
}

/**
 * 用户注册
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await http.post<ApiResponse<RegisterResponse>>('/auth/register', data)
  return response.data
}

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
  await http.post('/auth/logout')
}

/**
 * 刷新Token
 */
export const refreshToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const response = await http.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data)
  return response.data
}

export default {
  login,
  register,
  logout,
  refreshToken,
}
