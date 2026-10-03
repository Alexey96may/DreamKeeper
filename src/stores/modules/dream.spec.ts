import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSleepStore } from '@/stores/modules/dream';
import type { Dream, DreamWrite } from '@/types/Dream';

export type DreamImport = DreamWrite & {
    id?: number;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
};

vi.mock('@/stores/modules/useSymbolStore', () => ({
    useSymbolStore: vi.fn(() => ({
        getSymbolByTag: vi.fn(),
        addSymbol: vi.fn(),
    })),
}));

vi.mock('@/stores/modules/useInterpretationStore', () => ({
    useInterpretationStore: vi.fn(() => ({
        getInterpretationById: vi.fn(),
        interpretations: [],
        updateInterpretation: vi.fn(),
        addInterpretation: vi.fn(),
    })),
}));

vi.mock('@/stores/modules/ui', () => ({
    useUIStore: vi.fn(() => ({
        isTestModeExited: true,
        addToast: vi.fn(),
    })),
}));

vi.mock('@/services/factories/ServiceFactory', () => ({
    ServiceFactory: {
        createService: vi.fn(() => {
            let autoIncrement = 1;
            return {
                init: vi.fn(),
                getAll: vi.fn().mockResolvedValue([]),
                add: vi.fn((_store, data) =>
                    Promise.resolve({
                        ...data,
                        id: data.id !== undefined ? data.id : autoIncrement++,
                        createdAt: data.createdAt || new Date().toISOString(),
                        updatedAt: data.updatedAt || new Date().toISOString(),
                    }),
                ),
                create: vi.fn((_store, data) =>
                    Promise.resolve({
                        ...data,
                        id: data.id !== undefined ? data.id : autoIncrement++,
                        createdAt: data.createdAt || new Date().toISOString(),
                        updatedAt: data.updatedAt || new Date().toISOString(),
                    }),
                ),
                update: vi.fn((_store, id, data) => Promise.resolve({ id, ...data })),
                delete: vi.fn().mockResolvedValue(true),
                clear: vi.fn().mockResolvedValue(undefined),
                clearAll: vi.fn().mockResolvedValue(undefined),
            };
        }),
    },
}));

