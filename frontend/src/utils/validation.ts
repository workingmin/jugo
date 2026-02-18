/**
 * 表单验证工具
 */

/**
 * 验证邮箱
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证密码强度
 * 至少8位，包含大小写字母和数字
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * 验证用户名
 * 3-20位，只能包含字母、数字、下划线
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 验证手机号（中国大陆）
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证数字范围
 */
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * 验证必填项
 */
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

/**
 * 验证字符串长度
 */
export const validateLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length
  return length >= min && length <= max
}

/**
 * 获取密码强度
 * 返回: weak, medium, strong
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak'

  let strength = 0

  // 包含小写字母
  if (/[a-z]/.test(password)) strength++

  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++

  // 包含数字
  if (/\d/.test(password)) strength++

  // 包含特殊字符
  if (/[@$!%*?&]/.test(password)) strength++

  // 长度大于8
  if (password.length >= 8) strength++

  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
}

/**
 * 表单验证规则生成器（用于Ant Design Form）
 */
export const createRules = {
  required: (message = '此项为必填项') => ({
    required: true,
    message,
  }),

  email: (message = '请输入有效的邮箱地址') => ({
    validator: (_: any, value: string) => {
      if (!value || validateEmail(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    },
  }),

  password: (message = '密码至少8位，包含大小写字母和数字') => ({
    validator: (_: any, value: string) => {
      if (!value || validatePassword(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    },
  }),

  username: (message = '用户名3-20位，只能包含字母、数字、下划线') => ({
    validator: (_: any, value: string) => {
      if (!value || validateUsername(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    },
  }),

  phone: (message = '请输入有效的手机号') => ({
    validator: (_: any, value: string) => {
      if (!value || validatePhone(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    },
  }),

  length: (min: number, max: number, message?: string) => ({
    validator: (_: any, value: string) => {
      if (!value || validateLength(value, min, max)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message || `长度应在${min}-${max}之间`))
    },
  }),

  numberRange: (min: number, max: number, message?: string) => ({
    validator: (_: any, value: number) => {
      if (value === undefined || value === null || validateNumberRange(value, min, max)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message || `数值应在${min}-${max}之间`))
    },
  }),
}

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateUrl,
  validateNumberRange,
  validateRequired,
  validateLength,
  getPasswordStrength,
  createRules,
}
