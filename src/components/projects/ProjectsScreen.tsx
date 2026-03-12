import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ProjectCard } from './ProjectCard';
import { NewProjectForm } from './NewProjectForm';
import { Survey } from '../tools/Survey';

export function ProjectsScreen() {
  const [showNewForm, setShowNewForm]   = useState(false);
  const [surveyProjectId, setSurveyProjectId] = useState<string | null>(null);

  const projects = useStore(s => s.projects);

  const sorted = [...projects].sort(
    (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
  );

  const active    = sorted.filter(p => !p.isComplete);
  const completed = sorted.filter(p => p.isComplete);

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-gray-800">Projects</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-rose-dusty text-white font-medium rounded-xl text-sm hover:bg-rose-dark active:scale-95 transition-all"
        >
          <span className="text-lg leading-none">+</span>
          New
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 space-y-3">
          <span className="text-5xl block">🧶</span>
          <h3 className="font-serif text-lg text-gray-700">No projects yet</h3>
          <p className="text-sm text-gray-500">Tap + New to cast on your first project.</p>
        </div>
      )}

      {/* Active projects */}
      {active.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">In Progress</p>
          {active.map(p => (
            <ProjectCard key={p.id} project={p} onSurvey={setSurveyProjectId} />
          ))}
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Completed</p>
          {completed.map(p => (
            <ProjectCard key={p.id} project={p} onSurvey={setSurveyProjectId} />
          ))}
        </div>
      )}

      {showNewForm && <NewProjectForm onClose={() => setShowNewForm(false)} />}
      {surveyProjectId && (
        <Survey projectId={surveyProjectId} onClose={() => setSurveyProjectId(null)} />
      )}
    </div>
  );
}
