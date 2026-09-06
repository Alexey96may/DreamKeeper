export interface UserState {
    id: number;
    date: string;
    mood?: number;
    energy?: number;
    productivity?: number;
    stress?: number;
    focus?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type UserStateWrite = Omit<UserState, 'id' | 'createdAt' | 'updatedAt'>;
