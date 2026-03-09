import type { LayerConfig } from '../types/layer';

interface LayerManagementPanelProps {
  layers: LayerConfig[];
  onVisibilityChange: (layerId: string, visible: boolean) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

const categoryLabel: Record<string, string> = {
  base: '基础底图',
  grassland: '草地类型分布',
  eco: '生态指标图层',
  meteo: '气象因子图层',
};

export function LayerManagementPanel({ layers, onVisibilityChange, onOpacityChange }: LayerManagementPanelProps) {
  return (
    <aside className="absolute left-3 top-20 z-20 h-[calc(100%-150px)] w-80 overflow-auto rounded-lg border border-slate-700/70 bg-slate-900/85 p-4 backdrop-blur">
      <h2 className="mb-3 text-base font-semibold text-cyan-300">图层管理</h2>
      {Object.entries(categoryLabel).map(([key, label]) => {
        const group = layers.filter((layer) => layer.category === key);
        if (!group.length) return null;
        return (
          <section key={key} className="mb-4 rounded border border-slate-700/60 p-3">
            <h3 className="mb-2 text-sm font-medium text-slate-200">{label}</h3>
            {group.map((layer) => (
              <div key={layer.id} className="mb-3 rounded bg-slate-800/70 p-2">
                <label className="mb-1 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={(event) => onVisibilityChange(layer.id, event.target.checked)}
                  />
                  {layer.name}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={layer.opacity}
                  className="w-full"
                  onChange={(event) => onOpacityChange(layer.id, Number(event.target.value))}
                />
                <div className="mt-1 flex flex-wrap gap-2">
                  {layer.legend.map((item) => (
                    <div key={item.label} className="flex items-center gap-1 text-[10px] text-slate-300">
                      <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </aside>
  );
}
