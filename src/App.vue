<script setup lang="ts">
    import { onMounted } from 'vue';
    import { RouterView } from 'vue-router';
    import TheHeader from '@/components/sections/TheHeader.vue';
    import { useUIStore } from '@/stores/modules/ui';

    const uiStore = useUIStore();

    onMounted(() => {
        uiStore.initTheme();
    });
</script>

<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-300">
        <TheHeader />

        <main class="py-6">
            <RouterView />
        </main>
    </div>
</template>
