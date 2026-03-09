import ReactECharts from 'echarts-for-react';

interface AnalyticsPanelProps {
  collapsed: boolean;
  onToggle: () => void;
  series: Array<{ time: string; ndvi: number; precipitation: number }>;
}

export function AnalyticsPanel({ collapsed, onToggle, series }: AnalyticsPanelProps) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#cbd5e1' } },
    xAxis: {
      type: 'category',
      data: series.map((item) => item.time),
      axisLabel: { color: '#94a3b8', showMinLabel: true, showMaxLabel: true },
    },
    yAxis: [
      { type: 'value', name: 'NDVI', axisLabel: { color: '#94a3b8' } },
      { type: 'value', name: '降水(mm)', axisLabel: { color: '#94a3b8' } },
    ],
    series: [
      { name: 'NDVI', type: 'line', smooth: true, data: series.map((item) => item.ndvi) },
      { name: '降水', type: 'line', smooth: true, yAxisIndex: 1, data: series.map((item) => item.precipitation) },
    ],
  };

  return (
    <aside className={`absolute right-3 top-20 z-20 h-[calc(100%-150px)] rounded-lg border border-slate-700/70 bg-slate-900/85 backdrop-blur transition-all ${collapsed ? 'w-12' : 'w-[420px]'}`}>
      <button className="h-10 w-full border-b border-slate-700 text-sm text-cyan-300" onClick={onToggle}>
        {collapsed ? '展开分析' : '收起分析'}
      </button>
      {!collapsed && (
        <div className="h-[calc(100%-40px)] p-2">
          <h3 className="mb-1 text-sm text-slate-200">ROI 时序统计（Mock）</h3>
          <ReactECharts style={{ height: '95%', width: '100%' }} option={option} notMerge lazyUpdate />
        </div>
      )}
    </aside>
  );
}
