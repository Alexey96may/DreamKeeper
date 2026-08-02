// src/plugins/indexeddb.ts
import type { App, InjectionKey } from 'vue';
import { IndexedDBService } from '@/services/data/IndexedDBService';
import type { IDatabaseService } from '@/types/databases/IndexedDB';

export const DB_KEY: InjectionKey<IDatabaseService> = Symbol('db');

export default {
    install(app: App): void {
        const dbService = new IndexedDBService('DreamKeeperDB', 1);

        app.config.globalProperties.$db = dbService;
        app.provide(DB_KEY, dbService);
    },
};

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $db: IDatabaseService;
    }
}
