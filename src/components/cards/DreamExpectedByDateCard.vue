<template>
    <article
        class="border-border-primary bg-bg-primary hover:border-primary/50 relative flex h-full flex-col justify-between rounded-sm border p-5 pt-7 shadow-sm transition-all duration-200 hover:shadow-md lg:rounded-lg"
    >
        <p
            class="border-danger-border text-danger-text bg-danger-bg absolute -top-2 -left-2 flex items-baseline gap-1.5 rounded-sm border px-2.5 py-0.5 lg:rounded-lg"
            v-if="dream.categoryDetails?.prophetic?.expectedByDate"
        >
            <AppSmartTime
                :date="dream.categoryDetails.prophetic.expectedByDate"
                :date-format="'do MMMM yyyy'"
            />
        </p>

        <div class="mb-3">
            <div class="mb-3 flex items-start justify-between gap-2">
                <div
                    class="text-text-secondary flex grow items-center justify-between gap-1.5 text-xs font-medium"
                >
                    <div class="flex items-center gap-1.5">
                        <Calendar class="h-3.5 w-3.5" />
                        <AppSmartTime
                            :date="dream.date"
                            :date-format="'do MMMM yyyy'"
                            :is-exact-date="true"
                        />
                    </div>
                </div>

                <!-- Флаги/Статусы -->
                <div class="flex items-center gap-1.5">
                    <FilePen v-if="dream.isDraft" class="text-accent h-3.5 w-3.5" />
                    <Pin v-if="dream.isPinned" class="text-accent h-3.5 w-3.5" />
                    <Star v-if="dream.isFavorite" class="text-accent h-3.5 w-3.5" />
                    <Lock v-if="dream.isPrivate" class="text-accent/80 h-3.5 w-3.5" />
                </div>
            </div>

            <div class="mb-6 flex flex-col gap-2">
                <h3 class="text-accent line-clamp-1 leading-snug font-semibold">
                    <RouterLink
                        :to="{ name: 'dream-details', params: { slug: dream.slug } }"
                        class="hover:text-primary transition-colors"
                    >
                        {{ dream.title || 'Безымянный сон' }}
                    </RouterLink>
                </h3>

                <p v-if="dream.description" class="text-text-primary line-clamp-3 leading-relaxed">
                    {{ dream.description }}
                </p>
            </div>

            <div
                v-if="hasAnalytics"
                class="border-border/60 mb-4 flex flex-col gap-x-3 gap-y-1.5 border-t pt-3 text-xs"
            >
                <div
                    v-if="dream.characters?.length"
                    class="text-text-secondary line-clamp-1 flex items-center gap-1.5"
                >
                    <Users class="h-3 w-3 shrink-0 opacity-70" />
                    <span class="text-text-primary line-clamp-1 font-medium">{{
                        dream.characters.join(', ')
                    }}</span>
                </div>
                <div
                    v-if="dream.locations?.length"
                    class="text-text-secondary line-clamp-1 flex items-center gap-1.5"
                >
                    <MapPin class="h-3 w-3 shrink-0 opacity-70" />
                    <span class="text-text-primary line-clamp-1 font-medium">{{
                        dream.locations.join(', ')
                    }}</span>
                </div>
                <div
                    v-if="dream.emotions?.length"
                    class="text-text-secondary line-clamp-1 flex items-center gap-1.5"
                >
                    <Smile class="h-3 w-3 shrink-0 opacity-70" />
                    <span class="text-text-primary line-clamp-1 font-medium">{{
                        dream.emotions.join(', ')
                    }}</span>
                </div>
            </div>
        </div>

        <footer class="flex items-center justify-end">
            <div class="text-text-secondary flex items-center gap-2 text-xs">
                <span
                    v-if="dream.interpretations?.length"
                    class="flex items-center gap-1"
                    title="Толкования"
                >
                    <BookOpen class="h-3.5 w-3.5 shrink-0" />
                    <span class="text-text-primary">{{ dream.interpretations.length }}</span>
                </span>
                <span
                    v-if="dream.relatedDreams?.length"
                    class="flex items-center gap-1"
                    title="Связанные сны"
                >
                    <Link2 class="h-3.5 w-3.5 shrink-0" />
                    <span class="text-text-primary">{{ dream.relatedDreams.length }}</span>
                </span>

                <RouterLink
                    :to="{ name: 'dream-details', params: { slug: dream.slug } }"
                    class="text-primary hover:text-primary/80 ml-1 inline-flex items-center p-0.5"
                >
                    <ChevronRight class="h-4 w-4" />
                </RouterLink>
            </div>
        </footer>
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
        FilePen,
    } from 'lucide-vue-next';
    import type { Dream } from '@/types/Dream';
    import AppSmartTime from '@/components/ui/AppSmartTime.vue';

    const props = defineProps<{
        dream: Dream;
    }>();

    const hasAnalytics = computed(() => {
        return Boolean(
            props.dream.characters?.length ||
            props.dream.locations?.length ||
            props.dream.emotions?.length,
        );
    });
</script>
