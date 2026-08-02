import type { Dream } from '@/types/Dream';
import type { StoreName, StoreType } from '@/types/Store';
import type { UserState } from '@/types/UserState';

// ============================================
// IDatabaseService
// ============================================

export interface IDatabaseService {
    close: () => Promise<void>;
    getAll: <T extends StoreName>(store: T) => Promise<StoreType<T>[]>;
    get: <T extends StoreName>(store: T, id: number) => Promise<StoreType<T> | undefined>;
    add: <T extends StoreName>(store: T, data: StoreType<T>) => Promise<number>;
    put: <T extends StoreName>(store: T, data: StoreType<T>) => Promise<number>;
    delete: (store: StoreName, id: number) => Promise<void>;
    getByIndex: <T extends StoreName>(
        store: T,
        index: string,
        value: string | number,
    ) => Promise<StoreType<T>[]>;

    getDreamsByDate: (date: string) => Promise<Dream[]>;
    getDreamsByMonth: (year: number, month: number) => Promise<Dream[]>;
    getDreamsByQuality: (minQuality: number) => Promise<Dream[]>;
    getUserStateByDate: (date: string) => Promise<UserState | undefined>;
    updateUserState: (date: string, data: Partial<UserState>) => Promise<number>;
}

export interface IndexedDBOptions {
    dbName?: string;
    version?: number;
}
