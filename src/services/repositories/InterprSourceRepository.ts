import { BaseRepository } from './BaseRepository';
import { slugify } from '@/utils/routes';
import type { IDataService } from '@/types/databases/DataService';
import type { InterprSource } from '@/types/Interpretation/Source';

export type InterprSourceWrite = Omit<InterprSource, 'createdAt' | 'updatedAt'>;

export class InterprSourceRepository extends BaseRepository<
    InterprSource,
    InterprSourceWrite,
    Partial<InterprSourceWrite>
> {
    constructor(dataService: IDataService) {
        super(dataService, 'interprSources');
    }

    async getByType(type: string): Promise<InterprSource[]> {
        try {
            return await this.getByIndex('type', type);
        } catch {
            const all = await this.getAll();
            return all.filter((s) => s.type === type);
        }
    }

    override async create(sourceData: InterprSourceWrite): Promise<InterprSource> {
        const now = new Date().toISOString();
        const id = sourceData.id || slugify(sourceData.title);

        const payload: InterprSource = {
            ...sourceData,
            id,
            createdAt: now,
            updatedAt: now,
        };

        return await this.dataService.add(this.storeName, payload);
    }

    override async update(
        id: string,
        sourceData: Partial<InterprSourceWrite>,
    ): Promise<InterprSource> {
        const existing = await this.getById(id as string);
        if (!existing) {
            throw new Error(`Источник с id ${id} не найден`);
        }

        const updatedPayload: InterprSource = {
            ...existing,
            ...sourceData,
            updatedAt: new Date().toISOString(),
        };

        await this.dataService.put(this.storeName, updatedPayload);
        return updatedPayload;
    }
}
