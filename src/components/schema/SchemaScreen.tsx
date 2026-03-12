import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { SockDiagram } from './SockDiagram';
import { SectionPanel } from './SectionPanel';
import type { SchemaZone } from '../../types';

export function SchemaScreen() {
  const [selectedZone, setSelectedZone] = useState<SchemaZone | null>(null);

  const { currentProject, currentPattern } = useStore(s => ({
    currentProject: s.currentProject,
    currentPattern: s.currentPattern,
  }));

  const project = currentProject();
  const pattern = currentPattern();

  if (!project || !pattern) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <span className="text-5xl">🧦</span>
        <h2 className="font-serif text-xl text-gray-700">No active project</h2>
        <p className="text-sm text-gray-500">Select a project to see its sock schema.</p>
      </div>
    );
  }

  // Determine current zone from current section
  const currentSection = pattern.sections.find(s => s.id === project.currentSection);
  const currentZone = currentSection?.schemaZone ?? null;

  // Determine completed zones
  const completedZones = [
    ...new Set(
      project.completedSections
        .map(sid => pattern.sections.find(s => s.id === sid)?.schemaZone)
        .filter((z): z is SchemaZone => z !== undefined)
    ),
  ];

  // Zone stats helper
  const zoneStats = (zone: SchemaZone) => {
    const sections = pattern.sections.filter(s => s.schemaZone === zone);
    const total    = sections.reduce((sum, s) => sum + (project.sectionProgress[s.id]?.totalRows ?? s.defaultRows), 0);
    const done     = sections.reduce((sum, s) => sum + (project.sectionProgress[s.id]?.currentRow ?? 0), 0);
    return { sections: sections.length, total, done };
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="bg-white rounded-2xl shadow-soft border border-cream-200 px-4 py-3">
        <h2 className="font-serif text-lg font-semibold text-gray-800">{project.name}</h2>
        <p className="text-sm text-gray-500">Tap a zone to view instructions and notes.</p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-xs px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-sage inline-block"/>
          <span className="text-gray-500">Completed</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-dusty inline-block"/>
          <span className="text-gray-500">Current</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cream-300 inline-block"/>
          <span className="text-gray-500">Upcoming</span>
        </span>
      </div>

      {/* Sock SVG diagram */}
      <div className="bg-white rounded-3xl shadow-soft border border-cream-200 p-4">
        <SockDiagram
          completedZones={completedZones}
          currentZone={currentZone}
          onZoneClick={setSelectedZone}
          heelType={pattern.heelType ?? 'heel-flap'}
        />
      </div>

      {/* Zone quick reference list */}
      <div className="space-y-2">
        {(pattern.heelType === 'short-row'
          ? (['cuff','leg','short-row-heel','foot','toe'] as SchemaZone[])
          : (['cuff','leg','heel-flap','heel-turn','gusset','foot','toe'] as SchemaZone[])
        ).map(zone => {
          const stats     = zoneStats(zone);
          const isComp    = completedZones.includes(zone);
          const isCurrent = currentZone === zone;
          const pct       = stats.total > 0 ? Math.min(100, (stats.done / stats.total) * 100) : 0;

          return (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`w-full text-left rounded-2xl border px-4 py-2.5 transition-all ${
                isCurrent  ? 'border-rose-dusty bg-rose-pale/20' :
                isComp     ? 'border-sage-light bg-sage-pale/20' :
                             'border-cream-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${isCurrent ? 'text-rose-dark' : 'text-gray-700'}`}>
                  {isCurrent && <span className="mr-1.5 text-rose-dusty">▶</span>}
                  {isComp    && <span className="mr-1.5 text-sage">✓</span>}
                  {zone.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
                <span className="text-xs text-gray-400">{Math.round(pct)}%</span>
              </div>
              <div className="mt-1.5 h-1 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isComp ? 'bg-sage' : isCurrent ? 'bg-rose-dusty' : 'bg-cream-300'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Side panel / modal */}
      {selectedZone && (
        <SectionPanel
          zone={selectedZone}
          sections={pattern.sections}
          projectId={project.id}
          notes={project.notes}
          onClose={() => setSelectedZone(null)}
        />
      )}
    </div>
  );
}
