# AI小说剧本创作平台 - React版本

基于原型设计的React实现版本，使用Vite作为构建工具。

## 技术栈

- **React 18** - 前端框架
- **React Router 6** - 路由管理
- **Vite 4** - 构建工具
- **原生CSS** - 样式方案

## 项目结构

```
web-prototype/
├── src/
│   ├── components/          # 公共组件
│   │   ├── Header.jsx      # 顶部导航栏
│   │   └── Footer.jsx      # 底部信息栏
│   ├── pages/              # 页面组件
│   │   ├── Home.jsx        # 首页
│   │   ├── Create.jsx      # 创作页
│   │   ├── Works.jsx       # 作品管理页
│   │   ├── Materials.jsx   # 素材库页
│   │   └── Profile.jsx     # 个人中心页
│   ├── styles/             # 样式文件
│   │   ├── common.css      # 通用样式
│   │   ├── home.css        # 首页样式
│   │   ├── create.css      # 创作页样式
│   │   ├── works.css       # 作品管理页样式
│   │   ├── materials.css   # 素材库页样式
│   │   └── profile.css     # 个人中心页样式
│   ├── utils/              # 工具函数
│   │   ├── data.js         # 模拟数据
│   │   ├── helpers.js      # 辅助函数
│   │   └── hooks.js        # 自定义Hooks
│   ├── App.jsx             # 根组件
│   └── main.jsx            # 入口文件
├── old-prototype/          # 原始HTML原型备份
├── index.html              # HTML模板
├── package.json            # 项目配置
└── vite.config.js          # Vite配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 功能特性

### 已实现功能

1. **首页 (Home)**
   - 创作入口（小说/剧本）
   - 新手引导模态框
   - 最近作品展示
   - 核心功能推荐
   - 作品导出进度显示

2. **路由系统**
   - React Router实现页面导航
   - 导航栏激活状态
   - 页面间跳转

3. **公共组件**
   - Header导航栏
   - Footer底部栏
   - 消息提示组件
   - 进度条组件

4. **工具函数**
   - 日期格式化
   - 数字格式化
   - 本地存储操作
   - 自定义Hooks（消息提示、进度条）

### 待完善功能

- 创作页完整实现
- 作品管理页完整实现
- 素材库页完整实现
- 个人中心页完整实现
- AI功能集成
- 富文本编辑器集成

## 从HTML原型迁移的改进

1. **组件化架构** - 将HTML页面拆分为可复用的React组件
2. **状态管理** - 使用React Hooks管理应用状态
3. **路由管理** - 使用React Router实现SPA导航
4. **代码组织** - 更清晰的目录结构和模块划分
5. **开发体验** - 热更新、快速构建、TypeScript支持（可选）

## 开发说明

### 添加新页面

1. 在 `src/pages/` 创建新组件
2. 在 `src/App.jsx` 添加路由
3. 在 `src/components/Header.jsx` 添加导航链接

### 样式管理

- 通用样式在 `src/styles/common.css`
- 页面特定样式在对应的CSS文件中
- 使用CSS变量统一管理设计系统

### 数据管理

- 模拟数据在 `src/utils/data.js`
- 后续可替换为真实API调用
- 支持localStorage本地存储

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

本项目仅供学习和演示使用。

---

**版本**: v2.0 (React版本)
**创建日期**: 2026-02-11
**基于**: HTML原型 v1.0
