# 当前项目文件索引

快照时间：2026-07-01。

## 顶层目录

```text
.
├── backend/        # Go 后端服务
├── frontend/       # React + TypeScript 前端应用
├── web-prototype/  # 原型应用和原型说明
├── docs/           # 产品和技术方案稿，另含本重构文档目录
├── thirdparty/     # 第三方参考项目占位目录
└── .gitignore
```

## 文件数量

| 目录 | 可索引文件数 | 说明 |
| --- | ---: | --- |
| `backend/` | 71 | 后端源码、迁移、配置、文档、构建文件 |
| `frontend/` | 84 | 前端源码、样式、类型、配置、依赖锁文件 |
| `web-prototype/` | 44 | 原型源码、样式、说明、依赖锁文件 |
| `docs/` | 10 个既有方案稿 | 不含本次新增的 `docs/refactor/` |
| `thirdparty/` | 0 | 只有参考项目空目录 |

## 根目录既有设计文档

```text
docs/AI小说剧本创作平台设计实施方案.md
docs/JUGO前端作品管理页设计方案稿.md
docs/JUGO前端剧本创作编辑页设计方案稿.md
docs/JUGO前端小说创作编辑页设计方案稿.md
docs/JUGO前端工程实施任务规划.md
docs/JUGO前端平台介绍与联系方式页设计方案稿.md
docs/JUGO前端教程与帮助内容页设计方案稿.md
docs/JUGO前端设计方案稿.md
docs/JUGO后端API设计方案.md
docs/JUGO后端设计方案稿.md
```

## 后端文件分组

```text
backend/
├── cmd/api/main.go
├── config/config.go
├── config/config.yaml
├── docker-compose.yml
├── Dockerfile
├── Makefile
├── go.mod
├── go.sum
├── README.md
├── docs/
│   ├── CHARACTER_API.md
│   └── EXPORT_API.md
├── migrations/
│   ├── 001_create_users_table.sql
│   ├── 002_create_works_and_chapters_tables.sql
│   ├── 003_create_ai_tasks_table.sql
│   └── 004_create_characters_table.sql
├── scripts/migrate.sh
├── internal/
│   ├── api/
│   │   ├── handler/
│   │   ├── middleware/
│   │   ├── router/
│   │   └── websocket/
│   ├── dto/
│   ├── model/
│   ├── pkg/
│   ├── repository/
│   └── service/
└── pkg/
    ├── ai/
    ├── export/
    ├── jwt/
    ├── logger/
    ├── password/
    └── response/
```

## 前端文件分组

```text
frontend/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── README.md
├── public/
└── src/
    ├── api/
    ├── assets/
    ├── components/
    │   ├── Common/
    │   └── Layout/
    ├── config/
    ├── pages/
    │   ├── About/
    │   ├── Auth/
    │   ├── Editor/
    │   ├── Profile/
    │   ├── Tutorial/
    │   └── Works/
    ├── store/
    ├── types/
    ├── utils/
    ├── App.tsx
    ├── App.css
    ├── main.tsx
    └── index.css
```

## 原型文件分组

```text
web-prototype/
├── README.md
├── README-REACT.md
├── QUICKSTART.md
├── CONVERSION-SUMMARY.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    ├── config/
    ├── constants/
    ├── data/
    ├── pages/
    ├── store/
    ├── styles/
    └── utils/
```

## 第三方参考目录

```text
thirdparty/
├── AI_NovelGenerator/
├── MuMuAINovel/
├── NovelForge/
├── novelWriter/
└── novelbox/
```

这些目录当前为空目录。后续如果补入参考代码，需要单独记录来源、许可证和可复用范围。
