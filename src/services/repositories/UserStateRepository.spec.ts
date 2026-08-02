import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UserState } from '@/types/UserState';
import type { IDataService } from '@/types/databases/DataService';
import { UserStateRepository } from '@/services/repositories/UserStateRepository';

describe('UserStateRepository', () => {
    let mockDataService: IDataService;
    let repository: UserStateRepository;

    beforeEach(() => {
        mockDataService = {
            init: vi.fn<() => void>().mockResolvedValue(undefined),
            getAll: vi.fn<() => void>(),
            get: vi.fn<() => void>(),
            add: vi.fn<() => void>(),
            put: vi.fn<() => void>(),
            delete: vi.fn<() => void>(),
            getByIndex: vi.fn<() => void>(),
        } as unknown as IDataService;

        repository = new UserStateRepository(mockDataService);
    });

    describe('getByDate', () => {
        it('returns state by date', async () => {
            const expectedState: UserState = {
                id: 1,
                date: '2024-01-15',
                mood: 7,
                energy: 6,
                focus: 8,
            };
            vi.mocked(mockDataService.getByIndex).mockResolvedValue([expectedState]);

            const result = await repository.getByDate('2024-01-15');

            expect(vi.mocked(mockDataService.getByIndex)).toHaveBeenCalledWith(
                'userStates',
                'date',
                '2024-01-15',
            );
            expect(result).toEqual(expectedState);
        });

        it('returns undefined if state not found', async () => {
            vi.mocked(mockDataService.getByIndex).mockResolvedValue([]);

            const result = await repository.getByDate('2024-01-15');

            expect(result).toBeUndefined();
        });
    });

    describe('getByMonth', () => {
        it('returns states for a month', async () => {
            const allStates: UserState[] = [
                { id: 1, date: '2024-01-15', mood: 7 },
                { id: 2, date: '2024-01-16', mood: 8 },
                { id: 3, date: '2024-02-01', mood: 6 },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allStates);

            const result = await repository.getByMonth(2024, 1);

            expect(result).toHaveLength(2);
            expect(result.every((s) => s.date.startsWith('2024-01'))).toBe(true);
        });

        it('returns empty array if no records for month', async () => {
            vi.mocked(mockDataService.getAll).mockResolvedValue([]);

            const result = await repository.getByMonth(2024, 1);

            expect(result).toEqual([]);
        });
    });

    describe('getAverageMood', () => {
        it('calculates average mood', async () => {
            const allStates: UserState[] = [
                { id: 1, date: '2024-01-15', mood: 7 },
                { id: 2, date: '2024-01-16', mood: 8 },
                { id: 3, date: '2024-01-17', mood: 9 },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allStates);

            const result = await repository.getAverageMood();

            expect(result).toBe(8.0);
        });

        it('returns 0 if no states with mood', async () => {
            const allStates: UserState[] = [
                { id: 1, date: '2024-01-15' },
                { id: 2, date: '2024-01-16' },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allStates);

            const result = await repository.getAverageMood();

            expect(result).toBe(0);
        });
    });

    describe('getAverageEnergy', () => {
        it('calculates average energy', async () => {
            const allStates: UserState[] = [
                { id: 1, date: '2024-01-15', energy: 6 },
                { id: 2, date: '2024-01-16', energy: 7 },
                { id: 3, date: '2024-01-17', energy: 8 },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allStates);

            const result = await repository.getAverageEnergy();

            expect(result).toBe(7.0);
        });

        it('returns 0 if no states with energy', async () => {
            vi.mocked(mockDataService.getAll).mockResolvedValue([]);

            const result = await repository.getAverageEnergy();

            expect(result).toBe(0);
        });
    });

    describe('updateOrCreate', () => {
        it('updates an existing state', async () => {
            const existingState: UserState = {
                id: 1,
                date: '2024-01-15',
                mood: 5,
                energy: 5,
                createdAt: '2024-01-15T10:00:00.000Z',
                updatedAt: '2024-01-15T10:00:00.000Z',
            };

            const updateData: Partial<UserState> = { mood: 8, energy: 7 };

            const updatedState = {
                ...existingState,
                ...updateData,
                updatedAt: expect.any(String),
            };

            vi.mocked(mockDataService.getByIndex).mockResolvedValue([existingState]);
            vi.mocked(mockDataService.put).mockResolvedValue(1);
            vi.mocked(mockDataService.get).mockResolvedValue({
                ...existingState,
                ...updateData,
                updatedAt: new Date().toISOString(),
            });

            const result = await repository.updateOrCreate('2024-01-15', updateData);

            expect(vi.mocked(mockDataService.put)).toHaveBeenCalledWith('userStates', {
                ...existingState,
                ...updateData,
                updatedAt: expect.any(String),
            });

            expect(result).toEqual(updatedState);
        });

        it('creates a new state if it does not exist', async () => {
            const createData: Partial<UserState> = { mood: 7, energy: 6 };

            vi.mocked(mockDataService.getByIndex).mockResolvedValue([]);
            vi.mocked(mockDataService.add).mockResolvedValue(1);
            vi.mocked(mockDataService.get).mockResolvedValue({
                id: 1,
                date: '2024-01-15',
                ...createData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            const result = await repository.updateOrCreate('2024-01-15', createData);

            expect(vi.mocked(mockDataService.add)).toHaveBeenCalledWith('userStates', {
                ...createData,
                date: '2024-01-15',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
            expect(result.mood).toBe(7);
            expect(result.energy).toBe(6);
        });
    });

    describe('getStats', () => {
        it('returns full statistics', async () => {
            const allStates: UserState[] = [
                { id: 1, date: '2024-01-15', mood: 7, energy: 6, focus: 8 },
                { id: 2, date: '2024-01-16', mood: 8, energy: 7, focus: 9 },
                { id: 3, date: '2024-01-17', mood: 6, energy: 5, focus: 7 },
                { id: 4, date: '2024-01-18' }, // no mood, energy, focus
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allStates);

            const stats = await repository.getStats();

            expect(stats).toEqual({
                total: 4,
                avgMood: 7.0,
                avgEnergy: 6.0,
                avgFocus: 8.0,
            });
        });

        it('returns 0 for averages when no data', async () => {
            vi.mocked(mockDataService.getAll).mockResolvedValue([]);

            const stats = await repository.getStats();

            expect(stats).toEqual({
                total: 0,
                avgMood: 0,
                avgEnergy: 0,
                avgFocus: 0,
            });
        });

        it('handles partial data correctly', async () => {
            const allStates: UserState[] = [
                { id: 1, date: '2024-01-15', mood: 7 },
                { id: 2, date: '2024-01-16', energy: 6 },
                { id: 3, date: '2024-01-17', focus: 8 },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allStates);

            const stats = await repository.getStats();

            expect(stats).toEqual({
                total: 3,
                avgMood: 7.0,
                avgEnergy: 6.0,
                avgFocus: 8.0,
            });
        });
    });

    describe('Integration scenarios', () => {
        it('getByMood uses getByIndex', async () => {
            const expectedStates: UserState[] = [{ id: 1, date: '2024-01-15', mood: 7 }];
            vi.mocked(mockDataService.getByIndex).mockResolvedValue(expectedStates);

            const result = await repository.getByMood(7);

            expect(vi.mocked(mockDataService.getByIndex)).toHaveBeenCalledWith(
                'userStates',
                'mood',
                7,
            );
            expect(result).toEqual(expectedStates);
        });

        it('getByEnergy uses getByIndex', async () => {
            const expectedStates: UserState[] = [{ id: 1, date: '2024-01-15', energy: 6 }];
            vi.mocked(mockDataService.getByIndex).mockResolvedValue(expectedStates);

            const result = await repository.getByEnergy(6);

            expect(vi.mocked(mockDataService.getByIndex)).toHaveBeenCalledWith(
                'userStates',
                'energy',
                6,
            );
            expect(result).toEqual(expectedStates);
        });
    });
});
