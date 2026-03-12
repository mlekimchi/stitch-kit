import { useStore } from '../store/useStore';
import type { TabName } from '../types';

const TABS: { id: TabName; label: string; icon: React.ReactNode }[] = [
  {
    id: 'counter',
    label: 'Counter',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="12" x2="15" y2="15"/>
      </svg>
    ),
  },
  {
    id: 'pattern',
    label: 'Pattern',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'schema',
    label: 'Sock',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M7 2v13"/>
        <path d="M7 15 Q7 19 11 20 L18 20 Q21 20 21 17 L21 15 Q21 12 17 12 L10 12"/>
        <path d="M10 12 L10 2"/>
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
];

export function Navigation() {
  const { activeTab, setActiveTab } = useStore(s => ({
    activeTab: s.activeTab,
    setActiveTab: s.setActiveTab,
  }));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-200 shadow-soft safe-area-inset-bottom">
      <div className="max-w-2xl mx-auto flex">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors ${
                isActive
                  ? 'text-rose-dusty'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon}
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-rose-dusty' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-rose-dusty rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
