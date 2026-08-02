// src/plugins/indexeddb.ts
import type { App, InjectionKey } from 'vue';

import { IDBPDatabase, openDB } from 'idb';

import type { Dream } from '@/types/Dream';
import type { StoreName, StoreType } from '@/types/Store';
import type { UserState } from '@/types/UserState';
import type { DreamKeeperDB } from '@/types/databases';
import type { IDatabaseService, IndexedDBOptions } from '@/types/databases/IndexedDB';

// ============================================
// Key for INJECT
// ============================================

export const DB_KEY: InjectionKey<IDatabaseService> = Symbol('db');

// ============================================
// Plagin
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
            async close(): Promise<void> {
                const db = await dbPromise;
                db.close();
            },

            async getAll<T extends StoreName>(store: T): Promise<StoreType<T>[]> {
                const db = await dbPromise;
                const result = await db.getAll(store);
                return result as StoreType<T>[];
            },

            async get<T extends StoreName>(
                store: T,
                id: number,
            ): Promise<StoreType<T> | undefined> {
                const db = await dbPromise;
                const result = await db.get(store, id);
                return result as StoreType<T> | undefined;
            },

            async add<T extends StoreName>(store: T, data: StoreType<T>): Promise<number> {
                const db = await dbPromise;
                const key = await db.add(store, data);
                return key as number;
            },

            async put<T extends StoreName>(store: T, data: StoreType<T>): Promise<number> {
                const db = await dbPromise;
                const key = await db.put(store, data);
                return key as number;
            },

            async delete(store: StoreName, id: number): Promise<void> {
                const db = await dbPromise;
                await db.delete(store, id);
            },

            async getByIndex<T extends StoreName>(
                store: T,
                index: string,
                value: string | number,
            ): Promise<StoreType<T>[]> {
                const db = await dbPromise;
                const result = await db.getAllFromIndex(store, index, value);
                return result as StoreType<T>[];
            },

            async getDreamsByDate(date: string): Promise<Dream[]> {
                const result = await this.getByIndex('dreams', 'date', date);
                return result as Dream[];
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

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $db: IDatabaseService;
    }
}
