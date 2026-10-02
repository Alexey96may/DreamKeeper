import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppMultiSelect from '@/components/ui/AppMultiSelect.vue';

describe('AppMultiSelect.vue', () => {
    const defaultOptions = [
        { value: 'tech', label: 'Технологии' },
        { value: 'science', label: 'Наука' },
        { value: 'art', label: 'Искусство' },
    ];

    describe('Rendering & Props', () => {
        it('renders label and placeholder correctly', () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                    label: 'Категории',
                    placeholder: 'Выберите категории',
                },
            });

            expect(wrapper.find('label').text()).toContain('Категории');
            expect(wrapper.find('button[role="combobox"]').text()).toContain('Выберите категории');
        });

        it('normalizes string/number options array correctly', () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: ['vue'],
                    options: ['vue', 'react'],
                },
            });

            const button = wrapper.find('button[role="combobox"]');
            expect(button.text()).toContain('vue');
        });

        it('displays selected options labels comma-separated', () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: ['tech', 'art'],
                    options: defaultOptions,
                },
            });

            const button = wrapper.find('button[role="combobox"]');
            expect(button.text()).toContain('Технологии, Искусство');
        });
    });

    describe('Interactivity & Selection', () => {
        it('opens and closes listbox on trigger click', async () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                },
            });

            const combobox = wrapper.find('button[role="combobox"]');

            // Open
            await combobox.trigger('click');
            expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
            expect(combobox.attributes('aria-expanded')).toBe('true');

            // Close
            await combobox.trigger('click');
            expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
            expect(combobox.attributes('aria-expanded')).toBe('false');
        });

        it('emits update:modelValue, change and clear-error when selecting an option', async () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: ['tech'],
                    options: defaultOptions,
                },
            });

            await wrapper.find('button[role="combobox"]').trigger('click');

            const options = wrapper.findAll('[role="option"]');
            await options[1].trigger('click');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['tech', 'science']]);

            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')?.[0]).toEqual([['tech', 'science']]);

            expect(wrapper.emitted('clear-error')).toBeTruthy();
        });

        it('removes option from selection if it is already selected', async () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: ['tech', 'science'],
                    options: defaultOptions,
                },
            });

            await wrapper.find('button[role="combobox"]').trigger('click');

            const options = wrapper.findAll('[role="option"]');
            await options[0].trigger('click');

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['science']]);
        });
    });

    describe('Keyboard Navigation', () => {
        it('opens listbox on ArrowDown key', async () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                },
            });

            const combobox = wrapper.find('button[role="combobox"]');
            await combobox.trigger('keydown', { key: 'ArrowDown' });

            expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
        });

        it('navigates through options with ArrowDown/ArrowUp and selects with Enter', async () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                },
            });

            const combobox = wrapper.find('button[role="combobox"]');
            await combobox.trigger('keydown', { key: 'Enter' });

            await combobox.trigger('keydown', { key: 'ArrowDown' });

            await combobox.trigger('keydown', { key: 'Enter' });

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['science']]);
        });

        it('closes listbox on Escape', async () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                },
            });

            const combobox = wrapper.find('button[role="combobox"]');
            await combobox.trigger('click'); // Открыли
            expect(wrapper.find('[role="listbox"]').exists()).toBe(true);

            await combobox.trigger('keydown', { key: 'Escape' });
            expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
        });
    });

    describe('Disabled state', () => {
        it('does not open listbox when disabled', async () => {
            const wrapper = mount(AppMultiSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                    isDisabled: true,
                },
            });

            await wrapper.find('button[role="combobox"]').trigger('click');
            expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
            expect(wrapper.find('button[role="combobox"]').attributes('disabled')).toBeDefined();
        });
    });
});
