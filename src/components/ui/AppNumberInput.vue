<!--
===============================================================================
  AppNumberInput.vue — Number Input UI Component with Hold-to-Repeat Controls
===============================================================================

  Features:
  - Long-Press / Hold Controls: Holding down the increment/decrement buttons
    rapidly increases or decreases the numeric value.
  - Accessibility (A11y): Native input type="number" with aria-invalid,
    aria-required, aria-describedby linkage, min/max restrictions, and full
    keyboard accessibility.
  - Custom Controls: Increment and decrement buttons using Lucide icons with
    automatic state management (disabled at min/max limits).
  - Formatter: Optional custom formatting display badge/suffix (e.g., "5 hrs").
  - State Support: Supports loading (with animated spinner), disabled, readonly,
    errorMessage, and helper hint states.

-------------------------------------------------------------------------------
  USAGE EXAMPLES:
-------------------------------------------------------------------------------

  1. Basic usage with press-and-hold auto-repeat:
     <AppNumberInput
         v-model="ensurePhenomenaDetails().nestedDream!.nestingLevels"
         label="Уровень вложенности (сколько раз «просыпался»)"
         :min="1"
         :max="10"
         :step="1"
     />

  2. Custom display formatter & helper hint:
     <AppNumberInput
         v-model="form.sleepDuration"
         label="Sleep Duration"
         :min="0.5"
         :max="24"
         :step="0.5"
         :formatter="(val) => `${val} hrs`"
         hint="Total time spent sleeping in hours. Hold arrows to adjust quickly."
     />

===============================================================================
-->

