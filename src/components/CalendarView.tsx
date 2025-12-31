
import React from 'react';
import { getHistory, getLogicalDate } from '../utils/history';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const history = getHistory();
    const logicalToday = getLogicalDate();

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const renderDays = () => {
        const slots = [];
        // Empty slots for start of month
        for (let i = 0; i < firstDay; i++) {
            slots.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Days
        for (let d = 1; d <= days; d++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
            const progress = history[dateStr] || 0;

            // Determine color based on progress
            let bgColor = 'bg-slate-800/50';
            let borderColor = 'border-slate-700';

            if (progress > 0) {
                if (progress === 100) {
                    bgColor = 'bg-fuchsia-500 shadow-[0_0_10px_rgba(232,121,249,0.5)]';
                    borderColor = 'border-fuchsia-400';
                } else if (progress >= 75) {
                    bgColor = 'bg-violet-500/80';
                    borderColor = 'border-violet-400';
                } else if (progress >= 50) {
                    bgColor = 'bg-violet-600/60';
                    borderColor = 'border-violet-500';
                } else {
                    bgColor = 'bg-slate-700/60';
                    borderColor = 'border-slate-600';
                }
            }

            // Highlight Today (Logical)
            const isToday = dateStr === logicalToday;
            const todayRing = isToday ? 'ring-2 ring-white' : '';

            slots.push(
                <div
                    key={d}
                    className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-all hover:scale-110 relative group ${bgColor} ${borderColor} ${todayRing}`}
                >
                    <span className={progress === 100 ? 'text-white' : 'text-slate-300'}>{d}</span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                        {progress.toFixed(0)}% Complete
                    </div>
                </div>
            );
        }
        return slots;
    };

    return (
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6 px-2">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <h3 className="text-xl font-bold text-slate-100">{monthName}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-3 justify-items-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-slate-500 font-bold text-xs mb-2">
                        {day}
                    </div>
                ))}
                {renderDays()}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-slate-800/50 border border-slate-700"></div> 0%
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-slate-700/60 border border-slate-600"></div> 1-49%
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-violet-600/60 border border-violet-500"></div> 50-99%
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-fuchsia-500 border border-fuchsia-400 text-white shadow-[0_0_5px_rgba(232,121,249,0.5)]"></div> 100%
                </div>
            </div>
        </div>
    );
};
