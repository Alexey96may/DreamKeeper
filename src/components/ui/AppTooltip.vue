<!--
  =============================================================================
  AppTooltip Component Documentation
  =============================================================================

  Description:
  An accessible, interactive tooltip/popover component triggered by click/tap.
  Designed to be embedded directly inside form labels or field headers.
  Handles keyboard navigation (Esc, Space, Enter), outside clicks, and screen readers.

  Props:
  - content (string) [Required]: The text message displayed inside the popover.
  - required (boolean) [Optional]: Changes the trigger icon state/color to indicate a required field.
  - iconSize (number) [Optional]: Size of the Lucide HelpCircle icon (default: 16).
-->

<script setup lang="ts">
    import { ref, onMounted, onUnmounted, useId, nextTick } from 'vue';
    import { HelpCircle } from 'lucide-vue-next';

    interface Props {
        content: string;
        required?: boolean;
        iconSize?: number;
    }

    withDefaults(defineProps<Props>(), {
        required: false,
        iconSize: 16,
    });

    const isOpen = ref(false);
    const triggerRef = ref<HTMLElement | null>(null);
    const popoverRef = ref<HTMLElement | null>(null);

    // Координаты и смещение стрелки для Teleport
    const popoverStyle = ref({
        top: '0px',
        left: '0px',
    });

    const arrowOffset = ref(0); // Смещение стрелки, если поповер сместился к краю

    const tooltipId = useId();

    const updatePosition = () => {
        if (!triggerRef.value) return;
        const triggerRect = triggerRef.value.getBoundingClientRect();

        // Базовые координаты: центр триггера по горизонтали, сверху от триггера
        const spacing = 8;
        const top = triggerRect.top + window.scrollY - spacing;
        const triggerCenterX = triggerRect.left + triggerRect.width / 2;

        let left = triggerCenterX;
        let currentArrowOffset = 0;

        // Примерная ширина поповера (max-width: 260px, но берем реальную или максимальную)
        const popoverWidth = popoverRef.value ? popoverRef.value.offsetWidth : 260;
        const halfWidth = popoverWidth / 2;
        const padding = 12; // Минимальный отступ от края экрана в пикселях

        // Проверяем выход за левый край экрана
        if (triggerCenterX - halfWidth < padding) {
            const overflowLeft = padding - (triggerCenterX - halfWidth);
            left = padding + halfWidth;
            currentArrowOffset = -overflowLeft; // Сдвигаем стрелку вправо
        }
        // Проверяем выход за правый край экрана
        else if (triggerCenterX + halfWidth > window.innerWidth - padding) {
            const overflowRight = triggerCenterX + halfWidth - (window.innerWidth - padding);
            left = window.innerWidth - padding - halfWidth;
            currentArrowOffset = overflowRight; // Сдвигаем стрелку влево
        }

        popoverStyle.value = {
            top: `${top}px`,
            left: `${left + window.scrollX}px`,
        };
        arrowOffset.value = currentArrowOffset;
    };

    const toggleTooltip = async (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        isOpen.value = !isOpen.value;
        if (isOpen.value) {
            await nextTick();
            updatePosition();
        }
    };

    const closeTooltip = () => {
        isOpen.value = false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen.value) {
            closeTooltip();
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const isClickInsideTrigger = triggerRef.value?.contains(target);
        const isClickInsidePopover = popoverRef.value?.contains(target);

        if (!isClickInsideTrigger && !isClickInsidePopover) {
            closeTooltip();
        }
    };

    const handleScrollOrResize = () => {
        if (isOpen.value) {
            updatePosition();
        }
    };

    onMounted(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
    });
</script>

<template>
    <span ref="triggerRef" class="app-tooltip-wrapper">
        <!-- Trigger Button -->
        <button
            type="button"
            class="app-tooltip-trigger"
            :class="{
                'is-active': isOpen,
                'is-required': required,
            }"
            :aria-expanded="isOpen"
            :aria-controls="tooltipId"
            :aria-required="required"
            aria-label="Показать подсказку"
            @click.stop="toggleTooltip"
        >
            <HelpCircle :size="iconSize" class="app-tooltip-icon" />
        </button>

        <!-- Popover Container -->
        <Teleport to="body">
            <Transition name="tooltip-fade">
                <div
                    v-if="isOpen"
                    ref="popoverRef"
                    :id="tooltipId"
                    class="app-tooltip-popover"
                    :style="popoverStyle"
                    role="tooltip"
                    aria-live="polite"
                >
                    <!-- Стрелка динамически смещается, если поповер прижался к краю экрана -->
                    <div
                        class="app-tooltip-arrow"
                        :style="{ transform: `translateX(calc(-50% + ${arrowOffset}px))` }"
                        aria-hidden="true"
                    ></div>
                    <p class="app-tooltip-content line-clamp-3 text-xs lg:text-sm">{{ content }}</p>
                </div>
            </Transition>
        </Teleport>
    </span>
</template>

<style scoped>
    /* Main Wrapper */
    .app-tooltip-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        position: relative;
        vertical-align: middle;
        line-height: 1;
    }

    /* Trigger Button */
    .app-tooltip-trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--text-muted, #9ca3af);
        cursor: pointer;
        border-radius: 9999px;
        transition:
            color 0.15s ease,
            transform 0.15s ease;
        outline: none;
    }

    .app-tooltip-trigger:hover,
    .app-tooltip-trigger.is-active {
        color: var(--accent, #3b82f6);
    }

    .app-tooltip-trigger.is-required {
        color: var(--danger-text, #ef4444);
        transition: all 0.25s;
    }

    .app-tooltip-trigger.is-required:hover,
    .app-tooltip-trigger.is-required.is-active {
        filter: brightness(0.8);
    }

    .app-tooltip-trigger:focus-visible {
        outline: 2px solid var(--accent, #3b82f6);
        outline-offset: 2px;
    }

    .app-tooltip-icon {
        flex-shrink: 0;
    }

    /* Popover Element */
    .app-tooltip-popover {
        position: absolute;
        transform: translate(-50%, -100%);
        z-index: 9999;
        width: max-content;
        max-width: 260px;
        padding: 0.5rem 0.75rem;
        background-color: var(--bg-secondary, #1f2937);
        color: var(--text-primary, #f9fafb);
        border: 1px solid var(--border-color, #374151);
        font-size: 0.75rem;
        line-height: 1.25rem;
        font-weight: 400;
        border-radius: 0.375rem;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.2),
            0 4px 6px -2px rgba(0, 0, 0, 0.1);
        pointer-events: auto;
        white-space: normal;
        word-break: break-word;
    }

    /* Arrow pointer */
    .app-tooltip-arrow {
        position: absolute;
        top: 100%;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid var(--bg-secondary, #1f2937);
        transition: transform 0.05s linear;
    }

    /* Vue Animations */
    .tooltip-fade-enter-active,
    .tooltip-fade-leave-active {
        transition:
            opacity 0.15s ease,
            transform 0.15s ease;
    }

    .tooltip-fade-enter-from,
    .tooltip-fade-leave-to {
        opacity: 0;
        transform: translate(-50%, calc(-100% + 4px));
    }
</style>
