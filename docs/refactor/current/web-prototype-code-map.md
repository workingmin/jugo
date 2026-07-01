# Web Prototype 代码地图

## 当前定位

`web-prototype/` 是前端原型目录。它保留了早期静态原型说明，同时当前文件结构已经包含 React/Vite 原型代码。

## 入口文件

- 原型说明：[web-prototype/README.md](../../../web-prototype/README.md)
- React 说明：[web-prototype/README-REACT.md](../../../web-prototype/README-REACT.md)
- 快速开始：[web-prototype/QUICKSTART.md](../../../web-prototype/QUICKSTART.md)
- 转换总结：[web-prototype/CONVERSION-SUMMARY.md](../../../web-prototype/CONVERSION-SUMMARY.md)
- Vite 入口：[web-prototype/index.html](../../../web-prototype/index.html)
- 应用入口：[web-prototype/src/App.jsx](../../../web-prototype/src/App.jsx)
- React 入口：[web-prototype/src/main.jsx](../../../web-prototype/src/main.jsx)

## 目录结构

```text
web-prototype/src/
├── components/
├── config/
├── constants/
├── data/
├── pages/
├── store/
├── styles/
└── utils/
```

## 页面模块

| 页面文件 | 说明 |
| --- | --- |
| `pages/Home.jsx` | 首页 |
| `pages/Login.jsx` | 登录 |
| `pages/Works.css` / 相关页面 | 作品管理 |
| `pages/Create.jsx` | 创作页 |
| `pages/NovelEditor.css` | 小说编辑器样式 |
| `pages/ScreenplayEditor.css` | 剧本编辑器样式 |
| `pages/Profile.jsx` | 个人中心 |
| `pages/Tutorial.jsx` | 教程 |
| `pages/About.jsx` | 关于 |

## 重构关注点

- `README.md` 描述的是早期纯静态 HTML/CSS/JS 结构，但当前目录中已是 Vite + React 原型，需要更新或归档旧说明。
- `web-prototype/` 与 `frontend/` 功能重叠。重构前需要明确它是保留为设计参考、迁移到 `frontend/`，还是归档。
- 如果后续继续保留原型目录，应记录它不接真实后端 API，避免与生产前端接口契约混淆。
