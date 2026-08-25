<script setup lang="ts">
    import { onMounted } from 'vue';
    import { RouterView } from 'vue-router';
    import TheHeader from '@/components/sections/TheHeader.vue';
    import AppToast from '@/components/ui/AppToast.vue';
    import { useUIStore } from '@/stores/modules/ui';
    import { useSleepStore } from '@/stores/modules/dream';

    const uiStore = useUIStore();
    const sleepStore = useSleepStore();

    onMounted(() => {
        uiStore.initTheme();
        sleepStore.init();
    });
</script>

<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-300">
        <TheHeader />

        <main class="py-6">
            <RouterView />
        </main>

        <AppToast />
    </div>
</template>
