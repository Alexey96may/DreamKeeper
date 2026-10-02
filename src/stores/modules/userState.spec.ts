import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStateStore } from '@/stores/modules/userState';
import type { UserState } from '@/types/UserState';

const mockRepository = {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    clearAll: vi.fn(),
};

const mockDataService = {
    init: vi.fn().mockResolvedValue(undefined),
};

const mockUIStore = {
    isTestModeExited: false,
};

vi.mock('@/services/factories/ServiceFactory', () => ({
    ServiceFactory: {
        createService: vi.fn(() => mockDataService),
    },
}));

vi.mock('@/services/repositories/UserStateRepository', () => ({
    UserStateRepository: class {
        getAll = mockRepository.getAll;
        create = mockRepository.create;
        update = mockRepository.update;
        delete = mockRepository.delete;
        clearAll = mockRepository.clearAll;
    },
}));

vi.mock('@/services/seeders/userStatesSeeder', () => ({
    userStatesSeed: [
        { id: 1, date: '2026-05-01', mood: 8, energy: 7, focus: 9 },
        { id: 2, date: '2026-05-02', mood: 6, energy: 5, focus: 6 },
    ],
}));

vi.mock('@/stores/modules/ui', () => ({
    useUIStore: vi.fn(() => mockUIStore),
}));

describe('useUserStateStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        mockRepository.getAll.mockResolvedValue([]);
        mockUIStore.isTestModeExited = false;
    });

    it('initializes and seeds database if empty and test mode not exited', async () => {
        mockRepository.getAll.mockResolvedValueOnce([]).mockResolvedValueOnce([
            { id: 1, date: '2026-05-01', mood: 8, energy: 7 },
            { id: 2, date: '2026-05-02', mood: 6, energy: 5 },
        ]);

        mockRepository.create.mockResolvedValue({ id: 1, date: '2026-05-01', mood: 8 });

        const store = useUserStateStore();
        await store.init();

        expect(mockDataService.init).toHaveBeenCalled();
        expect(mockRepository.create).toHaveBeenCalledTimes(2);
        expect(store.states.length).toBe(2);
        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
    });

    it('computes getters, averages and month statistics correctly', () => {
        const store = useUserStateStore();
        store.states = [
            {
                id: 1,
                date: '2026-06-10T10:00:00.000Z',
                mood: 8,
                energy: 6,
                focus: 7,
            } as unknown as UserState,
            { id: 2, date: '2026-06-15', mood: 6, energy: 4, focus: 5 } as unknown as UserState,
            { id: 3, date: '2026-07-01', mood: 10, energy: 10 } as unknown as UserState, // без focus
        ];

        expect(store.totalStates).toBe(3);

        // Поиск по дате (с учетом обрезания времени)
        expect(store.getStateByDate('2026-06-10T23:59:59.000Z')?.id).toBe(1);
        expect(store.getStateByDate('2026-12-31')).toBeUndefined();

        // Фильтрация по месяцу
        expect(store.getStatesByMonth(2026, 6).length).toBe(2);

        // Средние значения
        expect(store.getAverageMood()).toBe(8.0); // (8 + 6 + 10) / 3 = 8
        expect(store.getAverageEnergy()).toBe(6.7); // (6 + 4 + 10) / 3 = 6.666... -> 6.7

        // Статистика за месяц
        const stats = store.getMonthStats(2026, 6);
        expect(stats).toEqual({
            total: 2,
            avgMood: 7.0,
            avgEnergy: 5.0,
            avgFocus: 6.0,
        });

        expect(store.getMonthStats(2025, 1)).toBeNull();
    });

    it('adds a state successfully when data is valid', async () => {
        const store = useUserStateStore();
        await store.init();

        const newStateData = { date: '2026-05-05', mood: 9, energy: 8 };
        const savedState = { id: 10, ...newStateData };

        mockRepository.create.mockResolvedValue(savedState);

        const result = await store.addState(newStateData as unknown as UserState);

        expect(result).toEqual(savedState);
        expect(store.states.length).toBe(1);
        expect(store.states[0].id).toBe(10);
        expect(store.validationErrors).toEqual({});
    });

    it('fails to add state when validation fails', async () => {
        const store = useUserStateStore();
        await store.init();

        const invalidData = { mood: 999 }; // v. error

        const result = await store.addState(invalidData as unknown as UserState);

        expect(result).toBeNull();
        expect(store.error).toBe('Пожалуйста, исправьте ошибки в форме');
        expect(Object.keys(store.validationErrors).length).toBeGreaterThan(0);
        expect(store.hasError(Object.keys(store.validationErrors)[0])).toBe(true);
    });

    it('updates a state successfully', async () => {
        const store = useUserStateStore();
        await store.init();
        store.states = [{ id: 1, date: '2026-05-01', mood: 5 } as unknown as UserState];

        mockRepository.update.mockResolvedValue(undefined);

        const result = await store.updateState(1, { mood: 9 });

        expect(result?.mood).toBe(9);
        expect(store.states[0].mood).toBe(9);
    });

    it('deletes a state and clears all states correctly', async () => {
        const store = useUserStateStore();
        await store.init();
        store.states = [
            { id: 1, date: '2026-05-01' } as unknown as UserState,
            { id: '2', date: '2026-05-02' } as unknown as UserState,
        ];

        mockRepository.delete.mockResolvedValue(undefined);
        const success = await store.deleteState(1);

        expect(success).toBe(true);
        expect(store.states.length).toBe(1);

        mockRepository.clearAll.mockResolvedValue(undefined);
        await store.clearAllStates();
        expect(store.states.length).toBe(0);
    });
});
