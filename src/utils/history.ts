
export const HISTORY_KEY = 'daily-quests-history';

export interface DailyHistory {
    [date: string]: number; // date string -> progress % (0-100)
}

export const getHistory = (): DailyHistory => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : {};
};

export const saveDailyProgress = (progress: number) => {
    const history = getHistory();
    const today = new Date().toDateString();

    // Only update if it changed
    if (history[today] !== progress) {
        history[today] = progress;
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
};
