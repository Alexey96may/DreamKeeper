import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { IndexedDBService } from '@/services/data/IndexedDBService';

describe('IndexedDBService', () => {
    let dbService: IndexedDBService;
    const testDbName = 'TestDreamKeeperDB';

    beforeEach(async () => {
        dbService = new IndexedDBService(testDbName, 1);
        await dbService.init();
    });

    afterEach(async () => {
        await dbService.destroy();
    });

    it('initializes database and creates object stores and indexes', async () => {
        await expect(dbService.init()).resolves.toBeUndefined();
    });

    it('performs CRUD operations correctly on a store (e.g. interprSources)', async () => {
        const storeName = 'interprSources';
        const sourceData = {
            id: 'source-1',
            title: 'Test Source',
            type: 'custom',
            category: 'esoteric',
            visibility: 'public',
        };

        // 1. Add / Put
        const addedKey = await dbService.put(storeName, sourceData);
        expect(addedKey).toBe('source-1');

        // 2. Get single item
        const fetchedItem = await dbService.get<typeof sourceData>(storeName, 'source-1');
        expect(fetchedItem).toEqual(sourceData);

        // 3. Get all items
        const allItems = await dbService.getAll<typeof sourceData>(storeName);
        expect(allItems.length).toBe(1);
        expect(allItems[0]).toEqual(sourceData);

        // 4. Delete item
        await dbService.delete(storeName, 'source-1');
        const afterDelete = await dbService.get(storeName, 'source-1');
        expect(afterDelete).toBeUndefined();
    });

    it('adds items with auto-increment keys correctly', async () => {
        const storeName = 'userStates';
        const stateData = {
            date: '2026-06-01',
            mood: 8,
            energy: 7,
        };

        const result = await dbService.add<
            typeof stateData,
            typeof stateData & { id: number | string }
        >(storeName, stateData);

        expect(result.id).toBeDefined();
        expect(result.mood).toBe(8);

        const fetched = await dbService.get(storeName, result.id);
        expect(fetched).toEqual(result);
    });

    it('fetches items by index using getByIndex', async () => {
        const storeName = 'interprSources';
        await dbService.put(storeName, {
            id: '1',
            title: 'Source 1',
            type: 'custom',
            category: 'esoteric',
            visibility: 'public',
        });
        await dbService.put(storeName, {
            id: '2',
            title: 'Source 2',
            type: 'system',
            category: 'psychology',
            visibility: 'private',
        });

        // 'type' = 'custom'
        const customSources = await dbService.getByIndex<{ id: string }>(
            storeName,
            'type',
            'custom',
        );
        expect(customSources.length).toBe(1);
        expect(customSources[0].id).toBe('1');
    });

    it('clears all records from a store and closes/destroys database', async () => {
        const storeName = 'interprSources';
        await dbService.put(storeName, {
            id: '1',
            title: 'Source 1',
            type: 'custom',
            category: 'esoteric',
            visibility: 'public',
        });

        // Очистка хранилища
        await dbService.clear(storeName);
        const allItems = await dbService.getAll(storeName);
        expect(allItems.length).toBe(0);

        // Закрытие соединения
        await expect(dbService.close()).resolves.toBeUndefined();
    });
});
