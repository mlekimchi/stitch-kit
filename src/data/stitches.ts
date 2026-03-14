import type { StitchReference } from '../types';

// Each svgPath is an inline SVG string rendered inside a 60×80 viewBox
export const STITCH_LIBRARY: StitchReference[] = [
  {
    abbr: 'K2tog',
    name: 'Knit 2 Together',
    category: 'decrease',
    description: 'Insert needle through 2 stitches at once (right-to-left) and knit them together. Creates a right-leaning decrease.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="72" x2="18" y2="46" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="32" y1="72" x2="32" y2="46" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M18,46 Q25,32 38,24" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M32,46 Q35,36 38,24" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M38,24 L38,10" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="38,10 34,18 42,18" fill="#C47A7F"/>
      <path d="M33,22 Q38,14 43,22" stroke="#C47A7F" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
  {
    abbr: 'SKP',
    name: 'Slip, Knit, Pass Slipped Stitch Over',
    category: 'decrease',
    description: 'Slip 1 st knitwise, knit 1, pass the slipped stitch over the knitted stitch. Creates a left-leaning decrease.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="28" y1="72" x2="28" y2="46" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="42" y1="72" x2="42" y2="46" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M42,46 Q35,32 22,24" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M28,46 Q25,36 22,24" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M22,24 L22,10" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="22,10 18,18 26,18" fill="#8FAF90"/>
      <path d="M17,22 Q22,14 27,22" stroke="#8FAF90" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
  {
    abbr: 'P2tog',
    name: 'Purl 2 Together',
    category: 'decrease',
    description: 'Insert needle through 2 stitches from right to left and purl them together. Creates a right-leaning decrease on the purl side.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="10" x2="18" y2="34" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="32" y1="10" x2="32" y2="34" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M18,34 Q25,48 38,56" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M32,34 Q35,44 38,56" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="38" cy="60" rx="6" ry="4" fill="none" stroke="#C47A7F" stroke-width="2"/>
      <line x1="38" y1="56" x2="38" y2="64" stroke="#C47A7F" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    abbr: 'Sl1 pwise wyib',
    name: 'Slip 1 Purlwise, Yarn in Back',
    category: 'slip',
    description: 'With yarn held behind (as for knitting), insert right needle into stitch purlwise and slip it to the right needle without knitting it.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="70" x2="30" y2="20" stroke="#8FAF90" stroke-width="2" stroke-dasharray="5,3" stroke-linecap="round"/>
      <polygon points="30,20 25,30 35,30" fill="#8FAF90"/>
      <path d="M10,65 Q20,60 10,55" stroke="#C47A7F" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <text x="4" y="78" font-size="7" fill="#8FAF90" font-family="sans-serif">wyib</text>
    </svg>`,
  },
  {
    abbr: 'Sl1 pwise wyif',
    name: 'Slip 1 Purlwise, Yarn in Front',
    category: 'slip',
    description: 'With yarn held in front (as for purling), insert right needle into stitch purlwise and slip it to the right needle without purling it.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="70" x2="30" y2="20" stroke="#8FAF90" stroke-width="2" stroke-dasharray="5,3" stroke-linecap="round"/>
      <polygon points="30,20 25,30 35,30" fill="#8FAF90"/>
      <path d="M40,30 Q50,25 40,20" stroke="#C47A7F" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <text x="4" y="78" font-size="7" fill="#8FAF90" font-family="sans-serif">wyif</text>
    </svg>`,
  },
  {
    abbr: 'Ktbl',
    name: 'Knit Through Back Loop',
    category: 'special',
    description: 'Insert right needle into the back loop of the stitch (instead of front) and knit. Creates a twisted stitch that is tighter and more defined.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,70 L30,30" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M30,30 Q20,18 30,10" stroke="#C47A7F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M30,30 Q40,24 36,16" stroke="#C47A7F" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="3,2"/>
      <ellipse cx="30" cy="26" rx="10" ry="5" fill="none" stroke="#C47A7F" stroke-width="1.5" stroke-dasharray="4,2"/>
      <circle cx="30" cy="10" r="3" fill="#C47A7F"/>
    </svg>`,
  },
  {
    abbr: 'K2P2',
    name: '2×2 Ribbing',
    category: 'rib',
    description: 'Alternating *Knit 2, Purl 2; repeat from * to end of round. Creates a stretchy, textured fabric ideal for cuffs.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,70 L10,20" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M10,20 Q6,14 10,10 Q14,6 10,10" stroke="#C47A7F" stroke-width="2" fill="none"/>
      <path d="M22,70 L22,20" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M22,20 Q18,14 22,10 Q26,6 22,10" stroke="#C47A7F" stroke-width="2" fill="none"/>
      <ellipse cx="36" cy="55" rx="5" ry="4" fill="none" stroke="#8FAF90" stroke-width="2"/>
      <line x1="36" y1="51" x2="36" y2="20" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="50" cy="55" rx="5" ry="4" fill="none" stroke="#8FAF90" stroke-width="2"/>
      <line x1="50" y1="51" x2="50" y2="20" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    abbr: 'K1P1',
    name: '1×1 Ribbing',
    category: 'rib',
    description: 'Alternating *Knit 1, Purl 1; repeat from * to end of round. Creates a very stretchy fabric used for cuffs and edges.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,70 L12,22" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12,22 Q8,16 12,10 Q16,4 12,10" stroke="#C47A7F" stroke-width="2" fill="none"/>
      <ellipse cx="26" cy="58" rx="5" ry="4" fill="none" stroke="#8FAF90" stroke-width="2"/>
      <line x1="26" y1="54" x2="26" y2="22" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M40,70 L40,22" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M40,22 Q36,16 40,10 Q44,4 40,10" stroke="#C47A7F" stroke-width="2" fill="none"/>
      <ellipse cx="54" cy="58" rx="5" ry="4" fill="none" stroke="#8FAF90" stroke-width="2"/>
      <line x1="54" y1="54" x2="54" y2="22" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    abbr: 'M1L',
    name: 'Make 1 Left',
    category: 'increase',
    description: 'Insert left needle from front to back under the horizontal bar between stitches. Knit through the back loop. Creates a left-leaning increase with no hole.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Two existing stitches below the bar -->
      <line x1="12" y1="75" x2="12" y2="56" stroke="#8FAF90" stroke-width="2" stroke-linecap="round"/>
      <line x1="48" y1="75" x2="48" y2="56" stroke="#8FAF90" stroke-width="2" stroke-linecap="round"/>
      <!-- Horizontal bar between stitches (dashed) -->
      <line x1="12" y1="56" x2="48" y2="56" stroke="#8FAF90" stroke-width="2" stroke-dasharray="4,3" stroke-linecap="round"/>
      <!-- Needle tip entering bar from front (small tick on left side of bar) -->
      <line x1="12" y1="56" x2="20" y2="48" stroke="#8FAF90" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Lifted strand going up from bar center -->
      <line x1="30" y1="56" x2="30" y2="32" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round"/>
      <!-- New stitch curving LEFT (leans left) -->
      <path d="M30,32 Q22,20 16,12" stroke="#8FAF90" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <!-- Arrowhead at top showing left lean -->
      <polygon points="16,12 11,20 21,19" fill="#8FAF90"/>
      <!-- "f→b" label: front to back insertion -->
      <text x="3" y="11" font-size="6" fill="#8FAF90" font-family="sans-serif" font-weight="bold">f→b</text>
    </svg>`,
  },
  {
    abbr: 'M1R',
    name: 'Make 1 Right',
    category: 'increase',
    description: 'Insert left needle from back to front under the horizontal bar between stitches. Knit through the front loop. Creates a right-leaning increase with no hole.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Two existing stitches below the bar -->
      <line x1="12" y1="75" x2="12" y2="56" stroke="#C47A7F" stroke-width="2" stroke-linecap="round"/>
      <line x1="48" y1="75" x2="48" y2="56" stroke="#C47A7F" stroke-width="2" stroke-linecap="round"/>
      <!-- Horizontal bar between stitches (dashed) -->
      <line x1="12" y1="56" x2="48" y2="56" stroke="#C47A7F" stroke-width="2" stroke-dasharray="4,3" stroke-linecap="round"/>
      <!-- Needle tip entering bar from back (small tick on right side of bar) -->
      <line x1="48" y1="56" x2="40" y2="48" stroke="#C47A7F" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Lifted strand going up from bar center -->
      <line x1="30" y1="56" x2="30" y2="32" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round"/>
      <!-- New stitch curving RIGHT (leans right) -->
      <path d="M30,32 Q38,20 44,12" stroke="#C47A7F" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <!-- Arrowhead at top showing right lean -->
      <polygon points="44,12 39,19 49,20" fill="#C47A7F"/>
      <!-- "b→f" label: back to front insertion -->
      <text x="34" y="11" font-size="6" fill="#C47A7F" font-family="sans-serif" font-weight="bold">b→f</text>
    </svg>`,
  },
];

export function getStitch(abbr: string): StitchReference | undefined {
  return STITCH_LIBRARY.find(s => s.abbr === abbr);
}
