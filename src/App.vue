<script setup lang="ts">
    import { onMounted } from 'vue';
    import { RouterView } from 'vue-router';
    import TheHeader from '@/components/sections/TheHeader.vue';
    import AppToastContainer from '@/components/ui/AppToastContainer.vue';
    import { useUIStore } from '@/stores/modules/ui';
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
</script>

<template>
    <div class="bg-bg-primary text-text-primary transition-theme min-h-lvh duration-300">
        <TheHeader />

        <main class="py-6">
            <RouterView />
        </main>

        <AppToastContainer />
    </div>
</template>
