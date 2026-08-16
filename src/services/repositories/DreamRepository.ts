import { BaseRepository } from './BaseRepository';
import { slugify } from '@/utils/routes';
import type { IDataService } from '@/types/databases/DataService';
import type { Dream, DreamWrite } from '@/types/Dream';

/**
 * Репозиторий для работы со снами.
 * Наследуется от BaseRepository, определяя:
 *  - T: Dream
 *  - CreateDTO: DreamWrite
 *  - UpdateDTO: Partial<DreamWrite>
 */
export class DreamRepository extends BaseRepository<Dream, DreamWrite, Partial<DreamWrite>> {
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
     * Генерация уникального slug.
     * @param excludeId - ID текущего сна, который нужно игнорировать при проверке уникальности (при обновлении)
     */
    private async generateUniqueSlug(
        title?: string,
        date?: string,
        excludeId?: number,
    ): Promise<string> {
        const baseText = title?.trim() || `dream-${date || 'entry'}`;
        const baseSlug = slugify(baseText);

        let slug = baseSlug;
        let counter = 1;

        while (true) {
            const existing = await this.getBySlug(slug);
            // Если слага нет ИЛИ найденный сон — это наш же обновляемый сон, слаг уникален
            if (!existing || existing.id === excludeId) {
                break;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    override async create(dreamData: DreamWrite): Promise<Dream> {
        const now = new Date().toISOString();

        const slug = await this.generateUniqueSlug(dreamData.title, dreamData.date);

        const payload = {
            ...dreamData,
            slug,
            createdAt: now,
            updatedAt: now,
        };

        const dream = await this.dataService.add(this.storeName, payload);

        return dream;
    }

    /**
     * Обновление сна по ID в IndexedDB
     */
    override async update(id: number, dreamData: Partial<DreamWrite>): Promise<Dream> {
        // 1. Получаем текущую запись из базы
        const existing = await this.getById(id);
        if (!existing) {
            throw new Error(`Сон с id ${id} не найден`);
        }

        // 2. Проверяем, изменились ли заголовок или дата
        let newSlug = existing.slug;
        const newTitle = dreamData.title ?? existing.title;
        const newDate = dreamData.date ?? existing.date;

        if (dreamData.title !== undefined || dreamData.date !== undefined) {
            if (newTitle !== existing.title || newDate !== existing.date) {
                // Передаем id, чтобы игнорировать текущую запись при проверке уникальности
                newSlug = await this.generateUniqueSlug(newTitle, newDate, id);
            }
        }

        // 3. Формируем финальный payload для сохранения
        const updatedPayload: Dream = {
            ...existing,
            ...dreamData,
            slug: newSlug,
            updatedAt: new Date().toISOString(),
        };

        // 4. Записываем в IndexedDB через dataService
        await this.dataService.put(this.storeName, updatedPayload);

        return updatedPayload;
    }
}
