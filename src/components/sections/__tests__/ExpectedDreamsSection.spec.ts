import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import ExpectedDreamsSection from '@/components/sections/ExpectedDreamsSection.vue';
import { useSleepStore } from '@/stores/modules/dream';
import { Dream } from '@/types/Dream';

describe('ExpectedDreamsSection.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders skeleton loaders when store is loading and no sleeps exist', () => {
        const sleepStore = useSleepStore();
        sleepStore.loading = true;
        sleepStore.sleeps = [];

        const wrapper = mount(ExpectedDreamsSection, {
            global: {
                stubs: {
                    DreamExpectedByDateCardSkeleton: true,
                    Sparkles: true,
                },
            },
        });

        const skeletons = wrapper.findAllComponents({ name: 'DreamExpectedByDateCardSkeleton' });
        expect(skeletons.length).toBe(3);
    });

    it('renders empty state when there are no expected dreams', () => {
        const sleepStore = useSleepStore();
        sleepStore.loading = false;
        sleepStore.getDreamsExpectedByDate = () => [];

        const wrapper = mount(ExpectedDreamsSection, {
            global: {
                stubs: {
                    CalendarCheck: true,
                    Sparkles: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Нет ожидающих снов');
        expect(wrapper.text()).toContain('Все сны с указанными датами обработаны');
    });

    it('renders list of expected dreams and badge count when dreams are present', () => {
        const sleepStore = useSleepStore();
        sleepStore.loading = false;

        const mockDreams = [
            {
                id: '1',
                title: 'Dream 1',
                description: 'Desc 1',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            },
            {
                id: '2',
                title: 'Dream 2',
                description: 'Desc 2',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            },
        ];

        sleepStore.getDreamsExpectedByDate = () => mockDreams as unknown as Dream[];

        const wrapper = mount(ExpectedDreamsSection, {
            global: {
                stubs: {
                    DreamExpectedByDateCard: true,
                    Sparkles: true,
                },
            },
        });

        const badge = wrapper.find('span.bg-accent');
        expect(badge.exists()).toBe(true);
        expect(badge.text()).toBe('2');

        const dreamCards = wrapper.findAllComponents({ name: 'DreamExpectedByDateCard' });
        expect(dreamCards.length).toBe(2);
    });
});
