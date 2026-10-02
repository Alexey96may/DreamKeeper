import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InterprSourceRepository } from '@/services/repositories/InterprSourceRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { InterprSource } from '@/types/Interpretation/Source';

vi.mock('@/utils/routes', () => ({
    slugify: vi.fn((text: string) =>
        text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
    ),
}));

describe('InterprSourceRepository', () => {
    let repository: InterprSourceRepository;
    let mockDataService: Record<keyof IDataService, ReturnType<typeof vi.fn>>;

    const mockSource: Partial<InterprSource> = {
        id: 'jung',
        title: 'Carl Jung',
        type: 'family',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
    };

    beforeEach(() => {
        mockDataService = {
            init: vi.fn(),
            getAll: vi.fn().mockResolvedValue([mockSource]),
            get: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            getByIndex: vi.fn(),
            clear: vi.fn(),
        };

        repository = new InterprSourceRepository(mockDataService as unknown as IDataService);
        vi.clearAllMocks();
    });

    describe('getByType', () => {
        it('fetches sources by type using index successfully', async () => {
            mockDataService.getByIndex.mockResolvedValueOnce([mockSource]);

            const result = await repository.getByType('family');

            expect(mockDataService.getByIndex).toHaveBeenCalledWith(
                'interprSources',
                'type',
                'family',
            );
            expect(result).toEqual([mockSource]);
        });

        it('falls back to memory scan if index lookup throws an error', async () => {
            mockDataService.getByIndex.mockRejectedValueOnce(new Error('Index error'));
            mockDataService.getAll.mockResolvedValueOnce([mockSource]);

            const result = await repository.getByType('family');

            expect(mockDataService.getAll).toHaveBeenCalled();
            expect(result).toEqual([mockSource]);
        });
    });

    describe('create', () => {
        it('creates a source with auto-generated id from title slug if id is missing', async () => {
            const newSourceData = {
                title: 'Sigmund Freud',
                type: 'family',
            };

            const expectedPayload = {
                ...newSourceData,
                id: 'sigmund-freud',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockDataService.add.mockResolvedValueOnce(expectedPayload);

            const result = await repository.create(newSourceData as unknown as InterprSource);

            expect(mockDataService.add).toHaveBeenCalledWith(
                'interprSources',
                expect.objectContaining({ id: 'sigmund-freud' }),
            );
            expect(result).toEqual(expectedPayload);
        });

        it('uses explicit id if provided in create data', async () => {
            const newSourceData = {
                id: 'custom_source_id',
                title: 'Custom Source',
                type: 'custom',
            };

            mockDataService.add.mockImplementation(async (_, payload) => payload);

            const result = await repository.create(newSourceData as unknown as InterprSource);

            expect(result.id).toBe('custom_source_id');
        });
    });

    describe('update', () => {
        it('updates an existing source successfully and refreshes updatedAt', async () => {
            mockDataService.get.mockResolvedValueOnce(mockSource);
            mockDataService.put.mockResolvedValueOnce('jung');

            const result = await repository.update('jung', { title: 'Carl Gustav Jung' });

            expect(mockDataService.get).toHaveBeenCalledWith('interprSources', 'jung');
            expect(mockDataService.put).toHaveBeenCalledWith(
                'interprSources',
                expect.objectContaining({
                    id: 'jung',
                    title: 'Carl Gustav Jung',
                    updatedAt: expect.any(String),
                }),
            );
            expect(result.title).toBe('Carl Gustav Jung');
        });

        it('throws an error when trying to update non-existent source', async () => {
            mockDataService.get.mockResolvedValueOnce(undefined);

            await expect(repository.update('non-existent', { title: 'Test' })).rejects.toThrow(
                'Источник с id non-existent не найден',
            );
            expect(mockDataService.put).not.toHaveBeenCalled();
        });
    });
});
