import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUIStore } from '@/stores/modules/ui';
import ToastContainer from '@/components/ui/AppToastContainer.vue';

describe('ToastContainer.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    describe('Rendering & State', () => {
        it('renders nothing when there are no toasts', () => {
            const wrapper = mount(ToastContainer);
            expect(wrapper.findAll('.pointer-events-auto').length).toBe(0);
        });

        it('renders toasts from the toastStore correctly', () => {
            const toastStore = useUIStore();
            toastStore.toasts = [
                {
                    id: '1',
                    type: 'success',
                    message: 'Operation completed successfully!',
                },
                {
                    id: '2',
                    type: 'error',
                    message: 'An error occurred.',
                },
            ];

            const wrapper = mount(ToastContainer);
            const toasts = wrapper.findAll('.pointer-events-auto');

            expect(toasts.length).toBe(2);
            expect(wrapper.text()).toContain('Operation completed successfully!');
            expect(wrapper.text()).toContain('An error occurred.');
        });
    });

    describe('Actions & Interactivity', () => {
        it('calls onAction callback and removes toast when action button is clicked', async () => {
            const toastStore = useUIStore();
            const onActionMock = vi.fn();

            toastStore.toasts = [
                {
                    id: '1',
                    type: 'info',
                    message: 'New update available',
                    actionLabel: 'Update',
                    onAction: onActionMock,
                },
            ];

            const wrapper = mount(ToastContainer);
            const actionButton = wrapper.findComponent({ name: 'AppButton' });

            expect(actionButton.exists()).toBe(true);
            expect(actionButton.text()).toBe('Update');

            await actionButton.trigger('click');

            expect(onActionMock).toHaveBeenCalledTimes(1);
            expect(toastStore.toasts.length).toBe(0);
        });

        it('removes toast when close button is clicked (when showProgress is false)', async () => {
            const toastStore = useUIStore();
            toastStore.toasts = [
                {
                    id: '1',
                    type: 'warning',
                    message: 'Warning message',
                    showProgress: false,
                },
            ];

            const wrapper = mount(ToastContainer);
            const buttons = wrapper.findAllComponents({ name: 'AppButton' });

            expect(buttons.length).toBe(1);

            await buttons[0].trigger('click');
            expect(toastStore.toasts.length).toBe(0);
        });
    });

    describe('Progress Bar', () => {
        it('renders progress bar when showProgress is true and duration > 0', () => {
            const toastStore = useUIStore();
            toastStore.toasts = [
                {
                    id: '1',
                    type: 'success',
                    message: 'Auto-dismissing toast',
                    showProgress: true,
                    duration: 5000,
                },
            ];

            const wrapper = mount(ToastContainer);
            const progressBar = wrapper.find('.progress-bar');

            expect(progressBar.exists()).toBe(true);
            expect(progressBar.attributes('style')).toContain('animation-duration: 5000ms');
        });

        it('does not render progress bar when showProgress is false', () => {
            const toastStore = useUIStore();
            toastStore.toasts = [
                {
                    id: '1',
                    type: 'success',
                    message: 'Static toast',
                    showProgress: false,
                },
            ];

            const wrapper = mount(ToastContainer);
            expect(wrapper.find('.progress-bar').exists()).toBe(false);
        });
    });
});
