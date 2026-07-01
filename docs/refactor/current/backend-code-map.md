# 后端代码地图

## 技术栈

- 语言和框架：Go 1.21.4、Gin。
- 数据访问：GORM、MySQL。
- 缓存和连接：Redis。
- 配置：Viper + YAML。
- 日志：Zap + lumberjack。
- 认证：JWT。
- 导出：`txt/docx/pdf/epub` 生成器接口，其中部分格式仍可能是占位实现。

## 启动入口

- 进程入口：[backend/cmd/api/main.go](../../../backend/cmd/api/main.go)
- 配置定义：[backend/config/config.go](../../../backend/config/config.go)
- 配置文件：[backend/config/config.yaml](../../../backend/config/config.yaml)
- 路由装配：[backend/internal/api/router/router.go](../../../backend/internal/api/router/router.go)

启动流程：

1. 加载 `config/config.yaml`。
2. 初始化日志。
3. 初始化 MySQL 和 Redis。
4. 装配 Gin 路由。
5. 启动 HTTP 服务并监听系统信号优雅关闭。

## 分层结构

| 层级 | 路径 | 当前职责 |
| --- | --- | --- |
| API Handler | `backend/internal/api/handler/` | Gin 请求解析、参数绑定、响应输出 |
| Middleware | `backend/internal/api/middleware/` | JWT、CORS、日志、恢复、请求 ID |
| Router | `backend/internal/api/router/` | 路由分组、依赖装配 |
| WebSocket | `backend/internal/api/websocket/` | 连接、消息、Hub、自动保存相关通信 |
| Service | `backend/internal/service/` | 业务逻辑和权限判断 |
| Repository | `backend/internal/repository/` | GORM 数据访问 |
| Model | `backend/internal/model/` | GORM 模型、枚举和值对象 |
| DTO | `backend/internal/dto/` | HTTP 请求和响应结构 |
| Internal pkg | `backend/internal/pkg/` | 数据库、Redis 初始化 |
| Public pkg | `backend/pkg/` | JWT、响应、日志、密码、AI、导出等公共能力 |

## 当前业务模块

| 模块 | Handler | Service | Repository | Model/DTO |
| --- | --- | --- | --- | --- |
| 认证和用户 | `auth.go`, `user.go` | `user.go` | `user.go` | `model/user.go`, `dto/user.go` |
| 作品 | `work.go` | `work.go` | `work.go` | `model/work.go`, `dto/work.go` |
| 章节 | `chapter.go` | `chapter.go` | `chapter.go` | `model/chapter.go`, `dto/chapter.go` |
| 角色 | `character.go` | `character.go` | `character.go` | `model/character.go`, `dto/character.go` |
| AI 任务 | `ai.go` | `ai.go` | `ai_task.go` | `model/ai_task.go`, `dto/ai.go` |
| 保存 | `save.go` | `save.go` | 复用 works/chapters | `dto/save.go` |
| 导出 | `export.go` | `export.go` | 复用 works/chapters/characters | `dto/export.go`, `pkg/export/` |

## 路由概览

后端路由由 [backend/internal/api/router/router.go](../../../backend/internal/api/router/router.go) 装配。

| 路由 | 认证 | 说明 |
| --- | --- | --- |
| `GET /health` | 否 | 健康检查 |
| `POST /api/v1/auth/register` | 否 | 注册 |
| `POST /api/v1/auth/login` | 否 | 登录 |
| `POST /api/v1/auth/refresh` | 否 | 刷新 token |
| `POST /api/v1/auth/logout` | 是 | 登出 |
| `GET/PATCH /api/v1/users/me` | 是 | 当前用户资料 |
| `POST/GET /api/v1/works` | 是 | 创建和查询作品 |
| `GET/PATCH/DELETE /api/v1/works/:id` | 是 | 作品详情、更新、删除 |
| `/api/v1/works/:workId/chapters...` | 是 | 章节 CRUD |
| `/api/v1/works/:workId/characters` | 是 | 角色创建和列表 |
| `/api/v1/characters/:id` | 是 | 角色详情、更新、删除 |
| `POST /api/v1/works/:id/export` | 是 | 作品导出 |
| `POST /api/v1/works/:workId/autosave` | 是 | 自动保存 |
| `POST /api/v1/works/:workId/save` | 是 | 手动保存 |
| `/api/v1/ai/...` | 是 | AI 续写、润色、扩写、改写、大纲和转换 |
| `GET /ws` | query token | WebSocket |

## 数据库迁移

| 文件 | 表 |
| --- | --- |
| `001_create_users_table.sql` | `users` |
| `002_create_works_and_chapters_tables.sql` | `works`, `chapters` |
| `003_create_ai_tasks_table.sql` | `ai_tasks` |
| `004_create_characters_table.sql` | `characters` |

## 重构关注点

- 路由、DTO、前端 API 封装需要先对齐，避免重构后功能不可用。
- `router.Setup` 同时负责依赖装配和路由注册，后续可拆成 provider/container 与 route modules。
- 错误响应当前使用 HTTP 200 承载业务错误码，是否保留需要在契约层明确。
- README 中的开发状态与当前代码不一致，需要重构文档稳定后更新。
- `scenes` 概念在前端存在，后端当前没有对应模型和路由，需要决定是删除、映射到 chapters，还是新增后端域模型。
