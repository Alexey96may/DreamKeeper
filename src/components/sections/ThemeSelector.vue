<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import { useUIStore } from '@/stores/modules/ui';
    import { THEME_OPTIONS, THEME_OPTIONS_MAP } from '@/constants/Theme';

    const uiStore = useUIStore();

    const isThemeMenuOpen = ref(false);
    const themeMenuRef = ref<HTMLElement | null>(null);

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
</script>

<template>
    <div ref="themeMenuRef" class="relative sm:min-w-45">
        <!-- Кнопка переключения темы -->
        <div
            class="bg-bg-secondary border-border-primary flex items-center justify-center rounded-sm border p-1 shadow-sm sm:rounded-xl"
        >
            <button
                @click.stop="uiStore.toggleTheme()"
                title="Быстрое переключение"
                aria-label="Быстрое переключение темы"
                class="hover:bg-bg-secondary border-border-primary/60 flex grow-0 items-center justify-center px-2 py-1 text-sm transition-colors sm:border-r"
            >
                <component
                    :is="THEME_OPTIONS_MAP[uiStore.theme]?.icon"
                    class="h-4 w-4 shrink-0"
                    aria-hidden="true"
                />
            </button>

            <button
                @click="isThemeMenuOpen = !isThemeMenuOpen"
                aria-haspopup="true"
                :aria-expanded="isThemeMenuOpen"
                aria-label="Открыть меню выбора темы"
                class="text-text-soft hover:text-text-primary hidden grow items-center justify-center gap-1 self-center px-2 py-1 text-xs font-medium transition-colors sm:flex"
            >
                <span class="inline capitalize">
                    {{ THEME_OPTIONS_MAP[uiStore.theme]?.label }}
                </span>
                <svg
                    class="h-3.5 w-3.5 transition-transform"
                    :class="{ 'rotate-180': isThemeMenuOpen }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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

        <!-- Выпадающее меню с поддержкой прокрутки -->
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
                role="menu"
                aria-label="Выбор темы оформления"
                class="bg-bg-secondary border-border-primary shadow-dropdown absolute right-0 z-50 mt-2 max-h-64 overflow-x-hidden overflow-y-auto rounded-xl border py-1.5 focus:outline-none sm:min-w-45"
            >
                <button
                    v-for="item in THEME_OPTIONS"
                    :key="item.value"
                    role="menuitem"
                    @click="
                        uiStore.setTheme(item.value);
                        isThemeMenuOpen = false;
                    "
                    class="hover:bg-accent-hover hover:text-text-inverse flex w-full items-center justify-between gap-1 px-3 py-2 text-left text-xs font-medium transition-colors"
                    :class="
                        uiStore.theme === item.value
                            ? 'text-accent bg-accent-soft/30'
                            : 'text-text-soft'
                    "
                >
                    <span class="flex items-center gap-2">
                        <component :is="item.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{{ item.label }}</span>
                    </span>
                    <span
                        v-if="uiStore.theme === item.value"
                        class="transition-colors"
                        aria-hidden="true"
                    >
                        ✓
                    </span>
                </button>
            </div>
        </Transition>
    </div>
</template>
