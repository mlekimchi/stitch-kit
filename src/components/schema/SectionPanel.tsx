import { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { PatternSection, SchemaZone } from '../../types';

interface Props {
  zone: SchemaZone;
  sections: PatternSection[];
  projectId: string;
  notes: Record<string, string>;
  onClose: () => void;
}

const ZONE_NAMES: Record<SchemaZone, string> = {
  cuff:             'Cuff',
  leg:              'Leg',
  'heel-flap':      'Heel Flap',
  'heel-turn':      'Heel Turn',
  gusset:           'Gusset',
  foot:             'Foot',
  toe:              'Toe',
  'short-row-heel': 'Short Row Heel',
};

export function SectionPanel({ zone, sections, projectId, notes, onClose }: Props) {
  const saveNote = useStore(s => s.saveNote);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const zoneSections = sections.filter(s => s.schemaZone === zone);

  const startEdit = (sectionId: string) => {
    setEditingSectionId(sectionId);
    setNoteText(notes[sectionId] ?? '');
  };

  const handleSave = (sectionId: string) => {
    saveNote(projectId, sectionId, noteText);
    setEditingSectionId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-card max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-cream-300 rounded-full" />
        </div>

        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-semibold text-gray-800">{ZONE_NAMES[zone]}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>

          {zoneSections.length === 0 ? (
            <p className="text-sm text-gray-500">No sections mapped to this zone.</p>
          ) : (
            <div className="space-y-4">
              {zoneSections.map(section => (
                <div key={section.id} className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 border-b border-cream-200 pb-1">{section.name}</h4>

                  {/* Instructions */}
                  <div className="text-sm text-gray-600 bg-cream-50 rounded-xl px-3 py-2 leading-relaxed">
                    {section.baseInstruction}
                  </div>

                  {section.notes && (
                    <p className="text-xs text-gray-500 italic px-1">{section.notes}</p>
                  )}

                  {/* User notes */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">My Notes</span>
                      {editingSectionId !== section.id && (
                        <button
                          onClick={() => startEdit(section.id)}
                          className="text-xs text-rose-dusty hover:text-rose-dark"
                        >
                          {notes[section.id] ? 'Edit' : '+ Add'}
                        </button>
                      )}
                    </div>

                    {editingSectionId === section.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          rows={3}
                          className="w-full text-sm border border-cream-300 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-rose-dusty"
                          placeholder="Your notes…"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleSave(section.id)} className="px-3 py-1.5 bg-sage text-white text-xs rounded-lg font-medium">Save</button>
                          <button onClick={() => setEditingSectionId(null)} className="px-3 py-1.5 bg-cream-200 text-gray-600 text-xs rounded-lg">Cancel</button>
                        </div>
                      </div>
                    ) : notes[section.id] ? (
                      <p className="text-sm text-gray-600 bg-cream-50 rounded-xl px-3 py-2">{notes[section.id]}</p>
                    ) : (
                      <p className="text-xs text-gray-300 italic">No notes yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
