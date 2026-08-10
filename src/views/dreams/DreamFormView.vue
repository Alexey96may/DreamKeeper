<template>
    <div class="mx-auto max-w-4xl p-4 sm:p-6">
        <!-- Шапка -->
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
            <!-- 1. Основные поля -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Дата -->
                    <AppDatePicker
                        v-model="form.date"
                        label="Дата сна"
                        hint="Укажите дату, когда вам приснился сон"
                        required
                    />

                    <!-- Время суток -->
                    <AppSelect
                        id="form-time-of-day"
                        v-model="form.timeOfDay"
                        label="Время суток"
                        :options="timeOfDayOptions"
                        placeholder="Выберите время суток"
                    />
                </div>

                <!-- Заголовок -->
                <AppTextInput
                    v-model="form.title"
                    label="Название сна"
                    placeholder="Например: Полет над древним городом..."
                    required
                />

                <!-- Описание -->
                <AppTextarea
                    v-model="form.description"
                    label="Подробное описание"
                    placeholder="Запишите все подробности, пока они свежи в памяти..."
                    required
                    :rows="5"
                />
            </div>

            <!-- 2. Категории и детализация (categoryDetails) -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <AppTagSelect
                    v-model="form.categories"
                    label="Категории сна"
                    @change="handleCategoryChange"
                    :options="availableCategories"
                />

                <!-- Детали категории LUCID -->
                <div
                    v-if="form.categories.includes('lucid')"
                    class="border-accent/30 bg-accent/5 space-y-3 rounded-lg border p-3"
                >
                    <h4 class="text-accent text-xs font-semibold">
                        Параметры Осознанного Сна (Lucid)
                    </h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AppRange
                            v-model.number="ensureCategoryDetails().lucid!.controlLevel"
                            label="Уровень контроля"
                            :min="1"
                            :max="10"
                            :step="1"
                            :value-formatter="(val, max) => `${val} / ${max}`"
                        />

                        <AppSelect
                            v-model="ensureCategoryDetails().lucid!.trigger"
                            label="Триггер осознания"
                            :options="lucidTriggerOptions"
                        />
                    </div>
                </div>

                <!-- Детали категории NIGHTMARE -->

                <div
                    v-if="form.categories.includes('nightmare')"
                    class="space-y-3 rounded-lg border border-red-500/30 bg-red-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-red-400">
                        Параметры Кошмара (Nightmare)
                    </h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AppRange
                            v-model="form.clarity"
                            label="Уровень страха"
                            :min="1"
                            :max="10"
                            :step="1"
                            :value-formatter="(val, max) => `${val} / ${max}`"
                        />

                        <AppCheckbox
                            v-model="ensureCategoryDetails().nightmare!.hasPhysicalResponse"
                            label="Физическая реакция (пульс, пот, испуг)"
                            accent-color="bg-red-500 border-red-500"
                        />
                    </div>

                    <AppTextInput
                        v-model="ensureCategoryDetails().nightmare!.copingMechanism"
                        label="Как справился / Завершение"
                        placeholder="Проснулся от крика, дал отпор..."
                    />
                </div>

                <!-- Детали категории PROPHETIC -->
                <div
                    v-if="form.categories.includes('prophetic')"
                    class="space-y-3 rounded-lg border border-purple-500/30 bg-purple-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-purple-400">
                        Параметры Вещего Сна (Prophetic)
                    </h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <AppDatePicker
                            v-model="ensureCategoryDetails().prophetic!.expectedByDate"
                            label="Ожидаемый срок"
                            hint="Укажите дату, к которой сон должен реализоваться"
                        />

                        <AppDatePicker
                            v-model="ensureCategoryDetails().prophetic!.fulfilledDate"
                            label="Дата исполнения"
                            hint="Укажите дату, к которой сон реализовался"
                        />

                        <AppCheckbox
                            v-model="ensureCategoryDetails().prophetic!.isFulfilled"
                            label="Уже сбылся"
                            accent-color="bg-purple-500 border-purple-500"
                        />
                    </div>

                    <AppTextInput
                        v-model="ensureCategoryDetails().prophetic!.fulfillmentNotes"
                        label="Что именно произошло в реальности"
                        placeholder="Описание события в реальной жизни..."
                    />
                </div>
            </div>

            <!-- 3. Особые явления и их детализация (phenomenaDetails) -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <AppTagSelect
                    v-model="form.phenomena"
                    label="Феномены и события во сне"
                    @change="handlePhenomenaChange"
                    :options="availablePhenomena"
                />

                <!-- Детали: ПОЛЁТ -->
                <div
                    v-if="form.phenomena?.includes('flying')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали полёта</h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AppSelect
                            v-model="ensurePhenomenaDetails().flying!.type"
                            :options="flyingTypeOptions"
                            label="Стиль полёта"
                        />

                        <AppSelect
                            v-model="ensurePhenomenaDetails().flying!.altitude"
                            :options="flyingAltitudeOptions"
                            label="Высота"
                        />
                    </div>
                </div>

                <!-- Детали: ПАДЕНИЕ -->
                <div
                    v-if="form.phenomena?.includes('falling')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали падения</h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AppSelect
                            v-model="ensurePhenomenaDetails().falling!.origin"
                            :options="fallingOriginOptions"
                            label="Откуда падение"
                        />

                        <AppSelect
                            v-model="ensurePhenomenaDetails().falling!.outcome"
                            :options="fallingOutcomeOptions"
                            label="Чем закончилось"
                        />
                    </div>
                </div>

                <!-- Детали: СМЕРТЬ -->
                <div
                    v-if="form.phenomena?.includes('death')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали смерти во сне</h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AppSelect
                            v-model="ensurePhenomenaDetails().death!.cause"
                            :options="deathCauseOptions"
                            label="Причина / Контекст"
                        />

                        <AppSelect
                            v-model="ensurePhenomenaDetails().death!.aftermath"
                            :options="deathAftermathOptions"
                            label="Что произошло сразу после"
                        />
                    </div>
                </div>

                <!-- Детали: СОННЫЙ ПАРАЛИЧ -->
                <div
                    v-if="form.phenomena?.includes('paralysis')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали сонного паралича</h4>

                    <AppSelect
                        v-model="ensurePhenomenaDetails().paralysis!.timing"
                        :options="paralysisTimingOptions"
                        label="Момент возникновения"
                    />
                </div>

                <!-- Детали: ЛОЖНОЕ ПРОБУЖДЕНИЕ -->
                <div
                    v-if="form.phenomena?.includes('nested_dream')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">
                        Детали ложного пробуждения
                    </h4>

                    <AppNumberInput
                        v-model.number="ensurePhenomenaDetails().nestedDream!.nestingLevels"
                        label="Уровень вложенности (сколько раз «просыпался»)"
                        :min="1"
                        :max="1000"
                        :step="1"
                        :formatter="(val) => `${val} раз`"
                    />
                </div>
            </div>

            <!-- 4. Визуальный стиль, Перспектива и Роли -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <AppSelect
                        v-model="form.visualStyle"
                        :options="availableVisualStyles"
                        label="Визуальный стиль"
                    />

                    <AppSelect
                        v-model="form.perspective"
                        :options="availablePerspectives"
                        label="Точка зрения (Перспектива)"
                    />
                </div>

                <!-- Роли -->
                <AppTagSelect
                    v-model="form.roles"
                    label="Ваши роли во сне"
                    :options="availableRoles"
                />

                <!-- Органы чувств -->
                <AppTagSelect
                    v-model="form.sensations"
                    label="Ощущения / Органы чувств"
                    :options="availableSensations"
                />
            </div>

            <!-- 5. Оценки -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <AppRange
                        v-model.number="form.quality"
                        label="Качество сна"
                        :min="1"
                        :max="10"
                        :step="1"
                        :value-formatter="(val, max) => `${val} / ${max}`"
                    />

                    <AppRange
                        v-model.number="form.clarity"
                        label="Ясность / Яркость"
                        :min="1"
                        :max="10"
                        :step="1"
                        :value-formatter="(val, max) => `${val} / ${max}`"
                    />

                    <AppRange
                        v-model.number="form.moodAfter"
                        label="Настроение после"
                        :min="1"
                        :max="10"
                        :step="1"
                        :value-formatter="(val, max) => `${val} / ${max}`"
                    />
                </div>
            </div>

            <!-- 6. Сущности / Аналитика -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <AppTextInput
                        v-model="rawArrays.characters"
                        label="Персонажи (через запятую)"
                        placeholder="Друг, Незнакомец в маске..."
                    />

                    <AppTextInput
                        v-model="rawArrays.locations"
                        label="Локации (через запятую)"
                        placeholder="Старый дом, Космодром..."
                    />

                    <AppTextInput
                        v-model="rawArrays.objects"
                        label="Предметы (через запятую)"
                        placeholder="Ключ, Старинная книга..."
                    />

                    <AppTextInput
                        v-model="rawArrays.emotions"
                        label="Эмоции (через запятую)"
                        placeholder="Страх, Удивление, Восторг..."
                    />
                </div>
            </div>

            <!-- 7. Контекст, Толкования и Связанные сны -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <AppTextInput
                    v-model="form.PreSleepContext"
                    label="Контекст перед сном"
                    placeholder="Смотрел фильм, был уставшим, пил чай..."
                />

                <AppTextInput
                    v-model="form.personalNotes"
                    label="Личные заметки / Анализ"
                    placeholder="Мысли о том, с чем сон может быть связан..."
                />

                <!-- Толкования -->
                <div class="border-border border-t pt-2">
                    <div class="mb-3 flex items-center justify-between">
                        <span class="text-text-soft text-xs font-medium">Толкования и символы</span>

                        <AppButton @click="addInterpretation" variant="add" :icon-left="PlusIcon">
                            Добавить символ
                        </AppButton>
                    </div>

                    <div
                        v-for="(interp, idx) in form.interpretations"
                        :key="idx"
                        class="mb-2 flex items-center gap-2"
                    >
                        <AppTextInput v-model="interp.tag" placeholder="Символ (напр. Вода)" />

                        <AppTextInput
                            v-model="interp.meaning"
                            placeholder="Значение / Толкование"
                        />

                        <AppCheckbox
                            v-model="interp.isAccurate"
                            label="Сбылось"
                            accent-color="bg-red-500 border-red-500"
                            hint="Толкование сна подтвердилось в реальности?"
                        />

                        <AppButton
                            size="xs"
                            @click="removeInterpretation(idx)"
                            variant="danger"
                            :icon-left="X"
                        />
                    </div>
                </div>

                <!-- Связи с другими снами -->
                <div class="border-border border-t pt-2">
                    <div class="mb-3 flex items-center justify-between">
                        <span class="text-text-soft text-xs font-medium">Связанные сны</span>

                        <AppButton @click="addRelatedDream" variant="add" :icon-left="PlusIcon">
                            Добавить связь
                        </AppButton>
                    </div>

                    <div
                        v-for="(rel, idx) in form.relatedDreams"
                        :key="idx"
                        class="mb-2 flex items-center gap-2"
                    >
                        <AppSelect
                            v-model="rel.dreamId"
                            :options="dreamToLinkOptions"
                            class="w-1/3 text-xs"
                        />

                        <AppSelect
                            v-model="rel.relationType"
                            :options="availableRelationTypes"
                            class="w-1/3 text-xs"
                        />

                        <AppTextarea v-model="rel.note" placeholder="Примечание..." :rows="2" />

                        <AppButton
                            size="xs"
                            @click="removeRelatedDream(idx)"
                            variant="danger"
                            :icon-left="X"
                        />
                    </div>
                </div>
            </div>

            <!-- 8. Флаги статусов -->
            <div class="border-border bg-bg-primary rounded-xl border p-4 sm:p-6">
                <div class="flex flex-wrap gap-2">
                    <!-- Закрепить -->
                    <AppTag
                        :is-pressed="form.isPinned"
                        :icon="Pin"
                        @click="form.isPinned = !form.isPinned"
                    >
                        {{ form.isPinned ? 'Закреплен' : 'Закрепить' }}
                    </AppTag>

                    <!-- В избранное -->
                    <AppTag
                        :is-pressed="form.isFavorite"
                        :icon="Bookmark"
                        @click="form.isFavorite = !form.isFavorite"
                    >
                        {{ form.isFavorite ? 'В избранном' : 'В избранное' }}
                    </AppTag>

                    <!-- Приватность (динамическая иконка: Замок / Глобус) -->
                    <AppTag
                        :is-pressed="form.isPrivate"
                        :icon="form.isPrivate ? Lock : Globe"
                        @click="form.isPrivate = !form.isPrivate"
                    >
                        {{ form.isPrivate ? 'Приватный' : 'Публичный' }}
                    </AppTag>

                    <!-- Черновик / Публикация (динамическая иконка: Документ / Галочка) -->
                    <AppTag
                        :is-pressed="form.isDraft"
                        :icon="form.isDraft ? FileText : CheckCircle2"
                        @click="form.isDraft = !form.isDraft"
                    >
                        {{ form.isDraft ? 'Черновик' : 'Опубликован' }}
                    </AppTag>

                    <!-- Архив -->
                    <AppTag
                        :is-pressed="form.isArchived"
                        :icon="Archive"
                        @click="form.isArchived = !form.isArchived"
                    >
                        {{ form.isArchived ? 'В архиве' : 'Архивировать' }}
                    </AppTag>
                </div>
            </div>

            <!-- Ошибка -->
            <p v-if="sleepStore.error" role="alert" class="text-sm text-red-500">
                {{ sleepStore.error }}
            </p>

            <!-- Кнопки управления -->
            <div class="flex items-center justify-end gap-3 pt-4">
                <AppButton
                    :to="{ name: 'dream-details', params: { id: id } }"
                    size="xs"
                    variant="ghost"
                >
                    Отмена
                </AppButton>

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
    import {
        Moon,
        Sunrise,
        Sun,
        Sunset,
        HelpCircle,
        PlusIcon,
        MoveLeft,
        X,
        Pin,
        Bookmark,
        Lock,
        Globe,
        FileText,
        CheckCircle2,
        Archive,
    } from 'lucide-vue-next';
    import { useRoute, useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/sleep';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppTag from '@/components/ui/AppTag.vue';
    import AppTagSelect from '@/components/ui/AppTagSelect.vue';
    import AppDatePicker from '@/components/ui/AppDatePicker.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import AppNumberInput from '@/components/ui/AppNumberInput.vue';
    import AppRange from '@/components/ui/AppRange.vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import AppTextarea from '@/components/ui/AppTextarea.vue';
    import { formatToLocalDateStr } from '@/utils/date';
    import type {
        Dream,
        DreamWrite,
        DreamCategory,
        DreamPhenomenon,
        SensoryAspect,
        ParticipantRole,
        DreamRelationType,
        DreamCategoryDetails,
        DreamPhenomenaDetails,
    } from '@/types/Dream';

    const props = defineProps<{ id?: string }>();
    const route = useRoute();
    const router = useRouter();
    const sleepStore = useSleepStore();

    const isEditMode = computed(() => Boolean(props.id));

    // --- Фабрика дефолтного состояния ---
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
        perspective: 'first_person',
        roles: ['protagonist'],
        sensations: [],

        characters: [],
        locations: [],
        objects: [],
        emotions: [],

        interpretations: [],
        personalNotes: '',
        relatedDreams: [],
        PreSleepContext: '',

        isFavorite: false,
        isPinned: false,
        isArchived: false,
        isDraft: false,
        isPrivate: true,
    });

    const form = ref<DreamWrite>(createInitialForm());

    const rawArrays = ref({
        characters: '',
        locations: '',
        objects: '',
        emotions: '',
    });

    // --- Справочники и Опции ---

    const availableCategories: { value: DreamCategory; label: string }[] = [
        { value: 'lucid', label: '🧠 Осознанный (ОС)' },
        { value: 'nightmare', label: '😱 Кошмар' },
        { value: 'prophetic', label: '🔮 Вещий' },
    ];

    const availablePhenomena: { value: DreamPhenomenon; label: string }[] = [
        { value: 'flying', label: '🕊 Полёт' },
        { value: 'falling', label: '🕳 Падение' },
        { value: 'death', label: '💀 Смерть' },
        { value: 'nested_dream', label: '🚪 Ложное пробуждение' },
        { value: 'paralysis', label: '⚡ Сонный паралич' },
    ];

    const availableSensations: { value: SensoryAspect; label: string }[] = [
        { value: 'sounds', label: '🔊 Звуки' },
        { value: 'smells', label: '👃 Запахи' },
        { value: 'tactile', label: '🖐 Прикосновения' },
        { value: 'temperature', label: '🌡 Тепло/Холод' },
        { value: 'taste', label: '👅 Вкус' },
        { value: 'pain', label: '💥 Боль' },
        { value: 'kinesthetic', label: '🌀 Вращение/Перегрузки' },
        { value: 'breathing', label: '🫁 Дыхание/Одышка' },
        { value: 'speech_voice', label: '🗣 Голос/Немота' },
        { value: 'vision_anomaly', label: '👁 Искажения зрения' },
    ];

    const availableVisualStyles = [
        { value: 'color', label: '🎨 Цветной' },
        { value: 'vivid', label: '✨ Яркий / Неоновый' },
        { value: 'monochrome', label: '🔳 Чёрно-белый / Сепия' },
        { value: 'blurred', label: '🌫 Размытый' },
        { value: 'dark', label: '🌙 Тёмный' },
    ];

    const availablePerspectives = [
        { value: 'first_person', label: '👀 От 1-го лица' },
        { value: 'third_person', label: '🎥 Со стороны (3-е лицо)' },
        { value: 'shifting', label: '🔄 Менялась' },
    ];

    const availableRoles: { value: ParticipantRole; label: string }[] = [
        { value: 'protagonist', label: '🦸 Главный герой' },
        { value: 'observer', label: '👁 Наблюдатель' },
        { value: 'victim', label: '🎯 Жертва' },
        { value: 'shapeshifter', label: '🦊 Другое существо' },
        { value: 'camera_operator', label: '📹 Оператор' },
        { value: 'disembodied', label: '👻 Бестелесный дух' },
    ];

    const availableRelationTypes = [
        { value: 'similar_theme', label: 'Похожая тема' },
        { value: 'recurring_instance', label: 'Повторяющийся сюжет' },
        { value: 'continuation', label: 'Продолжение' },
        { value: 'prequel', label: 'Предыстория' },
        { value: 'same_location', label: 'Та же локация' },
        { value: 'reference', label: 'Пересечение/Упоминание' },
    ];

    const timeOfDayOptions = [
        { value: 'night', label: 'Ночь', icon: Moon },
        { value: 'morning', label: 'Утро', icon: Sunrise },
        { value: 'day', label: 'День', icon: Sun },
        { value: 'evening', label: 'Вечер', icon: Sunset },
        { value: 'unknown', label: 'Неизвестно', icon: HelpCircle },
    ];

    // Детали категорий/феноменов
    const lucidTriggerOptions = [
        { value: 'spontaneous', label: 'Спонтанно' },
        { value: 'reality_check', label: 'Проверка реальности (Reality Check)' },
        { value: 'anomaly', label: 'Аномалия в сюжете' },
        { value: 'other', label: 'Другое' },
    ];

    const flyingTypeOptions = [
        { value: 'effortless', label: 'Легкий / Естественный' },
        { value: 'swimming', label: 'Гребля руками' },
        { value: 'apparatus', label: 'С помощью предмета/транспорта' },
        { value: 'levitation', label: 'Парение на месте' },
        { value: 'uncontrollable', label: 'Неконтролируемый' },
    ];

    const flyingAltitudeOptions = [
        { value: 'low', label: 'Низко над землей' },
        { value: 'cloud_level', label: 'Уровень облаков' },
        { value: 'space', label: 'Космос' },
    ];

    const fallingOriginOptions = [
        { value: 'building_or_cliff', label: 'Здание или скала' },
        { value: 'sky_or_void', label: 'Небо / Пустота' },
        { value: 'abyss', label: 'Бездна' },
        { value: 'stumbling', label: 'Оступился' },
    ];

    const fallingOutcomeOptions = [
        { value: 'hypnic_jerk', label: 'Вздрогнул и проснулся' },
        { value: 'landed_safe', label: 'Мягко приземлился' },
        { value: 'impact', label: 'Удар о землю' },
        { value: 'woke_before_impact', label: 'Проснулся за секунду до удара' },
        { value: 'turned_into_flight', label: 'Переросло в полёт' },
    ];

    const deathCauseOptions = [
        { value: 'peaceful', label: 'Мирно' },
        { value: 'fall', label: 'Падение' },
        { value: 'attack_or_murder', label: 'Нападение / Убийство' },
        { value: 'disaster', label: 'Катастрофа' },
        { value: 'execution', label: 'Казнь' },
        { value: 'other', label: 'Другое' },
    ];

    const deathAftermathOptions = [
        { value: 'woke_up', label: 'Мгновенно проснулся' },
        { value: 'became_ghost', label: 'Стал призраком / духом' },
        { value: 'reincarnated', label: 'Переродился' },
        { value: 'black_void', label: 'Темнота / Пустота' },
        { value: 'scene_shift', label: 'Смена сюжета' },
    ];

    const paralysisTimingOptions = [
        { value: 'falling_asleep', label: 'При засыпании' },
        { value: 'waking_up', label: 'При пробуждении' },
    ];

    // --- Хелперы детальнее ---

    const ensureCategoryDetails = (): DreamCategoryDetails => {
        if (!form.value.categoryDetails) form.value.categoryDetails = {};
        return form.value.categoryDetails;
    };

    const ensurePhenomenaDetails = (): DreamPhenomenaDetails => {
        if (!form.value.phenomenaDetails) form.value.phenomenaDetails = {};
        return form.value.phenomenaDetails;
    };

    const dreamToLinkOptions = computed(() => {
        const currentId = Number(props.id || route.params.id);
        const options = (sleepStore.sleeps || [])
            .filter((d: Dream) => d.id !== currentId)
            .map((d: Dream) => ({
                value: d.id,
                label: `${d.title || 'Без названия'} (${d.date})`,
            }));

        return [{ value: null, label: 'Не из базы (прошлый сон)' }, ...options];
    });

    // --- Работа с массивами ---

    const parseCommaSeparated = (str: string): string[] => {
        return str
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    };

    const toggleArrayItem = <T,>(array: T[], item: T) => {
        const idx = array.indexOf(item);
        if (idx > -1) {
            array.splice(idx, 1);
        } else {
            array.push(item);
        }
    };

    const toggleCategory = (cat: DreamCategory) => {
        if (!form.value.categories) form.value.categories = [];
        toggleArrayItem(form.value.categories, cat);
        const details = ensureCategoryDetails();

        if (cat === 'lucid' && !details.lucid) {
            details.lucid = { controlLevel: 5, trigger: 'spontaneous' };
        }
        if (cat === 'nightmare' && !details.nightmare) {
            details.nightmare = { fearLevel: 7, hasPhysicalResponse: false, copingMechanism: '' };
        }
        if (cat === 'prophetic' && !details.prophetic) {
            details.prophetic = { isFulfilled: false, fulfillmentNotes: '' };
        }
    };

    const handleCategoryChange = (selectedValues: DreamCategory[] | DreamCategory | null) => {
        const currentList = Array.isArray(selectedValues) ? selectedValues : [];
        const details = ensureCategoryDetails();

        if (currentList.includes('lucid') && !details.lucid) {
            details.lucid = { controlLevel: 5, trigger: 'spontaneous' };
        }
        if (currentList.includes('nightmare') && !details.nightmare) {
            details.nightmare = { fearLevel: 7, hasPhysicalResponse: false, copingMechanism: '' };
        }
        if (currentList.includes('prophetic') && !details.prophetic) {
            details.prophetic = { isFulfilled: false, fulfillmentNotes: '' };
        }
    };

    const handlePhenomenaChange = (selectedValues: DreamPhenomenon[] | DreamPhenomenon | null) => {
        const currentList = Array.isArray(selectedValues) ? selectedValues : [];
        if (currentList.length === 0) return;

        const details = ensurePhenomenaDetails();

        if (currentList.includes('flying') && !details.flying) {
            details.flying = { type: 'effortless', altitude: 'cloud_level' };
        }
        if (currentList.includes('falling') && !details.falling) {
            details.falling = { origin: 'building_or_cliff', outcome: 'hypnic_jerk' };
        }
        if (currentList.includes('death') && !details.death) {
            details.death = { cause: 'peaceful', aftermath: 'woke_up' };
        }
        if (currentList.includes('paralysis') && !details.paralysis) {
            details.paralysis = { timing: 'waking_up', hallucinations: [] };
        }
        if (currentList.includes('nested_dream') && !details.nestedDream) {
            details.nestedDream = { nestingLevels: 1 };
        }
    };

    const togglePhenomenon = (ph: DreamPhenomenon) => {
        if (!form.value.phenomena) form.value.phenomena = [];
        toggleArrayItem(form.value.phenomena, ph);
        const details = ensurePhenomenaDetails();

        if (ph === 'flying' && !details.flying) {
            details.flying = { type: 'effortless', altitude: 'cloud_level' };
        }
        if (ph === 'falling' && !details.falling) {
            details.falling = { origin: 'building_or_cliff', outcome: 'hypnic_jerk' };
        }
        if (ph === 'death' && !details.death) {
            details.death = { cause: 'peaceful', aftermath: 'woke_up' };
        }
        if (ph === 'paralysis' && !details.paralysis) {
            details.paralysis = { timing: 'waking_up', hallucinations: [] };
        }
        if (ph === 'nested_dream' && !details.nestedDream) {
            details.nestedDream = { nestingLevels: 1 };
        }
    };

    const toggleSensation = (sens: SensoryAspect) => {
        if (!form.value.sensations) form.value.sensations = [];
        toggleArrayItem(form.value.sensations, sens);
    };

    const toggleRole = (role: ParticipantRole) => {
        if (!form.value.roles) form.value.roles = [];
        toggleArrayItem(form.value.roles, role);
    };

    // --- Динамические списки ---

    const addInterpretation = () => {
        if (!form.value.interpretations) form.value.interpretations = [];
        form.value.interpretations.push({
            tag: '',
            meaning: '',
            sourceId: 'custom',
            isAccurate: null,
        });
    };

    const removeInterpretation = (index: number) => {
        form.value.interpretations?.splice(index, 1);
    };

    const addRelatedDream = () => {
        if (!form.value.relatedDreams) form.value.relatedDreams = [];
        form.value.relatedDreams.push({
            dreamId: undefined,
            relationType: 'similar_theme' as DreamRelationType,
            note: '',
        });
    };

    const removeRelatedDream = (index: number) => {
        form.value.relatedDreams?.splice(index, 1);
    };

    // --- Lifecycle ---

    onMounted(async () => {
        if (isEditMode.value && props.id) {
            const numericId = Number(props.id);

            // Если стор пуст (например, при прямой перезагрузке страницы /edit/123),
            // целесообразно загрузить сон из бэка:
            let existingDream = sleepStore.getDreamById(numericId);

            if (!existingDream && sleepStore.fetchDreamById) {
                existingDream = await sleepStore.fetchDreamById(numericId);
            }

            if (existingDream) {
                form.value = {
                    date: existingDream.date,
                    title: existingDream.title || '',
                    description: existingDream.description || '',
                    categories: [...(existingDream.categories || [])],
                    categoryDetails: JSON.parse(
                        JSON.stringify(existingDream.categoryDetails || {}),
                    ),
                    phenomena: [...(existingDream.phenomena || [])],
                    phenomenaDetails: JSON.parse(
                        JSON.stringify(existingDream.phenomenaDetails || {}),
                    ),

                    quality: existingDream.quality ?? 7,
                    clarity: existingDream.clarity ?? 7,
                    moodAfter: existingDream.moodAfter ?? 5,

                    timeOfDay: existingDream.timeOfDay || 'night',
                    visualStyle: existingDream.visualStyle || 'color',
                    perspective: existingDream.perspective || 'first_person',
                    roles: [...(existingDream.roles || ['protagonist'])],
                    sensations: [...(existingDream.sensations || [])],

                    characters: [...(existingDream.characters || [])],
                    locations: [...(existingDream.locations || [])],
                    objects: [...(existingDream.objects || [])],
                    emotions: [...(existingDream.emotions || [])],

                    interpretations: JSON.parse(
                        JSON.stringify(existingDream.interpretations || []),
                    ),
                    personalNotes: existingDream.personalNotes || '',
                    relatedDreams: JSON.parse(JSON.stringify(existingDream.relatedDreams || [])),
                    PreSleepContext: existingDream.PreSleepContext || '',

                    isFavorite: existingDream.isFavorite ?? false,
                    isPinned: existingDream.isPinned ?? false,
                    isArchived: existingDream.isArchived ?? false,
                    isDraft: existingDream.isDraft ?? false,
                    isPrivate: existingDream.isPrivate ?? true,
                };

                rawArrays.value = {
                    characters: (existingDream.characters || []).join(', '),
                    locations: (existingDream.locations || []).join(', '),
                    objects: (existingDream.objects || []).join(', '),
                    emotions: (existingDream.emotions || []).join(', '),
                };
            } else {
                router.replace('/');
            }
        }
    });

    // --- Submit ---

    const handleSubmit = async () => {
        // Очищаем привязанные сны от пустышек перед отправкой
        const cleanedRelated = (form.value.relatedDreams || []).map((rel) => ({
            ...rel,
            dreamId: rel.dreamId ? Number(rel.dreamId) : undefined,
        }));

        const payload: DreamWrite = {
            ...form.value,
            relatedDreams: cleanedRelated,
            characters: parseCommaSeparated(rawArrays.value.characters),
            locations: parseCommaSeparated(rawArrays.value.locations),
            objects: parseCommaSeparated(rawArrays.value.objects),
            emotions: parseCommaSeparated(rawArrays.value.emotions),
        };

        if (isEditMode.value && props.id) {
            // --- РЕДАКТИРОВАНИЕ ---
            const targetId = Number(props.id);
            const success = await sleepStore.updateDream(targetId, payload);

            if (success) {
                router.push({
                    name: 'dream-details',
                    params: { id: String(targetId) }, // Приводим к String для надежности роутера
                });
            }
        } else {
            // --- СОЗДАНИЕ ---
            // Желательно, чтобы addDream возвращал созданный объект или его ID
            const createdDream = await sleepStore.addDream(payload);

            if (createdDream) {
                // Если addDream возвращает объект с ID:
                const newId = typeof createdDream === 'object' ? createdDream.id : createdDream;

                router.push({
                    name: 'dream-details',
                    params: { id: String(newId) },
                });
            }
        }
    };

    const goBack = () => {
        router.back();
    };
</script>
