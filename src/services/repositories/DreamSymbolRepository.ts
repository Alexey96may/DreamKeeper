import { BaseRepository } from './BaseRepository';
import { slugify } from '@/utils/routes';
import type { IDataService } from '@/types/databases/DataService';
import type { DreamSymbol } from '@/types/Interpretation/DreamSymbol'; // Путь к твоим типам

export type DreamSymbolWrite = Omit<DreamSymbol, 'createdAt' | 'updatedAt'>;

export class DreamSymbolRepository extends BaseRepository<
    DreamSymbol,
    DreamSymbolWrite,
    Partial<DreamSymbolWrite>,
    'tag'
> {
    constructor(dataService: IDataService) {
        super(dataService, 'dream_symbols');
    }

    async getByTag(tag: string): Promise<DreamSymbol | undefined> {
        return this.getById(tag as string); // Если getById в базе принимает string/number
    }

    private async generateUniqueTag(title: string, excludeTag?: string): Promise<string> {
        const baseSlug = slugify(title);
        let tag = baseSlug;
        let counter = 1;

        while (true) {
            const existing = await this.getByTag(tag);
            if (!existing || existing.tag === excludeTag) {
                break;
            }
            tag = `${baseSlug}-${counter}`;
            counter++;
        }
        return tag;
    }

    override async create(symbolData: DreamSymbolWrite): Promise<DreamSymbol> {
        const now = new Date().toISOString();
        const tag = symbolData.tag || (await this.generateUniqueTag(symbolData.title));

        const payload: DreamSymbol = {
            ...symbolData,
            tag,
            createdAt: now,
            updatedAt: now,
        };

        return await this.dataService.add(this.storeName, payload);
    }

    override async update(
        tag: string,
        symbolData: Partial<DreamSymbolWrite>,
    ): Promise<DreamSymbol> {
        const existing = await this.getByTag(tag);
        if (!existing) {
            throw new Error(`Символ с тегом ${tag} не найден`);
        }

        let newTag = existing.tag;
        if (symbolData.title && symbolData.title !== existing.title && !symbolData.tag) {
            newTag = await this.generateUniqueTag(symbolData.title, tag);
        }

        const updatedPayload: DreamSymbol = {
            ...existing,
            ...symbolData,
            tag: newTag,
            updatedAt: new Date().toISOString(),
        };

        // Если тег изменился, старый нужно удалить, а новый записать (или использовать put, если IndexedDB обновит ключ)
        if (newTag !== existing.tag) {
            await this.delete(tag as string);
        }

        await this.dataService.put(this.storeName, updatedPayload);
        return updatedPayload;
    }
}
