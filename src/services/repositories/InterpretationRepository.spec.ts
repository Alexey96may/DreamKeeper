import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InterpretationRepository } from '@/services/repositories/InterpretationRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { Interpretation } from '@/types/Interpretation/Interpretation';

describe('InterpretationRepository', () => {
    let repository: InterpretationRepository;
    let mockDataService: Record<keyof IDataService, ReturnType<typeof vi.fn>>;

    const mockInterpretation: Interpretation = {
        id: 'interp-1',
        meanings: ['Flying means freedom', 'Escaping reality'],
        symbolTag: 'flying',
        aspectId: null,
        sourceId: 'jung',
        isCustom: false,
        isVerified: true,
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
    };

    beforeEach(() => {
        mockDataService = {
            init: vi.fn(),
            getAll: vi.fn().mockResolvedValue([mockInterpretation]),
            get: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            getByIndex: vi.fn(),
            clear: vi.fn(),
        };

        repository = new InterpretationRepository(mockDataService as unknown as IDataService);
        vi.clearAllMocks();
    });

    describe('getBySymbolId', () => {
        it('fetches interpretations by symbolTag (symbolId index) successfully', async () => {
            mockDataService.getByIndex.mockResolvedValueOnce([mockInterpretation]);

            const result = await repository.getBySymbolId('flying');

            expect(mockDataService.getByIndex).toHaveBeenCalledWith(
                'dreamInterpretations',
                'symbolId',
                'flying',
            );
            expect(result).toEqual([mockInterpretation]);
        });
    });

    describe('getBySourceId', () => {
        it('fetches interpretations by sourceId using index successfully', async () => {
            mockDataService.getByIndex.mockResolvedValueOnce([mockInterpretation]);

            const result = await repository.getBySourceId('jung');

            expect(mockDataService.getByIndex).toHaveBeenCalledWith(
                'dreamInterpretations',
                'sourceId',
                'jung',
            );
            expect(result).toEqual([mockInterpretation]);
        });
    });

    describe('create', () => {
        it('creates a new interpretation with createdAt and updatedAt timestamps', async () => {
            const newInterpretationData = {
                meanings: ['Water represents emotions'],
                symbolTag: 'water',
                aspectId: null,
                sourceId: 'custom_alexey',
                isCustom: true,
            };

            const expectedPayload = {
                ...newInterpretationData,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockDataService.add.mockResolvedValueOnce({ id: 'interp-2', ...expectedPayload });

            const result = await repository.create(newInterpretationData);

            expect(mockDataService.add).toHaveBeenCalledWith(
                'dreamInterpretations',
                expect.objectContaining(newInterpretationData),
            );
            expect(result.id).toBe('interp-2');
            expect(result.meanings).toEqual(['Water represents emotions']);
        });
    });

    describe('update', () => {
        it('updates an existing interpretation successfully and refreshes updatedAt', async () => {
            mockDataService.get.mockResolvedValueOnce(mockInterpretation);
            mockDataService.put.mockResolvedValueOnce('interp-1');

            const result = await repository.update('interp-1', { meanings: ['Updated meaning'] });

            expect(mockDataService.get).toHaveBeenCalledWith('dreamInterpretations', 'interp-1');
            expect(mockDataService.put).toHaveBeenCalledWith(
                'dreamInterpretations',
                expect.objectContaining({
                    id: 'interp-1',
                    meanings: ['Updated meaning'],
                    updatedAt: expect.any(String),
                }),
            );
            expect(result.meanings).toEqual(['Updated meaning']);
        });

        it('throws an error when trying to update non-existent interpretation', async () => {
            mockDataService.get.mockResolvedValueOnce(undefined);

            await expect(repository.update('non-existent', { meanings: ['Test'] })).rejects.toThrow(
                'Интерпретация с id non-existent не найдена в dreamInterpretations',
            );
            expect(mockDataService.put).not.toHaveBeenCalled();
        });
    });
});
