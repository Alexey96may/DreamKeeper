<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import { RouterLink } from 'vue-router';
    import { useUIStore } from '@/stores/modules/ui';
    import type { ThemeMode } from '@/types/Theme';

    const uiStore = useUIStore();

    // Состояние выпадающего меню переключения тем
    const isThemeMenuOpen = ref(false);
    const themeMenuRef = ref<HTMLElement | null>(null);

    // Конфигурация доступных тем
    const themeOptions: { id: ThemeMode; label: string; icon: string }[] = [
        { id: 'light', label: 'Светлая', icon: '☀️' },
        { id: 'dark', label: 'Тёмная', icon: '🌙' },
        { id: 'night', label: 'Ночная', icon: '🌌' },
        { id: 'sepia', label: 'Сепия', icon: '📜' },
        { id: 'system', label: 'Системная', icon: '💻' },
    ];

    // Получить иконку для текущей темы
    const getCurrentThemeIcon = () => {
        return themeOptions.find((t) => t.id === uiStore.theme)?.icon || '🌙';
    };

    // Закрытие дропдауна при клике вне его
    const handleClickOutside = (event: MouseEvent) => {
        if (themeMenuRef.value && !themeMenuRef.value.contains(event.target as Node)) {
            isThemeMenuOpen.value = false;
        }
    };

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    const navLinks = [
        { to: '/', label: 'Главная' },
        { to: '/about', label: 'О проекте' },
    ];
</script>

<template>
    <header
        class="bg-bg-card border-border shadow-card transition-theme sticky top-0 z-40 w-full border-b duration-300"
    >
        <div
            class="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
            <div class="flex items-center gap-3">
                <!-- Кнопка мобильного / бокового меню -->
                <button
                    @click="uiStore.toggleSidebar()"
                    class="text-text-soft hover:text-text-primary hover:bg-bg-secondary rounded-xl p-2 transition-colors"
                    aria-label="Переключить меню"
                >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <!-- Логотип -->
                <RouterLink to="/" class="group flex items-center gap-2">
                    <div
                        class="bg-accent-soft text-accent flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold transition-transform group-hover:scale-105"
                    >
                        🌙
                    </div>
                    <span
                        class="text-text-primary hidden text-lg font-bold tracking-wide sm:inline-block"
                    >
                        Dream<span class="text-accent">Keeper</span>
                    </span>
                </RouterLink>
            </div>

            <nav class="hidden items-center gap-1 md:flex">
                <RouterLink
                    v-for="link in navLinks"
                    :key="link.to"
                    :to="link.to"
                    class="text-text-soft hover:text-text-primary hover:bg-bg-secondary rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                    active-class="!text-accent bg-accent-soft/50 font-semibold"
                >
                    {{ link.label }}
                </RouterLink>
            </nav>

            <div class="flex items-center gap-2">
                <div ref="themeMenuRef" class="relative">
                    <!-- Главная кнопка темы (клик: откроет меню; клик по иконке: быстро переключит дальше) -->
                    <div
                        class="bg-bg-secondary border-border flex items-center rounded-xl border p-1 shadow-sm"
                    >
                        <button
                            @click.stop="uiStore.toggleTheme()"
                            title="Быстрое переключение"
                            class="hover:bg-bg-card flex items-center justify-center rounded-lg px-2 py-1 text-sm transition-colors"
                        >
                            <span>{{ getCurrentThemeIcon() }}</span>
                        </button>

                        <button
                            @click="isThemeMenuOpen = !isThemeMenuOpen"
                            class="text-text-soft hover:text-text-primary border-border/60 flex items-center gap-1 border-l px-2 py-1 text-xs font-medium transition-colors"
                        >
                            <span class="hidden capitalize sm:inline">{{ uiStore.theme }}</span>
                            <svg
                                class="h-3.5 w-3.5 transition-transform"
                                :class="{ 'rotate-180': isThemeMenuOpen }"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>

                    <!-- Выпадающее меню выбора темы -->
                    <Transition
                        enter-active-class="transition duration-150 ease-out"
                        enter-from-class="opacity-0 scale-95 -translate-y-1"
                        enter-to-class="opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100 scale-100 translate-y-0"
                        leave-to-class="opacity-0 scale-95 -translate-y-1"
                    >
                        <div
                            v-if="isThemeMenuOpen"
                            class="bg-bg-card border-border shadow-dropdown absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border py-1.5"
                        >
                            <button
                                v-for="item in themeOptions"
                                :key="item.id"
                                @click="
                                    uiStore.setTheme(item.id);
                                    isThemeMenuOpen = false;
                                "
                                class="hover:bg-bg-secondary flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors"
                                :class="
                                    uiStore.theme === item.id
                                        ? 'text-accent bg-accent-soft/30'
                                        : 'text-text-soft'
                                "
                            >
                                <span class="flex items-center gap-2">
                                    <span>{{ item.icon }}</span>
                                    <span>{{ item.label }}</span>
                                </span>
                                <span v-if="uiStore.theme === item.id" class="text-accent">✓</span>
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </header>
</template>
