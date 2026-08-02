import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUserStateStore } from '@/stores/modules/userState';
import type { UserState } from '@/types/UserState';

const mockRepository = {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByIndex: vi.fn(),
    getByDate: vi.fn(),
    getByMonth: vi.fn(),
    getByMood: vi.fn(),
    getByEnergy: vi.fn(),
    getAverageMood: vi.fn(),
    getAverageEnergy: vi.fn(),
    getStats: vi.fn(),
    updateOrCreate: vi.fn(),
};

const mockService = {
    init: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/services/factories/ServiceFactory', () => ({
    ServiceFactory: {
        createService: vi.fn(() => mockService),
    },
}));

vi.mock('@/services/repositories/UserStateRepository', () => ({
    UserStateRepository: vi.fn().mockImplementation(function () {
        return mockRepository;
    }),
}));

describe('UserStateStore', () => {
    let store: ReturnType<typeof useUserStateStore>;

    beforeEach(async () => {
        vi.clearAllMocks();

        mockRepository.getAll.mockResolvedValue([]);
        mockRepository.getById.mockResolvedValue(undefined);
        mockRepository.create.mockResolvedValue(1);
        mockRepository.update.mockResolvedValue(undefined);
        mockRepository.delete.mockResolvedValue(undefined);

        setActivePinia(createPinia());
        store = useUserStateStore();

        await store.init();
    });

    describe('loadAll', () => {
        it('loads states and updates state', async () => {
            const states: UserState[] = [
                { id: 1, date: '2024-01-15', mood: 7, energy: 6, focus: 8 },
                { id: 2, date: '2024-01-16', mood: 8, energy: 7, focus: 9 },
            ];
            mockRepository.getAll.mockResolvedValueOnce(states);

            await store.loadAll();

            expect(mockRepository.getAll).toHaveBeenCalled();
            expect(store.states).toEqual(states);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
        });

        it('handles loading error', async () => {
            const error = new Error('Network error');
            mockRepository.getAll.mockRejectedValueOnce(error);

            await store.loadAll();

            expect(store.states).toEqual([]);
            expect(store.error).toBe('Network error');
            expect(store.loading).toBe(false);
        });
    });

    describe('addState', () => {
        it('adds a new state and returns it', async () => {
            const newState = { date: '2024-01-17', mood: 9, energy: 8, focus: 9 };
            const savedState = {
                ...newState,
                id: 3,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockRepository.create.mockResolvedValueOnce(3);
            mockRepository.getById.mockResolvedValueOnce(savedState as UserState);

            const result = await store.addState(newState);

            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(newState));
            expect(mockRepository.getById).toHaveBeenCalledWith(3);
            expect(store.states).toContainEqual(savedState);
            expect(result).toEqual(savedState);
        });

        it('returns null on creation error', async () => {
            mockRepository.create.mockRejectedValueOnce(new Error('DB error'));

            const result = await store.addState({ date: '2024-01-17', mood: 9 });

            expect(result).toBeNull();
            expect(store.error).toBe('DB error');
        });
    });

    describe('updateState', () => {
        it('updates a state and returns the updated object', async () => {
            const existingState: UserState = {
                id: 1,
                date: '2024-01-15',
                mood: 7,
                energy: 6,
                focus: 8,
            };
            store.states = [existingState];

            const updateData = { mood: 9, energy: 8 };
            mockRepository.update.mockResolvedValueOnce(undefined);

            const result = await store.updateState(1, updateData);

            expect(mockRepository.update).toHaveBeenCalledWith(
                1,
                expect.objectContaining(updateData),
            );
            expect(store.states[0]).toMatchObject({ ...existingState, ...updateData });
            expect(result).toMatchObject({ ...existingState, ...updateData });
        });

        it('returns null if state is not found', async () => {
            store.states = [];
            mockRepository.update.mockResolvedValueOnce(undefined);

            const result = await store.updateState(999, { mood: 10 });

            expect(result).toBeNull();
        });

        it('handles update error', async () => {
            store.states = [{ id: 1, date: '2024-01-15', mood: 7 }];
            mockRepository.update.mockRejectedValueOnce(new Error('Update error'));

            const result = await store.updateState(1, { mood: 10 });

            expect(result).toBeNull();
            expect(store.error).toBe('Update error');
        });
    });

    describe('deleteState', () => {
        it('deletes a state and returns true', async () => {
            store.states = [{ id: 1, date: '2024-01-15', mood: 7 }];
            mockRepository.delete.mockResolvedValueOnce(undefined);

            const result = await store.deleteState(1);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(store.states).toHaveLength(0);
            expect(result).toBe(true);
        });

        it('returns false on delete error', async () => {
            store.states = [{ id: 1, date: '2024-01-15', mood: 7 }];
            mockRepository.delete.mockRejectedValueOnce(new Error('Delete error'));

            const result = await store.deleteState(1);

            expect(result).toBe(false);
            expect(store.error).toBe('Delete error');
        });
    });

    describe('updateOrCreateState', () => {
        it('updates an existing state', async () => {
            const existingState: UserState = {
                id: 1,
                date: '2024-01-15',
                mood: 7,
                energy: 6,
                focus: 8,
            };
            store.states = [existingState];

            const updateData = { mood: 9, energy: 8 };
            mockRepository.update.mockResolvedValueOnce(undefined);

            const result = await store.updateOrCreateState('2024-01-15', updateData);

            expect(mockRepository.update).toHaveBeenCalledWith(
                1,
                expect.objectContaining(updateData),
            );
            expect(store.states[0]).toMatchObject({ ...existingState, ...updateData });
            expect(result).toMatchObject({ ...existingState, ...updateData });
        });

        it('creates a new state if it does not exist', async () => {
            store.states = [];
            const newState = { date: '2024-01-15', mood: 7, energy: 6, focus: 8 };
            const savedState = {
                ...newState,
                id: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockRepository.create.mockResolvedValueOnce(1);
            mockRepository.getById.mockResolvedValueOnce(savedState as UserState);

            const result = await store.updateOrCreateState('2024-01-15', newState);

            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(newState));
            expect(store.states).toContainEqual(savedState);
            expect(result).toEqual(savedState);
        });
    });

    describe('getters', () => {
        beforeEach(() => {
            store.states = [
                { id: 1, date: '2024-01-15', mood: 7, energy: 6, focus: 8 },
                { id: 2, date: '2024-01-16', mood: 8, energy: 7, focus: 9 },
                { id: 3, date: '2024-01-17', mood: 6, energy: 5, focus: 7 },
                { id: 4, date: '2024-02-01', mood: 9, energy: 8, focus: 8 },
            ];
        });

        it('totalStates returns the total count', () => {
            expect(store.totalStates).toBe(4);
        });

        it('getStateByDate filters by date', () => {
            const state = store.getStateByDate('2024-01-15');
            expect(state).toBeDefined();
            expect(state?.id).toBe(1);
        });

        it('getStatesByMonth filters by month', () => {
            const states = store.getStatesByMonth(2024, 1);
            expect(states).toHaveLength(3);
            expect(states.every((s) => s.date.startsWith('2024-01'))).toBe(true);
        });

        it('getAverageMood calculates average mood', () => {
            expect(store.getAverageMood()).toBe(7.5);
        });

        it('getAverageMood returns 0 if no states with mood', () => {
            store.states = [{ id: 1, date: '2024-01-15' }];
            expect(store.getAverageMood()).toBe(0);
        });

        it('getAverageEnergy calculates average energy', () => {
            expect(store.getAverageEnergy()).toBe(6.5);
        });

        it('getAverageEnergy returns 0 if no states with energy', () => {
            store.states = [{ id: 1, date: '2024-01-15' }];
            expect(store.getAverageEnergy()).toBe(0);
        });

        it('getMonthStats returns statistics for a month', () => {
            const stats = store.getMonthStats(2024, 1);
            expect(stats).toEqual({
                total: 3,
                avgMood: 7.0,
                avgEnergy: 6.0,
                avgFocus: 8.0,
            });
        });

        it('getMonthStats returns null if no data for the month', () => {
            const stats = store.getMonthStats(2023, 12);
            expect(stats).toBeNull();
        });
    });
});
