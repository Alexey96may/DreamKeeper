import type { StoreName } from '@/types/Store';
import type { IDataService } from '@/types/databases/DataService';

export abstract class BaseRepository<
    T extends { [P in K]: string | number },
    CreateDTO extends object = Omit<T, 'id'>,
    UpdateDTO = Partial<T>,
    K extends string = 'id',
> {
    protected dataService: IDataService;
    protected storeName: StoreName;
    protected primaryKeyField: K;

    constructor(dataService: IDataService, storeName: StoreName, primaryKeyField: K = 'id' as K) {
        this.dataService = dataService;
        this.storeName = storeName;
        this.primaryKeyField = primaryKeyField;
    }

    async getAll(): Promise<T[]> {
        return this.dataService.getAll<T>(this.storeName);
    }

    async getById(keyValue: T[K]): Promise<T | undefined> {
        return this.dataService.get<T>(this.storeName, keyValue);
    }

    async create(data: CreateDTO): Promise<T> {
        const result = await this.dataService.add<CreateDTO, T>(this.storeName, data);
        return result;
    }

    async update(keyValue: T[K], data: UpdateDTO): Promise<T> {
        const existing = await this.getById(keyValue);
        if (!existing) {
            throw new Error(`Record with id ${keyValue} in ${this.storeName} not found`);
        }

        const updatedPayload: T = {
            ...existing,
            ...data,
            [this.primaryKeyField]: keyValue,
        };

        await this.dataService.put(this.storeName, updatedPayload);
        return updatedPayload;
    }

    async delete(keyValue: T[K]): Promise<void> {
        await this.dataService.delete(this.storeName, keyValue);
    }

    async getByIndex(index: string, value: string | number): Promise<T[]> {
        return this.dataService.getByIndex<T>(this.storeName, index, value);
    }
}
