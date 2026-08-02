import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSleepStore } from './sleep';
import type { Dream } from '@/types/Dream';

const mockRepository = {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByIndex: vi.fn(),
    getByDate: vi.fn(),
    getByMonth: vi.fn(),
    getByQuality: vi.fn(),
    getByType: vi.fn(),
    getAverageQuality: vi.fn(),
    getStats: vi.fn(),
};

const mockService = {
    init: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/services/factories/ServiceFactory', () => ({
    ServiceFactory: {
        createService: vi.fn(() => mockService),
    },
}));

vi.mock('@/services/repositories/SleepRepository', () => ({
    SleepRepository: vi.fn().mockImplementation(function () {
        return mockRepository;
    }),
}));

describe('SleepStore', () => {
    let store: ReturnType<typeof useSleepStore>;

    beforeEach(async () => {
        vi.clearAllMocks();

        mockRepository.getAll.mockResolvedValue([]);
        mockRepository.getById.mockResolvedValue(null);
        mockRepository.create.mockResolvedValue(1);
        mockRepository.update.mockResolvedValue(undefined);
        mockRepository.delete.mockResolvedValue(undefined);

        setActivePinia(createPinia());
        store = useSleepStore();

        await store.init();
    });

    describe('loadAll', () => {
        it('loads dreams and updates state', async () => {
            const dreams: Dream[] = [
                { id: 1, date: '2024-01-15', quality: 8, description: 'Dream 1' },
                { id: 2, date: '2024-01-16', quality: 6, description: 'Dream 2' },
            ];

            mockRepository.getAll.mockResolvedValueOnce(dreams);

            await store.loadAll();

            expect(mockRepository.getAll).toHaveBeenCalled();
            expect(store.sleeps).toEqual(dreams);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
        });

        it('handles loading error', async () => {
            const error = new Error('Network error');
            mockRepository.getAll.mockRejectedValueOnce(error);

            await store.loadAll();

            expect(store.sleeps).toEqual([]);
            expect(store.error).toBe('Network error');
            expect(store.loading).toBe(false);
        });
    });

    describe('addDream', () => {
        it('adds a new dream and returns it', async () => {
            const newDream = { date: '2024-01-17', quality: 9, description: 'New dream' };
            const savedDream = {
                ...newDream,
                id: 3,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            mockRepository.create.mockResolvedValueOnce(3);
            mockRepository.getById.mockResolvedValueOnce(savedDream as Dream);

            const result = await store.addDream(newDream);

            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(newDream));
            expect(mockRepository.getById).toHaveBeenCalledWith(3);
            expect(store.sleeps).toContainEqual(savedDream);
            expect(result).toEqual(savedDream);
        });

        it('returns null on creation error', async () => {
            mockRepository.create.mockRejectedValueOnce(new Error('DB error'));

            const result = await store.addDream({ date: '2024-01-17', quality: 9 });

            expect(result).toBeNull();
            expect(store.error).toBe('DB error');
        });
    });

    describe('updateDream', () => {
        it('updates a dream and returns the updated object', async () => {
            const existingDream: Dream = {
                id: 1,
                date: '2024-01-15',
                quality: 8,
                description: 'Old dream',
            };
            store.sleeps = [existingDream];

            const updateData = { quality: 9, description: 'Updated dream' };
            mockRepository.update.mockResolvedValueOnce(undefined);

            const result = await store.updateDream(1, updateData);

            expect(mockRepository.update).toHaveBeenCalledWith(
                1,
                expect.objectContaining(updateData),
            );
            expect(store.sleeps[0]).toMatchObject({ ...existingDream, ...updateData });
            expect(result).toMatchObject({ ...existingDream, ...updateData });
        });

        it('returns null if dream is not found', async () => {
            store.sleeps = [];
            mockRepository.update.mockResolvedValueOnce(undefined);

            const result = await store.updateDream(999, { quality: 10 });

            expect(result).toBeNull();
        });

        it('handles update error', async () => {
            store.sleeps = [{ id: 1, date: '2024-01-15', quality: 8 }];
            mockRepository.update.mockRejectedValueOnce(new Error('Update error'));

            const result = await store.updateDream(1, { quality: 10 });

            expect(result).toBeNull();
            expect(store.error).toBe('Update error');
        });
    });

    describe('deleteDream', () => {
        it('deletes a dream and returns true', async () => {
            store.sleeps = [{ id: 1, date: '2024-01-15', quality: 8 }];
            mockRepository.delete.mockResolvedValueOnce(undefined);

            const result = await store.deleteDream(1);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(store.sleeps).toHaveLength(0);
            expect(result).toBe(true);
        });

        it('returns false on delete error', async () => {
            store.sleeps = [{ id: 1, date: '2024-01-15', quality: 8 }];
            mockRepository.delete.mockRejectedValueOnce(new Error('Delete error'));

            const result = await store.deleteDream(1);

            expect(result).toBe(false);
            expect(store.error).toBe('Delete error');
        });
    });

    describe('getters', () => {
        beforeEach(() => {
            store.sleeps = [
                { id: 1, date: '2024-01-15', quality: 8, type: 'lucid' },
                { id: 2, date: '2024-01-16', quality: 6, type: 'normal' },
                { id: 3, date: '2024-01-17', quality: 9, type: 'lucid' },
                { id: 4, date: '2024-02-01', quality: 7, type: 'normal' },
            ];
        });

        it('totalDreams returns the total count', () => {
            expect(store.totalDreams).toBe(4);
        });

        it('averageQuality calculates the average quality', () => {
            expect(store.averageQuality).toBe(7.5);
        });

        it('getDreamsByDate filters by date', () => {
            const dreams = store.getDreamsByDate('2024-01-15');
            expect(dreams).toHaveLength(1);
            expect(dreams[0].id).toBe(1);
        });

        it('getDreamsByMonth filters by month', () => {
            const dreams = store.getDreamsByMonth(2024, 1);
            expect(dreams).toHaveLength(3);
        });

        it('getMonthStats returns statistics for a month', () => {
            const stats = store.getMonthStats(2024, 1);
            expect(stats).toEqual({
                total: 3,
                avgQuality: 7.7,
                types: { lucid: 2, normal: 1 },
                dreams: expect.any(Array),
            });
        });

        it('getMonthStats returns null if no data for the month', () => {
            const stats = store.getMonthStats(2023, 12);
            expect(stats).toBeNull();
        });

        it('getDreamsByQuality filters by minimum quality', () => {
            const dreams = store.getDreamsByQuality(8);
            expect(dreams).toHaveLength(2);
            expect(dreams.every((d) => (d.quality ?? 0) >= 8)).toBe(true);
        });
    });
});
