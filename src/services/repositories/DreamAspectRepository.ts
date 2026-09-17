import { BaseRepository } from './BaseRepository';
import { slugify } from '@/utils/routes';
import type { IDataService } from '@/types/databases/DataService';
import type { DreamAspect } from '@/types/Interpretation/DreamAspect';

export type DreamAspectWrite = Omit<DreamAspect, 'id' | 'createdAt' | 'updatedAt'>;

export class DreamAspectRepository extends BaseRepository<
    DreamAspect,
    DreamAspectWrite & { id?: string },
    Partial<DreamAspectWrite>
> {
    constructor(dataService: IDataService) {
        super(dataService, 'dream_aspects');
    }

    /**
     * Получить все аспекты для конкретного символа
     */
    async getBySymbolTag(symbolTag: string): Promise<DreamAspect[]> {
        try {
            return await this.getByIndex('symbolTag', symbolTag);
        } catch {
            const all = await this.getAll();
            return all.filter((aspect) => aspect.symbolTag === symbolTag);
        }
    }

    override async create(aspectData: DreamAspectWrite & { id?: string }): Promise<DreamAspect> {
        const now = new Date().toISOString();
        const baseId = aspectData.id || `${aspectData.symbolTag}-${slugify(aspectData.title)}`;

        let id = baseId;
        let counter = 1;
        while (await this.getById(id as string)) {
            id = `${baseId}-${counter}`;
            counter++;
        }

        const payload: DreamAspect = {
            ...aspectData,
            id,
            createdAt: now,
            updatedAt: now,
        };

        return await this.dataService.add(this.storeName, payload);
    }

    override async update(id: string, aspectData: Partial<DreamAspectWrite>): Promise<DreamAspect> {
        const existing = await this.getById(id as string);
        if (!existing) {
            throw new Error(`Аспект с id ${id} не найден`);
        }

        const updatedPayload: DreamAspect = {
            ...existing,
            ...aspectData,
            updatedAt: new Date().toISOString(),
        };

        await this.dataService.put(this.storeName, updatedPayload);
        return updatedPayload;
    }
}
