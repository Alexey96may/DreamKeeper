import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import Header from '@/components/sections/TheHeader.vue';
import { useUIStore } from '@/stores/modules/ui';

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        RouterLink: {
            name: 'RouterLink',
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
        },
    };
});

describe('Header.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('renders logo, brand name and desktop navigation links', () => {
        const wrapper = mount(Header, {
            global: {
                stubs: {
                    ThemeSelector: true,
                    Moon: true,
                },
            },
        });

        expect(wrapper.text()).toContain('DreamKeeper');

        const navLinks = wrapper.findAll('nav a');
        expect(navLinks.length).toBeGreaterThanOrEqual(3);
        expect(wrapper.text()).toContain('Главная');
        expect(wrapper.text()).toContain('Поиск');
        expect(wrapper.text()).toContain('О проекте');
    });

    it('toggles sidebar state when burger button is clicked', async () => {
        const uiStore = useUIStore();
        uiStore.sidebarOpen = false;

        const wrapper = mount(Header, {
            global: {
                stubs: {
                    ThemeSelector: true,
                    Moon: true,
                },
            },
        });

        const burgerButton = wrapper.find('button[aria-label="Переключить меню"]');
        expect(burgerButton.exists()).toBe(true);

        await burgerButton.trigger('click');

        expect(uiStore.sidebarOpen).toBe(true);
    });

    it('renders mobile menu dropdown when uiStore.sidebarOpen is true and closes it on link click', async () => {
        const uiStore = useUIStore();
        uiStore.sidebarOpen = true;

        const wrapper = mount(Header, {
            global: {
                stubs: {
                    ThemeSelector: true,
                    Moon: true,
                },
            },
        });

        const mobileNavContainer = wrapper.find('.absolute.top-full');
        expect(mobileNavContainer.exists()).toBe(true);

        const mobileLink = mobileNavContainer.find('a');
        await mobileLink.trigger('click');

        expect(uiStore.sidebarOpen).toBe(false);
    });
});
