// src/types/index.d.ts
declare module '@/services/factories/ServiceFactory' {
    import type { IDataService } from '@/services/data/DataService';

    export class ServiceFactory {
        static createService(type?: string): IDataService;
    }

    export default ServiceFactory;
}

declare module '@/services/repositories/UserStateRepository' {
    import type { IDataService } from '@/services/data/DataService';
    import type { UserState } from '@/plugins/indexeddb';

    export class UserStateRepository {
        constructor(dataService: IDataService);
        getAll(): Promise<UserState[]>;
        getById(id: number): Promise<UserState | undefined>;
        create(data: Omit<UserState, 'id'>): Promise<number>;
        update(id: number, data: Partial<UserState>): Promise<void>;
        delete(id: number): Promise<void>;
        getByIndex(index: string, value: string | number): Promise<UserState[]>;
    }

    export default UserStateRepository;
}

declare module '@/services/data/DataService' {
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
}

declare module '@/plugins/indexeddb' {
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

    export interface UserState {
        id?: number;
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

    export interface DreamKeeperDB {
        dreams: Dream;
        userStates: UserState;
    }

    export type StoreName = keyof DreamKeeperDB;
}
