
import React from 'react';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="w-full bg-slate-700/50 rounded-full h-6 backdrop-blur-sm mt-4 border border-slate-600/50 overflow-hidden relative">
            <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700 ease-out flex items-center justify-end pr-2 relative"
                style={{ width: `${progress}%` }}
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                {progress > 10 && (
                    <span className="text-xs font-bold text-white drop-shadow-md">{Math.round(progress)}%</span>
                )}
            </div>
        </div>
    );
};
