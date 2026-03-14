import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PRELOADED_PATTERNS } from '../../data/patterns';
import type {
  PatternBuilderConfig, CuffStyle, LegStyle, LegLength,
  HeelConstruction, ToeConstruction, Pattern, PatternSection,
} from '../../types';

const CUFF_STYLES: CuffStyle[]      = ['1x1 Ribbing', '2x2 Ribbing', 'Twisted Ribbing', 'Folded', 'Ribbing Throughout'];
const LEG_STYLES: LegStyle[]        = ['Stockinette', 'Ribbing Throughout', 'Ribbed Instep + Stockinette Sole'];
const LEG_LENGTHS: LegLength[]      = ['Short (ankle)', 'Medium', 'Long (knee-high)'];
const HEEL_CONSTRUCTIONS: HeelConstruction[] = ['Heel Flap + Gusset', 'Short Row Heel', 'German Short Row Heel'];
const TOE_CONSTRUCTIONS: ToeConstruction[]   = ['Spiral Toe', 'Classic Wedge Toe', 'Star Toe'];

// ── Pattern text generation helpers ───────────────────────────────────────────

function getCuffText(style: CuffStyle): string {
  const texts: Record<CuffStyle, string> = {
    'Folded':          'Cast on, work stockinette for 3cm, fold, join to cast-on edge. Creates a neat folded cuff.',
    '1x1 Ribbing':     '*K1, P1; rep from * to end. Work for 2–4cm (or desired length).',
    '2x2 Ribbing':     '*K2, P2; rep from * to end. Work for 3–5cm (or desired length).',
    'Twisted Ribbing':  '*K1tbl, P1; rep from * to end. Work for 2–4cm. Creates a firmer, decorative rib.',
    'Ribbing Throughout': '*K2, P2; rep from * to end. Continue this rib pattern through the entire sock.',
  };
  return texts[style];
}

function getLegText(style: LegStyle, length: LegLength): string {
  const lengthCm: Record<LegLength, string> = {
    'Short (ankle)': '~7–8cm',
    'Medium':        '~14–16cm',
    'Long (knee-high)': '~30–35cm',
  };
  const styleText: Record<LegStyle, string> = {
    'Stockinette':                  'Knit all rounds (stockinette).',
    'Ribbing Throughout':           'Continue ribbing from cuff, all rounds.',
    'Ribbed Instep + Stockinette Sole': 'Work instep 30 sts in K2P2 rib; work sole 30 sts in stockinette.',
  };
  return `${styleText[style]} Continue until leg measures ${lengthCm[length]} from cast-on.`;
}

function getHeelText(construction: HeelConstruction): string {
  const texts: Record<HeelConstruction, string> = {
    'Heel Flap + Gusset':
      'Heel Flap (30 sts, 28 rows): [Sl1 wyib, K1] × 15; Sl1 wyif, P29. Heel Turn: work short rows to shape heel. Pick up gusset stitches and decrease back to stitch count.',
    'Short Row Heel':
      'Work heel sts flat. Row 1 (RS): Sl1, knit to last st, turn (1 st unworked). Row 2 (WS): Sl1, purl to last st, turn (1 st unworked). Continue leaving 1 more st unworked each row until ~⅓ of sts remain in centre. Close gaps: RS rows — Sl1, K to gap, SSK (1 st each side of gap), M1L, turn. WS rows — Sl1, P to gap, P2tog, M1p, turn. Repeat until all sts worked. Stitch count restored.',
    'German Short Row Heel':
      'Work heel sts flat. RS: Knit to end, turn. WS: Slip first st, pull yarn over needle to front to create double stitch (DS), purl to end, turn. Continue, leaving 1 more st before each DS. Close gaps: work to DS, knit/purl DS together with next st. No M1 needed — stitch count stays constant. Creates a clean, nearly gap-free heel.',
  };
  return texts[construction];
}

