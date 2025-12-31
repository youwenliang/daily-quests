
import { useState, useEffect } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { QuestList } from './components/QuestList';
import { CalendarView } from './components/CalendarView';
import type { Quest } from './types';
import { triggerConfetti } from './utils/confetti';
import { saveDailyProgress, getLogicalDate } from './utils/history';
import { Sparkles, Swords, Calendar, ListCheck } from 'lucide-react';

const STORAGE_KEY = 'daily-quests-data-v2';
const LAST_VISIT_KEY = 'daily-quests-last-visit';

function App() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    // Default quests based on User's request
    return [
      { id: '1', text: '臉部保養與運動', type: 'counter', completed: false, current: 0, target: 2, unit: 'times' },
      { id: '2', text: '走路 8000 步', type: 'counter', completed: false, current: 0, target: 8000, unit: 'steps' },
      { id: '3', text: '晚上專注一小時', type: 'boolean', completed: false },
      { id: '4', text: '每天運動半小時', type: 'boolean', completed: false },
      { id: '5', text: '每天 10 分鐘 Reset', type: 'boolean', completed: false },
      { id: '6', text: '每天寫日記轉成數位版', type: 'boolean', completed: false },
      { id: '7', text: '每天閱讀', type: 'boolean', completed: false },
      { id: '8', text: '每天十二點前上床', type: 'boolean', completed: false },
    ];
  });

  const [lastVisit, setLastVisit] = useState(() => {
    return localStorage.getItem(LAST_VISIT_KEY) || getLogicalDate();
  });

  const checkAndResetDaily = () => {
    const today = getLogicalDate();
    if (lastVisit !== today) {
      // Daily Reset
      setQuests(prev => prev.map(q => ({
        ...q,
        completed: false,
        current: q.type === 'counter' ? 0 : undefined
      })));
      setLastVisit(today);
      localStorage.setItem(LAST_VISIT_KEY, today);
    }
  };

  useEffect(() => {
    checkAndResetDaily();

    // Check visibility focus to ensure reset happens if app stays open overnight
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkAndResetDaily();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    const interval = setInterval(checkAndResetDaily, 60000); // Check every minute

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [lastVisit]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
  }, [quests]);

  const progress = quests.length > 0
    ? (quests.filter(q => q.completed).length / quests.length) * 100
    : 0;

  // Save history whenever progress changes
  useEffect(() => {
    saveDailyProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (progress === 100 && quests.length > 0) {
      triggerConfetti();
    }
  }, [progress, quests.length]);

  const addQuest = (text: string) => {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      text,
      type: 'boolean', // Default to boolean for new custom ones
      completed: false,
    };
    setQuests([...quests, newQuest]);
  };

  const toggleQuest = (id: string) => {
    setQuests(quests.map(q => {
      if (q.id !== id) return q;
      if (q.type === 'boolean') {
        return { ...q, completed: !q.completed };
      }
      return q;
    }));
  };

  const updateProgress = (id: string, newCurrent: number) => {
    setQuests(quests.map(q => {
      if (q.id !== id) return q;
      if (q.type !== 'counter' || q.target === undefined) return q;

      const safeCurrent = Math.max(0, newCurrent);
      const isCompleted = safeCurrent >= q.target;

      return {
        ...q,
        current: safeCurrent,
        completed: isCompleted
      };
    }));
  };

  const deleteQuest = (id: string) => {
    setQuests(quests.filter(q => q.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-slate-900 text-slate-100 font-sans selection:bg-violet-500/30 overflow-hidden flex flex-col">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col h-full">
        {/* Fixed Header */}
        <header className="px-6 py-6 text-center flex-none">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10"></div> {/* Spacer */}
            <div className="inline-flex items-center justify-center p-2 bg-slate-800/50 rounded-2xl backdrop-blur-sm shadow-xl ring-1 ring-white/10">
              <Swords size={24} className="text-violet-400 mr-2" />
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-wide">
                DAILY QUESTS
              </h1>
            </div>

            {/* View Toggle */}
            <button
              onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 hover:bg-slate-700/80 transition-all border border-slate-700/50 hover:border-violet-500/30"
            >
              {view === 'list' ? <Calendar size={20} className="text-fuchsia-400" /> : <ListCheck size={20} className="text-violet-400" />}
            </button>
          </div>

          <ProgressBar progress={progress} />

          {progress === 100 && quests.length > 0 && view === 'list' && (
            <div className="mt-2 inline-block animate-bounce text-fuchsia-400 font-bold flex items-center justify-center gap-2 text-sm">
              <Sparkles size={16} />
              <span>All Quests Complete!</span>
              <Sparkles size={16} />
            </div>
          )}
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-8 scrollbar-hide mask-image-b">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-1 shadow-2xl border border-slate-700/30 ring-1 ring-white/5 min-h-[500px]">
            {view === 'list' ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Active Missions
                    <span className="bg-slate-800 text-xs py-1 px-2 rounded-lg text-slate-400 font-mono border border-slate-700">
                      {quests.filter(q => q.completed).length}/{quests.length}
                    </span>
                  </h2>
                </div>

                <QuestList
                  quests={quests}
                  onToggle={toggleQuest}
                  onUpdateProgress={updateProgress}
                  onDelete={deleteQuest}
                  onAdd={addQuest}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <CalendarView />
              </div>
            )}
          </div>

          <footer className="mt-8 text-center text-slate-600 text-xs pb-4">
            <p>Resets daily at 3:00 AM.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
