// src/store/modules/ui.ts
import { ref } from 'vue';

import { defineStore } from 'pinia';

import type { Toast } from '@/types/Notification';
import type { ThemeMode } from '@/types/Theme';

export const useUIStore = defineStore('ui', () => {
    // ===== STATE =====
    const theme = ref<ThemeMode>(
        (localStorage.getItem('dreamkeeper-theme') as ThemeMode) || 'system',
    );
    const sidebarOpen = ref<boolean>(false);
    const isLoading = ref<boolean>(false);

    const toasts = ref<Toast[]>([]);
    const MAX_TOASTS = 4;

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
    };

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = crypto.randomUUID();
        const duration = toast.duration ?? 4000;
        const showProgress = toast.showProgress ?? false;

        const newToast: Toast = { ...toast, id, duration, showProgress };

        // Если тостов слишком много, удаляем самый старый
        if (toasts.value.length >= MAX_TOASTS) {
            toasts.value.shift();
        }

        toasts.value.push(newToast);

        // Индивидуальный таймер для каждого тоста
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    // ===== ACTIONS =====
    const setTheme = (newTheme: ThemeMode) => {
        theme.value = newTheme;
        localStorage.setItem('dreamkeeper-theme', newTheme);
        applyTheme(newTheme);
    };

    const toggleTheme = () => {
        const themes: ThemeMode[] = [
            'light',
            'dark',
            'night',
            'sepia',
            'dracula',
            'emerald',
            'forest',
            'mystic',
            'neon',
            'nord',
            'system',
        ];
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

    return {
        // State
        theme,
        sidebarOpen,
        isLoading,
        toasts,

        // Actions
        setTheme,
        addToast,
        removeToast,
        toggleTheme,
        applyTheme,
        initTheme,
        toggleSidebar,
        setLoading,
    };
});
