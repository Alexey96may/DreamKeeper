// src/services/data/IndexedDBService.ts
import { openDB, IDBPDatabase } from 'idb';
import type { IDataService } from './DataService';
import type { StoreName, DreamKeeperDB } from '@/plugins/indexeddb';

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
                // Хранилище снов
                if (!db.objectStoreNames.contains('dreams')) {
                    const dreamStore = db.createObjectStore('dreams', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    dreamStore.createIndex('date', 'date');
                    dreamStore.createIndex('quality', 'quality');
                    dreamStore.createIndex('type', 'type');
                }

                // Хранилище состояния пользователя
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

    private async getDB(): Promise<IDBPDatabase<DreamKeeperDB>> {
        if (!this.dbPromise) {
            await this.init();
        }
        return this.dbPromise!;
    }

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
        return db.add(store, data);
    }

    async put<T>(store: StoreName, data: T): Promise<number> {
        const db = await this.getDB();
        return db.put(store, data);
    }

    async delete(store: StoreName, id: number): Promise<void> {
        const db = await this.getDB();
        await db.delete(store, id);
    }

    async getByIndex<T>(store: StoreName, index: string, value: string | number): Promise<T[]> {
        const db = await this.getDB();
        return db.getAllFromIndex(store, index, value) as Promise<T[]>;
    }
}
