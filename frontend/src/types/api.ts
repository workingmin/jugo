/**
 * API响应类型定义
 */

// 统一API响应格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应
export interface PaginationResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 错误响应
export interface ApiError {
  code: number
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}
