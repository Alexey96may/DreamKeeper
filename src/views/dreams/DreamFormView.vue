<template>
    <div class="mx-auto max-w-4xl p-4 sm:p-6">
        <!-- Шапка -->
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <BackButton @click="goBack" />
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
                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Дата сна</label
                        >
                        <input
                            v-model="form.date"
                            type="date"
                            required
                            class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>

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
                <AppInput
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

                    <AppInput
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
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Ожидаемый срок</label
                            >
                            <input
                                v-model="ensureCategoryDetails().prophetic!.expectedByDate"
                                type="date"
                                class="border-border bg-bg-secondary text-text-primary w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none"
                            />
                        </div>
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Дата исполнения</label
                            >
                            <input
                                v-model="ensureCategoryDetails().prophetic!.fulfilledDate"
                                type="date"
                                class="border-border bg-bg-secondary text-text-primary w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none"
                            />
                        </div>

                        <AppCheckbox
                            v-model="ensureCategoryDetails().prophetic!.isFulfilled"
                            label="Уже сбылся"
                            accent-color="bg-purple-500 border-purple-500"
                        />
                    </div>

                    <AppInput
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
                    :options="availablePhenomena"
                />
                <div>
                    <label class="text-text-soft mb-2 block text-xs font-medium"
                        >Феномены и события во сне</label
                    >
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="ph in availablePhenomena"
                            :key="ph.value"
                            type="button"
                            @click="togglePhenomenon(ph.value)"
                            :class="[
                                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                form.phenomena?.includes(ph.value)
                                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                                    : 'border-border bg-bg-secondary text-text-soft',
                            ]"
                        >
                            {{ ph.label }}
                        </button>
                    </div>
                </div>

                <!-- Детали: ПОЛЁТ -->
                <div
                    v-if="form.phenomena?.includes('flying')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали полёта</h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Стиль полёта</label
                            >
                            <AppSelect
                                v-model="ensurePhenomenaDetails().flying!.type"
                                :options="flyingTypeOptions"
                            />
                        </div>
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Высота</label
                            >
                            <AppSelect
                                v-model="ensurePhenomenaDetails().flying!.altitude"
                                :options="flyingAltitudeOptions"
                            />
                        </div>
                    </div>
                </div>

                <!-- Детали: ПАДЕНИЕ -->
                <div
                    v-if="form.phenomena?.includes('falling')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали падения</h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Откуда падение</label
                            >
                            <AppSelect
                                v-model="ensurePhenomenaDetails().falling!.origin"
                                :options="fallingOriginOptions"
                            />
                        </div>
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Чем закончилось</label
                            >
                            <AppSelect
                                v-model="ensurePhenomenaDetails().falling!.outcome"
                                :options="fallingOutcomeOptions"
                            />
                        </div>
                    </div>
                </div>

                <!-- Детали: СМЕРТЬ -->
                <div
                    v-if="form.phenomena?.includes('death')"
                    class="space-y-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3"
                >
                    <h4 class="text-xs font-semibold text-indigo-400">Детали смерти во сне</h4>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Причина / Контекст</label
                            >
                            <AppSelect
                                v-model="ensurePhenomenaDetails().death!.cause"
                                :options="deathCauseOptions"
                            />
                        </div>
                        <div>
                            <label class="text-text-soft mb-1 block text-xs font-medium"
                                >Что произошло сразу после</label
                            >
                            <AppSelect
                                v-model="ensurePhenomenaDetails().death!.aftermath"
                                :options="deathAftermathOptions"
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
                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Момент возникновения</label
                        >
                        <AppSelect
                            v-model="ensurePhenomenaDetails().paralysis!.timing"
                            :options="paralysisTimingOptions"
                        />
                    </div>
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
                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Визуальный стиль</label
                        >
                        <AppSelect v-model="form.visualStyle" :options="availableVisualStyles" />
                    </div>

                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Точка зрения (Перспектива)</label
                        >
                        <AppSelect v-model="form.perspective" :options="availablePerspectives" />
                    </div>
                </div>

                <!-- Роли -->
                <div>
                    <label class="text-text-soft mb-2 block text-xs font-medium"
                        >Ваши роли во сне</label
                    >
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="r in availableRoles"
                            :key="r.value"
                            type="button"
                            @click="toggleRole(r.value)"
                            :class="[
                                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                form.roles?.includes(r.value)
                                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                                    : 'border-border bg-bg-secondary text-text-soft',
                            ]"
                        >
                            {{ r.label }}
                        </button>
                    </div>
                </div>

                <!-- Органы чувств -->
                <div>
                    <label class="text-text-soft mb-2 block text-xs font-medium"
                        >Ощущения / Органы чувств</label
                    >
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="sens in availableSensations"
                            :key="sens.value"
                            type="button"
                            @click="toggleSensation(sens.value)"
                            :class="[
                                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                form.sensations?.includes(sens.value)
                                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                                    : 'border-border bg-bg-secondary text-text-soft',
                            ]"
                        >
                            {{ sens.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 5. Оценки -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <div class="text-text-soft mb-1 flex justify-between text-xs font-medium">
                            <span>Качество сна</span>
                            <span class="text-text-primary font-bold">{{ form.quality }}/10</span>
                        </div>
                        <input
                            v-model.number="form.quality"
                            type="range"
                            min="1"
                            max="10"
                            class="accent-accent w-full"
                        />
                    </div>
                    <div>
                        <div class="text-text-soft mb-1 flex justify-between text-xs font-medium">
                            <span>Ясность / Яркость</span>
                            <span class="text-text-primary font-bold">{{ form.clarity }}/10</span>
                        </div>
                        <input
                            v-model.number="form.clarity"
                            type="range"
                            min="1"
                            max="10"
                            class="accent-accent w-full"
                        />
                    </div>
                    <div>
                        <div class="text-text-soft mb-1 flex justify-between text-xs font-medium">
                            <span>Настроение после</span>
                            <span class="text-text-primary font-bold">{{ form.moodAfter }}/10</span>
                        </div>
                        <input
                            v-model.number="form.moodAfter"
                            type="range"
                            min="1"
                            max="10"
                            class="accent-accent w-full"
                        />
                    </div>
                </div>
            </div>

            <!-- 6. Сущности / Аналитика -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Персонажи (через запятую)</label
                        >
                        <input
                            v-model="rawArrays.characters"
                            type="text"
                            placeholder="Друг, Незнакомец в маске..."
                            class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Локации (через запятую)</label
                        >
                        <input
                            v-model="rawArrays.locations"
                            type="text"
                            placeholder="Старый дом, Космодром..."
                            class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Предметы (через запятую)</label
                        >
                        <input
                            v-model="rawArrays.objects"
                            type="text"
                            placeholder="Ключ, Старинная книга..."
                            class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label class="text-text-soft mb-1 block text-xs font-medium"
                            >Эмоции (через запятую)</label
                        >
                        <input
                            v-model="rawArrays.emotions"
                            type="text"
                            placeholder="Страх, Удивление, Восторг..."
                            class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <!-- 7. Контекст, Толкования и Связанные сны -->
            <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
                <div>
                    <label class="text-text-soft mb-1 block text-xs font-medium"
                        >Контекст перед сном</label
                    >
                    <input
                        v-model="form.PreSleepContext"
                        type="text"
                        placeholder="Смотрел фильм, был уставшим, пил чай..."
                        class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    />
                </div>

                <div>
                    <label class="text-text-soft mb-1 block text-xs font-medium"
                        >Личные заметки / Анализ</label
                    >
                    <textarea
                        v-model="form.personalNotes"
                        rows="2"
                        placeholder="Мысли о том, с чем сон может быть связан..."
                        class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full resize-y rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    ></textarea>
                </div>

                <!-- Толкования -->
                <div class="border-border border-t pt-2">
                    <div class="mb-3 flex items-center justify-between">
                        <label class="text-text-soft text-xs font-medium"
                            >Толкования и символы</label
                        >
                        <button
                            type="button"
                            @click="addInterpretation"
                            class="text-accent text-xs font-medium hover:underline"
                        >
                            + Добавить символ
                        </button>
                    </div>

                    <div
                        v-for="(interp, idx) in form.interpretations"
                        :key="idx"
                        class="mb-2 flex items-center gap-2"
                    >
                        <input
                            v-model="interp.tag"
                            type="text"
                            placeholder="Символ (напр. Вода)"
                            class="border-border bg-bg-secondary text-text-primary w-1/3 rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                        <input
                            v-model="interp.meaning"
                            type="text"
                            placeholder="Значение / Толкование"
                            class="border-border bg-bg-secondary text-text-primary w-1/2 rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                        <button
                            type="button"
                            @click="interp.isAccurate = !interp.isAccurate"
                            :title="interp.isAccurate ? 'Сбылось / Точно' : 'Не сбылось'"
                            class="border-border rounded border px-2 py-1.5 text-xs"
                        >
                            {{ interp.isAccurate ? '✅' : '❓' }}
                        </button>
                        <button
                            type="button"
                            @click="removeInterpretation(idx)"
                            class="p-1 text-xs text-red-400 hover:text-red-300"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Связи с другими снами -->
                <div class="border-border border-t pt-2">
                    <div class="mb-3 flex items-center justify-between">
                        <label class="text-text-soft text-xs font-medium">Связанные сны</label>
                        <button
                            type="button"
                            @click="addRelatedDream"
                            class="text-accent text-xs font-medium hover:underline"
                        >
                            + Добавить связь
                        </button>
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
                        <input
                            v-model="rel.note"
                            type="text"
                            placeholder="Примечание..."
                            class="border-border bg-bg-secondary text-text-primary w-1/3 rounded-lg border px-2 py-1.5 text-xs focus:outline-none"
                        />
                        <button
                            type="button"
                            @click="removeRelatedDream(idx)"
                            class="p-1 text-xs text-red-400 hover:text-red-300"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            <!-- 8. Флаги статусов -->
            <div class="border-border bg-bg-primary rounded-xl border p-4 sm:p-6">
                <div class="flex flex-wrap gap-2">
                    <button
                        type="button"
                        @click="form.isPinned = !form.isPinned"
                        :class="[
                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                            form.isPinned
                                ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                : 'border-border bg-bg-secondary text-text-soft',
                        ]"
                    >
                        📌 {{ form.isPinned ? 'Закреплен' : 'Закрепить' }}
                    </button>

                    <button
                        type="button"
                        @click="form.isFavorite = !form.isFavorite"
                        :class="[
                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                            form.isFavorite
                                ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                                : 'border-border bg-bg-secondary text-text-soft',
                        ]"
                    >
                        ⭐ {{ form.isFavorite ? 'В избранном' : 'В избранное' }}
                    </button>

                    <button
                        type="button"
                        @click="form.isPrivate = !form.isPrivate"
                        :class="[
                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                            form.isPrivate
                                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                : 'border-border bg-bg-secondary text-text-soft',
                        ]"
                    >
                        {{ form.isPrivate ? '🔒 Приватный' : '🌐 Публичный' }}
                    </button>

                    <button
                        type="button"
                        @click="form.isDraft = !form.isDraft"
                        :class="[
                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                            form.isDraft
                                ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                                : 'border-border bg-bg-secondary text-text-soft',
                        ]"
                    >
                        📝 {{ form.isDraft ? 'Черновик' : 'Опубликован' }}
                    </button>

                    <button
                        type="button"
                        @click="form.isArchived = !form.isArchived"
                        :class="[
                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                            form.isArchived
                                ? 'border-red-500 bg-red-500/20 text-red-400'
                                : 'border-border bg-bg-secondary text-text-soft',
                        ]"
                    >
                        📦 {{ form.isArchived ? 'В архиве' : 'Архивировать' }}
                    </button>
                </div>
            </div>

            <!-- Ошибка -->
            <p v-if="sleepStore.error" role="alert" class="text-sm text-red-500">
                {{ sleepStore.error }}
            </p>

            <!-- Кнопки управления -->
            <div class="flex items-center justify-end gap-3 pt-4">
                <button
                    type="button"
                    @click="goBack"
                    class="text-text-soft hover:text-text-primary rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    :disabled="sleepStore.loading"
                    class="bg-accent hover:bg-accent-hover rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none disabled:opacity-50"
                >
                    {{
                        sleepStore.loading ? 'Сохранение...' : isEditMode ? 'Сохранить' : 'Создать'
                    }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { Moon, Sunrise, Sun, Sunset, HelpCircle } from 'lucide-vue-next';
    import { useRoute, useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/sleep';
    import BackButton from '@/components/ui/BackButton.vue';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppTagSelect from '@/components/ui/AppTagSelect.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import AppNumberInput from '@/components/ui/AppNumberInput.vue';
    import AppRange from '@/components/ui/AppRange.vue';
    import AppInput from '@/components/ui/AppInput.vue';
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

        const success =
            isEditMode.value && props.id
                ? await sleepStore.updateDream(Number(props.id), payload)
                : await sleepStore.addDream(payload);

        if (success) {
            router.push(`/day/${form.value.date}`);
        }
    };

    const goBack = () => {
        router.back();
    };
</script>
