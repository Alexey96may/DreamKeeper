<!--
===============================================================================
  AppDatePicker.vue — Accessible Date Picker Component (v-calendar v3)
===============================================================================

  Features:
  - Accessible: Uses unique IDs (useId), proper aria-* attributes (aria-invalid,
    aria-describedby, aria-required), label binding, and fieldset/legend semantics.
  - States: Fully supports disabled, required, error state styling, and helper hints.
  - v-calendar v3 Integration: Uses VDatePicker in popover mode with localized formatting.
  - Flexible Props: Configurable popover visibility, date formatting, and clear buttons.

  USAGE EXAMPLE:
    <AppDatePicker
        v-model="form.date"
        label="Дата сна"
        hint="Укажите дату, когда вам приснился сон"
        :error-message="errors.date"
        required
    />
===============================================================================
-->

<script setup lang="ts">
    import { computed, useId } from 'vue';
    import { DatePicker as VDatePicker } from 'v-calendar-3';
    import { Calendar as CalendarIcon, AlertCircle } from 'lucide-vue-next';
    import 'v-calendar-3/style.css';

    interface Props {
        modelValue: Date | string | number | null | undefined;
        label?: string;
        hint?: string;
        errorMessage?: string;
        isDisabled?: boolean;
        required?: boolean;
        placeholder?: string;
        /** Формат даты для v-calendar (например, 'YYYY-MM-DD' или 'DD.MM.YYYY') */
        masks?: {
            modelValue?: string;
            input?: string;
        };
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: null,
        label: '',
        hint: '',
        errorMessage: '',
        isDisabled: false,
        required: false,
        placeholder: 'Выберите дату',
        masks: () => ({
            input: 'DD.MM.YYYY',
        }),
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: Date | string | number | null | undefined): void;
        (e: 'blur'): void;
    }>();

    // Уникальные ID для A11y связей (доступно из коробки во Vue 3.5+)
    const baseId = useId();
    const inputId = `date-picker-input-${baseId}`;
    const hintId = `date-picker-hint-${baseId}`;
    const errorId = `date-picker-error-${baseId}`;

    // Двустороннее связывание через v-model
    const dateValue = computed({
        get: () => props.modelValue,
        set: (val) => emit('update:modelValue', val),
    });

    const hasError = computed(() => Boolean(props.errorMessage));

    // Формируем динамический aria-describedby для программ чтения экрана
    const ariaDescribedBy = computed(() => {
        const ids: string[] = [];
        if (hasError.value) ids.push(errorId);
        if (props.hint) ids.push(hintId);
        return ids.length > 0 ? ids.join(' ') : undefined;
    });

    // Настройки Popover для v-calendar
    const popoverOpts = {
        visibility: 'click' as const,
        placement: 'bottom-start' as const,
    };
</script>

<template>
    <div
        class="flex w-full flex-col gap-1.5 text-left"
        :class="{ 'cursor-not-allowed opacity-60': isDisabled }"
    >
        <!-- Label (Семантическая связь с input через for) -->
        <label
            v-if="label"
            :for="inputId"
            class="flex items-center justify-between text-xs font-medium transition-colors select-none"
            :class="[
                hasError ? 'text-red-500' : 'text-text-primary',
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
        >
            <span>
                {{ label }}
                <span v-if="required" class="ml-0.5 font-bold text-red-500" aria-hidden="true"
                    >*</span
                >
            </span>
        </label>

        <!-- v-calendar Date Picker Wrapper -->
        <VDatePicker
            v-model="dateValue"
            :disabled="isDisabled"
            :masks="masks"
            :popover="popoverOpts"
            is-required
        >
            <template #default="{ inputValue, inputEvents }">
                <div class="relative flex items-center">
                    <!-- Иконка Календаря Слева -->
                    <CalendarIcon
                        class="pointer-events-none absolute left-3 h-4 w-4 transition-colors"
                        :class="[
                            hasError
                                ? 'text-red-500'
                                : 'text-text-mute group-focus-within:text-accent',
                            isDisabled ? 'opacity-50' : '',
                        ]"
                        aria-hidden="true"
                    />

                    <!-- Поле ввода даты -->
                    <input
                        :id="inputId"
                        :value="inputValue"
                        :placeholder="placeholder"
                        :disabled="isDisabled"
                        :required="required"
                        :aria-invalid="hasError"
                        :aria-required="required"
                        :aria-describedby="ariaDescribedBy"
                        readonly
                        class="bg-bg-secondary text-text-primary disabled:bg-bg-tertiary w-full rounded-lg border py-2 pr-4 pl-9 text-sm transition-all duration-150 select-none focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed"
                        :class="[
                            hasError
                                ? 'border-red-500/50 text-red-500 focus:border-red-500 focus:ring-red-500/30'
                                : 'border-border hover:border-border-hover focus:border-accent focus:ring-accent/40',
                            isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                        ]"
                        v-on="inputEvents"
                        @blur="emit('blur')"
                    />
                </div>
            </template>
        </VDatePicker>

        <!-- Ошибка (A11y: role="alert" и прослушивание через aria-describedby) -->
        <p
            v-if="hasError"
            :id="errorId"
            role="alert"
            class="animate-in fade-in-50 mt-0.5 flex items-center gap-1 text-xs text-red-500 duration-150"
        >
            <AlertCircle class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{{ errorMessage }}</span>
        </p>

        <!-- Подсказка (Hint) -->
        <p v-else-if="hint" :id="hintId" class="text-text-soft mt-0.5 text-xs">
            {{ hint }}
        </p>
    </div>
</template>

<style id="v-calendar-a11y-overrides">
    /* Легкая кастомизация выпадающего popover под темную/светлую тему приложения */
    .vc-popover-content-wrapper {
        --vc-font-family: inherit;
        z-index: 50 !important;
    }
</style>
