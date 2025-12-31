
export const HISTORY_KEY = 'daily-quests-history';

export interface DailyHistory {
    [date: string]: number; // date string -> progress % (0-100)
}

// Helper: get date string with 3AM cutoff
// e.g. Jan 1 02:00 -> Dec 31
export const getLogicalDate = (): string => {
    const now = new Date();
    // Shift back 3 hours
    const shifted = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    return shifted.toDateString();
};

export const getHistory = (): DailyHistory => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : {};
};

export const saveDailyProgress = (progress: number) => {
    const history = getHistory();
    const today = getLogicalDate();

    // Only update if it changed
    if (history[today] !== progress) {
        history[today] = progress;
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
};
