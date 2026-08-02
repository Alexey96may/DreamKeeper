export interface Dream {
    id?: number;
    date: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    quality: number;
    description?: string;
    type?: 'lucid' | 'nightmare' | 'prophetic' | 'normal';
    emotions?: string[];
    symbols?: string[];
    createdAt?: string;
    updatedAt?: string;
}
