# 当前实现总览

本目录是重构前的代码现状索引，快照时间为 2026-07-01。该快照归入旧项目归档版本 `v0.1.0-legacy`。它回答三个问题：

1. 当前项目有哪些代码和文档文件。
2. 前后端主要模块边界在哪里。
3. 哪些契约不一致会影响后续重构。

## 快速入口

| 文档 | 内容 |
| --- | --- |
| [../archive/v0.1.0-legacy/README.md](../archive/v0.1.0-legacy/README.md) | 旧项目归档版本、范围和冻结规则 |
| [project-file-index.md](project-file-index.md) | 根目录、后端、前端、原型和第三方目录的文件索引 |
| [backend-code-map.md](backend-code-map.md) | Go 后端分层、入口、路由、服务、模型和基础设施 |
| [frontend-code-map.md](frontend-code-map.md) | React 前端路由、API 封装、状态、页面和类型 |
| [web-prototype-code-map.md](web-prototype-code-map.md) | `web-prototype/` 原型目录当前状态 |
| [../contracts/api-and-data-contracts.md](../contracts/api-and-data-contracts.md) | API、响应、数据模型和前后端差异 |
| [../migration/refactor-backlog.md](../migration/refactor-backlog.md) | 首批重构风险和待办 |

## 当前项目形态

- 后端：`backend/`，Go 1.21、Gin、GORM、MySQL、Redis，按 handler/service/repository/model 分层。
- 前端：`frontend/`，React 19、TypeScript、Vite、Ant Design、Zustand、Axios。
- 原型：`web-prototype/`，保留了早期原型说明，同时目录内也已有 React/Vite 原型代码。
- 设计稿：根目录 `docs/` 下已有产品、前端、后端和页面设计方案稿。
- 第三方参考：`thirdparty/` 下存在参考项目空目录，目前没有可索引源码文件。

## 重构前先看

- 后端 API 前缀是 `/api/v1`，前端默认 API 地址是 `/v1`，需要统一。
- 后端 WebSocket 是 `/ws`，前端默认地址是 `/v1/ws`，需要统一。
- 前端存在 scenes、章节 reorder、章节级 autosave、嵌套 character 详情等接口调用，后端当前路由未完全覆盖。
- 后端支持导出 `txt/docx/pdf/epub`，前端常量支持 `docx/pdf/txt/md`，格式集合不一致。
- `backend/README.md` 中开发计划仍写着部分功能待实现，但代码里已经有认证、作品、章节、AI、导出、角色模块，需要更新。
