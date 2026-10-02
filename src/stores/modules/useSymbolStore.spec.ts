import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSymbolStore } from '@/stores/modules/useSymbolStore';
import type { DreamSymbol } from '@/types/Interpretation/DreamSymbol';

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

vi.mock('@/services/repositories/DreamSymbolRepository', () => ({
    DreamSymbolRepository: class {
        getAll = mockRepository.getAll;
        create = mockRepository.create;
        update = mockRepository.update;
        delete = mockRepository.delete;
    },
}));

vi.mock('@/services/seeders/initialSymbolsSeed', () => ({
    symbolsSeed: [
        { tag: 'water', title: 'Water', category: 'nature' },
        { tag: 'fire', title: 'Fire', category: 'nature' },
        { tag: 'water', title: 'Water Duplicate', category: 'nature' }, // Map uniqueSeeds
    ],
}));

describe('useSymbolStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        mockRepository.getAll.mockResolvedValue([]);
    });

    it('initializes, filters unique seeds and seeds database if empty', async () => {
        mockRepository.getAll.mockResolvedValueOnce([]).mockResolvedValueOnce([
            { tag: 'water', title: 'Water', category: 'nature' },
            { tag: 'fire', title: 'Fire', category: 'nature' },
        ]);

        mockRepository.create.mockResolvedValue({ tag: 'water', title: 'Water' });

        const store = useSymbolStore();
        await store.init();

        expect(mockDataService.init).toHaveBeenCalled();
        expect(mockRepository.create).toHaveBeenCalledTimes(2);
        expect(store.symbols.length).toBe(2);
        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
    });

    it('computes getters, search and category filtering correctly', () => {
        const store = useSymbolStore();
        store.symbols = [
            { tag: 'water', title: 'Ocean Waves', category: 'nature' } as unknown as DreamSymbol,
            { tag: 'fire', title: 'Campfire', category: 'nature' } as unknown as DreamSymbol,
            { tag: 'key', title: 'Golden Key', category: 'object' } as unknown as DreamSymbol,
        ];

        expect(store.totalSymbols).toBe(3);

        expect(store.getSymbolByTag('fire')?.title).toBe('Campfire');
        expect(store.getSymbolByTag('unknown')).toBeUndefined();

        expect(store.searchSymbols('ocean').length).toBe(1);
        expect(store.searchSymbols('   ').length).toBe(3);

        expect(store.getSymbolsByCategory('nature').length).toBe(2);
        expect(store.getSymbolsByCategory('object').length).toBe(1);
    });

    it('adds a symbol successfully and auto-generates slug/tag if missing', async () => {
        const store = useSymbolStore();
        await store.init();

        const newSymbolData = { title: 'Blue Sky', category: 'nature' };
        const savedSymbol = { tag: 'blue-sky', ...newSymbolData };

        mockRepository.create.mockResolvedValue(savedSymbol);

        const result = await store.addSymbol(newSymbolData as unknown as DreamSymbol);

        expect(result).toEqual(savedSymbol);
        expect(store.symbols.length).toBe(1);
        expect(store.symbols[0].tag).toBe('blue-sky');
        expect(store.validationErrors).toEqual({});
    });

    it('fails to add symbol when validation fails', async () => {
        const store = useSymbolStore();
        await store.init();

        const invalidData = { title: '' }; // v. error

        const result = await store.addSymbol(invalidData as unknown as DreamSymbol);

        expect(result).toBeNull();
        expect(store.error).toBe('Исправьте ошибки в форме');
        expect(Object.keys(store.validationErrors).length).toBeGreaterThan(0);
        expect(store.hasError(Object.keys(store.validationErrors)[0])).toBe(true);
    });

    it('updates a symbol successfully', async () => {
        const store = useSymbolStore();
        await store.init();
        store.symbols = [
            { tag: 'water', title: 'Old Title', category: 'nature' } as unknown as DreamSymbol,
        ];

        const updatedSymbol = { tag: 'water', title: 'New Title', category: 'nature' };
        mockRepository.update.mockResolvedValue(updatedSymbol);

        const result = await store.updateSymbol('water', { title: 'New Title' });

        expect(result).toEqual(updatedSymbol);
        expect(store.symbols[0].title).toBe('New Title');
    });

    it('deletes a symbol successfully', async () => {
        const store = useSymbolStore();
        await store.init();

        store.symbols = [{ tag: 'water', title: 'Water' } as unknown as DreamSymbol];

        mockRepository.delete.mockResolvedValue(undefined);

        const success = await store.deleteSymbol('water');

        expect(success).toBe(true);
        expect(store.symbols.length).toBe(0);
    });
});
