import type { SchemaZone } from '../../types';

interface Props {
  completedZones: SchemaZone[];
  currentZone: SchemaZone | null;
  onZoneClick: (zone: SchemaZone) => void;
  heelType?: 'heel-flap' | 'short-row';
}

// ── Heel-Flap + Gusset variant ────────────────────────────────────────────────
//
//  (65,15)────────────(150,15)
//  │       CUFF                │
//  (65,55)────────────(150,55)
//  │       LEG                 │
//  (65,150)──(105,150)──(150,150)────────────(238,150)
//  │  HEEL  │  GUSSET  │         FOOT        │ TOE ╮
//  │  FLAP  │ (trap.)  │                     │     │
//  (65,218)  (105,218)  (150,210)─────────────(238,210)
//  ╰───Q(85,265)╯
//   HEEL TURN

const HF_ZONES: { id: SchemaZone; label: string[] }[] = [
  { id: 'cuff',       label: ['Cuff'] },
  { id: 'leg',        label: ['Leg'] },
  { id: 'heel-flap',  label: ['Heel', 'Flap'] },
  { id: 'heel-turn',  label: ['Heel', 'Turn'] },
  { id: 'gusset',     label: ['Gusset'] },
  { id: 'foot',       label: ['Foot'] },
  { id: 'toe',        label: ['Toe'] },
];

const HF_PATHS: Record<string, string> = {
  cuff:        'M 65,15 L 150,15 L 150,55 L 65,55 Z',
  leg:         'M 65,55 L 150,55 L 150,150 L 65,150 Z',
  'heel-flap': 'M 65,150 L 105,150 L 105,218 L 65,218 Z',
  'heel-turn': 'M 65,218 L 105,218 Q 85,265 65,218 Z',
  gusset:      'M 105,150 L 150,150 L 150,210 L 105,218 Z',
  foot:        'M 150,150 L 238,150 L 238,210 L 150,210 Z',
  toe:         'M 238,150 C 262,150 262,210 238,210 L 238,150 Z',
};

const HF_OUTLINE =
  'M 65,15 L 150,15 L 150,150 L 238,150 C 262,150 262,210 238,210 L 150,210 L 105,218 Q 85,265 65,218 L 65,15 Z';

const HF_LABEL: Record<string, { x: number; y: number; size: number }> = {
  cuff:        { x: 107, y: 35,  size: 9   },
  leg:         { x: 107, y: 102, size: 10  },
  'heel-flap': { x: 85,  y: 186, size: 8   },
  'heel-turn': { x: 85,  y: 230, size: 8   },
  gusset:      { x: 128, y: 174, size: 8.5 },
  foot:        { x: 194, y: 180, size: 9   },
  toe:         { x: 248, y: 180, size: 9   },
};

// ── Short-Row Heel variant ────────────────────────────────────────────────────
//
//  (65,15)────────────(145,15)
//  │       CUFF               │
//  (65,55)────────────(145,55)
//  │       LEG                │
//  (65,155)──◥(125,155)──────────────(265,155)
//  │  SR  ╲   │         FOOT         │ TOE ╮
//  │ HEEL  ╲  │                      │     │
//  (65,205)───────────────────────────(265,205)
//
//  The short-row heel is a triangle at the inside corner of the L:
//  (65,155)–(125,155)–(65,205)

const SR_ZONES: { id: SchemaZone; label: string[] }[] = [
  { id: 'cuff',           label: ['Cuff'] },
  { id: 'leg',            label: ['Leg'] },
  { id: 'short-row-heel', label: ['Short', 'Row', 'Heel'] },
  { id: 'foot',           label: ['Foot'] },
  { id: 'toe',            label: ['Toe'] },
];

const SR_PATHS: Record<string, string> = {
  cuff:             'M 65,15 L 145,15 L 145,55 L 65,55 Z',
  leg:              'M 65,55 L 145,55 L 145,155 L 65,155 Z',
  'short-row-heel': 'M 65,155 L 125,155 L 65,205 Z',
  foot:             'M 125,155 L 265,155 L 265,205 L 65,205 Z',
  toe:              'M 265,155 C 290,155 290,205 265,205 L 265,155 Z',
};

const SR_OUTLINE =
  'M 65,15 L 145,15 L 145,155 L 265,155 C 290,155 290,205 265,205 L 65,205 L 65,15 Z';

const SR_LABEL: Record<string, { x: number; y: number; size: number }> = {
  cuff:             { x: 105, y: 35,  size: 9 },
  leg:              { x: 105, y: 105, size: 10 },
  'short-row-heel': { x: 85,  y: 172, size: 7 },
  foot:             { x: 180, y: 180, size: 9 },
  toe:              { x: 275, y: 180, size: 9 },
};

