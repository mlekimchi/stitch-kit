import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PRELOADED_PATTERNS } from '../../data/patterns';
import type { YarnWeight, SockNumber } from '../../types';

const NEEDLE_SIZES = [
  'US 0 (2.0mm)', 'US 1 (2.25mm)', 'US 1.5 (2.5mm)', 'US 2 (2.75mm)',
  'US 3 (3.25mm)', 'US 4 (3.5mm)', 'US 5 (3.75mm)', 'US 6 (4.0mm)',
  'US 7 (4.5mm)', 'US 8 (5.0mm)', 'US 9 (5.5mm)', 'US 10 (6.0mm)',
  'US 10.5 (6.5mm)', 'US 11 (8.0mm)', 'US 13 (9.0mm)', 'US 15 (10.0mm)',
];

const YARN_WEIGHTS: YarnWeight[] = ['Lace', 'Fingering', 'Sport', 'DK', 'Worsted', 'Bulky'];

interface Props {
  onClose: () => void;
}

export function NewProjectForm({ onClose }: Props) {
  const { addProject, customPatterns } = useStore(s => ({
    addProject:     s.addProject,
    customPatterns: s.customPatterns,
  }));

  const allPatterns = [...PRELOADED_PATTERNS, ...customPatterns];

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name:        '',

    patternId:   allPatterns[0]?.id ?? '',
    yarnBrand:   '',
    yarnName:    '',
    colorway:    '',
    weight:      'Fingering' as YarnWeight,
    needleSize:  'US 1 (2.25mm)',
    customNeedle:'',
    useCustomNeedle: false,
    dateStarted: today,
    customFootLength: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Project name is required';
    if (!form.patternId)   e.patternId = 'Select a pattern';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const needleSize = form.useCustomNeedle ? form.customNeedle : form.needleSize;

    addProject({
      name:        form.name.trim(),
      recipient:   '',
      patternId:   form.patternId,
      customFootLength: form.customFootLength ? parseFloat(form.customFootLength) : undefined,
      yarn: {
        brand:    form.yarnBrand.trim(),
        name:     form.yarnName.trim(),
        colorway: form.colorway.trim(),
        weight:   form.weight,
      },
      needleSize,
      dateStarted:      form.dateStarted,
      currentSection:   '',
      currentRow:       0,
      currentSock:      1 as SockNumber,
      sectionProgress:  {},
      completedSections:[],
      isComplete:       false,
      notes:            {},
    });

    onClose();
  };

  const set = (key: string, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-card max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-cream-300 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-nav-safe space-y-4">
          <h2 className="font-serif text-xl font-semibold text-gray-800 pt-2">New Project</h2>

          {/* Project name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Project Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Winter Socks 2025"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty ${errors.name ? 'border-red-300' : 'border-cream-300'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Pattern */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Pattern *</label>
            <select
              value={form.patternId}
              onChange={e => set('patternId', e.target.value)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty bg-white ${errors.patternId ? 'border-red-300' : 'border-cream-300'}`}
            >
              {allPatterns.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Foot length for Husband's socks */}
          {form.patternId === 'husbands-socks' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Foot Length (cm)</label>
              <input
                type="number"
                step="0.5"
                value={form.customFootLength}
                onChange={e => set('customFootLength', e.target.value)}
                placeholder="e.g. 26"
                className="w-full border border-cream-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"
              />
            </div>
          )}

          {/* Yarn section */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Yarn</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Brand</label>
                <input type="text" value={form.yarnBrand} onChange={e => set('yarnBrand', e.target.value)}
                  placeholder="e.g. Malabrigo" className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"/>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input type="text" value={form.yarnName} onChange={e => set('yarnName', e.target.value)}
                  placeholder="e.g. Sock" className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"/>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Colorway</label>
                <input type="text" value={form.colorway} onChange={e => set('colorway', e.target.value)}
                  placeholder="e.g. Sunset" className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"/>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Weight</label>
                <select value={form.weight} onChange={e => set('weight', e.target.value)}
                  className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-rose-dusty">
                  {YARN_WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Needle size */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Needle Size</label>
            {!form.useCustomNeedle ? (
              <div className="flex gap-2">
                <select value={form.needleSize} onChange={e => set('needleSize', e.target.value)}
                  className="flex-1 border border-cream-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-rose-dusty">
                  {NEEDLE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button type="button" onClick={() => set('useCustomNeedle', true)}
                  className="px-3 py-2 text-xs text-gray-500 border border-cream-300 rounded-xl hover:bg-cream-100">Custom</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={form.customNeedle} onChange={e => set('customNeedle', e.target.value)}
                  placeholder="e.g. 2.4mm" className="flex-1 border border-cream-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"/>
                <button type="button" onClick={() => set('useCustomNeedle', false)}
                  className="px-3 py-2 text-xs text-gray-500 border border-cream-300 rounded-xl hover:bg-cream-100">Preset</button>
              </div>
            )}
          </div>

          {/* Date started */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Date Started</label>
            <input type="date" value={form.dateStarted} onChange={e => set('dateStarted', e.target.value)}
              className="w-full border border-cream-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-dusty"/>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 bg-rose-dusty text-white font-semibold rounded-2xl hover:bg-rose-dark active:scale-95 transition-all">
              Create Project
            </button>
            <button type="button" onClick={onClose} className="px-5 py-3 bg-cream-200 text-gray-600 font-medium rounded-2xl hover:bg-cream-300 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
