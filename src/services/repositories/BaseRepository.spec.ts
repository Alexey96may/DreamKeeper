import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { StoreName } from '@/types/Store';
import type { IDataService } from '@/types/databases/DataService';

import { BaseRepository } from '@/services/repositories/BaseRepository';

interface TestEntity {
    id?: number;
    name: string;
    value: number;
}

class TestRepository extends BaseRepository<TestEntity> {
    constructor(dataService: IDataService, storeName: StoreName) {
        super(dataService, storeName);
    }
}

describe('BaseRepository', () => {
    let mockDataService: IDataService;
    let repository: TestRepository;
    const storeName: StoreName = 'dreams';

    beforeEach(() => {
        mockDataService = {
            init: vi.fn<() => void>().mockResolvedValue(undefined),
            getAll: vi.fn<() => void>(),
            get: vi.fn<() => void>(),
            add: vi.fn<() => void>(),
            put: vi.fn<() => void>(),
            delete: vi.fn<() => void>(),
            getByIndex: vi.fn<() => void>(),
        } as unknown as IDataService;

        repository = new TestRepository(mockDataService, storeName);
    });

    describe('getAll', () => {
        it('calls dataService.getAll with correct store', async () => {
            const expectedData: TestEntity[] = [
                { id: 1, name: 'Test 1', value: 10 },
                { id: 2, name: 'Test 2', value: 20 },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(expectedData);

            const result = await repository.getAll();

            expect(vi.mocked(mockDataService.getAll)).toHaveBeenCalledWith(storeName);
            expect(result).toEqual(expectedData);
        });

        it('returns an empty array if no data', async () => {
            vi.mocked(mockDataService.getAll).mockResolvedValue([]);

            const result = await repository.getAll();

            expect(result).toEqual([]);
        });
    });

    describe('getById', () => {
        it('retrieves a record by id', async () => {
            const expectedData: TestEntity = { id: 1, name: 'Test', value: 10 };
            vi.mocked(mockDataService.get).mockResolvedValue(expectedData);

            const result = await repository.getById(1);

            expect(vi.mocked(mockDataService.get)).toHaveBeenCalledWith(storeName, 1);
            expect(result).toEqual(expectedData);
        });

        it('returns undefined if record not found', async () => {
            vi.mocked(mockDataService.get).mockResolvedValue(undefined);

            const result = await repository.getById(999);

            expect(result).toBeUndefined();
        });
    });

    describe('create', () => {
        it('creates a new record', async () => {
            const newData: Omit<TestEntity, 'id'> = { name: 'New', value: 30 };
            const expectedId = 1;
            vi.mocked(mockDataService.add).mockResolvedValue(expectedId);

            const result = await repository.create(newData);

            expect(vi.mocked(mockDataService.add)).toHaveBeenCalledWith(storeName, newData);
            expect(result).toBe(expectedId);
        });
    });

    describe('update', () => {
        it('updates an existing record', async () => {
            const existingData: TestEntity = { id: 1, name: 'Old', value: 10 };
            const updateData: Partial<TestEntity> = { name: 'Updated', value: 20 };

            vi.mocked(mockDataService.get).mockResolvedValue(existingData);
            vi.mocked(mockDataService.put).mockResolvedValue(1);

            await repository.update(1, updateData);

            expect(vi.mocked(mockDataService.get)).toHaveBeenCalledWith(storeName, 1);
            expect(vi.mocked(mockDataService.put)).toHaveBeenCalledWith(storeName, {
                ...existingData,
                ...updateData,
                id: 1,
            });
        });

        it('throws an error if record not found', async () => {
            vi.mocked(mockDataService.get).mockResolvedValue(undefined);

            await expect(repository.update(999, { name: 'Test' })).rejects.toThrow(
                'Record with id 999 not found',
            );
        });
    });

    describe('delete', () => {
        it('deletes a record by id', async () => {
            vi.mocked(mockDataService.delete).mockResolvedValue(undefined);

            await repository.delete(1);

            expect(vi.mocked(mockDataService.delete)).toHaveBeenCalledWith(storeName, 1);
        });
    });

    describe('getByIndex', () => {
        it('retrieves records by index', async () => {
            const expectedData: TestEntity[] = [{ id: 1, name: 'Test 1', value: 10 }];
            vi.mocked(mockDataService.getByIndex).mockResolvedValue(expectedData);

            const result = await repository.getByIndex('name', 'Test 1');

            expect(vi.mocked(mockDataService.getByIndex)).toHaveBeenCalledWith(
                storeName,
                'name',
                'Test 1',
            );
            expect(result).toEqual(expectedData);
        });

        it('returns an empty array if nothing found by index', async () => {
            vi.mocked(mockDataService.getByIndex).mockResolvedValue([]);

            const result = await repository.getByIndex('name', 'NotExist');

            expect(result).toEqual([]);
        });
    });
});
