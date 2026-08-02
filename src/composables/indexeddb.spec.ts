import { type App, createApp } from 'vue';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { deleteDB } from 'idb';

import type { IDatabaseService } from '@/types/databases/IndexedDB';
import type { Dream } from '@/types/Dream';
import type { UserState } from '@/types/UserState';

import indexedDBPlugin, { DB_KEY } from './indexeddb';

type DreamInput = Omit<Dream, 'id' | 'createdAt' | 'updatedAt'>;
type UserStateInput = Omit<UserState, 'id' | 'createdAt' | 'updatedAt'>;

describe('IndexedDB Plugin', () => {
    let app: App;
    let dbService: IDatabaseService;

    beforeEach(async () => {
        app = createApp({});
        app.use(indexedDBPlugin, { dbName: 'TestDB', version: 1 });

        // Safely extract from globalProperties or via Symbol injection key
        const provided =
            app.config.globalProperties.$db ||
            (app._context.provides as Record<symbol, unknown>)[DB_KEY as unknown as symbol];

        dbService = provided as IDatabaseService;
    });

    afterEach(async () => {
        if (dbService && 'close' in dbService && typeof dbService.close === 'function') {
            await dbService.close();
        }

        await deleteDB('TestDB');
    });

    describe('Initialization', () => {
        it('creates dreams store', async () => {
            const result = await dbService.getAll('dreams');
            expect(result).toEqual([]);
        });

        it('creates userStates store', async () => {
            const result = await dbService.getAll('userStates');
            expect(result).toEqual([]);
        });

        it('creates indices for dreams', async () => {
            const dreamData: DreamInput = {
                date: '2024-01-15',
                quality: 8,
                type: 'lucid',
            };
            const id = await dbService.add('dreams', dreamData as Dream);

            const byDate = await dbService.getByIndex('dreams', 'date', '2024-01-15');
            expect(byDate).toHaveLength(1);
            expect(byDate[0]?.id).toBe(id);

            const byQuality = await dbService.getByIndex('dreams', 'quality', 8);
            expect(byQuality).toHaveLength(1);

            const byType = await dbService.getByIndex('dreams', 'type', 'lucid');
            expect(byType).toHaveLength(1);
        });

        it('creates indices for userStates', async () => {
            const stateData: UserStateInput = {
                date: '2024-01-15',
                mood: 7,
                energy: 6,
            };
            const id = await dbService.add('userStates', stateData as UserState);

            const byDate = await dbService.getByIndex('userStates', 'date', '2024-01-15');
            expect(byDate).toHaveLength(1);
            expect(byDate[0]?.id).toBe(id);

            const byMood = await dbService.getByIndex('userStates', 'mood', 7);
            expect(byMood).toHaveLength(1);

            const byEnergy = await dbService.getByIndex('userStates', 'energy', 6);
            expect(byEnergy).toHaveLength(1);
        });
    });

    describe('CRUD operations for dreams', () => {
        it('adds a dream', async () => {
            const createdAt = new Date().toISOString();
            const dreamData: DreamInput & { createdAt?: string } = {
                date: '2024-01-15',
                quality: 8,
                description: 'Flying in a dream',
                type: 'lucid',
                createdAt,
            };

            const id = await dbService.add('dreams', dreamData as Dream);
            expect(id).toBe(1);

            const saved = await dbService.get('dreams', id);
            expect(saved).toMatchObject({
                date: '2024-01-15',
                quality: 8,
                description: 'Flying in a dream',
                type: 'lucid',
            });
            expect(saved?.id).toBe(1);
            expect(saved?.createdAt).toBeDefined();
        });

        it('updates a dream', async () => {
            const dreamData: DreamInput = {
                date: '2024-01-15',
                quality: 8,
                description: 'Old description',
            };
            const id = await dbService.add('dreams', dreamData as Dream);

            const updatedDream: Dream = {
                id,
                date: '2024-01-15',
                quality: 9,
                description: 'New description',
            };
            await dbService.put('dreams', updatedDream);

            const updated = await dbService.get('dreams', id);
            expect(updated?.quality).toBe(9);
            expect(updated?.description).toBe('New description');
        });

        it('deletes a dream', async () => {
            const dreamData: DreamInput = {
                date: '2024-01-15',
                quality: 8,
            };
            const id = await dbService.add('dreams', dreamData as Dream);

            await dbService.delete('dreams', id);
            const deleted = await dbService.get('dreams', id);
            expect(deleted).toBeUndefined();
        });

        it('retrieves all dreams', async () => {
            await dbService.add('dreams', { date: '2024-01-15', quality: 8 } as Dream);
            await dbService.add('dreams', { date: '2024-01-16', quality: 9 } as Dream);
            await dbService.add('dreams', { date: '2024-01-17', quality: 7 } as Dream);

            const all = await dbService.getAll('dreams');
            expect(all).toHaveLength(3);
        });
    });

    describe('Specific methods for dreams', () => {
        beforeEach(async () => {
            await dbService.add('dreams', {
                date: '2024-01-15',
                quality: 8,
                type: 'lucid',
            } as Dream);
            await dbService.add('dreams', {
                date: '2024-01-15',
                quality: 6,
                type: 'normal',
            } as Dream);
            await dbService.add('dreams', {
                date: '2024-01-16',
                quality: 9,
                type: 'lucid',
            } as Dream);
            await dbService.add('dreams', {
                date: '2024-02-01',
                quality: 7,
                type: 'normal',
            } as Dream);
        });

        it('getDreamsByDate returns dreams for a specific date', async () => {
            const dreams = await dbService.getDreamsByDate('2024-01-15');
            expect(dreams).toHaveLength(2);
            expect(dreams.every((d: Dream) => d.date === '2024-01-15')).toBe(true);
        });

        it('getDreamsByMonth returns dreams for a given month', async () => {
            const dreams = await dbService.getDreamsByMonth(2024, 1);
            expect(dreams).toHaveLength(3);
            expect(dreams.every((d: Dream) => d.date.startsWith('2024-01'))).toBe(true);
        });

        it('getDreamsByQuality filters dreams by quality', async () => {
            const dreams = await dbService.getDreamsByQuality(8);
            expect(dreams).toHaveLength(2);
            expect(dreams.every((d: Dream) => d.quality >= 8)).toBe(true);
        });
    });

    describe('Operations for userStates', () => {
        it('getUserStateByDate returns user state', async () => {
            const stateData: UserStateInput = {
                date: '2024-01-15',
                mood: 7,
                energy: 6,
                focus: 8,
            };
            await dbService.add('userStates', stateData as UserState);

            const state = await dbService.getUserStateByDate('2024-01-15');
            expect(state).toBeDefined();
            expect(state?.mood).toBe(7);
            expect(state?.energy).toBe(6);
            expect(state?.focus).toBe(8);
        });

        it('updateUserState creates a new state if non-existent', async () => {
            const id = await dbService.updateUserState('2024-01-15', {
                mood: 7,
                energy: 6,
            });

            expect(id).toBe(1);
            const state = await dbService.getUserStateByDate('2024-01-15');
            expect(state?.mood).toBe(7);
            expect(state?.energy).toBe(6);
            expect(state?.createdAt).toBeDefined();
        });

        it('updateUserState updates an existing state', async () => {
            await dbService.updateUserState('2024-01-15', { mood: 5, energy: 5 });
            await dbService.updateUserState('2024-01-15', { mood: 8, energy: 7 });

            const state = await dbService.getUserStateByDate('2024-01-15');
            expect(state?.mood).toBe(8);
            expect(state?.energy).toBe(7);
            expect(state?.updatedAt).toBeDefined();
        });

        it('updateUserState preserves existing fields during partial updates', async () => {
            await dbService.updateUserState('2024-01-15', {
                mood: 7,
                energy: 6,
                focus: 8,
            });

            await dbService.updateUserState('2024-01-15', { mood: 9 });

            const state = await dbService.getUserStateByDate('2024-01-15');
            expect(state?.mood).toBe(9);
            expect(state?.energy).toBe(6);
            expect(state?.focus).toBe(8);
        });
    });

    describe('Error handling', () => {
        it('returns undefined when querying non-existent records', async () => {
            const result = await dbService.get('dreams', 999);
            expect(result).toBeUndefined();
        });

        it('returns an empty array when querying a non-existent index key', async () => {
            const result = await dbService.getByIndex('dreams', 'date', '2099-01-01');
            expect(result).toEqual([]);
        });

        it('does not throw when deleting non-existent records', async () => {
            await expect(dbService.delete('dreams', 999)).resolves.not.toThrow();
        });
    });

    describe('Vue Integration', () => {
        it('registers $db in global properties', () => {
            expect(app.config.globalProperties.$db).toBeDefined();
            expect(app.config.globalProperties.$db).toBe(dbService);
        });

        it('provides service via inject', () => {
            expect(dbService).toBeDefined();
            expect(typeof dbService.getAll).toBe('function');
            expect(typeof dbService.add).toBe('function');
            expect(typeof dbService.getDreamsByDate).toBe('function');
        });
    });
});
