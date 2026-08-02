import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSleepStore } from '@/stores/modules/sleep';
import { ServiceFactory } from '@/services/factories/ServiceFactory';
import type { Dream } from '@/types/Dream';

describe('Integration: Sleep Flow', () => {
    let sleepStore: ReturnType<typeof useSleepStore>;

    beforeEach(async () => {
        setActivePinia(createPinia());
        sleepStore = useSleepStore();

        await sleepStore.init();
    });

    afterEach(async () => {
        const service = ServiceFactory.createService('indexeddb');
        const allDreams = (await service.getAll('dreams')) as Dream[];
        for (const dream of allDreams) {
            if (dream.id) await service.delete('dreams', dream.id);
        }
    });

    it('full cycle: create → get → update → delete', async () => {
        // 1. create
        const newDream = {
            date: '2024-01-15',
            quality: 8,
            description: 'Integration test',
            type: 'lucid' as const,
        };
        const created = await sleepStore.addDream(newDream);
        expect(created).toBeDefined();
        expect(created?.id).toBe(1);

        // 2. load
        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(1);
        expect(sleepStore.totalDreams).toBe(1);

        // 3. update
        const updated = await sleepStore.updateDream(created!.id!, {
            quality: 9,
            description: 'Updated test',
        });
        expect(updated?.quality).toBe(9);
        expect(updated?.description).toBe('Updated test');

        // 4. filtering
        const byDate = sleepStore.getDreamsByDate('2024-01-15');
        expect(byDate).toHaveLength(1);
        expect(byDate[0].quality).toBe(9);

        // 5. delete
        const deleted = await sleepStore.deleteDream(created!.id!);
        expect(deleted).toBe(true);

        // 6. load
        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(0);
        expect(sleepStore.totalDreams).toBe(0);
    });

    it('handles duplicate creation (allowed)', async () => {
        await sleepStore.addDream({
            date: '2024-01-15',
            quality: 8,
            description: 'First dream',
        });

        const second = await sleepStore.addDream({
            date: '2024-01-15',
            quality: 7,
            description: 'Second dream',
        });
        expect(second).toBeDefined();

        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(2);
    });
});
