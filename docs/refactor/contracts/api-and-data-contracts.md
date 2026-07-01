# API 和数据契约现状

快照时间：2026-07-01。

## 基础地址

| 项 | 后端当前实现 | 前端当前默认值 | 状态 |
| --- | --- | --- | --- |
| HTTP API | `/api/v1` | `http://localhost:8080/v1` | 不一致 |
| WebSocket | `/ws` | `ws://localhost:8080/v1/ws` | 不一致 |
| 健康检查 | `GET /health` | 无封装 | 可保留 |

## 统一响应

后端响应结构定义在 [backend/pkg/response/response.go](../../../backend/pkg/response/response.go)：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

注意：`BadRequest`、`Unauthorized`、`Forbidden`、`NotFound`、`InternalServerError` 当前通过 HTTP 200 返回业务错误码。前端拦截器会读取 `data.code` 判断成功或失败。

## 后端路由契约

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/health` | 健康检查 |
| `POST` | `/api/v1/auth/register` | 注册 |
| `POST` | `/api/v1/auth/login` | 登录 |
| `POST` | `/api/v1/auth/refresh` | 刷新 token |
| `POST` | `/api/v1/auth/logout` | 登出 |
| `GET` | `/api/v1/users/me` | 当前用户 |
| `PATCH` | `/api/v1/users/me` | 更新当前用户 |
| `POST` | `/api/v1/works` | 创建作品 |
| `GET` | `/api/v1/works` | 作品列表 |
| `GET` | `/api/v1/works/:id` | 作品详情 |
| `PATCH` | `/api/v1/works/:id` | 更新作品 |
| `DELETE` | `/api/v1/works/:id` | 删除作品 |
| `POST` | `/api/v1/works/:workId/chapters` | 创建章节 |
| `GET` | `/api/v1/works/:workId/chapters` | 章节列表 |
| `GET` | `/api/v1/works/:workId/chapters/:id` | 章节详情 |
| `PATCH` | `/api/v1/works/:workId/chapters/:id` | 更新章节 |
| `DELETE` | `/api/v1/works/:workId/chapters/:id` | 删除章节 |
| `POST` | `/api/v1/works/:workId/characters` | 创建角色 |
| `GET` | `/api/v1/works/:workId/characters` | 角色列表 |
| `GET` | `/api/v1/characters/:id` | 角色详情 |
| `PATCH` | `/api/v1/characters/:id` | 更新角色 |
| `DELETE` | `/api/v1/characters/:id` | 删除角色 |
| `POST` | `/api/v1/works/:id/export` | 导出作品 |
| `POST` | `/api/v1/works/:workId/autosave` | 自动保存 |
| `POST` | `/api/v1/works/:workId/save` | 手动保存 |
| `POST` | `/api/v1/ai/continue` | AI 续写 |
| `POST` | `/api/v1/ai/polish` | AI 润色 |
| `POST` | `/api/v1/ai/expand` | AI 扩写 |
| `POST` | `/api/v1/ai/rewrite` | AI 改写 |
| `POST` | `/api/v1/ai/outline` | AI 大纲 |
| `POST` | `/api/v1/ai/convert/novel-to-screenplay` | 小说转剧本 |
| `POST` | `/api/v1/ai/convert/screenplay-to-novel` | 剧本转小说 |
| `GET` | `/api/v1/ai/tasks/:id` | AI 任务状态 |
| `GET` | `/ws` | WebSocket |

## 主要数据模型

| 表 | 模型 | 关键字段 |
| --- | --- | --- |
| `users` | `model.User` | `id`, `username`, `email`, `password`, `avatar`, `status`, `refresh_token`, `last_login_at` |
| `works` | `model.Work` | `id`, `user_id`, `type`, `title`, `topic`, `genre`, `status`, `words`, `num_chapters`, `word_per_chapter`, `cover_image`, `metadata` |
| `chapters` | `model.Chapter` | `id`, `work_id`, `title`, `content`, `words`, `order_num`, `status` |
| `characters` | `model.Character` | `id`, `work_id`, `name`, `role`, `description` |
| `ai_tasks` | `model.AITask` | `id`, `user_id`, `work_id`, `type`, `status`, `parameters`, `result`, `error`, `progress`, `completed_at` |

## 枚举契约

| 名称 | 后端值 | 前端值 | 状态 |
| --- | --- | --- | --- |
| 作品类型 | `novel`, `screenplay` | `novel`, `screenplay` | 一致 |
| 作品状态 | `draft`, `completed`, `published` | `draft`, `completed`, `published` | 一致 |
| 章节状态 | `draft`, `completed` | `draft`, `writing`, `completed` | 不一致 |
| 角色类型 | `protagonist`, `antagonist`, `supporting` | 见 `screenplay.ts` | 需核对 |
| AI 操作 | `continue`, `polish`, `expand`, `rewrite`, `outline`, `novel_to_screenplay`, `screenplay_to_novel` | 同名常量存在 | 基本一致 |
| 导出格式 | `txt`, `docx`, `pdf`, `epub` | `docx`, `pdf`, `txt`, `md` | 不一致 |

## 前端调用但后端缺失或差异较大的接口

| 前端文件 | 调用 | 后端状态 |
| --- | --- | --- |
| `src/config/constants.ts` | 默认 `/v1` | 后端是 `/api/v1` |
| `src/config/constants.ts` | 默认 `/v1/ws` | 后端是 `/ws` |
| `src/api/chapters.ts` | `PUT /works/:workId/chapters/:chapterId` | 后端是 `PATCH` |
| `src/api/chapters.ts` | `PUT /works/:workId/chapters/reorder` | 未注册 |
| `src/api/chapters.ts` | `POST /works/:workId/chapters/:chapterId/autosave` | 后端保存接口是作品级 |
| `src/api/scenes.ts` | `/works/:workId/scenes...` | 未注册 |
| `src/api/characters.ts` | `/works/:workId/characters/:characterId` | 后端详情、更新、删除为 `/characters/:id` |
| `src/api/characters.ts` | `/appearances` | 未注册 |
| `src/config/constants.ts` | 导出 `md` | 后端不支持 `md` |
| 后端 `dto/export.go` | 导出 `epub` | 前端常量未暴露 `epub` |

## 下一步建议

1. 先确定 API 基础前缀和 WebSocket 路径。
2. 确定 scenes 是否作为独立后端模型。
3. 统一章节、角色、导出格式的前后端契约。
4. 再进行目录、服务层或状态层重构，避免边重构边追接口差异。