function getToeText(construction: ToeConstruction, footLengthCm: number): string {
  const stopAt = Math.max(0, footLengthCm - 4.5).toFixed(1);
  const texts: Record<ToeConstruction, string> = {
    'Spiral Toe':
      `Knit foot until ${stopAt}cm from heel turn. Toe: [K to 2 sts before marker, K2tog] × 4 every other round until 32 sts, then every round until 8 sts. Draw yarn through and fasten.`,
    'Classic Wedge Toe':
      `Knit foot until ${stopAt}cm from heel turn. Split sts evenly: sole on Needle 1, instep on Needle 2. Place BOR marker in the middle of Needle 1. Decrease Rnd: N1: K to 3 sts before marker, K2tog, K1; N2: K1, SSK, K to 3 sts before end, K2tog, K1; N1: K1, SSK, K to BOR. (−4 sts) Alternate Decrease Rnd and Plain Rnd until 40 sts remain, then Decrease Rnd every round until 20 sts remain. Knit to side of sock. Kitchener stitch to graft closed.`,
    'Star Toe':
      `Knit foot until ${stopAt}cm from heel turn. Place 4 markers at equal intervals. [K to 2 sts before marker, K2tog] × 4 every round (no plain rounds) until 8 sts remain. Draw yarn through and fasten.`,
  };
  return texts[construction];
}

function buildPreviewText(config: PatternBuilderConfig): string {
  const footCm = config.footLengthUnit === 'inches' ? config.footLength * 2.54 : config.footLength;
  return [
    '**CUFF**\n' + getCuffText(config.cuffStyle),
    '**LEG**\n' + getLegText(config.legStyle, config.legLength),
    '**HEEL**\n' + getHeelText(config.heelConstruction),
    '**FOOT**\nKnit all rounds until foot reaches the target length (see Toe section).',
    '**TOE**\n' + getToeText(config.toeConstruction, footCm),
    '**FINISHING**\nWeave in ends. Block if desired.',
  ].join('\n\n');
}

