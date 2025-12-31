
export type QuestType = 'boolean' | 'counter';

export interface Quest {
    id: string;
    text: string;
    type: QuestType;
    completed: boolean;
    current?: number;
    target?: number;
    unit?: string;
}
