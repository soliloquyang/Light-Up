import { useMemo, useState } from 'react';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { GlobalMap } from './components/GlobalMap';
import { HeaderBar } from './components/HeaderBar';
import { LayerManagementPanel } from './components/LayerManagementPanel';
import { TimelineSlider } from './components/TimelineSlider';
import { buildMockTimeSeries, generateGrasslandGrid } from './data/mockData';
import { fetchGeeLayerTileUrl } from './services/geeService';
import type { LayerConfig, TimeState } from './types/layer';

const initialLayers: LayerConfig[] = [
  {
    id: 'satellite',
    name: '卫星影像底图',
    category: 'base',
    visible: false,
    opacity: 1,
    legend: [{ color: '#64748b', label: '影像纹理' }],
  },
  {
    id: 'darkMatter',
    name: 'Dark Matter 底图',
    category: 'base',
    visible: true,
    opacity: 1,
    legend: [{ color: '#0f172a', label: '深色底图' }],
  },
  {
    id: 'grasslandType',
    name: '全球草地类型分类',
    category: 'grassland',
    visible: true,
    opacity: 0.65,
    legend: [
      { color: '#38bdf8', label: '高寒草甸' },
      { color: '#84cc16', label: '温带草原' },
      { color: '#facc15', label: '热带稀树草原' },
    ],
  },
  {
    id: 'ndvi',
    name: '植被指数 NDVI',
    category: 'eco',
    visible: true,
    opacity: 0.45,
    dynamicByTime: true,
    legend: [{ color: '#16a34a', label: '低→高植被活性' }],
  },
  {
    id: 'precipitation',
    name: '降水热力图',
    category: 'meteo',
    visible: true,
    opacity: 0.35,
    dynamicByTime: true,
    legend: [{ color: '#0284c7', label: '低→高降水' }],
  },
];

function App() {
  const [layers, setLayers] = useState(initialLayers);
  const [time, setTime] = useState<TimeState>({ year: 2021, month: 7 });
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const gridData = useMemo(() => generateGrasslandGrid(), []);
  const chartSeries = useMemo(() => buildMockTimeSeries(), []);

  const handleTimeChange = async (next: TimeState) => {
    setTime(next);
    const activeDynamic = layers.filter((layer) => layer.visible && layer.dynamicByTime);
    await Promise.all(activeDynamic.map((layer) => fetchGeeLayerTileUrl(layer.id, next)));
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <HeaderBar
        time={time}
        onTimeChange={handleTimeChange}
        onSearch={(keyword) => {
          // 预留：未来可接入地名服务（Nominatim/GEE Geometry）定位。
          // 当前仅演示输入联动与可扩展结构。
          // eslint-disable-next-line no-console
          console.log('搜索关键词:', keyword);
        }}
      />

      <LayerManagementPanel
        layers={layers}
        onVisibilityChange={(layerId, visible) => {
          setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, visible } : layer)));
        }}
        onOpacityChange={(layerId, opacity) => {
          setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, opacity } : layer)));
        }}
      />

      <AnalyticsPanel collapsed={panelCollapsed} onToggle={() => setPanelCollapsed((prev) => !prev)} series={chartSeries} />

      <GlobalMap layers={layers} time={time} gridData={gridData} onRoiFinished={() => setPanelCollapsed(false)} />

      <TimelineSlider time={time} onChange={handleTimeChange} />
    </div>
  );
}

export default App;
