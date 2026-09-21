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
        class="bg-bg-secondary border-border shadow-card transition-theme sticky top-0 z-40 w-full border-b duration-300"
    >
        <div
            class="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
            <div class="flex items-center gap-3">
                <button
                    @click="uiStore.toggleSidebar()"
                    class="none text-text-soft hover:text-text-primary hover:bg-bg-secondary block rounded-xl p-2 transition-colors sm:hidden"
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

                <RouterLink to="/" class="group flex items-center gap-1">
                    <div
                        class="bg-accent-soft text-accent flex items-center justify-center rounded-xl text-lg font-bold transition-transform group-hover:scale-105"
                    >
                        <Moon class="h-5 w-5" />
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
                    class="text-text-soft hover:text-text-inverse hover:bg-accent-hover rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                    active-class="!text-accent hover:!text-text-inverse bg-accent-soft/50 font-semibold"
                >
                    {{ link.label }}
                </RouterLink>
            </nav>

            <ThemeSelector />
        </div>
    </header>
</template>
