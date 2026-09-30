<!--
===============================================================================
  AppDatePicker.vue — Accessible Date Picker Component (v-calendar)
===============================================================================
-->

<script setup lang="ts">
    import { computed, useId, watch } from 'vue';
    import { DatePicker as VDatePicker } from 'v-calendar-3';
    import { Calendar as CalendarIcon } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFieldFocus } from '@/composables/useFieldFocus';

    interface Props {
        modelValue?: string | null;
        label?: string;
        hint?: string;
        isTimeDate?: boolean;
        errorMessage?: string;
        isDisabled?: boolean;
        required?: boolean;
        placeholder?: string;
        masks?: {
            input?: string;
        };
        autoFocusOnError?: boolean;
        maxDate?: null | Date;
        minDate?: null | Date;
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: null,
        label: '',
        hint: '',
        isTimeDate: false,
        errorMessage: '',
        isDisabled: false,
        required: false,
        placeholder: 'Выберите дату',
        masks: () => ({
            input: 'DD.MM.YYYY',
        }),
        autoFocusOnError: true,
        maxDate: null,
        minDate: null,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string | null): void;
        (e: 'blur'): void;
        (e: 'input'): void;
    }>();

    const baseId = useId();
    const inputId = `date-picker-input-${baseId}`;
    const hintId = `date-picker-hint-${baseId}`;
    const errorId = `date-picker-error-${baseId}`;

    const dateValue = computed<Date | null>({
        get: () => {
            if (!props.modelValue) return null;
            const parsed = new Date(props.modelValue);
            return isNaN(parsed.getTime()) ? null : parsed;
        },
        set: (val: Date | null) => {
            if (!val) {
                emit('update:modelValue', null);
                return;
            }

            const year = val.getUTCFullYear();
            const month = String(val.getUTCMonth() + 1).padStart(2, '0');
            const day = String(val.getUTCDate()).padStart(2, '0');

            const timeString = props.isTimeDate ? 'T00:00:00' : '';
            const isoLocal = `${year}-${month}-${day}${timeString}`;

            emit('update:modelValue', isoLocal);
        },
    });

    const hasError = computed(() => Boolean(props.errorMessage));

    const ariaDescribedBy = computed(() => {
        const ids: string[] = [];
        if (hasError.value) ids.push(errorId);
        if (props.hint) ids.push(hintId);
        return ids.length > 0 ? ids.join(' ') : undefined;
    });

    const popoverOpts = {
        visibility: 'click' as const,
        placement: 'bottom-start' as const,
        // Корректно пробрасываем стили попапа через сам пропс, чтобы не бороться с телепортацией
        popperTriggers: ['click'],
    };

    const { targetRef, focus } = useFieldFocus({
        errorMessage: () => props.errorMessage,
        autoFocusOnError: () => props.autoFocusOnError,
        isDisabled: () => props.isDisabled,
    });

    watch(dateValue, () => {
        emit('input');
    });

    defineExpose({
        focus,
        inputRef: targetRef,
    });
</script>

