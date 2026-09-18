<template>
    <section class="dream-card px-4 py-6 md:px-14">
        <!-- Шапка секции -->
        <div
            class="border-border/60 mb-6 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <div class="flex items-center gap-2.5">
                    <Sparkles class="h-5 w-5 text-amber-400" />
                    <h2 class="text-text-primary text-xl font-bold tracking-tight md:text-2xl">
                        Напоминания
                    </h2>
                    <span
                        v-if="expectedDreams.length"
                        class="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500"
                    >
                        {{ expectedDreams.length }}
                    </span>
                </div>
                <p class="text-text-secondary mt-1 text-sm">
                    Сны, которые должны были реализоваться к сегодняшнему дню
                </p>
            </div>
        </div>

        <!-- Пустое состояние -->
        <div
            v-if="!expectedDreams.length"
            class="border-border/80 bg-bg-secondary/40 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center"
        >
            <CalendarCheck class="text-text-secondary/50 mb-3 h-10 w-10" />
            <p class="text-text-primary text-sm font-medium">Нет ожидающих снов</p>
            <p class="text-text-secondary mt-1 text-xs">
                Все сны с указанными датами обработаны или ещё не добавлены.
            </p>
        </div>

        <!-- Сетка карточек -->
        <ul v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <li v-for="dream in expectedDreams" :key="dream.id" class="h-full">
                <DreamExpectedByDateCard :dream="dream" />
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { Sparkles, CalendarCheck } from 'lucide-vue-next';
    import DreamExpectedByDateCard from '@/components/cards/DreamExpectedByDateCard.vue';
    import { useSleepStore } from '@/stores/modules/dream';

    const sleepStore = useSleepStore();

    const expectedDreams = computed(() => sleepStore.getDreamsExpectedByDate());
</script>
