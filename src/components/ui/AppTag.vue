<!--
===============================================================================
  AppTag.vue — Atomic Toggleable Chip Button Component
===============================================================================

  Features:
  - Accessibility (A11y): Supports aria-pressed for toggles or aria-checked.
  - State Support: Active/Pressed state, disabled, loading (with spinner), custom variant styles.
  - Icon Rendering: Supports optional left/right icons via props or default slots.
  - Filter Hint Animation: Highlights available filter options when `isInFilter` is true.

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

  3. Filter suggestion chip:
     <AppTag
         :is-pressed="filters.categories.includes('lucid')"
         is-in-filter
         @click="toggleArrayFilter('categories', 'lucid')"
     >
         Lucid
     </AppTag>

===============================================================================
-->

<script setup lang="ts">
    import { computed, useId, type Component } from 'vue';
    import { Loader2 } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';

    interface Props {
        isPressed?: boolean;
        isInFilter?: boolean; // Новый пропс для демонстрации доступности фильтрации
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        isLoading?: boolean;
        icon?: Component;
        hint?: string;
        id?: string;
        role?: string;
        ariaChecked?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        isPressed: false,
        isInFilter: false,
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
        :role="role"
        :disabled="isDisabled"
        :aria-pressed="role ? undefined : isPressed"
        :aria-checked="ariaChecked"
        class="focus:ring-accent/50 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :class="[
            isPressed
                ? 'border-accent bg-accent/20 text-accent font-semibold shadow-sm'
                : isInFilter
                  ? 'border-accent/60 bg-bg-secondary text-text-primary hover:border-accent hover:bg-accent/10 animate-pulse shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.15)]'
                  : 'border-border bg-bg-secondary text-text-soft hover:border-border/80 hover:text-text-primary',
        ]"
        @click="handleClick"
    >
        <!-- Spinner when loading -->
        <Loader2
            v-if="isLoading"
            class="text-text-soft h-3.5 w-3.5 shrink-0 animate-spin"
            aria-hidden="true"
        />

        <!-- Optional Icon -->
        <component :is="icon" v-else-if="icon" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />

        <!-- Content/Text -->
        <span>
            <slot />
        </span>

        <AppTooltip v-if="hint" :content="hint" />
    </button>
</template>
