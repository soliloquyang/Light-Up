import { useMemo, useState } from 'react';
import { DeckGL } from '@deck.gl/react';
import { BitmapLayer, GeoJsonLayer, PolygonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { Map } from 'react-map-gl/maplibre';
import type { FeatureCollection, GeoJsonProperties, Polygon } from 'geojson';
import type { LayerConfig, PixelStat, TimeState } from '../types/layer';
import { createTimeAwareStat } from '../data/mockData';

interface GlobalMapProps {
  layers: LayerConfig[];
  time: TimeState;
  gridData: FeatureCollection<Polygon>;
  onRoiFinished: () => void;
}

const grassTypeColor: Record<string, [number, number, number]> = {
  高寒草甸: [56, 189, 248],
  温带草原: [132, 204, 22],
  热带稀树草原: [250, 204, 21],
};

const INITIAL_VIEW_STATE = {
  longitude: 95,
  latitude: 35,
  zoom: 2.2,
  pitch: 35,
  bearing: 0,
};

export function GlobalMap({ layers, time, gridData, onRoiFinished }: GlobalMapProps) {
  const [vertices, setVertices] = useState<Array<[number, number]>>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; title: string; stat: PixelStat } | null>(null);

  const layerMap = useMemo(() => Object.fromEntries(layers.map((layer) => [layer.id, layer])), [layers]);

  const deckLayers = useMemo(() => {
    const result: any[] = [];

    if (layerMap.satellite?.visible) {
      result.push(
        new TileLayer({
          id: 'satellite-base',
          data: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          minZoom: 0,
          maxZoom: 19,
          opacity: layerMap.satellite.opacity,
          renderSubLayers: (props: any) => {
            const { boundingBox } = props.tile;
            return new BitmapLayer(props, {
              data: null,
              image: props.data,
              bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]],
            });
          },
        }),
      );
    }

    if (layerMap.grasslandType?.visible) {
      result.push(
        new GeoJsonLayer({
          id: 'grassland-type-layer',
          data: gridData,
          pickable: true,
          opacity: layerMap.grasslandType.opacity,
          filled: true,
          stroked: true,
          getLineColor: [15, 23, 42, 180],
          getFillColor: (feature) => {
            const color = grassTypeColor[String(feature.properties?.type)] ?? [148, 163, 184];
            return [...color, 170];
          },
          onHover: (info) => {
            if (!info.object) return setTooltip(null);
            const props = info.object.properties as GeoJsonProperties;
            const base: PixelStat = {
              ndvi: Number(props.ndvi),
              precipitation: Number(props.precipitation),
              lst: Number(props.lst),
              npp: Number(props.npp),
            };
            setTooltip({ x: info.x ?? 0, y: info.y ?? 0, title: String(props.type), stat: createTimeAwareStat(base, time) });
          },
        }),
      );
    }

    if (layerMap.ndvi?.visible) {
      result.push(
        new GeoJsonLayer({
          id: 'ndvi-layer',
          data: gridData,
          opacity: layerMap.ndvi.opacity,
          filled: true,
          stroked: false,
          blendOperation: 'add',
          getFillColor: (feature) => {
            const value = createTimeAwareStat({ ndvi: Number(feature.properties?.ndvi), precipitation: 0, lst: 0, npp: 0 }, time).ndvi;
            return [20, Math.round(70 + value * 180), 70, 120];
          },
        }),
      );
    }

    if (layerMap.precipitation?.visible) {
      result.push(
        new GeoJsonLayer({
          id: 'precipitation-layer',
          data: gridData,
          opacity: layerMap.precipitation.opacity,
          filled: true,
          stroked: false,
          blendOperation: 'add',
          getFillColor: (feature) => {
            const value = createTimeAwareStat({ ndvi: 0, precipitation: Number(feature.properties?.precipitation), lst: 0, npp: 0 }, time).precipitation;
            return [20, 100, Math.min(255, Math.round(value)), 90];
          },
        }),
      );
    }

    if (vertices.length >= 2) {
      result.push(
        new PolygonLayer({
          id: 'roi-polygon',
          data: [{ polygon: vertices.length > 2 ? [...vertices, vertices[0]] : vertices }],
          getPolygon: (d: any) => d.polygon,
          getFillColor: [34, 197, 94, 50],
          getLineColor: [34, 197, 94, 220],
          lineWidthMinPixels: 2,
        }),
      );
    }

    result.push(
      new ScatterplotLayer({
        id: 'roi-vertices',
        data: vertices,
        getPosition: (d: [number, number]) => d,
        getRadius: 60000,
        radiusMinPixels: 3,
        getFillColor: [34, 197, 94, 240],
      }),
    );

    return result;
  }, [gridData, layerMap, time, vertices]);

  return (
    <div className="h-full w-full">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={deckLayers}
        onClick={(info) => {
          if (!info.coordinate) return;
          setVertices((prev) => [...prev, [info.coordinate![0], info.coordinate![1]]]);
        }}
      >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
      </DeckGL>

      <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded border border-slate-700 bg-slate-900/90 p-2 text-xs">
        <span>ROI绘制：点击地图添加顶点</span>
        <button
          className="rounded bg-emerald-600 px-2 py-1"
          onClick={() => {
            if (vertices.length >= 3) onRoiFinished();
          }}
        >
          完成绘制
        </button>
        <button className="rounded bg-slate-700 px-2 py-1" onClick={() => setVertices([])}>
          清空
        </button>
      </div>

      {tooltip && (
        <div className="pointer-events-none absolute z-30 rounded border border-cyan-500/40 bg-slate-900/90 p-2 text-xs" style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}>
          <div className="font-semibold text-cyan-300">{tooltip.title}</div>
          <div>NDVI: {tooltip.stat.ndvi}</div>
          <div>降水: {tooltip.stat.precipitation} mm</div>
          <div>LST: {tooltip.stat.lst} ℃</div>
          <div>NPP: {tooltip.stat.npp}</div>
        </div>
      )}
    </div>
  );
}
