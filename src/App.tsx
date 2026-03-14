import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Navigation } from './components/Navigation';
import { CounterScreen }  from './components/counter/CounterScreen';
import { PatternScreen }  from './components/pattern/PatternScreen';
import { SchemaScreen }   from './components/schema/SchemaScreen';
import { ProjectsScreen } from './components/projects/ProjectsScreen';
import { ToolsScreen }    from './components/tools/ToolsScreen';

const TAB_TITLES: Record<string, string> = {
  counter:  'Counter',
  pattern:  'Pattern',
  schema:   'Sock Map',
  projects: 'Projects',
  tools:    'Tools',
};

export function App() {
  const activeTab = useStore(s => s.activeTab);
  const theme = useStore(s => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* App header */}
      <header className="bg-white border-b border-cream-200 shadow-soft sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Yarn ball logo */}
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="13" fill="#F2DEDE"/>
              <path d="M8,12 Q14,6 22,10 Q28,14 24,22 Q20,28 14,26 Q8,24 8,18 Q8,14 10,12" stroke="#C47A7F" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M10,20 Q16,16 22,18" stroke="#C47A7F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M12,14 Q18,12 22,16" stroke="#C47A7F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <circle cx="22" cy="10" r="2" fill="#C47A7F"/>
              <line x1="22" y1="8" x2="26" y2="4" stroke="#C47A7F" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="25" y1="7" x2="28" y2="4" stroke="#8FAF90" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-serif text-lg font-semibold text-gray-800">StitchKit</span>
          </div>
          <span className="text-sm text-gray-400 font-medium">{TAB_TITLES[activeTab]}</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-nav-safe overflow-y-auto">
        {activeTab === 'counter'  && <CounterScreen />}
        {activeTab === 'pattern'  && <PatternScreen />}
        {activeTab === 'schema'   && <SchemaScreen />}
        {activeTab === 'projects' && <ProjectsScreen />}
        {activeTab === 'tools'    && <ToolsScreen />}
      </main>

      <Navigation />
    </div>
  );
}
