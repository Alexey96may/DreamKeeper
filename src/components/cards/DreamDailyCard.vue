<script setup lang="ts">
    import { Trash, Edit2 as Edit2Icon } from 'lucide-vue-next';
    import AppRating from '@/components/ui/AppRating.vue';
    import AppButton from '@/components/ui/AppButton.vue';

    interface Dream {
        id: string | number;
        slug: string;
        title?: string;
        description?: string;
        quality?: number;
        date: string;
    }

    defineProps<{
        dream: Dream;
        isDeleting: boolean;
    }>();

    const emit = defineEmits<{
        (e: 'click'): void;
        (e: 'edit'): void;
        (e: 'delete'): void;
    }>();
</script>

<template>
    <div
        @click="!isDeleting ? emit('click') : null"
        class="bg-bg-secondary/50 border-border-primary cursor-pointer rounded-lg border px-4 py-6 transition duration-200"
        :class="{ 'pointer-events-none opacity-50': isDeleting }"
    >
        <div
            class="relative flex flex-col items-center justify-between gap-6 sm:flex-row sm:justify-start sm:gap-4"
        >
            <!-- Рейтинг -->
            <AppRating
                class="bg-accent/40 rounded-md p-1.5"
                v-if="dream.quality !== undefined && dream.quality > 0"
                :value="dream.quality"
            />

            <!-- Основной контент (Заголовок и описание) -->
            <div class="line-clamp-1 flex basis-full flex-col items-center gap-2 sm:items-stretch">
                <h4
                    v-if="dream.title"
                    class="text-text-soft inline-block rounded-full py-0.5 text-xs"
                >
                    {{ dream.title }}
                </h4>

                <p class="text-text-primary line-clamp-3 text-center sm:text-start">
                    {{ dream.description || 'Без описания' }}
                </p>
            </div>

            <!-- Действия (Кнопки удаления и редактирования) -->
            <div class="flex min-w-1/5 flex-row-reverse items-center justify-end gap-2 sm:flex-row">
                <AppButton
                    @click.stop="emit('delete')"
                    size="sm"
                    variant="danger"
                    :disabled="isDeleting"
                    :icon-left="Trash"
                />

                <AppButton
                    @click.stop="emit('edit')"
                    size="sm"
                    variant="primary"
                    :disabled="isDeleting"
                    :icon-left="Edit2Icon"
                />
            </div>
        </div>
    </div>
</template>
