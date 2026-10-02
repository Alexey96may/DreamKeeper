import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppRating from '@/components/ui/AppRating.vue';

describe('AppRating.vue', () => {
    describe('Rendering & Props', () => {
        it('renders label and value/max correctly', () => {
            const wrapper = mount(AppRating, {
                props: {
                    label: 'Уровень страха',
                    value: 7,
                    max: 10,
                },
            });

            expect(wrapper.find('span.block').text()).toContain('Уровень страха');
            const button = wrapper.find('button');
            expect(button.text()).toContain('7/10');
        });

        it('renders correctly without label prop', () => {
            const wrapper = mount(AppRating, {
                props: {
                    value: 4,
                },
            });

            expect(wrapper.find('span.block').exists()).toBe(false);
            expect(wrapper.find('button').text()).toContain('4/10');
        });

        it('applies correct aria-label with label and value details', () => {
            const wrapper = mount(AppRating, {
                props: {
                    label: 'Клируемость сна',
                    value: 85,
                    max: 100,
                },
            });

            const button = wrapper.find('button');
            expect(button.attributes('aria-label')).toBe(
                'Фильтровать по критерию «Клируемость сна» со значением 85 из 100',
            );
        });
    });

    describe('State Classes (isFiltering / isInFilter / small)', () => {
        it('applies isFiltering classes when isFiltering is true', () => {
            const wrapper = mount(AppRating, {
                props: {
                    value: 5,
                    isFiltering: true,
                },
            });

            const button = wrapper.find('button');
            expect(button.classes()).toContain('border-accent');
            expect(button.classes()).toContain('bg-accent/20');
        });

        it('applies isInFilter classes and pulse animation when isInFilter is true', () => {
            const wrapper = mount(AppRating, {
                props: {
                    value: 3,
                    isInFilter: true,
                },
            });

            const button = wrapper.find('button');
            expect(button.classes()).toContain('animate-pulse');
        });

        it('applies small size class when small prop is true', () => {
            const wrapper = mount(AppRating, {
                props: {
                    value: 2,
                    small: true,
                },
            });

            const button = wrapper.find('button');
            expect(button.classes()).toContain('text-xs!');
        });
    });

    describe('Interactivity & Events', () => {
        it('emits filter event when clicked', async () => {
            const wrapper = mount(AppRating, {
                props: {
                    value: 6,
                },
            });

            const button = wrapper.find('button');
            await button.trigger('click');

            expect(wrapper.emitted('filter')).toBeTruthy();
            expect(wrapper.emitted('filter')?.length).toBe(1);
        });
    });
});
