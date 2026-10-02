import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSleepStore } from '@/stores/modules/dream';
import { ServiceFactory } from '@/services/factories/ServiceFactory';
import type { Dream } from '@/types/Dream';

describe('Integration: Sleep Flow', () => {
    let sleepStore: ReturnType<typeof useSleepStore>;

    const clearDatabase = async () => {
        const service = ServiceFactory.createService('indexeddb');
        try {
            const allDreams = (await service.getAll('dreams')) as Dream[];
            for (const dream of allDreams) {
                if (dream.id !== undefined && dream.id !== null) {
                    await service.delete('dreams', dream.id);
                }
            }
        } catch {}
    };

    beforeEach(async () => {
        setActivePinia(createPinia());

        await clearDatabase();

        sleepStore = useSleepStore();
        await sleepStore.init();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    it('full cycle: create → get → update → delete', async () => {
        // 1. create
        const newDream = {
            title: 'Интеграционный сон',
            date: '2026-06-01',
            quality: 8,
            description: 'Integration test description',
            categories: ['lucid'] as const,
        };
        const created = await sleepStore.addDream(newDream as unknown as Dream);
        expect(created).toBeDefined();
        expect(created?.id).toBeDefined();

        // 2. load
        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(301);
        expect(sleepStore.totalDreams).toBe(301);

        // 3. update
        const updated = await sleepStore.updateDream(created!.id!, {
            quality: 9,
            description: 'Updated test description',
        });
        expect(updated?.quality).toBe(9);
        expect(updated?.description).toBe('Updated test description');

        // 4. filtering
        const byDate = sleepStore.getDreamsByDate('2026-06-01');
        expect(byDate).toHaveLength(1);
        expect(byDate[0].quality).toBe(9);

        // 5. delete
        const deleted = await sleepStore.deleteDream(created!.id!);
        expect(deleted).toBe(true);

        // 6. load
        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(300);
        expect(sleepStore.totalDreams).toBe(300);
    });

    it('handles duplicate creation (allowed)', async () => {
        await sleepStore.addDream({
            title: 'Первый сон',
            date: '2026-06-01',
            quality: 8,
            description: 'First dream description',
            categories: ['lucid'],
        });

        const second = await sleepStore.addDream({
            title: 'Второй сон',
            date: '2026-06-01',
            quality: 7,
            description: 'Second dream description',
            categories: ['nightmare'],
        });
        expect(second).toBeDefined();

        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(302);
    });
});
