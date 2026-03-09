import type { TimeState } from '../types/layer';

interface HeaderBarProps {
  time: TimeState;
  onSearch: (keyword: string) => void;
  onTimeChange: (next: TimeState) => void;
}

export function HeaderBar({ time, onSearch, onTimeChange }: HeaderBarProps) {
  return (
    <header className="absolute left-0 top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-700/60 bg-slate-900/80 px-5 backdrop-blur">
      <h1 className="text-lg font-semibold text-cyan-300">全球草地智能监测管理系统</h1>
      <div className="flex items-center gap-3">
        <input
          placeholder="输入地名或经纬度，例如: 90,30"
          className="w-72 rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSearch((event.target as HTMLInputElement).value);
            }
          }}
        />
        <input
          type="month"
          value={`${time.year}-${String(time.month).padStart(2, '0')}`}
          className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
          onChange={(event) => {
            const [year, month] = event.target.value.split('-').map(Number);
            onTimeChange({ year, month });
          }}
        />
      </div>
    </header>
  );
}
