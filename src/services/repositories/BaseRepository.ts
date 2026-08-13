import type { StoreName } from '@/types/Store';
import type { IDataService } from '@/types/databases/DataService';

export abstract class BaseRepository<T, CreateDTO = Partial<T>, Result = number> {
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

    async create(data: CreateDTO): Promise<Result> {
        return this.dataService.add(this.storeName, data) as Promise<Result>;
    }

    async update(id: number, data: Partial<T>): Promise<void> {
        const existing = await this.getById(id);
        if (!existing) {
            throw new Error(`Record with id ${id} in ${this.storeName} not found`);
        }
        await this.dataService.put(this.storeName, { ...existing, ...data, id });
    }

    async delete(id: number): Promise<void> {
        await this.dataService.delete(this.storeName, id);
    }

    async getByIndex(index: string, value: string | number): Promise<T[]> {
        return this.dataService.getByIndex<T>(this.storeName, index, value);
    }
}
