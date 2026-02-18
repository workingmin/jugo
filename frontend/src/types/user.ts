/**
 * 用户相关类型定义
 */

// 用户信息
export interface User {
  userId: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  stats?: UserStats
}

// 用户统计信息
export interface UserStats {
  totalWorks: number
  totalWords: number
  totalChapters: number
}

// 登录请求
export interface LoginRequest {
  email: string
  password: string
}

// 登录响应
export interface LoginResponse {
  userId: string
  email: string
  username: string
  token: string
  refreshToken: string
  expiresIn: number
}

// 注册请求
export interface RegisterRequest {
  email: string
  username: string
  password: string
}

// 注册响应
export interface RegisterResponse {
  userId: string
  email: string
  username: string
  token: string
  refreshToken: string
}

// 刷新Token请求
export interface RefreshTokenRequest {
  refreshToken: string
}

// 刷新Token响应
export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

// 更新用户信息请求
export interface UpdateUserRequest {
  username?: string
  avatar?: string
}

// 修改密码请求
export interface UpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}
