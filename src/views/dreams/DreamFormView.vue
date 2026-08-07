<!-- src/views/DreamFormView.vue -->
<template>
    <div class="bg-bg-primary text-text-primary transition-theme duration-theme min-h-screen">
        <div class="container mx-auto max-w-xl px-4 py-6">
            <button
                @click="goBack"
                type="button"
                aria-label="Вернуться на предыдущую страницу"
                class="text-text-mute hover:text-text-primary focus-visible:ring-accent mb-4 flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
                ← Назад
            </button>

            <div class="dream-card p-6">
                <h2 class="text-text-primary mb-6 text-2xl font-bold">
                    {{ isEditMode ? 'Редактировать сон' : 'Записать сон' }}
                </h2>

                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <!-- ================= ОСНОВНОЙ БЛОК ================= -->
                    <div class="space-y-4">
                        <!-- Дата и Время суток -->
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    for="form-date"
                                    class="text-text-soft mb-1 block text-sm font-medium"
                                >
                                    Дата <span class="text-red-500" aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="form-date"
                                    v-model="form.date"
                                    type="date"
                                    required
                                    class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 focus:ring-2 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label
                                    for="form-time-of-day"
                                    class="text-text-soft mb-1 block text-sm font-medium"
                                >
                                    Время суток
                                </label>
                                <select
                                    id="form-time-of-day"
                                    v-model="form.timeOfDay"
                                    class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 focus:ring-2 focus:outline-none"
                                >
                                    <option value="night">🌙 Ночь</option>
                                    <option value="morning">🌅 Утро</option>
                                    <option value="nap">☀️ Дневной сон</option>
                                </select>
                            </div>
                        </div>

                        <!-- Заголовок -->
                        <div>
                            <label
                                for="form-title"
                                class="text-text-soft mb-1 block text-sm font-medium"
                            >
                                Заголовок <span class="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <input
                                id="form-title"
                                v-model="form.title"
                                type="text"
                                required
                                placeholder="Короткое название (например: Полет над городом)"
                                class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 focus:ring-2 focus:outline-none"
                            />
                        </div>

                        <!-- Описание / Сюжет -->
                        <div>
                            <label
                                for="form-description"
                                class="text-text-soft mb-1 block text-sm font-medium"
                            >
                                Описание / Сюжет
                                <span class="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <textarea
                                id="form-description"
                                v-model="form.description"
                                rows="5"
                                required
                                placeholder="Расскажите подробно, что вам приснилось..."
                                class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 focus:ring-2 focus:outline-none"
                            ></textarea>
                        </div>

                        <!-- Категории (Multiple Choice) -->
                        <fieldset>
                            <legend class="text-text-soft mb-2 block text-sm font-medium">
                                Категории сна
                            </legend>
                            <div class="flex flex-wrap gap-2" role="group">
                                <button
                                    v-for="cat in availableCategories"
                                    :key="cat.value"
                                    type="button"
                                    role="checkbox"
                                    :aria-checked="form.categories.includes(cat.value)"
                                    @click="toggleCategory(cat.value)"
                                    :class="[
                                        'focus-visible:ring-accent rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                        form.categories.includes(cat.value)
                                            ? 'bg-accent border-accent text-white'
                                            : 'bg-bg-secondary text-text-soft border-border hover:border-accent/50',
                                    ]"
                                >
                                    {{ cat.label }}
                                </button>
                            </div>
                        </fieldset>

                        <!-- Уровень осознанности (Зависит от категории 'lucid') -->
                        <div
                            v-if="form.categories.includes('lucid')"
                            class="bg-accent/10 border-accent/30 rounded-lg border p-3"
                        >
                            <label
                                for="form-lucidity-level"
                                class="text-text-soft mb-1 block text-sm font-medium"
                            >
                                Уровень осознанности (ОС):
                                <span class="text-accent font-bold"
                                    >{{ form.lucidityLevel }}/10</span
                                >
                            </label>
                            <input
                                id="form-lucidity-level"
                                v-model.number="form.lucidityLevel"
                                type="range"
                                min="0"
                                max="10"
                                :aria-valuenow="form.lucidityLevel"
                                aria-valuemin="0"
                                aria-valuemax="10"
                                class="accent-accent focus-visible:ring-accent w-full rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                            />
                        </div>

                        <!-- Оценки сна (Качество, Ясность) -->
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    for="form-quality"
                                    class="text-text-soft mb-1 block text-sm font-medium"
                                >
                                    Качество сна:
                                    <span class="text-accent font-bold">{{ form.quality }}/10</span>
                                </label>
                                <input
                                    id="form-quality"
                                    v-model.number="form.quality"
                                    type="range"
                                    min="1"
                                    max="10"
                                    :aria-valuenow="form.quality"
                                    aria-valuemin="1"
                                    aria-valuemax="10"
                                    class="accent-accent focus-visible:ring-accent w-full rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                                />
                            </div>
                            <div>
                                <label
                                    for="form-clarity"
                                    class="text-text-soft mb-1 block text-sm font-medium"
                                >
                                    Ясность воспоминаний:
                                    <span class="text-accent font-bold">{{ form.clarity }}/10</span>
                                </label>
                                <input
                                    id="form-clarity"
                                    v-model.number="form.clarity"
                                    type="range"
                                    min="1"
                                    max="10"
                                    :aria-valuenow="form.clarity"
                                    aria-valuemin="1"
                                    aria-valuemax="10"
                                    class="accent-accent focus-visible:ring-accent w-full rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- ================= ДОПОЛНИТЕЛЬНЫЙ БЛОК ================= -->
                    <div class="border-border/60 border-t pt-4">
                        <button
                            type="button"
                            :aria-expanded="showAdditional"
                            aria-controls="additional-params-section"
                            @click="showAdditional = !showAdditional"
                            class="text-accent hover:text-accent-hover focus-visible:ring-accent flex w-full items-center justify-between rounded-md p-1 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                            <span>{{
                                showAdditional
                                    ? '▼ Свернуть дополнительные параметры'
                                    : '► Показать дополнительные параметры'
                            }}</span>
                        </button>

                        <div
                            id="additional-params-section"
                            v-show="showAdditional"
                            class="mt-4 space-y-4 transition-all"
                        >
                            <!-- Цветность -->
                            <div class="flex items-center gap-3">
                                <span
                                    id="label-visual-style"
                                    class="text-text-soft text-sm font-medium"
                                >
                                    Визуал:
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    :aria-checked="form.isColor"
                                    aria-labelledby="label-visual-style"
                                    @click="form.isColor = !form.isColor"
                                    class="bg-bg-secondary border-border text-text-primary hover:border-accent/50 focus-visible:ring-accent rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                >
                                    {{ form.isColor ? '🎨 Цветной' : '🔳 Черно-белый' }}
                                </button>
                            </div>

                            <div class="space-y-4">
                                <!-- PreSleepContext -->
                                <div>
                                    <label
                                        for="form-presleep"
                                        class="text-text-soft mb-1 block text-sm font-medium"
                                    >
                                        Контекст перед сном (PreSleepContext)
                                    </label>
                                    <textarea
                                        id="form-presleep"
                                        v-model="form.PreSleepContext"
                                        rows="2"
                                        placeholder="Пил мате, читал Кинга, был уставшим..."
                                        class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 text-sm focus:ring-2 focus:outline-none"
                                    ></textarea>
                                </div>

                                <!-- personalNotes -->
                                <div>
                                    <label
                                        for="form-notes"
                                        class="text-text-soft mb-1 block text-sm font-medium"
                                    >
                                        Личные заметки (personalNotes)
                                    </label>
                                    <textarea
                                        id="form-notes"
                                        v-model="form.personalNotes"
                                        rows="2"
                                        placeholder="Мысли после пробуждения, ассоциации..."
                                        class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2.5 text-sm focus:ring-2 focus:outline-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-text-soft text-sm font-medium">
                                        Интерпретации символов ({{ form.interpretations?.length }})
                                    </label>
                                    <button
                                        type="button"
                                        @click="addInterpretation"
                                        class="text-accent hover:text-accent-hover text-xs font-semibold"
                                    >
                                        + Добавить символ
                                    </button>
                                </div>

                                <div
                                    v-for="(item, index) in form.interpretations"
                                    :key="index"
                                    class="bg-bg-secondary border-border space-y-3 rounded-lg border p-3"
                                >
                                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <!-- Символ -->
                                        <div>
                                            <label class="text-text-soft mb-1 block text-xs"
                                                >Символ / Образ</label
                                            >
                                            <input
                                                v-model="item.symbol"
                                                type="text"
                                                placeholder="Например: Вода / Ключ"
                                                class="bg-bg-primary border-border text-text-primary w-full rounded border p-2 text-sm focus:outline-none"
                                            />
                                        </div>

                                        <!-- Источник -->
                                        <div>
                                            <label class="text-text-soft mb-1 block text-xs"
                                                >Источник</label
                                            >
                                            <select
                                                v-model="item.source"
                                                class="bg-bg-primary border-border text-text-primary w-full rounded border p-2 text-sm focus:outline-none"
                                            >
                                                <option value="custom">
                                                    Личное толкование (custom)
                                                </option>
                                                <option value="base_guide">
                                                    Сонник / База (base_guide)
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Значение -->
                                    <div>
                                        <label class="text-text-soft mb-1 block text-xs"
                                            >Значение / Смысл</label
                                        >
                                        <input
                                            v-model="item.meaning"
                                            type="text"
                                            placeholder="Отражает очищение или неопределенность..."
                                            class="bg-bg-primary border-border text-text-primary w-full rounded border p-2 text-sm focus:outline-none"
                                        />
                                    </div>

                                    <div class="flex justify-end">
                                        <button
                                            type="button"
                                            @click="removeInterpretation(index)"
                                            class="text-xs text-red-400 hover:text-red-300"
                                        >
                                            Удалить символ
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-text-soft text-sm font-medium">
                                        Связанные сны ({{ form.relatedDreams?.length }})
                                    </label>
                                    <button
                                        type="button"
                                        @click="addRelatedDream"
                                        :disabled="!availableDreamsToLink.length"
                                        class="text-accent hover:text-accent-hover text-xs font-semibold disabled:opacity-40"
                                    >
                                        + Связать со сном
                                    </button>
                                </div>

                                <div
                                    v-for="(rel, index) in form.relatedDreams"
                                    :key="index"
                                    class="bg-bg-secondary border-border flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-end"
                                >
                                    <!-- Выбор сна (dreamId) -->
                                    <div class="flex-1">
                                        <label class="text-text-soft mb-1 block text-xs">Сон</label>
                                        <select
                                            v-model.number="rel.dreamId"
                                            class="bg-bg-primary border-border text-text-primary w-full rounded border p-2 text-sm focus:outline-none"
                                        >
                                            <option
                                                v-for="dream in availableDreamsToLink"
                                                :key="dream.id"
                                                :value="dream.id"
                                            >
                                                {{ dream.date }} — {{ dream.title }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Тип связи (relationType) -->
                                    <div class="w-full sm:w-48">
                                        <label class="text-text-soft mb-1 block text-xs"
                                            >Тип связи</label
                                        >
                                        <select
                                            v-model="rel.relationType"
                                            class="bg-bg-primary border-border text-text-primary w-full rounded border p-2 text-sm focus:outline-none"
                                        >
                                            <option value="continuation">Продолжение</option>
                                            <option value="prequel">Предыстория</option>
                                            <option value="similar_theme">Похожая тема</option>
                                            <option value="same_location">Та же локация</option>
                                            <option value="reference">Упоминание</option>
                                        </select>
                                    </div>

                                    <!-- Удаление -->
                                    <button
                                        type="button"
                                        @click="removeRelatedDream(index)"
                                        class="pb-2.5 text-xs text-red-400 hover:text-red-300"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>

                            <!-- Настроение после -->
                            <div>
                                <label
                                    for="form-mood-after"
                                    class="text-text-soft mb-1 block text-sm font-medium"
                                >
                                    Настроение после пробуждения:
                                    <span class="text-accent font-bold"
                                        >{{ form.moodAfter }}/10</span
                                    >
                                </label>
                                <input
                                    id="form-mood-after"
                                    v-model.number="form.moodAfter"
                                    type="range"
                                    min="1"
                                    max="10"
                                    :aria-valuenow="form.moodAfter"
                                    aria-valuemin="1"
                                    aria-valuemax="10"
                                    class="accent-accent focus-visible:ring-accent w-full rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                                />
                            </div>

                            <!-- Ощущения во сне -->
                            <fieldset>
                                <legend class="text-text-soft mb-2 block text-sm font-medium">
                                    Ощущения во сне
                                </legend>
                                <div class="flex flex-wrap gap-2" role="group">
                                    <button
                                        v-for="s in availableSensations"
                                        :key="s.value"
                                        type="button"
                                        role="checkbox"
                                        :aria-checked="form.sensations?.includes(s.value)"
                                        @click="toggleSensation(s.value)"
                                        :class="[
                                            'focus-visible:ring-accent rounded-lg border px-2.5 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                            form.sensations?.includes(s.value)
                                                ? 'bg-accent/20 border-accent text-text-primary'
                                                : 'bg-bg-secondary border-border text-text-soft',
                                        ]"
                                    >
                                        {{ s.label }}
                                    </button>
                                </div>
                            </fieldset>

                            <!-- Текстовые поля массивов (через запятую) -->
                            <div class="space-y-3">
                                <div>
                                    <label
                                        for="array-characters"
                                        class="text-text-soft mb-1 block text-xs font-medium"
                                    >
                                        Персонажи (через запятую)
                                    </label>
                                    <input
                                        id="array-characters"
                                        v-model="rawArrays.characters"
                                        type="text"
                                        placeholder="Лена, Незнакомец, Кот"
                                        class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        for="array-locations"
                                        class="text-text-soft mb-1 block text-xs font-medium"
                                    >
                                        Локации (через запятую)
                                    </label>
                                    <input
                                        id="array-locations"
                                        v-model="rawArrays.locations"
                                        type="text"
                                        placeholder="Старый дом, Лес, Крым"
                                        class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        for="array-objects"
                                        class="text-text-soft mb-1 block text-xs font-medium"
                                    >
                                        Предметы (через запятую)
                                    </label>
                                    <input
                                        id="array-objects"
                                        v-model="rawArrays.objects"
                                        type="text"
                                        placeholder="Книга, Скаут, Ключ"
                                        class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        for="array-emotions"
                                        class="text-text-soft mb-1 block text-xs font-medium"
                                    >
                                        Эмоции во сне (через запятую)
                                    </label>
                                    <input
                                        id="array-emotions"
                                        v-model="rawArrays.emotions"
                                        type="text"
                                        placeholder="Страх, Удивление, Покой"
                                        class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        for="array-tags"
                                        class="text-text-soft mb-1 block text-xs font-medium"
                                    >
                                        Теги (через запятую)
                                    </label>
                                    <input
                                        id="array-tags"
                                        v-model="rawArrays.tags"
                                        type="text"
                                        placeholder="погоня, полет, вода"
                                        class="bg-bg-secondary border-border text-text-primary focus:ring-accent w-full rounded-lg border p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <!-- Флаги и переключатели -->
                            <div class="border-border/60 border-y py-4">
                                <span class="text-text-soft mb-3 block text-sm font-medium"
                                    >Статусы и видимость</span
                                >
                                <div class="flex flex-wrap gap-2">
                                    <!-- Избранное -->
                                    <button
                                        type="button"
                                        @click="form.isFavorite = !form.isFavorite"
                                        :class="[
                                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                            form.isFavorite
                                                ? 'border-amber-500 bg-amber-500/20 text-amber-500'
                                                : 'bg-bg-secondary border-border text-text-soft',
                                        ]"
                                    >
                                        {{ form.isFavorite ? '★ В избранном' : '☆ В избранное' }}
                                    </button>

                                    <!-- Закрепить -->
                                    <button
                                        type="button"
                                        @click="form.isPinned = !form.isPinned"
                                        :class="[
                                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                            form.isPinned
                                                ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                                : 'bg-bg-secondary border-border text-text-soft',
                                        ]"
                                    >
                                        📌 {{ form.isPinned ? 'Закреплен' : 'Закрепить' }}
                                    </button>

                                    <!-- Приватный -->
                                    <button
                                        type="button"
                                        @click="form.isPrivate = !form.isPrivate"
                                        :class="[
                                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                            form.isPrivate
                                                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                                : 'bg-bg-secondary border-border text-text-soft',
                                        ]"
                                    >
                                        {{ form.isPrivate ? '🔒 Приватный' : '🌐 Публичный' }}
                                    </button>

                                    <!-- Черновик -->
                                    <button
                                        type="button"
                                        @click="form.isDraft = !form.isDraft"
                                        :class="[
                                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                            form.isDraft
                                                ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                                                : 'bg-bg-secondary border-border text-text-soft',
                                        ]"
                                    >
                                        📝 {{ form.isDraft ? 'Черновик' : 'Опубликован' }}
                                    </button>

                                    <!-- В архив -->
                                    <button
                                        type="button"
                                        @click="form.isArchived = !form.isArchived"
                                        :class="[
                                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                            form.isArchived
                                                ? 'border-red-500 bg-red-500/20 text-red-400'
                                                : 'bg-bg-secondary border-border text-text-soft',
                                        ]"
                                    >
                                        📦 {{ form.isArchived ? 'В архиве' : 'Архивировать' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Ошибка store -->
                    <p v-if="sleepStore.error" role="alert" class="text-sm text-red-500">
                        {{ sleepStore.error }}
                    </p>

                    <!-- Кнопки действий -->
                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            @click="goBack"
                            class="text-text-mute hover:text-text-primary focus-visible:ring-accent rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            :disabled="sleepStore.loading"
                            class="bg-accent hover:bg-accent-hover focus-visible:ring-accent rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                        >
                            {{
                                sleepStore.loading
                                    ? 'Сохранение...'
                                    : isEditMode
                                      ? 'Сохранить'
                                      : 'Создать'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useSleepStore } from '@/stores/modules/sleep';
    import { formatToLocalDateStr } from '@/utils/date';
    import type { DreamWrite, DreamCategory, SensoryAspect } from '@/types/Dream';

    const props = defineProps<{
        id?: string;
    }>();

    const route = useRoute();
    const router = useRouter();
    const sleepStore = useSleepStore();

    const isEditMode = computed(() => Boolean(props.id));
    const showAdditional = ref(false);

    // Справочники категорий и ощущений
    const availableCategories: { value: DreamCategory; label: string }[] = [
        { value: 'lucid', label: '🧠 Осознанный (ОС)' },
        { value: 'nightmare', label: '😱 Кошмар' },
        { value: 'prophetic', label: '🔮 Вещий' },
        { value: 'false_awakening', label: '🚪 Ложное пробуждение' },
        { value: 'paralysis', label: '⚡ Сонный паралич' },
        { value: 'recurring', label: '🔄 Повторяющийся' },
    ];

    const availableSensations: { value: SensoryAspect; label: string }[] = [
        { value: 'sounds', label: '🔊 Звуки' },
        { value: 'smells', label: '👃 Запахи' },
        { value: 'tactile', label: '🖐 Тактильные' },
        { value: 'taste', label: '👅 Вкус' },
        { value: 'pain', label: '💥 Боль' },
    ];

    // Реактивные данные формы
    const form = ref<DreamWrite>({
        date: (route.query.date as string) || formatToLocalDateStr(),
        title: '',
        description: '',
        categories: [],
        quality: 7,
        clarity: 7,
        lucidityLevel: 5,
        moodAfter: 5,
        timeOfDay: 'night',
        isColor: true,
        sensations: [],
        PreSleepContext: '',
        personalNotes: '',

        isFavorite: false,
        isPinned: false,
        isArchived: false,
        isDraft: false,
        isPrivate: true,

        // Гарантируем массивы по умолчанию
        interpretations: [],
        relatedDreams: [],
    });

    // Сырые строки для ввода массивов через запятую
    const rawArrays = ref({
        characters: '',
        locations: '',
        objects: '',
        emotions: '',
        tags: '',
    });

    // Доступные сны для связывания (исключаем текущий редактируемый)
    const availableDreamsToLink = computed(() => {
        const currentId = Number(route.params.id);
        return (sleepStore.sleeps || []).filter((d: any) => d.id !== currentId);
    });

    // Хелпер преобразования строки с запятыми в массив
    const parseCommaSeparated = (str: string): string[] => {
        return str
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    };

    // --- Методы для Интерпретаций ---
    const addInterpretation = () => {
        // Защита: гарантируем наличие массива перед push
        if (!form.value.interpretations) {
            form.value.interpretations = [];
        }
        form.value.interpretations.push({
            symbol: '',
            meaning: '',
            source: 'custom',
        });
    };

    const removeInterpretation = (index: number) => {
        form.value.interpretations?.splice(index, 1);
    };

    // --- Методы для Связанных снов ---
    const addRelatedDream = () => {
        // Защита: гарантируем наличие массива перед push
        if (!form.value.relatedDreams) {
            form.value.relatedDreams = [];
        }
        form.value.relatedDreams.push({
            dreamId: availableDreamsToLink.value[0]?.id || 0,
            relationType: 'similar_theme',
        });
    };

    const removeRelatedDream = (index: number) => {
        form.value.relatedDreams?.splice(index, 1);
    };

    // Переключение элементов массива категорий и ощущений
    const toggleCategory = (cat: DreamCategory) => {
        const idx = form.value.categories.indexOf(cat);
        if (idx > -1) {
            form.value.categories.splice(idx, 1);
        } else {
            form.value.categories.push(cat);
        }
    };

    const toggleSensation = (sens: SensoryAspect) => {
        const idx = form.value.sensations.indexOf(sens);
        if (idx > -1) {
            form.value.sensations.splice(idx, 1);
        } else {
            form.value.sensations.push(sens);
        }
    };

    onMounted(async () => {
        // await sleepStore.init();

        if (isEditMode.value && props.id) {
            const numericId = Number(props.id);
            const existingDream = sleepStore.getDreamById(numericId);

            if (existingDream) {
                form.value = {
                    date: existingDream.date,
                    title: existingDream.title || '',
                    description: existingDream.description || '',
                    categories: existingDream.categories || [],
                    quality: existingDream.quality ?? 7,
                    clarity: existingDream.clarity ?? 7,
                    lucidityLevel: existingDream.lucidityLevel ?? 5,
                    moodAfter: existingDream.moodAfter ?? 5,
                    timeOfDay: existingDream.timeOfDay || 'night',
                    isColor: existingDream.isColor ?? true,
                    sensations: existingDream.sensations || [],
                    PreSleepContext: existingDream.PreSleepContext || '',
                    personalNotes: existingDream.personalNotes || '',

                    // Загружаем флаги и гарантируем значения по умолчанию
                    isFavorite: existingDream.isFavorite ?? false,
                    isPinned: existingDream.isPinned ?? false,
                    isArchived: existingDream.isArchived ?? false,
                    isDraft: existingDream.isDraft ?? false,
                    isPrivate: existingDream.isPrivate ?? true,

                    // Загружаем массивы или инициализируем пустыми
                    interpretations: existingDream.interpretations || [],
                    relatedDreams: existingDream.relatedDreams || [],
                };

                rawArrays.value = {
                    characters: (existingDream.characters || []).join(', '),
                    locations: (existingDream.locations || []).join(', '),
                    objects: (existingDream.objects || []).join(', '),
                    emotions: (existingDream.emotions || []).join(', '),
                    tags: (existingDream.tags || []).join(', '),
                };
            } else {
                router.replace('/');
            }
        }
    });

    const handleSubmit = async () => {
        const payload: DreamWrite = {
            ...form.value,
            characters: parseCommaSeparated(rawArrays.value.characters),
            locations: parseCommaSeparated(rawArrays.value.locations),
            objects: parseCommaSeparated(rawArrays.value.objects),
            emotions: parseCommaSeparated(rawArrays.value.emotions),
            tags: parseCommaSeparated(rawArrays.value.tags),
        };

        if (isEditMode.value && props.id) {
            const updated = await sleepStore.updateDream(Number(props.id), payload);
            if (updated) {
                router.push(`/day/${form.value.date}`);
            }
        } else {
            const created = await sleepStore.addDream(payload);
            if (created) {
                router.push(`/day/${form.value.date}`);
            }
        }
    };

    const goBack = () => {
        router.back();
    };
</script>
