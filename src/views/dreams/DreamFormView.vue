<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto max-w-xl px-4 py-6">
            <button
                @click="goBack"
                class="text-text-mute hover:text-text-primary mb-4 flex items-center gap-2 transition-colors"
            >
                ← Назад
            </button>

            <div class="dream-card p-6">
                <h2 class="text-text-primary mb-6 text-2xl font-bold">
                    {{ isEditMode ? 'Редактировать сон' : 'Записать сон' }}
                </h2>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Дата -->
                    <div>
                        <label class="text-text-soft mb-1 block text-sm font-medium">Дата</label>
                        <input
                            v-model="form.date"
                            type="date"
                            required
                            class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 focus:ring-2 focus:outline-none"
                        />
                    </div>

                    <!-- Качество сна (1-10) -->
                    <div>
                        <label class="text-text-soft mb-1 block text-sm font-medium">
                            Качество сна:
                            <span class="text-accent font-bold">{{ form.quality }}/10</span>
                        </label>
                        <input
                            v-model.number="form.quality"
                            type="range"
                            min="1"
                            max="10"
                            class="accent-accent w-full"
                        />
                    </div>

                    <!-- Тип сна -->
                    <div>
                        <label class="text-text-soft mb-1 block text-sm font-medium">Тип сна</label>
                        <select
                            v-model="form.type"
                            class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 focus:ring-2 focus:outline-none"
                        >
                            <option value="normal">💭 Обычный</option>
                            <option value="lucid">🧠 Осознанный (ОС)</option>
                            <option value="nightmare">😱 Кошмар</option>
                            <option value="prophetic">🔮 Вещий</option>
                        </select>
                    </div>

                    <!-- Описание -->
                    <div>
                        <label
                            for="formDreamDescription"
                            class="text-text-soft mb-1 block text-sm font-medium"
                            >Описание / Сюжет</label
                        >
                        <textarea
                            v-model="form.description"
                            id="formDreamDescription"
                            rows="5"
                            placeholder="Расскажите, что вам приснилось..."
                            class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 focus:ring-2 focus:outline-none"
                        ></textarea>
                    </div>

                    <!-- Ошибка store -->
                    <p v-if="sleepStore.error" class="text-sm text-red-500">
                        {{ sleepStore.error }}
                    </p>

                    <!-- Кнопки действий -->
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            @click="goBack"
                            class="text-text-mute hover:text-text-primary px-4 py-2 text-sm font-medium transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            :disabled="sleepStore.loading"
                            class="bg-accent hover:bg-accent-hover rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                        >
                            {{
                                sleepStore.loading
                                    ? 'Сохранение...'
                                    : isEditMode
                                      ? 'Сохранить'
                                      : 'Создать'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/sleep';
    import { formatToLocalDateStr } from '@/utils/date';
    import type { Dream } from '@/types/Dream';

    const props = defineProps<{
        id?: string;
    }>();

    const route = useRoute();
    const router = useRouter();
    const sleepStore = useSleepStore();

    const isEditMode = computed(() => Boolean(props.id));

    const form = ref<{
        date: string;
        quality: number;
        type: 'normal' | 'lucid' | 'nightmare' | 'prophetic';
        description: string;
    }>({
        date: (route.query.date as string) || formatToLocalDateStr(),
        quality: 7,
        type: 'normal',
        description: '',
    });

    onMounted(async () => {
        await sleepStore.init();

        if (isEditMode.value && props.id) {
            const numericId = Number(props.id);
            const existingDream = sleepStore.getDreamById(numericId);

            if (existingDream) {
                form.value = {
                    date: existingDream.date,
                    quality: existingDream.quality || 7,
                    type: (existingDream.type as any) || 'normal',
                    description: existingDream.description || '',
                };
            } else {
                router.replace('/');
            }
        }
    });

    const handleSubmit = async () => {
        if (isEditMode.value && props.id) {
            const updated = await sleepStore.updateDream(Number(props.id), { ...form.value });
            if (updated) {
                router.push(`/day/${form.value.date}`);
            }
        } else {
            const created = await sleepStore.addDream({ ...form.value });
            if (created) {
                router.push(`/day/${form.value.date}`);
            }
        }
    };

    const goBack = () => {
        router.back();
    };
</script>
