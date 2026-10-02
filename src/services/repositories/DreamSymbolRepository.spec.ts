import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DreamSymbolRepository } from '@/services/repositories/DreamSymbolRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { DreamSymbol } from '@/types/Interpretation/DreamSymbol';

vi.mock('@/utils/routes', () => ({
    slugify: vi.fn((text: string) =>
        text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
    ),
}));

describe('DreamSymbolRepository', () => {
    let repository: DreamSymbolRepository;
    let mockDataService: Record<keyof IDataService, ReturnType<typeof vi.fn>>;

    const mockSymbol: DreamSymbol = {
        tag: 'flying',
        title: 'Flying',
        category: 'archetype',
        description: 'Flying in dreams',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
    };

    beforeEach(() => {
        mockDataService = {
            init: vi.fn(),
            getAll: vi.fn().mockResolvedValue([mockSymbol]),
            get: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            getByIndex: vi.fn(),
            clear: vi.fn(),
        };

        repository = new DreamSymbolRepository(mockDataService as unknown as IDataService);
        vi.clearAllMocks();
    });

    describe('getByTag', () => {
        it('fetches symbol by tag successfully via getById', async () => {
            mockDataService.get.mockResolvedValueOnce(mockSymbol);

            const result = await repository.getByTag('flying');

            expect(mockDataService.get).toHaveBeenCalledWith('dream_symbols', 'flying');
            expect(result).toEqual(mockSymbol);
        });
    });

    describe('create', () => {
        it('creates a symbol with provided tag', async () => {
            const newSymbolData = {
                tag: 'custom-tag',
                title: 'Custom Title',
                category: 'test',
            };

            const expectedPayload = {
                ...newSymbolData,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockDataService.add.mockResolvedValueOnce(expectedPayload);

            const result = await repository.create(newSymbolData as unknown as DreamSymbol);

            expect(mockDataService.add).toHaveBeenCalledWith(
                'dream_symbols',
                expect.objectContaining({ tag: 'custom-tag' }),
            );
            expect(result).toEqual(expectedPayload);
        });

        it('generates a unique tag from title if tag is not provided', async () => {
            const newSymbolData = {
                title: 'Water Fall',
                category: 'nature',
            };

            mockDataService.get.mockResolvedValueOnce(undefined);
            mockDataService.add.mockImplementation(async (_, payload) => payload);

            const result = await repository.create(newSymbolData as unknown as DreamSymbol);

            expect(result.tag).toBe('water-fall');
            expect(mockDataService.add).toHaveBeenCalledWith(
                'dream_symbols',
                expect.objectContaining({ tag: 'water-fall' }),
            );
        });

        it('handles tag collisions during generation by appending a counter', async () => {
            const newSymbolData = {
                title: 'Flying',
                category: 'archetype',
            };

            mockDataService.get.mockResolvedValueOnce(mockSymbol).mockResolvedValueOnce(undefined);

            mockDataService.add.mockImplementation(async (_, payload) => payload);

            const result = await repository.create(newSymbolData as unknown as DreamSymbol);

            expect(result.tag).toBe('flying-1');
        });
    });

    describe('update', () => {
        it('updates an existing symbol successfully without tag change', async () => {
            mockDataService.get.mockResolvedValueOnce(mockSymbol);
            mockDataService.put.mockResolvedValueOnce('flying');

            const result = await repository.update('flying', {
                description: 'Updated description',
            });

            expect(mockDataService.get).toHaveBeenCalledWith('dream_symbols', 'flying');
            expect(mockDataService.put).toHaveBeenCalledWith(
                'dream_symbols',
                expect.objectContaining({
                    tag: 'flying',
                    description: 'Updated description',
                    updatedAt: expect.any(String),
                }),
            );
            expect(mockDataService.delete).not.toHaveBeenCalled();
            expect(result.description).toBe('Updated description');
        });

        it('regenerates tag, deletes old record, and puts new one if title changes', async () => {
            mockDataService.get.mockResolvedValueOnce(mockSymbol); // Получение существующего символа по старому тегу
            mockDataService.get.mockResolvedValueOnce(undefined); // Проверка уникальности нового тега 'soaring'
            mockDataService.delete.mockResolvedValueOnce(undefined);
            mockDataService.put.mockResolvedValueOnce('soaring');

            const result = await repository.update('flying', { title: 'Soaring' });

            expect(result.tag).toBe('soaring');
            expect(mockDataService.delete).toHaveBeenCalledWith('dream_symbols', 'flying');
            expect(mockDataService.put).toHaveBeenCalledWith(
                'dream_symbols',
                expect.objectContaining({ tag: 'soaring', title: 'Soaring' }),
            );
        });

        it('throws an error when trying to update non-existent symbol', async () => {
            mockDataService.get.mockResolvedValueOnce(undefined);

            await expect(repository.update('non-existent', { title: 'Test' })).rejects.toThrow(
                'Символ с тегом non-existent не найден',
            );
            expect(mockDataService.put).not.toHaveBeenCalled();
        });
    });
});
