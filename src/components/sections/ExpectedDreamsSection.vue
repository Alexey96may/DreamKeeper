<template>
    <section class="dream-card px-4 py-6 md:px-14">
        <div
            class="border-border/60 mb-6 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="border-border/60">
                <div class="mb-1.5 flex items-center gap-2.5">
                    <Sparkles class="text-accent h-5 w-5" />
                    <h2 class="text-text-primary text-lg font-bold tracking-tight md:text-xl">
                        Напоминания
                    </h2>
                    <span
                        v-if="expectedDreams.length"
                        class="bg-accent text-text-inverse rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    >
                        {{ expectedDreams.length }}
                    </span>
                </div>
                <p class="text-text-secondary text-sm">
                    Сны, которые должны были реализоваться к сегодняшнему дню
                </p>
            </div>
        </div>

        <Transition name="fade" mode="out-in">
            <div
                v-if="isLoading"
                key="skeleton"
                class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
                <li v-for="n in 3" :key="n" class="h-full list-none">
                    <DreamExpectedByDateCardSkeleton />
                </li>
            </div>

            <!-- 2. Пустое состояние -->
            <div
                v-else-if="!expectedDreams.length"
                key="empty"
                class="border-border-primary/80 bg-bg-secondary/40 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center"
            >
                <CalendarCheck class="text-text-secondary/50 mb-3 h-10 w-10" />
                <p class="text-text-primary text-sm font-medium">Нет ожидающих снов</p>
                <p class="text-text-secondary mt-1 text-xs">
                    Все сны с указанными датами обработаны или ещё не добавлены.
                </p>
            </div>

            <!-- 3. Основной список с анимацией элементов -->
            <TransitionGroup
                tag="ul"
                name="list"
                key="list"
                class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                v-else
            >
                <li v-for="dream in expectedDreams" :key="dream.id" class="h-full">
                    <DreamExpectedByDateCard :dream="dream" />
                </li>
            </TransitionGroup>
        </Transition>
    </section>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { Sparkles, CalendarCheck } from 'lucide-vue-next';
    import DreamExpectedByDateCard from '@/components/cards/DreamExpectedByDateCard.vue';
    import DreamExpectedByDateCardSkeleton from '@/components/skeletons/DreamExpectedByDateCardSkeleton.vue';
    import { useSleepStore } from '@/stores/modules/dream';

    const sleepStore = useSleepStore();
    const isLoading = computed(() => sleepStore.loading && sleepStore.sleeps.length === 0);

    const expectedDreams = computed(() => sleepStore.getDreamsExpectedByDate());
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.25s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    /* TransitionGroup */
    .list-move,
    .list-enter-active,
    .list-leave-active {
        transition: all 0.3s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateY(15px);
    }

    .list-leave-active {
        position: absolute;
        width: 100%;
    }
</style>
