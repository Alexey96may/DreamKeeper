<!--
===============================================================================
  AppButton.vue — Universal Accessible Responsive Button UI Component
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
            'bg-accent text-white hover:bg-accent-hover border-transparent shadow-sm active:scale-[0.98] cursor-pointer',
        secondary:
            'bg-bg-secondary text-text-secondary hover:text-text-inverse hover:bg-accent-hover border-border active:scale-[0.98] cursor-pointer',
        danger: 'text-danger-text hover:bg-danger-bg border-border-danger hover:scale-[0.98] cursor-pointer',
        outline:
            'bg-transparent text-text-primary hover:bg-accent-hover border-border active:scale-[0.98] cursor-pointer',
        ghost: 'bg-transparent text-text-muted hover:text-text-primary hover:bg-accent-hover border-transparent cursor-pointer',
        add: 'bg-transparent text-accent hover:text-accent/80 border-none active:scale-[0.98] cursor-pointer',
        back: 'text-text-mute hover:text-text-mute/80 focus-visible:outline-accent border-none flex cursor-pointer items-center gap-2 rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2',
    };

    /* Адаптивные размеры кнопок (Mobile -> Tablet -> Desktop >= 1024px) */
    const sizeClasses: Record<ButtonSize, string> = {
        xs: 'px-2 py-1 text-[10px] md:px-2.5 md:py-1.5 md:text-[11px] lg:px-3 lg:py-1.5 lg:text-xs rounded-md',
        sm: 'px-2.5 py-1.5 text-xs md:px-3 md:py-2 md:text-[13px] lg:px-3.5 lg:py-2 lg:text-sm rounded-lg',
        md: 'px-3 py-1.5 text-xs md:px-3.5 md:py-2 md:text-sm lg:px-4 lg:py-2.5 lg:text-base rounded-lg',
        lg: 'px-3.5 py-2 text-sm md:px-4 md:py-2.5 md:text-base lg:px-5 lg:py-3 lg:text-lg rounded-xl',
    };

    /* Адаптивные размеры иконок */
    const iconSizeClasses: Record<ButtonSize, string> = {
        xs: 'h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 flex-none',
        sm: 'h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4.5 lg:w-4.5 flex-none',
        md: 'h-4 w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5 flex-none',
        lg: 'h-4.5 w-4.5 md:h-5 md:w-5 lg:h-6 lg:w-6 flex-none',
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
        <!-- Loading Spinner / Content Container -->
        <div class="flex items-center gap-1">
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
                :class="[
                    iconSizeClasses[size],
                    variant === 'back' ? 'group-hover:-translate-x-1' : '',
                ]"
                aria-hidden="true"
            />
            <slot v-else name="icon-left" />

            <!-- Button Content -->
            <div v-if="slots.default" class="truncate">
                <slot />
            </div>

            <!-- Right Icon -->
            <component
                :is="iconRight"
                v-if="iconRight && !isLoading"
                class="shrink-0 transition duration-250"
                :class="iconSizeClasses[size]"
                aria-hidden="true"
            />
            <slot v-else-if="!isLoading" name="icon-right" />
        </div>
    </component>
</template>
