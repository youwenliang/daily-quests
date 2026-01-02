import React from 'react';
import { Check, Trash2, Plus, Minus } from 'lucide-react';
import type { Quest } from '../types';

interface QuestListProps {
    quests: Quest[];
    onToggle: (id: string) => void;
    onUpdateProgress: (id: string, newCurrent: number) => void;
    onDelete: (id: string) => void;
    onAdd: (text: string) => void;
}

export const QuestList: React.FC<QuestListProps> = ({ quests, onToggle, onUpdateProgress, onDelete, onAdd }) => {
    const [newQuest, setNewQuest] = React.useState('');
    const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuest.trim()) {
            onAdd(newQuest);
            setNewQuest('');
        }
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete);
            setItemToDelete(null);
        }
    };

    return (
        <div className="mt-8 space-y-4">
            {/* Simple Add Form */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newQuest}
                    onChange={(e) => setNewQuest(e.target.value)}
                    placeholder="Add a new daily quest..."
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 backdrop-blur-sm transition-all"
                />
                <button
                    type="submit"
                    disabled={!newQuest.trim()}
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <Plus size={24} />
                </button>
            </form>

            <div className="space-y-3">
                {quests.map((quest) => (
                    <div
                        key={quest.id}
                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${quest.completed
                            ? 'bg-slate-800/30 border-slate-700/30 opacity-70'
                            : 'bg-slate-800/80 border-slate-700 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10'
                            }`}
                    >
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-4">
                                {/* Checkbox / Completion Indicator */}
                                {quest.type === 'boolean' ? (
                                    <button
                                        onClick={() => onToggle(quest.id)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${quest.completed
                                            ? 'bg-green-500 border-green-500 rotate-0'
                                            : 'border-slate-500 hover:border-violet-400 -rotate-90'
                                            }`}
                                    >
                                        <Check
                                            size={14}
                                            className={`text-white transition-all duration-300 ${quest.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                                }`}
                                        />
                                    </button>
                                ) : (
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${quest.completed ? 'bg-green-500 border-green-500' : 'border-slate-500'
                                        }`}>
                                        {quest.completed && <Check size={14} className="text-white" />}
                                    </div>
                                )}

                                <span
                                    className={`text-lg transition-all duration-300 ${quest.completed ? 'text-slate-500 line-through' : 'text-slate-100'
                                        }`}
                                >
                                    {quest.text}
                                </span>
                            </div>

                            {/* Progress Controls for Counter Types */}
                            {quest.type === 'counter' && quest.target && (
                                <div className="pl-10 flex items-center gap-3">
                                    <div className="flex items-center bg-slate-900/50 rounded-lg p-1 border border-slate-700">
                                        <button
                                            onClick={() => onUpdateProgress(quest.id, (quest.current || 0) - 1)}
                                            disabled={!quest.current || quest.current <= 0}
                                            className="p-1 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
                                        >
                                            <Minus size={14} />
                                        </button>

                                        {quest.target > 10 ? (
                                            <input
                                                type="number"
                                                value={quest.current || 0}
                                                onChange={(e) => onUpdateProgress(quest.id, parseInt(e.target.value) || 0)}
                                                className="bg-transparent w-20 text-center text-sm font-mono focus:outline-none appearance-none"
                                            />
                                        ) : (
                                            <span className="w-8 text-center text-sm font-mono">{quest.current || 0}</span>
                                        )}

                                        <button
                                            onClick={() => onUpdateProgress(quest.id, (quest.current || 0) + 1)}
                                            className="p-1 hover:bg-slate-700 rounded text-slate-400"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">
                                        / {quest.target} {quest.unit}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setItemToDelete(quest.id)}
                            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-white/5 self-start mt-1"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setItemToDelete(null)}
                    />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full ring-1 ring-white/10 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-white mb-2">Delete Quest?</h3>
                        <p className="text-slate-400 mb-6">
                            Are you sure you want to remove this quest? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all font-bold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
