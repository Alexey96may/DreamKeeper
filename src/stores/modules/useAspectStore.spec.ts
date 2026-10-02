import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAspectStore } from '@/stores/modules/useAspectStore';
import type { DreamAspect } from '@/types/Interpretation/DreamAspect';

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

vi.mock('@/services/repositories/DreamAspectRepository', () => ({
    DreamAspectRepository: class {
        getAll = mockRepository.getAll;
        create = mockRepository.create;
        update = mockRepository.update;
        delete = mockRepository.delete;
    },
}));

vi.mock('@/services/seeders/initialAspectsSeed', () => ({
    initialAspectsSeed: [
        { symbolTag: 'water', title: 'Ocean' },
        { symbolTag: 'fire', title: 'Flame' },
    ],
}));

describe('useAspectStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        mockRepository.getAll.mockResolvedValue([]);
    });

    it('initializes and seeds database if empty', async () => {
        mockRepository.getAll.mockResolvedValueOnce([]).mockResolvedValueOnce([
            { id: '1', symbolTag: 'water', title: 'Ocean' },
            { id: '2', symbolTag: 'fire', title: 'Flame' },
        ]);

        mockRepository.create.mockResolvedValue({ id: '1', symbolTag: 'water', title: 'Ocean' });

        const store = useAspectStore();
        await store.init();

        expect(mockDataService.init).toHaveBeenCalled();
        expect(mockRepository.create).toHaveBeenCalledTimes(2);
        expect(store.aspects.length).toBe(2);
        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
    });

    it('gets aspect by id and filters by symbol tag correctly', () => {
        const store = useAspectStore();
        store.aspects = [
            { id: '1', symbolTag: 'water', title: 'River' } as unknown as DreamAspect,
            { id: '2', symbolTag: 'water', title: 'Rain' } as unknown as DreamAspect,
            { id: '3', symbolTag: 'fire', title: 'Sun' } as unknown as DreamAspect,
        ];

        expect(store.getAspectById('2')?.title).toBe('Rain');
        expect(store.getAspectById('99')).toBeUndefined();

        expect(store.getAspectsBySymbolTag('water').length).toBe(2);
        expect(store.getAspectsBySymbolTag('fire').length).toBe(1);
    });

    it('groups aspects by symbol tag correctly', () => {
        const store = useAspectStore();
        store.aspects = [
            { id: '1', symbolTag: 'water', title: 'River' } as unknown as DreamAspect,
            { id: '2', symbolTag: 'fire', title: 'Sun' } as unknown as DreamAspect,
            { id: '3', title: 'No Tag Aspect' } as unknown as DreamAspect, // 'uncategorized'
        ];

        const grouped = store.groupedBySymbol;

        expect(grouped['water'].length).toBe(1);
        expect(grouped['fire'].length).toBe(1);
        expect(grouped['uncategorized'].length).toBe(1);
    });

    it('adds an aspect successfully when data is valid', async () => {
        const store = useAspectStore();
        await store.init();

        const newAspectData = { symbolTag: 'wind', title: 'Storm', description: 'Strong wind' };
        const savedAspect = { id: '10', ...newAspectData };

        mockRepository.create.mockResolvedValue(savedAspect);

        const result = await store.addAspect(newAspectData as unknown as DreamAspect);

        expect(result).toEqual(savedAspect);
        expect(store.aspects.length).toBe(1);
        expect(store.aspects[0].id).toBe('10');
        expect(store.validationErrors).toEqual({});
    });

    it('fails to add aspect when validation fails', async () => {
        const store = useAspectStore();
        await store.init();

        const invalidData = { title: '' };

        const result = await store.addAspect(invalidData as unknown as DreamAspect);

        expect(result).toBeNull();
        expect(store.error).toBe('Исправьте ошибки в форме');
        expect(Object.keys(store.validationErrors).length).toBeGreaterThan(0);
        expect(store.hasError(Object.keys(store.validationErrors)[0])).toBe(true);
    });

    it('updates an aspect successfully', async () => {
        const store = useAspectStore();
        await store.init();
        store.aspects = [
            { id: '1', symbolTag: 'water', title: 'Old Name' } as unknown as DreamAspect,
        ];

        const updatedAspect = { id: '1', symbolTag: 'water', title: 'New Name' };
        mockRepository.update.mockResolvedValue(updatedAspect);

        const result = await store.updateAspect('1', { title: 'New Name' });

        expect(result).toEqual(updatedAspect);
        expect(store.aspects[0].title).toBe('New Name');
    });

    it('deletes an aspect successfully', async () => {
        const store = useAspectStore();
        await store.init();

        store.aspects = [{ id: '1', symbolTag: 'water', title: 'River' } as unknown as DreamAspect];

        mockRepository.delete.mockResolvedValue(undefined);

        const success = await store.deleteAspect('1');

        expect(success).toBe(true);
        expect(store.aspects.length).toBe(0);
    });
});
