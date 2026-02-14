// 格式化日期
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化数字
export const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 保存到本地存储
export const saveToLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// 从本地存储读取
export const loadFromLocal = (key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}
