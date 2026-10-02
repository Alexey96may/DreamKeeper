import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DreamCard from '@/components/cards/DreamDailyCard.vue';

describe('DreamCard.vue', () => {
    const mockDream = {
        id: 1,
        slug: 'test-dream',
        title: 'Заголовок сна',
        description: 'Описание сна для проверки.',
        quality: 5,
        date: '2026-10-02',
    };

    it('renders dream details correctly when quality and title are present', () => {
        const wrapper = mount(DreamCard, {
            props: {
                dream: mockDream,
                isDeleting: false,
            },
            global: {
                stubs: {
                    AppRating: true,
                    AppButton: true,
                    Trash: true,
                    Edit2Icon: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Заголовок сна');
        expect(wrapper.text()).toContain('Описание сна для проверки.');
        expect(wrapper.findComponent({ name: 'AppRating' }).exists()).toBe(true);
    });

    it('renders fallback description when dream description is empty', () => {
        const wrapper = mount(DreamCard, {
            props: {
                dream: {
                    ...mockDream,
                    title: undefined,
                    description: '',
                    quality: undefined,
                },
                isDeleting: false,
            },
            global: {
                stubs: {
                    AppRating: true,
                    AppButton: true,
                    Trash: true,
                    Edit2Icon: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Без описания');
        expect(wrapper.findComponent({ name: 'AppRating' }).exists()).toBe(false);
    });

    it('emits click event when card is clicked and isDeleting is false', async () => {
        const wrapper = mount(DreamCard, {
            props: {
                dream: mockDream,
                isDeleting: false,
            },
            global: {
                stubs: {
                    AppRating: true,
                    AppButton: true,
                    Trash: true,
                    Edit2Icon: true,
                },
            },
        });

        await wrapper.find('div.cursor-pointer').trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
        expect(wrapper.emitted('click')?.length).toBe(1);
    });

    it('does not emit click event when isDeleting is true', async () => {
        const wrapper = mount(DreamCard, {
            props: {
                dream: mockDream,
                isDeleting: true,
            },
            global: {
                stubs: {
                    AppRating: true,
                    AppButton: true,
                    Trash: true,
                    Edit2Icon: true,
                },
            },
        });

        expect(wrapper.classes()).toContain('pointer-events-none');
        expect(wrapper.classes()).toContain('opacity-50');

        await wrapper.find('div').trigger('click');
        expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('emits delete event when delete button is clicked', async () => {
        const wrapper = mount(DreamCard, {
            props: {
                dream: mockDream,
                isDeleting: false,
            },
            global: {
                stubs: {
                    AppRating: true,
                    AppButton: {
                        name: 'AppButton',
                        // Передаем фейковый event с методом stopPropagation, чтобы @click.stop не падал
                        template: '<button @click="(e) => $emit(\'click\', e)"><slot /></button>',
                    },
                    Trash: true,
                    Edit2Icon: true,
                },
            },
        });

        const buttons = wrapper.findAllComponents({ name: 'AppButton' });
        const deleteButton = buttons[0];

        await deleteButton.trigger('click');
        expect(wrapper.emitted('delete')).toBeTruthy();
    });

    it('emits edit event when edit button is clicked', async () => {
        const wrapper = mount(DreamCard, {
            props: {
                dream: mockDream,
                isDeleting: false,
            },
            global: {
                stubs: {
                    AppRating: true,
                    AppButton: {
                        name: 'AppButton',
                        template: '<button @click="(e) => $emit(\'click\', e)"><slot /></button>',
                    },
                    Trash: true,
                    Edit2Icon: true,
                },
            },
        });

        const buttons = wrapper.findAllComponents({ name: 'AppButton' });
        const editButton = buttons[1];

        await editButton.trigger('click');
        expect(wrapper.emitted('edit')).toBeTruthy();
    });
});
