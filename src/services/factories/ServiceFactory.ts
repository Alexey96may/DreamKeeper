// src/services/factories/ServiceFactory.ts
import { IndexedDBService } from '../data/IndexedDBService';
import type { IDataService } from '../data/DataService';

export type ServiceType = 'indexeddb' | 'api' | 'capacitor';

export class ServiceFactory {
    private static instance: IDataService | null = null;

    static createService(type: ServiceType = 'indexeddb'): IDataService {
        // Возвращаем существующий экземпляр, если есть
        if (this.instance) {
            return this.instance;
        }

        switch (type) {
            case 'indexeddb':
                this.instance = new IndexedDBService();
                break;
            // case 'api':
            //   this.instance = new ApiService()
            //   break
            // case 'capacitor':
            //   this.instance = new CapacitorService()
            //   break
            default:
                throw new Error(`Unknown service type: ${type}`);
        }

        return this.instance;
    }

    static reset(): void {
        this.instance = null;
    }
}
