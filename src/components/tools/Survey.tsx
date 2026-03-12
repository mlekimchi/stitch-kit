import { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import type { Survey as SurveyType } from '../../types';

interface Props {
  projectId: string;
  onClose: () => void;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-2xl transition-transform active:scale-90 ${n <= value ? 'text-yarn-warm' : 'text-cream-300'}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export function Survey({ projectId, onClose }: Props) {
  const { saveSurvey, projects } = useStore(s => ({
    saveSurvey: s.saveSurvey,
    projects:   s.projects,
  }));

  const project = projects.find(p => p.id === projectId);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<SurveyType, 'id' | 'completedAt'>>({
    projectId,
    widthFit:          'Just right',
    lengthFit:         'Just right',
    yarnSoftness:      3,
    yarnStretch:       3,
    colorSatisfaction: 3,
    wouldUseYarnAgain: 'Yes',
    photo:             undefined,
    notes:             '',
  });

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSurvey(form);
    onClose();
  };

  type FitOpt = 'Too tight' | 'Just right' | 'Too loose';
  type LenOpt = 'Too short' | 'Just right' | 'Too long';

  const SegmentedControl = <T extends string>({
    label, value, options, onChange,
  }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="flex bg-cream-100 rounded-xl p-0.5 gap-0.5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              value === opt ? 'bg-white text-rose-dark shadow-soft' : 'text-gray-500'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-card max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-cream-300 rounded-full"/>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-5">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="font-serif text-xl font-semibold text-gray-800">Project Survey</h2>
              {project && <p className="text-xs text-gray-500">{project.name}</p>}
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
          </div>

          <SegmentedControl<FitOpt>
            label="Width fit"
            value={form.widthFit}
            options={['Too tight', 'Just right', 'Too loose']}
            onChange={v => set('widthFit', v)}
          />

          <SegmentedControl<LenOpt>
            label="Length fit"
            value={form.lengthFit}
            options={['Too short', 'Just right', 'Too long']}
            onChange={v => set('lengthFit', v)}
          />

          <StarRating label="Yarn Softness" value={form.yarnSoftness} onChange={v => set('yarnSoftness', v as 1|2|3|4|5)} />
          <StarRating label="Yarn Stretch" value={form.yarnStretch} onChange={v => set('yarnStretch', v as 1|2|3|4|5)} />
          <StarRating label="Color Satisfaction" value={form.colorSatisfaction} onChange={v => set('colorSatisfaction', v as 1|2|3|4|5)} />

          <SegmentedControl<'Yes'|'No'|'Maybe'>
            label="Would you use this yarn again?"
            value={form.wouldUseYarnAgain}
            options={['Yes', 'No', 'Maybe']}
            onChange={v => set('wouldUseYarnAgain', v)}
          />

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Photo</label>
            {form.photo ? (
              <div className="relative">
                <img src={form.photo} alt="Project" className="w-full h-40 object-cover rounded-2xl"/>
                <button
                  type="button"
                  onClick={() => set('photo', undefined)}
                  className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-cream-300 rounded-2xl text-sm text-gray-400 hover:border-rose-dusty hover:text-rose-dusty transition-colors"
              >
                + Upload photo
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Free Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              placeholder="Any other thoughts about this project?"
              className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-rose-dusty"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-rose-dusty text-white font-semibold rounded-2xl hover:bg-rose-dark active:scale-95 transition-all">
              Save Survey
            </button>
            <button type="button" onClick={onClose} className="px-5 py-3 bg-cream-200 text-gray-600 rounded-2xl hover:bg-cream-300 transition-all">
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
