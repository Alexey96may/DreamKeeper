<template>
    <div class="border-border border-t pt-2">
        <div class="mb-3 flex items-center justify-between">
            <span class="text-text-soft text-xs font-medium">Связанные сны</span>

            <AppButton @click="addRelatedDream" variant="add" :icon-left="PlusIcon">
                Добавить связь
            </AppButton>
        </div>

        <div v-for="(rel, idx) in list" :key="idx">
            <div class="mb-2 flex items-center gap-2">
                <AppSelect
                    :model-value="rel.dreamId"
                    @update:model-value="updateField(idx, 'dreamId', $event ?? undefined)"
                    :options="dreamToLinkOptions"
                    class="w-1/3 text-xs"
                    :error-message="sleepStore.validationErrors[`relatedDreams.${idx}.dreamId`]"
                    @clear-error="sleepStore.clearError(`relatedDreams.${idx}.dreamId`)"
                />

                <AppSelect
                    :model-value="rel.relationType"
                    @update:model-value="updateField(idx, 'relationType', $event)"
                    :options="DREAM_RELATION_OPTIONS"
                    class="w-1/3 text-xs"
                    :error-message="
                        sleepStore.validationErrors[`relatedDreams.${idx}.relationType`]
                    "
                    @clear-error="sleepStore.clearError(`relatedDreams.${idx}.relationType`)"
                />

                <AppButton
                    size="xs"
                    @click="removeRelatedDream(idx)"
                    variant="danger"
                    :icon-left="X"
                />
            </div>

            <AppTextarea
                :model-value="rel.note"
                @update:model-value="updateField(idx, 'note', $event)"
                placeholder="Примечание..."
                :rows="2"
                :error-message="sleepStore.validationErrors[`relatedDreams.${idx}.note`]"
                @input="sleepStore.clearError(`relatedDreams.${idx}.note`)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { PlusIcon, X } from 'lucide-vue-next';
    import { useRoute } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/dream';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppTextarea from '@/components/ui/AppTextarea.vue';
    import type { Dream, RelatedDreamRef, DreamRelationType } from '@/types/Dream';
    import { DREAM_RELATION_OPTIONS } from '@/constants/Dream';

    interface Props {
        relatedDreams?: RelatedDreamRef[];
        slug?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        relatedDreams: () => [],
    });

    const emit = defineEmits<{
        'update:relatedDreams': [value: RelatedDreamRef[]];
    }>();

    const sleepStore = useSleepStore();

    const list = computed({
        get: () => props.relatedDreams,
        set: (val) => emit('update:relatedDreams', val),
    });

    const updateField = <K extends keyof RelatedDreamRef>(
        index: number,
        field: K,
        value: RelatedDreamRef[K],
    ) => {
        const updated = props.relatedDreams.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        emit('update:relatedDreams', updated);
    };

    const addRelatedDream = () => {
        emit('update:relatedDreams', [
            ...props.relatedDreams,
            { dreamId: undefined, relationType: 'similar_theme' as DreamRelationType, note: '' },
        ]);
    };

    const removeRelatedDream = (index: number) => {
        emit(
            'update:relatedDreams',
            props.relatedDreams.filter((_, i) => i !== index),
        );
    };

    const route = useRoute();

    const dreamToLinkOptions = computed(() => {
        const rawSlug = props.slug || route.params.slug;
        const currentSlug = rawSlug ? rawSlug : null;

        const options = (sleepStore.sleeps || [])
            .filter((d: Dream) => d.slug !== currentSlug)
            .map((d: Dream) => ({
                value: d.id,
                label: `${d.title || 'Без названия'} (${d.date})`,
            }));

        return [{ value: null, label: 'Не из базы (прошлый сон)' }, ...options];
    });
</script>
