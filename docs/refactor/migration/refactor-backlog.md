# 重构待办和风险清单

本文件记录重构前必须处理或显式接受的风险。状态使用 `todo`、`doing`、`done`、`defer`。

## P0 契约对齐

| 状态 | 项 | 说明 |
| --- | --- | --- |
| todo | API 前缀统一 | 后端 `/api/v1`，前端默认 `/v1` |
| todo | WebSocket 路径统一 | 后端 `/ws`，前端默认 `/v1/ws` |
| todo | 章节 API 对齐 | `PATCH` vs `PUT`、排序接口、章节级自动保存 |
| todo | 角色 API 对齐 | 嵌套路由 vs 顶层路由 |
| todo | 剧本场景模型决策 | 前端有 scenes，后端没有 scenes |
| todo | 导出格式集合统一 | 后端 `epub`，前端 `md` |

## P1 结构重构

| 状态 | 项 | 说明 |
| --- | --- | --- |
| todo | 后端依赖装配拆分 | `router.Setup` 同时装配 repository/service/handler 和注册路由 |
| todo | 后端错误模型明确 | 当前业务错误使用 HTTP 200 包裹，需要决定是否保留 |
| todo | 前端 API 类型收敛 | API 模块和拦截器的返回类型需要更清晰 |
| todo | 前端编辑器状态边界 | 小说编辑器和剧本编辑器状态存在相似结构 |
| todo | 原型目录归档策略 | `web-prototype/` 与 `frontend/` 功能重叠 |

## P2 文档和工程一致性

| 状态 | 项 | 说明 |
| --- | --- | --- |
| todo | 更新 `backend/README.md` | 当前 README 中“待实现”与代码现状不一致 |
| todo | 更新 `web-prototype/README.md` | README 仍描述旧静态原型结构 |
| todo | 补充测试策略 | 当前未发现专门的测试目录或测试文件索引 |
| todo | 补充运行验证脚本 | 后续重构每阶段需要稳定的 build/test/lint 命令 |

## 建议重构顺序

1. 先冻结并修正 `contracts/api-and-data-contracts.md`。
2. 统一前后端基础地址、响应、错误和枚举。
3. 处理缺失接口：scenes、章节排序、自动保存、角色统计。
4. 再拆分后端依赖装配和路由模块。
5. 再整理前端 API 层、store 层和编辑器组件。
6. 最后清理 `web-prototype/`、README 和旧设计稿引用。

## 每阶段验证清单

- `backend`: `go test ./...`
- `backend`: `go build ./cmd/api`
- `frontend`: `npm run lint`
- `frontend`: `npm run build`
- 手动验证：登录、作品列表、作品创建、小说编辑、剧本编辑、保存、导出、AI 任务入口。
