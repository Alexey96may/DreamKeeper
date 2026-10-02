import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import DreamFilterApplyBar from '@/components/sections/DreamFilterApplyBar.vue';
import { useDreamFilterStore } from '@/stores/modules/dreamFilter';

const pushMock = vi.fn();
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

describe('DreamFilterApplyBar.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('Rendering States (Active vs Inactive filters)', () => {
        it('renders "Filter" button when filters are inactive', async () => {
            const filterStore = useDreamFilterStore();
            filterStore.filters.isActive = false;

            const wrapper = mount(DreamFilterApplyBar, {
                global: {
                    stubs: {
                        AppTooltip: true,
                    },
                },
            });

            const buttons = wrapper.findAllComponents({ name: 'AppButton' });
            expect(buttons.length).toBe(1);
            expect(buttons[0].text()).toContain('Фильтр');
        });
    });

    describe('Interactions & Actions', () => {
        it('calls toggleActive(true) when inactive filter button is clicked', async () => {
            const filterStore = useDreamFilterStore();
            filterStore.filters.isActive = false;

            const toggleSpy = vi.spyOn(filterStore, 'toggleActive');

            const wrapper = mount(DreamFilterApplyBar, {
                global: {
                    stubs: {
                        AppTooltip: true,
                    },
                },
            });

            const button = wrapper.findComponent({ name: 'AppButton' });
            await button.trigger('click');

            expect(toggleSpy).toHaveBeenCalledTimes(1);
            expect(toggleSpy).toHaveBeenCalledWith(true);
        });

        it('calls resetFilters when reset button is clicked', async () => {
            const filterStore = useDreamFilterStore();
            filterStore.filters.isActive = true;

            const resetSpy = vi.spyOn(filterStore, 'resetFilters');

            const wrapper = mount(DreamFilterApplyBar, {
                global: {
                    stubs: {
                        AppTooltip: true,
                    },
                },
            });

            const buttons = wrapper.findAllComponents({ name: 'AppButton' });
            const resetButton = buttons.find((btn) => btn.text().includes('Сбросить'));

            expect(resetButton?.exists()).toBe(true);
            await resetButton?.trigger('click');

            expect(resetSpy).toHaveBeenCalledTimes(1);
        });

        it('navigates to dream-search with correct query containing dreamSlug when apply button is clicked', async () => {
            const filterStore = useDreamFilterStore();
            filterStore.filters.isActive = true;

            const wrapper = mount(DreamFilterApplyBar, {
                props: {
                    dreamSlug: 'flying-above-clouds',
                },
                global: {
                    stubs: {
                        AppTooltip: true,
                    },
                },
            });

            const buttons = wrapper.findAllComponents({ name: 'AppButton' });
            const applyButton = buttons.find((btn) => btn.text().includes('Применить'));

            expect(applyButton?.exists()).toBe(true);
            await applyButton?.trigger('click');

            expect(pushMock).toHaveBeenCalledTimes(1);
            expect(pushMock).toHaveBeenCalledWith({
                name: 'dream-search',
                query: {
                    actualDream: 'flying-above-clouds',
                },
            });
        });
    });
});
