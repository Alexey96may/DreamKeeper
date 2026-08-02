import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Dream } from '@/types/Dream';
import type { IDataService } from '@/types/databases/DataService';
import { SleepRepository } from '@/services/repositories/SleepRepository';

describe('SleepRepository', () => {
    let repository: SleepRepository;
    let mockDataService: IDataService;

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

        repository = new SleepRepository(mockDataService);
    });

    describe('getAll', () => {
        it('returns all dreams', async () => {
            const mockDreams: Dream[] = [
                { id: 1, date: '2024-01-15', quality: 8 },
                { id: 2, date: '2024-01-16', quality: 6 },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(mockDreams);

            const result = await repository.getAll();

            expect(vi.mocked(mockDataService.getAll)).toHaveBeenCalledWith('dreams');
            expect(result).toEqual(mockDreams);
        });
    });

    describe('getByDate', () => {
        it('returns dreams for a specific date', async () => {
            const mockDreams: Dream[] = [
                { id: 1, date: '2024-01-15', quality: 8 },
                { id: 3, date: '2024-01-15', quality: 9 },
            ];
            vi.mocked(mockDataService.getByIndex).mockResolvedValue(mockDreams);

            const result = await repository.getByDate('2024-01-15');

            expect(vi.mocked(mockDataService.getByIndex)).toHaveBeenCalledWith(
                'dreams',
                'date',
                '2024-01-15',
            );
            expect(result).toEqual(mockDreams);
        });
    });

    describe('getByMonth', () => {
        it('filters dreams by month', async () => {
            const allDreams: Dream[] = [
                { id: 1, date: '2024-01-15', quality: 8 },
                { id: 2, date: '2024-01-16', quality: 6 },
                { id: 3, date: '2024-02-01', quality: 7 },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allDreams);

            const result = await repository.getByMonth(2024, 1);

            expect(result).toHaveLength(2);
            expect(result.every((d) => d.date.startsWith('2024-01'))).toBe(true);
        });
    });

    describe('getStats', () => {
        it('returns statistics about dreams', async () => {
            const allDreams: Dream[] = [
                { id: 1, date: '2024-01-15', quality: 8, type: 'lucid' },
                { id: 2, date: '2024-01-16', quality: 6, type: 'normal' },
                { id: 3, date: '2024-01-17', quality: 9, type: 'lucid' },
            ];
            vi.mocked(mockDataService.getAll).mockResolvedValue(allDreams);

            const stats = await repository.getStats();

            expect(stats).toEqual({
                total: 3,
                avgQuality: 7.7,
                byType: { lucid: 2, normal: 1 },
            });
        });
    });
});
