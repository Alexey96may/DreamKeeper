import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppTextInput from '@/components/ui/AppTextInput.vue';

describe('AppTextInput.vue', () => {
    describe('Rendering & Props', () => {
        it('renders label, input with default attributes, and required indicator', () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: '',
                    label: 'Dream Title',
                    placeholder: 'Enter title...',
                    required: true,
                },
            });

            const label = wrapper.find('label');
            expect(label.exists()).toBe(true);
            expect(label.text()).toContain('Dream Title');
            expect(wrapper.find('.text-status-error').exists()).toBe(true);

            const input = wrapper.find('input');
            expect(input.exists()).toBe(true);
            expect(input.attributes('placeholder')).toBe('Enter title...');
            expect(input.attributes('type')).toBe('text');
            expect(input.attributes('aria-required')).toBe('true');
        });

        it('renders search icon and clear button when type is search and modelValue is present', () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: 'Flying',
                    type: 'search',
                },
            });

            expect(wrapper.find('svg.lucide-search').exists()).toBe(true);
            expect(wrapper.find('button[aria-label="Очистить поиск"]').exists()).toBe(true);
        });

        it('displays error message and sets aria-invalid when errorMessage is provided', () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: '',
                    errorMessage: 'Title is required',
                },
            });

            const input = wrapper.find('input');
            expect(input.attributes('aria-invalid')).toBe('true');
            expect(input.classes()).toContain('border-status-error');
            expect(wrapper.text()).toContain('Title is required');
        });
    });

    describe('v-model & Events', () => {
        it('emits update:modelValue with input value on input event', async () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: '',
                },
            });

            const input = wrapper.find('input');
            input.element.value = 'New Title';
            await input.trigger('input');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New Title']);
        });

        it('clears input value when clear button is clicked', async () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: 'Search term',
                    type: 'search',
                },
            });

            const clearButton = wrapper.find('button[aria-label="Очистить поиск"]');
            await clearButton.trigger('click');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
        });

        it('forwards blur, focus, and change events correctly', async () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: 'Test',
                },
            });

            const input = wrapper.find('input');

            await input.trigger('focus');
            expect(wrapper.emitted('focus')).toBeTruthy();

            await input.trigger('blur');
            expect(wrapper.emitted('blur')).toBeTruthy();

            await input.trigger('change');
            expect(wrapper.emitted('change')).toBeTruthy();
        });
    });

    describe('Disabled & Loading States', () => {
        it('disables input and shows loading spinner when isLoading is true', () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: '',
                    isLoading: true,
                },
            });

            const input = wrapper.find('input');
            expect(input.attributes('disabled')).toBeDefined();
            expect(wrapper.find('.animate-spin').exists()).toBe(true);
        });

        it('disables input when disabled prop is true', () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: '',
                    disabled: true,
                },
            });

            const input = wrapper.find('input');
            expect(input.attributes('disabled')).toBeDefined();
            expect(wrapper.find('.animate-spin').exists()).toBe(false);
        });
    });

    describe('Exposed Methods & Refs', () => {
        it('exposes focus and inputRef correctly', () => {
            const wrapper = mount(AppTextInput, {
                props: {
                    modelValue: '',
                },
            });

            const vm = wrapper.vm as InstanceType<typeof AppTextInput>;
            expect(vm.focus).toBeTypeOf('function');
            expect(vm.inputRef).toBeInstanceOf(HTMLInputElement);
        });
    });
});
