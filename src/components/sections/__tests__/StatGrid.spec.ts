import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StatsGrid from '@/components/sections/StatsGrid.vue';

describe('StatsGrid.vue', () => {
    it('renders default aria-label when not provided', () => {
        const wrapper = mount(StatsGrid);
        const section = wrapper.find('section');

        expect(section.attributes('aria-label')).toBe('Статистика снов и состояния');
    });

    it('renders items passed via props with correct stagger delay styles and StatCard props', () => {
        const items = [
            { id: 1, value: '42', label: 'Всего снов' },
            { id: 2, value: '12', label: 'Осознанных' },
        ];

        const wrapper = mount(StatsGrid, {
            props: {
                items,
                ariaLabel: 'Пользовательская статистика',
            },
            global: {
                stubs: {
                    StatCard: true,
                },
            },
        });

        const section = wrapper.find('section');
        expect(section.attributes('aria-label')).toBe('Пользовательская статистика');

        const listItems = wrapper.findAll('li');
        expect(listItems.length).toBe(2);

        expect(listItems[0].attributes('style')).toContain('--delay: 0s');
        expect(listItems[1].attributes('style')).toContain('--delay: 0.08s');

        const statCards = wrapper.findAllComponents({ name: 'StatCard' });
        expect(statCards.length).toBe(2);
        expect(statCards[0].props('value')).toBe('42');
        expect(statCards[0].props('label')).toBe('Всего снов');
        expect(statCards[1].props('value')).toBe('12');
        expect(statCards[1].props('label')).toBe('Осознанных');
    });

    it('renders default slot content when items array is empty', () => {
        const wrapper = mount(StatsGrid, {
            props: {
                items: [],
            },
            slots: {
                default: '<li class="custom-slot-item">Custom Slot Content</li>',
            },
        });

        expect(wrapper.text()).toContain('Custom Slot Content');
        expect(wrapper.find('.custom-slot-item').exists()).toBe(true);
    });
});
