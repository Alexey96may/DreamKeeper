import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppTitle from '@/components/sections/AppTitle.vue';
import AppButton from '@/components/ui/AppButton.vue';

describe('AppTitle.vue', () => {
    it('renders default title and subtitle when no props or slots are provided', () => {
        const wrapper = mount(AppTitle);

        const heading = wrapper.find('h1');
        const subtitle = wrapper.find('p');

        expect(heading.text()).toBe('DreamKeeper');
        expect(subtitle.text()).toBe('Хранитель твоих снов');
    });

    it('renders custom title and subtitle passed via props', () => {
        const wrapper = mount(AppTitle, {
            props: {
                title: '📊 Статистика снов',
                subtitle: 'Анализ за последний месяц',
            },
        });

        expect(wrapper.find('h1').text()).toBe('📊 Статистика снов');
        expect(wrapper.find('p').text()).toBe('Анализ за последний месяц');
    });

    it('renders title and subtitle from slots over props', () => {
        const wrapper = mount(AppTitle, {
            props: {
                title: 'Prop Title',
                subtitle: 'Prop Subtitle',
            },
            slots: {
                title: 'Slot Title',
                subtitle: 'Slot Subtitle',
            },
        });

        expect(wrapper.find('h1').text()).toBe('Slot Title');
        expect(wrapper.find('p').text()).toBe('Slot Subtitle');
    });

    it('renders action button with text and emits action event on click', async () => {
        const wrapper = mount(AppTitle, {
            props: {
                showButton: true,
                buttonText: '📥 Экспорт PDF',
                buttonVariant: 'secondary',
            },
        });

        const buttonComponent = wrapper.findComponent(AppButton);
        expect(buttonComponent.exists()).toBe(true);
        expect(buttonComponent.text()).toContain('📥 Экспорт PDF');

        await buttonComponent.trigger('click');

        expect(wrapper.emitted('action')).toBeTruthy();
        expect(wrapper.emitted('action')?.length).toBe(1);
    });

    it('does not render button when showButton is false', () => {
        const wrapper = mount(AppTitle, {
            props: {
                showButton: false,
            },
        });

        const buttonComponent = wrapper.findComponent(AppButton);
        expect(buttonComponent.exists()).toBe(false);
    });
});
