<!--
===============================================================================
  AppTextInput.vue — Text Input UI Component
===============================================================================

  Features:
  - Accessibility (A11y): Full ARIA attributes support, automatic unique ID generation,
    alert roles for error messages (role="alert"), and screen-reader integrations.
  - State Support: Supports loading (with animated spinner), disabled, readonly,
    errorMessage, and helper hint states.
  - Semantic HTML & Event Forwarding: Native label/input bindings with full forwarding
    of blur, focus, change, and update:modelValue events.

-------------------------------------------------------------------------------
  USAGE EXAMPLES:
-------------------------------------------------------------------------------

  1. Basic required input field:
     <AppTextInput
         v-model="form.title"
         label="Dream Title"
         placeholder="e.g. Flying over an ancient city..."
         required
     />

  2. With error handling and helper hint:
     <AppTextInput
         v-model="form.title"
         label="Dream Title"
         :error-message="errors.title"
         hint="Enter a short, descriptive title for your dream entry"
     />

  3. Disabled state with loading spinner:
     <AppTextInput
         v-model="form.title"
         label="Dream Title"
         :is-loading="isSaving"
         :disabled="isReadOnlyMode"
     />

  4. Alternative input types and event handlers:
     <AppTextInput
         v-model="form.search"
         type="search"
         label="Search"
         autocomplete="off"
         @blur="onSearchBlur"
     />

===============================================================================
-->

<script setup lang="ts">
    import { computed, useId } from 'vue';
    import { Loader2 } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';

    interface Props {
        modelValue: string | number | null | undefined;
        type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
        label?: string;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        isLoading?: boolean;
        errorMessage?: string;
        hint?: string;
        autocomplete?: string;
        name?: string;
        id?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        type: 'text',
        required: false,
        disabled: false,
        readonly: false,
        isLoading: false,
        autocomplete: 'off',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void;
        (e: 'blur', event: FocusEvent): void;
        (e: 'focus', event: FocusEvent): void;
        (e: 'change', event: Event): void;
    }>();

    // Generate unique ID for linking label, input, and error/hint elements (A11y)
    const defaultId = useId();
    const inputId = computed(() => props.id || `app-input-${defaultId}`);
    const errorId = computed(() => `${inputId.value}-error`);
    const hintId = computed(() => `${inputId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    // Dynamic construction of aria-describedby for accessibility screen readers
    const ariaDescribedBy = computed(() => {
        const ids = [];
        if (props.errorMessage) ids.push(errorId.value);
        if (props.hint) ids.push(hintId.value);
        return ids.length ? ids.join(' ') : undefined;
    });

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        emit('update:modelValue', target.value);
    };
</script>

<template>
    <div class="w-full">
        <!-- Label -->
        <label
            v-if="label"
            :for="inputId"
            class="text-text-soft mb-1 flex items-center gap-1.5 text-xs font-medium"
        >
            <AppTooltip v-if="hint" :content="hint" />
            <span>{{ label }}</span>
            <span v-if="required" class="font-bold text-red-500" aria-hidden="true">*</span>
        </label>

        <!-- Input Field + Loading Spinner -->
        <div class="relative flex items-center">
            <input
                :id="inputId"
                :name="name"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :required="required"
                :disabled="isDisabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :aria-invalid="Boolean(errorMessage)"
                :aria-describedby="ariaDescribedBy"
                :aria-required="required"
                class="border-border bg-bg-secondary text-text-primary focus:border-accent w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                :class="{
                    'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500':
                        errorMessage,
                    'pr-9': isLoading,
                }"
                @input="handleInput"
                @blur="emit('blur', $event)"
                @focus="emit('focus', $event)"
                @change="emit('change', $event)"
            />

            <!-- Loading State Spinner -->
            <div
                v-if="isLoading"
                class="text-text-soft absolute top-1/2 right-3 -translate-y-1/2"
                aria-hidden="true"
            >
                <Loader2 class="h-4 w-4 animate-spin" />
            </div>
        </div>

        <!-- Error Message (Accessibility: role="alert") -->
        <p v-if="errorMessage" :id="errorId" role="alert" class="mt-1 text-xs text-red-500">
            {{ errorMessage }}
        </p>
    </div>
</template>
