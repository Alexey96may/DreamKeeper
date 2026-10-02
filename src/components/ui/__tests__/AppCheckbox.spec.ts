import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppCheckbox from '@/components/ui/AppCheckbox.vue';
import { Loader2, Check } from 'lucide-vue-next';

describe('AppCheckbox.vue', () => {
    describe('Rendering & Props', () => {
        it('renders correctly with default props', () => {
            const wrapper = mount(AppCheckbox, {
                props: { label: 'Accept terms' },
            });

            expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
            expect(wrapper.text()).toContain('Accept terms');
            expect(wrapper.attributes('aria-invalid')).toBeUndefined();
        });

        it('shows required asterisk when required prop is true', () => {
            const wrapper = mount(AppCheckbox, {
                props: { label: 'Required field', required: true },
            });

            expect(wrapper.find('.text-status-error').text()).toBe('*');
            expect(wrapper.find('input').attributes('aria-required')).toBe('true');
        });

        it('renders hint component when hint is provided', () => {
            const wrapper = mount(AppCheckbox, {
                props: { label: 'With hint', hint: 'Helper tooltip text' },
            });

            expect(wrapper.findComponent({ name: 'AppTooltip' }).exists()).toBe(true);
        });
    });

    // 2. v-model (Boolean и Array)
    describe('v-model binding (Boolean & Array)', () => {
        it('handles boolean modelValue correctly (checked/unchecked)', async () => {
            const wrapper = mount(AppCheckbox, {
                props: { modelValue: true },
            });

            const input = wrapper.find('input').element as HTMLInputElement;
            expect(input.checked).toBe(true);
            expect(wrapper.findComponent(Check).exists()).toBe(true);
        });

        it('emits updated boolean value on change', async () => {
            const wrapper = mount(AppCheckbox, {
                props: { modelValue: false },
            });

            const input = wrapper.find('input');
            await input.setValue(true);

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        });

        it('handles array group binding correctly', async () => {
            const wrapper = mount(AppCheckbox, {
                props: {
                    modelValue: ['apple', 'banana'],
                    value: 'banana',
                },
            });

            const input = wrapper.find('input').element as HTMLInputElement;
            expect(input.checked).toBe(true);
        });

        it('adds value to array when checked in array mode', async () => {
            const wrapper = mount(AppCheckbox, {
                props: {
                    modelValue: ['apple'],
                    value: 'banana',
                },
            });

            const input = wrapper.find('input');
            await input.setValue(true);

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']]);
        });

        it('removes value from array when unchecked in array mode', async () => {
            const wrapper = mount(AppCheckbox, {
                props: {
                    modelValue: ['apple', 'banana'],
                    value: 'banana',
                },
            });

            const input = wrapper.find('input');
            await input.setValue(false);

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple']]);
        });
    });

    describe('States (Loading, Disabled, Readonly)', () => {
        it('disables input and shows loader when isLoading is true', () => {
            const wrapper = mount(AppCheckbox, {
                props: { isLoading: true },
            });

            const input = wrapper.find('input');
            expect(input.attributes('disabled')).toBeDefined();
            expect(wrapper.findComponent(Loader2).exists()).toBe(true);
        });

        it('disables input when disabled prop is true', () => {
            const wrapper = mount(AppCheckbox, {
                props: { disabled: true },
            });

            expect(wrapper.find('input').attributes('disabled')).toBeDefined();
            expect(wrapper.find('label').classes()).toContain('cursor-not-allowed');
        });

        it('prevents change emission when readonly or disabled', async () => {
            const wrapper = mount(AppCheckbox, {
                props: { readonly: true, modelValue: false },
            });

            const input = wrapper.find('input');
            await input.setValue(true);

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        });
    });

    describe('Errors & Accessibility', () => {
        it('displays error message and sets aria-invalid when errorMessage is present', () => {
            const wrapper = mount(AppCheckbox, {
                props: { errorMessage: 'This field is required' },
            });

            expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
            expect(wrapper.findComponent({ name: 'AppErrorMessage' }).props('errorMessage')).toBe(
                'This field is required',
            );
        });
    });
});
