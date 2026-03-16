import { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useSwipe } from '../../hooks/useSwipe';
import { StitchCard } from './StitchCard';
import { TimerSection } from './TimerSection';
import { Survey } from '../tools/Survey';
import type { SockNumber } from '../../types';

// ── Star burst overlay ───────────────────────────────────────────────────────

const DEFAULT_CHARS    = ['✨', '⭐', '🌟', '✨', '💫', '✨', '⭐', '🌟', '💫', '✨', '⭐', '🌟'];
const STRAWBERRY_CHARS = ['🍓', '✨', '🌟', '🍓', '💫', '✨', '🍓', '🌟', '💫', '🍓', '✨', '🌟'];
const STRAWBERRY_THEMES = new Set(['matcha-strawberry', 'choco-strawberry-milk-tea']);

function StarBurst({ chars }: { chars: string[] }) {
  const stars = chars.map((char, i) => {
    const angle  = (i / chars.length) * 360;
    const dist   = 70 + (i % 3) * 35;
    const tx     = Math.cos((angle * Math.PI) / 180) * dist;
    const ty     = Math.sin((angle * Math.PI) / 180) * dist;
    const delay  = (i % 4) * 0.07;
    const size   = 18 + (i % 3) * 8;
    return { char, tx, ty, delay, size };
  });

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            fontSize: s.size,
            '--tx': `${s.tx}px`,
            '--ty': `${s.ty}px`,
            animation: `star-pop 1s ease-out ${s.delay}s forwards`,
            opacity: 0,
          } as React.CSSProperties}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}

// ── Main Counter Screen ──────────────────────────────────────────────────────

