export type LayerCategory = 'base' | 'grassland' | 'eco' | 'meteo';

export interface LayerConfig {
  id: string;
  name: string;
  category: LayerCategory;
  visible: boolean;
  opacity: number;
  legend: Array<{ color: string; label: string }>;
  dynamicByTime?: boolean;
}

export interface TimeState {
  year: number;
  month: number;
}

export interface PixelStat {
  ndvi: number;
  precipitation: number;
  lst: number;
  npp: number;
}
