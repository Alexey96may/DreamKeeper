import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUIStore } from '@/stores/modules/ui';

describe('useUIStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        localStorage.clear();

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: query.includes('dark'),
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        // crypto.randomUUID
        if (!crypto.randomUUID) {
            Object.defineProperty(crypto, 'randomUUID', {
                value: vi.fn(() => 'test-uuid-1234'),
                configurable: true,
            });
        }
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with default state and localStorage values', () => {
        localStorage.setItem('dreamkeeper-theme', 'hifi');
        localStorage.setItem('dream_keeper_test_mode_exited', 'true');

        const store = useUIStore();

        expect(store.theme).toBe('hifi');
        expect(store.sidebarOpen).toBe(false);
        expect(store.isLoading).toBe(false);
        expect(store.toasts).toEqual([]);
        expect(store.isTestModeExited).toBe(true);
        expect(store.hasExitedTestMode).toBe(true);
    });

    it('resolves theme correctly when set to system', () => {
        const store = useUIStore();
        store.theme = 'system';
        // (prefers-color-scheme: dark) system = astronomy
        expect(store.resolvedTheme).toBe('astronomy');
    });

    it('toggles sidebar and loading state', () => {
        const store = useUIStore();

        expect(store.sidebarOpen).toBe(false);
        store.toggleSidebar();
        expect(store.sidebarOpen).toBe(true);

        expect(store.isLoading).toBe(false);
        store.setLoading(true);
        expect(store.isLoading).toBe(true);
    });

    it('completes test mode and saves to localStorage', () => {
        const store = useUIStore();

        expect(store.isTestModeExited).toBe(false);
        store.completeTestMode();

        expect(store.isTestModeExited).toBe(true);
        expect(store.hasExitedTestMode).toBe(true);
        expect(localStorage.getItem('dream_keeper_test_mode_exited')).toBe('true');
    });

    it('sets and applies theme correctly', () => {
        const setAttributeSpy = vi.spyOn(document.documentElement, 'setAttribute');
        const store = useUIStore();

        store.setTheme('nature');

        expect(store.theme).toBe('nature');
        expect(localStorage.getItem('dreamkeeper-theme')).toBe('nature');
        expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'nature');
    });

    it('toggles themes cyclically', () => {
        const store = useUIStore();
        store.theme = 'light';

        store.toggleTheme();
        expect(store.theme).toBe('astronomy');
    });

    it('adds and removes toasts correctly with limits', () => {
        vi.useFakeTimers();
        const store = useUIStore();

        // (MAX_TOASTS = 4)
        store.addToast({ message: 'Toast 1' });
        store.addToast({ message: 'Toast 2' });
        store.addToast({ message: 'Toast 3' });
        store.addToast({ message: 'Toast 4' });

        expect(store.toasts.length).toBe(4);
        expect(store.toasts[0].message).toBe('Toast 1');

        store.addToast({ message: 'Toast 5' });
        expect(store.toasts.length).toBe(4);
        expect(store.toasts[3].message).toBe('Toast 5');

        // id
        const toastIdToRemove = store.toasts[0].id;
        store.removeToast(toastIdToRemove);
        expect(store.toasts.find((t) => t.id === toastIdToRemove)).toBeUndefined();
    });

    it('removes toast automatically after duration timeout', () => {
        vi.useFakeTimers();
        const store = useUIStore();

        store.addToast({ message: 'Auto close', duration: 2000 });
        expect(store.toasts.length).toBe(1);

        vi.advanceTimersByTime(2000);

        expect(store.toasts.length).toBe(0);
    });
});
