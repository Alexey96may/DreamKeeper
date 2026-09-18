<template>
    <article
        class="border-border bg-bg-primary hover:border-primary/50 relative flex h-full flex-col justify-between rounded-xl border p-5 pt-7 shadow-sm transition-all duration-200 hover:shadow-md"
    >
        <p
            class="border-danger-border text-danger-text bg-danger-bg absolute -top-2 -left-2 flex items-center gap-1.5 rounded-lg border px-1.5 py-0.5"
            v-if="dream.categoryDetails?.prophetic?.expectedByDate"
        >
            <span class="text-xs">Должен был осуществиться:</span>
            <AppSmartTime
                :date="dream.categoryDetails.prophetic.expectedByDate"
                :date-format="'do MMMM yyyy'"
            />
        </p>

        <div>
            <!-- Шапка: Дата, время суток и флаги -->
            <div class="mb-3 flex items-start justify-between gap-2">
                <div
                    class="text-text-secondary flex grow-1 items-center justify-between gap-1.5 text-xs font-medium"
                >
                    <div class="flex items-center gap-1.5">
                        <Calendar class="h-3.5 w-3.5" />
                        <AppSmartTime :date="dream.date" :date-format="'do MMMM yyyy'" />
                    </div>

                    <span v-if="timeOfDayIcon" class="ml-1 inline-flex items-center gap-1">
                        <component :is="timeOfDayIcon" class="text-primary h-3.5 w-3.5" />
                        <span>{{ timeOfDayLabel }}</span>
                    </span>
                </div>

                <!-- Флаги/Статусы -->
                <div class="flex items-center gap-1.5">
                    <span
                        v-if="dream.isDraft"
                        class="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500"
                    >
                        Черновик
                    </span>
                    <Pin v-if="dream.isPinned" class="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <Star v-if="dream.isFavorite" class="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                    <Lock v-if="dream.isPrivate" class="text-text-secondary/60 h-3.5 w-3.5" />
                </div>
            </div>

            <div class="mb-2.5 flex flex-col gap-1.5">
                <!-- Заголовок -->
                <h3 class="text-text-primary line-clamp-1 text-lg leading-snug font-semibold">
                    <RouterLink
                        :to="{ name: 'dream-details', params: { slug: dream.slug } }"
                        class="hover:text-primary transition-colors"
                    >
                        {{ dream.title || 'Безымянный сон' }}
                    </RouterLink>
                </h3>

                <!-- Описание -->
                <p
                    v-if="dream.description"
                    class="text-text-secondary line-clamp-3 text-sm leading-relaxed"
                >
                    {{ dream.description }}
                </p>

                <!-- Категории и феномены -->
                <div
                    v-if="dream.categories?.length || dream.phenomena?.length"
                    class="flex flex-wrap gap-1.5"
                >
                    <span
                        v-for="cat in dream.categories"
                        :key="cat"
                        class="border-border bg-bg-secondary text-text-primary rounded-lg border px-2 py-0.5 text-xs font-medium"
                    >
                        #{{ DREAM_CATEGORY_MAP[cat].label }}
                    </span>
                    <span
                        v-for="phenomenon in dream.phenomena"
                        :key="phenomenon"
                        class="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400"
                    >
                        ⚡ {{ DREAM_PHENOMENON_MAP[phenomenon].label }}
                    </span>
                </div>
            </div>

            <!-- Аналитика (Персонажи, локации, эмоции) -->
            <div
                v-if="hasAnalytics"
                class="border-border/60 mb-4 flex flex-wrap gap-x-3 gap-y-1.5 border-t pt-3 text-xs"
            >
                <div
                    v-if="dream.characters?.length"
                    class="text-text-secondary line-clamp-1 flex items-center gap-1"
                >
                    <Users class="h-3 w-3 opacity-70" />
                    <span class="text-text-primary font-medium">{{
                        dream.characters.join(', ')
                    }}</span>
                </div>
                <div
                    v-if="dream.locations?.length"
                    class="text-text-secondary line-clamp-1 flex items-center gap-1"
                >
                    <MapPin class="h-3 w-3 opacity-70" />
                    <span class="text-text-primary font-medium">{{
                        dream.locations.join(', ')
                    }}</span>
                </div>
                <div
                    v-if="dream.emotions?.length"
                    class="text-text-secondary line-clamp-1 flex items-center gap-1"
                >
                    <Smile class="h-3 w-3 opacity-70" />
                    <span class="text-text-primary font-medium">{{
                        dream.emotions.join(', ')
                    }}</span>
                </div>
            </div>
        </div>

        <!-- Подвал: Оценки и связь -->
        <div class="border-border/60 border-t pt-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-xs">
                    <AppRating
                        v-if="dream.quality !== undefined"
                        label="Качество сна"
                        :value="dream.quality"
                    />
                    <AppRating
                        v-if="dream.clarity !== undefined"
                        label="Ясность"
                        :value="dream.clarity"
                    />
                </div>

                <div class="text-text-secondary flex items-center gap-2 text-xs">
                    <span
                        v-if="dream.interpretations?.length"
                        class="flex items-center gap-1"
                        title="Толкования"
                    >
                        <BookOpen class="h-3.5 w-3.5" />
                        {{ dream.interpretations.length }}
                    </span>
                    <span
                        v-if="dream.relatedDreams?.length"
                        class="flex items-center gap-1"
                        title="Связанные сны"
                    >
                        <Link2 class="h-3.5 w-3.5" />
                        {{ dream.relatedDreams.length }}
                    </span>
                    <RouterLink
                        :to="{ name: 'dream-details', params: { slug: dream.slug } }"
                        class="text-primary hover:text-primary/80 ml-1 inline-flex items-center p-0.5"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import {
        Calendar,
        Pin,
        Star,
        Lock,
        Users,
        MapPin,
        Smile,
        BookOpen,
        Link2,
        ChevronRight,
    } from 'lucide-vue-next';
    import type { Dream } from '@/types/Dream';
    import AppSmartTime from '@/components/ui/AppSmartTime.vue';
    import AppRating from '@/components/ui/AppRating.vue';
    import { TIME_OF_DAY_MAP, DREAM_CATEGORY_MAP, DREAM_PHENOMENON_MAP } from '@/constants/Dream';

    const props = defineProps<{
        dream: Dream;
    }>();

    const timeOfDayIcon = computed(() => {
        return props.dream.timeOfDay ? TIME_OF_DAY_MAP[props.dream.timeOfDay].icon : null;
    });

    const timeOfDayLabel = computed(() => {
        return props.dream.timeOfDay ? TIME_OF_DAY_MAP[props.dream.timeOfDay].label : '';
    });

    const hasAnalytics = computed(() => {
        return Boolean(
            props.dream.characters?.length ||
            props.dream.locations?.length ||
            props.dream.emotions?.length,
        );
    });
</script>
