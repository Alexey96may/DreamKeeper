<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto max-w-2xl px-4 py-6">
            <!-- Кнопка Назад -->
            <button
                @click="goBack"
                class="text-text-mute hover:text-text-primary mb-4 flex items-center gap-2 transition-colors"
            >
                ← Назад к календарю
            </button>

            <div class="dream-card fade-in p-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h3 class="text-text-primary text-xl font-semibold">
                            {{ formattedDate }}
                        </h3>
                        <p class="text-text-mute text-sm capitalize">
                            {{ weekday }}
                        </p>
                    </div>
                </div>

                <!-- Сны за день -->
                <div v-if="dayDreams.length > 0" class="mt-4">
                    <h4 class="text-text-soft mb-3 text-sm font-medium">Сны</h4>
                    <div
                        v-for="dream in dayDreams"
                        :key="dream.id"
                        @click="goToDreamDetail(dream.slug)"
                        class="bg-bg-secondary/50 border-border/50 mb-2 cursor-pointer rounded-lg border p-3 transition duration-200"
                        :class="{ 'opacity-50': isDeleting(dream.id) }"
                    >
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <h4
                                    v-if="dream.title"
                                    class="text-text-soft inline-block rounded-full py-0.5 text-xs"
                                >
                                    {{ getDreamTypeLabel(dream.title) }}
                                </h4>

                                <p class="text-text-primary">
                                    {{ dream.description || 'Без описания' }}
                                </p>
                            </div>

                            <div class="flex min-w-1/5 items-center justify-end gap-2">
                                <AppButton
                                    @click.stop="handleDelete(dream.id, dream.date)"
                                    size="xs"
                                    variant="danger"
                                    :disabled="isDeleting(dream.id)"
                                >
                                    Удалить
                                </AppButton>

                                <span class="text-accent text-sm">⭐ {{ dream.quality }}/10</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-else class="text-text-mute mt-4 text-sm">Нет записей снов за этот день</p>

                <!-- Состояние за день -->
                <div v-if="dayState" class="border-border mt-4 border-t pt-4">
                    <h4 class="text-text-soft mb-2 text-sm font-medium">Состояние</h4>
                    <div class="flex flex-wrap gap-4">
                        <span class="text-text-mute text-sm">
                            😊 Настроение: {{ dayState.mood ?? '—' }}/10
                        </span>
                        <span class="text-text-mute text-sm">
                            ⚡ Энергия: {{ dayState.energy ?? '—' }}/10
                        </span>
                        <span class="text-text-mute text-sm">
                            🧠 Фокус: {{ dayState.focus ?? '—' }}/10
                        </span>
                    </div>
                </div>

                <button
                    @click="goToAddDream(date)"
                    class="text-accent hover:text-accent-hover mt-6 block text-sm font-medium transition-colors"
                >
                    + Добавить запись за этот день
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useUserStateStore } from '@/stores/modules/userState';
    import AppButton from '@/components/ui/AppButton.vue';
    import { useCrud } from '@/composables/crud';
    import { useNavigation } from '@/composables/routing/useNavigation';

    const props = defineProps<{
        date: string;
    }>();

    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();

    const { goBack, goToDreamDetail, goToAddDream } = useNavigation();

    // --- Computed ---
    const dayDreams = computed(() => sleepStore.getDreamsByDate(props.date));
    const dayState = computed(() => userStateStore.getStateByDate(props.date));

    const { handleDelete, isDeleting } = useCrud();

    const formattedDate = computed(() => {
        const d = new Date(props.date);
        return d.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    });

    const weekday = computed(() => {
        const d = new Date(props.date);
        return d.toLocaleDateString('ru-RU', { weekday: 'long' });
    });

    // --- Handlers ---
    const getDreamTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            lucid: '🧠 Осознанный',
            nightmare: '😱 Кошмар',
            prophetic: '🔮 Вещий',
            normal: '💭 Обычный',
        };
        return labels[type] || type;
    };

    onMounted(async () => {
        if (sleepStore.sleeps.length === 0) await sleepStore.loadAll();
        if (userStateStore.states.length === 0) await userStateStore.loadAll();
    });
</script>

<style scoped>
    .fade-in {
        animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
