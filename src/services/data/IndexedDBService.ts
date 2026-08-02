import { IDBPDatabase, openDB } from 'idb';
import type { StoreName } from '@/types/Store';
import type { DreamKeeperDB } from '@/types/databases';
import type { IDatabaseService } from '@/types/databases/IndexedDB';
import type { Dream } from '@/types/Dream';
import type { UserState } from '@/types/UserState';

export class IndexedDBService implements IDatabaseService {
    private dbPromise: Promise<IDBPDatabase<DreamKeeperDB>> | null = null;
    private dbName: string;
    private version: number;

    constructor(dbName: string = 'DreamKeeperDB', version: number = 1) {
        this.dbName = dbName;
        this.version = version;
    }

    async init(): Promise<void> {
        if (this.dbPromise) return;
        this.dbPromise = openDB<DreamKeeperDB>(this.dbName, this.version, {
            upgrade(db: IDBPDatabase<DreamKeeperDB>) {
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
        });
    }

    async close(): Promise<void> {
        if (this.dbPromise) {
            const db = await this.dbPromise;
            db.close();
            this.dbPromise = null;
        }
    }

    // ===== Вспомогательный метод =====
    private async getDB(): Promise<IDBPDatabase<DreamKeeperDB>> {
        if (!this.dbPromise) {
            await this.init();
        }
        return this.dbPromise!;
    }

    // ===== CRUD =====
    async getAll<T>(store: StoreName): Promise<T[]> {
        const db = await this.getDB();
        return db.getAll(store) as Promise<T[]>;
    }

    async get<T>(store: StoreName, id: number): Promise<T | undefined> {
        const db = await this.getDB();
        return db.get(store, id) as Promise<T | undefined>;
    }

    async add<T>(store: StoreName, data: T): Promise<number> {
        const db = await this.getDB();
        return db.add(store, data) as Promise<number>;
    }

    async put<T>(store: StoreName, data: T): Promise<number> {
        const db = await this.getDB();
        return db.put(store, data) as Promise<number>;
    }

    async delete(store: StoreName, id: number): Promise<void> {
        const db = await this.getDB();
        await db.delete(store, id);
    }

    async getByIndex<T>(store: StoreName, index: string, value: string | number): Promise<T[]> {
        const db = await this.getDB();
        return db.getAllFromIndex(store, index, value) as Promise<T[]>;
    }

    // ===== Специфические методы для снов =====
    async getDreamsByDate(date: string): Promise<Dream[]> {
        const result = await this.getByIndex('dreams', 'date', date);
        return result as Dream[];
    }

    async getDreamsByMonth(year: number, month: number): Promise<Dream[]> {
        const allDreams = await this.getAll<Dream>('dreams');
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        return allDreams.filter((dream) => dream.date.startsWith(monthStr));
    }

    async getDreamsByQuality(minQuality: number): Promise<Dream[]> {
        const allDreams = await this.getAll<Dream>('dreams');
        return allDreams.filter((dream) => dream.quality >= minQuality);
    }

    async getUserStateByDate(date: string): Promise<UserState | undefined> {
        const states = await this.getByIndex<UserState>('userStates', 'date', date);
        return states[0] || undefined;
    }

    async updateUserState(date: string, data: Partial<UserState>): Promise<number> {
        const existing = await this.getUserStateByDate(date);

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
    }

    async destroy(): Promise<void> {
        if (this.dbPromise) {
            const db = await this.dbPromise;
            db.close();
            await indexedDB.deleteDatabase(this.dbName);
            this.dbPromise = null;
        }
    }
}
