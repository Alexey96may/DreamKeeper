<template>
    <div class="border-border-muted flex flex-col gap-4 border-t pt-2">
        <div class="mb-3 flex items-center justify-between">
            <span class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Связанные сны
            </span>

            <AppButton @click="addRelatedDream" variant="add" :icon-left="PlusIcon">
                <span>Добавить связь</span>
            </AppButton>
        </div>

        <!-- Обязательно добавляем relative для контейнера списка -->
        <TransitionGroup name="list" tag="div" class="relative flex flex-col gap-6">
            <div v-for="(rel, idx) in list" :key="idx" class="flex flex-col gap-4 transition-all">
                <div class="flex flex-wrap items-center gap-4">
                    <AppButton
                        size="xs"
                        @click="removeRelatedDream(idx)"
                        variant="danger"
                        class="ml-auto"
                        :icon-left="X"
                    />
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
        </TransitionGroup>
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
            {
                dreamId: undefined,
                relationType: 'similar_theme' as DreamRelationType,
                note: '',
            },
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

<style scoped>
    /* Плавное появление и исчезновение элементов */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.3s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    /* Плавное смещение остальных элементов при удалении/добавлении (эффект магнита) */
    .list-move {
        transition: transform 0.3s ease;
    }
</style>
