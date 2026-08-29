<script setup lang="ts">
    import AppTag from '@/components/ui/AppTag.vue';
    import type { DreamElementsObject } from '@/types/Dream';

    defineProps<{
        element: DreamElementsObject;
    }>();
</script>

<template>
    <section
        class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
        :aria-labelledby="`analytic-title-${element.id}`"
    >
        <h3 :id="`analytic-title-${element.id}`" class="text-text-mute mb-1.5 block font-medium">
            {{ element.title }}
        </h3>

        <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0" role="list">
            <li v-for="(tag, idx) in element.tags" :key="idx">
                <AppTag>
                    {{ tag }}
                </AppTag>
            </li>
        </ul>
    </section>
</template>
