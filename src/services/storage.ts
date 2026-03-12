/**
 * Storage Service — all localStorage access flows through here.
 * To swap in a cloud API later, only this file needs to change.
 */
import type { Project, Pattern, Survey, TimerState } from '../types';

const KEYS = {
  PROJECTS:          'sk:projects',
  CUSTOM_PATTERNS:   'sk:custom-patterns',
  SURVEYS:           'sk:surveys',
  CURRENT_PROJECT:   'sk:current-project-id',
  TIMER:             'sk:timer',
  ACTIVE_TAB:        'sk:active-tab',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('[StitchKit] Storage write failed for key:', key);
  }
}

export const storage = {
  // ── Projects ──────────────────────────────────────────────────────────────
  getProjects():              Project[]  { return load(KEYS.PROJECTS, []); },
  saveProjects(p: Project[]): void       { save(KEYS.PROJECTS, p); },

  // ── Custom Patterns ───────────────────────────────────────────────────────
  getCustomPatterns():           Pattern[]  { return load(KEYS.CUSTOM_PATTERNS, []); },
  saveCustomPatterns(p: Pattern[]): void    { save(KEYS.CUSTOM_PATTERNS, p); },

  // ── Surveys ───────────────────────────────────────────────────────────────
  getSurveys():              Survey[]  { return load(KEYS.SURVEYS, []); },
  saveSurveys(s: Survey[]): void       { save(KEYS.SURVEYS, s); },

  // ── Session / UI state ────────────────────────────────────────────────────
  getCurrentProjectId():        string | null { return load(KEYS.CURRENT_PROJECT, null); },
  setCurrentProjectId(id: string | null): void { save(KEYS.CURRENT_PROJECT, id); },

  getTimerState():              TimerState | null { return load(KEYS.TIMER, null); },
  saveTimerState(t: TimerState): void             { save(KEYS.TIMER, t); },

  getActiveTab():               string { return load(KEYS.ACTIVE_TAB, 'counter'); },
  setActiveTab(tab: string): void      { save(KEYS.ACTIVE_TAB, tab); },

  // ── Helpers ───────────────────────────────────────────────────────────────
  clearAll(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
