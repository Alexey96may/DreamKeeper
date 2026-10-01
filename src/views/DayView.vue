<template>
    <div class="text-text-primary transition-theme duration-theme">
        <div class="container px-4 py-6">
            <AppButton
                @click="goBack({ name: 'home' })"
                size="xs"
                class="mb-8"
                variant="back"
                :icon-left="MoveLeft"
            >
                Назад к календарю
            </AppButton>

            <div class="dream-card fade-in p-6">
                <div class="border-border-strong border-b pb-3">
                    <h3 class="text-text-primary text-xl font-semibold">
                        {{ formattedDate }}
                    </h3>
                    <p class="text-text-mute text-sm capitalize">
                        {{ weekday }}
                    </p>
                </div>

                <!-- Состояние за день -->
                <div class="border-border-strong border-b pb-8">
                    <div class="my-8 flex items-center justify-between">
                        <h4 class="text-text-soft font-medium">Состояние за день</h4>

                        <AppButton
                            v-if="isAllowedDay"
                            @click="isModalOpen = true"
                            size="sm"
                            variant="primary"
                            :icon-left="dayState ? Edit2Icon : PlusIcon"
                        />
                    </div>

                    <div v-if="dayState" class="flex flex-col gap-4">
                        <div
                            class="border-border-primary flex items-center justify-evenly gap-4 overflow-auto rounded-md border px-2 py-4 md:rounded-lg"
                        >
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
                                v-if="
                                    dayState.productivity !== undefined && dayState.productivity > 0
                                "
                                label="Продуктивность"
                                :value="dayState.productivity"
                            />

                            <AppRating
                                v-if="dayState.stress !== undefined && dayState.stress > 0"
                                label="Стресс"
                                :value="dayState.stress"
                            />
                        </div>

                        <p v-if="dayState.notes">
                            <span class="text-text-secondary">Заметка: </span>{{ dayState.notes }}
                        </p>
                    </div>

                    <p v-else class="text-text-mute mt-4! text-sm">Нет состояния за этот день</p>
                </div>

                <!-- Сны за день с пагинацией (бесконечным скроллом) -->
                <div class="mt-8">
                    <div class="mb-8 flex items-center justify-between">
                        <h4 class="text-text-soft font-medium">Сны ({{ dayDreams.length }})</h4>

                        <AppButton
                            v-if="isAllowedDay"
                            @click="goToAddDream(date)"
                            size="sm"
                            variant="primary"
                            :icon-left="PlusIcon"
                        />
                    </div>

                    <Transition name="fade" mode="out-in">
                        <div v-if="isLoading" class="space-y-4">
                            <DreamDailyCardSkeleton v-for="i in 3" :key="i" />
                        </div>

                        <div v-else>
                            <Transition name="fade" mode="out-in">
                                <div v-if="dayDreams.length > 0" class="space-y-4">
                                    <TransitionGroup
                                        name="list"
                                        tag="div"
                                        class="relative flex flex-col gap-4 overflow-hidden"
                                    >
                                        <DreamDailyCard
                                            v-for="dream in visibleDreams"
                                            :key="dream.id"
                                            :dream="dream"
                                            :is-deleting="isDeleting(dream.id)"
                                            @click="goToDreamDetail(dream.slug)"
                                            @edit="goToEdit(dream.slug)"
                                            @delete="
                                                handleDelete(dream.id, dream.date, dream.title)
                                            "
                                        />
                                    </TransitionGroup>

                                    <!-- Триггер бесконечного скролла -->
                                    <div ref="loadMoreTrigger" class="py-4 text-center">
                                        <span
                                            v-if="hasMore"
                                            class="text-text-muted animate-pulse text-xs"
                                        >
                                            Загрузка следующих снов...
                                        </span>
                                    </div>
                                </div>

                                <p v-else class="text-text-mute mt-4 text-sm">
                                    Нет снов за этот день
                                </p>
                            </Transition>
                        </div>
                    </Transition>
                </div>
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
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useUserStateStore } from '@/stores/modules/userState';
    import { MoveLeft, PlusIcon, Edit2Icon } from 'lucide-vue-next';
    import AppRating from '@/components/ui/AppRating.vue';
    import DreamDailyCard from '@/components/cards/DreamDailyCard.vue';
    import DreamDailyCardSkeleton from '@/components/skeletons/DreamDailyCardSkeleton.vue';
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

    const dayDreams = computed(() => sleepStore.getDreamsByDate(props.date));
    const dayState = computed(() => userStateStore.getStateByDate(props.date));

    const isLoading = computed(() => sleepStore.loading && sleepStore.sleeps.length === 0);

    // --- Логика пагинации (бесконечного скролла) для снов за день ---
    const pageSize = 5; // Порции можно сделать поменьше (например, по 5), так как это конкретный день
    const displayLimit = ref(pageSize);
    const loadMoreTrigger = ref<HTMLElement | null>(null);
    let observer: IntersectionObserver | null = null;

    const visibleDreams = computed(() => {
        return dayDreams.value.slice(0, displayLimit.value);
    });

    const hasMore = computed(() => {
        return displayLimit.value < dayDreams.value.length;
    });

    // Сбрасываем лимит при изменении общего списка снов (например, при удалении/добавлении)
    watch(
        () => dayDreams.value.length,
        () => {
            if (displayLimit.value > dayDreams.value.length && displayLimit.value > pageSize) {
                displayLimit.value = Math.max(pageSize, dayDreams.value.length);
            }
        },
    );

    const loadMore = () => {
        if (hasMore.value) {
            displayLimit.value += pageSize;
        }
    };

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
        const validDate = new Date(props.date);
        if (isNaN(validDate.getTime())) {
            router.replace({ name: 'not-found' });
        }
        return validDate.toLocaleDateString('ru-RU', { weekday: 'long' });
    });

    const isModalOpen = ref(false);

    onMounted(async () => {
        if (sleepStore.sleeps.length === 0) await sleepStore.init();
        if (userStateStore.states.length === 0) await userStateStore.init();

        // Настраиваем IntersectionObserver для подгрузки снов за день
        observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '100px' },
        );

        if (loadMoreTrigger.value) {
            observer.observe(loadMoreTrigger.value);
        }
    });

    watch(loadMoreTrigger, (newVal) => {
        if (newVal && observer) {
            observer.observe(newVal);
        }
    });

    onUnmounted(() => {
        if (observer) {
            observer.disconnect();
        }
    });
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active,
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.25s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-8px);
    }

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

    .list-move {
        transition: transform 0.3s ease;
    }

    .list-enter-active,
    .list-leave-active {
        transition: all 0.3s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .list-leave-active {
        position: absolute;
        width: 100%;
    }
</style>
