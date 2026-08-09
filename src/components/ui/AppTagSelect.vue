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

<script setup lang="ts" generic="T extends string | number">
    import { computed, useId, type Component } from 'vue';
    import AppChip from '@/components/ui/AppTag.vue';

    export interface ChipOption<ValueType = string | number> {
        label: string;
        value: ValueType;
        icon?: Component;
        disabled?: boolean;
    }

    interface Props {
        modelValue: T[] | T | null | undefined;
        options: ChipOption<T>[];
        label?: string;
        multiple?: boolean;
        required?: boolean;
        disabled?: boolean;
        isLoading?: boolean;
        errorMessage?: string;
        hint?: string;
        id?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        multiple: true,
        required: false,
        disabled: false,
        isLoading: false,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: T[] | T): void;
        (e: 'change', value: T[] | T): void;
    }>();

    const defaultId = useId();
    const groupId = computed(() => props.id || `app-chip-select-${defaultId}`);
    const errorId = computed(() => `${groupId.value}-error`);
    const hintId = computed(() => `${groupId.value}-hint`);

    const isDisabled = computed(() => props.disabled || props.isLoading);

    const isSelected = (value: T): boolean => {
        if (props.multiple) {
            return Array.isArray(props.modelValue) && props.modelValue.includes(value);
        }
        return props.modelValue === value;
    };

    const handleToggle = (value: T) => {
        if (isDisabled.value) return;

        if (props.multiple) {
            const currentList = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
            const index = currentList.indexOf(value);

            if (index >= 0) {
                currentList.splice(index, 1);
            } else {
                currentList.push(value);
            }

            emit('update:modelValue', currentList);
            emit('change', currentList);
        } else {
            const newValue = props.modelValue === value ? (null as unknown as T) : value;
            emit('update:modelValue', newValue);
            emit('change', newValue);
        }
    };

    const ariaDescribedBy = computed(() => {
        const ids = [];
        if (props.errorMessage) ids.push(errorId.value);
        if (props.hint) ids.push(hintId.value);
        return ids.length ? ids.join(' ') : undefined;
    });
</script>

<template>
    <div class="w-full">
        <!-- Section Header / Label -->
        <label
            v-if="label"
            :id="`${groupId}-label`"
            class="text-text-soft mb-2 block text-xs font-medium"
        >
            {{ label }}
            <span v-if="required" class="font-bold text-red-500" aria-hidden="true">*</span>
        </label>

        <!-- Generated Chip List -->
        <div
            :id="groupId"
            :role="multiple ? 'group' : 'radiogroup'"
            :aria-labelledby="label ? `${groupId}-label` : undefined"
            :aria-describedby="ariaDescribedBy"
            class="flex flex-wrap gap-2"
        >
            <AppChip
                v-for="cat in options"
                :key="String(cat.value)"
                :is-pressed="isSelected(cat.value)"
                :icon="cat.icon"
                :disabled="isDisabled || cat.disabled"
                :is-loading="isLoading"
                @click="handleToggle(cat.value)"
            >
                {{ cat.label }}
            </AppChip>
        </div>

        <!-- Error Message -->
        <p v-if="errorMessage" :id="errorId" role="alert" class="mt-1.5 text-xs text-red-500">
            {{ errorMessage }}
        </p>

        <!-- Helper Hint -->
        <p v-else-if="hint" :id="hintId" class="text-text-soft/70 mt-1.5 text-xs">
            {{ hint }}
        </p>
    </div>
</template>
