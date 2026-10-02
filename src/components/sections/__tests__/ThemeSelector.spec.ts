import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import ThemeSelector from '@/components/sections/ThemeSelector.vue';
import { useUIStore } from '@/stores/modules/ui';

vi.mock('@/constants/Theme', () => ({
    THEME_OPTIONS: [
        { value: 'light', label: 'Светлая', icon: 'SunIcon' },
        { value: 'dark', label: 'Темная', icon: 'MoonIcon' },
    ],
    THEME_OPTIONS_MAP: {
        light: { value: 'light', label: 'Светлая', icon: 'SunIcon' },
        dark: { value: 'dark', label: 'Темная', icon: 'MoonIcon' },
    },
}));

describe('ThemeSelector.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('renders quick switch theme button and dropdown trigger', () => {
        const wrapper = mount(ThemeSelector);

        const buttons = wrapper.findAll('button');
        expect(buttons.length).toBe(2);
        expect(buttons[0].attributes('aria-label')).toBe('Быстрое переключение темы');
        expect(buttons[1].attributes('aria-haspopup')).toBe('true');
        expect(buttons[1].attributes('aria-expanded')).toBe('false');
    });

    it('calls toggleTheme action on quick switch button click', async () => {
        const uiStore = useUIStore();
        const toggleThemeSpy = vi.spyOn(uiStore, 'toggleTheme');

        const wrapper = mount(ThemeSelector);
        const quickButton = wrapper.find('button[aria-label="Быстрое переключение темы"]');

        await quickButton.trigger('click');

        expect(toggleThemeSpy).toHaveBeenCalledTimes(1);
    });

    it('opens and closes theme options menu when dropdown button is clicked', async () => {
        const wrapper = mount(ThemeSelector);
        const dropdownButton = wrapper.find('button[aria-label="Открыть меню выбора темы"]');

        expect(wrapper.find('[role="menu"]').exists()).toBe(false);
        expect(dropdownButton.attributes('aria-expanded')).toBe('false');

        await dropdownButton.trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(true);
        expect(dropdownButton.attributes('aria-expanded')).toBe('true');

        const menuItems = wrapper.findAll('[role="menuitem"]');
        expect(menuItems.length).toBe(2);
    });

    it('sets theme and closes menu when a theme option is selected', async () => {
        const uiStore = useUIStore();
        const setThemeSpy = vi.spyOn(uiStore, 'setTheme');

        const wrapper = mount(ThemeSelector);
        const dropdownButton = wrapper.find('button[aria-label="Открыть меню выбора темы"]');

        // Открываем меню
        await dropdownButton.trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(true);

        const firstMenuItem = wrapper.find('[role="menuitem"]');
        await firstMenuItem.trigger('click');

        expect(setThemeSpy).toHaveBeenCalledTimes(1);
        expect(setThemeSpy).toHaveBeenCalledWith('light');

        expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    });

    it('closes theme menu when clicking outside component', async () => {
        const wrapper = mount(ThemeSelector, {
            attachTo: document.body,
        });

        const dropdownButton = wrapper.find('button[aria-label="Открыть меню выбора темы"]');
        await dropdownButton.trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(true);

        await document.body.click();

        expect(wrapper.find('[role="menu"]').exists()).toBe(false);

        wrapper.unmount();
    });
});
