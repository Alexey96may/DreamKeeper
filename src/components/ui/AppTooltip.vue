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

  Usage Example:
  -----------------------------------------------------------------------------
  <template>
    <label class="form-label" :for="fieldId">
      <span>Category of Phenomenon</span>

      Embedded AppTooltip inside label
      <AppTooltip
        content="Select the primary phenomenon experienced during the sleep paralysis phase."
        :required="true"
      />
    </label>
    <select :id="fieldId" v-model="selectedCategory">
      options
    </select>
  </template>

  <script setup lang="ts">
  import AppTooltip from '@/components/AppTooltip.vue';
  import { ref } from 'vue';

  const fieldId = 'phenomenon-category';
  const selectedCategory = ref('');
  </script>
  =============================================================================
-->

<script setup lang="ts">
    import { ref, onMounted, onUnmounted, useId } from 'vue';
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
    const tooltipRef = ref<HTMLElement | null>(null);

    // Unique IDs for WCAG accessibility (aria-describedby / aria-controls)
    const tooltipId = useId();

    const toggleTooltip = (event: Event) => {
        // Prevent form triggers or default label focusing behavior
        event.preventDefault();
        event.stopPropagation();
        isOpen.value = !isOpen.value;
    };

    const closeTooltip = () => {
        isOpen.value = false;
    };

    // Keyboard listener for Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen.value) {
            closeTooltip();
        }
    };

    // Click Outside listener
    const handleClickOutside = (event: MouseEvent) => {
        if (tooltipRef.value && !tooltipRef.value.contains(event.target as Node)) {
            closeTooltip();
        }
    };

    onMounted(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
    });
</script>

<template>
    <span ref="tooltipRef" class="app-tooltip-wrapper">
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
        <Transition name="tooltip-fade">
            <div
                v-if="isOpen"
                :id="tooltipId"
                class="app-tooltip-popover"
                role="tooltip"
                aria-live="polite"
            >
                <div class="app-tooltip-arrow" aria-hidden="true"></div>
                <p class="app-tooltip-content line-clamp-3">{{ content }}</p>
            </div>
        </Transition>
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
        color: #9ca3af; /* Tailwind gray-400 */
        cursor: pointer;
        border-radius: 9999px;
        transition:
            color 0.15s ease,
            transform 0.15s ease;
        outline: none;
    }

    /* Base Hover / Active */
    .app-tooltip-trigger:hover,
    .app-tooltip-trigger.is-active {
        color: #3b82f6; /* Tailwind blue-500 */
    }

    /* Required Styling Override */
    .app-tooltip-trigger.is-required {
        color: #ef4444; /* Tailwind red-500 */
    }

    .app-tooltip-trigger.is-required:hover,
    .app-tooltip-trigger.is-required.is-active {
        color: #dc2626; /* Tailwind red-600 */
    }

    .app-tooltip-trigger:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }

    .app-tooltip-trigger.is-required:focus-visible {
        outline-color: #ef4444;
    }

    .app-tooltip-icon {
        flex-shrink: 0;
    }

    /* Popover Element */
    .app-tooltip-popover {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        width: max-content;
        max-width: 260px;
        padding: 0.5rem 0.75rem;
        background-color: #1f2937; /* Tailwind gray-800 */
        color: #f9fafb; /* Tailwind gray-50 */
        font-size: 0.75rem;
        line-height: 1.25rem;
        font-weight: 400;
        border-radius: 0.375rem;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        pointer-events: auto;
        white-space: normal;
        word-break: break-word;
    }

    /* Arrow pointer */
    .app-tooltip-arrow {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #1f2937;
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
        transform: translate(-50%, 4px);
    }
</style>
