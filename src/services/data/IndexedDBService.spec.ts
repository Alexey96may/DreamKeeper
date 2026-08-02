import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { IndexedDBService } from '@/services/data/IndexedDBService';

interface TestDream {
    id?: number;
    date: string;
    quality: number;
    type?: string;
    description?: string;
}

interface TestState {
    id?: number;
    date: string;
    mood?: number;
    energy?: number;
    focus?: number;
}

describe('IndexedDBService', () => {
    let service: IndexedDBService;
    const testDbName = 'TestDB';

    beforeEach(async () => {
        service = new IndexedDBService(testDbName, 1);
        await service.init();
    });

    afterEach(async () => {
        await service.destroy();
    });

    describe('init', () => {
        it('initializes without errors', async () => {
            const newService = new IndexedDBService('InitTestDB', 1);
            await expect(newService.init()).resolves.not.toThrow();
            await newService.destroy();
        });

        it('can be called multiple times without errors', async () => {
            await expect(service.init()).resolves.not.toThrow();
            const id = await service.add<TestDream>('dreams', { date: '2024-01-20', quality: 7 });
            expect(id).toBeDefined();
        });

        it('creates object stores and indexes', async () => {
            const id = await service.add<TestDream>('dreams', {
                date: '2024-01-15',
                quality: 8,
                type: 'lucid',
            });
            const byDate = await service.getByIndex<TestDream>('dreams', 'date', '2024-01-15');
            expect(byDate).toHaveLength(1);
            expect(byDate[0].id).toBe(id);
        });
    });

    describe('add', () => {
        it('adds a record and returns id', async () => {
            const id = await service.add<TestDream>('dreams', { date: '2024-01-15', quality: 8 });
            expect(id).toBe(1);
            const record = await service.get<TestDream>('dreams', id);
            expect(record).toMatchObject({ date: '2024-01-15', quality: 8 });
        });
    });

    describe('get', () => {
        it('retrieves a record by id', async () => {
            const id = await service.add<TestDream>('dreams', { date: '2024-01-16', quality: 9 });
            const record = await service.get<TestDream>('dreams', id);
            expect(record).toMatchObject({ date: '2024-01-16', quality: 9 });
        });

        it('returns undefined if record not found', async () => {
            const record = await service.get<TestDream>('dreams', 999);
            expect(record).toBeUndefined();
        });
    });

    describe('getAll', () => {
        it('retrieves all records from a store', async () => {
            await service.add<TestDream>('dreams', { date: '2024-01-15', quality: 8 });
            await service.add<TestDream>('dreams', { date: '2024-01-16', quality: 9 });
            const all = await service.getAll<TestDream>('dreams');
            expect(all).toHaveLength(2);
            expect(all[0]).toHaveProperty('id');
        });

        it('returns empty array if store is empty', async () => {
            const all = await service.getAll<TestState>('userStates');
            expect(all).toEqual([]);
        });
    });

    describe('put', () => {
        it('updates an existing record', async () => {
            const id = await service.add<TestDream>('dreams', { date: '2024-01-17', quality: 7 });
            await service.put<TestDream>('dreams', { id, date: '2024-01-17', quality: 8 });
            const updated = await service.get<TestDream>('dreams', id);
            expect(updated?.quality).toBe(8);
        });

        it('creates a new record if id does not exist', async () => {
            const id = await service.put<TestDream>('dreams', {
                id: 100,
                date: '2024-01-18',
                quality: 5,
            });
            expect(id).toBe(100);
            const record = await service.get<TestDream>('dreams', 100);
            expect(record).toBeDefined();
        });
    });

    describe('delete', () => {
        it('deletes a record by id', async () => {
            const id = await service.add<TestDream>('dreams', { date: '2024-01-19', quality: 6 });
            await service.delete('dreams', id);
            const record = await service.get<TestDream>('dreams', id);
            expect(record).toBeUndefined();
        });

        it('does not throw if record does not exist', async () => {
            await expect(service.delete('dreams', 999)).resolves.not.toThrow();
        });
    });

    describe('getByIndex', () => {
        beforeEach(async () => {
            await service.add<TestDream>('dreams', {
                date: '2024-01-15',
                quality: 8,
                type: 'lucid',
            });
            await service.add<TestDream>('dreams', {
                date: '2024-01-15',
                quality: 6,
                type: 'normal',
            });
            await service.add<TestDream>('dreams', {
                date: '2024-01-16',
                quality: 9,
                type: 'lucid',
            });
        });

        it('returns records matching the index value', async () => {
            const result = await service.getByIndex<TestDream>('dreams', 'date', '2024-01-15');
            expect(result).toHaveLength(2);
            expect(result.every((r) => r.date === '2024-01-15')).toBe(true);
        });

        it('returns empty array if no match', async () => {
            const result = await service.getByIndex<TestDream>('dreams', 'date', '2099-01-01');
            expect(result).toEqual([]);
        });

        it('works with number index', async () => {
            const result = await service.getByIndex<TestDream>('dreams', 'quality', 8);
            expect(result).toHaveLength(1);
            expect(result[0].quality).toBe(8);
        });
    });
});
