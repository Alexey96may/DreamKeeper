import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppRange from '@/components/ui/AppRange.vue';

describe('AppRange.vue', () => {
    describe('Rendering & Props', () => {
        it('renders label, min/max values and default badge correctly', () => {
            const wrapper = mount(AppRange, {
                props: {
                    modelValue: 4,
                    label: 'Fear Level',
                    min: 1,
                    max: 10,
                },
            });

            expect(wrapper.find('label').text()).toContain('Fear Level');
            expect(wrapper.text()).toContain('4/10');

            const input = wrapper.find('input[type="range"]');
            expect((input.element as HTMLInputElement).value).toBe('4');
            expect(input.attributes('aria-valuenow')).toBe('4');
            expect(input.attributes('aria-valuemin')).toBe('1');
            expect(input.attributes('aria-valuemax')).toBe('10');
        });

        it('renders custom value formatter correctly', () => {
            const wrapper = mount(AppRange, {
                props: {
                    modelValue: 50,
                    label: 'Dream Clarity',
                    min: 0,
                    max: 100,
                    valueFormatter: (val, max) => `${val}% of ${max}%`,
                },
            });

            expect(wrapper.text()).toContain('50% of 100%');
        });

        it('disables input and shows loading spinner when isLoading is true', () => {
            const wrapper = mount(AppRange, {
                props: {
                    modelValue: 3,
                    isLoading: true,
                },
            });

            const input = wrapper.find('input[type="range"]');
            expect(input.attributes('disabled')).toBeDefined();
            expect(wrapper.find('.animate-spin').exists()).toBe(true);
        });
    });

    describe('Interactivity & Events', () => {
        it('emits update:modelValue and input events on slider change', async () => {
            const wrapper = mount(AppRange, {
                props: {
                    modelValue: 2,
                    min: 1,
                    max: 10,
                },
            });

            const input = wrapper.find('input[type="range"]');

            Object.defineProperty(input.element, 'valueAsNumber', { value: 7, writable: true });
            await input.trigger('input');

            expect(wrapper.emitted('input')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7]);
        });

        it('emits blur and focus events correctly', async () => {
            const wrapper = mount(AppRange, {
                props: {
                    modelValue: 5,
                },
            });

            const input = wrapper.find('input[type="range"]');

            await input.trigger('focus');
            expect(wrapper.emitted('focus')).toBeTruthy();

            await input.trigger('blur');
            expect(wrapper.emitted('blur')).toBeTruthy();
        });
    });

    describe('Accessibility & Error States', () => {
        it('sets aria-invalid and error border classes when errorMessage is provided', () => {
            const wrapper = mount(AppRange, {
                props: {
                    modelValue: 1,
                    errorMessage: 'Value is required',
                },
            });

            const input = wrapper.find('input[type="range"]');
            expect(input.attributes('aria-invalid')).toBe('true');
            expect(wrapper.text()).toContain('Value is required');
        });
    });
});
