<!--
===============================================================================
  AppTag.vue — Atomic Toggleable Chip Button Component
===============================================================================

  Features:
  - Accessibility (A11y): Supports aria-pressed for toggles or aria-checked.
  - State Support: Active/Pressed state, disabled, loading (with spinner), custom variant styles.
  - Icon Rendering: Supports optional left/right icons via props or default slots.

-------------------------------------------------------------------------------
  USAGE EXAMPLES:
-------------------------------------------------------------------------------

  1. Simple toggle chip button:
     <AppTag
         :is-pressed="form.categories.includes('lucid')"
         @click="toggleCategory('lucid')"
     >
         Lucid Dream
     </AppTag>

  2. Chip with icon and active state:
     <AppTag
         :is-pressed="isActive"
         :icon="MoonIcon"
         @click="isActive = !isActive"
     >
         Night
     </AppTag>

  3. Disabled or Loading chip:
     <AppTag :is-loading="isUpdating" disabled>
         Processing...
     </AppTag>

===============================================================================
-->

<script setup lang="ts">
import { computed, useId, type Component } from 'vue';
import { Loader2 } from 'lucide-vue-next';

interface Props {
    isPressed?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    isLoading?: boolean;
    icon?: Component;
    id?: string;
}

const props = withDefaults(defineProps<Props>(), {
    isPressed: false,
    type: 'button',
    disabled: false,
    isLoading: false,
});

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const defaultId = useId();
const chipId = computed(() => props.id || `app-chip-${defaultId}`);
const isDisabled = computed(() => props.disabled || props.isLoading);

const handleClick = (event: MouseEvent) => {
    if (isDisabled.value) return;
    emit('click', event);
};
</script>

<template>
    <button
        :id="chipId"
        :type="type"
        :disabled="isDisabled"
        :aria-pressed="isPressed"
        class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[
            isPressed
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-border bg-bg-secondary text-text-soft hover:border-border/80 hover:text-text-primary',
        ]"
        @click="handleClick"
    >
        <!-- Spinner when loading -->
        <Loader2
            v-if="isLoading"
            class="h-3.5 w-3.5 shrink-0 animate-spin text-text-soft"
            aria-hidden="true"
        />

        <!-- Optional Icon -->
        <component
            :is="icon"
            v-else-if="icon"
            class="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
        />

        <!-- Content/Text -->
        <span>
            <slot />
        </span>
    </button>
</template>