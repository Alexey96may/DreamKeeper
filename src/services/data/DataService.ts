// src/services/data/DataService.ts
import type { StoreName } from '@/plugins/indexeddb';

export interface IDataService {
    init(): Promise<void>;
    getAll<T>(store: StoreName): Promise<T[]>;
    get<T>(store: StoreName, id: number): Promise<T | undefined>;
    add<T>(store: StoreName, data: T): Promise<number>;
    put<T>(store: StoreName, data: T): Promise<number>;
    delete(store: StoreName, id: number): Promise<void>;
    getByIndex<T>(store: StoreName, index: string, value: string | number): Promise<T[]>;
}
