import type { TimeState } from '../types/layer';

interface TimelineSliderProps {
  time: TimeState;
  onChange: (time: TimeState) => void;
}

const start = 2015;
const end = 2024;

export function TimelineSlider({ time, onChange }: TimelineSliderProps) {
  const totalSteps = (end - start + 1) * 12 - 1;
  const currentStep = (time.year - start) * 12 + (time.month - 1);

  return (
    <footer className="absolute bottom-0 left-0 z-20 w-full border-t border-slate-700/60 bg-slate-900/85 px-6 py-3 backdrop-blur">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
        <span>时序播放控制（生态/气象图层同步更新）</span>
        <span>{time.year}年{time.month}月</span>
      </div>
      <input
        type="range"
        min={0}
        max={totalSteps}
        value={currentStep}
        className="w-full"
        onChange={(event) => {
          const step = Number(event.target.value);
          const year = start + Math.floor(step / 12);
          const month = (step % 12) + 1;
          onChange({ year, month });
        }}
      />
    </footer>
  );
}
