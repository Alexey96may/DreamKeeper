<script setup lang="ts">
    import { computed, onMounted, defineAsyncComponent } from 'vue';
    import { RouterView } from 'vue-router';
    import TheHeader from '@/components/sections/TheHeader.vue';
    import AppToastContainer from '@/components/ui/AppToastContainer.vue';
    import { useUIStore, type ActiveThemeMode } from '@/stores/modules/ui';
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
</script>

<template>
    <div class="text-text-primary transition-theme min-h-lvh duration-300">
        <component :is="currentBgComponent" />

        <TheHeader />
        <main class="py-6">
            <RouterView />
        </main>

        <AppToastContainer />
    </div>
</template>
