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
                        :error-message="sleepStore.validationErrors.date"
                        @input="sleepStore.clearError('date')"
                        required
                    />

                    <!-- Время суток -->
                    <AppSelect
                        id="form-time-of-day"
                        v-model="form.timeOfDay"
                        label="Время суток"
                        :options="TIME_OF_DAY_OPTIONS"
                        placeholder="Выберите время суток"
                        :error-message="sleepStore.validationErrors.timeOfDay"
                        @clear-error="sleepStore.clearError('timeOfDay')"
                    />
                </div>

                <!-- Заголовок -->
                <AppTextInput
                    v-model="form.title"
                    label="Название сна"
                    placeholder="Например: Полет над древним городом..."
                    :error-message="sleepStore.validationErrors.title"
                    @input="sleepStore.clearError('title')"
                    required
                />

                <!-- Описание -->
                <AppTextarea
                    v-model="form.description"
                    label="Подробное описание"
                    placeholder="Запишите все подробности, пока они свежи в памяти..."
                    :error-message="sleepStore.validationErrors.description"
                    @input="sleepStore.clearError('description')"
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
                    @clear-error="sleepStore.clearError('categories')"
                    :error-message="sleepStore.validationErrors.categories"
                    :options="DREAM_CATEGORY_OPTIONS"
                />

                <!-- Детали категории LUCID -->
                <div
                    v-if="form.categories.includes('lucid')"
                    class="border-accent/30 bg-accent/5 space-y-3 rounded-lg border p-3"
                >
                    <h4 class="text-accent text-xs font-semibold">
                        Параметры Осознанного Сна (Lucid)
                    </h4>
                    <div
                        v-if="form.categoryDetails?.lucid"
                        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <AppRange
                            v-model.number="form.categoryDetails.lucid.controlLevel"
                            label="Уровень контроля"
                            :error-message="
                                sleepStore.validationErrors['categoryDetails.lucid.controlLevel']
                            "
                            @input="sleepStore.clearError('categoryDetails.lucid.controlLevel')"
                            :min="0"
                            :max="10"
                            :step="1"
                            :value-formatter="dreamValueFormatter"
                        />

                        <AppSelect
                            v-model="form.categoryDetails.lucid.trigger"
                            label="Триггер осознания"
                            :error-message="
                                sleepStore.validationErrors['categoryDetails.lucid.trigger']
                            "
                            :options="LUCID_TRIGGER_OPTIONS"
                            @clear-error="sleepStore.clearError('categoryDetails.lucid.trigger')"
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
                    <div
                        v-if="form.categoryDetails?.nightmare"
                        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <AppRange
                            v-model="form.categoryDetails.nightmare.fearLevel"
                            label="Уровень страха"
                            :min="0"
                            :max="10"
                            :step="1"
                            :value-formatter="dreamValueFormatter"
                            :error-message="
                                sleepStore.validationErrors['categoryDetails.nightmare.fearLevel']
                            "
                            @input="sleepStore.clearError('categoryDetails.nightmare.fearLevel')"
                        />

                        <AppCheckbox
                            v-model="form.categoryDetails.nightmare.hasPhysicalResponse"
                            label="Физическая реакция"
                            hint="Учащённый пульс, пот, испуг?"
                            accent-color="bg-red-500 border-red-500"
                            :error-message="
                                sleepStore.validationErrors[
                                    'categoryDetails.nightmare.hasPhysicalResponse'
                                ]
                            "
                            @change="
                                sleepStore.clearError(
                                    'categoryDetails.nightmare.hasPhysicalResponse',
                                )
                            "
                        />
                    </div>

                    <AppTextInput
                        v-if="form.categoryDetails?.nightmare"
                        v-model="form.categoryDetails.nightmare.copingMechanism"
                        label="Как справился / Завершение"
                        placeholder="Проснулся от крика, дал отпор..."
                        :error-message="
                            sleepStore.validationErrors['categoryDetails.nightmare.copingMechanism']
                        "
                        @input="sleepStore.clearError('categoryDetails.nightmare.copingMechanism')"
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
                    <div
                        v-if="form.categoryDetails?.prophetic"
                        class="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        <AppDatePicker
                            v-model="form.categoryDetails.prophetic.expectedByDate"
                            label="Ожидаемый срок"
                            hint="Укажите дату, к которой сон должен реализоваться"
                            :error-message="
                                sleepStore.validationErrors[
                                    'categoryDetails.prophetic.expectedByDate'
                                ]
                            "
                            @input="
                                sleepStore.clearError('categoryDetails.prophetic.expectedByDate')
                            "
                        />

                        <AppDatePicker
                            v-model="form.categoryDetails.prophetic.fulfilledDate"
                            label="Дата исполнения"
                            hint="Укажите дату, к которой сон реализовался"
                            :error-message="
                                sleepStore.validationErrors[
                                    'categoryDetails.prophetic.fulfilledDate'
                                ]
                            "
                            @input="
                                sleepStore.clearError('categoryDetails.prophetic.fulfilledDate')
                            "
                        />

                        <AppCheckbox
                            v-model="form.categoryDetails.prophetic.isFulfilled"
                            label="Уже сбылся"
                            accent-color="bg-purple-500 border-purple-500"
                            hint="Отметьте, если сон уже сбылся."
                            :error-message="
                                sleepStore.validationErrors['categoryDetails.prophetic.isFulfilled']
                            "
                            @change="sleepStore.clearError('categoryDetails.prophetic.isFulfilled')"
                        />
                    </div>

                    <AppTextInput
                        v-if="form.categoryDetails?.prophetic"
                        v-model="form.categoryDetails.prophetic.fulfillmentNotes"
                        label="Что именно произошло в реальности"
                        placeholder="Описание события в реальной жизни..."
                        :error-message="
                            sleepStore.validationErrors[
                                'categoryDetails.prophetic.fulfillmentNotes'
                            ]
                        "
                        @input="sleepStore.clearError('categoryDetails.prophetic.fulfillmentNotes')"
                    />
                </div>
            </div>

            <!-- 3. Особые явления и их детализация (phenomenaDetails) -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <AppTagSelect
                    v-model="form.phenomena"
                    label="Феномены и события во сне"
                    @change="handlePhenomenaChange"
                    :options="DREAM_PHENOMENON_OPTIONS"
                    @clear-error="sleepStore.clearError('phenomena')"
                    :error-message="sleepStore.validationErrors.phenomena"
                />

                <!-- Детали: ПОЛЁТ -->
                <div
                    v-if="form.phenomena?.includes('flying')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали полёта</h4>
                    <div
                        v-if="form.phenomenaDetails?.flying"
                        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <AppSelect
                            v-model="form.phenomenaDetails.flying.type"
                            :options="FLYING_TYPE_OPTIONS"
                            label="Стиль полёта"
                            :error-message="
                                sleepStore.validationErrors['phenomenaDetails.flying.type']
                            "
                            @clear-error="sleepStore.clearError('phenomenaDetails.flying.type')"
                        />

                        <AppSelect
                            v-model="form.phenomenaDetails.flying.altitude"
                            :options="FLYING_ALTITUDE_OPTIONS"
                            label="Высота"
                            :error-message="
                                sleepStore.validationErrors['phenomenaDetails.flying.altitude']
                            "
                            @clear-error="sleepStore.clearError('phenomenaDetails.flying.altitude')"
                        />
                    </div>
                </div>

                <!-- Детали: ПАДЕНИЕ -->
                <div
                    v-if="form.phenomena?.includes('falling')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали падения</h4>
                    <div
                        v-if="form.phenomenaDetails?.falling"
                        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <AppSelect
                            v-model="form.phenomenaDetails.falling.origin"
                            :options="FALLING_ORIGIN_OPTIONS"
                            :error="sleepStore.getError('phenomenaDetails.falling.origin')"
                            label="Откуда падение"
                            :error-message="
                                sleepStore.validationErrors['phenomenaDetails.falling.origin']
                            "
                            @clear-error="sleepStore.clearError('phenomenaDetails.falling.origin')"
                        />

                        <AppSelect
                            v-model="form.phenomenaDetails.falling.outcome"
                            :options="FALLING_OUTCOME_OPTIONS"
                            :error="sleepStore.validationErrors.phenomenaDetails"
                            label="Чем закончилось"
                            :error-message="
                                sleepStore.validationErrors['phenomenaDetails.falling.outcome']
                            "
                            @clear-error="sleepStore.clearError('phenomenaDetails.falling.outcome')"
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
                        <div
                            v-if="form.phenomena?.includes('death') && form.phenomenaDetails?.death"
                            class="space-y-4"
                        >
                            <AppSelect
                                v-model="form.phenomenaDetails.death.cause"
                                :options="DEATH_CAUSE_OPTIONS"
                                label="Причина / Контекст"
                                :error-message="
                                    sleepStore.validationErrors['phenomenaDetails.death.cause']
                                "
                                @clear-error="sleepStore.clearError('phenomenaDetails.death.cause')"
                            />

                            <AppSelect
                                v-model="form.phenomenaDetails.death.aftermath"
                                :options="DEATH_AFTERMATH_OPTIONS"
                                label="Что произошло сразу после"
                                :error-message="
                                    sleepStore.validationErrors['phenomenaDetails.death.aftermath']
                                "
                                @clear-error="
                                    sleepStore.clearError('phenomenaDetails.death.aftermath')
                                "
                            />
                        </div>
                    </div>
                </div>

                <!-- Детали: СОННЫЙ ПАРАЛИЧ -->
                <div
                    v-if="form.phenomena?.includes('paralysis')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали сонного паралича</h4>

                    <AppSelect
                        v-if="form.phenomenaDetails?.paralysis"
                        v-model="form.phenomenaDetails.paralysis.timing"
                        :options="PARALYSIS_TIMING_OPTIONS"
                        label="Момент возникновения"
                        :error-message="
                            sleepStore.validationErrors['phenomenaDetails.paralysis.timing']
                        "
                        @clear-error="sleepStore.clearError('phenomenaDetails.paralysis.timing')"
                    />

                    <AppTagSelect
                        v-if="form.phenomenaDetails?.paralysis?.hallucinations"
                        v-model="form.phenomenaDetails.paralysis.hallucinations"
                        label="Галлюцинации"
                        :options="PARALYSIS_HALLUCINATIONS_OPTIONS"
                        :error-message="
                            sleepStore.validationErrors['phenomenaDetails.paralysis.hallucinations']
                        "
                        @clear-error="
                            sleepStore.clearError('phenomenaDetails.paralysis.hallucinations')
                        "
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
                        v-if="form.phenomenaDetails?.nestedDream"
                        v-model.number="form.phenomenaDetails.nestedDream.nestingLevels"
                        label="Уровень вложенности "
                        hint="Сколько раз «просыпался» во сне?"
                        :min="1"
                        :max="1000"
                        :step="1"
                        :formatter="(val) => `${val} раз`"
                        :error-message="
                            sleepStore.validationErrors[
                                'phenomenaDetails.nestedDream.nestingLevels'
                            ]
                        "
                        @clearError="
                            sleepStore.clearError('phenomenaDetails.nestedDream.nestingLevels')
                        "
                    />
                </div>
            </div>

            <!-- 4. Визуальный стиль, Перспектива и Роли -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <AppSelect
                        v-model="form.visualStyle"
                        :options="VISUAL_STYLE_OPTIONS"
                        label="Визуальный стиль"
                        :error-message="sleepStore.validationErrors.visualStyle"
                        @clear-error="sleepStore.clearError('visualStyle')"
                    />

                    <AppSelect
                        v-model="form.perspective"
                        :options="PERSPECTIVE_OPTIONS"
                        hint="Перспектива"
                        label="Точка зрения"
                        :error-message="sleepStore.validationErrors.perspective"
                        @clear-error="sleepStore.clearError('perspective')"
                    />
                </div>

                <!-- Роли -->
                <AppTagSelect
                    v-model="form.roles"
                    label="Ваши роли во сне"
                    :options="PARTICIPANT_ROLE_OPTIONS"
                    :error-message="sleepStore.validationErrors.roles"
                    @clear-error="sleepStore.clearError('roles')"
                />

                <!-- Органы чувств -->
                <AppTagSelect
                    v-model="form.sensations"
                    label="Ощущения"
                    hint="Органы чувств"
                    :options="SENSORY_ASPECT_OPTIONS"
                    :error-message="sleepStore.validationErrors.sensations"
                    @clear-error="sleepStore.clearError('sensations')"
                />
            </div>

            <!-- 5. Оценки -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <AppRange
                        v-model.number="form.quality"
                        label="Качество сна"
                        hint="Состояние после сна, уровень высыпания. "
                        :min="0"
                        :max="10"
                        :step="1"
                        :value-formatter="dreamValueFormatter"
                        :error-message="sleepStore.validationErrors.quality"
                        @input="sleepStore.clearError('quality')"
                    />

                    <AppRange
                        v-model.number="form.clarity"
                        label="Ясность / Яркость"
                        :min="0"
                        :max="10"
                        :step="1"
                        :value-formatter="dreamValueFormatter"
                        :error-message="sleepStore.validationErrors.clarity"
                        @input="sleepStore.clearError('clarity')"
                    />

                    <AppRange
                        v-model.number="form.moodAfter"
                        label="Настроение после"
                        :min="0"
                        :max="10"
                        :step="1"
                        :value-formatter="dreamValueFormatter"
                        :error-message="sleepStore.validationErrors.moodAfter"
                        @input="sleepStore.clearError('moodAfter')"
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
                    :error-message="sleepStore.validationErrors.PreSleepContext"
                    @input="sleepStore.clearError('PreSleepContext')"
                />

                <AppTextInput
                    v-model="form.personalNotes"
                    label="Личные заметки / Анализ"
                    placeholder="Мысли о том, с чем сон может быть связан..."
                    :error-message="sleepStore.validationErrors.personalNotes"
                    @input="sleepStore.clearError('personalNotes')"
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
                        <AppTextInput
                            v-model="interp.tag"
                            placeholder="Символ (напр. Вода)"
                            :error-message="
                                sleepStore.validationErrors[`interpretations.${idx}.tag`]
                            "
                            @input="sleepStore.clearError(`interpretations.${idx}.tag`)"
                        />

                        <AppTextInput
                            v-model="interp.meaning"
                            placeholder="Значение / Толкование"
                            :error-message="
                                sleepStore.validationErrors[`interpretations.${idx}.meaning`]
                            "
                            @input="sleepStore.clearError(`interpretations.${idx}.meaning`)"
                        />

                        <AppCheckbox
                            v-model="interp.isAccurate"
                            label="Сбылось"
                            accent-color="bg-red-500 border-red-500"
                            hint="Толкование сна подтвердилось в реальности?"
                            :error-message="
                                sleepStore.validationErrors[`interpretations.${idx}.isAccurate`]
                            "
                            @change="sleepStore.clearError(`interpretations.${idx}.isAccurate`)"
                        />

                        <AppSelect
                            v-model="interp.sourceId"
                            :options="sourceOptions"
                            label="Источник толкования"
                            :error-message="
                                sleepStore.validationErrors[`interpretations.${idx}.sourceId`]
                            "
                            @clear-error="sleepStore.clearError(`interpretations.${idx}.sourceId`)"
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

                    <div v-for="(rel, idx) in form.relatedDreams" :key="idx">
                        <div class="mb-2 flex items-center gap-2">
                            <AppSelect
                                v-model="rel.dreamId"
                                :options="dreamToLinkOptions"
                                class="w-1/3 text-xs"
                                :error-message="
                                    sleepStore.validationErrors[`relatedDreams.${idx}.dreamId`]
                                "
                                @clear-error="sleepStore.clearError(`relatedDreams.${idx}.dreamId`)"
                            />

                            <AppSelect
                                v-model="rel.relationType"
                                :options="DREAM_RELATION_OPTIONS"
                                class="w-1/3 text-xs"
                                :error-message="
                                    sleepStore.validationErrors[`relatedDreams.${idx}.relationType`]
                                "
                                @clear-error="
                                    sleepStore.clearError(`relatedDreams.${idx}.relationType`)
                                "
                            />

                            <AppButton
                                size="xs"
                                @click="removeRelatedDream(idx)"
                                variant="danger"
                                :icon-left="X"
                            />
                        </div>

                        <AppTextarea
                            v-model="rel.note"
                            placeholder="Примечание..."
                            :rows="2"
                            :error-message="
                                sleepStore.validationErrors[`relatedDreams.${idx}.note`]
                            "
                            @input="sleepStore.clearError(`relatedDreams.${idx}.note`)"
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

            <AppErrorMessage :error-message="sleepStore.error" />

            <!-- Кнопки управления -->
            <div class="flex items-center justify-end gap-3 pt-4">
                <AppButton @click="goBack" variant="ghost"> Отмена </AppButton>

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
    import { useSleepStore } from '@/stores/modules/dream';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppTag from '@/components/ui/AppTag.vue';
    import AppTagSelect from '@/components/ui/AppTagSelect.vue';
    import AppDatePicker from '@/components/ui/AppDatePicker.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import AppNumberInput from '@/components/ui/AppNumberInput.vue';
    import AppRange from '@/components/ui/AppRange.vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import {
        TIME_OF_DAY_OPTIONS,
        DREAM_CATEGORY_OPTIONS,
        DREAM_PHENOMENON_OPTIONS,
        DEATH_CAUSE_OPTIONS,
        DEATH_AFTERMATH_OPTIONS,
        FLYING_TYPE_OPTIONS,
        FLYING_ALTITUDE_OPTIONS,
        FALLING_ORIGIN_OPTIONS,
        FALLING_OUTCOME_OPTIONS,
        DREAM_RELATION_OPTIONS,
        VISUAL_STYLE_OPTIONS,
        PERSPECTIVE_OPTIONS,
        PARTICIPANT_ROLE_OPTIONS,
        SENSORY_ASPECT_OPTIONS,
        PARALYSIS_TIMING_OPTIONS,
        LUCID_TRIGGER_OPTIONS,
        PARALYSIS_HALLUCINATIONS_OPTIONS,
    } from '@/constants/Dream';
    import AppTextarea from '@/components/ui/AppTextarea.vue';
    import { formatToLocalDateStr } from '@/utils/date';
    import type {
        Dream,
        DreamWrite,
        DreamCategory,
        DreamPhenomenon,
        DreamRelationType,
        DreamCategoryDetails,
        DreamPhenomenaDetails,
    } from '@/types/Dream';

    const props = defineProps<{ slug?: string }>();

    const route = useRoute();
    const router = useRouter();
    const sleepStore = useSleepStore();
    const sourceStore = useInterpretationSourceStore();

    const isEditMode = computed(() => Boolean(props.slug));

    // Формируем опции для AppSelect
    const sourceOptions = computed(() => {
        const dynamicSources = (sourceStore.sources || []).map((s) => ({
            value: s.id,
            label: `${s.title}${s.authorName ? ` (${s.authorName})` : ''}`,
        }));

        return [...dynamicSources];
    });

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
        PreSleepContext: '',

        isFavorite: false,
        isPinned: false,
        isArchived: false,
        isDraft: false,
        isPrivate: true,
    });

    const form = ref<DreamWrite>(createInitialForm());
    const dreamId = ref<number | null>(null);

    const rawArrays = ref({
        characters: '',
        locations: '',
        objects: '',
        emotions: '',
    });

    // --- Хелперы детальнее ---

    const dreamValueFormatter = computed(() => {
        return (val: number, max: number | string) => {
            if (val === 0) return 'Не важно';
            return `${val} / ${max}`;
        };
    });

    const ensureCategoryDetails = (): DreamCategoryDetails => {
        if (!form.value.categoryDetails) form.value.categoryDetails = {};
        return form.value.categoryDetails;
    };

    const ensurePhenomenaDetails = (): DreamPhenomenaDetails => {
        if (!form.value.phenomenaDetails) form.value.phenomenaDetails = {};
        return form.value.phenomenaDetails;
    };

    const dreamToLinkOptions = computed(() => {
        const rawSlug = props.slug || route.params.slug;
        const currentSlug = rawSlug ? rawSlug : null;

        const options = (sleepStore.sleeps || [])
            .filter((d: Dream) => d.slug !== currentSlug)
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

    const handleCategoryChange = (selectedValues: DreamCategory[] | DreamCategory | null) => {
        const currentList = Array.isArray(selectedValues) ? selectedValues : [];
        const details = ensureCategoryDetails();

        console.log(sleepStore.validationErrors);

        if (currentList.includes('lucid') && !details.lucid) {
            details.lucid = { controlLevel: 0, trigger: 'irrelevant' };
        }
        if (currentList.includes('nightmare') && !details.nightmare) {
            details.nightmare = { fearLevel: 0, hasPhysicalResponse: false, copingMechanism: '' };
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
            details.flying = { type: 'irrelevant', altitude: 'irrelevant' };
        }
        if (currentList.includes('falling') && !details.falling) {
            details.falling = { origin: 'irrelevant', outcome: 'irrelevant' };
        }
        if (currentList.includes('death') && !details.death) {
            details.death = { cause: 'irrelevant', aftermath: 'irrelevant' };
        }
        if (currentList.includes('paralysis') && !details.paralysis) {
            details.paralysis = { timing: 'irrelevant', hallucinations: [] };
        }
        if (currentList.includes('nested_dream') && !details.nestedDream) {
            details.nestedDream = { nestingLevels: 1 };
        }
    };

    // --- Динамические списки ---

    const addInterpretation = () => {
        if (!form.value.interpretations) form.value.interpretations = [];
        form.value.interpretations.push({
            tag: '',
            meaning: '',
            sourceId: 0,
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
            // Только если стор точно инициализирован и запись не найдена
            router.replace('/');
        }
    });

    // --- Submit ---

    const handleSubmit = async () => {
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

    const goBack = () => {
        router.back();
    };
</script>
