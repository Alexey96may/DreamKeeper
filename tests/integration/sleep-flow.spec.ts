import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSleepStore } from '@/stores/modules/dream';
import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { useUIStore } from '@/stores/modules/ui';
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

        const uiStore = useUIStore();
        uiStore.isTestModeExited = false;

        await clearDatabase();

        sleepStore = useSleepStore();
        await sleepStore.init();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    it('full cycle: create → get → update → delete', async () => {
        const initialLength = sleepStore.sleeps.length;
        const uniqueDate = '2025-01-01';

        // 1. create
        const newDream = {
            title: 'Интеграционный сон',
            date: uniqueDate,
            quality: 8,
            description: 'Integration test description',
            categories: ['lucid'] as const,
        };
        const created = await sleepStore.addDream(newDream as unknown as Dream);
        expect(created).toBeDefined();

        // 2. load
        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(initialLength + 1);
        expect(sleepStore.totalDreams).toBe(initialLength + 1);

        // 3. update
        const updated = await sleepStore.updateDream(created!.id!, {
            quality: 9,
            description: 'Updated test description',
        });
        expect(updated?.quality).toBe(9);
        expect(updated?.description).toBe('Updated test description');

        // 4. filtering по уникальной дате
        const byDate = sleepStore.getDreamsByDate(uniqueDate);
        expect(byDate).toHaveLength(1);
        expect(byDate[0].quality).toBe(9);
        expect(byDate[0].id).toBe(created!.id);

        // 5. delete
        const deleted = await sleepStore.deleteDream(created!.id!);
        expect(deleted).toBe(true);

        // 6. load
        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(initialLength);
        expect(sleepStore.totalDreams).toBe(initialLength);
    });

    it('handles duplicate creation (allowed)', async () => {
        const initialLength = sleepStore.sleeps.length;
        const testDate = '2024-02-02';

        await sleepStore.addDream({
            title: 'Первый сон',
            date: testDate,
            quality: 8,
            description: 'First dream description',
            categories: ['lucid'],
        });

        const second = await sleepStore.addDream({
            title: 'Второй сон',
            date: testDate,
            quality: 7,
            description: 'Second dream description',
            categories: ['nightmare'],
        });
        expect(second).toBeDefined();

        await sleepStore.loadAll();
        expect(sleepStore.sleeps).toHaveLength(initialLength + 2);
    });
});
