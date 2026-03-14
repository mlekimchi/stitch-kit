import { useState } from 'react';
import { PatternBuilder } from './PatternBuilder';
import { useStore } from '../../store/useStore';
import { STITCH_LIBRARY } from '../../data/stitches';
import { StitchPopup } from '../pattern/StitchPopup';

type ToolTab = 'builder' | 'stitches' | 'settings';

export function ToolsScreen() {
  const [activeTab, setActiveTab] = useState<ToolTab>('builder');
  const [selectedStitch, setSelectedStitch] = useState<string | null>(null);

  const { customPatterns, addCustomPattern: _, ...rest } = useStore(s => ({
    customPatterns: s.customPatterns,
    addCustomPattern: s.addCustomPattern,
  }));

  const tabs: { id: ToolTab; label: string }[] = [
    { id: 'builder',  label: 'Pattern Builder' },
    { id: 'stitches', label: 'Stitch Library' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-4 pb-4">
      <h2 className="font-serif text-xl font-semibold text-gray-800">Tools</h2>

      {/* Sub-tabs */}
      <div className="flex bg-cream-100 rounded-xl p-0.5 gap-0.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-800 shadow-soft'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pattern Builder */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-2xl shadow-soft border border-cream-200 p-4">
          <PatternBuilder />
        </div>
      )}

      {/* Stitch Library */}
      {activeTab === 'stitches' && (
        <div className="space-y-3">
          {(['decrease', 'slip', 'rib', 'special'] as const).map(cat => {
            const stitches = STITCH_LIBRARY.filter(s => s.category === cat);
            if (!stitches.length) return null;
            return (
              <div key={cat}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {cat}
                </p>
                <div className="space-y-2">
                  {stitches.map(stitch => (
                    <button
                      key={stitch.abbr}
                      onClick={() => setSelectedStitch(stitch.abbr)}
                      className="w-full flex items-center gap-3 bg-white rounded-2xl border border-cream-200 px-4 py-3 text-left hover:border-rose-dusty hover:bg-rose-pale/10 transition-all"
                    >
                      <div
                        className="w-10 h-10 flex-shrink-0 bg-cream-100 rounded-xl p-1"
                        dangerouslySetInnerHTML={{ __html: stitch.svgPath }}
                      />
                      <div>
                        <p className="font-mono font-semibold text-sm text-gray-800">{stitch.abbr}</p>
                        <p className="text-xs text-gray-500">{stitch.name}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <SettingsPanel />
      )}

      {selectedStitch && <StitchPopup abbr={selectedStitch} onClose={() => setSelectedStitch(null)} />}
    </div>
  );
}

const THEMES = [
  {
    id: 'cozy',
    name: 'Cozy',
    swatches: ['#FBF6EC', '#C47A7F', '#8FAF90'],
  },
  {
    id: 'botanical',
    name: 'Botanical',
    swatches: ['#EFEBCE', '#BB8588', '#A3A380'],
  },
  {
    id: 'sky',
    name: 'Sky',
    swatches: ['#EEE2DF', '#5B61B2', '#6DA0E1'],
  },
  {
    id: 'garden',
    name: 'Garden',
    swatches: ['#FFF0FC', '#DB3E8C', '#7758A3'],
  },
  {
    id: 'choc-straw-milk-tea',
    name: 'Choc Strawberry Milk Tea',
    swatches: ['#F2CFCA', '#EC9C9D', '#7F5836'],
  },
  {
    id: 'matcha-strawberry',
    name: 'Matcha Strawberry',
    swatches: ['#EEF2DD', '#DD716B', '#9FC76B'],
  },
  {
    id: 'neapolitan',
    name: 'Neapolitan',
    swatches: ['#FAD6D3', '#F28AA1', '#E7AE75'],
  },
];

function SettingsPanel() {
  const { customPatterns, theme, setTheme } = useStore(s => ({
    customPatterns: s.customPatterns,
    theme: s.theme,
    setTheme: s.setTheme,
  }));

  const handleClearData = () => {
    if (window.confirm('Clear all StitchKit data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-3">
      {/* Custom patterns */}
      {customPatterns.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft border border-cream-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Custom Patterns</h3>
          <div className="space-y-2">
            {customPatterns.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm text-gray-600 bg-cream-50 rounded-xl px-3 py-2">
                <span className="truncate">{p.name}</span>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{p.sections.length} sections</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme picker */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Theme</h3>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                theme === t.id
                  ? 'border-rose-dusty bg-rose-pale/30 shadow-soft'
                  : 'border-cream-200 hover:border-cream-300'
              }`}
            >
              <div className="flex gap-0.5 flex-shrink-0">
                {t.swatches.map((c, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border border-white/60" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700 truncate">{t.name}</span>
              {theme === t.id && (
                <span className="ml-auto text-rose-dusty text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">About StitchKit</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          A cozy stitch-counting companion for knitters. All data is stored locally on your device.
        </p>
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
          <span>v0.1.0</span>
          <span>·</span>
          <span>3 preloaded patterns</span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-soft border border-red-100 p-4">
        <h3 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h3>
        <button
          onClick={handleClearData}
          className="w-full py-2.5 border border-red-200 text-red-500 text-sm rounded-xl hover:bg-red-50 transition-colors"
        >
          Clear all data
        </button>
      </div>
    </div>
  );
}
