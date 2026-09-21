<script setup lang="ts">
    import AppTag from '@/components/ui/AppTag.vue';
    import type { DreamElementsObject, AnaliticsIds } from '@/types/Dream';
    import { useDreamFilterStore } from '@/stores/modules/dreamFilter';

    defineProps<{
        element: DreamElementsObject;
        tagsArr: string[] | null;
    }>();

    const emit = defineEmits<{
        (e: 'pick-up', id: AnaliticsIds, tag: string): void;
    }>();

    const filterStore = useDreamFilterStore();
</script>

<template>
    <section
        class="dream-card flex flex-col gap-1.5 rounded-lg p-3 text-xs"
        :aria-labelledby="`analytic-title-${element.id}`"
    >
        <h3 :id="`analytic-title-${element.id}`" class="text-text-mute mb-1.5 block font-medium">
            {{ element.title }}
        </h3>

        <ul class="m-0 flex w-full list-none gap-1.5 overflow-x-auto p-0 py-2" role="list">
            <li v-for="(tag, idx) in element.tags" :key="idx">
                <AppTag
                    :is-pressed="tagsArr?.includes(tag) || element.id === tag"
                    :is-in-filter="filterStore.filters.isActive"
                    @click="emit('pick-up', element.id, tag)"
                >
                    {{ tag }}
                </AppTag>
            </li>
        </ul>
    </section>
</template>
