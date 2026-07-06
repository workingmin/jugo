# 地理地图：Web 地图编辑器技术选型对比

## 背景

世界观主画布中，「地理地图」固定节点后续需要支持新增二级子节点。该二级子节点在画布上只展示「地图名称」。用户双击该子节点时，打开「地图编辑器」弹窗，用于编辑当前世界中的地理地图。

本选型只解决第一阶段的 Web 地图编辑器技术路线，不直接进入实现。目标是为 v0.2 原型先建立可落地、可扩展、许可清晰的方案。

## MVP 交互目标

画布节点：

- 父节点：`地理地图`
- 新增二级节点默认标题：`新地图`
- 节点显示：只展示地图名称
- 双击节点：打开地图编辑器弹窗
- 右键菜单：可重命名地图、删除地图、打开地图编辑器

地图编辑器弹窗：

- 顶部：地图名称、保存、取消、导入、导出
- 左侧工具栏：选择、标记点、路线、区域、文本标签、删除
- 主区域：地图画布
- 右侧属性栏：当前对象名称、类型、说明、样式、关联世界观节点
- 底部状态栏：坐标、缩放、对象数量、最近保存时间

## 数据边界

MVP 建议使用 GeoJSON 作为地图对象的主存储格式。不要直接绑定某个编辑器内部状态。

建议节点数据：

```ts
type GeographyMapNodeData = {
  title: string
  nodeType: 'map'
  mapEngine: 'leaflet-geoman' | 'leaflet-draw' | 'openlayers' | 'maplibre-terra' | 'azgaar'
  mapData: GeoJSON.FeatureCollection
  viewport: {
    center: [number, number]
    zoom: number
  }
  thumbnail?: string
  updatedAt?: string
}
```

对于虚构世界，坐标不一定是真实经纬度。MVP 可以使用 `Simple CRS / 自定义平面坐标` 思路，把地图画布看作二维平面；后续如果接入真实地理底图，再迁移到标准经纬度。

## 候选方案

### 方案 A：Leaflet + Leaflet-Geoman Free