<script setup lang="ts">
    import { computed, onUnmounted, useId } from 'vue';
    import { ChevronUp, ChevronDown, Loader2 } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFieldFocus } from '@/composables/useFieldFocus';

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
        formatter?: (value: number) => string;
        placeholder?: string;
        name?: string;
        id?: string;
        holdDelay?: number; // Initial delay before rapid auto-repeat starts (ms)
        holdInterval?: number; // Rapid auto-repeat speed (ms)
        autoFocusOnError?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        min: -Infinity,
        max: Infinity,
        step: 1,
        required: false,
        disabled: false,
        readonly: false,
        isLoading: false,
        placeholder: '',
        holdDelay: 400,
        holdInterval: 60,
        autoFocusOnError: true,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: number | null): void;
        (e: 'blur', event: FocusEvent): void;
        (e: 'focus', event: FocusEvent): void;
        (e: 'change', event: Event): void;
        (e: 'clear-error'): void;
    }>();

    // Unique Vue ID for linkage (A11y)
    const defaultId = useId();
    const inputId = computed(() => props.id || `app-number-input-${defaultId}`);
    const errorId = computed(() => `${inputId.value}-error`);
    const hintId = computed(() => `${inputId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    const numericMin = computed(() => Number(props.min));
    const numericMax = computed(() => Number(props.max));
    const numericStep = computed(() => Number(props.step));

    const isAtMin = computed(
        () =>
            props.modelValue !== null &&
            props.modelValue !== undefined &&
            props.modelValue <= numericMin.value,
    );
    const isAtMax = computed(
        () =>
            props.modelValue !== null &&
            props.modelValue !== undefined &&
            props.modelValue >= numericMax.value,
    );

    // Formatted value display badge
    const formattedBadge = computed(() => {
        if (
            props.formatter &&
            props.modelValue !== null &&
            props.modelValue !== undefined &&
            !Number.isNaN(props.modelValue)
        ) {
            return props.formatter(props.modelValue);
        }
        return null;
    });

    // Dynamic aria-describedby calculation
    const ariaDescribedBy = computed(() => {
        const ids = [];
        if (props.errorMessage) ids.push(errorId.value);
        if (props.hint) ids.push(hintId.value);
        return ids.length ? ids.join(' ') : undefined;
    });

    const clamp = (val: number): number => {
        return Math.min(Math.max(val, numericMin.value), numericMax.value);
    };

    const updateValue = (newValue: number) => {
        const clamped = clamp(newValue);
        emit('clear-error');
        emit('update:modelValue', clamped);
    };

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        emit('clear-error');

        if (target.value === '') {
            emit('update:modelValue', null);
            return;
        }
        const parsed = Number.parseFloat(target.value);
        if (!Number.isNaN(parsed)) {
            emit('update:modelValue', parsed);
        }
    };

    const stepUp = () => {
        if (isDisabled.value || props.readonly || isAtMax.value) {
            stopHold();
            return;
        }
        const current =
            props.modelValue ?? (Number.isFinite(numericMin.value) ? numericMin.value : 0);
        updateValue(current + numericStep.value);
    };

    const stepDown = () => {
        if (isDisabled.value || props.readonly || isAtMin.value) {
            stopHold();
            return;
        }
        const current =
            props.modelValue ?? (Number.isFinite(numericMin.value) ? numericMin.value : 0);
        updateValue(current - numericStep.value);
    };

    // -----------------------------------------------------------------------------
    // Hold-to-Repeat Timer Logic
    // -----------------------------------------------------------------------------
    let holdTimeout: ReturnType<typeof setTimeout> | null = null;
    let holdTimer: ReturnType<typeof setInterval> | null = null;

    const stopHold = () => {
        if (holdTimeout) {
            clearTimeout(holdTimeout);
            holdTimeout = null;
        }
        if (holdTimer) {
            clearInterval(holdTimer);
            holdTimer = null;
        }
    };

    const startHold = (action: () => void) => {
        stopHold();
        // 1. Immediate trigger on initial press
        action();

        // 2. Schedule rapid auto-repeat after initial delay
        holdTimeout = setTimeout(() => {
            holdTimer = setInterval(() => {
                action();
            }, props.holdInterval);
        }, props.holdDelay);
    };

    // Clean up timers on unmount to avoid memory leaks
    onUnmounted(() => {
        stopHold();
    });

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
        <!-- Input Label Bar -->
        <label
            v-if="label"
            :for="inputId"
            class="text-text-soft mb-1 flex items-center justify-between text-xs font-medium"
        >
            <span class="flex items-center gap-1.5">
                <AppTooltip v-if="hint" :content="hint" :required="required" />
                <span>{{ label }}</span>
                <span v-if="required" class="text-status-error font-bold" aria-hidden="true"
                    >*</span
                >
            </span>

            <!-- Formatted Value Badge (if formatter provided) -->
            <span
                v-if="formattedBadge"
                class="text-text-primary bg-bg-tertiary rounded px-1.5 py-0.5 text-[10px] font-semibold"
            >
                {{ formattedBadge }}
            </span>
        </label>

        <!-- Input Box with Control Chevrons -->
        <div class="relative flex w-full items-center">
            <input
                :id="inputId"
                :name="name"
                type="number"
                ref="targetRef"
                :min="min"
                :max="max"
                :step="step"
                :value="modelValue ?? ''"
                :placeholder="placeholder"
                :disabled="isDisabled"
                :readonly="readonly"
                :aria-invalid="Boolean(errorMessage)"
                :aria-describedby="ariaDescribedBy"
                :aria-required="required"
                class="border-border bg-bg-secondary text-text-primary focus:border-accent focus:ring-accent w-full [appearance:textfield] rounded-lg border py-1.5 pr-8 pl-3 text-xs transition-colors duration-150 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                :class="[errorMessage ? '!border-red-500 focus:!ring-red-500' : '']"
                @input="handleInput"
                @blur="emit('blur', $event)"
                @focus="emit('focus', $event)"
                @change="emit('change', $event)"
            />

            <!-- Loading Spinner -->
            <div v-if="isLoading" class="absolute right-2 flex items-center justify-center">
                <Loader2 class="text-text-soft h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            </div>

            <!-- Custom Increment/Decrement Arrows -->
            <div
                v-else-if="!readonly"
                class="border-border/50 absolute right-1 flex flex-col justify-center border-l pl-0.5 select-none"
            >
                <!-- Increment Button -->
                <button
                    type="button"
                    tabindex="-1"
                    :disabled="isDisabled || isAtMax"
                    aria-label="Increase value"
                    class="text-text-soft hover:text-text-primary touch-none p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                    @pointerdown.prevent="startHold(stepUp)"
                    @pointerup="stopHold"
                    @pointerleave="stopHold"
                    @pointercancel="stopHold"
                >
                    <ChevronUp class="h-3 w-3" />
                </button>

                <!-- Decrement Button -->
                <button
                    type="button"
                    tabindex="-1"
                    :disabled="isDisabled || isAtMin"
                    aria-label="Decrease value"
                    class="text-text-soft hover:text-text-primary touch-none p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                    @pointerdown.prevent="startHold(stepDown)"
                    @pointerup="stopHold"
                    @pointerleave="stopHold"
                    @pointercancel="stopHold"
                >
                    <ChevronDown class="h-3 w-3" />
                </button>
            </div>
        </div>

        <AppErrorMessage :error-message="errorMessage" :error-id="errorId" />
    </div>
</template>
