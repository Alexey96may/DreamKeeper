// src/plugins/indexeddb.ts
import type { App, InjectionKey } from 'vue';
import { IndexedDBService } from '@/services/data/IndexedDBService';
import type { IDataService } from '@/types/databases/DataService';

export const DB_KEY: InjectionKey<IDataService> = Symbol('db');

export default {
    install(app: App): void {
        const dbService = new IndexedDBService('DreamKeeperDB', 1);

        app.config.globalProperties.$db = dbService;
        app.provide(DB_KEY, dbService);
    },
};

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $db: IDataService;
    }
}
