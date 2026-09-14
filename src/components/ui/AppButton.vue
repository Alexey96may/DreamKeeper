<!--
===============================================================================
  AppButton.vue — Universal Accessible Button UI Component
===============================================================================

  Features:
  - Smart Tag Rendering: Renders as <button>, <a> (external link), or <RouterLink>
    (internal router navigation) based on 'href' / 'to' props.
  - Accessibility (A11y): Full keyboard navigation, auto aria-disabled, aria-busy
    during loading, visible focus-ring styles, and screen-reader support.
  - Variants & Sizes: Configurable visual variants (primary, secondary, danger,
    outline, ghost) and standard sizes (xs, sm, md, lg).
  - State Management: Native disabled, loading state with an animated spinner,
    automatic click suppression while loading/disabled.
  - Flexible Content: Supports left/right icons via props or dedicated slots.

-------------------------------------------------------------------------------
  USAGE EXAMPLES:
-------------------------------------------------------------------------------

  1. Primary form submit button with loading state:
     <AppButton
         type="submit"
         variant="primary"
         :is-loading="isSubmitting"
     >
         Save Entry
     </AppButton>

  2. Secondary button with leading icon & small size:
     <AppButton
         variant="secondary"
         size="sm"
         :icon-left="PlusIcon"
         @click="addCategory"
     >
         Add Category
     </AppButton>

  3. Router link button:
     <AppButton
         to="/journal"
         variant="ghost"
         size="xs"
     >
         Back to Journal
     </AppButton>

  4. Danger action button:
     <AppButton
         variant="danger"
         :icon-left="TrashIcon"
         @click="deleteItem"
     >
         Delete
     </AppButton>

===============================================================================
-->

<script setup lang="ts">
    import { computed, useSlots, type Component } from 'vue';
    import { RouterLink } from 'vue-router';
    import { Loader2 } from 'lucide-vue-next';

    type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'add' | 'back';
    type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
    type ButtonType = 'button' | 'submit' | 'reset';

    interface Props {
        variant?: ButtonVariant;
        size?: ButtonSize;
        type?: ButtonType;
        disabled?: boolean;
        isLoading?: boolean;
        to?: string | object;
        href?: string;
        target?: string;
        rel?: string;
        iconLeft?: Component;
        iconRight?: Component;
        fullWidth?: boolean;
        ariaLabel?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        variant: 'primary',
        size: 'sm',
        type: 'button',
        disabled: false,
        isLoading: false,
        fullWidth: false,
    });

    const emit = defineEmits<{
        (e: 'click', event: MouseEvent): void;
    }>();

    const slots = useSlots();

    const isDisabled = computed(() => props.disabled || props.isLoading);

    // Determine component tag dynamically
    const tag = computed(() => {
        if (props.to) return RouterLink;
        if (props.href) return 'a';
        return 'button';
    });

    // Style mappings
    const variantClasses: Record<ButtonVariant, string> = {
        primary:
            'bg-accent text-white hover:bg-accent/20 border-transparent shadow-sm active:scale-[0.98]',
        secondary:
            'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border-border active:scale-[0.98]',
        danger: 'bg-bg-danger text-text-danger hover:bg-bg-danger/20 border-red-500/30 active:scale-[0.98]',
        outline:
            'bg-transparent text-text-primary hover:bg-bg-secondary border-border active:scale-[0.98]',
        ghost: 'bg-transparent text-text-soft hover:text-text-primary hover:bg-bg-secondary border-transparent',
        add: 'bg-transparent text-accent text-xs font-medium hover:underline border-none active:scale-[0.98]',
        back: 'text-text-mute hover:text-text-primary focus-visible:outline-accent border-none  flex cursor-pointer items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2',
    };

    const sizeClasses: Record<ButtonSize, string> = {
        xs: 'p-1.5 text-[11px] rounded-md',
        sm: 'p-2 text-xs rounded-lg',
        md: 'p-2.5 text-sm rounded-lg',
        lg: 'p-3 text-base rounded-xl',
    };

    const iconSizeClasses: Record<ButtonSize, string> = {
        xs: 'h-3.5 w-3.5 flex-none group-hover:text-accent',
        sm: 'h-4 w-4 flex-none group-hover:text-accent',
        md: 'h-5 w-5 flex-none group-hover:text-accent',
        lg: 'h-6 w-6 flex-none group-hover:text-accent',
    };

    const handleClick = (event: MouseEvent) => {
        if (isDisabled.value) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        emit('click', event);
    };
</script>

<template>
    <component
        :is="tag"
        :to="to"
        :href="href"
        :target="href ? target : undefined"
        :rel="href ? rel || 'noopener noreferrer' : undefined"
        :type="tag === 'button' ? type : undefined"
        :disabled="tag === 'button' ? isDisabled : undefined"
        :aria-disabled="isDisabled || undefined"
        :aria-busy="isLoading || undefined"
        :aria-label="ariaLabel"
        class="group focus-visible:ring-accent/50 inline-grid grid-flow-col items-center justify-center border font-medium transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[variantClasses[variant], sizeClasses[size], fullWidth ? 'w-full' : '']"
        @click="handleClick"
    >
        <!-- Loading Spinner -->
        <Loader2
            v-if="isLoading"
            class="shrink-0 animate-spin"
            :class="iconSizeClasses[size]"
            aria-hidden="true"
        />

        <!-- Left Icon -->
        <component
            :is="iconLeft"
            v-else-if="iconLeft"
            class="shrink-0 transition duration-250 ease-in-out"
            :class="[iconSizeClasses[size], variant === 'back' ? 'group-hover:-translate-x-1' : '']"
            aria-hidden="true"
        />
        <slot v-else name="icon-left" />

        <!-- Button Content -->
        <span v-if="slots.default" class="truncate">
            <slot />
        </span>

        <!-- Right Icon -->
        <component
            :is="iconRight"
            v-if="iconRight && !isLoading"
            class="shrink-0 transition duration-250"
            :class="iconSizeClasses[size]"
            aria-hidden="true"
        />
        <slot v-else-if="!isLoading" name="icon-right" />
    </component>
</template>
