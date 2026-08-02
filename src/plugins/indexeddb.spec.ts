import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';
import indexedDBPlugin from './indexeddb';
import { IndexedDBService } from '@/services/data/IndexedDBService';

describe('indexedDBPlugin', () => {
    it('installs without errors', () => {
        const app = createApp({});
        expect(() => app.use(indexedDBPlugin)).not.toThrow();
    });

    it('adds $db to global properties', () => {
        const app = createApp({});
        app.use(indexedDBPlugin);
        expect(app.config.globalProperties.$db).toBeInstanceOf(IndexedDBService);
    });
});