<template>
    <div
        class="flex w-full flex-col gap-2 text-left"
        :class="{ 'cursor-not-allowed opacity-60': isDisabled }"
    >
        <!-- Label -->
        <label
            v-if="label"
            :for="inputId"
            class="flex items-center justify-between text-sm font-medium transition-colors select-none"
            :class="[
                hasError ? 'text-status-error' : 'text-text-primary',
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
        >
            <span class="flex items-center gap-2">
                <AppTooltip v-if="hint" :content="hint" :required="required" />
                <span>{{ label }}</span>
                <span v-if="required" class="text-status-error ml-0.5 font-bold" aria-hidden="true"
                    >*</span
                >
            </span>
        </label>

        <!-- v-calendar Date Picker Wrapper -->
        <VDatePicker
            v-model="dateValue"
            locale="ru"
            :disabled="isDisabled"
            :masks="masks"
            :popover="popoverOpts"
            timezone="UTC"
            :max-date="maxDate"
            :min-date="minDate"
        >
            <template #default="{ inputValue, inputEvents }">
                <div class="group relative flex items-center">
                    <CalendarIcon
                        class="pointer-events-none absolute left-3 h-4 w-4 transition-colors"
                        :class="[
                            hasError
                                ? 'text-status-error'
                                : 'text-text-soft group-focus-within:text-accent',
                            isDisabled ? 'opacity-50' : '',
                        ]"
                        aria-hidden="true"
                    />

                    <input
                        :id="inputId"
                        ref="targetRef"
                        :value="inputValue"
                        :placeholder="placeholder"
                        :disabled="isDisabled"
                        :required="required"
                        :aria-invalid="hasError"
                        :aria-required="required"
                        :aria-describedby="ariaDescribedBy"
                        readonly
                        class="bg-bg-secondary text-text-primary disabled:bg-bg-tertiary w-full rounded-lg border py-2.5 pr-4 pl-9 text-sm transition-all duration-150 select-none focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed"
                        :class="[
                            hasError
                                ? 'border-status-error/50 text-status-error focus:border-status-error focus:ring-status-error/30'
                                : 'border-border hover:border-border-hover focus:border-accent focus:ring-accent/40',
                            isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                        ]"
                        v-on="inputEvents"
                        @blur="emit('blur')"
                    />
                </div>
            </template>
        </VDatePicker>

        <AppErrorMessage :error-message="errorMessage" :error-id="errorId" />
    </div>
</template>

<style scoped>
    /* Основной контейнер попапа */
    :deep(.vc-popover-content-wrapper) {
        z-index: 50 !important;
    }

    /* Календарь и дизайн-токены */
    :deep(.vc-container) {
        --vc-font-family: inherit;
        background-color: var(--bg-secondary) !important;
        border: 1px solid var(--border-color) !important;
        color: var(--text-primary) !important;
        border-radius: 0.75rem !important;
        box-shadow:
            0 10px 25px -5px rgb(0 0 0 / 0.25),
            0 8px 10px -6px rgb(0 0 0 / 0.25);
    }

    /* Шапка календаря */
    :deep(.vc-header) {
        margin-bottom: 0.5rem !important;
    }

    :deep(.vc-title) {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
    }

    :deep(.vc-arrow) {
        background-color: transparent !important;
        color: var(--text-primary) !important;
        border: 1px solid var(--border-color) !important;
        border-radius: 0.5rem !important;
    }

    :deep(.vc-arrow:hover) {
        background-color: var(--bg-tertiary) !important;
        border-color: var(--border-hover) !important;
        color: var(--accent) !important;
    }

    /* Дни недели */
    :deep(.vc-weekday) {
        color: var(--text-soft) !important;
        font-weight: 500 !important;
        font-size: 0.75rem !important;
    }

    /* Обычные ячейки дней */
    :deep(.vc-day-content) {
        color: var(--text-primary) !important;
        font-weight: 400 !important;
        border-radius: 0.5rem !important;
    }

    :deep(.vc-day-content:hover) {
        background-color: var(--bg-tertiary) !important;
        color: var(--accent) !important;
    }

    /* Выбранный день: фон и цвет текста */
    :deep(.vc-highlight) {
        background-color: var(--accent) !important;
        border-radius: 0.5rem !important;
    }

    :deep(.vc-highlight *),
    :deep(.vc-day [aria-selected='true']) {
        color: var(--text-inverse, #ffffff) !important;
    }

    /* Дни из соседних месяцев */
    :deep(.vc-day.is-not-in-month .vc-day-content) {
        color: var(--text-soft) !important;
        opacity: 0.4 !important;
    }

    /* Сегодняшний день */
    :deep(.vc-day.is-today .vc-day-content:not(.vc-highlight *)) {
        border: 1px solid var(--accent) !important;
    }
</style>
