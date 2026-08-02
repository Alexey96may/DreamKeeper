import type { UserState } from '@/types/UserState';
import type { IDataService } from '@/types/databases/DataService';

import { BaseRepository } from '@/services/repositories/BaseRepository';

export class UserStateRepository extends BaseRepository<UserState> {
    constructor(dataService: IDataService) {
        super(dataService, 'userStates');
    }

    async getByDate(date: string): Promise<UserState | undefined> {
        const states = await this.getByIndex('date', date);
        return states[0];
    }

    async getByMonth(year: number, month: number): Promise<UserState[]> {
        const allStates = await this.getAll();
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        return allStates.filter((state) => state.date.startsWith(monthStr));
    }

    async getByMood(minMood: number): Promise<UserState[]> {
        return this.getByIndex('mood', minMood);
    }

    async getByEnergy(minEnergy: number): Promise<UserState[]> {
        return this.getByIndex('energy', minEnergy);
    }

    async getAverageMood(): Promise<number> {
        const allStates = await this.getAll();
        const withMood = allStates.filter((s) => s.mood !== undefined);
        if (withMood.length === 0) return 0;
        const sum = withMood.reduce((acc, s) => acc + (s.mood || 0), 0);
        return Number((sum / withMood.length).toFixed(1));
    }

    async getAverageEnergy(): Promise<number> {
        const allStates = await this.getAll();
        const withEnergy = allStates.filter((s) => s.energy !== undefined);
        if (withEnergy.length === 0) return 0;
        const sum = withEnergy.reduce((acc, s) => acc + (s.energy || 0), 0);
        return Number((sum / withEnergy.length).toFixed(1));
    }

    async updateOrCreate(date: string, data: Partial<UserState>): Promise<UserState> {
        const existing = await this.getByDate(date);

        if (existing?.id) {
            await this.update(existing.id, { ...data, date });
            const updated = await this.getById(existing.id);
            return updated!;
        } else {
            const newState = {
                ...data,
                date,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const id = await this.create(newState as Omit<UserState, 'id'>);
            const created = await this.getById(id);
            return created!;
        }
    }

    async getStats(): Promise<{
        total: number;
        avgMood: number;
        avgEnergy: number;
        avgFocus: number;
    }> {
        const allStates = await this.getAll();

        const withMood = allStates.filter((s) => s.mood !== undefined);
        const withEnergy = allStates.filter((s) => s.energy !== undefined);
        const withFocus = allStates.filter((s) => s.focus !== undefined);

        return {
            total: allStates.length,
            avgMood:
                withMood.length > 0
                    ? Number(
                          (
                              withMood.reduce((acc, s) => acc + (s.mood || 0), 0) / withMood.length
                          ).toFixed(1),
                      )
                    : 0,
            avgEnergy:
                withEnergy.length > 0
                    ? Number(
                          (
                              withEnergy.reduce((acc, s) => acc + (s.energy || 0), 0) /
                              withEnergy.length
                          ).toFixed(1),
                      )
                    : 0,
            avgFocus:
                withFocus.length > 0
                    ? Number(
                          (
                              withFocus.reduce((acc, s) => acc + (s.focus || 0), 0) /
                              withFocus.length
                          ).toFixed(1),
                      )
                    : 0,
        };
    }
}
