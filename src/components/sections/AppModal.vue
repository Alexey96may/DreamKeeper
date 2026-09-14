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

    import AppButton from '@/components/ui/AppButton.vue';
    import { X } from 'lucide-vue-next';

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
                class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs outline-none"
                @click.self="handleOverlayClick"
                @keydown.esc="close"
                tabindex="-1"
            >
                <div
                    ref="modalRef"
                    class="bg-bg-elevated text-text-primary border-border-primary shadow-dropdown my-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border p-6 outline-none"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="titleId"
                >
                    <!-- Header Slot / Default Title -->
                    <header class="flex shrink-0 items-center justify-between pb-4">
                        <slot name="header">
                            <h3 :id="titleId" class="text-text-primary m-0 text-xl font-semibold">
                                {{ title }}
                            </h3>
                        </slot>

                        <AppButton
                            @click="close"
                            size="xs"
                            variant="danger"
                            aria-label="Закрыть модальное окно"
                            :icon-left="X"
                        />
                    </header>

                    <!-- Body Slot (Scrollable) -->
                    <div class="text-text-secondary my-2 flex-1 overflow-y-auto pr-1">
                        <slot />
                    </div>

                    <!-- Footer Slot -->
                    <footer v-if="$slots.footer" class="flex shrink-0 justify-end gap-2 pt-2">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
    /* Vue Transitions с использованием Tailwind-совместимых переменных */
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
