import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';
import { Loader2 } from 'lucide-vue-next';

const MockIcon = h('svg', { 'data-testid': 'mock-icon' });

describe('AppButton.vue', () => {
    describe('Rendering & Tags', () => {
        it('renders as a <button> by default with correct type', () => {
            const wrapper = mount(AppButton, {
                slots: { default: 'Click me' },
            });

            expect(wrapper.element.tagName).toBe('BUTTON');
            expect(wrapper.attributes('type')).toBe('button');
            expect(wrapper.text()).toContain('Click me');
        });

        it('renders as a RouterLink when "to" prop is passed', () => {
            const wrapper = mount(AppButton, {
                props: { to: '/dashboard' },
                global: {
                    stubs: {
                        RouterLink: {
                            template: '<a class="router-link"><slot /></a>',
                        },
                    },
                },
                slots: { default: 'Link' },
            });

            expect(wrapper.find('.router-link').exists()).toBe(true);
        });

        it('renders as an <a> tag when "href" prop is passed', () => {
            const wrapper = mount(AppButton, {
                props: { href: 'https://example.com', target: '_blank', rel: 'nofollow' },
                slots: { default: 'External' },
            });

            expect(wrapper.element.tagName).toBe('A');
            expect(wrapper.attributes('href')).toBe('https://example.com');
            expect(wrapper.attributes('target')).toBe('_blank');
            expect(wrapper.attributes('rel')).toBe('nofollow');
        });

        it('applies default "noopener noreferrer" to external link if rel is omitted', () => {
            const wrapper = mount(AppButton, {
                props: { href: 'https://example.com' },
            });

            expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
        });
    });

    describe('Variants, Sizes & Modifiers', () => {
        it('applies variant classes correctly', () => {
            const wrapper = mount(AppButton, {
                props: { variant: 'danger' },
            });

            expect(wrapper.classes().join(' ')).toContain('bg-danger-bg');
        });

        it('applies size classes correctly', () => {
            const wrapper = mount(AppButton, {
                props: { size: 'lg' },
            });

            expect(wrapper.classes().join(' ')).toContain('px-4 py-2.5 text-base');
        });

        it('applies fullWidth class when fullWidth is true', () => {
            const wrapper = mount(AppButton, {
                props: { fullWidth: true },
            });

            expect(wrapper.classes()).toContain('w-full');
        });

        it('applies aria-label when provided', () => {
            const wrapper = mount(AppButton, {
                props: { ariaLabel: 'Close menu' },
            });

            expect(wrapper.attributes('aria-label')).toBe('Close menu');
        });
    });

    describe('Loading & Disabled States', () => {
        it('disables button and shows spinner when isLoading is true', () => {
            const wrapper = mount(AppButton, {
                props: { isLoading: true },
                slots: { default: 'Loading...' },
            });

            expect(wrapper.attributes('disabled')).toBeDefined();
            expect(wrapper.attributes('aria-busy')).toBe('true');
            expect(wrapper.attributes('aria-disabled')).toBe('true');
            expect(wrapper.findComponent(Loader2).exists()).toBe(true);
        });

        it('disables button when disabled prop is true', () => {
            const wrapper = mount(AppButton, {
                props: { disabled: true },
            });

            expect(wrapper.attributes('disabled')).toBeDefined();
            expect(wrapper.attributes('aria-disabled')).toBe('true');
        });

        it('prevents click event when disabled', async () => {
            const wrapper = mount(AppButton, {
                props: { disabled: true },
            });

            await wrapper.trigger('click');
            expect(wrapper.emitted('click')).toBeUndefined();
        });

        it('prevents click event when loading', async () => {
            const wrapper = mount(AppButton, {
                props: { isLoading: true },
            });

            await wrapper.trigger('click');
            expect(wrapper.emitted('click')).toBeUndefined();
        });

        it('emits click event when active', async () => {
            const wrapper = mount(AppButton);

            await wrapper.trigger('click');
            expect(wrapper.emitted('click')).toHaveLength(1);
        });
    });

    // 4. Иконки и слоты
    describe('Icons & Slots', () => {
        it('renders iconLeft prop when provided and not loading', () => {
            const wrapper = mount(AppButton, {
                props: { iconLeft: MockIcon },
            });

            expect(wrapper.find('[data-testid="mock-icon"]').exists()).toBe(true);
        });

        it('prioritizes loading spinner over iconLeft', () => {
            const wrapper = mount(AppButton, {
                props: { isLoading: true, iconLeft: MockIcon },
            });

            expect(wrapper.findComponent(Loader2).exists()).toBe(true);
            expect(wrapper.find('[data-testid="mock-icon"]').exists()).toBe(false);
        });

        it('renders iconRight prop when provided and not loading', () => {
            const wrapper = mount(AppButton, {
                props: { iconRight: MockIcon },
            });

            expect(wrapper.find('[data-testid="mock-icon"]').exists()).toBe(true);
        });

        it('renders named slots for icons if props are not provided', () => {
            const wrapper = mount(AppButton, {
                slots: {
                    'icon-left': '<span class="slot-icon-left">Left</span>',
                    'icon-right': '<span class="slot-icon-right">Right</span>',
                },
            });

            expect(wrapper.find('.slot-icon-left').exists()).toBe(true);
            expect(wrapper.find('.slot-icon-right').exists()).toBe(true);
        });
    });
});
