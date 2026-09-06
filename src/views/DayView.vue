<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto max-w-2xl px-4 py-6">
            <AppButton @click="goBack" size="xs" variant="back" :icon-left="MoveLeft">
                Назад к календарю
            </AppButton>

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
                                    {{ dream.title }}
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
                                    <X />
                                </AppButton>

                                <AppButton
                                    @click="goToEdit(dream.slug)"
                                    size="xs"
                                    variant="primary"
                                    :disabled="isDeleting(dream.id)"
                                >
                                    <Edit2Icon />
                                </AppButton>

                                <AppRating
                                    v-if="dream.quality !== undefined && dream.quality > 0"
                                    :value="dream.quality"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <p v-else class="text-text-mute mt-4 text-sm">Нет снов за этот день</p>

                <AppButton
                    v-if="isAllowedDay"
                    @click="goToAddDream(date)"
                    size="xs"
                    variant="add"
                    :icon-left="PlusIcon"
                >
                    Добавить сон
                </AppButton>

                <!-- Состояние за день -->
                <div v-if="dayState" class="border-border mt-4 border-t pt-4">
                    <h4 class="text-text-soft mb-2 text-sm font-medium">Состояние</h4>

                    <div class="flex flex-wrap gap-4">
                        <AppRating
                            v-if="dayState.mood !== undefined && dayState.mood > 0"
                            label="Настроение"
                            :value="dayState.mood"
                        />

                        <AppRating
                            v-if="dayState.energy !== undefined && dayState.energy > 0"
                            label="Энергия"
                            :value="dayState.energy"
                        />

                        <AppRating
                            v-if="dayState.focus !== undefined && dayState.focus > 0"
                            label="Фокус"
                            :value="dayState.focus"
                        />

                        <AppRating
                            v-if="dayState.productivity !== undefined && dayState.productivity > 0"
                            label="Продуктивность"
                            :value="dayState.productivity"
                        />

                        <AppRating
                            v-if="dayState.stress !== undefined && dayState.stress > 0"
                            label="Стресс"
                            :value="dayState.stress"
                        />
                    </div>

                    <p v-if="dayState.notes">{{ dayState.notes }}</p>
                </div>
                <p v-else class="text-text-mute mt-4 text-sm">Нет состояния за этот день</p>

                <AppButton
                    v-if="isAllowedDay"
                    @click="isModalOpen = true"
                    size="xs"
                    variant="add"
                    :icon-left="dayState ? Edit2Icon : PlusIcon"
                >
                    {{ dayState ? 'Редактировать состояние' : 'Добавить состояние' }}
                </AppButton>
            </div>
        </div>

        <AppModal
            v-model="isModalOpen"
            :close-on-overlay="true"
            :title="dayState ? 'Редактировать состояние за день' : 'Добавить состояние за день'"
        >
            <UserStateForm :initial-data="dayState" :date="date" @change="isModalOpen = false" />
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useUserStateStore } from '@/stores/modules/userState';
    import { MoveLeft, PlusIcon, Edit2Icon, X } from 'lucide-vue-next';
    import AppRating from '@/components/ui/AppRating.vue';
    import AppButton from '@/components/ui/AppButton.vue';
    import UserStateForm from '@/components/sections/UserStateForm.vue';
    import { useCrud } from '@/composables/crud';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import { isPastOrPresentDay } from '@/utils/date';
    import router from '@/router';
    import AppModal from '@/components/sections/AppModal.vue';

    const props = defineProps<{
        date: string;
    }>();

    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();

    const { goBack, goToDreamDetail, goToAddDream, goToEdit } = useNavigation();

    // --- Computed ---
    const dayDreams = computed(() => sleepStore.getDreamsByDate(props.date));
    const dayState = computed(() => userStateStore.getStateByDate(props.date));

    const isAllowedDay = computed(() => {
        return isPastOrPresentDay(props.date);
    });

    const { handleDelete, isDeleting } = useCrud();

    const formattedDate = computed(() => {
        const d = new Date(props.date);

        if (isNaN(d.getTime())) {
            router.replace({ name: 'not-found' });
        }

        return d.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    });

    const weekday = computed(() => {
        const d = new Date(props.date);

        if (isNaN(d.getTime())) {
            router.replace({ name: 'not-found' });
        }

        return d.toLocaleDateString('ru-RU', { weekday: 'long' });
    });

    const isModalOpen = ref(false);

    onMounted(async () => {
        // if (sleepStore.sleeps.length === 0) await sleepStore.init();
        // if (userStateStore.states.length === 0) await userStateStore.init();

        console.log(userStateStore.states.length);
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
