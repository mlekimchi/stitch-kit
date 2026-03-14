// ─── Core UI ──────────────────────────────────────────────────────────────────
export type TabName = 'counter' | 'pattern' | 'schema' | 'projects' | 'tools';
export type SockNumber = 1 | 2;
export type SchemaZone = 'cuff' | 'leg' | 'heel-flap' | 'heel-turn' | 'gusset' | 'foot' | 'toe' | 'short-row-heel';

// ─── Yarn & Project ───────────────────────────────────────────────────────────
export type YarnWeight = 'Lace' | 'Fingering' | 'Sport' | 'DK' | 'Worsted' | 'Bulky';

export interface Yarn {
  brand: string;
  name: string;
  colorway: string;
  weight: YarnWeight;
}

export interface SectionProgress {
  currentRow: number;
  totalRows: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  recipient: string;
  patternId: string;
  customFootLength?: number;
  yarn: Yarn;
  needleSize: string;
  dateStarted: string;
  dateCompleted?: string;
  currentSection: string;
  currentRow: number;
  currentSock: SockNumber;
  sectionProgress: Record<string, SectionProgress>;
  completedSections: string[];
  isComplete: boolean;
  notes: Record<string, string>;
  surveyId?: string;
  lastActive: string;
}

// ─── Pattern ──────────────────────────────────────────────────────────────────
export interface RowInstruction {
  row: number;
  instruction: string;
  isRepeat?: boolean;
}

export interface PatternSection {
  id: string;
  name: string;
  schemaZone: SchemaZone;
  defaultRows: number;
  isVariable: boolean;
  baseInstruction: string;
  rowInstructions?: RowInstruction[];
  repeatFromRow?: number;
  specialStitches: string[];
  notes?: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  castOn: number;
  needleSize: string;
  targetFootLength?: number;
  sections: PatternSection[];
  isPreloaded: boolean;
  isCustom?: boolean;
  heelType?: 'heel-flap' | 'short-row';
}

// ─── Stitch Reference ─────────────────────────────────────────────────────────
export type StitchCategory = 'decrease' | 'increase' | 'slip' | 'rib' | 'special';

export interface StitchStep {
  label: string;
  svgPath?: string;  // inline SVG string
  imgSrc?: string;   // path to a static image file (e.g. '/stitches/M1L_1.svg')
}

export interface StitchReference {
  abbr: string;
  name: string;
  description: string;
  svgPath: string;    // thumbnail used in list cards (= step 1 for multi-step stitches)
  steps?: StitchStep[]; // optional multi-step diagrams shown in popup
  category: StitchCategory;
}

// ─── Timer & Session ──────────────────────────────────────────────────────────
export interface LapEntry {
  id: string;
  timestamp: number;
  rowNumber: number;
  elapsed: number;
  sectionName: string;
}

export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsed: number;
  laps: LapEntry[];
  sectionStartTime: number | null;
  sectionElapsed: number;
}

// ─── Survey ───────────────────────────────────────────────────────────────────
export interface Survey {
  id: string;
  projectId: string;
  widthFit: 'Too tight' | 'Just right' | 'Too loose';
  lengthFit: 'Too short' | 'Just right' | 'Too long';
  yarnSoftness: 1 | 2 | 3 | 4 | 5;
  yarnStretch: 1 | 2 | 3 | 4 | 5;
  colorSatisfaction: 1 | 2 | 3 | 4 | 5;
  wouldUseYarnAgain: 'Yes' | 'No' | 'Maybe';
  photo?: string;
  notes: string;
  completedAt: string;
}

// ─── Pattern Builder ──────────────────────────────────────────────────────────
export type CuffStyle = 'Folded' | '1x1 Ribbing' | '2x2 Ribbing' | 'Twisted Ribbing' | 'Ribbing Throughout';
export type LegStyle = 'Stockinette' | 'Ribbing Throughout' | 'Ribbed Instep + Stockinette Sole';
export type LegLength = 'Short (ankle)' | 'Medium' | 'Long (knee-high)';
export type HeelConstruction = 'Heel Flap + Gusset' | 'Short Row Heel' | 'German Short Row Heel';
export type ToeConstruction = 'Spiral Toe' | 'Classic Wedge Toe' | 'Star Toe';

export interface PatternBuilderConfig {
  cuffStyle: CuffStyle;
  legStyle: LegStyle;
  legLength: LegLength;
  heelConstruction: HeelConstruction;
  footLength: number;
  footLengthUnit: 'inches' | 'cm';
  toeConstruction: ToeConstruction;
}
