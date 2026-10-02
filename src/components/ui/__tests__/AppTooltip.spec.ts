import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AppTooltip from '@/components/ui/AppTooltip.vue';

describe('AppTooltip.vue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Rendering & Props', () => {
        it('renders trigger button with HelpCircle icon and aria attributes', () => {
            const wrapper = mount(AppTooltip, {
                props: {
                    content: 'Helpful information here',
                },
            });

            const button = wrapper.find('button');
            expect(button.exists()).toBe(true);
            expect(button.attributes('aria-expanded')).toBe('false');
            expect(button.attributes('aria-label')).toBe('Показать подсказку');
            expect(wrapper.find('svg').exists()).toBe(true);
        });

        it('applies is-required class and aria-required when required prop is true', () => {
            const wrapper = mount(AppTooltip, {
                props: {
                    content: 'Required field info',
                    required: true,
                },
            });

            const button = wrapper.find('button');
            expect(button.classes()).toContain('is-required');
            expect(button.attributes('aria-required')).toBe('true');
        });
    });

    describe('Interactivity & Teleport Popover', () => {
        it('toggles tooltip visibility and displays content inside Teleport on click', async () => {
            const wrapper = mount(AppTooltip, {
                props: {
                    content: 'Popover description text',
                },
                attachTo: document.body,
            });

            const button = wrapper.find('button');

            expect(document.querySelector('.app-tooltip-popover')).toBeNull();

            await button.trigger('click');
            await wrapper.vm.$nextTick();

            const popover = document.querySelector('.app-tooltip-popover');
            expect(popover).not.toBeNull();
            expect(popover?.textContent).toContain('Popover description text');
            expect(button.attributes('aria-expanded')).toBe('true');

            await button.trigger('click');
            await wrapper.vm.$nextTick();

            expect(document.querySelector('.app-tooltip-popover')).toBeNull();
            expect(button.attributes('aria-expanded')).toBe('false');

            wrapper.unmount();
        });

        it('closes tooltip when Escape key is pressed', async () => {
            const wrapper = mount(AppTooltip, {
                props: {
                    content: 'Escape test',
                },
                attachTo: document.body,
            });

            const button = wrapper.find('button');
            await button.trigger('click');
            await wrapper.vm.$nextTick();

            expect(document.querySelector('.app-tooltip-popover')).not.toBeNull();

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            await wrapper.vm.$nextTick();

            expect(document.querySelector('.app-tooltip-popover')).toBeNull();

            wrapper.unmount();
        });

        it('closes tooltip when clicking outside', async () => {
            const wrapper = mount(AppTooltip, {
                props: {
                    content: 'Outside click test',
                },
                attachTo: document.body,
            });

            const button = wrapper.find('button');
            await button.trigger('click');
            await wrapper.vm.$nextTick();

            expect(document.querySelector('.app-tooltip-popover')).not.toBeNull();

            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            await wrapper.vm.$nextTick();

            expect(document.querySelector('.app-tooltip-popover')).toBeNull();

            wrapper.unmount();
        });
    });
});
