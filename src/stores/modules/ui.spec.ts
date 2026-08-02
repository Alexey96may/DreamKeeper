import { createPinia, setActivePinia } from 'pinia';

import { beforeEach, describe, expect, it } from 'vitest';

import { useUIStore } from '@/stores/modules/ui';

describe('UIStore', () => {
    let store: ReturnType<typeof useUIStore>;

    beforeEach(() => {
        vi.useRealTimers();
        setActivePinia(createPinia());
        store = useUIStore();

        localStorage.clear();
    });

    describe('Theme', () => {
        it('sets the theme', () => {
            store.setTheme('dark');
            expect(store.theme).toBe('dark');
            expect(localStorage.getItem('dreamkeeper-theme')).toBe('dark');
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        });

        it('cycles through themes', () => {
            const themes = ['light', 'dark', 'night', 'sepia', 'system'] as const;

            store.setTheme('light');

            for (let i = 0; i < themes.length; i++) {
                const nextTheme = themes[(i + 1) % themes.length];
                store.toggleTheme();
                expect(store.theme).toBe(nextTheme);
            }
        });

        it('applies the system theme', () => {
            vi.stubGlobal(
                'matchMedia',
                vi.fn().mockImplementation((query: string) => ({
                    matches: true,
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            );

            store.setTheme('system');
            expect(store.theme).toBe('system');
            // system → data-theme="dark"
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        });
    });

    describe('Notifications', () => {
        it('adds a notification', () => {
            store.addNotification('Test message', 'success');
            expect(store.notifications).toHaveLength(1);
            expect(store.notifications[0].message).toBe('Test message');
            expect(store.notifications[0].type).toBe('success');
        });

        it('automatically removes a notification after 5 seconds', () => {
            vi.useFakeTimers();
            store.addNotification('Test');
            expect(store.notifications).toHaveLength(1);

            vi.advanceTimersByTime(5000);
            expect(store.notifications).toHaveLength(0);
            vi.useRealTimers();
        });

        it('removes a notification by ID', () => {
            store.addNotification('First');
            store.addNotification('Second');

            const id = store.notifications[0].id;

            store.removeNotification(id);
            expect(store.notifications).toHaveLength(1);
            expect(store.notifications[0].message).toBe('Second');
        });
    });
});
