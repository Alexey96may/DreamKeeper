import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AppModal from '@/components/sections/AppModal.vue';

describe('AppModal.vue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.style.overflow = '';
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.style.overflow = '';
        document.body.innerHTML = '';
    });

    describe('Rendering & Props', () => {
        it('renders nothing when modelValue is false', () => {
            const wrapper = mount(AppModal, {
                props: {
                    modelValue: false,
                    title: 'Test Modal',
                },
                attachTo: document.body,
            });

            expect(document.querySelector('[role="dialog"]')).toBeNull();
            wrapper.unmount();
        });

        it('renders modal content, title and handles body scroll lock when modelValue is true', async () => {
            const wrapper = mount(AppModal, {
                props: {
                    modelValue: true,
                    title: 'Awesome Title',
                },
                slots: {
                    default: '<p>Modal body content</p>',
                    footer: '<button>Action</button>',
                },
                attachTo: document.body,
            });

            await wrapper.vm.$nextTick();

            const dialog = document.querySelector('[role="dialog"]');
            expect(dialog).not.toBeNull();
            expect(document.body.style.overflow).toBe('hidden');
            expect(document.body.textContent).toContain('Awesome Title');
            expect(document.body.textContent).toContain('Modal body content');
            expect(document.body.textContent).toContain('Action');

            wrapper.unmount();
            expect(document.body.style.overflow).toBe('');
        });
    });

    describe('Interactivity & Events', () => {
        it('emits update:modelValue(false) and close when close button is clicked', async () => {
            const wrapper = mount(AppModal, {
                props: {
                    modelValue: true,
                    title: 'Test',
                },
                attachTo: document.body,
            });

            await wrapper.vm.$nextTick();

            const closeBtn = document.querySelector('header button');
            expect(closeBtn).not.toBeNull();

            // Кликаем по кнопке закрытия в хедера
            (closeBtn as HTMLButtonElement).click();
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
            expect(wrapper.emitted('close')).toBeTruthy();

            wrapper.unmount();
        });

        it('closes modal on overlay click when closeOnOverlay is true', async () => {
            const wrapper = mount(AppModal, {
                props: {
                    modelValue: true,
                    title: 'Test',
                    closeOnOverlay: true,
                },
                attachTo: document.body,
            });

            await wrapper.vm.$nextTick();

            const overlay = document.querySelector('.fixed.inset-0');
            expect(overlay).not.toBeNull();

            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            overlay?.dispatchEvent(clickEvent);
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('close')).toBeTruthy();

            wrapper.unmount();
        });

        it('does not close modal on overlay click when closeOnOverlay is false', async () => {
            const wrapper = mount(AppModal, {
                props: {
                    modelValue: true,
                    title: 'Test',
                    closeOnOverlay: false,
                },
                attachTo: document.body,
            });

            await wrapper.vm.$nextTick();

            const overlay = document.querySelector('.fixed.inset-0');
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            overlay?.dispatchEvent(clickEvent);
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('close')).toBeUndefined();

            wrapper.unmount();
        });

        it('closes modal when Escape key is pressed', async () => {
            const wrapper = mount(AppModal, {
                props: {
                    modelValue: true,
                    title: 'Test',
                },
                attachTo: document.body,
            });

            await wrapper.vm.$nextTick();

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('close')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

            wrapper.unmount();
        });
    });
});
