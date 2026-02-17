// Ant Design theme configuration based on design document
// 基于设计文档的 Ant Design 主题配置

export const themeConfig = {
  token: {
    // Primary color - 主色调：墨蓝色
    colorPrimary: '#1E40AF',

    // Success color - 成功色：绿色
    colorSuccess: '#10B981',

    // Warning color - 警告色：橙色
    colorWarning: '#F59E0B',

    // Error color - 错误色：红色
    colorError: '#EF4444',

    // Background colors - 背景色
    colorBgLayout: '#F3F4F6', // 页面背景
    colorBgContainer: '#FFFFFF', // 容器背景

    // Text colors - 文字颜色
    colorText: '#1F2937', // 正文文字
    colorTextSecondary: '#9CA3AF', // 辅助文字
    colorTextTertiary: '#D1D5DB', // 三级文字

    // Border colors - 边框颜色
    colorBorder: '#D1D5DB',
    colorBorderSecondary: '#E5E7EB',

    // Border radius - 圆角
    borderRadius: 4,
    borderRadiusLG: 8,
    borderRadiusSM: 2,

    // Font family - 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "微软雅黑", "Source Han Sans CN", "思源黑体", sans-serif',

    // Font sizes - 字体大小
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 18,
    fontSizeHeading1: 22,
    fontSizeHeading2: 20,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // Line height - 行高
    lineHeight: 1.6,
    lineHeightLG: 1.8,

    // Spacing - 间距
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,
    paddingSM: 12,
    paddingXS: 8,

    // Component specific
    controlHeight: 40, // 按钮高度
    controlHeightLG: 48,
    controlHeightSM: 32,
  },

  components: {
    // Button component customization
    Button: {
      borderRadius: 4,
      controlHeight: 40,
      controlHeightLG: 48,
    },

    // Input component customization
    Input: {
      borderRadius: 4,
      controlHeight: 40,
    },

    // Card component customization
    Card: {
      borderRadius: 8,
    },

    // Layout component customization
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      bodyBg: '#F3F4F6',
    },

    // Menu component customization
    Menu: {
      itemBg: '#FFFFFF',
      itemSelectedBg: '#EFF6FF',
      itemSelectedColor: '#1E40AF',
      itemHoverBg: '#F3F4F6',
    },
  },
};

// Design system constants - 设计系统常量
export const designTokens = {
  colors: {
    primary: '#1E40AF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    white: '#FFFFFF',
    bgLight: '#F3F4F6',
    bgGray: '#E5E7EB',
    textPrimary: '#1F2937',
    textSecondary: '#9CA3AF',
    textTertiary: '#D1D5DB',
    border: '#D1D5DB',
  },

  layout: {
    sidebarWidth: 240,
    headerHeight: 64,
    settingsPanelWidth: 280,
    previewPanelWidth: 320,
  },

  breakpoints: {
    mobile: 767,
    tablet: 1199,
    desktop: 1200,
  },
};
