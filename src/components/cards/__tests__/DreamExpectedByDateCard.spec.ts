import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DreamExpectedByDateCard from '@/components/cards/DreamExpectedByDateCard.vue';
import type { Dream, DreamInterpretationRef, RelatedDreamRef } from '@/types/Dream';

describe('DreamExpectedByDateCard.vue', () => {
    const mockDream: Partial<Dream> = {
        id: 1,
        slug: 'test-prophetic-dream',
        title: 'Вещий сон',
        description: 'Описание вещего сна.',
        date: '2026-10-01',
        isDraft: true,
        isPinned: true,
        isFavorite: true,
        isPrivate: true,
        categoryDetails: {
            prophetic: {
                expectedByDate: '2026-12-31',
            },
        },
        characters: ['Герой', 'Мудрец'],
        locations: ['Башня'],
        emotions: ['Трепет'],
        interpretations: [{} as DreamInterpretationRef],
        relatedDreams: [{} as RelatedDreamRef, {} as RelatedDreamRef],
    };

    it('renders basic dream details and status icons correctly', () => {
        const wrapper = mount(DreamExpectedByDateCard, {
            props: {
                dream: mockDream as unknown as Dream,
            },
            global: {
                stubs: {
                    RouterLink: {
                        template: '<a><slot /></a>',
                    },
                    AppSmartTime: true,
                    Calendar: true,
                    FilePen: true,
                    Pin: true,
                    Star: true,
                    Lock: true,
                    Users: true,
                    MapPin: true,
                    Smile: true,
                    BookOpen: true,
                    Link2: true,
                    ChevronRight: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Вещий сон');
        expect(wrapper.text()).toContain('Описание вещего сна.');
    });

    it('renders expected by date badge when prophetic details are present', () => {
        const wrapper = mount(DreamExpectedByDateCard, {
            props: {
                dream: mockDream as unknown as Dream,
            },
            global: {
                stubs: {
                    RouterLink: true,
                    AppSmartTime: {
                        name: 'AppSmartTime',
                        template: '<span class="mock-smart-time">{{ date }}</span>',
                        props: ['date'],
                    },
                    Calendar: true,
                    FilePen: true,
                    Pin: true,
                    Star: true,
                    Lock: true,
                    Users: true,
                    MapPin: true,
                    Smile: true,
                    BookOpen: true,
                    Link2: true,
                    ChevronRight: true,
                },
            },
        });

        // Проверяем, что блок ожидаемой даты рендерится
        const smartTimes = wrapper.findAllComponents({ name: 'AppSmartTime' });
        expect(smartTimes.length).toBe(2); // Один для даты сна, второй для expectedByDate
    });

    it('does not render expected by date badge when prophetic details are missing', () => {
        const dreamWithoutProphetic: Partial<Dream> = {
            ...mockDream,
            categoryDetails: undefined,
        };

        const wrapper = mount(DreamExpectedByDateCard, {
            props: {
                dream: dreamWithoutProphetic as unknown as Dream,
            },
            global: {
                stubs: {
                    RouterLink: true,
                    AppSmartTime: true,
                    Calendar: true,
                    FilePen: true,
                    Pin: true,
                    Star: true,
                    Lock: true,
                    Users: true,
                    MapPin: true,
                    Smile: true,
                    BookOpen: true,
                    Link2: true,
                    ChevronRight: true,
                },
            },
        });

        const smartTimes = wrapper.findAllComponents({ name: 'AppSmartTime' });
        expect(smartTimes.length).toBe(1);
    });

    it('renders analytics block when characters, locations or emotions exist', () => {
        const wrapper = mount(DreamExpectedByDateCard, {
            props: {
                dream: mockDream as unknown as Dream,
            },
            global: {
                stubs: {
                    RouterLink: true,
                    AppSmartTime: true,
                    Calendar: true,
                    FilePen: true,
                    Pin: true,
                    Star: true,
                    Lock: true,
                    Users: true,
                    MapPin: true,
                    Smile: true,
                    BookOpen: true,
                    Link2: true,
                    ChevronRight: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Герой, Мудрец');
        expect(wrapper.text()).toContain('Башня');
        expect(wrapper.text()).toContain('Трепет');
    });

    it('hides analytics block when no analytics data is present', () => {
        const minimalDream: Partial<Dream> = {
            id: 2,
            slug: 'minimal-dream',
            date: '2026-10-01',
            characters: [],
            locations: [],
            emotions: [],
        };

        const wrapper = mount(DreamExpectedByDateCard, {
            props: {
                dream: minimalDream as unknown as Dream,
            },
            global: {
                stubs: {
                    RouterLink: true,
                    AppSmartTime: true,
                    Calendar: true,
                    FilePen: true,
                    Pin: true,
                    Star: true,
                    Lock: true,
                    Users: true,
                    MapPin: true,
                    Smile: true,
                    BookOpen: true,
                    Link2: true,
                    ChevronRight: true,
                },
            },
        });

        expect(wrapper.find('.border-t').exists()).toBe(false);
    });

    it('renders interpretations and related dreams counts in footer', () => {
        const wrapper = mount(DreamExpectedByDateCard, {
            props: {
                dream: mockDream as unknown as Dream,
            },
            global: {
                stubs: {
                    RouterLink: true,
                    AppSmartTime: true,
                    Calendar: true,
                    FilePen: true,
                    Pin: true,
                    Star: true,
                    Lock: true,
                    Users: true,
                    MapPin: true,
                    Smile: true,
                    BookOpen: true,
                    Link2: true,
                    ChevronRight: true,
                },
            },
        });

        expect(wrapper.text()).toContain('1'); // interpretations.length
        expect(wrapper.text()).toContain('2'); // relatedDreams.length
    });
});
