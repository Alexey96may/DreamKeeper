import { BaseRepository } from './BaseRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { Interpretation } from '@/types/Interpretation/Interpretation';

export type InterpretationWrite = Omit<Interpretation, 'id' | 'createdAt' | 'updatedAt'>;

export class InterpretationRepository extends BaseRepository<
    Interpretation,
    InterpretationWrite,
    Partial<InterpretationWrite>
> {
    constructor(dataService: IDataService) {
        super(dataService, 'dreamInterpretations', 'id');
    }

    async getBySymbolId(symbolId: number | string): Promise<Interpretation[]> {
        return this.getByIndex('symbolId', symbolId);
    }

    async getBySourceId(sourceId: number): Promise<Interpretation[]> {
        return this.getByIndex('sourceId', sourceId);
    }

    override async create(data: InterpretationWrite): Promise<Interpretation> {
        const now = new Date().toISOString();

        const payload = {
            ...data,
            createdAt: now,
            updatedAt: now,
        } as Interpretation;

        return await this.dataService.add(this.storeName, payload);
    }

    override async update(id: string, data: Partial<InterpretationWrite>): Promise<Interpretation> {
        const existing = await this.getById(id);
        if (!existing) {
            throw new Error(`Интерпретация с id ${id} не найдена в ${this.storeName}`);
        }

        const updatedPayload: Interpretation = {
            ...existing,
            ...data,
            updatedAt: new Date().toISOString(),
        };

        await this.dataService.put(this.storeName, updatedPayload);
        return updatedPayload;
    }
}
