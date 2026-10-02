import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppTextarea from '@/components/ui/AppTextarea.vue';

describe('AppTextarea.vue', () => {
    describe('Rendering & Props', () => {
        it('renders label, textarea with default attributes, and required indicator', () => {
            const wrapper = mount(AppTextarea, {
                props: {
                    modelValue: '',
                    label: 'Detailed Description',
                    placeholder: 'Enter details...',
                    rows: 4,
                    required: true,
                },
            });

            const label = wrapper.find('label');
            expect(label.exists()).toBe(true);
            expect(label.text()).toContain('Detailed Description');
            expect(wrapper.find('.text-status-error').exists()).toBe(true);

            const textarea = wrapper.find('textarea');
            expect(textarea.exists()).toBe(true);
            expect(textarea.attributes('placeholder')).toBe('Enter details...');
            expect(textarea.attributes('rows')).toBe('4');
            expect(textarea.attributes('aria-required')).toBe('true');
        });

        it('displays error message and sets aria-invalid when errorMessage is provided', () => {
            const wrapper = mount(AppTextarea, {
                props: {
                    modelValue: 'Some text',
                    errorMessage: 'Field is required',
                },
            });

            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('aria-invalid')).toBe('true');
            expect(textarea.classes()).toContain('border-status-error');
            expect(wrapper.text()).toContain('Field is required');
        });
    });

    describe('v-model & Events', () => {
        it('emits update:modelValue with textarea value on input', async () => {
            const wrapper = mount(AppTextarea, {
                props: {
                    modelValue: '',
                },
            });

            const textarea = wrapper.find('textarea');
            textarea.element.value = 'New dream note';
            await textarea.trigger('input');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New dream note']);
        });

        it('forwards blur, focus, and change events correctly', async () => {
            const wrapper = mount(AppTextarea, {
                props: {
                    modelValue: 'Test',
                },
            });

            const textarea = wrapper.find('textarea');

            await textarea.trigger('focus');
            expect(wrapper.emitted('focus')).toBeTruthy();

            await textarea.trigger('blur');
            expect(wrapper.emitted('blur')).toBeTruthy();

            await textarea.trigger('change');
            expect(wrapper.emitted('change')).toBeTruthy();
        });
    });

    describe('Disabled & Loading States', () => {
        it('disables textarea and shows loading spinner when isLoading is true', () => {
            const wrapper = mount(AppTextarea, {
                props: {
                    modelValue: '',
                    isLoading: true,
                },
            });

            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('disabled')).toBeDefined();
            expect(wrapper.find('.animate-spin').exists()).toBe(true);
        });

        it('disables textarea when disabled prop is true', () => {
            const wrapper = mount(AppTextarea, {
                props: {
                    modelValue: '',
                    disabled: true,
                },
            });

            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('disabled')).toBeDefined();
            expect(wrapper.find('.animate-spin').exists()).toBe(false);
        });
    });

    describe('Exposed Methods & Refs', () => {
        it('exposes focus and inputRef correctly', () => {
            const wrapper = mount(AppTextarea, {
                props: {
                    modelValue: '',
                },
            });

            const vm = wrapper.vm as InstanceType<typeof AppTextarea>;
            expect(vm.focus).toBeTypeOf('function');
            expect(vm.inputRef).toBeInstanceOf(HTMLTextAreaElement);
        });
    });
});
