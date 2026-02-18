/**
 * 认证状态管理
 * 使用Zustand + persist中间件
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginRequest, RegisterRequest } from '@/types/user'
import * as authApi from '@/api/auth'
import * as userApi from '@/api/user'
import { setToken, removeToken, setUserInfo, removeUserInfo } from '@/utils/storage'

interface AuthState {
  // 状态
  isLoggedIn: boolean
  user: User | null
  token: string | null
  refreshToken: string | null

  // 方法
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
  fetchUserInfo: () => Promise<void>
  refreshAuthToken: () => Promise<void>
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isLoggedIn: false,
      user: null,
      token: null,
      refreshToken: null,

      // 登录
      login: async (data: LoginRequest) => {
        try {
          const response = await authApi.login(data)

          // 保存token
          setToken(response.token)

          // 更新状态
          set({
            isLoggedIn: true,
            token: response.token,
            refreshToken: response.refreshToken,
            user: {
              userId: response.userId,
              username: response.username,
              email: response.email,
              createdAt: new Date().toISOString(),
            },
          })

          // 保存用户信息到localStorage
          setUserInfo({
            userId: response.userId,
            username: response.username,
            email: response.email,
          })
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      },

      // 注册
      register: async (data: RegisterRequest) => {
        try {
          const response = await authApi.register(data)

          // 保存token
          setToken(response.token)

          // 更新状态
          set({
            isLoggedIn: true,
            token: response.token,
            refreshToken: response.refreshToken,
            user: {
              userId: response.userId,
              username: response.username,
              email: response.email,
              createdAt: new Date().toISOString(),
            },
          })

          // 保存用户信息到localStorage
          setUserInfo({
            userId: response.userId,
            username: response.username,
            email: response.email,
          })
        } catch (error) {
          console.error('Register failed:', error)
          throw error
        }
      },

      // 登出
      logout: async () => {
        try {
          await authApi.logout()
        } catch (error) {
          console.error('Logout API failed:', error)
          // 即使API失败也要清除本地状态
        } finally {
          // 清除token和用户信息
          removeToken()
          removeUserInfo()

          // 清除状态
          set({
            isLoggedIn: false,
            user: null,
            token: null,
            refreshToken: null,
          })
        }
      },

      // 设置用户信息
      setUser: (user: User) => {
        set({ user })
        setUserInfo(user)
      },

      // 获取用户信息
      fetchUserInfo: async () => {
        try {
          const user = await userApi.getUserInfo()
          set({ user })
          setUserInfo(user)
        } catch (error) {
          console.error('Fetch user info failed:', error)
          throw error
        }
      },

      // 刷新Token
      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get()
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await authApi.refreshToken({ refreshToken })

          // 更新token
          setToken(response.token)

          set({
            token: response.token,
            refreshToken: response.refreshToken,
          })
        } catch (error) {
          console.error('Refresh token failed:', error)
          // Token刷新失败，清除认证状态
          get().clearAuth()
          throw error
        }
      },

      // 清除认证状态
      clearAuth: () => {
        removeToken()
        removeUserInfo()
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          refreshToken: null,
        })
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // 只持久化这些字段
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
)

export default useAuthStore
