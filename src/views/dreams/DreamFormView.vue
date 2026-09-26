<template>
    <div class="container p-4 sm:p-6">
        <AppButton class="mb-8" @click="goBack()" size="xs" variant="back" :icon-left="MoveLeft">
            Назад
        </AppButton>

        <h1
            class="border-border-muted text-text-primary mb-4 border-t py-6 text-xl font-bold sm:text-2xl"
        >
            {{ isEditMode ? 'Редактировать сон ' : 'Записать новый сон' }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="border-border-muted flex w-full overflow-x-auto overflow-y-hidden border-b">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    type="button"
                    @click="activeTab = tab.id"
                    :class="[
                        '-mb-px rounded-t-md px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                        activeTab === tab.id
                            ? 'text-text-inverse bg-accent-active'
                            : 'text-text-secondary hover:text-text-primary border-transparent',
                    ]"
                >
                    {{ tab.label }}
                </button>
            </div>

            <!-- Контент вкладок с анимацией -->
            <div class="pt-2">
                <Transition name="fade" mode="out-in">
                    <!-- Вкладка 1: Основное -->
                    <div v-if="activeTab === 'main'" key="main" class="space-y-6">
                        <DreamMainSection
                            v-model:title="form.title"
                            v-model:description="form.description"
                            v-model:date="form.date"
                            v-model:time-of-day="form.timeOfDay"
                        />

                        <DreamCategorySection
                            v-model:categories="form.categories"
                            v-model:category-details="form.categoryDetails"
                            :dreamDate="form.date"
                        />

                        <DreamFlagSection
                            v-model:is-archived="form.isArchived"
                            v-model:is-draft="form.isDraft"
                            v-model:is-favorite="form.isFavorite"
                            v-model:is-pinned="form.isPinned"
                            v-model:is-private="form.isPrivate"
                            v-model:is-deleted="form.isDeleted"
                        />
                    </div>

                    <!-- Вкладка 2: Детали -->
                    <div v-else-if="activeTab === 'details'" key="details" class="space-y-6">
                        <DreamVisualSection
                            v-model:visualStyle="form.visualStyle"
                            v-model:perspective="form.perspective"
                            v-model:roles="form.roles"
                            v-model:sensations="form.sensations"
                        />

                        <DreamEventSection
                            v-model:phenomena="form.phenomena"
                            v-model:phenomena-details="form.phenomenaDetails"
                        />

                        <DreamEstimateSection
                            v-model:quality="form.quality"
                            v-model:clarity="form.clarity"
                            v-model:mood-after="form.moodAfter"
                        />
                    </div>

                    <!-- Вкладка 3: Аналитика -->
                    <div v-else-if="activeTab === 'analytics'" key="analytics" class="space-y-6">
                        <DreamAnalyticsSection
                            v-model:characters="form.characters"
                            v-model:locations="form.locations"
                            v-model:objects="form.objects"
                            v-model:emotions="form.emotions"
                        />
                    </div>

                    <!-- Вкладка 4: Контекст и толкования -->
                    <div v-else-if="activeTab === 'context'" key="context" class="space-y-6">
                        <div
                            class="border-border-muted bg-bg-primary/80 space-y-6 rounded-xl border p-4 sm:p-6"
                        >
                            <DreamContextSection
                                v-model:preSleepContext="form.preSleepContext"
                                v-model:personalNotes="form.personalNotes"
                            />

                            <DreamInterpretationSection
                                v-model:interpretations="form.interpretations"
                            />

                            <DreamRelatedSection
                                v-model:related-dreams="form.relatedDreams"
                                :slug="slug"
                            />
                        </div>
                    </div>
                </Transition>
            </div>

            <AppErrorMessage :error-message="sleepStore.error" />

            <!-- Кнопки управления (доступны из любой вкладки) -->
            <div class="border-border-muted flex items-center justify-end gap-3 border-t pt-4">
                <AppButton @click="goBack" variant="ghost">Отмена</AppButton>

                <AppButton size="xs" type="submit" variant="primary" :disabled="sleepStore.loading">
                    {{
                        sleepStore.loading ? 'Сохранение...' : isEditMode ? 'Сохранить' : 'Создать'
                    }}
                </AppButton>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { MoveLeft } from 'lucide-vue-next';
    import { useRoute, useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { formatToLocalDateStr } from '@/utils/date';
    import DreamCategorySection from '@/views/dreams/partials/DreamCategorySection.vue';
    import DreamEventSection from '@/views/dreams/partials/DreamEventSection.vue';
    import DreamMainSection from '@/views/dreams/partials/DreamMainSection.vue';
    import DreamVisualSection from '@/views/dreams/partials/DreamVisualSection.vue';
    import DreamEstimateSection from '@/views/dreams/partials/DreamEstimateSection.vue';
    import DreamAnalyticsSection from '@/views/dreams/partials/DreamAnalyticsSection.vue';
    import DreamContextSection from '@/views/dreams/partials/DreamContextSection.vue';
    import DreamInterpretationSection from '@/views/dreams/partials/DreamInterpretationSection.vue';
    import DreamRelatedSection from '@/views/dreams/partials/DreamRelatedSection.vue';
    import DreamFlagSection from '@/views/dreams/partials/DreamFlagSection.vue';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import type { DreamWrite } from '@/types/Dream';

    const props = defineProps<{ slug?: string }>();

    const route = useRoute();
    const router = useRouter();
    const sleepStore = useSleepStore();
    const sourceStore = useInterpretationSourceStore();

    const { goBack } = useNavigation();

    // ===== TABS SYSTEM =====
    type TabType = 'main' | 'details' | 'analytics' | 'context';

    const activeTab = ref<TabType>('main');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'main', label: 'Основное' },
        { id: 'details', label: 'Визуал и детали' },
        { id: 'analytics', label: 'Аналитика' },
        { id: 'context', label: 'Толкование и контекст' },
    ];
    // =======================

    const isEditMode = computed(() => Boolean(props.slug));

    const createInitialForm = (): DreamWrite => ({
        date: (route.query.date as string) || formatToLocalDateStr(),
        title: '',
        description: '',
        categories: [],
        categoryDetails: {},
        phenomena: [],
        phenomenaDetails: {},

        quality: 7,
        clarity: 7,
        moodAfter: 5,

        timeOfDay: 'night',
        visualStyle: 'color',
        perspective: 'irrelevant',
        roles: ['protagonist'],
        sensations: [],

        characters: [],
        locations: [],
        objects: [],
        emotions: [],

        interpretations: [],
        personalNotes: '',
        relatedDreams: [],
        preSleepContext: '',

        isFavorite: false,
        isPinned: false,
        isArchived: false,
        isDraft: false,
        isPrivate: true,
    });

    const form = ref<DreamWrite>(createInitialForm());
    const dreamId = ref<number | null>(null);

    onMounted(async () => {
        if (sourceStore.sources.length === 0) {
            sourceStore.init();
        }

        if (!isEditMode.value || !props.slug) return;

        if (sleepStore.loading) {
            await sleepStore.init();
        } else if (sleepStore.sleeps.length === 0) {
            await sleepStore.init();
        }

        const dreamSlug = props.slug;
        const existingDream = await sleepStore.getDreamBySlug(dreamSlug);

        dreamId.value = existingDream?.id || null;

        if (existingDream) {
            form.value = {
                date: existingDream.date,
                title: existingDream.title || '',
                description: existingDream.description || '',
                categories: [...(existingDream.categories || [])],
                categoryDetails: JSON.parse(JSON.stringify(existingDream.categoryDetails || {})),
                phenomena: [...(existingDream.phenomena || [])],
                phenomenaDetails: JSON.parse(JSON.stringify(existingDream.phenomenaDetails || {})),

                quality: existingDream.quality ?? 0,
                clarity: existingDream.clarity ?? 0,
                moodAfter: existingDream.moodAfter ?? 0,

                timeOfDay: existingDream.timeOfDay || 'night',
                visualStyle: existingDream.visualStyle || 'color',
                perspective: existingDream.perspective || 'irrelevant',
                roles: [...(existingDream.roles || ['protagonist'])],
                sensations: [...(existingDream.sensations || [])],

                characters: [...(existingDream.characters || [])],
                locations: [...(existingDream.locations || [])],
                objects: [...(existingDream.objects || [])],
                emotions: [...(existingDream.emotions || [])],

                interpretations: JSON.parse(JSON.stringify(existingDream.interpretations || [])),
                personalNotes: existingDream.personalNotes || '',
                relatedDreams: JSON.parse(JSON.stringify(existingDream.relatedDreams || [])),
                preSleepContext: existingDream.preSleepContext || '',

                isFavorite: existingDream.isFavorite ?? false,
                isPinned: existingDream.isPinned ?? false,
                isArchived: existingDream.isArchived ?? false,
                isDraft: existingDream.isDraft ?? false,
                isPrivate: existingDream.isPrivate ?? true,
            };
        } else {
            router.replace('/');
        }
    });

    const handleSubmit = async () => {
        const cleanedRelated = (form.value.relatedDreams || []).map((rel) => ({
            ...rel,
            dreamId: rel.dreamId ? Number(rel.dreamId) : undefined,
        }));

        const payload: DreamWrite = {
            ...form.value,
            relatedDreams: cleanedRelated,
        };

        if (isEditMode.value && props.slug && dreamId.value) {
            const targetId = Number(dreamId.value);
            const updatedDream = await sleepStore.updateDream(targetId, payload);

            if (updatedDream) {
                router.push({
                    name: 'dream-details',
                    params: { slug: updatedDream.slug },
                });
            }
        } else {
            const createdDream = await sleepStore.addDream(payload);

            if (sleepStore.error) return;

            if (createdDream && createdDream.slug) {
                router.push({
                    name: 'dream-details',
                    params: { slug: createdDream.slug },
                });
            } else {
                router.push({
                    name: 'day-details',
                    params: { date: payload.date },
                });
            }
        }
    };
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition:
            opacity 0.15s ease,
            transform 0.15s ease;
    }

    .fade-enter-from {
        opacity: 0;
        transform: translateY(4px);
    }

    .fade-leave-to {
        opacity: 0;
        transform: translateY(-4px);
    }
</style>
