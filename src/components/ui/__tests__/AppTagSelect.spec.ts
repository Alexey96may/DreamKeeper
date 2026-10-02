import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppTagSelect from '@/components/ui/AppTagSelect.vue';

describe('AppTagSelect.vue', () => {
    const defaultOptions = [
        { value: 'lucid', label: 'Осознанные сны' },
        { value: 'nightmare', label: 'Кошмары' },
        { value: 'flying', label: 'Полет' },
    ];

    describe('Rendering & Props', () => {
        it('renders label, required indicator, and all options as chips', () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                    label: 'Категории снов',
                    required: true,
                    multiple: true,
                },
            });

            expect(wrapper.find('label').text()).toContain('Категории снов');
            expect(wrapper.find('label .text-status-error').exists()).toBe(true);

            const chips = wrapper.findAllComponents({ name: 'AppTag' });
            expect(chips.length).toBe(3);
            expect(chips[0].text()).toContain('Осознанные сны');
            expect(chips[1].text()).toContain('Кошмары');
            expect(chips[2].text()).toContain('Полет');
        });

        it('renders error message when errorMessage prop is provided', () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                    errorMessage: 'Выберите хотя бы одну категорию',
                },
            });

            expect(wrapper.text()).toContain('Выберите хотя бы одну категорию');
        });
    });

    describe('Multiple Selection Mode', () => {
        it('correctly marks selected chips as pressed', () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: ['lucid', 'flying'],
                    options: defaultOptions,
                    multiple: true,
                },
            });

            const chips = wrapper.findAllComponents({ name: 'AppTag' });
            expect(chips[0].props('isPressed')).toBe(true);
            expect(chips[1].props('isPressed')).toBe(false);
            expect(chips[2].props('isPressed')).toBe(true);
        });

        it('adds item to array when unselected chip is clicked, emits update:modelValue, change, and clear-error', async () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: ['lucid'],
                    options: defaultOptions,
                    multiple: true,
                },
            });

            const chips = wrapper.findAllComponents({ name: 'AppTag' });
            await chips[1].trigger('click');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['lucid', 'nightmare']]);

            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')?.[0]).toEqual([['lucid', 'nightmare']]);

            expect(wrapper.emitted('clear-error')).toBeTruthy();
        });

        it('removes item from array when already selected chip is clicked', async () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: ['lucid', 'nightmare'],
                    options: defaultOptions,
                    multiple: true,
                },
            });

            const chips = wrapper.findAllComponents({ name: 'AppTag' });
            await chips[0].trigger('click');

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['nightmare']]);
        });
    });

    describe('Single Selection Mode', () => {
        it('uses radiogroup role and radio attributes for chips', () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: 'nightmare',
                    options: defaultOptions,
                    multiple: false,
                },
            });

            const group = wrapper.find('[role="radiogroup"]');
            expect(group.exists()).toBe(true);

            const chips = wrapper.findAllComponents({ name: 'AppTag' });
            expect(chips[0].props('role')).toBe('radio');
            expect(chips[0].props('ariaChecked')).toBe(false);
            expect(chips[1].props('ariaChecked')).toBe(true);
        });

        it('selects new value or deselects (sets to null) on click', async () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: 'lucid',
                    options: defaultOptions,
                    multiple: false,
                },
            });

            const chips = wrapper.findAllComponents({ name: 'AppTag' });

            // Кликаем по уже выбранному ('lucid') -> должен сброситься в null
            await chips[0].trigger('click');
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);

            await chips[2].trigger('click');
            expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['flying']);
        });
    });

    describe('Disabled & Loading States', () => {
        it('disables all chips when isDisabled or isLoading is true', () => {
            const wrapper = mount(AppTagSelect, {
                props: {
                    modelValue: [],
                    options: defaultOptions,
                    isDisabled: true,
                },
            });

            const chips = wrapper.findAllComponents({ name: 'AppTag' });
            chips.forEach((chip) => {
                expect(chip.props('disabled')).toBe(true);
            });
        });
    });
});
