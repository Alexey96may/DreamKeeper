<!--
===============================================================================
  AppTextarea.vue — Multiline Text Area UI Component
===============================================================================

  Features:
  - Accessibility (A11y): Fully accessible via Vue 3's useId(), dynamically
    linked aria-describedby for errors/hints, aria-invalid, and role="alert".
  - Layout Constraints: Fixed at 100% width with a min-height constraint (min-h-[100px])
    and resize-y to prevent horizontal breaking or shrinking below sensible defaults.
  - Custom Scrollbar: Stylized cross-browser scrollbar classes to seamlessly match
    the dark/light theme tokens.
  - State Support: Supports loading (with overlay & spinner), disabled, readonly,
    errorMessage, and helper hint states.

-------------------------------------------------------------------------------
  USAGE EXAMPLES:
-------------------------------------------------------------------------------

  1. Basic required textarea field:
     <AppTextarea
         v-model="form.description"
         label="Detailed Description"
         placeholder="Record all the details while they are fresh..."
         required
         :rows="5"
     />

  2. With error handling and helper hint:
     <AppTextarea
         v-model="form.description"
         label="Dream Log"
         :error-message="errors.description"
         hint="Include sensory details, feelings, or prominent colors."
     />

  3. Disabled state with loading spinner:
     <AppTextarea
         v-model="form.description"
         label="AI Processing Log"
         :is-loading="isProcessing"
         disabled
     />

===============================================================================
-->

<script setup lang="ts">
    import { computed, useId } from 'vue';
    import { Loader2 } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';

    interface Props {
        modelValue: string | null | undefined;
        label?: string;
        placeholder?: string;
        rows?: number | string;
        required?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        isLoading?: boolean;
        errorMessage?: string;
        hint?: string;
        name?: string;
        id?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        rows: 5,
        required: false,
        disabled: false,
        readonly: false,
        isLoading: false,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void;
        (e: 'blur', event: FocusEvent): void;
        (e: 'focus', event: FocusEvent): void;
        (e: 'change', event: Event): void;
    }>();

    // Generate unique ID for linking label, textarea, and error/hint elements (A11y)
    const defaultId = useId();
    const textareaId = computed(() => props.id || `app-textarea-${defaultId}`);
    const errorId = computed(() => `${textareaId.value}-error`);
    const hintId = computed(() => `${textareaId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    // Dynamic construction of aria-describedby for accessibility screen readers
    const ariaDescribedBy = computed(() => {
        const ids = [];
        if (props.errorMessage) ids.push(errorId.value);
        if (props.hint) ids.push(hintId.value);
        return ids.length ? ids.join(' ') : undefined;
    });

    const handleInput = (event: Event) => {
        const target = event.target as HTMLTextAreaElement;
        emit('update:modelValue', target.value);
    };
</script>

<template>
    <div class="w-full">
        <!-- Label -->
        <label
            v-if="label"
            :for="textareaId"
            class="text-text-soft mb-1 flex items-center gap-1.5 text-xs font-medium"
        >
            <AppTooltip v-if="hint" :content="hint" />
            <span>{{ label }}</span>
            <span v-if="required" class="font-bold text-red-500" aria-hidden="true">*</span>
        </label>

        <!-- Textarea Container -->
        <div class="relative w-full">
            <textarea
                :id="textareaId"
                :name="name"
                :value="modelValue"
                :rows="rows"
                :placeholder="placeholder"
                :required="required"
                :disabled="isDisabled"
                :readonly="readonly"
                :aria-invalid="Boolean(errorMessage)"
                :aria-describedby="ariaDescribedBy"
                :aria-required="required"
                class="border-border bg-bg-secondary text-text-primary focus:border-accent custom-scrollbar min-h-[100px] w-full resize-y rounded-lg border px-3 py-2 text-sm transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                :class="{
                    'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500':
                        errorMessage,
                }"
                @input="handleInput"
                @blur="emit('blur', $event)"
                @focus="emit('focus', $event)"
                @change="emit('change', $event)"
            ></textarea>

            <!-- Loading State Overlay & Spinner -->
            <div
                v-if="isLoading"
                class="bg-bg-secondary/50 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-[1px]"
                aria-hidden="true"
            >
                <Loader2 class="text-text-soft h-5 w-5 animate-spin" />
            </div>
        </div>

        <!-- Error Message (Accessibility: role="alert") -->
        <p v-if="errorMessage" :id="errorId" role="alert" class="mt-1 text-xs text-red-500">
            {{ errorMessage }}
        </p>
    </div>
</template>

<style scoped>
    /* Custom styled scrollbar matching theme tokens */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: var(--color-border, #374151);
        border-radius: 9999px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-soft, #6b7280);
    }

    /* Firefox support */
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: var(--color-border, #374151) transparent;
    }
</style>
