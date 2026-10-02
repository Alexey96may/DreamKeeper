<script setup lang="ts">
    import { computed, onMounted, defineAsyncComponent, ref } from 'vue';
    import { RouterView } from 'vue-router';
    import TheHeader from '@/components/sections/TheHeader.vue';
    import AppToastContainer from '@/components/ui/AppToastContainer.vue';
    import { useUIStore, type ActiveThemeMode } from '@/stores/modules/ui';
    import AppButton from '@/components/ui/AppButton.vue';
    import { SquareArrowRightExit } from 'lucide-vue-next';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useUserStateStore } from '@/stores/modules/userState';
    import { useAspectStore } from '@/stores/modules/useAspectStore';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';
    import { useSymbolStore } from '@/stores/modules/useSymbolStore';
    import { useInterpretationStore } from '@/stores/modules/useInterpretationStore';

    const uiStore = useUIStore();
    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();
    const aspectStore = useAspectStore();
    const interpretationSourceStore = useInterpretationSourceStore();
    const symbolStore = useSymbolStore();
    const interpretationStore = useInterpretationStore();

    onMounted(() => {
        uiStore.initTheme();
        sleepStore.init();
        userStateStore.init();
        aspectStore.init();
        interpretationSourceStore.init();
        symbolStore.init();
        interpretationStore.init();
    });

    const themeBackgrounds: Record<ActiveThemeMode, ReturnType<typeof defineAsyncComponent>> = {
        light: defineAsyncComponent(() => import('@/components/themes/LightBg.vue')),
        astronomy: defineAsyncComponent(() => import('@/components/themes/AstronomyBg.vue')),
        hifi: defineAsyncComponent(() => import('@/components/themes/HifiBg.vue')),
        nature: defineAsyncComponent(() => import('@/components/themes/NatureBg.vue')),
        alchemy: defineAsyncComponent(() => import('@/components/themes/AlchemyBg.vue')),
        pagan: defineAsyncComponent(() => import('@/components/themes/PaganBg.vue')),
        astrology: defineAsyncComponent(() => import('@/components/themes/AstrologyBg.vue')),
        cinema: defineAsyncComponent(() => import('@/components/themes/CinemaBg.vue')),
        cthulhu: defineAsyncComponent(() => import('@/components/themes/CthulhuBg.vue')),
        archive: defineAsyncComponent(() => import('@/components/themes/ArchiveBg.vue')),
        noir: defineAsyncComponent(() => import('@/components/themes/NoirBg.vue')),
        clinic: defineAsyncComponent(() => import('@/components/themes/ClinicBg.vue')),
        temple: defineAsyncComponent(() => import('@/components/themes/TempleBg.vue')),
    };

    const currentBgComponent = computed(() => themeBackgrounds[uiStore.resolvedTheme] || null);

    const isCancelled = ref(true);

    const handleExitTestMode = async () => {
        isCancelled.value = false;
        const duration = 10000;

        const timer = setTimeout(async () => {
            if (isCancelled.value) return;

            try {
                await sleepStore.clearAllDreams();
                await userStateStore.clearAllStates();
                uiStore.completeTestMode();

                uiStore.addToast({
                    message: 'Тестовый режим завершен. База очищена от снов и состояний.',
                    type: 'success',
                });
            } catch {
                uiStore.addToast({
                    message: 'Ошибка при очистке данных.',
                    type: 'error',
                });
            }
        }, duration);

        uiStore.addToast({
            message: 'Все тестовые сны и состояния будут удалены.',
            type: 'warning',
            showProgress: true,
            duration,
            actionLabel: 'Отменить',
            onAction: () => {
                isCancelled.value = true;
                clearTimeout(timer);
            },
        });
    };
</script>

<template>
    <div class="text-text-primary transition-theme min-h-screen duration-300">
        <component :is="currentBgComponent" />

        <TheHeader />
        <main>
            <RouterView />
        </main>

        <AppToastContainer />

        <Transition name="fade" mode="out-in">
            <div
                v-if="!uiStore.hasExitedTestMode"
                class="pointer-events-none fixed bottom-4 left-0 flex w-full justify-center"
            >
                <AppButton
                    @click="handleExitTestMode"
                    size="sm"
                    :disabled="!isCancelled"
                    class="pointer-events-auto"
                    :class="{ pulse: isCancelled }"
                    variant="danger"
                    title="Параметры календаря"
                    :icon-left="SquareArrowRightExit"
                    >Завершить тестовый режим
                </AppButton>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.25s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
