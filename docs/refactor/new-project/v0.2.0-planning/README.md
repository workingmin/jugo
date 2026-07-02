# JUGO v0.2.0-planning 重新立项说明

## 版本定位

`v0.2.0-planning` 是 JUGO 重构项目的新立项版本。它从需求分析开始，不直接把 `v0.1.0-legacy` 的功能、接口或页面视为默认继承项。

## 工作边界

| 类型 | 处理方式 |
| --- | --- |
| 旧项目资料 | 作为参考资料读取，不作为默认约束 |
| 新需求 | 在本版本重新定义 |
| 产品范围 | 重新确认核心用户、核心场景、MVP 和非目标 |
| 技术架构 | 在需求稳定后重新设计 |
| 前后端接口 | 重新定义契约，再进入实现 |
| 旧代码复用 | 按模块评估，明确复用、改写或废弃 |

## 推荐目录

```text
docs/refactor/new-project/v0.2.0-planning/
├── README.md
├── requirements-start.md
├── web-prototype-demo-implementation-plan.md  # Web 原型 demo 实施计划
├── web-prototype-theme-design.md              # Web 原型日间 / 夜间双主题设计
├── project-entry-navigation-design.md         # 项目打开默认落点与历史位置策略
├── worldview-mindmap-knowledge-base-design.md # 世界观思维导图 + 百科仓库方案评估
├── product-scope.md              # 待创建：产品范围和非目标
├── user-scenarios.md             # 待创建：用户、场景、流程
├── domain-model.md               # 待创建：核心业务对象和关系
├── architecture-proposal.md      # 待创建：新架构草案
├── api-contract-draft.md         # 待创建：新 API 契约草案
└── migration-from-legacy.md      # 待创建：旧代码复用和废弃策略
```

## Web 原型工作区

`v0.2.0-planning` 的需求评审 Web 原型统一放在：

```text
prototype/v0.2.0-planning/
```

该目录用于承载新版本页面 demo，不复用旧 `web-prototype/` 的页面结构。当前建议优先实现：

1. 项目管理首页。
2. 世界观知识库。
3. 分支树视图。
4. 矩阵时序视图。
5. 节拍板视图。
6. 全局校验报告。

实施计划见 [web-prototype-demo-implementation-plan.md](web-prototype-demo-implementation-plan.md)。

全局主题设计见 [web-prototype-theme-design.md](web-prototype-theme-design.md)。

项目打开默认落点和历史位置策略见 [project-entry-navigation-design.md](project-entry-navigation-design.md)。

世界观编辑页思维导图 + 百科仓库方案评估见 [worldview-mindmap-knowledge-base-design.md](worldview-mindmap-knowledge-base-design.md)。

## 立项阶段产出顺序

1. 明确产品目标、目标用户、核心场景和不做什么。
2. 定义 MVP 范围和验收标准。
3. 梳理领域模型和核心业务流程。
4. 确定前后端、存储、AI 能力和任务流的边界。
5. 起草 API 和数据契约。
6. 决定旧代码的复用、重写和归档策略。
7. 再进入工程目录重构和代码实现。

## 与 `v0.1.0-legacy` 的关系

`v0.1.0-legacy` 可以提供已有实现和问题清单，但不能替代新需求分析。所有复用都需要重新确认：

- 保留：需求仍成立、实现质量可接受、契约可稳定。
- 改写：需求仍成立，但接口、模型或代码结构不适合新项目。
- 废弃：需求不再成立，或与新项目目标冲突。
