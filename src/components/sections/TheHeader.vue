<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { useUIStore } from '@/stores/modules/ui';
    import { Moon } from 'lucide-vue-next';
    import ThemeSelector from '@/components/sections/ThemeSelector.vue';

    const uiStore = useUIStore();

    const navLinks = [
        { to: '/', label: 'Главная' },
        { to: '/about', label: 'О проекте' },
    ];
</script>

<template>
    <header
        class="header bg-bg-secondary/85 border-border-muted shadow-card transition-theme sticky top-0 z-40 mb-8 w-full border-b backdrop-blur-md duration-300"
    >
        <div
            class="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
            <!-- Логотип -->
            <div class="flex items-center gap-3">
                <RouterLink to="/" class="group flex items-center gap-2">
                    <div
                        class="bg-accent-soft text-accent flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold transition-transform group-hover:scale-105"
                    >
                        <Moon class="h-5 w-5" />
                    </div>
                    <span
                        class="text-text-primary hidden text-lg! font-bold tracking-wide sm:inline-block"
                    >
                        Dream<span class="text-accent text-lg!">Keeper</span>
                    </span>
                </RouterLink>
            </div>

            <!-- Десктопная навигация -->
            <nav class="hidden items-center gap-1 md:flex">
                <RouterLink
                    v-for="link in navLinks"
                    :key="link.to"
                    :to="link.to"
                    class="text-text-soft hover:text-text-inverse hover:bg-accent-hover/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                    active-class="!text-accent hover:!text-text-inverse bg-accent-soft/50 font-semibold"
                >
                    {{ link.label }}
                </RouterLink>
            </nav>

            <!-- Правая панель (Тема + Бургер) -->
            <div class="flex items-center gap-2">
                <ThemeSelector />

                <!-- Ровная анимированная кнопка бургера -->
                <button
                    @click="uiStore.toggleSidebar()"
                    class="text-text-soft hover:text-text-primary hover:bg-bg-secondary relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:hidden"
                    aria-label="Переключить меню"
                >
                    <div class="flex h-4 w-5 flex-col justify-between">
                        <span
                            class="h-0.5 w-full origin-center transform rounded-full bg-current transition-all duration-300 ease-in-out"
                            :class="{ 'translate-y-[7px] rotate-45': uiStore.sidebarOpen }"
                        ></span>
                        <span
                            class="h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-in-out"
                            :class="{ 'opacity-0': uiStore.sidebarOpen }"
                        ></span>
                        <span
                            class="h-0.5 w-full origin-center transform rounded-full bg-current transition-all duration-300 ease-in-out"
                            :class="{ '-translate-y-[7px] -rotate-45': uiStore.sidebarOpen }"
                        ></span>
                    </div>
                </button>
            </div>
        </div>

        <!-- Абсолютное мобильное меню (не двигает шапку и контент) -->
        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="-translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-2 opacity-0"
        >
            <div
                v-if="uiStore.sidebarOpen"
                class="bg-bg-secondary/95 border-border-muted absolute top-full right-0 left-0 border-b px-4 py-4 shadow-xl backdrop-blur-md md:hidden"
            >
                <nav class="flex flex-col gap-1.5">
                    <RouterLink
                        v-for="link in navLinks"
                        :key="link.to"
                        :to="link.to"
                        @click="uiStore.toggleSidebar()"
                        class="text-text-soft hover:text-text-inverse hover:bg-accent-hover/35 rounded-xl px-4 py-3 text-base font-medium transition-colors"
                        active-class="!text-accent hover:!text-text-inverse bg-accent-soft/50 font-semibold"
                    >
                        {{ link.label }}
                    </RouterLink>
                </nav>
            </div>
        </transition>
    </header>
</template>
