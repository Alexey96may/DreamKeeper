import type { StoreName } from '@/types/Store';
import type { IDataService } from '@/types/databases/DataService';

export abstract class BaseRepository<
    T extends { id: number },
    CreateDTO extends object = Omit<T, 'id'>,
    UpdateDTO = Partial<T>,
> {
    protected dataService: IDataService;
    protected storeName: StoreName;

    constructor(dataService: IDataService, storeName: StoreName) {
        this.dataService = dataService;
        this.storeName = storeName;
    }

    async getAll(): Promise<T[]> {
        return this.dataService.getAll<T>(this.storeName);
    }

    async getById(id: number): Promise<T | undefined> {
        return this.dataService.get<T>(this.storeName, id);
    }

    async create(data: CreateDTO): Promise<T> {
        const result = await this.dataService.add<CreateDTO, T>(this.storeName, data);
        return result;
    }

    async update(id: number, data: UpdateDTO): Promise<T> {
        const existing = await this.getById(id);
        if (!existing) {
            throw new Error(`Record with id ${id} in ${this.storeName} not found`);
        }

        const updatedPayload: T = {
            ...existing,
            ...data,
            id,
        };

        await this.dataService.put(this.storeName, updatedPayload);
        return updatedPayload;
    }

    async delete(id: number): Promise<void> {
        await this.dataService.delete(this.storeName, id);
    }

    async getByIndex(index: string, value: string | number): Promise<T[]> {
        return this.dataService.getByIndex<T>(this.storeName, index, value);
    }
}
