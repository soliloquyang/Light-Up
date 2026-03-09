import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { PixelStat, TimeState } from '../types/layer';

const grasslandTypes = ['高寒草甸', '温带草原', '热带稀树草原'] as const;

/**
 * 生成一个简化版全球网格数据，用于演示 Deck.gl 在大范围生态监测中的渲染能力。
 */
export function generateGrasslandGrid(): FeatureCollection<Polygon> {
  const features: Feature<Polygon>[] = [];
  const step = 20;

  for (let lng = -180; lng < 180; lng += step) {
    for (let lat = -60; lat < 80; lat += step) {
      const typeIndex = Math.floor((lng + lat + 360) % grasslandTypes.length);
      const ndvi = Math.max(0.1, Math.min(0.95, 0.45 + (lat / 140) + ((lng % 40) / 100)));
      const precipitation = 40 + ((lat + 70) * 2.2 + (Math.abs(lng) % 60));
      const lst = 12 + (30 - Math.abs(lat) * 0.3) + ((lng % 30) / 3);
      const npp = 120 + ndvi * 420;

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lng, lat],
            [lng + step, lat],
            [lng + step, lat + step],
            [lng, lat + step],
            [lng, lat],
          ]],
        },
        properties: {
          type: grasslandTypes[typeIndex],
          ndvi,
          precipitation,
          lst,
          npp,
          soilMoisture: ndvi * 0.5 + 0.2,
          snowCover: Math.max(0, (Math.abs(lat) - 25) / 40),
        },
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}

export function createTimeAwareStat(base: PixelStat, time: TimeState): PixelStat {
  const seasonal = Math.sin((time.month / 12) * Math.PI * 2);
  const yearlyTrend = (time.year - 2015) * 0.015;
  return {
    ndvi: Number((base.ndvi + seasonal * 0.08 + yearlyTrend).toFixed(3)),
    precipitation: Number((base.precipitation + seasonal * 22 + yearlyTrend * 25).toFixed(2)),
    lst: Number((base.lst + seasonal * 6 + yearlyTrend * 8).toFixed(2)),
    npp: Number((base.npp + seasonal * 30 + yearlyTrend * 100).toFixed(2)),
  };
}

export function buildMockTimeSeries(): Array<{ time: string; ndvi: number; precipitation: number }> {
  const points: Array<{ time: string; ndvi: number; precipitation: number }> = [];

  for (let year = 2015; year <= 2024; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const seasonal = Math.sin((month / 12) * Math.PI * 2);
      points.push({
        time: `${year}-${String(month).padStart(2, '0')}`,
        ndvi: Number((0.48 + seasonal * 0.11 + (year - 2015) * 0.01).toFixed(3)),
        precipitation: Number((86 + seasonal * 28 + (year - 2015) * 1.5).toFixed(2)),
      });
    }
  }

  return points;
}
