import type { MindMap } from "@/lib/types";

const WIDTH = 900;
const HEIGHT = 560;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const R1 = 150;
const R2 = 250;

interface Positioned {
  id: string;
  label: string;
  level: number;
  x: number;
  y: number;
}

function layout(mindMap: MindMap): { nodes: Positioned[]; edges: { from: Positioned; to: Positioned }[] } {
  const byId = new Map(mindMap.nodes.map((n) => [n.id, n]));
  const adjacency = new Map<string, string[]>();
  for (const n of mindMap.nodes) adjacency.set(n.id, []);
  for (const e of mindMap.edges) {
    adjacency.get(e.from)?.push(e.to);
    adjacency.get(e.to)?.push(e.from);
  }

  const rootId = byId.has("1") ? "1" : mindMap.nodes[0]?.id;
  const positions = new Map<string, Positioned>();
  if (!rootId) return { nodes: [], edges: [] };

  positions.set(rootId, { id: rootId, label: byId.get(rootId)!.label, level: 0, x: CENTER.x, y: CENTER.y });

  const level1Ids = (adjacency.get(rootId) ?? []).filter((id) => id !== rootId);
  const l1Count = level1Ids.length || 1;

  level1Ids.forEach((id, i) => {
    const angle = (2 * Math.PI * i) / l1Count - Math.PI / 2;
    const node = byId.get(id);
    if (!node) return;
    positions.set(id, {
      id,
      label: node.label,
      level: 1,
      x: CENTER.x + R1 * Math.cos(angle),
      y: CENTER.y + R1 * Math.sin(angle),
    });
  });

  level1Ids.forEach((parentId, i) => {
    const parentAngle = (2 * Math.PI * i) / l1Count - Math.PI / 2;
    const sector = (2 * Math.PI) / l1Count;
    const children = (adjacency.get(parentId) ?? []).filter(
      (id) => id !== rootId && !positions.has(id)
    );
    const cCount = children.length || 1;
    children.forEach((id, j) => {
      const node = byId.get(id);
      if (!node) return;
      const spread = sector * 0.8;
      const angle = parentAngle - spread / 2 + (spread * j) / Math.max(cCount - 1, 1);
      positions.set(id, {
        id,
        label: node.label,
        level: 2,
        x: CENTER.x + R2 * Math.cos(cCount === 1 ? parentAngle : angle),
        y: CENTER.y + R2 * Math.sin(cCount === 1 ? parentAngle : angle),
      });
    });
  });

  const nodes = Array.from(positions.values());
  const edges = mindMap.edges
    .map((e) => {
      const from = positions.get(e.from);
      const to = positions.get(e.to);
      return from && to ? { from, to } : null;
    })
    .filter((e): e is { from: Positioned; to: Positioned } => Boolean(e));

  return { nodes, edges };
}

const RADIUS_BY_LEVEL = [9, 6, 4];
const FILL_BY_LEVEL = ["fill-amber", "fill-teal", "fill-ink"];

export default function ConstellationMap({ mindMap }: { mindMap: MindMap }) {
  const { nodes, edges } = layout(mindMap);
  if (nodes.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-hairline bg-panel/60 p-4">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="min-w-[640px] w-full" role="img" aria-label="Mind map">
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.from.x}
            y1={e.from.y}
            x2={e.to.x}
            y2={e.to.y}
            stroke="#29314A"
            strokeWidth={1}
            className="transition-colors"
          />
        ))}
        {nodes.map((n) => (
          <g key={n.id} className="group">
            <circle
              cx={n.x}
              cy={n.y}
              r={RADIUS_BY_LEVEL[n.level]}
              className={`${FILL_BY_LEVEL[n.level]} transition-all group-hover:brightness-125`}
            >
              <title>{n.label}</title>
            </circle>
            <text
              x={n.x + (n.x > CENTER.x ? RADIUS_BY_LEVEL[n.level] + 8 : -(RADIUS_BY_LEVEL[n.level] + 8))}
              y={n.y + 4}
              textAnchor={n.x > CENTER.x ? "start" : "end"}
              className={
                n.level === 0
                  ? "fill-ink font-display text-[18px] italic"
                  : n.level === 1
                  ? "fill-ink font-body text-[13px]"
                  : "fill-muted font-body text-[11px]"
              }
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
