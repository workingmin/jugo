/**
 * 主题色彩系统配置
 * 基于JUGO前端设计方案稿
 */

export const theme = {
  // 主色调
  colors: {
    primary: '#1E40AF', // 墨蓝色

    // 功能色
    success: '#10B981', // 绿色 - 确认、生成、保存
    warning: '#F59E0B', // 橙色 - 提示、引导、AI功能
    error: '#EF4444',   // 红色 - 删除、取消

    // 中性色
    white: '#FFFFFF',
    bgLight: '#F3F4F6',  // 页面背景
    textPrimary: '#1F2937', // 正文文字
    textSecondary: '#9CA3AF', // 辅助文字
    border: '#D1D5DB',   // 边框
  },

  // 字体
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif',
    screenplay: '"Courier New", Courier, monospace', // 剧本专用等宽字体
  },

  // 字体大小
  fontSizes: {
    pageTitle: '20px',
    sectionTitle: '16px',
    body: '14px',
    caption: '12px',
  },

  // 行高
  lineHeights: {
    novel: 1.8,
    screenplay: 1.6,
    normal: 1.5,
  },

  // 圆角
  borderRadius: {
    small: '2px',
    medium: '4px',
    large: '8px',
  },

  // 阴影
  shadows: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    modal: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },

  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // 布局
  layout: {
    sidebarWidth: '240px',
    headerHeight: '64px',
    footerHeight: '48px',
  },

  // 响应式断点
  breakpoints: {
    mobile: '767px',
    tablet: '768px',
    desktop: '1200px',
  },
}

// Ant Design主题配置
export const antdTheme = {
  token: {
    colorPrimary: theme.colors.primary,
    colorSuccess: theme.colors.success,
    colorWarning: theme.colors.warning,
    colorError: theme.colors.error,
    borderRadius: 4,
    fontFamily: theme.fonts.primary,
  },
}

export default theme
