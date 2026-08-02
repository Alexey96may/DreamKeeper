// src/store/modules/ui.ts
import { ref } from 'vue';

import { defineStore } from 'pinia';

import type { Notification, NotificationType } from '@/types/Notification';
import type { ThemeMode } from '@/types/Theme';

export const useUIStore = defineStore('ui', () => {
    // ===== STATE =====
    const theme = ref<ThemeMode>(
        (localStorage.getItem('dreamkeeper-theme') as ThemeMode) || 'system',
    );
    const sidebarOpen = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const notifications = ref<Array<Notification>>([]);

    let nextId = 1;

    // ===== ACTIONS =====
    const setTheme = (newTheme: ThemeMode) => {
        theme.value = newTheme;
        localStorage.setItem('dreamkeeper-theme', newTheme);
        applyTheme(newTheme);
    };

    const toggleTheme = () => {
        const themes: ThemeMode[] = ['light', 'dark', 'night', 'sepia', 'system'];
        const currentIndex = themes.indexOf(theme.value);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const applyTheme = (themeMode: ThemeMode) => {
        let actualTheme = themeMode;
        if (themeMode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            actualTheme = prefersDark ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', actualTheme);
    };

    const initTheme = () => {
        applyTheme(theme.value);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (theme.value === 'system') {
                applyTheme('system');
            }
        });
    };

    const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value;
    };

    const setLoading = (status: boolean) => {
        isLoading.value = status;
    };

    const addNotification = (message: string, type: NotificationType = 'info') => {
        const id = nextId++;
        notifications.value.push({ id, message, type });

        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: number) => {
        notifications.value = notifications.value.filter((n) => n.id !== id);
    };

    return {
        // State
        theme,
        sidebarOpen,
        isLoading,
        notifications,

        // Actions
        setTheme,
        toggleTheme,
        applyTheme,
        initTheme,
        toggleSidebar,
        setLoading,
        addNotification,
        removeNotification,
    };
});