export function CounterScreen() {
  const {
    currentProject, currentPattern, incrementRow, decrementRow,
    advanceSection, setCurrentSection, setSectionTotalRows, setSock,
    setSectionActualRows, setSectionTargetLength, completeMeasurementSection,
    stopTimer, completeProject, startSock2, theme, setActiveTab, setCurrentProject,
  } = useStore(s => ({
    currentProject:             s.currentProject,
    currentPattern:             s.currentPattern,
    incrementRow:               s.incrementRow,
    decrementRow:               s.decrementRow,
    advanceSection:             s.advanceSection,
    setCurrentSection:          s.setCurrentSection,
    setSectionTotalRows:        s.setSectionTotalRows,
    setSectionActualRows:       s.setSectionActualRows,
    setSectionTargetLength:     s.setSectionTargetLength,
    completeMeasurementSection: s.completeMeasurementSection,
    setSock:                    s.setSock,
    stopTimer:                  s.stopTimer,
    completeProject:            s.completeProject,
    startSock2:                 s.startSock2,
    theme:                      s.theme,
    setActiveTab:               s.setActiveTab,
    setCurrentProject:          s.setCurrentProject,
  }));

  const [showDecConfirm, setShowDecConfirm]   = useState(false);
  const [editingRows, setEditingRows]         = useState(false);
  const [rowInput, setRowInput]               = useState('');
  const [showStars, setShowStars]             = useState(false);
  const [sock1JustDone, setSock1JustDone]     = useState(false);
  const [showSurvey, setShowSurvey]           = useState(false);
  // measurement section state
  const [displayUnit, setDisplayUnit]         = useState<'cm' | 'inches'>('cm');
  const [editingTarget, setEditingTarget]     = useState(false);
  const [targetInput, setTargetInput]         = useState('');
  const [actualRowsInput, setActualRowsInput] = useState('');

  const starChars = STRAWBERRY_THEMES.has(theme) ? STRAWBERRY_CHARS : DEFAULT_CHARS;

  const handleBothSocksDone = () => {
    stopTimer();
    completeProject(project!.id);
    triggerStars();
    // Let stars play for a moment, then slide up the survey
    setTimeout(() => setShowSurvey(true), 900);
  };

  const handleSurveyClose = () => {
    setShowSurvey(false);
    setCurrentProject(null);
    setActiveTab('projects');
  };

  const project = currentProject();
  const pattern = currentPattern();

  const section    = pattern?.sections.find(s => s.id === project?.currentSection);
  const progress   = project && section ? project.sectionProgress[section.id] : null;
  const currentRow = progress?.currentRow ?? 0;
  const totalRows  = progress?.totalRows ?? 1;
  const pct        = totalRows > 0 ? Math.min(100, (currentRow / totalRows) * 100) : 0;

  const isFinishing      = section?.id === 'finishing';
  const isMeasurement    = section?.isMeasurementBased ?? false;

  // Measurement section helpers
  const storedTarget     = progress?.targetLength ?? section?.suggestedLength ?? null;
  const storedUnit       = progress?.targetLengthUnit ?? section?.suggestedLengthUnit ?? 'cm';
  function toDisplayUnit(val: number, from: string, to: string): number {
    if (from === to) return val;
    return from === 'cm' ? val / 2.54 : val * 2.54;
  }
  const displayTarget = storedTarget !== null
    ? parseFloat(toDisplayUnit(storedTarget, storedUnit, displayUnit).toFixed(1))
    : null;

  // Sync actualRowsInput when section changes
  useEffect(() => {
    setActualRowsInput(progress?.actualRows != null ? String(progress.actualRows) : '');
    setEditingTarget(false);
  }, [project?.currentSection]);

  // Fire stars when row hits the target
  const prevRowRef = useRef(currentRow);
  useEffect(() => {
    const prev = prevRowRef.current;
    prevRowRef.current = currentRow;
    if (totalRows > 0 && currentRow === totalRows && prev < currentRow) {
      triggerStars();
    }
  }, [currentRow, totalRows]);

  function triggerStars() {
    setShowStars(true);
    setTimeout(() => setShowStars(false), 1200);
  }

  // Row instruction for current row
  const rowInstr = section?.rowInstructions?.find(r => {
    if (r.row === currentRow + 1) return true;
    if (section.repeatFromRow && currentRow + 1 >= section.repeatFromRow) {
      const repeatLen = (section.rowInstructions?.length ?? 0) - section.repeatFromRow + 1;
      if (repeatLen < 1) return false;
      const pos = ((currentRow + 1 - section.repeatFromRow) % repeatLen) + section.repeatFromRow;
      return r.row === pos;
    }
    return false;
  });

  const specialStitches = section?.specialStitches ?? [];
  const nextSection = pattern?.sections.find((_, i) => {
    const idx = pattern.sections.findIndex(s => s.id === project?.currentSection);
    return i === idx + 1;
  });

  // Swipe handlers
  const onSwipeRight = useCallback(() => incrementRow(), [incrementRow]);
  const onSwipeLeft  = useCallback(() => {
    if (currentRow > 0) setShowDecConfirm(true);
  }, [currentRow]);

  const { onTouchStart, onTouchEnd } = useSwipe({ onSwipeRight, onSwipeLeft });

  // Counter card background: warm gradient as we approach the end
  const warmFactor = Math.max(0, Math.min(1, (pct - 70) / 30)); // 0 at 70%, 1 at 100%
  const counterBg = warmFactor > 0
    ? `linear-gradient(160deg, #ffffff ${Math.round(100 - warmFactor * 40)}%, rgba(242, 166, 174, ${(warmFactor * 0.35).toFixed(2)}) 100%)`
    : '#ffffff';

  if (!project || !pattern) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <span className="text-5xl">🧶</span>
        <h2 className="font-serif text-xl text-gray-700">No active project</h2>
        <p className="text-sm text-gray-500">Go to Projects to create or select a project.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-200 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-serif text-lg font-semibold text-gray-800 truncate">{project.name}</h2>
            <p className="text-xs text-gray-500 truncate">{section?.name ?? 'No section'}</p>
          </div>
          {/* Sock 1 / 2 toggle */}
          <div className="flex bg-cream-200 rounded-xl p-0.5 flex-shrink-0">
            {([1, 2] as SockNumber[]).map(n => (
              <button
                key={n}
                onClick={() => setSock(n)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  project.currentSock === n
                    ? 'bg-white text-rose-dusty shadow-soft'
                    : 'text-gray-500'
                }`}
              >
                {n === 1 ? '1st' : '2nd'}
              </button>
            ))}
          </div>
        </div>

        {/* Section selector */}
        <select
          className="mt-2 w-full text-xs bg-cream-100 border border-cream-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-dusty"
          value={project.currentSection}
          onChange={e => setCurrentSection(e.target.value)}
        >
          {pattern.sections.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}{project.completedSections.includes(s.id) ? ' ✓' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* ── Measurement section (Leg / Foot) ── */}
      {isMeasurement && !isFinishing && (
        <div className="relative bg-white rounded-3xl shadow-card border border-cream-200">
          <div className="px-6 py-6">
            {/* Unit toggle + Mark done */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex bg-cream-200 rounded-xl p-0.5">
                {(['cm', 'inches'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setDisplayUnit(u)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      displayUnit === u
                        ? 'bg-white text-rose-dusty shadow-soft'
                        : 'text-gray-500'
                    }`}
                  >
                    {u === 'cm' ? 'cm' : 'in'}
                  </button>
                ))}
              </div>
              {progress?.completed ? (
                <span className="text-sm font-semibold text-sage">Done ✓</span>
              ) : (
                <button
                  onClick={() => {
                    if (section) completeMeasurementSection(section.id);
                    triggerStars();
                  }}
                  className="px-4 py-2 bg-sage text-white font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-soft"
                >
                  Mark done ✓
                </button>
              )}
            </div>

            {/* Target length */}
            <div className="text-center mb-5">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Target length
              </p>
              {editingTarget ? (
                <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                  <input
                    type="number"
                    step="0.5"
                    value={targetInput}
                    onChange={e => setTargetInput(e.target.value)}
                    className="w-24 text-center border border-cream-200 rounded-lg px-2 py-1 text-lg focus:outline-none focus:ring-1 focus:ring-rose-dusty"
                    autoFocus
                  />
                  <span className="text-sm text-gray-500">{displayUnit}</span>
                  <button
                    onClick={() => {
                      const n = parseFloat(targetInput);
                      if (!isNaN(n) && n > 0 && section) {
                        // store in the display unit the user entered
                        setSectionTargetLength(section.id, n, displayUnit);
                      }
                      setEditingTarget(false);
                    }}
                    className="px-3 py-1 bg-sage text-white rounded-lg text-sm"
                  >
                    Set
                  </button>
                  <button onClick={() => setEditingTarget(false)} className="px-2 py-1 text-gray-400 text-sm">✕</button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-800">
                    {displayTarget ?? '—'}
                  </span>
                  <span className="text-xl text-gray-500">{displayUnit}</span>
                  <button
                    onClick={() => {
                      setTargetInput(displayTarget != null ? String(displayTarget) : '');
                      setEditingTarget(true);
                    }}
                    className="text-xs text-gray-400 underline underline-offset-2"
                  >
                    edit
                  </button>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400">
                💡 Suggested: ~{section?.defaultRows} rows
              </p>
              {project.currentSock === 2 && section &&
                project.sock1SectionProgress?.[section.id]?.actualRows != null && (
                <p className="mt-1 text-xs text-gray-400">
                  🧦 Sock 1 knitted: {project.sock1SectionProgress[section.id].actualRows} rows
                </p>
              )}
            </div>

            {/* Actual rows logged */}
            <div className="border-t border-cream-200 pt-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Rows actually knitted
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={actualRowsInput}
                  onChange={e => setActualRowsInput(e.target.value)}
                  onBlur={() => {
                    const n = parseInt(actualRowsInput);
                    if (!isNaN(n) && n >= 0 && section) setSectionActualRows(section.id, n);
                  }}
                  className="w-24 text-center border border-cream-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"
                  placeholder="e.g. 42"
                />
                <span className="text-xs text-gray-400">rows (log when done)</span>
              </div>
            </div>
          </div>
          {showStars && <StarBurst chars={starChars} />}
        </div>
      )}

      {/* ── Finishing section ── special UI, no counter */}
      {isFinishing ? (
        <div className="relative bg-white rounded-3xl shadow-card border border-sage-light">
          <div className="px-6 py-10 text-center flex flex-col items-center gap-5">
            <span className="text-5xl">🧶</span>
            <div>
              <h3 className="font-serif text-xl font-semibold text-gray-800 mb-2">Almost there!</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                {section?.baseInstruction ?? 'Weave in ends.'}
              </p>
            </div>

            {sock1JustDone ? (
              /* ── Sock 1 complete — offer sock 2 ── */
              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-base font-semibold text-sage-dark">🧦 Sock 1 complete!</p>
                <button
                  onClick={() => {
                    setSock1JustDone(false);
                    startSock2();
                  }}
                  className="w-full max-w-xs px-8 py-3.5 bg-rose-dusty text-white font-semibold text-base rounded-2xl transition-all active:scale-95 shadow-soft"
                >
                  Start Sock 2 →
                </button>
              </div>
            ) : (
              /* ── Main done button ── */
              <>
                <button
                  onClick={() => {
                    if (project.currentSock === 1) {
                      setSock1JustDone(true);
                      triggerStars();
                    } else {
                      handleBothSocksDone();
                    }
                  }}
                  className="mt-2 px-10 py-4 bg-sage text-white font-semibold text-lg rounded-2xl transition-all active:scale-95"
                  style={{ animation: 'done-pulse 2s ease-in-out infinite' }}
                >
                  {project.currentSock === 1 ? 'Sock 1 done! 🧦' : 'Both socks done! 🎉'}
                </button>
                <p className="text-xs text-gray-400">
                  {project.currentSock === 1
                    ? 'Tap when sock 1 is finished'
                    : 'This will mark your project as complete'}
                </p>
              </>
            )}
          </div>
          {showStars && <StarBurst chars={starChars} />}
        </div>
      ) : !isMeasurement ? (
        /* ── Normal row counter ── */
        <div
          className="relative rounded-3xl shadow-card border border-cream-200 select-none cursor-pointer transition-all duration-500"
          style={{ background: counterBg }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={incrementRow}
        >
          {/* Progress bar */}
          <div className="h-1.5 bg-cream-200 rounded-t-3xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-light to-rose-dusty transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="px-6 py-8 text-center">
            {/* Row count */}
            <div className="mb-2">
              <span
                className="text-7xl font-bold tabular-nums leading-none transition-colors duration-500"
                style={{ color: warmFactor > 0.6 ? '#C47A7F' : '#1f2937' }}
              >
                {currentRow}
              </span>
            </div>
            <div className="text-sm text-gray-400 mb-1">
              of <span className="font-semibold text-gray-600">{totalRows}</span> rows
            </div>

            {/* Edit total rows */}
            {editingRows ? (
              <div className="flex items-center justify-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                <input
                  type="number"
                  value={rowInput}
                  onChange={e => setRowInput(e.target.value)}
                  className="w-20 text-center border border-cream-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"
                  placeholder={String(totalRows)}
                  autoFocus
                />
                <button
                  onClick={() => {
                    const n = parseInt(rowInput);
                    if (n > 0 && section) setSectionTotalRows(section.id, n);
                    setEditingRows(false);
                    setRowInput('');
                  }}
                  className="px-3 py-1 bg-sage text-white rounded-lg text-sm"
                >
                  Set
                </button>
                <button onClick={() => setEditingRows(false)} className="px-2 py-1 text-gray-400 text-sm">✕</button>
              </div>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); setEditingRows(true); }}
                className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
              >
                edit total
              </button>
            )}

            {/* Swipe hint */}
            <p className="mt-3 text-xs text-gray-300">Tap or swipe right to count · swipe left to undo</p>
          </div>

          {/* Star burst — anchored to counter card, bursts from centre of number */}
          {showStars && <StarBurst chars={starChars} />}
        </div>
      ) : null}

      {/* Row instruction */}
      {!isFinishing && (rowInstr || section?.baseInstruction) && (
        <div className="bg-cream-50 rounded-2xl border border-cream-200 px-4 py-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Row {currentRow + 1} instruction
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {rowInstr?.instruction ?? section?.baseInstruction}
          </p>
          {section?.notes && (
            <p className="text-xs text-gray-500 mt-1.5 italic">{section.notes}</p>
          )}
        </div>
      )}

      {/* Special stitch cards */}
      {!isFinishing && specialStitches.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">
            Stitches in this section
          </p>
          {specialStitches.map(abbr => <StitchCard key={abbr} abbr={abbr} />)}
        </div>
      )}

      {/* Advance section */}
      {!isFinishing && progress?.completed && nextSection && (
        <button
          onClick={advanceSection}
          className="w-full py-3 bg-sage text-white font-semibold rounded-2xl shadow-soft hover:bg-sage-dark active:scale-95 transition-all"
        >
          Next: {nextSection.name} →
        </button>
      )}

      {/* Timer */}
      <TimerSection />

      {/* Post-completion survey — slides up after both socks done */}
      {showSurvey && project && (
        <Survey projectId={project.id} onClose={handleSurveyClose} />
      )}

      {/* Decrement confirmation overlay */}
      {showDecConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-card mx-6 p-6 max-w-xs w-full">
            <h3 className="font-serif text-lg font-semibold text-gray-800 mb-2">Go back one row?</h3>
            <p className="text-sm text-gray-500 mb-4">Row {currentRow} → {currentRow - 1}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { decrementRow(); setShowDecConfirm(false); }}
                className="flex-1 py-2.5 bg-rose-dusty text-white font-medium rounded-xl"
              >
                Yes, go back
              </button>
              <button
                onClick={() => setShowDecConfirm(false)}
                className="flex-1 py-2.5 bg-cream-200 text-gray-600 font-medium rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
