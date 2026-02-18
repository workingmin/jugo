/**
 * 本地存储封装
 * 支持localStorage和sessionStorage
 */

import { STORAGE_KEYS } from '@/config/constants'

// 存储类型
type StorageType = 'local' | 'session'

/**
 * 获取存储对象
 */
const getStorage = (type: StorageType = 'local'): Storage => {
  return type === 'local' ? localStorage : sessionStorage
}

/**
 * 设置存储项
 */
export const setItem = (key: string, value: any, type: StorageType = 'local'): void => {
  try {
    const storage = getStorage(type)
    const serializedValue = JSON.stringify(value)
    storage.setItem(key, serializedValue)
  } catch (error) {
    console.error('Storage setItem error:', error)
  }
}

/**
 * 获取存储项
 */
export const getItem = <T = any>(key: string, type: StorageType = 'local'): T | null => {
  try {
    const storage = getStorage(type)
    const item = storage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Storage getItem error:', error)
    return null
  }
}

/**
 * 移除存储项
 */
export const removeItem = (key: string, type: StorageType = 'local'): void => {
  try {
    const storage = getStorage(type)
    storage.removeItem(key)
  } catch (error) {
    console.error('Storage removeItem error:', error)
  }
}

/**
 * 清空存储
 */
export const clear = (type: StorageType = 'local'): void => {
  try {
    const storage = getStorage(type)
    storage.clear()
  } catch (error) {
    console.error('Storage clear error:', error)
  }
}

// Token相关
export const setToken = (token: string): void => {
  setItem(STORAGE_KEYS.TOKEN, token)
}

export const getToken = (): string | null => {
  return getItem<string>(STORAGE_KEYS.TOKEN)
}

export const removeToken = (): void => {
  removeItem(STORAGE_KEYS.TOKEN)
  removeItem(STORAGE_KEYS.REFRESH_TOKEN)
}

// 用户信息相关
export const setUserInfo = (userInfo: any): void => {
  setItem(STORAGE_KEYS.USER_INFO, userInfo)
}

export const getUserInfo = (): any | null => {
  return getItem(STORAGE_KEYS.USER_INFO)
}

export const removeUserInfo = (): void => {
  removeItem(STORAGE_KEYS.USER_INFO)
}

// 编辑器设置相关
export const setEditorSettings = (settings: any): void => {
  setItem(STORAGE_KEYS.EDITOR_SETTINGS, settings)
}

export const getEditorSettings = (): any | null => {
  return getItem(STORAGE_KEYS.EDITOR_SETTINGS)
}

export default {
  setItem,
  getItem,
  removeItem,
  clear,
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  setEditorSettings,
  getEditorSettings,
}
