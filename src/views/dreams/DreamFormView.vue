<template>
    <div class="mx-auto max-w-4xl p-4 sm:p-6">
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <AppButton @click="goBack" size="xs" variant="back" :icon-left="MoveLeft">
                    Назад
                </AppButton>

                <h1 class="text-text-primary text-xl font-bold sm:text-2xl">
                    {{ isEditMode ? 'Редактировать сон' : 'Записать сон' }}
                </h1>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <DreamMainSection
                v-model:title="form.title"
                v-model:description="form.description"
                v-model:date="form.date"
                v-model:time-of-day="form.timeOfDay"
            />

            <DreamCategorySection
                v-model:categories="form.categories"
                v-model:category-details="form.categoryDetails"
            />

            <DreamEventSection
                v-model:phenomena="form.phenomena"
                v-model:phenomena-details="form.phenomenaDetails"
            />

            <DreamVisualSection
                v-model:visualStyle="form.visualStyle"
                v-model:perspective="form.perspective"
                v-model:roles="form.roles"
                v-model:sensations="form.sensations"
            />

            <DreamEstimateSection
                v-model:quality="form.quality"
                v-model:clarity="form.clarity"
                v-model:mood-after="form.moodAfter"
            />

            <DreamAnalyticsSection
                v-model:characters="form.characters"
                v-model:locations="form.locations"
                v-model:objects="form.objects"
                v-model:emotions="form.emotions"
            />

            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <DreamContextSection
                    v-model:preSleepContext="form.preSleepContext"
                    v-model:personalNotes="form.personalNotes"
                />

                <DreamInterpretationSection v-model:interpretations="form.interpretations" />

                <DreamRelatedSection v-model:related-dreams="form.relatedDreams" :slug="slug" />
            </div>

            <DreamFlagSection
                v-model:is-archived="form.isArchived"
                v-model:is-draft="form.isDraft"
                v-model:is-favorite="form.isFavorite"
                v-model:is-pinned="form.isPinned"
                v-model:is-private="form.isPrivate"
            />

            <AppErrorMessage :error-message="sleepStore.error" />

            <div class="flex items-center justify-end gap-3 pt-4">
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
        //  подгружаем источники интерпретаций
        if (sourceStore.sources.length === 0) {
            sourceStore.init();
        }

        if (!isEditMode.value || !props.slug) return;

        // 1. Ждем инициализации стора, если репозиторий еще не подгружен
        if (sleepStore.loading) {
            // Если инициализация еще идет в App.vue или во внешнем триггере,
            // даем стору заполниться. Либо вызываем init() напрямую:
            await sleepStore.init();
        } else if (sleepStore.sleeps.length === 0) {
            // Если стор не загружался совсем
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
            // Только если стор точно инициализирован и запись не найдена
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
            // --- РЕДАКТИРОВАНИЕ ---

            const targetId = Number(dreamId.value);
            const updatedDream = await sleepStore.updateDream(targetId, payload);

            if (updatedDream) {
                router.push({
                    name: 'dream-details',
                    params: { slug: props.slug },
                });
            }
        } else {
            // --- СОЗДАНИЕ ---
            const createdDream = await sleepStore.addDream(payload);

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
