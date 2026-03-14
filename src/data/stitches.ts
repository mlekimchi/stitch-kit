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
    description: 'Pick up the bar between stitches from front to back, then knit through the back loop. Creates a left-leaning increase with no hole.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="20" x2="54" y2="20" stroke="#c0c0c0" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="57" cy="20" r="4" fill="#c0c0c0"/>
      <path d="M8,20 C6,28 6,36 9,42 C11,47 15,47 17,42 C20,36 20,28 18,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M22,20 C20,28 20,36 23,42 C25,47 29,47 31,42 C34,36 34,28 32,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M36,20 C34,28 34,36 37,42 C39,47 43,47 45,42 C48,36 48,28 46,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <line x1="18" y1="32" x2="22" y2="32" stroke="#8FAF90" stroke-width="4" stroke-linecap="round"/>
      <line x1="2" y1="56" x2="18" y2="32" stroke="#777" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="18" y1="32" x2="28" y2="14" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-dasharray="3,2"/>
      <polygon points="28,14 21,17 24,23" fill="#777"/>
    </svg>`,
    steps: [
      {
        label: 'Step 1 — Insert LH needle front to back under the bar',
        svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- RH needle with ball end -->
          <line x1="2" y1="20" x2="54" y2="20" stroke="#c0c0c0" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="57" cy="20" r="4" fill="#c0c0c0"/>
          <!-- 3 live stitch loops -->
          <path d="M8,20 C6,28 6,36 9,42 C11,47 15,47 17,42 C20,36 20,28 18,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M22,20 C20,28 20,36 23,42 C25,47 29,47 31,42 C34,36 34,28 32,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M36,20 C34,28 34,36 37,42 C39,47 43,47 45,42 C48,36 48,28 46,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- The bar — highlighted sage green -->
          <line x1="18" y1="32" x2="22" y2="32" stroke="#8FAF90" stroke-width="4" stroke-linecap="round"/>
          <!-- LH needle: solid from front/lower-left to bar -->
          <line x1="2" y1="58" x2="18" y2="32" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>
          <!-- LH needle: dashed through bar toward back/upper-right -->
          <line x1="18" y1="32" x2="30" y2="14" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-dasharray="3,2.5"/>
          <!-- Arrowhead at back end (upper-right) showing direction of travel -->
          <polygon points="30,14 22,16 25,23" fill="#666"/>
          <!-- Labels -->
          <text x="3" y="70" font-size="5.5" fill="#555" font-family="sans-serif" font-weight="bold">LH needle</text>
          <text x="3" y="78" font-size="5" fill="#8FAF90" font-family="sans-serif">front → back under bar</text>
        </svg>`,
      },
      {
        label: 'Step 2 — Knit through the back loop (tbl)',
        svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- LH needle (pointed tip on left) — bar is now lifted onto it -->
          <line x1="4" y1="28" x2="56" y2="28" stroke="#c0c0c0" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="4" y1="28" x2="0" y2="28" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round"/>
          <!-- Lifted bar — now a loop on the LH needle, highlighted -->
          <path d="M10,28 C8,36 8,44 11,50 C13,55 17,55 19,50 C22,44 22,36 20,28" stroke="#8FAF90" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- Regular stitches to the right -->
          <path d="M26,28 C24,36 24,44 27,50 C29,55 33,55 35,50 C38,44 38,36 36,28" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M40,28 C38,36 38,44 41,50 C43,55 47,55 49,50" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- Back-loop direction arrow at top (← leftward = back loop) -->
          <line x1="42" y1="12" x2="24" y2="12" stroke="#8FAF90" stroke-width="2" stroke-linecap="round"/>
          <polygon points="24,12 30,8 30,16" fill="#8FAF90"/>
          <text x="24" y="8" font-size="5" fill="#8FAF90" font-family="sans-serif" text-anchor="middle">back loop</text>
          <!-- RH needle through BACK of highlighted loop (enters from right, exits left) -->
          <line x1="58" y1="22" x2="21" y2="35" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="15" y1="35" x2="3" y2="30" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-dasharray="3,2"/>
          <polygon points="3,30 10,26 11,34" fill="#666"/>
          <!-- Labels -->
          <text x="3" y="70" font-size="5.5" fill="#555" font-family="sans-serif" font-weight="bold">RH needle</text>
          <text x="3" y="78" font-size="5" fill="#8FAF90" font-family="sans-serif">through back loop → tbl</text>
        </svg>`,
      },
    ],
  },
  {
    abbr: 'M1R',
    name: 'Make 1 Right',
    category: 'increase',
    description: 'Pick up the bar between stitches from back to front, then knit through the front loop. Creates a right-leaning increase with no hole.',
    svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="20" x2="54" y2="20" stroke="#c0c0c0" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="57" cy="20" r="4" fill="#c0c0c0"/>
      <path d="M8,20 C6,28 6,36 9,42 C11,47 15,47 17,42 C20,36 20,28 18,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M22,20 C20,28 20,36 23,42 C25,47 29,47 31,42 C34,36 34,28 32,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M36,20 C34,28 34,36 37,42 C39,47 43,47 45,42 C48,36 48,28 46,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <line x1="18" y1="32" x2="22" y2="32" stroke="#C47A7F" stroke-width="4" stroke-linecap="round"/>
      <line x1="58" y1="10" x2="22" y2="32" stroke="#777" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="22" y1="32" x2="10" y2="48" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-dasharray="3,2"/>
      <polygon points="10,48 15,41 18,48" fill="#777"/>
    </svg>`,
    steps: [
      {
        label: 'Step 1 — Insert LH needle back to front under the bar',
        svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- RH needle with ball end -->
          <line x1="2" y1="20" x2="54" y2="20" stroke="#c0c0c0" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="57" cy="20" r="4" fill="#c0c0c0"/>
          <!-- 3 live stitch loops -->
          <path d="M8,20 C6,28 6,36 9,42 C11,47 15,47 17,42 C20,36 20,28 18,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M22,20 C20,28 20,36 23,42 C25,47 29,47 31,42 C34,36 34,28 32,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M36,20 C34,28 34,36 37,42 C39,47 43,47 45,42 C48,36 48,28 46,20" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- The bar — highlighted rose -->
          <line x1="18" y1="32" x2="22" y2="32" stroke="#C47A7F" stroke-width="4" stroke-linecap="round"/>
          <!-- LH needle: solid from back/upper-right to bar -->
          <line x1="58" y1="10" x2="22" y2="32" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>
          <!-- LH needle: dashed through bar toward front/lower-left -->
          <line x1="22" y1="32" x2="10" y2="48" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-dasharray="3,2.5"/>
          <!-- Arrowhead at front end (lower-left) showing direction of travel -->
          <polygon points="10,48 15,41 19,48" fill="#666"/>
          <!-- Labels -->
          <text x="3" y="70" font-size="5.5" fill="#555" font-family="sans-serif" font-weight="bold">LH needle</text>
          <text x="3" y="78" font-size="5" fill="#C47A7F" font-family="sans-serif">back → front under bar</text>
        </svg>`,
      },
      {
        label: 'Step 2 — Knit through the front loop (tfl)',
        svgPath: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- LH needle (pointed tip on left) -->
          <line x1="4" y1="28" x2="56" y2="28" stroke="#c0c0c0" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="4" y1="28" x2="0" y2="28" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round"/>
          <!-- Lifted bar — now a loop on the LH needle, highlighted rose -->
          <path d="M10,28 C8,36 8,44 11,50 C13,55 17,55 19,50 C22,44 22,36 20,28" stroke="#C47A7F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- Regular stitches to the right -->
          <path d="M26,28 C24,36 24,44 27,50 C29,55 33,55 35,50 C38,44 38,36 36,28" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M40,28 C38,36 38,44 41,50 C43,55 47,55 49,50" stroke="#c8c8c8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- Front-loop direction arrow at top (→ rightward = front loop) -->
          <line x1="18" y1="12" x2="36" y2="12" stroke="#C47A7F" stroke-width="2" stroke-linecap="round"/>
          <polygon points="36,12 30,8 30,16" fill="#C47A7F"/>
          <text x="27" y="8" font-size="5" fill="#C47A7F" font-family="sans-serif" text-anchor="middle">front loop</text>
          <!-- RH needle through FRONT of highlighted loop (enters from left, exits right) -->
          <line x1="2" y1="22" x2="16" y2="35" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="16" y1="35" x2="30" y2="28" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-dasharray="3,2"/>
          <polygon points="30,28 23,24 22,32" fill="#666"/>
          <!-- Labels -->
          <text x="3" y="70" font-size="5.5" fill="#555" font-family="sans-serif" font-weight="bold">RH needle</text>
          <text x="3" y="78" font-size="5" fill="#C47A7F" font-family="sans-serif">through front loop → tfl</text>
        </svg>`,
      },
    ],
  },
];

export function getStitch(abbr: string): StitchReference | undefined {
  return STITCH_LIBRARY.find(s => s.abbr === abbr);
}
