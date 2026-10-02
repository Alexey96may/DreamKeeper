import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DreamAspectRepository } from '@/services/repositories/DreamAspectRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { DreamAspect } from '@/types/Interpretation/DreamAspect';

vi.mock('@/utils/routes', () => ({
    slugify: vi.fn((text: string) =>
        text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
    ),
}));

describe('DreamAspectRepository', () => {
    let repository: DreamAspectRepository;
    let mockDataService: Record<keyof IDataService, ReturnType<typeof vi.fn>>;

    const mockAspect: DreamAspect = {
        id: 'water-deep',
        symbolTag: 'water',
        title: 'Deep',
        description: 'Deep water meaning',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
    };

    beforeEach(() => {
        mockDataService = {
            init: vi.fn(),
            getAll: vi.fn().mockResolvedValue([mockAspect]),
            get: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            getByIndex: vi.fn(),
            clear: vi.fn(),
        };

        repository = new DreamAspectRepository(mockDataService as unknown as IDataService);
        vi.clearAllMocks();
    });

    describe('getBySymbolTag', () => {
        it('fetches aspects by symbolTag using index successfully', async () => {
            mockDataService.getByIndex.mockResolvedValueOnce([mockAspect]);

            const result = await repository.getBySymbolTag('water');

            expect(mockDataService.getByIndex).toHaveBeenCalledWith(
                'dream_aspects',
                'symbolTag',
                'water',
            );
            expect(result).toEqual([mockAspect]);
        });

        it('falls back to memory scan if index lookup throws an error', async () => {
            mockDataService.getByIndex.mockRejectedValueOnce(new Error('Index error'));
            mockDataService.getAll.mockResolvedValueOnce([mockAspect]);

            const result = await repository.getBySymbolTag('water');

            expect(mockDataService.getAll).toHaveBeenCalled();
            expect(result).toEqual([mockAspect]);
        });
    });

    describe('create', () => {
        it('creates an aspect with auto-generated ID based on symbolTag and slugified title', async () => {
            const newAspectData = {
                symbolTag: 'water',
                title: 'Clean River',
                description: 'Clear thoughts',
            };

            const expectedPayload = {
                ...newAspectData,
                id: 'water-clean-river',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockDataService.get.mockResolvedValueOnce(undefined);
            mockDataService.add.mockResolvedValueOnce(expectedPayload);

            const result = await repository.create(newAspectData);

            expect(mockDataService.get).toHaveBeenCalledWith('dream_aspects', 'water-clean-river');
            expect(mockDataService.add).toHaveBeenCalledWith(
                'dream_aspects',
                expect.objectContaining({
                    id: 'water-clean-river',
                }),
            );
            expect(result).toEqual(expectedPayload);
        });

        it('handles ID collisions during creation by appending a counter', async () => {
            const newAspectData = {
                symbolTag: 'water',
                title: 'Deep',
                description: 'Another deep meaning',
            };

            mockDataService.get.mockResolvedValueOnce(mockAspect).mockResolvedValueOnce(undefined);

            mockDataService.add.mockImplementation(async (_, payload) => payload);

            const result = await repository.create(newAspectData);

            expect(result.id).toBe('water-deep-1');
        });

        it('uses explicit ID if provided in create data', async () => {
            const newAspectData = {
                id: 'custom-aspect-id',
                symbolTag: 'fire',
                title: 'Flame',
                description: 'Hot',
            };

            mockDataService.get.mockResolvedValueOnce(undefined);
            mockDataService.add.mockImplementation(async (_, payload) => payload);

            const result = await repository.create(newAspectData);

            expect(result.id).toBe('custom-aspect-id');
        });
    });

    describe('update', () => {
        it('updates an existing aspect successfully and updates timestamp', async () => {
            mockDataService.get.mockResolvedValueOnce(mockAspect);
            mockDataService.put.mockResolvedValueOnce('water-deep');

            const result = await repository.update('water-deep', {
                description: 'Updated description',
            });

            expect(mockDataService.get).toHaveBeenCalledWith('dream_aspects', 'water-deep');
            expect(mockDataService.put).toHaveBeenCalledWith(
                'dream_aspects',
                expect.objectContaining({
                    id: 'water-deep',
                    description: 'Updated description',
                    updatedAt: expect.any(String),
                }),
            );
            expect(result.description).toBe('Updated description');
        });

        it('throws an error when trying to update non-existent aspect', async () => {
            mockDataService.get.mockResolvedValueOnce(undefined);

            await expect(
                repository.update('non-existent', { description: 'Test' }),
            ).rejects.toThrow('Аспект с id non-existent не найден');
            expect(mockDataService.put).not.toHaveBeenCalled();
        });
    });
});
