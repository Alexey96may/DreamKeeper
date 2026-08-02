import type { IDataService } from '@/types/databases/DataService';
import type { Dream } from '@/types/Dream';
import type { UserState } from '@/types/UserState';

export interface IDatabaseService extends IDataService {
    close(): Promise<void>;
    getDreamsByDate(date: string): Promise<Dream[]>;
    getDreamsByMonth(year: number, month: number): Promise<Dream[]>;
    getDreamsByQuality(minQuality: number): Promise<Dream[]>;
    getUserStateByDate(date: string): Promise<UserState | undefined>;
    updateUserState(date: string, data: Partial<UserState>): Promise<number>;
}
