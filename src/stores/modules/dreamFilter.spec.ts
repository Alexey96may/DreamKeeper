import { ref } from 'vue';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDreamFilterStore } from '@/stores/modules/dreamFilter';
import type { Dream } from '@/types/Dream';

const mockSleeps = ref<Dream[]>([]);
const mockLoading = ref(false);

vi.mock('@/stores/modules/dream', () => ({
    useSleepStore: vi.fn(() => ({
        get sleeps() {
            return mockSleeps.value;
        },
        set sleeps(val) {
            mockSleeps.value = val;
        },
        get loading() {
            return mockLoading.value;
        },
    })),
}));

describe('useDreamFilterStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        localStorage.clear();
        mockSleeps.value = [];
        mockLoading.value = false;
    });

    it('initializes with default filters and loads from localStorage', () => {
        const store = useDreamFilterStore();

        expect(store.filters.isActive).toBe(false);
        expect(store.filters.searchQuery).toBe('');
        expect(store.filters.categories).toEqual([]);
        expect(store.matchingCount).toBe(0);
    });

    it('toggles filter active state correctly', () => {
        const store = useDreamFilterStore();

        expect(store.filters.isActive).toBe(false);

        store.toggleActive(true);
        expect(store.filters.isActive).toBe(true);

        store.toggleActive();
        expect(store.filters.isActive).toBe(false);
    });

    it('returns all sleeps when filter is not active', () => {
        mockSleeps.value = [
            {
                id: 1,
                title: 'Dream 1',
                date: '2026-06-01',
                categories: ['lucid'],
            } as unknown as Dream,
            {
                id: 2,
                title: 'Dream 2',
                date: '2026-06-02',
                categories: ['nightmare'],
            } as unknown as Dream,
        ];

        const store = useDreamFilterStore();
        expect(store.filters.isActive).toBe(false);
        expect(store.filteredDreams.length).toBe(2);
    });

    it('filters dreams by searchQuery in title or description', () => {
        mockSleeps.value = [
            {
                id: 1,
                title: 'Flying in space',
                description: 'Deep dark galaxy',
                date: '2026-06-01',
            } as unknown as Dream,
            {
                id: 2,
                title: 'Running in forest',
                description: 'Green trees',
                date: '2026-06-02',
            } as unknown as Dream,
        ];

        const store = useDreamFilterStore();
        store.toggleActive(true);
        store.filters.searchQuery = 'galaxy';

        expect(store.filteredDreams.length).toBe(1);
        expect(store.filteredDreams[0].id).toBe(1);
    });

    it('filters dreams by date range', () => {
        mockSleeps.value = [
            { id: 1, title: 'D1', date: '2026-06-01' } as unknown as Dream,
            { id: 2, title: 'D2', date: '2026-06-05' } as unknown as Dream,
            { id: 3, title: 'D3', date: '2026-06-10' } as unknown as Dream,
        ];

        const store = useDreamFilterStore();
        store.toggleActive(true);
        store.filters.dateFrom = '2026-06-02';
        store.filters.dateTo = '2026-06-08';

        expect(store.filteredDreams.length).toBe(1);
        expect(store.filteredDreams[0].id).toBe(2);
    });

    it('filters dreams by categories and boolean flags', () => {
        mockSleeps.value = [
            {
                id: 1,
                title: 'D1',
                date: '2026-06-01',
                categories: ['lucid', 'prophetic'],
                isFavorite: true,
            } as unknown as Dream,
            {
                id: 2,
                title: 'D2',
                date: '2026-06-02',
                categories: ['lucid'],
                isFavorite: false,
            } as unknown as Dream,
        ];

        const store = useDreamFilterStore();
        store.toggleActive(true);
        store.filters.categories = ['lucid'];
        store.filters.isFavorite = true;

        expect(store.filteredDreams.length).toBe(1);
        expect(store.filteredDreams[0].id).toBe(1);
    });

    it('toggles array filters correctly', () => {
        const store = useDreamFilterStore();
        store.toggleActive(true);

        expect(store.filters.categories).toEqual([]);

        store.toggleArrayFilter('categories', 'lucid');
        expect(store.filters.categories).toEqual(['lucid']);

        store.toggleArrayFilter('categories', 'lucid');
        expect(store.filters.categories).toEqual([]);
    });

    it('toggles boolean and number filters correctly', () => {
        const store = useDreamFilterStore();
        store.toggleActive(true);

        expect(store.filters.isFavorite).toBe(false);
        store.toggleBooleanFilter('isFavorite');
        expect(store.filters.isFavorite).toBe(true);

        expect(store.filters.minQuality).toBeUndefined();
        store.toggleNumberFilter('minQuality', 4);
        expect(store.filters.minQuality).toBe(4);

        store.toggleNumberFilter('minQuality', 4);
        expect(store.filters.minQuality).toBeUndefined();
    });

    it('generates active filter tags and handles tag removal', () => {
        const store = useDreamFilterStore();
        store.toggleActive(true);
        store.filters.searchQuery = 'test';
        store.filters.minQuality = 3;

        expect(store.activeFilterTags.length).toBe(2);

        store.removeFilterTag({ key: 'searchQuery', label: 'Поиск' });
        expect(store.filters.searchQuery).toBe('');
    });

    it('resets filters and clears localStorage', () => {
        const store = useDreamFilterStore();
        store.toggleActive(true);
        store.filters.searchQuery = 'something';

        store.resetFilters();

        expect(store.filters.isActive).toBe(false);
        expect(store.filters.searchQuery).toBe('');
        expect(localStorage.getItem('dreamkeeper_filters')).toBeNull();
    });
});
