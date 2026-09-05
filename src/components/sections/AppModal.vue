<script setup lang="ts">
    /**
     * @file Modal.vue
     * @description Accessible modal component with focus trap, body scroll lock, teleportation, and Vue transition animations.
     *
     * @prop {boolean} modelValue - Controls the visibility of the modal (v-model binding).
     * @prop {string} [title=""] - Default header title string.
     * @prop {boolean} [closeOnOverlay=true] - Whether clicking the background overlay closes the modal.
     *
     * @emits update:modelValue - Updates visibility state.
     * @emits close - Triggered when the modal is requested to close.
     *
     * @slot header - Custom header content (overrides default title and close button container).
     * @slot default - Main body content of the modal.
     * @slot footer - Footer content (action buttons).
     *
     * Usage Example:
     *
     <AppModal
      v-model="isModalOpen"
      title="Confirm Action"
      :close-on-overlay="true"
      @close="handleClose"
    >
      <!-- Body content -->
      <p>Are you sure you want to proceed with this operation?</p>

      <!-- Footer slot -->
      <template #footer>
        <button @click="isModalOpen = false">Cancel</button>
        <button class="primary" @click="confirmAction">Confirm</button>
      </template>
    </AppModal>
     *
     *
     */

    import { ref, watch, onUnmounted, nextTick } from 'vue';

    const props = withDefaults(
        defineProps<{
            modelValue: boolean;
            title?: string;
            closeOnOverlay?: boolean;
        }>(),
        {
            title: '',
            closeOnOverlay: true,
        },
    );

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
        (e: 'close'): void;
    }>();

    const modalRef = ref<HTMLElement | null>(null);
    const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;
    let previousActiveElement: HTMLElement | null = null;

    // Close handler
    const close = () => {
        emit('update:modelValue', false);
        emit('close');
    };

    const handleOverlayClick = () => {
        if (props.closeOnOverlay) {
            close();
        }
    };

    // Focus Trap & Scroll Lock logic
    watch(
        () => props.modelValue,
        async (isOpen) => {
            if (isOpen) {
                previousActiveElement = document.activeElement as HTMLElement;
                document.body.style.overflow = 'hidden';

                await nextTick();
                modalRef.value?.focus();
                setupFocusTrap();
            } else {
                document.body.style.overflow = '';
                cleanupFocusTrap();
                previousActiveElement?.focus();
            }
        },
    );

    let handleKeydown: (e: KeyboardEvent) => void;

    const setupFocusTrap = () => {
        const modal = modalRef.value;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
                return;
            }

            if (e.key === 'Tab') {
                if (focusableElements.length === 0) {
                    e.preventDefault();
                    return;
                }

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement?.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement?.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeydown);
    };

    const cleanupFocusTrap = () => {
        if (handleKeydown) {
            document.removeEventListener('keydown', handleKeydown);
        }
    };

    onUnmounted(() => {
        document.body.style.overflow = '';
        cleanupFocusTrap();
    });
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div
                v-if="modelValue"
                class="modal-backdrop"
                @click.self="handleOverlayClick"
                @keydown.esc="close"
                tabindex="-1"
            >
                <div
                    ref="modalRef"
                    class="modal-container"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="titleId"
                >
                    <!-- Header Slot / Default Title -->
                    <header class="modal-header">
                        <slot name="header">
                            <h3 :id="titleId" class="modal-title">{{ title }}</h3>
                        </slot>
                        <button class="modal-close-btn" aria-label="Close modal" @click="close">
                            &times;
                        </button>
                    </header>

                    <!-- Body Slot -->
                    <div class="modal-body">
                        <slot />
                    </div>

                    <!-- Footer Slot -->
                    <footer v-if="$slots.footer" class="modal-footer">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        outline: none;
    }

    .modal-container {
        background: white;
        border-radius: 8px;
        width: 100%;
        max-width: 500px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        outline: none;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .modal-title {
        margin: 0;
        font-size: 1.25rem;
    }

    .modal-close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }

    .modal-body {
        margin-bottom: 16px;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }

    /* Transitions */
    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 0.25s ease;
    }

    .modal-fade-enter-from,
    .modal-fade-leave-to {
        opacity: 0;
    }

    .modal-fade-enter-active .modal-container,
    .modal-fade-leave-active .modal-container {
        transition: transform 0.25s ease;
    }

    .modal-fade-enter-from .modal-container,
    .modal-fade-leave-to .modal-container {
        transform: scale(0.95);
    }
</style>
