// src/services/data/DataService.ts
import type { StoreName } from '@/types/Store';

export type ServiceType = 'indexeddb' | 'api' | 'capacitor';

export interface IDataService {
    init(): Promise<void>;
    getAll<T>(store: StoreName): Promise<T[]>;
    get<T>(store: StoreName, id: number): Promise<T | undefined>;
    add<T extends object, R = T & { id: number }>(store: StoreName, data: T): Promise<R>;
    put<T>(store: StoreName, data: T): Promise<number>;
    delete(store: StoreName, id: number): Promise<void>;
    getByIndex<T>(store: StoreName, index: string, value: string | number): Promise<T[]>;
}
