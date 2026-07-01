# JUGO v0.1.0-legacy 归档说明

## 版本定位

`v0.1.0-legacy` 是当前未正式上线项目的归档版本。它不是生产版本，也不是后续需求的开发基线；它的作用是保存旧项目资料、实现状态和可复盘依据。

## 归档范围

| 范围 | 路径 | 说明 |
| --- | --- | --- |
| 后端代码 | `backend/` | Go + Gin 后端服务现状 |
| 前端代码 | `frontend/` | React + TypeScript 前端应用现状 |
| 原型代码 | `web-prototype/` | 旧原型和 React/Vite 原型 |
| 设计方案 | `docs/*.md` | 当前根目录下既有产品、前端、后端方案稿 |
| 第三方参考 | `thirdparty/` | 当前为空目录占位 |
| 现状索引 | `docs/refactor/current/` | 文件、模块、入口、契约差异索引 |
| 契约盘点 | `docs/refactor/contracts/` | 当前 API 和数据模型差异 |

## 归档方式

源码不复制到归档文档目录中。归档以两层方式完成：

1. 文档层：本目录记录归档版本、归档范围、冻结规则和索引入口。
2. 代码层：通过 Git tag 固定完整仓库快照，建议标签名为 `jugo-v0.1.0-legacy`。

这样可以避免复制一份源码后出现双份代码分叉，也能完整追溯当时所有文件。

## 代码目录状态

旧代码目录暂时仍保留在仓库根目录，以保持现有路径、Git 历史和索引文档稳定：

| 路径 | 状态 |
| --- | --- |
| `backend/` | 旧后端实现，只读参考 |
| `frontend/` | 旧前端实现，只读参考 |
| `web-prototype/` | 旧 Web 原型，只读参考 |
| `thirdparty/` | 旧第三方参考资料占位 |

上述目录已通过各自 `README.md` 标记为 `v0.1.0-legacy`。如后续确认旧实现完全不复用，再考虑整体移动到 `legacy/v0.1.0-legacy/`，并同步更新所有索引和脚本路径。

## 冻结规则

- 不再基于 `v0.1.0-legacy` 增加新需求。
- 不再把新架构、新 API、新页面设计写入旧归档目录。
- 允许补充：遗漏的现状说明、错别字、路径修正、来源说明。
- 任何新需求、新业务边界和新技术方案都进入 `v0.2.0-planning`。

## 索引入口

- 当前实现总览：[../../current/README.md](../../current/README.md)
- 文件索引：[../../current/project-file-index.md](../../current/project-file-index.md)
- 后端代码地图：[../../current/backend-code-map.md](../../current/backend-code-map.md)
- 前端代码地图：[../../current/frontend-code-map.md](../../current/frontend-code-map.md)
- 原型代码地图：[../../current/web-prototype-code-map.md](../../current/web-prototype-code-map.md)
- API 和数据契约：[../../contracts/api-and-data-contracts.md](../../contracts/api-and-data-contracts.md)

## 与新项目的关系

`v0.1.0-legacy` 只作为参考资料。新项目不默认继承旧需求、旧接口和旧技术实现，是否复用某个模块需要在 `v0.2.0-planning` 的需求和架构文档中重新确认。
