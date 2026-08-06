<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto max-w-xl px-4 py-6">
            <button
                @click="goBack"
                class="text-text-mute hover:text-text-primary mb-4 flex items-center gap-2 transition-colors"
            >
                ← Назад
            </button>

            <div v-if="dream" class="dream-card p-6">
                <div class="border-border/50 flex items-start justify-between border-b pb-4">
                    <div>
                        <span class="text-text-mute text-sm">{{ formattedDate }}</span>
                        <h2 class="text-text-primary mt-1 text-2xl font-bold">
                            {{ getDreamTypeLabel(dream.type) }}
                        </h2>
                    </div>
                    <span
                        class="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-semibold"
                    >
                        ⭐ {{ dream.quality }}/10
                    </span>
                </div>

                <div class="mt-4">
                    <h3 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Записи
                    </h3>
                    <p class="text-text-primary mt-2 leading-relaxed whitespace-pre-line">
                        {{ dream.description || 'Описание отсутствует.' }}
                    </p>
                </div>

                <!-- Действия -->
                <div class="border-border/50 mt-8 flex items-center justify-between border-t pt-4">
                    <button
                        @click="handleDelete"
                        :disabled="sleepStore.loading"
                        class="text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
                    >
                        Удалить
                    </button>

                    <button
                        @click="goToEdit"
                        class="bg-bg-secondary hover:bg-border text-text-primary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Редактировать
                    </button>
                </div>
            </div>

            <div v-else-if="!sleepStore.loading" class="dream-card p-6 text-center">
                <p class="text-text-mute">Сон не найден</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/sleep';

    const props = defineProps<{
        id: string;
    }>();

    const router = useRouter();
    const sleepStore = useSleepStore();

    const dream = computed(() => sleepStore.getDreamById(Number(props.id)));

    const formattedDate = computed(() => {
        if (!dream.value?.date) return '';
        return new Date(dream.value.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    });

    const getDreamTypeLabel = (type?: string): string => {
        const labels: Record<string, string> = {
            lucid: '🧠 Осознанный сон',
            nightmare: '😱 Кошмар',
            prophetic: '🔮 Вещий сон',
            normal: '💭 Обычный сон',
        };
        return labels[type || 'normal'] || '💭 Сон';
    };

    const goToEdit = () => {
        router.push(`/dream/${props.id}/edit`);
    };

    const handleDelete = async () => {
        if (confirm('Удалить эту запись сна?')) {
            const targetDate = dream.value?.date;
            const success = await sleepStore.deleteDream(Number(props.id));
            if (success) {
                router.push(targetDate ? `/day/${targetDate}` : '/');
            }
        }
    };

    const goBack = () => {
        router.back();
    };

    onMounted(async () => {
        await sleepStore.init();
    });
</script>
