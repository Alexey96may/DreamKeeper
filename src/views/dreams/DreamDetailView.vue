<template>
    <main
        class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen pb-12"
        aria-label="Детальный просмотр сна"
    >
        <div class="container mx-auto max-w-3xl px-4 py-6">
            <!-- Верхняя навигация -->
            <div class="mb-4 flex items-center justify-between">
                <AppButton @click="goBack" size="xs" variant="back" :icon-left="MoveLeft">
                    Назад
                </AppButton>

                <!-- Статусные бейджи сна -->
                <div v-if="dream" class="flex items-center gap-2">
                    <span
                        v-if="dream.isDraft"
                        class="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500"
                    >
                        Черновик
                    </span>
                    <span
                        v-if="dream.isArchived"
                        class="rounded border border-gray-500/20 bg-gray-500/10 px-2 py-0.5 text-xs font-semibold text-gray-400"
                    >
                        В архиве
                    </span>
                    <span
                        v-if="dream.isPrivate"
                        class="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-400"
                        title="Приватный сон"
                    >
                        <Lock class="inline" /> Приватный
                    </span>
                </div>
            </div>

            <!-- Индикатор загрузки -->
            <div
                v-if="sleepStore.loading && !dream"
                role="status"
                aria-live="polite"
                class="dream-card text-text-mute p-8 text-center"
            >
                Загрузка данных о сне...
            </div>

            <!-- Карточка сна -->
            <article
                v-else-if="dream"
                class="dream-card space-y-6 p-6 sm:p-8"
                aria-labelledby="dream-title"
            >
                <!-- 1. Шапка: Заголовок, дата, время суток и флаги (избранное/закреплено) -->
                <header class="border-border/50 border-b pb-5">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center justify-between gap-2">
                            <CalendarDays />
                            <AppSmartTime :date="dream.date" :date-format="'do MMMM yyyy'" />
                        </div>

                        <div class="flex items-center gap-2 text-lg">
                            <span v-if="dream.isFavorite" title="В избранном"><Star /></span>
                            <span v-if="dream.isPinned" title="Закреплено"><Pin /></span>
                            <span
                                v-if="dream.timeOfDay"
                                class="bg-bg-secondary text-text-soft rounded-full px-3 py-0.5 text-xs font-medium"
                            >
                                {{ TIME_OF_DAY_MAP[dream.timeOfDay].label }}
                            </span>
                        </div>
                    </div>

                    <h1
                        id="dream-title"
                        class="text-text-primary mt-3 text-2xl font-bold sm:text-3xl"
                    >
                        {{ dream.title }}
                    </h1>

                    <!-- Основные категории -->
                    <div
                        v-if="dream.categories?.length"
                        class="mt-3 flex flex-wrap gap-2"
                        aria-label="Категории сна"
                    >
                        <span
                            v-for="cat in dream.categories"
                            :key="cat"
                            class="bg-accent/15 text-accent border-accent/20 rounded-md border px-2.5 py-1 text-xs font-semibold"
                        >
                            {{ DREAM_CATEGORY_MAP[cat].label }}
                        </span>
                    </div>
                </header>

                <!-- 2. Оценки (Качество, Ясность, Настроение после) -->
                <section
                    v-if="hasRatings"
                    class="bg-bg-secondary/40 border-border/40 rounded-xl border p-4"
                    aria-label="Оценки сна"
                >
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div v-if="dream.quality !== undefined && dream.quality > 0">
                            <span class="text-text-mute block text-xs">Качество</span>
                            <span class="text-text-primary text-lg font-bold">
                                {{ dream.quality }}/10
                            </span>
                        </div>

                        <div v-if="dream.clarity !== undefined && dream.clarity > 0">
                            <span class="text-text-mute block text-xs">Ясность</span>
                            <span class="text-text-primary text-lg font-bold">
                                {{ dream.clarity }}/10
                            </span>
                        </div>

                        <div v-if="dream.moodAfter !== undefined && dream.moodAfter > 0">
                            <span class="text-text-mute block text-xs">Настроение после</span>
                            <span class="text-text-primary text-lg font-bold">
                                {{ dream.moodAfter }}/10
                            </span>
                        </div>
                    </div>
                </section>

                <!-- 3. Контекст перед сном -->
                <section
                    v-if="preSleepContextText"
                    class="rounded-r-lg border-l-4 border-amber-500/50 bg-amber-500/5 p-3.5"
                >
                    <h2 class="text-xs font-bold tracking-wider text-amber-500 uppercase">
                        <ArrowBigLeftDash /> Перед сном
                    </h2>
                    <p class="text-text-primary mt-1 text-sm leading-relaxed italic">
                        {{ preSleepContextText }}
                    </p>
                </section>

                <!-- 4. Основное описание сна -->
                <section v-if="dream.description">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Описание
                    </h2>
                    <p class="text-text-primary mt-2 text-base leading-relaxed whitespace-pre-line">
                        {{ dream.description }}
                    </p>
                </section>

                <!-- 5. Детали категорий (Lucid, Nightmare, Prophetic) -->
                <section v-if="hasCategoryDetails" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Детали категорий
                    </h2>

                    <!-- Осознанный сон -->
                    <div
                        v-if="dream.categoryDetails?.lucid"
                        class="bg-bg-secondary/30 border-border/30 space-y-1.5 rounded-lg border p-3.5 text-xs"
                    >
                        <div class="text-accent font-bold">
                            <component :is="DREAM_CATEGORY_MAP['lucid'].icon" />
                            {{ DREAM_CATEGORY_MAP['lucid'].label }}
                        </div>
                        <div
                            v-if="
                                dream.categoryDetails.lucid.controlLevel !== undefined &&
                                dream.categoryDetails.lucid.controlLevel > 0
                            "
                        >
                            <span class="text-text-mute">Уровень контроля:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ dream.categoryDetails.lucid.controlLevel }}/10
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.lucid.trigger">
                            <span class="text-text-mute">Триггер осознания:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                {{ LUCID_TRIGGER_MAP[dream.categoryDetails.lucid.trigger].label }}
                            </span>
                        </div>
                    </div>

                    <!-- Кошмар -->
                    <div
                        v-if="dream.categoryDetails?.nightmare"
                        class="space-y-1.5 rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs"
                    >
                        <div class="font-bold text-red-400">
                            <component :is="DREAM_CATEGORY_MAP['nightmare'].icon" />
                            {{ DREAM_CATEGORY_MAP['nightmare'].label }}
                        </div>
                        <div
                            v-if="
                                dream.categoryDetails.nightmare.fearLevel !== undefined &&
                                dream.categoryDetails.nightmare.fearLevel > 0
                            "
                        >
                            <span class="text-text-mute">Уровень страха:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ dream.categoryDetails.nightmare.fearLevel }}/10
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.nightmare.copingMechanism">
                            <span class="text-text-mute">Как справился:</span>
                            <p class="text-text-primary mt-0.5">
                                {{ dream.categoryDetails.nightmare.copingMechanism }}
                            </p>
                        </div>
                        <div
                            v-if="dream.categoryDetails.nightmare.hasPhysicalResponse !== undefined"
                        >
                            <span class="text-text-mute">Физическая реакция:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                {{
                                    dream.categoryDetails.nightmare.hasPhysicalResponse
                                        ? 'Да'
                                        : 'Нет'
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- Вещий сон -->
                    <div
                        v-if="dream.categoryDetails?.prophetic"
                        class="space-y-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs"
                    >
                        <div class="font-bold text-indigo-400">
                            <component :is="DREAM_CATEGORY_MAP['prophetic'].icon" />
                            {{ DREAM_CATEGORY_MAP['prophetic'].label }}
                        </div>
                        <div v-if="dream.categoryDetails.prophetic.isFulfilled !== undefined">
                            <span class="text-text-mute">Статус:</span>
                            <span
                                :class="
                                    dream.categoryDetails.prophetic.isFulfilled
                                        ? 'text-emerald-400'
                                        : 'text-amber-400'
                                "
                                class="ml-1 font-bold"
                            >
                                {{
                                    dream.categoryDetails.prophetic.isFulfilled
                                        ? 'Сбылся'
                                        : 'Ожидает исполнения'
                                }}
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.prophetic.expectedByDate">
                            <span class="text-text-mute">Ожидался до:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                <AppSmartTime
                                    :date="dream.categoryDetails.prophetic.expectedByDate"
                                />
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.prophetic.fulfilledDate">
                            <span class="text-text-mute">Сбылся:</span>
                            <span class="text-text-primary ml-1 font-medium">
                                <AppSmartTime
                                    :date="dream.categoryDetails.prophetic.fulfilledDate"
                                />
                            </span>
                        </div>
                        <div v-if="dream.categoryDetails.prophetic.fulfillmentNotes">
                            <span class="text-text-mute">Что произошло:</span>
                            <p class="text-text-primary mt-0.5">
                                {{ dream.categoryDetails.prophetic.fulfillmentNotes }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 6. Особые явления (Phenomena) и их детали -->
                <section v-if="dream.phenomena?.length" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Феномены и особые события
                    </h2>

                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="item in dream.phenomena"
                            :key="item"
                            class="bg-bg-secondary text-text-primary rounded-md px-2.5 py-1 text-xs font-medium"
                        >
                            {{ DREAM_PHENOMENON_MAP[item].label }}
                        </span>
                    </div>

                    <!-- Детали феноменов -->
                    <div
                        v-if="dream.phenomenaDetails"
                        class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2"
                    >
                        <!-- Сонный паралич -->
                        <div
                            v-if="dream.phenomenaDetails.paralysis"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['paralysis'].icon" />
                                {{ DREAM_PHENOMENON_MAP['paralysis'].label }}</span
                            >
                            <p
                                v-if="dream.phenomenaDetails.paralysis.timing"
                                class="text-text-mute"
                            >
                                Время:
                                {{
                                    PARALYSIS_TIMING_MAP[dream.phenomenaDetails.paralysis.timing]
                                        .label
                                }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.paralysis.hallucinations?.length"
                                class="text-text-mute mt-1"
                            >
                                Галлюцинации:
                                {{
                                    dream.phenomenaDetails.paralysis.hallucinations
                                        .map((e) => PARALYSIS_HALLUCINATIONS_MAP[e].label)
                                        .join(', ')
                                }}
                            </p>
                        </div>

                        <!-- Ложное пробуждение -->
                        <div
                            v-if="dream.phenomenaDetails.nestedDream"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['nested_dream'].icon" />{{
                                    DREAM_PHENOMENON_MAP['nested_dream'].label
                                }}</span
                            >
                            <p class="text-text-mute">
                                Уровней вложенности:
                                {{ dream.phenomenaDetails.nestedDream.nestingLevels ?? 1 }}
                            </p>
                        </div>

                        <!-- Смерть -->
                        <div
                            v-if="dream.phenomenaDetails.death"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['death'].icon" />
                                {{ DREAM_PHENOMENON_MAP['death'].label }}</span
                            >
                            <p v-if="dream.phenomenaDetails.death.cause" class="text-text-mute">
                                Причина:
                                {{ DEATH_CAUSE_MAP[dream.phenomenaDetails.death.cause].label }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.death.aftermath"
                                class="text-text-mute mt-0.5"
                            >
                                После смерти:
                                {{
                                    DEATH_AFTERMATH_MAP[dream.phenomenaDetails.death.aftermath]
                                        .label
                                }}
                            </p>
                        </div>

                        <!-- Полёт -->
                        <div
                            v-if="dream.phenomenaDetails.flying"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['flying'].icon" />
                                {{ DREAM_PHENOMENON_MAP['flying'].label }}</span
                            >
                            <p v-if="dream.phenomenaDetails.flying.type" class="text-text-mute">
                                Стиль:
                                {{ FLYING_TYPE_MAP[dream.phenomenaDetails.flying.type].label }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.flying.altitude"
                                class="text-text-mute mt-0.5"
                            >
                                Высота:
                                {{
                                    FLYING_ALTITUDE_MAP[dream.phenomenaDetails.flying.altitude]
                                        .label
                                }}
                            </p>
                        </div>

                        <!-- Падение -->
                        <div
                            v-if="dream.phenomenaDetails.falling"
                            class="bg-bg-secondary/30 rounded-lg p-3"
                        >
                            <span class="text-text-primary mb-1 block font-bold"
                                ><component :is="DREAM_PHENOMENON_MAP['falling'].icon" />
                                {{ DREAM_PHENOMENON_MAP['falling'].label }}</span
                            >
                            <p v-if="dream.phenomenaDetails.falling.origin" class="text-text-mute">
                                Откуда:
                                {{
                                    FALLING_ORIGIN_MAP[dream.phenomenaDetails.falling.origin].label
                                }}
                            </p>
                            <p
                                v-if="dream.phenomenaDetails.falling.outcome"
                                class="text-text-mute mt-0.5"
                            >
                                Итог:
                                {{
                                    FALLING_OUTCOME_MAP[dream.phenomenaDetails.falling.outcome]
                                        .label
                                }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 7. Восприятие и Стиль (Визуал, Перспектива, Роли, Ощущения) -->
                <section v-if="hasPerceptionDetails" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Восприятие
                    </h2>

                    <div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                        <div v-if="dream.visualStyle" class="bg-bg-secondary/30 rounded-lg p-2.5">
                            <span class="text-text-mute">Визуальный стиль:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ VISUAL_STYLE_MAP[dream.visualStyle].label }}
                            </span>
                        </div>

                        <div v-if="dream.perspective" class="bg-bg-secondary/30 rounded-lg p-2.5">
                            <span class="text-text-mute">Перспектива:</span>
                            <span class="text-text-primary ml-1 font-semibold">
                                {{ PERSPECTIVE_MAP[dream.perspective].label }}
                            </span>
                        </div>
                    </div>

                    <!-- Роли -->
                    <div v-if="dream.roles?.length" class="space-y-1">
                        <span class="text-text-mute text-xs">Роль в сюжетe:</span>
                        <div class="flex flex-wrap gap-1.5">
                            <span
                                v-for="role in dream.roles"
                                :key="role"
                                class="bg-bg-secondary text-text-primary rounded px-2 py-0.5 text-xs font-medium"
                            >
                                {{ PARTICIPANT_ROLE_MAP[role].label }}
                            </span>
                        </div>
                    </div>

                    <!-- Органы чувств -->
                    <div v-if="dream.sensations?.length" class="space-y-1">
                        <span class="text-text-mute text-xs">Сенсорные ощущения:</span>
                        <div class="flex flex-wrap gap-1.5">
                            <span
                                v-for="sensation in dream.sensations"
                                :key="sensation"
                                class="bg-bg-secondary text-text-primary rounded px-2 py-0.5 text-xs"
                            >
                                {{ SENSORY_ASPECT_MAP[sensation].label }}
                            </span>
                        </div>
                    </div>
                </section>

                <!-- 8. Аналитика (Персонажи, Локации, Предметы, Эмоции) -->
                <section v-if="hasAnalytics" class="space-y-3">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Аналитические элементы
                    </h2>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div
                            v-if="dream.characters?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">Персонажи:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.characters.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.locations?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">Локации:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.locations.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.objects?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">Предметы:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.objects.join(', ') }}
                            </p>
                        </div>

                        <div
                            v-if="dream.emotions?.length"
                            class="bg-bg-secondary/30 rounded-lg p-3 text-xs"
                        >
                            <span class="text-text-mute mb-1 block font-medium">Эмоции:</span>
                            <p class="text-text-primary font-medium">
                                {{ dream.emotions.join(', ') }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 9. Интерпретация / Сонник -->
                <section v-if="interpretationsWithSource.length" class="space-y-2">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Интерпретации
                    </h2>
                    <div class="space-y-2">
                        <div
                            v-for="(interp, idx) in interpretationsWithSource"
                            :key="idx"
                            class="bg-bg-secondary/40 border-border/40 rounded-lg border p-3.5 text-xs"
                        >
                            <div class="flex items-center justify-between">
                                <span class="text-text-primary text-sm font-bold">
                                    <Link class="inline" /> {{ interp.tag }}
                                </span>
                                <div class="flex items-center gap-2">
                                    <span
                                        v-if="
                                            interp.isAccurate !== undefined &&
                                            interp.isAccurate !== null
                                        "
                                        class="text-[10px]"
                                    >
                                        <component :is="interp.isAccurate ? Check : X"></component>
                                        {{ interp.isAccurate ? ' Подтверждено' : ' Не совпало' }}
                                    </span>
                                    <span
                                        class="bg-bg-secondary text-text-mute rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                                    >
                                        {{ interp.source.title }}
                                    </span>
                                </div>
                            </div>
                            <p class="text-text-mute mt-1.5 leading-relaxed">
                                {{ interp.meaning }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 10. Личные заметки -->
                <section v-if="dream.personalNotes">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Личные заметки
                    </h2>
                    <p
                        class="text-text-primary bg-bg-secondary/30 border-border/30 mt-1.5 rounded-lg border p-3.5 text-xs leading-relaxed italic"
                    >
                        {{ dream.personalNotes }}
                    </p>
                </section>

                <!-- 11. Связанные сны -->
                <section v-if="dream.relatedDreams?.length" class="space-y-2">
                    <h2 class="text-text-soft text-xs font-semibold tracking-wider uppercase">
                        Связанные сны
                    </h2>
                    <ul class="space-y-2" role="list">
                        <li v-for="(rel, idx) in relatedDreams" :key="idx">
                            <div
                                class="bg-bg-secondary/40 border-border/40 flex flex-col justify-between gap-1 rounded-lg border p-2.5 text-xs sm:flex-row sm:items-center"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-accent font-semibold">
                                        {{ DREAM_RELATION_MAP[rel?.relationType]?.label }}
                                    </span>
                                    <router-link
                                        v-if="rel?.slug"
                                        :to="`/dream/${rel?.slug}`"
                                        class="text-text-primary font-bold hover:underline"
                                    >
                                        → Сон "{{ rel?.title }}"
                                    </router-link>
                                </div>
                                <span v-if="rel?.note" class="text-text-mute italic">
                                    "{{ rel?.note }}"
                                </span>
                            </div>
                        </li>
                    </ul>
                </section>

                <!-- Метаданные создания / редактирования -->
                <footer class="border-border/30 text-text-mute space-y-1 border-t pt-4 text-[11px]">
                    <p v-if="dream.createdAt">
                        <span class="font-medium">Создано: </span>
                        <AppSmartTime :date="dream.createdAt" />
                    </p>
                    <p v-if="dream.updatedAt">
                        <span class="font-medium">Изменено: </span>
                        <AppSmartTime :date="dream.updatedAt" />
                    </p>
                </footer>

                <!-- Кнопки управления -->
                <div class="border-border/50 mt-6 flex items-center justify-between border-t pt-4">
                    <AppButton
                        @click="handleDelete(dream.id, dream.date)"
                        size="xs"
                        variant="danger"
                        :disabled="isDeleting(dream.id)"
                    >
                        Удалить
                    </AppButton>

                    <AppButton
                        @click="goToEdit(slug)"
                        size="xs"
                        variant="primary"
                        :disabled="isDeleting(dream.id)"
                    >
                        Редактировать
                    </AppButton>
                </div>
            </article>

            <!-- Пустое состояние -->
            <div v-else role="status" aria-live="polite" class="dream-card p-8 text-center">
                <p class="text-text-mute">Сон не найден</p>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import {
        CalendarDays,
        Star,
        Pin,
        Lock,
        Link,
        MoveLeft,
        Check,
        X,
        ArrowBigLeftDash,
    } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';
    import { useCrud } from '@/composables/crud';
    import AppSmartTime from '@/components/ui/AppSmartTime.vue';
    import { useNavigation } from '@/composables/routing/useNavigation';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';

    import {
        TIME_OF_DAY_MAP,
        DREAM_CATEGORY_MAP,
        DREAM_PHENOMENON_MAP,
        DEATH_CAUSE_MAP,
        DEATH_AFTERMATH_MAP,
        FLYING_TYPE_MAP,
        FLYING_ALTITUDE_MAP,
        FALLING_ORIGIN_MAP,
        FALLING_OUTCOME_MAP,
        PARALYSIS_TIMING_MAP,
        PARALYSIS_HALLUCINATIONS_MAP,
        LUCID_TRIGGER_MAP,
        DREAM_RELATION_MAP,
        VISUAL_STYLE_MAP,
        PERSPECTIVE_MAP,
        PARTICIPANT_ROLE_MAP,
        SENSORY_ASPECT_MAP,
    } from '@/constants/Dream';

    const props = defineProps<{
        slug: string;
    }>();

    const sleepStore = useSleepStore();
    const sourceStore = useInterpretationSourceStore();

    const { handleDelete, isDeleting } = useCrud();

    const { goToEdit, goBack } = useNavigation();

    // Преобразуем строковый route param в number согласно интерфейсу Dream
    const dream = computed(() => {
        if (!props.slug) return null;
        return sleepStore.sleeps.find((s) => s.slug === props.slug) || null;
    });

    // Обработка PreSleepContext (с учётом PascalCase из интерфейса)
    const preSleepContextText = computed(() => {
        if (!dream.value) return '';
        return dream.value.preSleepContext || '';
    });

    // Наличие различных блоков
    const hasRatings = computed(() => {
        if (!dream.value) return false;
        return (
            (dream.value.quality !== undefined && dream.value.quality > 0) ||
            (dream.value.clarity !== undefined && dream.value.clarity > 0) ||
            (dream.value.moodAfter !== undefined && dream.value.moodAfter > 0)
        );
    });

    const hasCategoryDetails = computed(() => {
        if (!dream.value?.categoryDetails) return false;
        const d = dream.value.categoryDetails;
        return !!(d.lucid || d.nightmare || d.prophetic);
    });

    const hasPerceptionDetails = computed(() => {
        if (!dream.value) return false;
        return !!(
            dream.value.visualStyle ||
            dream.value.perspective ||
            dream.value.roles?.length ||
            dream.value.sensations?.length
        );
    });

    const hasAnalytics = computed(() => {
        if (!dream.value) return false;
        return !!(
            dream.value.characters?.length ||
            dream.value.locations?.length ||
            dream.value.objects?.length ||
            dream.value.emotions?.length
        );
    });

    const relatedDreams = computed(() => {
        if (!dream.value?.relatedDreams?.length) return [];

        return dream.value.relatedDreams
            .map((rel) => {
                if (!rel.dreamId) return null;

                const dreamInStore = sleepStore.getDreamById(rel.dreamId);
                if (!dreamInStore) return null;

                return {
                    ...dreamInStore,
                    note: rel.note ?? '',
                    relationType: rel.relationType ?? null,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    });

    const interpretationsWithSource = computed(() => {
        // Проверяем, есть ли вообще массив интерпретаций у сна
        if (!dream.value?.interpretations?.length) return [];

        return dream.value.interpretations
            .map((item) => {
                const sourceId = item.sourceId;
                if (!Number.isInteger(sourceId)) return null;

                const sourceInStore = sourceStore.getSourceById(sourceId);
                if (!sourceInStore) return null;

                return {
                    ...item,
                    source: sourceInStore,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    });

    onMounted(() => {
        if (sourceStore.sources.length === 0) {
            sourceStore.init();
        }
    });
</script>
