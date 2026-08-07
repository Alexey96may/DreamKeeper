import type { Dream } from '@/types/Dream';
import type { IDataService } from '@/types/databases/DataService';

import { BaseRepository } from './BaseRepository';

export class SleepRepository extends BaseRepository<Dream> {
    constructor(dataService: IDataService) {
        super(dataService, 'dreams');
    }

    async getByDate(date: string): Promise<Dream[]> {
        return this.getByIndex('date', date);
    }

    async getByMonth(year: number, month: number): Promise<Dream[]> {
        const allDreams = await this.getAll();
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        return allDreams.filter((dream) => dream.date.startsWith(monthStr));
    }

    async getByQuality(minQuality: number): Promise<Dream[]> {
        const allDreams = await this.getAll();
        return allDreams.filter((dream) => (dream.quality || 0) >= minQuality);
    }

    async getByType(type: string): Promise<Dream[]> {
        return this.getByIndex('type', type);
    }

    async getAverageQuality(): Promise<number> {
        const allDreams = await this.getAll();
        if (allDreams.length === 0) return 0;
        const sum = allDreams.reduce((acc, dream) => acc + (dream.quality || 0), 0);
        return Number((sum / allDreams.length).toFixed(1));
    }

    async getStats(): Promise<{
        total: number;
        avgQuality: number;
        byType: Record<string, number>;
    }> {
        const allDreams = await this.getAll();

        const byType = allDreams.reduce(
            (acc, dream) => {
                const type = dream?.type || 'normal';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return {
            total: allDreams.length,
            avgQuality: await this.getAverageQuality(),
            byType,
        };
    }
}
