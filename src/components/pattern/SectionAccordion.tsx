import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { StitchPopup } from './StitchPopup';
import type { PatternSection } from '../../types';

interface Props {
  section: PatternSection;
  projectId: string;
  isCurrent: boolean;
  isCompleted: boolean;
  currentRow: number;
  note: string;
}

// Render instruction text, making stitch abbreviations into tappable buttons
function InstructionText({ text, onAbbrClick }: { text: string; onAbbrClick: (abbr: string) => void }) {
  const abbrs = ['K2tog', 'SKP', 'P2tog', 'Sl1 pwise wyib', 'Sl1 pwise wyif', 'Ktbl', 'K2P2', 'K1P1'];
  // Sort by length desc so longer abbrs match first
  const sorted = [...abbrs].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sorted.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        abbrs.includes(part) ? (
          <button
            key={i}
            onClick={() => onAbbrClick(part)}
            className="font-mono text-sage-dark underline underline-offset-2 hover:text-rose-dusty transition-colors"
          >
            {part}
          </button>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function SectionAccordion({ section, projectId, isCurrent, isCompleted, currentRow, note }: Props) {
  const [open, setOpen]           = useState(isCurrent);
  const [editNote, setEditNote]   = useState(false);
  const [noteText, setNoteText]   = useState(note);
  const [popupAbbr, setPopupAbbr] = useState<string | null>(null);

  const saveNote = useStore(s => s.saveNote);

  const handleSaveNote = () => {
    saveNote(projectId, section.id, noteText);
    setEditNote(false);
  };

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all ${
      isCurrent
        ? 'border-rose-dusty bg-rose-pale/30'
        : isCompleted
          ? 'border-sage-light bg-sage-pale/20'
          : 'border-cream-200 bg-white'
    }`}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          {isCompleted && <span className="text-sage text-sm">✓</span>}
          {isCurrent && <span className="w-1.5 h-1.5 bg-rose-dusty rounded-full flex-shrink-0" />}
          <span className={`font-medium text-sm ${isCurrent ? 'text-rose-dark' : 'text-gray-700'}`}>
            {section.name}
          </span>
          {isCurrent && (
            <span className="text-xs text-rose-dusty bg-rose-pale px-1.5 py-0.5 rounded-full">
              row {currentRow}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Row-by-row instructions */}
          {section.rowInstructions && section.rowInstructions.length > 0 ? (
            <div className="space-y-1.5">
              {section.rowInstructions.map(ri => (
                <div
                  key={ri.row}
                  className={`flex gap-2 text-sm rounded-lg px-3 py-2 ${
                    isCurrent && ri.row === currentRow + 1
                      ? 'bg-rose-dusty/10 border border-rose-dusty/30'
                      : 'bg-cream-50'
                  }`}
                >
                  <span className="text-gray-400 tabular-nums w-6 flex-shrink-0">
                    {ri.isRepeat ? '↻' : ri.row}
                  </span>
                  <span className="text-gray-700 leading-snug">
                    <InstructionText text={ri.instruction} onAbbrClick={setPopupAbbr} />
                  </span>
                </div>
              ))}
              {section.repeatFromRow && (
                <p className="text-xs text-gray-400 italic px-1">
                  ↻ Repeat rows {section.repeatFromRow}+ until section complete
                </p>
              )}
            </div>
          ) : (
            <div className="bg-cream-50 rounded-xl px-3 py-2 text-sm text-gray-700 leading-relaxed">
              <InstructionText text={section.baseInstruction} onAbbrClick={setPopupAbbr} />
            </div>
          )}

          {/* Pattern notes */}
          {section.notes && (
            <div className="bg-yarn-warm/30 rounded-xl px-3 py-2 text-xs text-gray-600 leading-relaxed italic">
              {section.notes}
            </div>
          )}

          {/* User notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">My Notes</span>
              {!editNote && (
                <button onClick={() => setEditNote(true)} className="text-xs text-rose-dusty hover:text-rose-dark">
                  {note ? 'Edit' : '+ Add note'}
                </button>
              )}
            </div>
            {editNote ? (
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={3}
                  className="w-full text-sm border border-cream-300 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-rose-dusty bg-white"
                  placeholder="Your notes for this section…"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveNote} className="px-3 py-1.5 bg-sage text-white text-xs rounded-lg font-medium">Save</button>
                  <button onClick={() => { setEditNote(false); setNoteText(note); }} className="px-3 py-1.5 bg-cream-200 text-gray-600 text-xs rounded-lg">Cancel</button>
                </div>
              </div>
            ) : note ? (
              <p className="text-sm text-gray-600 leading-relaxed bg-cream-50 rounded-xl px-3 py-2">{note}</p>
            ) : (
              <p className="text-xs text-gray-300 italic">No notes yet</p>
            )}
          </div>
        </div>
      )}

      {popupAbbr && <StitchPopup abbr={popupAbbr} onClose={() => setPopupAbbr(null)} />}
    </div>
  );
}
