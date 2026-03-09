import type { TimeState } from '../types/layer';

/**
 * GEE 接口适配层（Mock 版本）。
 * 后续可替换为真实 fetch / OAuth2 鉴权流程并映射 GEE 资产地址。
 */
export async function fetchGeeLayerTileUrl(layerId: string, time: TimeState): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return `mock://gee/${layerId}?year=${time.year}&month=${time.month}`;
}
