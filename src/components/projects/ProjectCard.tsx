import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { getPatternById } from '../../data/patterns';
import type { Project } from '../../types';

interface Props {
  project: Project;
  onSurvey?: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ProjectCard({ project, onSurvey }: Props) {
  const { setCurrentProject, deleteProject, completeProject, customPatterns, setActiveTab } = useStore(s => ({
    setCurrentProject: s.setCurrentProject,
    deleteProject:     s.deleteProject,
    completeProject:   s.completeProject,
    customPatterns:    s.customPatterns,
    setActiveTab:      s.setActiveTab,
  }));

  const pattern = getPatternById(project.patternId, customPatterns);

  // Overall progress across all sections
  const totalRows = Object.values(project.sectionProgress).reduce((sum, s) => sum + s.totalRows, 0);
  const doneRows  = Object.values(project.sectionProgress).reduce((sum, s) => sum + s.currentRow, 0);
  const pct       = totalRows > 0 ? Math.round((doneRows / totalRows) * 100) : 0;

  const handleSelect = () => {
    setCurrentProject(project.id);
    setActiveTab('counter');
  };

  const [showMenu, setShowMenu] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-soft border overflow-hidden transition-all ${
      project.isComplete ? 'border-sage-light' : 'border-cream-200'
    }`}>
      <div className="px-4 py-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1" onClick={handleSelect} style={{ cursor: 'pointer' }}>
            <h3 className="font-serif font-semibold text-gray-800 truncate">{project.name}</h3>
            {project.recipient && (
              <p className="text-xs text-gray-500 mt-0.5">For {project.recipient}</p>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <button onClick={() => setShowMenu(m => !m)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <circle cx="12" cy="5"  r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)}/>
                <div className="absolute right-0 top-6 z-40 bg-white rounded-xl shadow-card border border-cream-200 py-1 min-w-[140px]">
                  <button onClick={() => { handleSelect(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-cream-100">
                    Open project
                  </button>
                  {!project.isComplete && (
                    <button onClick={() => { completeProject(project.id); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-sage-dark hover:bg-cream-100">
                      Mark complete
                    </button>
                  )}
                  {project.isComplete && !project.surveyId && (
                    <button onClick={() => { onSurvey?.(project.id); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-rose-dusty hover:bg-cream-100">
                      Fill survey
                    </button>
                  )}
                  {!project.isComplete && (
                    <button onClick={() => { setShowAbandonModal(true); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-cream-100">
                      Abandon
                    </button>
                  )}
                  {project.isComplete && (
                    <button onClick={() => { deleteProject(project.id); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-cream-100">
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          {pattern && <span>{pattern.name}</span>}
          <span>{project.yarn.brand} · {project.yarn.colorway}</span>
          <span>{project.needleSize}</span>
          <span>Started {formatDate(project.dateStarted)}</span>
          {project.isComplete && project.dateCompleted && (
            <span className="text-sage-dark">Finished {formatDate(project.dateCompleted)}</span>
          )}
        </div>

        {/* Progress bar */}
        {!project.isComplete && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span className="capitalize">
                {project.currentSection.replace('-', ' ')}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-light to-rose-dusty rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Completion badge */}
        {project.isComplete && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs bg-sage-pale text-sage-dark px-2 py-0.5 rounded-full font-medium">✓ Complete</span>
            {!project.surveyId && (
              <button
                onClick={() => onSurvey?.(project.id)}
                className="text-xs text-rose-dusty underline underline-offset-2"
              >
                Add survey
              </button>
            )}
          </div>
        )}
      </div>

      {/* Abandon confirmation modal */}
      {showAbandonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-6" onClick={() => setShowAbandonModal(false)}>
          <div className="bg-white rounded-3xl shadow-card p-6 w-full max-w-xs text-center space-y-4" onClick={e => e.stopPropagation()}>
            <span className="text-4xl block">🧦</span>
            <h3 className="font-serif text-lg font-semibold text-gray-800">Abandon this sock?</h3>
            <p className="text-sm text-gray-500">Your progress on <span className="font-medium text-gray-700">{project.name}</span> will be lost.</p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowAbandonModal(false)}
                className="flex-1 py-2.5 bg-cream-200 text-gray-600 font-medium rounded-2xl hover:bg-cream-300 transition-all"
              >
                Keep knitting
              </button>
              <button
                onClick={() => { deleteProject(project.id); setShowAbandonModal(false); }}
                className="flex-1 py-2.5 bg-rose-dusty text-white font-semibold rounded-2xl hover:bg-rose-dark active:scale-95 transition-all"
              >
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

