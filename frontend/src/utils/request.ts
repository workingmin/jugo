/**
 * HTTP请求封装
 * 基于axios，包含拦截器、错误处理、token管理
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants'
import { getToken, removeToken } from './storage'

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求ID（用于追踪）
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 统一响应格式处理
    if (data.code === 200 || data.code === 201) {
      return data
    }

    // 处理业务错误
    const error = new Error(data.message || '请求失败')
    return Promise.reject(error)
  },
  (error: AxiosError) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response as AxiosResponse<any>

      switch (status) {
        case 401:
          // 未授权，清除token并跳转登录
          removeToken()
          window.location.href = '/login'
          return Promise.reject(new Error('登录已过期，请重新登录'))

        case 403:
          return Promise.reject(new Error('没有权限访问'))

        case 404:
          return Promise.reject(new Error('请求的资源不存在'))

        case 429:
          return Promise.reject(new Error('请求过于频繁，请稍后再试'))

        case 500:
          return Promise.reject(new Error('服务器错误，请稍后再试'))

        case 503:
          return Promise.reject(new Error('服务暂时不可用'))

        default:
          return Promise.reject(new Error(data?.message || '请求失败'))
      }
    }

    // 网络错误
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('网络连接失败，请检查网络'))
    }

    // 超时错误
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请稍后再试'))
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config)
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.patch(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config)
  },
}

export default http
