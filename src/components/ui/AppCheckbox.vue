<!--
===============================================================================
  AppCheckbox.vue — Custom Styled Accessible Checkbox UI Component
===============================================================================

  Features:
  - Accessibility (A11y): Native interactive checkbox input linked with unique Vue 3
    IDs (useId()), aria-invalid, aria-required, and aria-describedby for errors/hints.
  - Custom Styling: Replaces default browser checkboxes with smooth, responsive,
    theme-aware custom borders, checkmark animations, and focus ring indicators.
  - Flexible Formats: Supports single boolean toggles (v-model="boolean") or array groups.
  - State Support: Supports loading (with animated spinner), disabled, readonly,
    errorMessage, dynamic accent colors, and helper hint states.

===============================================================================
-->

<script setup lang="ts">
    import { computed, useId } from 'vue';
    import { Check, Loader2 } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFieldFocus } from '@/composables/useFieldFocus';

    interface Props {
        modelValue?: boolean | null | (string | number)[] | undefined;
        value?: string | number | boolean;
        label?: string;
        required?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        isLoading?: boolean;
        errorMessage?: string;
        hint?: string;
        accentColor?: string;
        name?: string;
        id?: string;
        autoFocusOnError?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: false,
        value: true,
        required: false,
        disabled: false,
        readonly: false,
        isLoading: false,
        accentColor: 'bg-accent border-accent text-text-inverse',
        autoFocusOnError: true,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean | (string | number)[]): void;
        (e: 'blur', event: FocusEvent): void;
        (e: 'focus', event: FocusEvent): void;
        (e: 'change', event: Event): void;
    }>();

    // Unique ID for linking label, input, and error/hint elements (A11y)
    const defaultId = useId();
    const checkboxId = computed(() => props.id || `app-checkbox-${defaultId}`);
    const errorId = computed(() => `${checkboxId.value}-error`);
    const hintId = computed(() => `${checkboxId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    // Support Boolean binding and Array group binding
    const isChecked = computed(() => {
        if (Array.isArray(props.modelValue)) {
            return props.modelValue.includes(props.value as string | number);
        }
        return Boolean(props.modelValue);
    });

    // Dynamic construction of aria-describedby for accessibility screen readers
    const ariaDescribedBy = computed(() => {
        const ids = [];
        if (props.errorMessage) ids.push(errorId.value);
        if (props.hint) ids.push(hintId.value);
        return ids.length ? ids.join(' ') : undefined;
    });

    const handleChange = (event: Event) => {
        if (isDisabled.value || props.readonly) return;

        const target = event.target as HTMLInputElement;

        if (Array.isArray(props.modelValue)) {
            const newArray = [...props.modelValue];
            const val = props.value as string | number;

            if (target.checked) {
                if (!newArray.includes(val)) newArray.push(val);
            } else {
                const index = newArray.indexOf(val);
                if (index > -1) newArray.splice(index, 1);
            }
            emit('update:modelValue', newArray);
        } else {
            emit('update:modelValue', target.checked);
        }

        emit('change', event);
    };

    const { targetRef, focus } = useFieldFocus({
        errorMessage: () => props.errorMessage,
        autoFocusOnError: () => props.autoFocusOnError,
        isDisabled: () => isDisabled.value,
    });

    defineExpose({
        focus,
        inputRef: targetRef,
    });
</script>

<template>
    <div class="w-full">
        <!-- Main Checkbox Container -->
        <label
            :for="checkboxId"
            class="group inline-flex items-start gap-2.5 transition-opacity duration-150 select-none"
            :class="[isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer']"
        >
            <!-- Hidden Native Input for full HTML Form / A11y support -->
            <div class="relative flex items-center pt-0.5">
                <input
                    :id="checkboxId"
                    ref="targetRef"
                    :name="name"
                    type="checkbox"
                    :checked="isChecked"
                    :value="value"
                    :required="required"
                    :disabled="isDisabled"
                    :readonly="readonly"
                    :aria-invalid="Boolean(errorMessage)"
                    :aria-describedby="ariaDescribedBy"
                    :aria-required="required"
                    class="peer sr-only"
                    @change="handleChange"
                    @blur="emit('blur', $event)"
                    @focus="emit('focus', $event)"
                />

                <!-- Custom Styled Checkbox Box -->
                <div
                    class="border-border-primary bg-bg-secondary peer-focus-visible:ring-accent/50 group-hover:border-border-hover flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150 peer-focus-visible:ring-2"
                    :class="[
                        isChecked ? accentColor : 'bg-bg-secondary',
                        errorMessage ? '!border-status-error' : '',
                    ]"
                >
                    <!-- Loading Spinner -->
                    <Loader2
                        v-if="isLoading"
                        class="text-text-soft h-3 w-3 animate-spin"
                        aria-hidden="true"
                    />

                    <!-- Animated Checkmark Icon -->
                    <Check
                        v-else-if="isChecked"
                        class="text-text-primary h-3 w-3 stroke-3"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <!-- Label Text -->
            <span
                v-if="label || $slots.default"
                class="text-text-primary flex items-center gap-1.5 text-xs leading-relaxed font-medium"
            >
                <slot>{{ label }}</slot>
                <span v-if="required" class="text-status-error ml-0.5 font-bold" aria-hidden="true"
                    >*</span
                >
                <AppTooltip v-if="hint" :content="hint" :required="required" />
            </span>
        </label>

        <AppErrorMessage :error-message="errorMessage" :error-id="errorId" />
    </div>
</template>
