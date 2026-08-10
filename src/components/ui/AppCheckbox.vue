<!--
===============================================================================
  AppCheckbox.vue — Custom Styled Accessible Checkbox UI Component
===============================================================================

  Features:
  - Accessibility (A11y): Native interactive checkbox input linked with unique Vue 3
    IDs (useId()), aria-invalid, aria-required, and aria-describedby for errors/hints.
  - Custom Styling: Replaces ugly default browser checkboxes with smooth, responsive,
    theme-aware custom borders, checkmark animations, and focus ring indicators.
  - Flexible Formats: Supports single boolean toggles (v-model="boolean").
  - State Support: Supports loading (with animated spinner), disabled, readonly,
    errorMessage, dynamic accent colors (e.g., accent-red-500), and helper hint states.

-------------------------------------------------------------------------------
  USAGE EXAMPLES:
-------------------------------------------------------------------------------

  1. Basic boolean checkbox with custom accent color (Nightmare details form):
     <AppCheckbox
         v-model="ensureCategoryDetails().nightmare!.hasPhysicalResponse"
         label="Физическая реакция (пульс, пот, испуг)"
         accent-color="bg-red-500 border-red-500"
     />

  2. Required checkbox with error validation & helper hint:
     <AppCheckbox
         v-model="form.termsAccepted"
         label="I agree to the Terms of Service"
         required
         :error-message="errors.terms"
         hint="You must accept the terms before saving your entry."
     />

  3. Disabled & Loading states:
     <AppCheckbox
         v-model="form.isPublic"
         label="Publish entry publicly"
         :is-loading="isSaving"
         disabled
     />

===============================================================================
-->

<script setup lang="ts">
    import { computed, useId } from 'vue';
    import { Check, Loader2 } from 'lucide-vue-next';

    interface Props {
        modelValue?: boolean | null | undefined;
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
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: false,
        value: true,
        required: false,
        disabled: false,
        readonly: false,
        isLoading: false,
        accentColor: 'bg-accent border-accent',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean | (string | number)[]): void;
        (e: 'blur', event: FocusEvent): void;
        (e: 'focus', event: FocusEvent): void;
        (e: 'change', event: Event): void;
    }>();

    // Generate unique ID for linking label, checkbox input, and error/hint elements (A11y)
    const defaultId = useId();
    const checkboxId = computed(() => props.id || `app-checkbox-${defaultId}`);
    const errorId = computed(() => `${checkboxId.value}-error`);
    const hintId = computed(() => `${checkboxId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    // Handle both simple Boolean binding and Array group binding
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
                    class="border-border bg-bg-secondary peer-focus-visible:ring-accent/50 group-hover:border-border/80 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150 peer-focus-visible:ring-2"
                    :class="[
                        isChecked ? accentColor : 'bg-bg-secondary',
                        errorMessage ? '!border-red-500' : '',
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
                        class="h-3 w-3 stroke-[3] text-white"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <!-- Label Text -->
            <span
                v-if="label || $slots.default"
                class="text-text-primary text-xs leading-relaxed font-medium"
            >
                <slot>{{ label }}</slot>
                <span v-if="required" class="ml-0.5 font-bold text-red-500" aria-hidden="true"
                    >*</span
                >
            </span>
        </label>

        <!-- Error Message (Accessibility: role="alert") -->
        <p v-if="errorMessage" :id="errorId" role="alert" class="mt-1 text-xs text-red-500">
            {{ errorMessage }}
        </p>

        <!-- Helper Hint -->
        <p v-else-if="hint" :id="hintId" class="text-text-soft/70 mt-1 text-xs">
            {{ hint }}
        </p>
    </div>
</template>
