import { useStore } from '../../store/useStore';
import { SectionAccordion } from './SectionAccordion';

export function PatternScreen() {
  const { currentProject, currentPattern } = useStore(s => ({
    currentProject: s.currentProject,
    currentPattern: s.currentPattern,
  }));

  const project = currentProject();
  const pattern = currentPattern();

  if (!project || !pattern) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <span className="text-5xl">📋</span>
        <h2 className="font-serif text-xl text-gray-700">No active project</h2>
        <p className="text-sm text-gray-500">Select a project from the Projects tab to view its pattern.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4">
      {/* Pattern header */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-200 px-4 py-3">
        <h2 className="font-serif text-lg font-semibold text-gray-800">{pattern.name}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{pattern.description}</p>
        <div className="flex gap-3 mt-2 text-xs text-gray-500">
          <span className="bg-cream-100 px-2 py-0.5 rounded-lg">{pattern.castOn} sts cast on</span>
          <span className="bg-cream-100 px-2 py-0.5 rounded-lg">{pattern.needleSize}</span>
          {pattern.targetFootLength && (
            <span className="bg-cream-100 px-2 py-0.5 rounded-lg">{pattern.targetFootLength}cm foot</span>
          )}
        </div>
      </div>

      {/* Sections */}
      {pattern.sections.map(section => (
        <SectionAccordion
          key={section.id}
          section={section}
          projectId={project.id}
          isCurrent={project.currentSection === section.id}
          isCompleted={project.completedSections.includes(section.id)}
          currentRow={project.sectionProgress[section.id]?.currentRow ?? 0}
          note={project.notes[section.id] ?? ''}
        />
      ))}
    </div>
  );
}
