import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';
import type { InterprSource } from '@/types/Interpretation/Source';
import type { InterprSourceWrite } from '@/services/schemas/interpretationSource.schema';

const mockRepository = {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

const mockDataService = {
    init: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/services/factories/ServiceFactory', () => ({
    ServiceFactory: {
        createService: vi.fn(() => mockDataService),
    },
}));

vi.mock('@/services/repositories/InterprSourceRepository', () => ({
    InterprSourceRepository: class {
        getAll = mockRepository.getAll;
        create = mockRepository.create;
        update = mockRepository.update;
        delete = mockRepository.delete;
    },
}));

vi.mock('@/services/seeders/interpretationSourceSeeder', () => ({
    initialSourcesSeed: [
        {
            id: 'seed-1',
            title: 'Seed Source 1',
            visibility: 'public',
            type: 'custom',
            category: 'esoteric',
        },
    ],
}));

describe('useInterpretationSourceStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        mockRepository.getAll.mockResolvedValue([]);
    });

    it('initializes and seeds database if empty', async () => {
        mockRepository.getAll
            .mockResolvedValueOnce([]) // Первый вызов при init пустой -> запускает сидинг
            .mockResolvedValueOnce([
                // Второй вызов после создания сидов
                {
                    id: 'seed-1',
                    title: 'Seed Source 1',
                    visibility: 'public',
                    type: 'custom',
                    category: 'esoteric',
                },
            ]);

        mockRepository.create.mockResolvedValue({ id: 'seed-1', title: 'Seed Source 1' });

        const store = useInterpretationSourceStore();
        await store.init();

        expect(mockDataService.init).toHaveBeenCalled();
        expect(mockRepository.create).toHaveBeenCalledTimes(1);
        expect(store.sources.length).toBe(1);
        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
    });

    it('computes getters correctly (total, public, editable, filtering)', () => {
        const store = useInterpretationSourceStore();
        store.sources = [
            {
                id: '1',
                title: 'Source 1',
                visibility: 'public',
                isEditable: true,
                category: 'esoteric',
                type: 'family',
            } as unknown as InterprSource,
            {
                id: '2',
                title: 'Source 2',
                visibility: 'private',
                isEditable: false,
                category: 'personal',
                type: 'custom',
            } as unknown as InterprSource,
            {
                id: '3',
                title: 'Source 3',
                visibility: 'shared',
                isEditable: true,
                category: 'psychology',
                type: 'custom',
            } as unknown as InterprSource,
        ];

        expect(store.totalSources).toBe(3);
        expect(store.publicSources.length).toBe(1);
        expect(store.editableSources.length).toBe(2);

        // Поиск по id (с учетом пробелов и регистра)
        expect(store.getSourceById('  2  ')?.id).toBe('2');
        expect(store.getSourceById('unknown')).toBeUndefined();

        expect(store.getSourcesByCategory('psychology').length).toBe(1);
        expect(store.getSourcesByType('custom').length).toBe(2);
        expect(store.getSourcesByVisibility('private').length).toBe(1);
    });

    it('evaluates user accessible sources correctly', () => {
        const store = useInterpretationSourceStore();
        store.sources = [
            { id: '1', visibility: 'public' } as InterprSource,
            { id: '2', visibility: 'private', ownerId: 'user-1' } as InterprSource,
            { id: '3', visibility: 'private', editorIds: ['user-1'] } as InterprSource,
            { id: '4', visibility: 'private', readerIds: ['user-1'] } as InterprSource,
            { id: '5', visibility: 'private', ownerId: 'user-2' } as InterprSource,
        ];

        const accessible = store.getUserAccessibleSources('user-1');
        expect(accessible.length).toBe(4);
        expect(accessible.map((s) => s.id)).toEqual(['1', '2', '3', '4']);
    });

    it('adds a source successfully when data is valid', async () => {
        const store = useInterpretationSourceStore();
        await store.init();

        const newSourceData = {
            title: 'New Source',
            visibility: 'public',
            category: 'esoteric',
            type: 'custom',
        };
        const savedSource = { id: 'source-10', ...newSourceData };

        mockRepository.create.mockResolvedValue(savedSource);

        const result = await store.addSource(newSourceData as unknown as InterprSourceWrite);

        expect(result).toEqual(savedSource);
        expect(store.sources.length).toBe(1);
        expect(store.sources[0].id).toBe('source-10');
        expect(store.validationErrors).toEqual({});
    });

    it('fails to add source when validation fails', async () => {
        const store = useInterpretationSourceStore();
        await store.init();

        const invalidData = { title: '' };

        const result = await store.addSource(invalidData as unknown as InterprSourceWrite);

        expect(result).toBeNull();
        expect(store.error).toBe('Пожалуйста, исправьте ошибки в форме');
        expect(Object.keys(store.validationErrors).length).toBeGreaterThan(0);
        expect(store.hasError(Object.keys(store.validationErrors)[0])).toBe(true);
    });

    it('updates a source successfully', async () => {
        const store = useInterpretationSourceStore();
        await store.init();
        store.sources = [
            {
                id: '1',
                title: 'Old Title',
                visibility: 'public',
                type: 'custom',
                category: 'esoteric',
            } as unknown as InterprSource,
        ];

        const updatedSource = {
            id: '1',
            title: 'Updated Title',
            visibility: 'public',
            type: 'custom',
            category: 'esoteric',
        };
        mockRepository.update.mockResolvedValue(updatedSource);

        const result = await store.updateSource('1', { title: 'Updated Title' });

        expect(result?.title).toBe('Updated Title');
        expect(store.sources[0].title).toBe('Updated Title');
    });

    it('deletes a source successfully', async () => {
        const store = useInterpretationSourceStore();
        await store.init();
        store.sources = [{ id: '1', title: 'Source 1' } as unknown as InterprSource];

        mockRepository.delete.mockResolvedValue(undefined);

        const success = await store.deleteSource('1');

        expect(success).toBe(true);
        expect(store.sources.length).toBe(0);
    });
});
