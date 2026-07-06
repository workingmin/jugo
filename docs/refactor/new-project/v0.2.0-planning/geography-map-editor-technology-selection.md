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

## 产品倾向调整

补充评估意见：

`Leaflet + Leaflet-Geoman Free` 的默认心智更接近 WebGIS / 现代行政规划地图：瓦片底图、经纬度、几何图层、点线面编辑、吸附、测量等能力都很成熟，但它天然给人的感受是“在真实地图上做空间标注”。对于小说 / 剧本创作，作者更常需要的是“可自由想象、可手绘、可草图化、可贴素材、可随时改设定”的创作地图，而不是严格的行政区划或工程测绘界面。

因此，重新评估后，本选型不再只以 GIS 编辑能力为核心，而增加一个更高权重的判断维度：

- 是否符合小说 / 剧本世界观的创作风格。
- 是否支持非真实坐标、非真实比例尺、非行政规划的自由绘制。
- 是否便于上传底图、草图、纹理、图标、手写标注。
- 是否能在未来和地点、势力、事件、路线等世界观对象建立关系。

结论变化：

`Leaflet + Leaflet-Geoman Free` 不再作为默认 MVP 首选。它更适合作为后续“真实地图 / GIS 标注 / 精确空间关系”路线。当前小说 / 剧本地图编辑器 MVP 更推荐采用 `Excalidraw` 作为嵌入式创作画布。

## 数据边界

MVP 不建议强制使用 GeoJSON 作为唯一主存储。原因是 GeoJSON 更适合真实或准真实地理对象，但小说 / 剧本地图常包含草图线条、文字、纹理、图标、非规则边界、示意箭头和比例不严谨的空间关系。

建议采用“双层数据”：

1. `mapScene`：保存编辑器原生场景数据，用于完整还原画布。
2. `mapObjects`：保存 JUGO 自己关心的结构化对象，用于世界观联动、搜索、AI 校验和后续迁移。

建议节点数据：

```ts
type GeographyMapNodeData = {
  title: string
  nodeType: 'map'
  mapEngine:
    | 'excalidraw'
    | 'leaflet-geoman'
    | 'leaflet-draw'
    | 'openlayers'
    | 'maplibre-terra'
    | 'azgaar'
    | 'custom-canvas'
  visualStyle: 'sketch' | 'parchment' | 'atlas' | 'modern-map'
  mapScene: unknown
  mapObjects: Array<{
    id: string
    elementIds: string[]
    type: 'place' | 'route' | 'region' | 'faction_area' | 'event_location' | 'note'
    name: string
    description?: string
    linkedNodeIds?: string[]
  }>
  viewport: {
    center: [number, number] | null
    zoom: number
  }
  thumbnail?: string
  updatedAt?: string
}
```

对于虚构世界，坐标不一定是真实经纬度。MVP 可以把地图画布看作无限二维平面；如果后续进入真实地理底图或 GIS 场景，再为特定地图增加 GeoJSON / 投影坐标导出能力。

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
- 默认视觉和交互气质偏现代地图 / 行政规划 / GIS 标注，不太符合一般小说 / 剧本创作中的手绘地图、幻想地图、草图地图心智。
- 即使使用空白图层或图片底图，工具栏和对象编辑方式仍会让用户感到是在“编辑地理数据”，而不是“创作世界地图”。

适配结论：

不再作为 MVP 首选。它足以支撑「地图名称节点 -> 双击打开弹窗 -> 画点、线、区域、标签 -> 保存为 GeoJSON」的技术闭环，但产品气质与小说 / 剧本地图创作不够贴合。更适合后续作为“真实地图 / GIS 标注 / 精确空间关系”增强路线。

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

### 方案 F：Excalidraw 嵌入式创作画布

