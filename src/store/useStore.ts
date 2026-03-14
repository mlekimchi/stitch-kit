import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { storage } from '../services/storage';
import { PRELOADED_PATTERNS, getPatternById } from '../data/patterns';
import type {
  Project, Pattern, Survey, TimerState, TabName,
  SockNumber, SectionProgress, LapEntry,
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function now() { return Date.now(); }
function isoNow() { return new Date().toISOString(); }

function initSectionProgress(pattern: Pattern): Record<string, SectionProgress> {
  const progress: Record<string, SectionProgress> = {};
  pattern.sections.forEach(s => {
    progress[s.id] = {
      currentRow: 0,
      totalRows: s.defaultRows,
      completed: false,
    };
  });
  return progress;
}

const defaultTimer: TimerState = {
  isRunning: false,
  startTime: null,
  elapsed: 0,
  laps: [],
  sectionStartTime: null,
  sectionElapsed: 0,
};

// ─── Store Interface ───────────────────────────────────────────────────────────
interface AppStore {
  // ── State
  projects:         Project[];
  customPatterns:   Pattern[];
  surveys:          Survey[];
  currentProjectId: string | null;
  activeTab:        TabName;
  timer:            TimerState;
  theme:            string;

  // ── Computed helpers (not persisted)
  allPatterns:      () => Pattern[];
  currentProject:   () => Project | null;
  currentPattern:   () => Pattern | null;

  // ── Tab
  setActiveTab: (tab: TabName) => void;

  // ── Theme
  setTheme: (theme: string) => void;

  // ── Projects
  addProject:    (data: Omit<Project, 'id' | 'lastActive'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  completeProject:   (id: string) => void;

  // ── Counter
  incrementRow: () => void;
  decrementRow: () => void;
  setCurrentSection: (sectionId: string) => void;
  setSectionTotalRows: (sectionId: string, total: number) => void;
  advanceSection: () => void;
  setSock: (sock: SockNumber) => void;

  // ── Timer
  startTimer: ()  => void;
  stopTimer:  ()  => void;
  lapTimer:   ()  => void;
  resetTimer: ()  => void;
  timerTick:  ()  => void;

  // ── Notes
  saveNote: (projectId: string, sectionId: string, note: string) => void;

  // ── Surveys
  saveSurvey: (survey: Omit<Survey, 'id' | 'completedAt'>) => void;

  // ── Custom patterns
  addCustomPattern: (pattern: Omit<Pattern, 'id' | 'isPreloaded'>) => string;
}

// ─── Store ─────────────────────────────────────────────────────────────────────
export const useStore = create<AppStore>((set, get) => ({
  projects:         storage.getProjects(),
  customPatterns:   storage.getCustomPatterns(),
  surveys:          storage.getSurveys(),
  currentProjectId: storage.getCurrentProjectId(),
  activeTab:        (storage.getActiveTab() as TabName) || 'counter',
  timer:            storage.getTimerState() || { ...defaultTimer },
  theme:            storage.getTheme() || 'cozy',

  // ── Computed
  allPatterns: () => [...PRELOADED_PATTERNS, ...get().customPatterns],

  currentProject: () => {
    const id = get().currentProjectId;
    return id ? get().projects.find(p => p.id === id) ?? null : null;
  },

  currentPattern: () => {
    const project = get().currentProject();
    if (!project) return null;
    return getPatternById(project.patternId, get().customPatterns) ?? null;
  },

  // ── Tab ─────────────────────────────────────────────────────────────────────
  setActiveTab: (tab) => {
    storage.setActiveTab(tab);
    set({ activeTab: tab });
  },

  // ── Theme ────────────────────────────────────────────────────────────────────
  setTheme: (theme) => {
    storage.setTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  // ── Projects ─────────────────────────────────────────────────────────────────
  addProject: (data) => {
    const id = uuid();
    const pattern = getPatternById(data.patternId, get().customPatterns);
    const sectionProgress = pattern ? initSectionProgress(pattern) : {};
    const firstSection = pattern?.sections[0]?.id ?? '';
    const project: Project = {
      ...data,
      id,
      lastActive: isoNow(),
      currentSection: data.currentSection || firstSection,
      currentRow: 0,
      sectionProgress,
      completedSections: [],
    };
    const updated = [...get().projects, project];
    storage.saveProjects(updated);
    set({ projects: updated, currentProjectId: id });
    storage.setCurrentProjectId(id);
    return id;
  },

  updateProject: (id, updates) => {
    const updated = get().projects.map(p =>
      p.id === id ? { ...p, ...updates, lastActive: isoNow() } : p
    );
    storage.saveProjects(updated);
    set({ projects: updated });
  },

  deleteProject: (id) => {
    const updated = get().projects.filter(p => p.id !== id);
    storage.saveProjects(updated);
    const newCurrent = get().currentProjectId === id ? null : get().currentProjectId;
    storage.setCurrentProjectId(newCurrent);
    set({ projects: updated, currentProjectId: newCurrent });
  },

  setCurrentProject: (id) => {
    storage.setCurrentProjectId(id);
    set({ currentProjectId: id });
  },

  completeProject: (id) => {
    get().updateProject(id, { isComplete: true, dateCompleted: isoNow() });
  },

  // ── Counter ──────────────────────────────────────────────────────────────────
  incrementRow: () => {
    const project = get().currentProject();
    if (!project) return;
    const section = project.currentSection;
    const progress = project.sectionProgress[section] ?? { currentRow: 0, totalRows: 10, completed: false };
    const newRow = progress.currentRow + 1;
    const sectionDone = newRow >= progress.totalRows;

    const newProgress = {
      ...project.sectionProgress,
      [section]: { ...progress, currentRow: newRow, completed: sectionDone },
    };
    get().updateProject(project.id, {
      currentRow: newRow,
      sectionProgress: newProgress,
    });
  },

  decrementRow: () => {
    const project = get().currentProject();
    if (!project) return;
    const section = project.currentSection;
    const progress = project.sectionProgress[section] ?? { currentRow: 0, totalRows: 10, completed: false };
    if (progress.currentRow <= 0) return;
    const newRow = progress.currentRow - 1;
    const newProgress = {
      ...project.sectionProgress,
      [section]: { ...progress, currentRow: newRow, completed: false },
    };
    get().updateProject(project.id, {
      currentRow: newRow,
      sectionProgress: newProgress,
    });
  },

  setCurrentSection: (sectionId) => {
    const project = get().currentProject();
    if (!project) return;
    const progress = project.sectionProgress[sectionId] ?? { currentRow: 0, totalRows: 10, completed: false };
    get().updateProject(project.id, {
      currentSection: sectionId,
      currentRow: progress.currentRow,
    });
  },

  setSectionTotalRows: (sectionId, total) => {
    const project = get().currentProject();
    if (!project) return;
    const prev = project.sectionProgress[sectionId] ?? { currentRow: 0, totalRows: total, completed: false };
    const newProgress = {
      ...project.sectionProgress,
      [sectionId]: { ...prev, totalRows: total },
    };
    get().updateProject(project.id, { sectionProgress: newProgress });
  },

  advanceSection: () => {
    const project = get().currentProject();
    const pattern = get().currentPattern();
    if (!project || !pattern) return;
    const idx = pattern.sections.findIndex(s => s.id === project.currentSection);
    if (idx < 0 || idx >= pattern.sections.length - 1) return;
    const nextSection = pattern.sections[idx + 1];
    const completed = [...project.completedSections, project.currentSection];
    get().updateProject(project.id, {
      currentSection: nextSection.id,
      currentRow: 0,
      completedSections: completed,
    });
  },

  setSock: (sock) => {
    const project = get().currentProject();
    if (!project) return;
    get().updateProject(project.id, { currentSock: sock });
  },

  // ── Timer ─────────────────────────────────────────────────────────────────────
  startTimer: () => {
    const t = get().timer;
    const updated: TimerState = {
      ...t,
      isRunning: true,
      startTime: now() - t.elapsed,
      sectionStartTime: t.sectionStartTime ?? now(),
    };
    storage.saveTimerState(updated);
    set({ timer: updated });
  },

  stopTimer: () => {
    const t = get().timer;
    const updated: TimerState = {
      ...t,
      isRunning: false,
      elapsed: t.startTime ? now() - t.startTime : t.elapsed,
    };
    storage.saveTimerState(updated);
    set({ timer: updated });
  },

  lapTimer: () => {
    const t = get().timer;
    const project = get().currentProject();
    const pattern  = get().currentPattern();
    const elapsed = t.startTime ? now() - t.startTime : t.elapsed;
    const lap: LapEntry = {
      id: uuid(),
      timestamp: now(),
      rowNumber: project?.currentRow ?? 0,
      elapsed,
      sectionName: pattern?.sections.find(s => s.id === project?.currentSection)?.name ?? '',
    };
    const updated: TimerState = {
      ...t,
      laps: [...t.laps, lap],
      elapsed,
    };
    storage.saveTimerState(updated);
    set({ timer: updated });
  },

  resetTimer: () => {
    storage.saveTimerState(defaultTimer);
    set({ timer: { ...defaultTimer } });
  },

  timerTick: () => {
    const t = get().timer;
    if (!t.isRunning || t.startTime === null) return;
    const elapsed = now() - t.startTime;
    const sectionElapsed = t.sectionStartTime ? now() - t.sectionStartTime : 0;
    set({ timer: { ...t, elapsed, sectionElapsed } });
  },

  // ── Notes ─────────────────────────────────────────────────────────────────────
  saveNote: (projectId, sectionId, note) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const updated = { ...project.notes, [sectionId]: note };
    get().updateProject(projectId, { notes: updated });
  },

  // ── Surveys ───────────────────────────────────────────────────────────────────
  saveSurvey: (data) => {
    const survey: Survey = { ...data, id: uuid(), completedAt: isoNow() };
    const updated = [...get().surveys, survey];
    storage.saveSurveys(updated);
    get().updateProject(data.projectId, { surveyId: survey.id });
    set({ surveys: updated });
  },

  // ── Custom patterns ───────────────────────────────────────────────────────────
  addCustomPattern: (data) => {
    const id = uuid();
    const pattern: Pattern = { ...data, id, isPreloaded: false, isCustom: true };
    const updated = [...get().customPatterns, pattern];
    storage.saveCustomPatterns(updated);
    set({ customPatterns: updated });
    return id;
  },
}));
