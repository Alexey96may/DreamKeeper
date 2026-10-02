import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppTag from '@/components/ui/AppTag.vue';
import { h } from 'vue';

describe('AppTag.vue', () => {
    describe('Rendering & Props', () => {
        it('renders slot content and default attributes correctly', () => {
            const wrapper = mount(AppTag, {
                slots: {
                    default: 'Lucid Dream',
                },
            });

            const button = wrapper.find('button');
            expect(button.exists()).toBe(true);
            expect(button.text()).toContain('Lucid Dream');
            expect(button.attributes('type')).toBe('button');
            expect(button.attributes('aria-pressed')).toBe('false');
        });

        it('renders icon component when provided and not loading', () => {
            const MockIcon = h('svg', { class: 'mock-icon' });
            const wrapper = mount(AppTag, {
                props: {
                    icon: MockIcon,
                },
                slots: {
                    default: 'Night',
                },
            });

            expect(wrapper.find('svg.mock-icon').exists()).toBe(true);
            expect(wrapper.find('.animate-spin').exists()).toBe(false);
        });

        it('renders loading spinner and disables button when isLoading is true', () => {
            const wrapper = mount(AppTag, {
                props: {
                    isLoading: true,
                },
                slots: {
                    default: 'Loading Tag',
                },
            });

            const button = wrapper.find('button');
            expect(button.attributes('disabled')).toBeDefined();
            expect(wrapper.find('.animate-spin').exists()).toBe(true);
        });
    });

    describe('State Classes (isPressed / isInFilter)', () => {
        it('applies isPressed classes and aria-pressed=true when isPressed is true', () => {
            const wrapper = mount(AppTag, {
                props: {
                    isPressed: true,
                },
                slots: {
                    default: 'Active Tag',
                },
            });

            const button = wrapper.find('button');
            expect(button.attributes('aria-pressed')).toBe('true');
            expect(button.classes()).toContain('border-accent');
            expect(button.classes()).toContain('bg-accent/20');
        });

        it('applies isInFilter classes and pulse animation when isInFilter is true', () => {
            const wrapper = mount(AppTag, {
                props: {
                    isInFilter: true,
                },
                slots: {
                    default: 'Filter Tag',
                },
            });

            const button = wrapper.find('button');
            expect(button.classes()).toContain('animate-pulse');
            expect(button.classes()).toContain('border-accent/60');
        });
    });

    describe('Interactivity & Events', () => {
        it('emits click event when clicked and not disabled', async () => {
            const wrapper = mount(AppTag, {
                slots: {
                    default: 'Clickable',
                },
            });

            await wrapper.find('button').trigger('click');
            expect(wrapper.emitted('click')).toBeTruthy();
            expect(wrapper.emitted('click')?.length).toBe(1);
        });

        it('does not emit click event when disabled or loading', async () => {
            const wrapper = mount(AppTag, {
                props: {
                    disabled: true,
                },
                slots: {
                    default: 'Disabled',
                },
            });

            await wrapper.find('button').trigger('click');
            expect(wrapper.emitted('click')).toBeUndefined();
        });
    });
});
