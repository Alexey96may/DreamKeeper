import { IDBPDatabase, openDB } from 'idb';
import type { StoreName } from '@/types/Store';
import type { DreamKeeperDB } from '@/types/databases';
import type { IDataService } from '@/types/databases/DataService';

import { toRaw } from 'vue';

export class IndexedDBService implements IDataService {
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

                if (!db.objectStoreNames.contains('interprSources')) {
                    const sourceStore = db.createObjectStore('interprSources', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    sourceStore.createIndex('type', 'type');
                    sourceStore.createIndex('category', 'category');
                    sourceStore.createIndex('visibility', 'visibility');
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

    // ===== CRUD =====
    async getAll<T>(store: StoreName): Promise<T[]> {
        const db = await this.getDB();
        return db.getAll(store) as Promise<T[]>;
    }

    async get<T>(store: StoreName, id: number): Promise<T | undefined> {
        const db = await this.getDB();
        return db.get(store, id) as Promise<T | undefined>;
    }

    async add<T extends object, R = T & { id: number }>(store: StoreName, data: T): Promise<R> {
        const db = await this.getDB();

        const cleanData = JSON.parse(JSON.stringify(toRaw(data)));

        const id = (await db.add(store, cleanData)) as number;

        return {
            ...cleanData,
            id,
        } as unknown as R;
    }

    async put<T>(store: StoreName, data: T): Promise<number> {
        const db = await this.getDB();
        const cleanData = JSON.parse(JSON.stringify(toRaw(data)));
        return db.put(store, cleanData) as Promise<number>;
    }

    async delete(store: StoreName, id: number): Promise<void> {
        const db = await this.getDB();
        await db.delete(store, id);
    }

    async getByIndex<T>(store: StoreName, index: string, value: string | number): Promise<T[]> {
        const db = await this.getDB();
        return db.getAllFromIndex(store, index, value) as Promise<T[]>;
    }

    async destroy(): Promise<void> {
        if (this.dbPromise) {
            const db = await this.dbPromise;
            db.close();
            await indexedDB.deleteDatabase(this.dbName);
            this.dbPromise = null;
        }
    }

    // ===== Helper =====
    private async getDB(): Promise<IDBPDatabase<DreamKeeperDB>> {
        if (!this.dbPromise) {
            await this.init();
        }
        return this.dbPromise!;
    }
}
