// src/plugins/indexeddb.ts
import { openDB, IDBPDatabase } from 'idb';
import type { App, InjectionKey } from 'vue';

// ============================================
// 1. ТИПЫ ДАННЫХ
// ============================================

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

// ============================================
// 2. ТИПЫ ХРАНИЛИЩ
// ============================================

export interface DreamKeeperDB {
    dreams: Dream;
    userStates: UserState;
}

export type StoreName = keyof DreamKeeperDB;
export type StoreType<T extends StoreName> = DreamKeeperDB[T];

// ============================================
// 3. ИНТЕРФЕЙС СЕРВИСА (БЕЗ ANY!)
// ============================================

export interface IDatabaseService {
    // Общие методы с дженериками
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

    // Специфические методы (строго типизированные)
    getDreamsByDate: (date: string) => Promise<Dream[]>;
    getDreamsByMonth: (year: number, month: number) => Promise<Dream[]>;
    getDreamsByQuality: (minQuality: number) => Promise<Dream[]>;
    getUserStateByDate: (date: string) => Promise<UserState | undefined>;
    updateUserState: (date: string, data: Partial<UserState>) => Promise<number>;
}

// ============================================
// 4. КЛЮЧ ДЛЯ INJECT
// ============================================

export const DB_KEY: InjectionKey<IDatabaseService> = Symbol('db');

// ============================================
// 5. ОПЦИИ ПЛАГИНА
// ============================================

export interface IndexedDBOptions {
    dbName?: string;
    version?: number;
}

// ============================================
// 6. ПЛАГИН
// ============================================

export default {
    install(app: App, options: IndexedDBOptions = {}): void {
        const dbName: string = options.dbName || 'DreamKeeperDB';
        const version: number = options.version || 1;

        const dbPromise: Promise<IDBPDatabase<DreamKeeperDB>> = openDB<DreamKeeperDB>(
            dbName,
            version,
            {
                upgrade(db: IDBPDatabase<DreamKeeperDB>): void {
                    if (!db.objectStoreNames.contains('dreams')) {
                        const dreamStore = db.createObjectStore('dreams', {
                            keyPath: 'id',
                            autoIncrement: true,
                        });
                        dreamStore.createIndex('date', 'date');
                        dreamStore.createIndex('quality', 'quality');
                        dreamStore.createIndex('type', 'type');
                    }

                    if (!db.objectStoreNames.contains('userStates')) {
                        const stateStore = db.createObjectStore('userStates', {
                            keyPath: 'id',
                            autoIncrement: true,
                        });
                        stateStore.createIndex('date', 'date', { unique: true });
                        stateStore.createIndex('mood', 'mood');
                        stateStore.createIndex('energy', 'energy');
                    }
                },
            },
        );

        const dbService: IDatabaseService = {
            // ===== Общие методы =====
            async getAll<T extends StoreName>(store: T): Promise<StoreType<T>[]> {
                return (await dbPromise).getAll(store) as StoreType<T>[];
            },

            async get<T extends StoreName>(
                store: T,
                id: number,
            ): Promise<StoreType<T> | undefined> {
                return (await dbPromise).get(store, id) as StoreType<T> | undefined;
            },

            async add<T extends StoreName>(store: T, data: StoreType<T>): Promise<number> {
                return (await dbPromise).add(store, data);
            },

            async put<T extends StoreName>(store: T, data: StoreType<T>): Promise<number> {
                return (await dbPromise).put(store, data);
            },

            async delete(store: StoreName, id: number): Promise<void> {
                await (await dbPromise).delete(store, id);
            },

            async getByIndex<T extends StoreName>(
                store: T,
                index: string,
                value: string | number,
            ): Promise<StoreType<T>[]> {
                return (await dbPromise).getAllFromIndex(store, index, value) as StoreType<T>[];
            },

            // ===== Специфические методы =====
            async getDreamsByDate(date: string): Promise<Dream[]> {
                return this.getByIndex('dreams', 'date', date);
            },

            async getDreamsByMonth(year: number, month: number): Promise<Dream[]> {
                const allDreams: Dream[] = await this.getAll('dreams');
                const monthStr: string = `${year}-${String(month).padStart(2, '0')}`;
                return allDreams.filter((dream: Dream) => dream.date.startsWith(monthStr));
            },

            async getDreamsByQuality(minQuality: number): Promise<Dream[]> {
                const allDreams: Dream[] = await this.getAll('dreams');
                return allDreams.filter((dream: Dream) => dream.quality >= minQuality);
            },

            async getUserStateByDate(date: string): Promise<UserState | undefined> {
                const states: UserState[] = await this.getByIndex('userStates', 'date', date);
                return states[0] || undefined;
            },

            async updateUserState(date: string, data: Partial<UserState>): Promise<number> {
                const existing: UserState | undefined = await this.getUserStateByDate(date);

                if (existing?.id) {
                    const updated: UserState = {
                        ...existing,
                        ...data,
                        updatedAt: new Date().toISOString(),
                    };
                    return this.put('userStates', updated);
                } else {
                    const newState: UserState = {
                        ...data,
                        date,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    return this.add('userStates', newState);
                }
            },
        };

        app.config.globalProperties.$db = dbService;
        app.provide(DB_KEY, dbService);
    },
};

// ============================================
// 7. РАСШИРЕНИЕ ТИПОВ ДЛЯ VUE
// ============================================

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $db: IDatabaseService;
    }
}
