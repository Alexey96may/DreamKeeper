<!--
  =============================================================================
  AppErrorMessage Component
  =============================================================================
  An accessible, lightweight error message component designed for form fields
  and dynamic error alerts.

  @props
    * errorMessage (string)  - The error message text to render.
    * errorId (string)       - Unique ID used for aria-describedby binding on target inputs.
    * ariaLive ('assertive' | 'polite' | 'off') - Priority level for screen reader announcements. Default: 'polite'.
    * size ('xs' | 'sm' | 'md') - Text size variant. Default: 'xs'.

  @slots
    * default - Custom error content if errorMessage string is not enough.

  @accessibility (A11y)
    - Uses role="alert" or role="status" depending on aria-live urgency.
    - Uses aria-live to trigger automatic screen reader announcement on error updates.
    - Uses aria-atomic="true" so screen readers read the entire message.

  -----------------------------------------------------------------------------
  USAGE EXAMPLE:
  -----------------------------------------------------------------------------
  <script setup lang="ts">
  import { ref } from 'vue';
  import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';

  const sourceIdError = ref('Пожалуйста, выберите источник интерпретации');
  </script>

  <template>
    <div class="form-group">
      <label for="source-id-input">Источник</label>

      <input
        id="source-id-input"
        type="text"
        :aria-invalid="!!sourceIdError"
        :aria-describedby="sourceIdError ? 'source-id-error' : undefined"
      />

      <AppErrorMessage
        :error-message="sourceIdError"
        error-id="source-id-error"
      />
    </div>
  </template>
  =============================================================================
-->

<script setup lang="ts">
    import { computed } from 'vue';

    interface Props {
        /**
         * Error message string. If empty or null, component renders nothing.
         */
        errorMessage?: string | null;
        /**
         * Unique HTML id linked to input's `aria-describedby`.
         */
        errorId?: string;
        /**
         * Priority for screen reader announcements.
         * 'polite': Reads after user stops typing/interacting.
         * 'assertive': Interrupts screen reader immediately.
         */
        ariaLive?: 'polite' | 'assertive' | 'off';
        /**
         * Font size variations using Tailwind CSS.
         */
        size?: 'xs' | 'sm' | 'md';
    }

    const props = withDefaults(defineProps<Props>(), {
        errorMessage: '',
        errorId: undefined,
        ariaLive: 'polite',
        size: 'xs',
    });

    // Map size prop to Tailwind text classes
    const sizeClasses = computed(() => {
        switch (props.size) {
            case 'sm':
                return 'text-sm';
            case 'md':
                return 'text-base';
            case 'xs':
            default:
                return 'text-xs';
        }
    });

    // Dynamically compute the ARIA role based on urgency
    const role = computed(() => {
        return props.ariaLive === 'assertive' ? 'alert' : 'status';
    });
</script>

<template>
    <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
    >
        <p
            v-if="errorMessage || $slots.default"
            :id="errorId"
            :role="role"
            :aria-live="ariaLive"
            aria-atomic="true"
            class="text-status-error mt-1 font-medium transition-all duration-150 ease-in-out"
            :class="sizeClasses"
        >
            <slot>{{ errorMessage }}</slot>
        </p>
    </Transition>
</template>
