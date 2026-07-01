# JUGO 重构文档工作台

本目录用于承载 JUGO 项目重构前后的技术文档。现有 `docs/` 根目录主要保存产品和页面设计方案；这里专门保存代码现状、前后端契约、迁移计划和重构决策，避免后续重构资料与早期方案稿混在一起。

## 目录设计

```text
docs/refactor/
├── README.md
├── version-policy.md
├── archive/
│   └── v0.1.0-legacy/
│       └── README.md
├── new-project/
│   └── v0.2.0-planning/
│       ├── README.md
│       └── requirements-start.md
├── current/
│   ├── README.md
│   ├── project-file-index.md
│   ├── backend-code-map.md
│   ├── frontend-code-map.md
│   └── web-prototype-code-map.md
├── contracts/
│   └── api-and-data-contracts.md
├── migration/
│   └── refactor-backlog.md
└── decisions/
    └── README.md
```

## 使用规则

- `current/`: 记录当前项目文件、模块职责、入口、关键依赖和已知不一致点。
- `archive/`: 记录旧项目归档版本、归档范围和冻结规则。
- `new-project/`: 记录重构后重新立项版本，从需求分析重新开始。
- `contracts/`: 记录前后端 API、数据模型、响应格式、WebSocket、配置等边界契约。
- `migration/`: 记录重构前需要处理的风险、拆分顺序和验证清单。
- `decisions/`: 保存重构过程中的架构决策记录，推荐按 `ADR-0001-标题.md` 追加。

## 版本定位

| 版本 | 状态 | 定位 | 入口 |
| --- | --- | --- | --- |
| `v0.1.0-legacy` | archived | 未正式上线的旧项目资料归档，只允许勘误 | [archive/v0.1.0-legacy/README.md](archive/v0.1.0-legacy/README.md) |
| `v0.2.0-planning` | active | 重构项目重新立项，从需求分析开始 | [new-project/v0.2.0-planning/README.md](new-project/v0.2.0-planning/README.md) |

版本规则见 [version-policy.md](version-policy.md)。

## 当前代码域

| 代码域 | 当前归属 | 当前用途 | 入口文档 |
| --- | --- | --- | --- |
| `backend/` | `v0.1.0-legacy` | Go + Gin 旧后端服务，只读参考 | [current/backend-code-map.md](current/backend-code-map.md) |
| `frontend/` | `v0.1.0-legacy` | React + TypeScript 旧前端应用，只读参考 | [current/frontend-code-map.md](current/frontend-code-map.md) |
| `web-prototype/` | `v0.1.0-legacy` | 旧前端交互原型和旧 React/Vite 原型，只读参考 | [current/web-prototype-code-map.md](current/web-prototype-code-map.md) |
| `thirdparty/` | `v0.1.0-legacy` | 第三方参考项目目录，目前作为占位 | [current/project-file-index.md](current/project-file-index.md) |
| `prototype/v0.2.0-planning/` | `v0.2.0-planning` | 新版本需求评审 Web 原型 demo 工作区 | [../../prototype/v0.2.0-planning/README.md](../../prototype/v0.2.0-planning/README.md) |

## 维护原则

- 文档链接源码路径，不复制大段源码，降低重构后文档过期风险。
- 每次跨模块重构前，先更新 `current/` 和 `contracts/` 中受影响的现状。
- 每次确定不可逆或影响面较大的技术选择，追加一条 ADR。
- 每次完成一个重构阶段，在 `migration/refactor-backlog.md` 标记状态和验证结果。
