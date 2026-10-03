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
    });
});