function SelectGroup<T extends string>({
  label, value, options, onChange,
}: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="w-full border border-cream-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-rose-dusty"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function PatternBuilder() {
  const addCustomPattern = useStore(s => s.addCustomPattern);

  const [config, setConfig] = useState<PatternBuilderConfig>({
    cuffStyle:         '2x2 Ribbing',
    legStyle:          'Stockinette',
    legLength:         'Medium',
    heelConstruction:  'Heel Flap + Gusset',
    footLength:        23,
    footLengthUnit:    'cm',
    toeConstruction:   'Spiral Toe',
  });

  const [saved, setSaved]     = useState(false);
  const [patternName, setPatternName] = useState('My Custom Pattern');

  const set = <K extends keyof PatternBuilderConfig>(k: K, v: PatternBuilderConfig[K]) =>
    setConfig(c => ({ ...c, [k]: v }));

  const previewText = useMemo(() => buildPreviewText(config), [config]);

  const handleSave = () => {
    const footCm = config.footLengthUnit === 'inches' ? config.footLength * 2.54 : config.footLength;

    const isHeelFlap = config.heelConstruction === 'Heel Flap + Gusset';
    const heelType: 'heel-flap' | 'short-row' = isHeelFlap ? 'heel-flap' : 'short-row';

    const heelSections: PatternSection[] = isHeelFlap
      ? [
          {
            id: 'heel-flap',
            name: 'Heel Flap',
            schemaZone: 'heel-flap',
            defaultRows: 28,
            isVariable: true,
            baseInstruction: getHeelText(config.heelConstruction),
            specialStitches: ['Sl1 pwise wyib', 'Sl1 pwise wyif'],
          },
          {
            id: 'heel-turn',
            name: 'Heel Turn',
            schemaZone: 'heel-turn',
            defaultRows: 12,
            isVariable: true,
            baseInstruction: 'Work heel turn as established.',
            specialStitches: ['SKP', 'P2tog'],
          },
          {
            id: 'gusset',
            name: 'Gusset',
            schemaZone: 'gusset',
            defaultRows: 12,
            isVariable: true,
            baseInstruction: 'Pick up gusset stitches and decrease back to original stitch count.',
            specialStitches: ['K2tog', 'SKP'],
          },
        ]
      : [
          {
            id: 'short-row-heel',
            name: config.heelConstruction === 'German Short Row Heel' ? 'German Short Row Heel' : 'Short Row Heel',
            schemaZone: 'short-row-heel' as const,
            defaultRows: 16,
            isVariable: true,
            baseInstruction: getHeelText(config.heelConstruction),
            specialStitches: [],
          },
        ];

    const sections: PatternSection[] = [
      {
        id: 'cuff',
        name: 'Cuff',
        schemaZone: 'cuff',
        defaultRows: config.cuffStyle === 'Ribbing Throughout' ? 75 : 20,
        isVariable: true,
        baseInstruction: getCuffText(config.cuffStyle),
        specialStitches: config.cuffStyle.includes('2x2') ? ['K2P2'] :
                         config.cuffStyle.includes('1x1') ? ['K1P1'] : [],
      },
      {
        id: 'leg',
        name: 'Leg',
        schemaZone: 'leg',
        defaultRows: config.legLength === 'Short (ankle)' ? 20 :
                     config.legLength === 'Medium'        ? 40 : 80,
        isVariable: true,
        baseInstruction: getLegText(config.legStyle, config.legLength),
        specialStitches: config.legStyle === 'Ribbing Throughout' ? ['K2P2'] : [],
      },
      ...heelSections,
      {
        id: 'foot',
        name: 'Foot',
        schemaZone: 'foot',
        defaultRows: Math.round(footCm * 2.5),
        isVariable: true,
        baseInstruction: 'Knit all rounds (stockinette)',
        notes: `Target foot length: ${footCm.toFixed(1)}cm. Stop ~4.5cm before end of foot.`,
        specialStitches: [],
      },
      {
        id: 'toe',
        name: 'Toe',
        schemaZone: 'toe',
        defaultRows: 20,
        isVariable: true,
        baseInstruction: getToeText(config.toeConstruction, footCm),
        specialStitches: ['K2tog'],
      },
    ];

    addCustomPattern({
      name:        patternName,
      description: `Custom pattern — ${config.cuffStyle} cuff, ${config.legStyle} leg, ${config.heelConstruction} heel, ${config.toeConstruction} toe.`,
      castOn:      60,
      needleSize:  'US 1 (2.25mm)',
      targetFootLength: footCm,
      sections,
      heelType,
      isCustom:    true,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-serif text-lg font-semibold text-gray-800">Pattern Builder</h3>
        <p className="text-xs text-gray-500 mt-0.5">Assemble your custom sock pattern from modular components.</p>
      </div>

      <SelectGroup label="Cuff Style"         value={config.cuffStyle}        options={CUFF_STYLES}         onChange={v => set('cuffStyle', v)} />
      <SelectGroup label="Leg Style"          value={config.legStyle}         options={LEG_STYLES}          onChange={v => set('legStyle', v)} />
      <SelectGroup label="Leg Length"         value={config.legLength}        options={LEG_LENGTHS}         onChange={v => set('legLength', v)} />
      <SelectGroup label="Heel Construction"  value={config.heelConstruction} options={HEEL_CONSTRUCTIONS}  onChange={v => set('heelConstruction', v)} />
      <SelectGroup label="Toe Construction"   value={config.toeConstruction}  options={TOE_CONSTRUCTIONS}   onChange={v => set('toeConstruction', v)} />

      {/* Foot length */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Foot Length</label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.5"
            value={config.footLength}
            onChange={e => set('footLength', parseFloat(e.target.value) || 0)}
            className="flex-1 border border-cream-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"
          />
          <div className="flex bg-cream-100 rounded-xl p-0.5">
            {(['cm', 'inches'] as const).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => set('footLengthUnit', u)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  config.footLengthUnit === u ? 'bg-white text-gray-700 shadow-soft' : 'text-gray-400'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="bg-cream-50 rounded-2xl border border-cream-200 p-4 max-h-64 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Live Preview</p>
        <div className="text-sm text-gray-700 space-y-3">
          {previewText.split('\n\n').map((block, i) => {
            const [header, ...rest] = block.split('\n');
            return (
              <div key={i}>
                <p className="font-semibold text-gray-800 text-xs">{header.replace(/\*\*/g, '')}</p>
                <p className="text-gray-600 leading-relaxed mt-0.5">{rest.join('\n')}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="space-y-2">
        <input
          type="text"
          value={patternName}
          onChange={e => setPatternName(e.target.value)}
          placeholder="Pattern name…"
          className="w-full border border-cream-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"
        />
        <button
          onClick={handleSave}
          className={`w-full py-3 font-semibold rounded-2xl transition-all active:scale-95 ${
            saved ? 'bg-sage text-white' : 'bg-rose-dusty text-white hover:bg-rose-dark'
          }`}
        >
          {saved ? '✓ Pattern Saved!' : 'Save as New Pattern'}
        </button>
      </div>
    </div>
  );
}
