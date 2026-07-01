# 前端代码地图

## 技术栈

- 框架：React 19 + TypeScript。
- 构建：Vite 7。
- UI：Ant Design 6。
- 路由：React Router v7。
- 状态：Zustand。
- 请求：Axios。
- 编辑器：React Quill。
- 样式：Sass + CSS。

## 应用入口

- HTML 入口：[frontend/index.html](../../../frontend/index.html)
- React 入口：[frontend/src/main.tsx](../../../frontend/src/main.tsx)
- 路由入口：[frontend/src/App.tsx](../../../frontend/src/App.tsx)
- 全局常量：[frontend/src/config/constants.ts](../../../frontend/src/config/constants.ts)
- 请求封装：[frontend/src/utils/request.ts](../../../frontend/src/utils/request.ts)

## 路由结构

前端路由定义在 [frontend/src/App.tsx](../../../frontend/src/App.tsx)。

| 路由 | 页面 | 认证 |
| --- | --- | --- |
| `/login` | `pages/Auth/Login.tsx` | 否 |
| `/register` | `pages/Auth/Register.tsx` | 否 |
| `/` | 重定向到 `/works` | 是 |
| `/works` | `pages/Works/Works.tsx` | 是 |
| `/editor/:workId` | `pages/Editor/Editor.tsx` | 是 |
| `/tutorial` | `pages/Tutorial/Tutorial.tsx` | 是 |
| `/profile` | `pages/Profile/Profile.tsx` | 是 |
| `/about` | `pages/About/About.tsx` | 是 |

## 目录职责

| 路径 | 当前职责 |
| --- | --- |
| `src/api/` | HTTP API 模块，按业务域拆分 |
| `src/components/Common/` | 通用业务卡片等复用组件 |
| `src/components/Layout/` | 主布局、侧边栏 |
| `src/config/` | 主题、接口地址、常量 |
| `src/pages/` | 页面级组件 |
| `src/pages/Editor/components/` | 小说和剧本编辑器子面板 |
| `src/store/` | Zustand 状态 |
| `src/types/` | 前端业务类型和 API 类型 |
| `src/utils/` | 请求、存储、格式化、校验、WebSocket 工具 |

## API 模块

| 文件 | 当前调用范围 |
| --- | --- |
| `src/api/auth.ts` | 登录、注册、登出、刷新 token |
| `src/api/user.ts` | 当前用户信息、更新资料、修改密码、上传头像 |
| `src/api/works.ts` | 作品列表、详情、创建、更新、删除 |
| `src/api/chapters.ts` | 章节 CRUD、排序、章节级自动保存、AI 操作 |
| `src/api/scenes.ts` | 剧本场景 CRUD、排序、自动保存 |
| `src/api/characters.ts` | 角色 CRUD、角色出场统计 |

## 状态模块

| 文件 | 当前职责 |
| --- | --- |
| `src/store/authStore.ts` | 登录态、用户信息、token 和 refreshToken |
| `src/store/editorStore.ts` | 小说编辑器章节、AI 设置、编辑状态 |
| `src/store/screenplayStore.ts` | 剧本场景、角色和剧本编辑状态 |

## 类型模块

| 文件 | 当前职责 |
| --- | --- |
| `src/types/api.ts` | 统一响应和错误类型 |
| `src/types/user.ts` | 用户、认证、资料更新 |
| `src/types/work.ts` | 作品、作品元数据、作品查询 |
| `src/types/editor.ts` | 章节、AI 操作、小说编辑器状态 |
| `src/types/screenplay.ts` | 场景、角色、剧本元素、剧本编辑器状态 |

## 重构关注点

- 默认 `API_BASE_URL` 是 `http://localhost:8080/v1`，后端实际前缀是 `/api/v1`。
- 默认 `WS_URL` 是 `ws://localhost:8080/v1/ws`，后端实际 WebSocket 路由是 `/ws`。
- `chapters.ts` 使用 `PUT` 更新章节，后端当前使用 `PATCH`。
- `chapters.ts` 有章节排序和章节级自动保存接口，后端当前没有对应路由。
- `scenes.ts` 依赖剧本场景 API，后端当前没有 scene 模型、迁移和路由。
- `characters.ts` 使用嵌套角色详情路由，后端详情、更新、删除是顶层 `/characters/:id`。
- 导出格式前端有 `md`，后端有 `epub`，格式集合不一致。
- `ROUTES.NOVEL_EDITOR` 和 `ROUTES.SCREENPLAY_EDITOR` 指向 `/editor/novel`、`/editor/screenplay`，实际应用路由是 `/editor/:workId`。
