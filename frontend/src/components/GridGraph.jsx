import { useMemo } from 'react';
import { Background, Handle, MarkerType, Position, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fmt } from '../services/validation.js';

const COLORS = { normal: '#7db99d', warning: '#d9ad61', overloaded: '#e38b88', plain: '#80a3b0', out: '#8795a1' };

function BusNode({ data }) {
  return (
    <div
      className={`min-w-[92px] rounded-md border-2 bg-panel px-3 py-1.5 text-center text-ink ${data.isRef ? 'border-sky-400/75' : 'border-line'}`}
    >
      <Handle type="target" position={Position.Top} className="!top-1/2 opacity-0" isConnectable={false} />
      <p className="text-sm font-semibold leading-tight">{data.id}{data.isRef ? ' (ref)' : ''}</p>
      <p className="text-[11px] leading-tight text-muted">{data.name}</p>
      <p className="text-[11px] leading-tight tabular-nums">G {fmt(data.generation, 2)} / D {fmt(data.demand, 2)}</p>
      <Handle type="source" position={Position.Bottom} className="!top-1/2 opacity-0" isConnectable={false} />
    </div>
  );
}
const nodeTypes = { bus: BusNode };

/**
 * Network diagram. `results` (optional) is an array of {line_id, signed_flow, loading_pct, status}
 * and colours/labels the lines. `outageLineId` draws that line dashed and grey.
 */
export default function GridGraph({ grid, results, outageLineId, height = 380 }) {
  const { nodes, edges } = useMemo(() => {
    const n = grid.buses.length;
    const radius = Math.max(110, 34 * n);
    const nodes = grid.buses.map((b, i) => {
      const a = (2 * Math.PI * i) / n - Math.PI / 2;
      return {
        id: b.id, type: 'bus', draggable: false,
        position: { x: radius * 1.5 * Math.cos(a), y: radius * Math.sin(a) },
        data: { id: b.id, name: b.name, generation: b.generation, demand: b.demand, isRef: b.id === grid.referenceBus },
      };
    });
    const byId = Object.fromEntries((results || []).map((r) => [r.line_id, r]));
    const edges = grid.lines
      .filter((l) => grid.buses.some((b) => b.id === l.from_bus) && grid.buses.some((b) => b.id === l.to_bus))
      .map((l) => {
        const r = byId[l.id];
        const out = l.id === outageLineId;
        const color = out ? COLORS.out : r ? COLORS[r.status] || COLORS.plain : COLORS.plain;
        const reverse = r && r.signed_flow < 0;
        const arrow = { type: MarkerType.ArrowClosed, color, width: 16, height: 16 };
        let label = `${l.id}  x=${l.reactance}  cap ${l.capacity}`;
        if (out) label = `${l.id} OUT`;
        else if (r) label = `${l.id}  ${fmt(Math.abs(r.signed_flow), 3)}/${l.capacity} (${fmt(r.loading_pct, 0)}%)`;
        return {
          id: l.id, source: l.from_bus, target: l.to_bus, label,
          markerEnd: r && !reverse && !out ? arrow : undefined,
          markerStart: r && reverse && !out ? arrow : undefined,
          style: { stroke: color, strokeWidth: r ? 2 + Math.min(r.loading_pct, 120) / 40 : 2, strokeDasharray: out ? '6 5' : undefined },
          labelBgPadding: [4, 2], labelBgBorderRadius: 3,
        };
      });
    return { nodes, edges };
  }, [grid, results, outageLineId]);

  return (
    <div style={{ height }} className="overflow-hidden rounded-md border border-line bg-inset" role="group"
      aria-label={`Network diagram with ${grid.buses.length} buses and ${grid.lines.length} lines`}>
      <ReactFlow
        colorMode="dark"
        className="[--xy-background-color:theme(colors.inset)] [--xy-background-pattern-color:theme(colors.line)]
          [--xy-edge-label-background-color:theme(colors.panel)] [--xy-edge-label-color:theme(colors.ink)]
          [--xy-attribution-background-color:theme(colors.panel)] [&_text]:text-[11px]"
        nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
        zoomOnScroll={false} preventScrolling={false} minZoom={0.3}
      >
        <Background gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}

export function GraphLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      {[['normal', 'Below 80% of capacity'], ['warning', '80-100%'], ['overloaded', 'Above 100%'], ['out', 'Outaged line']].map(([k, t]) => (
        <li key={k} className="flex items-center gap-1.5">
          <svg aria-hidden="true" className="h-1 w-5" viewBox="0 0 20 4">
            <path d="M0 2h20" stroke={COLORS[k]} strokeWidth="3" strokeDasharray={k === 'out' ? '5 3' : undefined} />
          </svg>
          {t}
        </li>
      ))}
      <li>Arrow = direction of power flow. Blue border = reference bus.</li>
    </ul>
  );
}
