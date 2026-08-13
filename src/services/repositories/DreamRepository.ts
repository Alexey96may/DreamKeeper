import { BaseRepository } from './BaseRepository';
import { slugify } from '@/utils/routes';
import type { IDataService } from '@/types/databases/DataService';
import type { Dream, DreamWrite } from '@/types/Dream';

/**
 * Репозиторий для работы со снами.
 * Наследуется от BaseRepository, определяя:
 *  - T: Dream
 *  - CreateDTO: DreamWrite
 *  - Result: Dream (метод create возвращает готовый созданный объект)
 */
export class DreamRepository extends BaseRepository<Dream, DreamWrite, Dream> {
    constructor(dataService: IDataService) {
        super(dataService, 'dreams');
    }

    /**
     * Поиск записи сна по уникальному slug
     */
    async getBySlug(slug: string): Promise<Dream | undefined> {
        try {
            const results = await this.getByIndex('slug', slug);
            return results[0] || undefined;
        } catch (e) {
            // Фоллбек на случай отсутствия индекса в IndexedDB
            console.warn('Index "slug" unavailable, fallback to memory scan', e);
            const all = await this.getAll();
            return all.find((d) => d.slug === slug);
        }
    }

    /**
     * Генерация уникального slug
     */
    private async generateUniqueSlug(title?: string, date?: string): Promise<string> {
        const baseText = title?.trim() || `dream-${date || 'entry'}`;
        const baseSlug = slugify(baseText);

        let slug = baseSlug;
        let counter = 1;

        while (await this.getBySlug(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    override async create(dreamData: DreamWrite): Promise<Dream> {
        const now = new Date().toISOString();

        // Учитываем dreamData.slug, если сид его уже содержит
        const slug = await this.generateUniqueSlug(dreamData.title, dreamData.date);

        const payload = {
            ...dreamData,
            slug,
            createdAt: now,
            updatedAt: now,
        };

        const id = await this.dataService.add(this.storeName, payload);

        return {
            ...payload,
            id,
        } as Dream;
    }
}
