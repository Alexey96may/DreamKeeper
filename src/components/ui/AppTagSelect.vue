<!--
===============================================================================
  AppTagSelect.vue — Generated Tag Selection Group Component
===============================================================================

  Features:
  - Generates multiple AppChip components from an array of options via v-for.
  - Supports multi-select (Array v-model) and single-select modes.
  - Accessibility (A11y): Groups chips with role="group" or role="radiogroup"
    and handles unique IDs, labels, and error messages.

-------------------------------------------------------------------------------
  USAGE EXAMPLE:
-------------------------------------------------------------------------------

  <AppTagSelect
      v-model="form.categories"
      label="Dream Categories"
      :options="availableCategories"
      required
      :error-message="errors.categories"
  />

===============================================================================
-->

<script setup lang="ts" generic="T">
    import { computed, useId } from 'vue';
    import AppChip from '@/components/ui/AppTag.vue';
    import AppTooltip from '@/components/ui/AppTooltip.vue';
    import { DreamOption } from '@/types/Dream';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFieldFocus } from '@/composables/useFieldFocus';

    interface Props {
        modelValue?: T[] | T | null;
        options: DreamOption<T>[];
        label?: string;
        multiple?: boolean;
        required?: boolean;
        disabled?: boolean;
        isLoading?: boolean;
        errorMessage?: string;
        hint?: string;
        id?: string;
        autoFocusOnError?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: () => [],
        multiple: true,
        required: false,
        disabled: false,
        isLoading: false,
        autoFocusOnError: true,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: T[] | T | null): void;
        (e: 'change', value: T[] | T | null): void;
        (e: 'clear-error'): void;
    }>();

    const defaultId = useId();
    const groupId = computed(() => props.id || `app-chip-select-${defaultId}`);
    const errorId = computed(() => `${groupId.value}-error`);
    const hintId = computed(() => `${groupId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    // Гибкая проверка выбранного значения (устойчивая к строкам/числам)
    const isSelected = (value: T): boolean => {
        if (props.multiple) {
            if (!Array.isArray(props.modelValue)) return false;
            return props.modelValue.some((item) => String(item) === String(value));
        }
        return (
            props.modelValue !== null &&
            props.modelValue !== undefined &&
            String(props.modelValue) === String(value)
        );
    };

    const handleToggle = (value: T) => {
        if (isDisabled.value) return;

        if (props.multiple) {
            const currentList = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
            const index = currentList.findIndex((item) => String(item) === String(value));

            if (index >= 0) {
                currentList.splice(index, 1);
            } else {
                currentList.push(value);
            }

            emit('update:modelValue', currentList);
            emit('change', currentList);
        } else {
            const isAlreadySelected = isSelected(value);
            const newValue = isAlreadySelected ? null : value;

            emit('update:modelValue', newValue);
            emit('change', newValue);
        }

        emit('clear-error');
    };

    const ariaDescribedBy = computed(() => {
        const ids = [];
        if (props.errorMessage) ids.push(errorId.value);
        if (props.hint) ids.push(hintId.value);
        return ids.length ? ids.join(' ') : undefined;
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
        <!-- Section Header / Label -->
        <label
            v-if="label"
            :id="`${groupId}-label`"
            class="text-text-soft mb-2 flex items-center gap-1.5 text-xs font-medium"
        >
            <AppTooltip v-if="hint" :content="hint" />
            <span>{{ label }}</span>
            <span v-if="required" class="text-status-error font-bold" aria-hidden="true">*</span>
        </label>

        <input type="text" />

        <!-- Generated Chip List -->
        <div
            :id="groupId"
            ref="targetRef"
            tabindex="-1"
            :role="multiple ? 'group' : 'radiogroup'"
            :aria-labelledby="label ? `${groupId}-label` : undefined"
            :aria-describedby="ariaDescribedBy"
            class="flex flex-wrap gap-2"
        >
            <AppChip
                v-for="cat in options"
                :key="String(cat.value)"
                :is-pressed="isSelected(cat.value)"
                :role="multiple ? undefined : 'radio'"
                :aria-checked="multiple ? undefined : isSelected(cat.value)"
                :icon="cat.icon"
                :hint="cat?.description ?? ''"
                :disabled="isDisabled || cat.disabled"
                :is-loading="isLoading"
                @click="handleToggle(cat.value)"
            >
                {{ cat.label }}
            </AppChip>
        </div>

        <AppErrorMessage :error-message="errorMessage" :error-id="errorId" />
    </div>
</template>
