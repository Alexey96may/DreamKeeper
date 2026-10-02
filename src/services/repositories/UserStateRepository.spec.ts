import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserStateRepository } from '@/services/repositories/UserStateRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { UserState } from '@/types/UserState';

describe('UserStateRepository', () => {
    let repository: UserStateRepository;
    let mockDataService: Record<keyof IDataService, ReturnType<typeof vi.fn>>;

    const mockStates: UserState[] = [
        { id: 1, date: '2026-06-01', mood: 8, energy: 7, focus: 9 },
        { id: 2, date: '2026-06-15', mood: 6, energy: 5, focus: 6 },
        { id: 3, date: '2026-07-02', mood: 10, energy: 9, focus: 8 },
    ];

    beforeEach(() => {
        mockDataService = {
            init: vi.fn(),
            getAll: vi.fn().mockResolvedValue(mockStates),
            get: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            getByIndex: vi.fn(),
            clear: vi.fn(),
        };

        repository = new UserStateRepository(mockDataService as unknown as IDataService);
        vi.clearAllMocks();
    });

    it('gets state by specific date via getByDate', async () => {
        mockDataService.getByIndex.mockResolvedValueOnce([mockStates[0]]);

        const result = await repository.getByDate('2026-06-01');

        expect(mockDataService.getByIndex).toHaveBeenCalledWith('userStates', 'date', '2026-06-01');
        expect(result).toEqual(mockStates[0]);
    });

    it('returns undefined when getByDate finds nothing', async () => {
        mockDataService.getByIndex.mockResolvedValueOnce([]);

        const result = await repository.getByDate('2026-12-31');
        expect(result).toBeUndefined();
    });

    it('filters states by year and month via getByMonth', async () => {
        const result = await repository.getByMonth(2026, 6);

        expect(mockDataService.getAll).toHaveBeenCalled();
        expect(result.length).toBe(2);
        expect(result.map((s) => s.id)).toEqual([1, 2]);
    });

    it('gets states by mood index via getByMood', async () => {
        const filtered = [mockStates[0]];
        mockDataService.getByIndex.mockResolvedValueOnce(filtered);

        const result = await repository.getByMood(8);

        expect(mockDataService.getByIndex).toHaveBeenCalledWith('userStates', 'mood', 8);
        expect(result).toEqual(filtered);
    });

    it('gets states by energy index via getByEnergy', async () => {
        const filtered = [mockStates[1]];
        mockDataService.getByIndex.mockResolvedValueOnce(filtered);

        const result = await repository.getByEnergy(5);

        expect(mockDataService.getByIndex).toHaveBeenCalledWith('userStates', 'energy', 5);
        expect(result).toEqual(filtered);
    });

    it('calculates average mood correctly via getAverageMood', async () => {
        // Moods: 8, 6, 10 -> Sum: 24 / 3 = 8.0
        const avg = await repository.getAverageMood();
        expect(avg).toBe(8.0);
    });

    it('returns 0 average mood if no mood data exists', async () => {
        mockDataService.getAll.mockResolvedValueOnce([
            { id: 1, date: '2026-06-01' }, // без mood
        ] as UserState[]);

        const avg = await repository.getAverageMood();
        expect(avg).toBe(0);
    });

    it('calculates average energy correctly via getAverageEnergy', async () => {
        // Energies: 7, 5, 9 -> Sum: 21 / 3 = 7.0
        const avg = await repository.getAverageEnergy();
        expect(avg).toBe(7.0);
    });

    it('returns 0 average energy if no energy data exists', async () => {
        mockDataService.getAll.mockResolvedValueOnce([]);

        const avg = await repository.getAverageEnergy();
        expect(avg).toBe(0);
    });

    it('calculates comprehensive stats via getStats', async () => {
        // Moods: 8, 6, 10 -> Avg: 8.0
        // Energies: 7, 5, 9 -> Avg: 7.0
        // Focuses: 9, 6, 8 -> Sum: 23 / 3 = 7.7
        const stats = await repository.getStats();

        expect(stats).toEqual({
            total: 3,
            avgMood: 8.0,
            avgEnergy: 7.0,
            avgFocus: 7.7,
        });
    });

    it('handles empty stats gracefully', async () => {
        mockDataService.getAll.mockResolvedValueOnce([]);

        const stats = await repository.getStats();

        expect(stats).toEqual({
            total: 0,
            avgMood: 0,
            avgEnergy: 0,
            avgFocus: 0,
        });
    });
});
