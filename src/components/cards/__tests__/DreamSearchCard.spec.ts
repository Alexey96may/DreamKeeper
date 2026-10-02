import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DreamSearchCard from '@/components/cards/DreamSearchCard.vue';
import type { Dream } from '@/types/Dream';

describe('DreamSearchCard.vue', () => {
    const mockDream: Partial<Dream> = {
        id: 1,
        slug: 'search-dream-slug',
        title: 'Тестовый сон',
        description: 'Описание тестового сна для поиска.',
        date: '2026-10-02',
    };

    it('renders dream title, description and formatted date correctly', () => {
        const wrapper = mount(DreamSearchCard, {
            props: {
                dream: mockDream as unknown as Dream,
                isSelected: false,
            },
            global: {
                stubs: {
                    AppSmartTime: {
                        name: 'AppSmartTime',
                        template: '<span class="mock-smart-time">{{ date }}</span>',
                        props: ['dateFormat'],
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('Тестовый сон');
        expect(wrapper.text()).toContain('Описание тестового сна для поиска.');
        expect(wrapper.findComponent({ name: 'AppSmartTime' }).exists()).toBe(true);
    });

    it('renders fallback description when dream description is missing', () => {
        const wrapper = mount(DreamSearchCard, {
            props: {
                dream: {
                    ...(mockDream as unknown as Dream),
                    description: '',
                },
            },
            global: {
                stubs: {
                    AppSmartTime: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Без описания');
    });

    it('applies selected styling class when isSelected is true', () => {
        const wrapper = mount(DreamSearchCard, {
            props: {
                dream: mockDream as unknown as Dream,
                isSelected: true,
            },
            global: {
                stubs: {
                    AppSmartTime: true,
                },
            },
        });

        const article = wrapper.find('article');
        expect(article.classes()).toContain('bg-ring/25');
    });

    it('does not apply selected styling class when isSelected is false', () => {
        const wrapper = mount(DreamSearchCard, {
            props: {
                dream: mockDream as unknown as Dream,
                isSelected: false,
            },
            global: {
                stubs: {
                    AppSmartTime: true,
                },
            },
        });

        const article = wrapper.find('article');
        expect(article.classes()).not.toContain('bg-ring/25');
    });

    it('emits select event with dream slug when clicked', async () => {
        const wrapper = mount(DreamSearchCard, {
            props: {
                dream: mockDream as unknown as Dream,
            },
            global: {
                stubs: {
                    AppSmartTime: true,
                },
            },
        });

        await wrapper.find('article').trigger('click');

        expect(wrapper.emitted('select')).toBeTruthy();
        expect(wrapper.emitted('select')?.[0]).toEqual(['search-dream-slug']);
    });

    it('emits select event when Enter or Space key is pressed', async () => {
        const wrapper = mount(DreamSearchCard, {
            props: {
                dream: mockDream as unknown as Dream,
            },
            global: {
                stubs: {
                    AppSmartTime: true,
                },
            },
        });

        const article = wrapper.find('article');

        await article.trigger('keydown.enter');
        expect(wrapper.emitted('select')?.[0]).toEqual(['search-dream-slug']);

        await article.trigger('keydown.space');
        expect(wrapper.emitted('select')?.[1]).toEqual(['search-dream-slug']);
    });

    it('computes correct aria-label based on dream data', () => {
        const wrapper = mount(DreamSearchCard, {
            props: {
                dream: mockDream as unknown as Dream,
            },
            global: {
                stubs: {
                    AppSmartTime: true,
                },
            },
        });

        const article = wrapper.find('article');
        const ariaLabel = article.attributes('aria-label');

        expect(ariaLabel).toContain('Сон: Тестовый сон');
        expect(ariaLabel).toContain('Дата:');
    });
});
