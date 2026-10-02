import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseRepository } from '@/services/repositories/BaseRepository'; // Укажите верный путь к вашему файлу
import type { IDataService } from '@/types/databases/DataService';
import type { StoreName } from '@/types/Store';

interface TestEntity {
    id: string;
    name: string;
    category?: string;
}

class TestRepository extends BaseRepository<TestEntity> {
    constructor(dataService: IDataService) {
        super(dataService, 'interprSources' as StoreName);
    }
}

describe('BaseRepository', () => {
    let repository: TestRepository;
    let mockDataService: Record<keyof IDataService, ReturnType<typeof vi.fn>>;

    beforeEach(() => {
        mockDataService = {
            init: vi.fn(),
            getAll: vi.fn(),
            get: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            getByIndex: vi.fn(),
            clear: vi.fn(),
        };

        repository = new TestRepository(mockDataService as unknown as IDataService);
        vi.clearAllMocks();
    });

    it('gets all records via getAll', async () => {
        const mockData: TestEntity[] = [{ id: '1', name: 'Item 1' }];
        mockDataService.getAll.mockResolvedValue(mockData);

        const result = await repository.getAll();

        expect(mockDataService.getAll).toHaveBeenCalledWith('interprSources');
        expect(result).toEqual(mockData);
    });

    it('clears all records via clearAll', async () => {
        mockDataService.clear.mockResolvedValue(undefined);

        await repository.clearAll();

        expect(mockDataService.clear).toHaveBeenCalledWith('interprSources');
    });

    it('gets a record by id via getById', async () => {
        const mockItem: TestEntity = { id: '1', name: 'Item 1' };
        mockDataService.get.mockResolvedValue(mockItem);

        const result = await repository.getById('1');

        expect(mockDataService.get).toHaveBeenCalledWith('interprSources', '1');
        expect(result).toEqual(mockItem);
    });

    it('creates a record via create', async () => {
        const newEntity = { name: 'New Item' };
        const savedEntity: TestEntity = { id: 'uuid-123', name: 'New Item' };
        mockDataService.add.mockResolvedValue(savedEntity);

        const result = await repository.create(newEntity);

        expect(mockDataService.add).toHaveBeenCalledWith('interprSources', newEntity);
        expect(result).toEqual(savedEntity);
    });

    it('updates an existing record successfully via update', async () => {
        const existingItem: TestEntity = { id: '1', name: 'Old Name', category: 'old' };
        mockDataService.get.mockResolvedValue(existingItem);
        mockDataService.put.mockResolvedValue('1');

        const result = await repository.update('1', { name: 'Updated Name' });

        expect(mockDataService.get).toHaveBeenCalledWith('interprSources', '1');
        expect(mockDataService.put).toHaveBeenCalledWith('interprSources', {
            id: '1',
            name: 'Updated Name',
            category: 'old',
        });
        expect(result).toEqual({ id: '1', name: 'Updated Name', category: 'old' });
    });

    it('throws an error when updating a non-existent record', async () => {
        mockDataService.get.mockResolvedValue(undefined);

        await expect(repository.update('999', { name: 'Test' })).rejects.toThrow(
            'Record with id 999 in interprSources not found',
        );
        expect(mockDataService.put).not.toHaveBeenCalled();
    });

    it('deletes a record via delete', async () => {
        mockDataService.delete.mockResolvedValue(undefined);

        await repository.delete('1');

        expect(mockDataService.delete).toHaveBeenCalledWith('interprSources', '1');
    });

    it('fetches records by index via getByIndex', async () => {
        const mockData: TestEntity[] = [{ id: '1', name: 'Item 1', category: 'esoteric' }];
        mockDataService.getByIndex.mockResolvedValue(mockData);

        const result = await repository.getByIndex('category', 'esoteric');

        expect(mockDataService.getByIndex).toHaveBeenCalledWith(
            'interprSources',
            'category',
            'esoteric',
        );
        expect(result).toEqual(mockData);
    });
});
