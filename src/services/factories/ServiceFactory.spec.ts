import { beforeEach, describe, expect, it } from 'vitest';
import { IndexedDBService } from '@/services/data/IndexedDBService';
import { ServiceFactory } from '@/services/factories/ServiceFactory';

describe('ServiceFactory', () => {
    beforeEach(() => {
        ServiceFactory.reset();
    });

    it('creates an IndexedDBService', async () => {
        const { ServiceFactory: ActualServiceFactory } = await vi.importActual<
            typeof import('@/services/factories/ServiceFactory')
        >('@/services/factories/ServiceFactory');

        const service = ActualServiceFactory.createService('indexeddb');
        expect(service).toBeInstanceOf(IndexedDBService);
    });

    it('returns a singleton instance', async () => {
        const { ServiceFactory: ActualServiceFactory } = await vi.importActual<
            typeof import('@/services/factories/ServiceFactory')
        >('@/services/factories/ServiceFactory');

        const service1 = ActualServiceFactory.createService('indexeddb');
        const service2 = ActualServiceFactory.createService('indexeddb');
        expect(service1).toBe(service2);
    });

    it('throws an error for an unknown service type', async () => {
        const { ServiceFactory: ActualServiceFactory } = await vi.importActual<
            typeof import('@/services/factories/ServiceFactory')
        >('@/services/factories/ServiceFactory');

        expect(() => ActualServiceFactory.createService('unknown' as never)).toThrow(
            'Unknown service type: unknown',
        );
    });
});