// ── Shared color helpers (CSS variables — theme-aware) ────────────────────────
// Using inline style={{ fill/stroke }} so CSS custom properties resolve correctly.
// SVG presentation attributes (fill="...") do NOT resolve var(), but style does.

function zoneFill(completed: boolean, current: boolean): string {
  if (current)   return 'var(--color-rose-dusty)';
  if (completed) return 'var(--color-sage)';
  return 'var(--color-cream-200)';
}

function zoneStroke(completed: boolean, current: boolean): string {
  if (current)   return 'var(--color-rose-dark)';
  if (completed) return 'var(--color-sage-dark)';
  return 'var(--color-cream-300)';
}

function zoneLabelColor(completed: boolean, current: boolean): string {
  if (current || completed) return '#fff';
  return 'var(--color-text-soft)';
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SockDiagram({ completedZones, currentZone, onZoneClick, heelType = 'heel-flap' }: Props) {
  const isHF    = heelType === 'heel-flap';
  const zones   = isHF ? HF_ZONES   : SR_ZONES;
  const paths   = isHF ? HF_PATHS   : SR_PATHS;
  const labels  = isHF ? HF_LABEL   : SR_LABEL;
  const outline = isHF ? HF_OUTLINE : SR_OUTLINE;
  const viewBox = isHF ? '52 8 222 278' : '52 8 245 205';
  const ribbingX2 = isHF ? 148 : 143;
  const needleX2  = isHF ? 153 : 147;

  return (
    <div className="flex justify-center items-center">
      <svg
        viewBox={viewBox}
        className="w-full"
        style={{ maxHeight: '360px' }}
        aria-label="Interactive sock diagram"
      >
        {/* Outer sock silhouette */}
        <path
          d={outline}
          style={{ fill: 'var(--color-cream-200)', stroke: 'var(--color-cream-300)' }}
          strokeWidth="2"
        />

        {/* Clickable zones */}
        {zones.map(({ id, label }) => {
          const isCompleted = completedZones.includes(id);
          const isCurrent   = currentZone === id;
          const fill        = zoneFill(isCompleted, isCurrent);
          const stroke      = zoneStroke(isCompleted, isCurrent);
          const textColor   = zoneLabelColor(isCompleted, isCurrent);
          const opacity     = !isCompleted && !isCurrent ? 0.55 : 1;
          const lbl         = labels[id];

          return (
            <g key={id} onClick={() => onZoneClick(id)} style={{ cursor: 'pointer' }} opacity={opacity}>
              <path
                d={paths[id]}
                style={{ fill, stroke }}
                strokeWidth={isCurrent ? 2.5 : 1.5}
                className="transition-all duration-200"
              />
              {isCurrent && (
                <path
                  d={paths[id]}
                  fill="none"
                  style={{ stroke: 'var(--color-rose-dusty)' }}
                  strokeWidth="4"
                  opacity="0.35"
                />
              )}
              <ZoneLabel x={lbl.x} y={lbl.y} size={lbl.size} lines={label} textColor={textColor} />
            </g>
          );
        })}

        {/* Subtle ribbing lines on cuff */}
        {[24, 30, 36, 42, 48].map(y => (
          <line key={y} x1="67" y1={y} x2={ribbingX2} y2={y}
            stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
        ))}

        {/* Needle / yarn decoration at cast-on edge */}
        <line
          x1="62" y1="13" x2={needleX2} y2="13"
          style={{ stroke: 'var(--color-rose-dusty)' }}
          strokeWidth="3" strokeLinecap="round"
        />
        <circle cx={needleX2} cy="13" r="3" style={{ fill: 'var(--color-rose-dusty)' }} />
        <circle cx="62"       cy="13" r="3" style={{ fill: 'var(--color-rose-dusty)' }} />
      </svg>
    </div>
  );
}

function ZoneLabel({
  x, y, size, lines, textColor,
}: {
  x: number;
  y: number;
  size: number;
  lines: string[];
  textColor: string;
}) {
  const lineH  = size + 2;
  const startY = y - ((lines.length - 1) * lineH) / 2;

  return (
    <>
      {lines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={startY + i * lineH}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size}
          fontWeight="600"
          fontFamily="system-ui, sans-serif"
          style={{ fill: textColor, pointerEvents: 'none', userSelect: 'none' }}
        >
          {line}
        </text>
      ))}
    </>
  );
}
