# 项目组件目录结构设计

```text
Light-Up/
├─ src/
│  ├─ components/
│  │  ├─ HeaderBar.tsx                # 顶部导航：系统名称、搜索框、时间选择
│  │  ├─ LayerManagementPanel.tsx     # 左侧图层树：开关、透明度、图例
│  │  ├─ GlobalMap.tsx                # 地图主组件：MapLibre + Deck.gl 图层 + ROI绘制 + Tooltip
│  │  ├─ AnalyticsPanel.tsx           # 右侧分析面板：ECharts 时序统计图
│  │  └─ TimelineSlider.tsx           # 底部时间轴：年份/月度联动
│  ├─ data/
│  │  └─ mockData.ts                  # Mock GeoJSON网格、时序数据、时间动态计算
│  ├─ services/
│  │  └─ geeService.ts                # GEE API 预留服务层（当前为Mock）
│  ├─ types/
│  │  └─ layer.ts                     # 图层配置、时间状态、像元统计类型
│  ├─ App.tsx                         # Dashboard布局与全局状态编排
│  ├─ main.tsx                        # 应用入口
│  └─ index.css                       # Tailwind样式入口与全局样式
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.ts
├─ tsconfig.json
├─ tsconfig.app.json
└─ package.json
```