Leaflet 是开源、移动友好的 Web 交互地图基础库，体量小，支持瓦片、Marker、Popup、矢量图层、ImageOverlay 和 GeoJSON。官方说明其核心定位是简单、性能和可用性，并可通过插件扩展。参考：[Leaflet 官方首页](https://leafletjs.com/)、[Leaflet GitHub](https://github.com/Leaflet/Leaflet)。

Leaflet-Geoman 是 Leaflet 的几何绘制与编辑插件。仓库说明其支持创建和编辑几何图层，并覆盖 Draw、Edit、Drag、Cut、Rotate、Split、Scale、Measure、Snap 等能力，支持 Marker、Polyline、Polygon、Circle、Rectangle、ImageOverlay、GeoJSON 等对象。参考：[Leaflet-Geoman docs](https://geoman.io/docs/leaflet/getting-started/free-version)、[Leaflet-Geoman GitHub](https://github.com/geoman-io/leaflet-geoman)。

许可：

- Leaflet：BSD-2-Clause
- Leaflet-Geoman：MIT

优势：

- 接入成本低，适合 Vite + React 原型。
- GeoJSON 读写路径清晰。
- 工具栏、绘制、编辑、拖拽、吸附等编辑能力比 Leaflet.draw 更完整。
- 可以先不接真实底图，用空白图层或自定义图片作为世界地图底图。
- 适合「弹窗地图编辑器」这种轻量内嵌模式。

风险：

- Leaflet-Geoman 有 Free / Pro 边界，部分高级能力可能在 Pro 版中。
- 复杂样式、海拔、地形、行政区自动生成不是它的核心能力。
- 默认 Web 地图模型偏真实地理地图，需要额外封装虚构世界坐标。

适配结论：

MVP 首选。它足以支撑「地图名称节点 -> 双击打开弹窗 -> 画点、线、区域、标签 -> 保存为 GeoJSON」的闭环。

### 方案 B：Leaflet + Leaflet.draw

Leaflet.draw 是 Leaflet 的矢量绘制和编辑插件，官方仓库描述为“给 Leaflet 地图增加绘制和编辑 vectors / markers 的能力”。参考：[Leaflet.draw docs](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html)、[Leaflet.draw GitHub](https://github.com/Leaflet/Leaflet.draw)。

许可：

- Leaflet.draw：MIT

优势：

- 老牌插件，API 和资料较多。
- 能满足点、线、面、矩形、圆等基础绘制。
- 比 Leaflet-Geoman 更轻，适合只做最小编辑能力。

风险：

- 交互能力和现代维护活跃度不如 Leaflet-Geoman。
- 复杂编辑体验需要自己补 UI 和状态管理。
- 对后续“地图对象属性栏、对象样式、吸附、批量编辑”的支持偏弱。

适配结论：

可作为备选，不建议作为首选。除非后续决定只做极简地图标注。

### 方案 C：OpenLayers Draw / Modify / Snap

OpenLayers 是功能完整的 Web 地图库，官方仓库说明其可展示任意来源的瓦片、矢量数据和标记，免费开源并采用 BSD 2-Clause License。官方示例提供 Draw、Modify、Snap 交互，用于绘制、修改和吸附矢量对象。参考：[OpenLayers GitHub](https://github.com/openlayers/openlayers)、[Draw and Modify Features 示例](https://openlayers.org/en/latest/examples/draw-and-modify-features.html)。

许可：

- OpenLayers：BSD-2-Clause

优势：

- GIS 能力强，投影、图层、数据源和交互体系成熟。
- Draw / Modify / Snap 是核心能力，不依赖第三方插件。
- 更适合后续做真实地理数据、复杂坐标系、专业图层管理。

风险：

- API 更重，学习和封装成本高于 Leaflet。
- 对当前“世界观原型弹窗编辑器”来说能力过剩。
- UI 需要自己搭，编辑工具栏不像 Geoman 那样开箱即用。

适配结论：

适合作为正式产品的中长期候选。如果后续要接真实 GIS、复杂投影、多源数据，OpenLayers 比 Leaflet 更稳。MVP 不建议先上。

### 方案 D：MapLibre GL JS + Terra Draw

MapLibre GL JS 是开源 WebGL 交互地图渲染库，官方仓库说明它基于 GPU 加速矢量瓦片渲染，源自 Mapbox GL JS 开源版本分支。许可为 BSD-3-Clause。参考：[MapLibre GitHub](https://github.com/maplibre/maplibre-gl-js)、[MapLibre docs](https://maplibre.org/maplibre-gl-js/docs/)。

Terra Draw 是跨地图库的绘制库，仓库说明其集中地图绘制逻辑，提供开箱即用绘制模式，并通过 adapter 支持 Leaflet、OpenLayers、MapLibre GL JS、Mapbox GL JS、Google Maps、ArcGIS 等。参考：[Terra Draw GitHub](https://github.com/JamesLMilner/terra-draw)。

许可：

- MapLibre GL JS：BSD-3-Clause
- Terra Draw：MIT

优势：

- 现代 WebGL 渲染，适合大地图、矢量瓦片、视觉表现更强的地图体验。
- Terra Draw 可降低绘制逻辑与地图底层库的耦合。
- 后续如果要做 3D 建筑、矢量样式、动态图层，MapLibre 路线更强。

风险：

- MVP 复杂度高于 Leaflet。
- WebGL、worker、CSP、地图样式和资源加载会引入额外工程问题。
- Terra Draw 是绘制层，不等于完整地图编辑器；属性面板、图层管理仍需自研。

适配结论：

不适合作为当前原型第一步。适合作为未来“高表现地图编辑器”或“地图渲染升级”的技术储备。

### 方案 E：Azgaar Fantasy Map Generator

Azgaar's Fantasy Map Generator 是面向奇幻作者、游戏主持和制图者的免费 Web 应用，可创建和编辑奇幻地图。仓库说明其当前架构正朝世界数据、生成器、编辑器、渲染器分层演进。参考：[Azgaar FMG GitHub](https://github.com/Azgaar/Fantasy-Map-Generator)、[在线应用](https://azgaar.github.io/Fantasy-Map-Generator/)。

许可：

- MIT。仓库 LICENSE 明确允许复制、修改、分发和商业使用，并说明用户产出的地图、截图、视频等衍生材料可不受限制使用。参考：[LICENSE](https://raw.githubusercontent.com/Azgaar/Fantasy-Map-Generator/master/LICENSE)。

优势：

- 与小说 / 剧本世界观的“幻想地图”场景最贴近。
- 已具备地图生成、图层、国家、文化、宗教、路线、标记、样式等大量能力。
- 非常适合做竞品参考、灵感参考或外部导入导出工具。

风险：

- 是完整应用，不是轻量组件。直接嵌入弹窗会带来体积、状态隔离、样式冲突和产品一致性问题。
- 内部数据模型复杂，难以与 JUGO 世界观节点、百科仓库、AI 校验直接对齐。
- 交互和信息架构会强烈覆盖 JUGO 自身的编辑器体验。

适配结论：

不建议直接作为内嵌地图编辑器。建议作为“地图生成 / 导入”增强项：后续可支持从 Azgaar 导入地图截图或 `.map` 数据，再在 JUGO 中做轻量标注与世界观关联。

## 对比表

| 方案 | 许可 | 接入成本 | 编辑能力 | 虚构世界适配 | 数据可控性 | MVP 适配度 |
| --- | --- | --- | --- | --- | --- | --- |
| Leaflet + Leaflet-Geoman Free | BSD-2 + MIT | 低 | 高 | 中 | 高 | 高 |
| Leaflet + Leaflet.draw | BSD-2 + MIT | 低 | 中 | 中 | 高 | 中 |
| OpenLayers | BSD-2 | 中高 | 高 | 中 | 高 | 中 |
| MapLibre + Terra Draw | BSD-3 + MIT | 高 | 中高 | 中 | 高 | 中低 |
| Azgaar FMG | MIT | 高 | 很高 | 很高 | 中低 | 低 |

## 推荐方案

MVP 推荐采用：

```text
Leaflet + Leaflet-Geoman Free
```

推荐原因：

1. 最贴近当前原型目标：轻量、可内嵌弹窗、快速形成编辑闭环。
2. GeoJSON 作为存储格式，可脱离具体编辑器，后续可迁移。
3. 可先使用空白平面地图或上传图片底图，不依赖真实地理瓦片服务。
4. 编辑工具覆盖点、线、区域、矩形、圆、拖拽、编辑、吸附等 MVP 需要。
5. 与 React Flow 主画布边界清晰：主画布只管理地图节点，弹窗内管理地图对象。

不推荐直接使用 Azgaar FMG 作为内嵌编辑器。它更适合作为“专业奇幻地图生成器参考”和后续导入功能，而不是 JUGO 当前世界观主画布下的弹窗式子编辑器。

## MVP 实施建议

### 第一阶段：节点与弹窗骨架

- `地理地图` 下新增二级子节点：
  - `nodeType: 'map'`
  - `title: '新地图'`
  - 画布节点只显示地图名称
- 双击地图节点打开地图编辑器弹窗。
- 弹窗先实现：
  - 地图名称输入
  - 空白地图画布
  - 保存 / 取消
  - 导入 / 导出 GeoJSON

### 第二阶段：Leaflet + Geoman 编辑闭环

- 初始化 Leaflet map。
- 开启 Leaflet-Geoman toolbar。
- 支持 marker、polyline、polygon、rectangle、circle。
- `pm:create`、`pm:edit`、`pm:remove` 后同步为 GeoJSON。
- 保存时写回当前地图节点的 `mapData`。

### 第三阶段：世界观联动

- 地图对象属性栏支持：
  - 名称
  - 类型：地点 / 路线 / 区域 / 势力范围 / 事件发生地
  - 描述
  - 关联已有世界观节点
- 百科仓库中可从地点、势力、事件跳回地图对象。
- AI 校验可读取地图对象与世界观节点关系，例如地点归属冲突、路线穿越禁区、事件地点不存在。

## 决策记录

当前决策：

```text
MVP 采用 Leaflet + Leaflet-Geoman Free。
地图数据统一保存为 GeoJSON FeatureCollection。
Azgaar FMG 暂不内嵌，只作为参考和未来导入方向。
```

后续触发重新评估的条件：

- 需要真实 GIS 投影、多数据源和专业空间分析时，重新评估 OpenLayers。
- 需要高性能矢量瓦片、WebGL 视觉和动态样式时，重新评估 MapLibre + Terra Draw。
- 需要自动生成完整奇幻地图时，评估 Azgaar FMG 的导入 / 旁路生成流程，而不是直接替换 JUGO 地图编辑器。

## 参考来源

- Leaflet 官方首页：https://leafletjs.com/
- Leaflet GitHub：https://github.com/Leaflet/Leaflet
- Leaflet-Geoman 文档：https://geoman.io/docs/leaflet/getting-started/free-version
- Leaflet-Geoman GitHub：https://github.com/geoman-io/leaflet-geoman
- Leaflet.draw 文档：https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html
- Leaflet.draw GitHub：https://github.com/Leaflet/Leaflet.draw
- OpenLayers GitHub：https://github.com/openlayers/openlayers
- OpenLayers Draw / Modify 示例：https://openlayers.org/en/latest/examples/draw-and-modify-features.html
- MapLibre GL JS 文档：https://maplibre.org/maplibre-gl-js/docs/
- MapLibre GL JS GitHub：https://github.com/maplibre/maplibre-gl-js
- Terra Draw GitHub：https://github.com/JamesLMilner/terra-draw
- Azgaar Fantasy Map Generator GitHub：https://github.com/Azgaar/Fantasy-Map-Generator
- Azgaar Fantasy Map Generator 在线应用：https://azgaar.github.io/Fantasy-Map-Generator/
