/**
 * 格式化工具函数
 */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format)
}

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow()
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 格式化数字（添加千分位）
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化字数统计
 */
export const formatWordCount = (count: number): string => {
  if (count < 10000) {
    return `${count}字`
  }
  return `${(count / 10000).toFixed(1)}万字`
}

/**
 * 格式化时长（分钟）
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

/**
 * 截断文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * 移除HTML标签
 */
export const stripHtmlTags = (html: string): string => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

/**
 * 计算文本字数（去除HTML标签）
 */
export const countWords = (html: string): number => {
  const text = stripHtmlTags(html)
  return text.replace(/\s/g, '').length
}

/**
 * 估算阅读时长（分钟）
 */
export const estimateReadingTime = (wordCount: number, wordsPerMinute = 300): number => {
  return Math.ceil(wordCount / wordsPerMinute)
}

export default {
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatNumber,
  formatWordCount,
  formatDuration,
  truncateText,
  stripHtmlTags,
  countWords,
  estimateReadingTime,
}