Excalidraw 是开源的手绘风格白板，官方仓库说明其是“open source virtual hand-drawn style whiteboard”，支持无限画布、手绘风格、图片、素材库、导出 PNG / SVG / clipboard、开放 `.excalidraw` JSON 格式、矩形、圆、箭头、线条、自由绘制、橡皮、撤销、缩放和平移等能力。参考：[Excalidraw GitHub](https://github.com/excalidraw/excalidraw)、[Excalidraw 安装文档](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation)、[initialData 文档](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/initialdata)、[Export Utilities](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export)。

许可：

- MIT

优势：

- 风格天然贴近小说 / 剧本地图创作：草图、手绘、便签、箭头、区域轮廓、自由标注都符合作者心智。
- React 组件可直接嵌入弹窗，适合当前 Vite + React 原型。
- 支持图片导入，可把手绘扫描图、AI 生成底图、Azgaar 导出图作为底图继续标注。
- 数据可用 `.excalidraw` JSON 保存，支持完整还原创作场景。
- 可导出 PNG / SVG，用于地图节点缩略图、项目展示和分享。
- 不强迫用户理解坐标系、投影、经纬度、图层数据源等 GIS 概念。

风险：

- 它不是 GIS 地图库，不能天然提供 GeoJSON、投影、测距、空间查询、真实地图瓦片等能力。
- 地图对象与世界观节点的结构化关系需要 JUGO 自己维护，例如用 `elementIds` 绑定地点、区域、路线对象。
- 如果要做“选择一个区域后自动判断事件是否发生在该区域内”之类空间推理，需要额外建立结构化对象层，不能只依赖 Excalidraw 原生元素。
- 默认是白板产品，地图专属工具栏、地点图标库、势力范围样式、羊皮纸视觉等需要二次包装。

适配结论：

MVP 新首选。它更符合“小说 / 剧本地图创作”的主观体验，并且实现成本低。建议第一版先用 Excalidraw 完成地图弹窗、地图名称、自由绘制、图片底图、导入导出、缩略图，再逐步增加 JUGO 自己的地点 / 路线 / 区域属性层。

### 方案 G：Fabric.js / Konva 自研地图画布

Fabric.js 是 Canvas 交互库，仓库定位为 JavaScript Canvas Library，并提供 SVG-to-Canvas 与 canvas-to-SVG 解析能力。Konva 是 HTML5 Canvas JavaScript 框架，面向桌面与移动端交互应用。参考：[Fabric.js GitHub](https://github.com/fabricjs/fabric.js)、[Konva GitHub](https://github.com/konvajs/konva)。

许可：

- Fabric.js：MIT
- Konva：MIT

优势：

- 产品风格完全可控，可以做成羊皮纸、奇幻地图、剧本分镜地图、城市草图等更定制的编辑器。
- 数据模型完全由 JUGO 控制，天然适合绑定地点、路线、区域、势力范围、事件发生地。
- 可以只暴露地图创作需要的工具，不继承完整白板或 GIS 产品的复杂心智。
- 后续可以把地图编辑器做成 JUGO 的长期核心能力，而不是第三方编辑器嵌入。

风险：

- MVP 成本明显高于 Excalidraw，需要自研选择、拖拽、缩放、撤销、图层、导入导出、快捷键、对齐、文本、图片、样式面板等基础能力。
- 需要更高的交互和视觉设计投入，否则容易变成简陋画板。
- 短期会拖慢“地理地图二级节点”功能闭环。

适配结论：

适合作为中长期正式产品路线，不建议作为 v0.2 MVP 的第一步。当前可以先用 Excalidraw 验证地图创作流程，同时把数据结构设计为未来可迁移到自研 Canvas。

### 方案 H：tldraw

tldraw 是 React 无限画布 SDK，接入体验很好，官方仓库提供 `<Tldraw />` 组件和 starter kits。参考：[tldraw GitHub](https://github.com/tldraw/tldraw)、[tldraw LICENSE](https://raw.githubusercontent.com/tldraw/tldraw/main/LICENSE.md)。

许可：

- 当前仓库许可证不是传统 MIT / Apache 这类宽松开源许可。其 LICENSE 明确区分开发环境和生产环境，并对生产环境使用、license key、技术 enforcement 等作出限制。

优势：

- React 集成非常顺滑。
- 无限画布、组件化、自定义 shape 能力强。
- 很适合做现代创作工具和协作画布。

风险：

- 对当前“开源地图编辑器选型”的要求不够匹配，生产环境使用存在许可和商业授权不确定性。
- 地图专属能力仍需二次开发。

适配结论：

暂不纳入 MVP 候选。除非后续明确接受商业授权或 license key 方案，否则不建议作为 JUGO 地图编辑器底座。

## 对比表

| 方案 | 许可 | 接入成本 | 编辑能力 | 创作风格适配 | 结构化数据可控性 | MVP 适配度 |
| --- | --- | --- | --- | --- | --- | --- |
| Excalidraw | MIT | 低 | 中高 | 高 | 中 | 高 |
| Leaflet + Leaflet-Geoman Free | BSD-2 + MIT | 低 | 高 | 中低 | 高 | 中 |
| Leaflet + Leaflet.draw | BSD-2 + MIT | 低 | 中 | 中低 | 高 | 中低 |
| OpenLayers | BSD-2 | 中高 | 高 | 低 | 高 | 中低 |
| MapLibre + Terra Draw | BSD-3 + MIT | 高 | 中高 | 中低 | 高 | 中低 |
| Azgaar FMG | MIT | 高 | 很高 | 很高 | 中低 | 中低 |
| Fabric.js / Konva 自研 | MIT | 高 | 可定制 | 高 | 高 | 中 |
| tldraw | 非传统宽松开源许可 | 低 | 高 | 高 | 中 | 低 |

## 推荐方案

MVP 推荐采用：

```text
Excalidraw embedded editor + JUGO map object metadata
```

推荐原因：

1. 更贴近小说 / 剧本作者的地图创作心智：草图、手绘、自由标注、图片底图、非真实比例尺。
2. 接入成本低，可作为 React 组件直接嵌入「地图编辑器」弹窗。
3. 可快速形成「地图名称节点 -> 双击打开弹窗 -> 创作地图 -> 保存场景 -> 生成缩略图」闭环。
4. 不依赖真实地图瓦片服务，不会默认把用户带入行政规划或 GIS 标注语境。
5. `.excalidraw` JSON 可完整保存画布，PNG / SVG 导出可用于缩略图和分享。
6. 结构化世界观关系由 JUGO 自己维护，避免被第三方地图或白板数据模型锁死。

调整后的定位：

- `Excalidraw`：v0.2 MVP 地图编辑器底座。
- `Leaflet + Leaflet-Geoman Free`：后续真实地图 / GIS 标注 / 精确地理关系路线。
- `Azgaar FMG`：奇幻地图生成参考和未来导入来源，不直接内嵌。
- `Fabric.js / Konva`：中长期自研地图编辑器底座候选。
- `tldraw`：因生产许可限制，暂不进入 MVP。

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
  - 导入 / 导出 `.excalidraw` JSON
  - 导出 PNG 缩略图

### 第二阶段：Excalidraw 编辑闭环

- 在弹窗内嵌入 Excalidraw。
- 初始化地图模板：
  - 空白草图
  - 羊皮纸背景
  - 城市关系图
  - 区域 / 势力范围草图
- 支持图片底图导入。
- 保存时写回当前地图节点：
  - `mapScene`
  - `viewport`
  - `thumbnail`
  - `updatedAt`
- 导出 `.excalidraw` JSON 和 PNG。

### 第三阶段：世界观联动

- 在 Excalidraw 元素之上增加 JUGO 地图对象层：
  - 名称
  - 类型：地点 / 路线 / 区域 / 势力范围 / 事件发生地
  - 描述
  - 绑定的 Excalidraw `elementIds`
  - 关联已有世界观节点
- 百科仓库中可从地点、势力、事件跳回地图对象。
- AI 校验可读取地图对象与世界观节点关系，例如地点归属冲突、路线穿越禁区、事件地点不存在。

### 第四阶段：按需引入 GIS 能力

- 如果需要真实地图底图、经纬度、测距、投影或空间查询，再新增 Leaflet / OpenLayers 地图类型。
- 如果需要自动生成奇幻大陆、国家、文化、宗教、河流等复杂地图，提供 Azgaar 导入流程，而不是把 Azgaar 直接嵌入弹窗。

## 决策记录

当前决策：

```text
MVP 采用 Excalidraw 嵌入式创作画布。
地图数据保存为 mapScene + JUGO mapObjects。
GeoJSON 不作为 MVP 唯一主存储，只作为后续 GIS 路线的可选导出 / 扩展格式。
Leaflet + Leaflet-Geoman Free 暂不作为首选，保留为真实地图 / GIS 标注路线。
Azgaar FMG 暂不内嵌，只作为参考和未来导入方向。
```

后续触发重新评估的条件：

- 需要真实 GIS 投影、多数据源和专业空间分析时，重新评估 OpenLayers。
- 需要高性能矢量瓦片、WebGL 视觉和动态样式时，重新评估 MapLibre + Terra Draw。
- 需要自动生成完整奇幻地图时，评估 Azgaar FMG 的导入 / 旁路生成流程，而不是直接替换 JUGO 地图编辑器。
- 需要完全产品化的专属地图编辑体验时，评估 Fabric.js / Konva 自研路线。

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
- Excalidraw GitHub：https://github.com/excalidraw/excalidraw
- Excalidraw 安装文档：https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation
- Excalidraw initialData 文档：https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/initialdata
- Excalidraw Export Utilities：https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export
- Excalidraw LICENSE：https://raw.githubusercontent.com/excalidraw/excalidraw/master/LICENSE
- Fabric.js GitHub：https://github.com/fabricjs/fabric.js
- Konva GitHub：https://github.com/konvajs/konva
- tldraw GitHub：https://github.com/tldraw/tldraw
- tldraw LICENSE：https://raw.githubusercontent.com/tldraw/tldraw/main/LICENSE.md
