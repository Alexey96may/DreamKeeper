import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppSelect from '@/components/ui/AppSelect.vue';

describe('AppSelect.vue', () => {
    const defaultOptions = [
        { value: 'morning', label: 'Утро' },
        { value: 'day', label: 'День' },
        { value: 'night', label: 'Ночь' },
    ];

    describe('Rendering & Props', () => {
        it('renders label, placeholder, and currently selected option correctly', () => {
            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: 'day',
                    options: defaultOptions,
                    label: 'Время суток',
                    placeholder: 'Выберите значение',
                },
            });

            expect(wrapper.find('label').text()).toContain('Время суток');
            const combobox = wrapper.find('button[role="combobox"]');
            expect(combobox.text()).toContain('День');
        });

        it('displays placeholder when modelValue is undefined', () => {
            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: undefined,
                    options: defaultOptions,
                    placeholder: 'Выберите время суток',
                },
            });

            const combobox = wrapper.find('button[role="combobox"]');
            expect(combobox.text()).toContain('Выберите время суток');
        });
    });

    describe('Interactivity & Selection', () => {
        it('opens and closes listbox on combobox click', async () => {
            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: undefined,
                    options: defaultOptions,
                },
            });

            const combobox = wrapper.find('button[role="combobox"]');

            await combobox.trigger('click');
            expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
            expect(combobox.attributes('aria-expanded')).toBe('true');

            await combobox.trigger('click');
            expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
            expect(combobox.attributes('aria-expanded')).toBe('false');
        });

        it('emits update:modelValue, change, and clear-error when selecting an option', async () => {
            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: 'morning',
                    options: defaultOptions,
                },
            });

            await wrapper.find('button[role="combobox"]').trigger('click');

            const options = wrapper.findAll('[role="option"]');
            await options[1].trigger('click');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['day']);

            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')?.[0]).toEqual(['day']);

            expect(wrapper.emitted('clear-error')).toBeTruthy();
            expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
        });

        it('does not select disabled option', async () => {
            const optionsWithDisabled = [
                { value: 'morning', label: 'Утро' },
                { value: 'night', label: 'Ночь', isDisabled: true },
            ];

            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: 'morning',
                    options: optionsWithDisabled,
                },
            });

            await wrapper.find('button[role="combobox"]').trigger('click');

            const disabledOption = wrapper.findAll('[role="option"]')[1];
            await disabledOption.trigger('click');

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
            expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
        });
    });

    describe('Keyboard Navigation', () => {
        it('opens listbox on ArrowDown key and selects highlighted option with Enter', async () => {
            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: 'morning',
                    options: defaultOptions,
                },
            });

            const combobox = wrapper.find('button[role="combobox"]');

            await combobox.trigger('keydown', { key: 'ArrowDown' });
            expect(wrapper.find('[role="listbox"]').exists()).toBe(true);

            await combobox.trigger('keydown', { key: 'ArrowDown' });

            await combobox.trigger('keydown', { key: 'Enter' });

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['day']);
        });

        it('closes listbox on Escape key', async () => {
            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: undefined,
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
        it('does not open listbox when isDisabled prop is true', async () => {
            const wrapper = mount(AppSelect, {
                props: {
                    modelValue: undefined,
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
