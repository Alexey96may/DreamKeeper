<!--
===============================================================================
  AppDatePicker.vue — Accessible Date Picker Component (v-calendar v3)
===============================================================================
-->

<script setup lang="ts">
    import { computed, useId, watch } from 'vue';
    import { DatePicker as VDatePicker } from 'v-calendar-3';
    import { Calendar as CalendarIcon } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFieldFocus } from '@/composables/useFieldFocus';
    import 'v-calendar-3/style.css';

    interface Props {
        /** Ожидает ISO-строку (например, "2026-08-13T00:00:00.000Z") или null */
        modelValue?: string | null;
        label?: string;
        hint?: string;
        errorMessage?: string;
        isDisabled?: boolean;
        required?: boolean;
        placeholder?: string;
        /** Маски отображения в инпуте */
        masks?: {
            input?: string;
        };
        autoFocusOnError?: boolean;
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
        autoFocusOnError: true,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string | null): void;
        (e: 'blur'): void;
        (e: 'input'): void;
    }>();

    // Уникальные ID для A11y связей
    const baseId = useId();
    const inputId = `date-picker-input-${baseId}`;
    const hintId = `date-picker-hint-${baseId}`;
    const errorId = `date-picker-error-${baseId}`;

    // Преобразование ISO строки в Date объект для v-calendar и обратно в чистый UTC ISO
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

            // Результат: "YYYY-MM-DDTHH:mm:ssZ" (например: "2026-08-13T00:00:00Z")
            const isoLocal = `${year}-${month}-${day}T00:00:00`;

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
        class="flex w-full flex-col gap-1.5 text-left"
        :class="{ 'cursor-not-allowed opacity-60': isDisabled }"
    >
        <!-- Label -->
        <label
            v-if="label"
            :for="inputId"
            class="flex items-center justify-between text-xs font-medium transition-colors select-none"
            :class="[
                hasError ? 'text-status-error' : 'text-text-primary',
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
        >
            <span class="flex items-center gap-1.5">
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
            :disabled="isDisabled"
            :masks="masks"
            :popover="popoverOpts"
            timezone="UTC"
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
                        class="bg-bg-secondary text-text-primary disabled:bg-bg-tertiary w-full rounded-lg border py-2 pr-4 pl-9 text-sm transition-all duration-150 select-none focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed"
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

<style id="v-calendar-a11y-overrides">
    .vc-popover-content-wrapper {
        --vc-font-family: inherit;
        z-index: 50 !important;
    }

    /* Адаптация темы календаря v-calendar под токены приложения */
    .vc-container {
        --vc-bg: var(--bg-secondary);
        --vc-border: var(--border-primary);
        --vc-text-color: var(--text-primary);
        --vc-accent-bg: var(--accent);
        --vc-accent-color: var(--text-inverse);
    }
</style>
