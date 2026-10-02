import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DreamRepository } from '@/services/repositories/DreamRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { Dream, DreamWrite } from '@/types/Dream';

vi.mock('@/utils/routes', () => ({
    slugify: vi.fn((text: string) =>
        text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
    ),
}));

describe('DreamRepository', () => {
    let repository: DreamRepository;
    let mockDataService: Record<keyof IDataService, ReturnType<typeof vi.fn>>;

    const mockDream: Partial<Dream> = {
        id: 1,
        title: 'Flying in space',
        slug: 'flying-in-space',
        date: '2026-06-01',
        description: 'I was flying...',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
    };

    beforeEach(() => {
        mockDataService = {
            init: vi.fn(),
            getAll: vi.fn().mockResolvedValue([mockDream]),
            get: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            getByIndex: vi.fn(),
            clear: vi.fn(),
        };

        repository = new DreamRepository(mockDataService as unknown as IDataService);
        vi.clearAllMocks();
    });

    describe('getBySlug', () => {
        it('fetches dream by slug using index successfully', async () => {
            mockDataService.getByIndex.mockResolvedValueOnce([mockDream]);

            const result = await repository.getBySlug('flying-in-space');

            expect(mockDataService.getByIndex).toHaveBeenCalledWith(
                'dreams',
                'slug',
                'flying-in-space',
            );
            expect(result).toEqual(mockDream);
        });

        it('falls back to memory scan if index lookup throws an error', async () => {
            mockDataService.getByIndex.mockRejectedValueOnce(new Error('Index unavailable'));
            mockDataService.getAll.mockResolvedValueOnce([mockDream]);

            const result = await repository.getBySlug('flying-in-space');

            expect(mockDataService.getAll).toHaveBeenCalled();
            expect(result).toEqual(mockDream);
        });

        it('returns undefined if dream with slug is not found', async () => {
            mockDataService.getByIndex.mockResolvedValueOnce([]);

            const result = await repository.getBySlug('non-existent');
            expect(result).toBeUndefined();
        });
    });

    describe('create', () => {
        it('creates a new dream with generated slug and timestamps', async () => {
            const newDreamData: Partial<DreamWrite> = {
                title: 'Ocean Voyage',
                date: '2026-06-02',
                description: 'Sailing...',
            };

            const expectedSavedDream: Partial<Dream> = {
                id: 2,
                ...newDreamData,
                slug: 'ocean-voyage',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockDataService.getByIndex.mockResolvedValue([]);
            mockDataService.add.mockResolvedValueOnce(expectedSavedDream);

            const result = await repository.create(newDreamData as unknown as DreamWrite);

            expect(mockDataService.add).toHaveBeenCalledWith(
                'dreams',
                expect.objectContaining({
                    title: 'Ocean Voyage',
                    slug: 'ocean-voyage',
                }),
            );
            expect(result).toEqual(expectedSavedDream);
        });

        it('generates a unique slug with counter if slug collision occurs', async () => {
            const newDreamData: Partial<DreamWrite> = {
                title: 'Flying in space',
                date: '2026-06-03',
                description: 'Again...',
            };

            mockDataService.getByIndex.mockResolvedValueOnce([mockDream]).mockResolvedValueOnce([]);

            mockDataService.add.mockImplementation(async (_, payload) => ({
                id: 3,
                ...payload,
            }));

            const result = await repository.create(newDreamData as unknown as DreamWrite);

            expect(result.slug).toBe('flying-in-space-1');
        });
    });

    describe('update', () => {
        it('updates an existing dream successfully without slug change if title/date unchanged', async () => {
            mockDataService.get.mockResolvedValueOnce(mockDream);
            mockDataService.put.mockResolvedValueOnce(1);

            const result = await repository.update(1, { description: 'Updated content only' });

            expect(mockDataService.get).toHaveBeenCalledWith('dreams', 1);
            expect(mockDataService.put).toHaveBeenCalledWith(
                'dreams',
                expect.objectContaining({
                    id: 1,
                    title: mockDream.title,
                    date: mockDream.date,
                    description: 'Updated content only',
                    slug: 'flying-in-space',
                    updatedAt: expect.any(String),
                }),
            );
            expect(result.description).toBe('Updated content only');
        });

        it('updates slug if title or date changes', async () => {
            mockDataService.get.mockResolvedValueOnce(mockDream);
            mockDataService.getByIndex.mockResolvedValueOnce([]);
            mockDataService.put.mockResolvedValueOnce(1);

            const result = await repository.update(1, { title: 'New Title' });

            expect(result.slug).toBe('new-title');
            expect(mockDataService.put).toHaveBeenCalledWith(
                'dreams',
                expect.objectContaining({
                    slug: 'new-title',
                }),
            );
        });

        it('throws an error when trying to update non-existent dream', async () => {
            mockDataService.get.mockResolvedValueOnce(undefined);

            await expect(repository.update(999, { title: 'Test' })).rejects.toThrow(
                'Сон с id 999 не найден',
            );
            expect(mockDataService.put).not.toHaveBeenCalled();
        });
    });
});
