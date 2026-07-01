# JUGO

JUGO 当前处于重新立项阶段。仓库内同时保留了 `v0.1.0-legacy` 旧实现和 `v0.2.0-planning` 新需求资料；后续开发应先确认版本边界，避免把旧实现直接当作新版本基线。

## 版本边界

| 版本 | 状态 | 用途 |
| --- | --- | --- |
| `v0.1.0-legacy` | archived | 旧后端、旧前端、旧原型和旧契约盘点，仅作为参考 |
| `v0.2.0-planning` | active | 新项目需求分析、产品范围、Web 原型评审和后续架构设计 |

版本策略见 [docs/refactor/version-policy.md](docs/refactor/version-policy.md)。

## 顶层目录

| 目录 | 当前归属 | 说明 |
| --- | --- | --- |
| `backend/` | `v0.1.0-legacy` | Go + Gin 旧后端实现，只读参考，不默认继承到新版本 |
| `frontend/` | `v0.1.0-legacy` | React + TypeScript 旧前端实现，只读参考，不默认继承到新版本 |
| `web-prototype/` | `v0.1.0-legacy` | 旧 Web 原型和旧 React/Vite 原型，只读参考 |
| `thirdparty/` | `v0.1.0-legacy` | 第三方参考资料占位目录 |
| `prototype/v0.2.0-planning/` | `v0.2.0-planning` | 新版本需求评审用 Web 原型 demo 工作区 |
| `docs/refactor/` | shared | 版本策略、归档说明、现状索引、需求分析和重构决策 |

## 当前工作入口

- 新项目规划：[docs/refactor/new-project/v0.2.0-planning/README.md](docs/refactor/new-project/v0.2.0-planning/README.md)
- 新 Web 原型：[prototype/v0.2.0-planning/README.md](prototype/v0.2.0-planning/README.md)
- 旧项目归档：[docs/refactor/archive/v0.1.0-legacy/README.md](docs/refactor/archive/v0.1.0-legacy/README.md)

## 维护规则

- 新需求、新交互、新架构设计进入 `docs/refactor/new-project/v0.2.0-planning/`。
- 新 Web 原型 demo 进入 `prototype/v0.2.0-planning/`。
- `backend/`、`frontend/`、`web-prototype/` 暂不物理移动，保持 Git 历史和旧索引稳定。
- 如需复用旧实现，先在 `v0.2.0-planning` 文档中明确复用理由、改造范围和新契约。
