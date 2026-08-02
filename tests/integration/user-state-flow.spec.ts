import { beforeEach, describe, expect, it } from 'vitest';

import { IndexedDBService } from '@/services/data/IndexedDBService';
import { ServiceFactory } from '@/services/factories/ServiceFactory';

describe('ServiceFactory', () => {
    beforeEach(() => {
        ServiceFactory.reset();
    });

    it('creates an IndexedDBService', () => {
        const service = ServiceFactory.createService('indexeddb');
        expect(service).toBeInstanceOf(IndexedDBService);
    });

    it('returns a singleton instance', () => {
        const service1 = ServiceFactory.createService('indexeddb');
        const service2 = ServiceFactory.createService('indexeddb');
        expect(service1).toBe(service2);
    });

    it('throws an error for an unknown service type', () => {
        expect(() => ServiceFactory.createService('unknown' as never)).toThrow(
            'Unknown service type: unknown',
        );
    });
});
