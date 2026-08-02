// src/services/factories/ServiceFactory.ts
import type { IDataService, ServiceType } from '@/types/databases/DataService';

import { IndexedDBService } from '@/services/data/IndexedDBService';

export class ServiceFactory {
    private static instance: IDataService | null = null;

    static createService(type: ServiceType = 'indexeddb'): IDataService {
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
