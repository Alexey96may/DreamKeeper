<!--
===============================================================================
  AppRange.vue — Range Input / Slider UI Component
===============================================================================

  Features:
  - Accessibility (A11y): Native range slider with explicit aria-valuenow,
    aria-valuemin, aria-valuemax, aria-invalid, and unique Vue ID linkage.
  - Value Badge Display: Top bar layout showing the title on the left and
    the current reactive value/max on the right (with custom formatters).
  - State Support: Supports loading (with animated overlay), disabled, readonly,
    errorMessage, and helper hint states.
  - Customizable Styling: Supports dynamic accent colors (e.g., accent-red-500,
    accent-accent) and full responsiveness.

-------------------------------------------------------------------------------
  USAGE EXAMPLES:
-------------------------------------------------------------------------------

  1. Basic fear level range input (like the Nightmare details form):
     <AppRange
         v-model="form.nightmare.fearLevel"
         label="Fear Level"
         :min="1"
         :max="10"
         accent-color="accent-red-500"
     />

  2. Custom value formatter (e.g. Percentage or Units):
     <AppRange
         v-model="form.clarity"
         label="Dream Clarity"
         :min="0"
         :max="100"
         :step="5"
         :value-formatter="(val, max) => `${val}% of ${max}%`"
     />

  3. Range input with error state and helper hint:
     <AppRange
         v-model="form.rating"
         label="Overall Experience"
         :min="1"
         :max="5"
         required
         :error-message="errors.rating"
         hint="Rate how vivid your recollection was upon waking."
     />

===============================================================================
-->

<script setup lang="ts">
    import { computed, useId } from 'vue';
    import { Loader2 } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';

    interface Props {
        modelValue: number | null | undefined;
        label?: string;
        min?: number | string;
        max?: number | string;
        step?: number | string;
        required?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        isLoading?: boolean;
        errorMessage?: string;
        hint?: string;
        accentColor?: string;
        valueFormatter?: (value: number, max: number | string) => string;
        name?: string;
        id?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        min: 1,
        max: 10,
        step: 1,
        required: false,
        disabled: false,
        readonly: false,
        isLoading: false,
        accentColor: 'accent-accent',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: number): void;
        (e: 'blur', event: FocusEvent): void;
        (e: 'focus', event: FocusEvent): void;
        (e: 'change', event: Event): void;
    }>();

    // Generate unique ID for linking label, input range, and error/hint elements (A11y)
    const defaultId = useId();
    const rangeId = computed(() => props.id || `app-range-${defaultId}`);
    const errorId = computed(() => `${rangeId.value}-error`);
    const hintId = computed(() => `${rangeId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    // Fallback value ensuring safety against null/undefined
    const currentValue = computed(() => Number(props.modelValue ?? props.min));

    // Format displayed badge on the right side of the label bar
    const formattedValueDisplay = computed(() => {
        if (props.valueFormatter) {
            return props.valueFormatter(currentValue.value, props.max);
        }
        return `${currentValue.value}/${props.max}`;
    });

    // Dynamic construction of aria-describedby for accessibility screen readers
    const ariaDescribedBy = computed(() => {
        const ids = [];
        if (props.errorMessage) ids.push(errorId.value);
        if (props.hint) ids.push(hintId.value);
        return ids.length ? ids.join(' ') : undefined;
    });

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        emit('update:modelValue', target.valueAsNumber);
    };
</script>

<template>
    <div class="w-full">
        <!-- Label Bar: Header Title + Value Badge -->
        <div
            v-if="label"
            class="text-text-soft mb-1 flex items-center justify-between text-xs font-medium"
        >
            <label :for="rangeId" class="flex items-center gap-1.5">
                <AppTooltip v-if="hint" :content="hint" :required="required" />
                <span>{{ label }}</span>
                <span v-if="required" class="font-bold text-red-500" aria-hidden="true">*</span>
            </label>

            <!-- Current Value Display -->
            <span class="text-text-primary font-bold">
                {{ formattedValueDisplay }}
            </span>
        </div>

        <!-- Range Input Field Container -->
        <div class="relative flex w-full items-center">
            <input
                :id="rangeId"
                :name="name"
                type="range"
                :min="min"
                :max="max"
                :step="step"
                :value="currentValue"
                :disabled="isDisabled"
                :readonly="readonly"
                :aria-valuenow="currentValue"
                :aria-valuemin="Number(min)"
                :aria-valuemax="Number(max)"
                :aria-invalid="Boolean(errorMessage)"
                :aria-describedby="ariaDescribedBy"
                :aria-required="required"
                class="bg-bg-secondary focus:ring-accent/50 h-2 w-full cursor-pointer appearance-none rounded-lg transition-opacity duration-150 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                :class="[accentColor, errorMessage ? 'accent-red-500' : '']"
                @input="handleInput"
                @blur="emit('blur', $event)"
                @focus="emit('focus', $event)"
                @change="emit('change', $event)"
            />

            <!-- Loading Spinner Overlay -->
            <div
                v-if="isLoading"
                class="bg-bg-secondary/60 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-[1px]"
                aria-hidden="true"
            >
                <Loader2 class="text-text-soft h-4 w-4 animate-spin" />
            </div>
        </div>

        <!-- Error Message (Accessibility: role="alert") -->
        <p v-if="errorMessage" :id="errorId" role="alert" class="mt-1 text-xs text-red-500">
            {{ errorMessage }}
        </p>
    </div>
</template>