describe('useSleepStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('initializes default state correctly', () => {
        const store = useSleepStore();
        expect(store.sleeps).toEqual([]);
        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.totalDreams).toBe(0);
        expect(store.averageQuality).toBe(0);
    });

    it('computes totalDreams and averageQuality correctly', () => {
        const store = useSleepStore();

        store.sleeps = [
            {
                id: 1,
                quality: 4,
                title: 'Dream 1',
                description: 'Dream 1 description',
                date: '2026-06-01',
                createdAt: '2026-06-01T10:00:00.000Z',
            },
            {
                id: 2,
                quality: 2,
                title: 'Dream 2',
                description: 'Dream 2 description',
                date: '2026-06-02',
                createdAt: '2026-06-02T10:00:00.000Z',
            },
        ] as unknown as Dream[];

        expect(store.totalDreams).toBe(2);
        expect(store.averageQuality).toBe(3.0);
    });

    it('filters dreams by date with sanitization', () => {
        const store = useSleepStore();
        store.sleeps = [
            {
                id: 1,
                date: '2026-06-01',
                createdAt: '2026-06-01T10:00:00.000Z',
                title: 'Dream 1',
                description: 'Dream 1 description',
            },
            {
                id: 2,
                date: '2026-06-02',
                createdAt: '2026-06-02T10:00:00.000Z',
                title: 'Dream 2',
                description: 'Dream 2 description',
            },
        ] as unknown as Dream[];

        const results = store.getDreamsByDate('2026-06-01');
        expect(results.length).toBe(1);
        expect(results[0].id).toBe(1);
    });

    it('finds dream by ID and slug', async () => {
        const store = useSleepStore();
        const mockDream = {
            id: 10,
            title: 'Dream 1',
            description: 'Dream 1 description',
            slug: 'test-dream-slug',
            date: '2026-06-01',
            createdAt: '2026-06-01T10:00:00.000Z',
        } as unknown as Dream;

        store.sleeps = [mockDream];

        expect(store.getDreamById(10)).toEqual(mockDream);
        expect(store.getDreamById(999)).toBeUndefined();

        const foundLocal = await store.getDreamBySlug('test-dream-slug');
        expect(foundLocal).toEqual(mockDream);
    });

    it('handles validation errors on addDream', async () => {
        const store = useSleepStore();
        await store.init();

        const invalidData = {
            title: '',
        } as unknown as DreamWrite;

        const result = await store.addDream(invalidData);

        expect(result).toBeNull();
        expect(store.error).toBeTruthy();
        expect(Object.keys(store.validationErrors).length).toBeGreaterThan(0);
    });

    it('deletes a dream successfully via deleteDream', async () => {
        const store = useSleepStore();
        await store.init();

        store.sleeps = [
            {
                id: 1,
                date: '2026-06-01',
                createdAt: '2026-06-01T10:00:00.000Z',
                title: 'Dream 1',
                description: 'Desc',
            },
        ] as unknown as Dream[];

        const success = await store.deleteDream(1);

        expect(success).toBe(true);
        expect(store.sleeps.length).toBe(0);
    });

    it('manages field errors with clearError, getError, and hasError', () => {
        const store = useSleepStore();
        store.validationErrors = {
            title: 'Required field',
        };

        expect(store.hasError('title')).toBe(true);
        expect(store.getError('title')).toBe('Required field');
        expect(store.hasError('description')).toBe(false);

        store.clearError('title');
        expect(store.hasError('title')).toBe(false);
    });

    describe('importDreams', () => {
        it('successfully imports valid dreams in merge mode and sorts them', async () => {
            const store = useSleepStore();
            await store.init();

            const existingDream = {
                id: 1,
                slug: 'dream-1',
                title: 'Existing',
                description: 'Desc',
                date: '2026-06-01',
                createdAt: '2026-06-01T10:00:00.000Z',
                updatedAt: '2026-06-01T10:00:00.000Z',
                categories: [],
                quality: 6,
                clarity: 7,
                moodAfter: 6,
                timeOfDay: undefined,
                visualStyle: 'color',
                perspective: 'first_person',
                roles: ['protagonist'],
                sensations: ['sounds'],
                characters: [],
                locations: ['Неизвестное место'],
                objects: [],
                emotions: ['Спокойствие'],
                isAlien: false,
                authorName: '',
                interpretations: [],
                isFavorite: false,
                isPinned: false,
                isArchived: false,
                isDeleted: false,
                isDraft: false,
                isPrivate: true,
            } as Dream;
            store.sleeps = [existingDream];

            const newDreams: DreamImport[] = [
                {
                    id: 2,
                    slug: 'dream-2',
                    title: 'New Dream',
                    description: 'Desc',
                    date: '2026-06-02',
                    createdAt: '2026-06-02T10:00:00.000Z',
                    updatedAt: '2026-06-02T10:00:00.000Z',
                    categories: [],
                    quality: 6,
                    clarity: 7,
                    moodAfter: 6,
                    timeOfDay: undefined,
                    visualStyle: 'color',
                    perspective: 'first_person',
                    roles: ['protagonist'],
                    sensations: ['sounds'],
                    characters: [],
                    locations: ['Неизвестное место'],
                    objects: [],
                    emotions: ['Спокойствие'],
                    isAlien: false,
                    authorName: '',
                    interpretations: [],
                    isFavorite: false,
                    isPinned: false,
                    isArchived: false,
                    isDeleted: false,
                    isDraft: false,
                    isPrivate: true,
                },
            ];

            await store.importDreams(newDreams, 'merge');

            expect(store.sleeps.length).toBe(2);
            expect(store.sleeps[0].id).toBe(2);
        });

        it('clears existing dreams and replaces them in replace mode', async () => {
            const store = useSleepStore();
            await store.init();

            store.sleeps = [
                {
                    id: 1,
                    slug: 'dream-1',
                    title: 'Old Dream',
                    description: 'Desc',
                    date: '2026-06-01',
                    createdAt: '2026-06-01T10:00:00.000Z',
                    updatedAt: '2026-06-01T10:00:00.000Z',
                    categories: [],
                    quality: 3,
                    clarity: 7,
                    moodAfter: 6,
                    timeOfDay: undefined,
                    visualStyle: 'color',
                    perspective: 'first_person',
                    roles: ['protagonist'],
                    sensations: ['sounds'],
                    characters: [],
                    locations: ['Неизвестное место'],
                    objects: [],
                    emotions: ['Спокойствие'],
                    isAlien: false,
                    authorName: '',
                    interpretations: [],
                    isFavorite: false,
                    isPinned: false,
                    isArchived: false,
                    isDeleted: false,
                    isDraft: false,
                    isPrivate: true,
                },
            ] as Dream[];

            const replacementDreams: DreamImport[] = [
                {
                    id: 5,
                    slug: 'dream-5',
                    title: 'Replacement Dream',
                    description: 'Desc',
                    date: '2026-01-01',
                    createdAt: '2026-06-05T10:00:00.000Z',
                    updatedAt: '2026-06-01T10:00:00.000Z',
                    categories: [],
                    quality: 5,
                    clarity: 7,
                    moodAfter: 6,
                    timeOfDay: undefined,
                    visualStyle: 'color',
                    perspective: 'first_person',
                    roles: ['protagonist'],
                    sensations: ['sounds'],
                    characters: [],
                    locations: ['Неизвестное место'],
                    objects: [],
                    emotions: ['Спокойствие'],
                    isAlien: false,
                    authorName: '',
                    interpretations: [],
                    isFavorite: false,
                    isPinned: false,
                    isArchived: false,
                    isDeleted: false,
                    isDraft: false,
                    isPrivate: true,
                },
            ];

            await store.importDreams(replacementDreams, 'replace');

            expect(store.sleeps.length).toBe(1);
            expect(store.sleeps[0].id).toBe(5);
        });

        it('skips invalid dreams based on Valibot schema validation', async () => {
            const store = useSleepStore();
            await store.init();

            const mixedDreams: DreamImport[] = [
                {
                    id: 3,
                    slug: 'dream-3',
                    title: 'Valid Dream',
                    description: 'Desc',
                    date: '2026-06-03',
                    createdAt: '2026-06-03T10:00:00.000Z',
                    updatedAt: '2026-06-03T10:00:00.000Z',
                    categories: [],
                    quality: 5,
                    clarity: 7,
                    moodAfter: 6,
                    timeOfDay: undefined,
                    visualStyle: 'color',
                    perspective: 'first_person',
                    roles: ['protagonist'],
                    sensations: ['sounds'],
                    characters: [],
                    locations: ['Неизвестное место'],
                    objects: [],
                    emotions: ['Спокойствие'],
                    isAlien: false,
                    authorName: '',
                    interpretations: [],
                    isFavorite: false,
                    isPinned: false,
                    isArchived: false,
                    isDeleted: false,
                    isDraft: false,
                    isPrivate: true,
                },
                {
                    title: '',
                    id: 66,
                    slug: 'dream-3',
                    description: 'Desc',
                    date: '2026-06-03',
                    createdAt: '2026-06-03T10:00:00.000Z',
                    updatedAt: '2026-06-03T10:00:00.000Z',
                    categories: [],
                    quality: 5,
                    clarity: 7,
                    moodAfter: 6,
                    timeOfDay: undefined,
                    visualStyle: 'color',
                    perspective: 'first_person',
                    roles: ['protagonist'],
                    sensations: ['sounds'],
                    characters: [],
                    locations: ['Неизвестное место'],
                    objects: [],
                    emotions: ['Спокойствие'],
                    isAlien: false,
                    authorName: '',
                    interpretations: [],
                    isFavorite: false,
                    isPinned: false,
                    isArchived: false,
                    isDeleted: false,
                    isDraft: false,
                    isPrivate: true,
                },
            ];

            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            await store.importDreams(mixedDreams, 'merge');

            expect(store.sleeps.length).toBe(1);
            expect(store.sleeps[0].id).toBe(3);
            expect(consoleWarnSpy).toHaveBeenCalled();

            consoleWarnSpy.mockRestore();
        });

        it('skips duplicate dreams during merge mode by id or slug', async () => {
            const store = useSleepStore();
            await store.init();

            const existingDream = {
                id: 1,
                slug: 'dream-1',
                title: 'Existing',
                description: 'Desc',
                date: '2026-06-01',
                createdAt: '2026-06-01T10:00:00.000Z',
                updatedAt: '2026-06-03T10:00:00.000Z',
                categories: [],
                quality: 5,
                clarity: 7,
                moodAfter: 6,
                timeOfDay: undefined,
                visualStyle: 'color',
                perspective: 'first_person',
                roles: ['protagonist'],
                sensations: ['sounds'],
                characters: [],
                locations: ['Неизвестное место'],
                objects: [],
                emotions: ['Спокойствие'],
                isAlien: false,
                authorName: '',
                interpretations: [],
                isFavorite: false,
                isPinned: false,
                isArchived: false,
                isDeleted: false,
                isDraft: false,
                isPrivate: true,
            } as unknown as Dream;
            store.sleeps = [existingDream];

            const duplicateDreams: DreamImport[] = [
                {
                    id: 1, // Совпадает ID
                    slug: 'other-slug',
                    title: 'Duplicate by ID',
                    description: 'Desc',
                    date: '2026-06-01',
                    createdAt: '2026-06-01T10:00:00.000Z',
                    updatedAt: '2026-06-01T10:00:00.000Z',
                    categories: [],
                    quality: 5,
                    clarity: 7,
                    moodAfter: 6,
                    timeOfDay: undefined,
                    visualStyle: 'color',
                    perspective: 'first_person',
                    roles: ['protagonist'],
                    sensations: ['sounds'],
                    characters: [],
                    locations: ['Неизвестное место'],
                    objects: [],
                    emotions: ['Спокойствие'],
                    isAlien: false,
                    authorName: '',
                    interpretations: [],
                    isFavorite: false,
                    isPinned: false,
                    isArchived: false,
                    isDeleted: false,
                    isDraft: false,
                    isPrivate: true,
                },
                {
                    id: 99,
                    slug: 'dream-1', // Совпадает slug
                    title: 'Duplicate by Slug',
                    description: 'Desc',
                    date: '2026-06-01',
                    createdAt: '2026-06-01T10:00:00.000Z',
                    updatedAt: '2026-06-01T10:00:00.000Z',
                    categories: [],
                    quality: 5,
                    clarity: 7,
                    moodAfter: 6,
                    timeOfDay: undefined,
                    visualStyle: 'color',
                    perspective: 'first_person',
                    roles: ['protagonist'],
                    sensations: ['sounds'],
                    characters: [],
                    locations: ['Неизвестное место'],
                    objects: [],
                    emotions: ['Спокойствие'],
                    isAlien: false,
                    authorName: '',
                    interpretations: [],
                    isFavorite: false,
                    isPinned: false,
                    isArchived: false,
                    isDeleted: false,
                    isDraft: false,
                    isPrivate: true,
                },
            ];

            await store.importDreams(duplicateDreams, 'merge');

            expect(store.sleeps.length).toBe(1);
        });
    });
});
