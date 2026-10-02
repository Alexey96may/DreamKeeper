import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';

describe('AppErrorMessage.vue', () => {
    describe('Conditional Rendering', () => {
        it('renders nothing when errorMessage is empty and slot is not used', () => {
            const wrapper = mount(AppErrorMessage, {
                props: { errorMessage: '' },
            });

            expect(wrapper.find('p').exists()).toBe(false);
        });

        it('renders paragraph with error text when errorMessage is provided', () => {
            const wrapper = mount(AppErrorMessage, {
                props: { errorMessage: 'Поле обязательно для заполнения' },
            });

            const p = wrapper.find('p');
            expect(p.exists()).toBe(true);
            expect(p.text()).toBe('Поле обязательно для заполнения');
        });

        it('renders custom slot content when provided', () => {
            const wrapper = mount(AppErrorMessage, {
                slots: {
                    default: 'Кастомная ошибка из слота',
                },
            });

            expect(wrapper.find('p').text()).toBe('Кастомная ошибка из слота');
        });
    });

    describe('Accessibility & Attributes', () => {
        it('applies correct errorId when provided', () => {
            const wrapper = mount(AppErrorMessage, {
                props: {
                    errorMessage: 'Ошибка',
                    errorId: 'custom-error-id',
                },
            });

            expect(wrapper.find('p').attributes('id')).toBe('custom-error-id');
        });

        it('defaults to aria-live="polite" and role="status"', () => {
            const wrapper = mount(AppErrorMessage, {
                props: { errorMessage: 'Ошибка' },
            });

            const p = wrapper.find('p');
            expect(p.attributes('aria-live')).toBe('polite');
            expect(p.attributes('role')).toBe('status');
            expect(p.attributes('aria-atomic')).toBe('true');
        });

        it('switches to aria-live="assertive" and role="alert" when ariaLive is assertive', () => {
            const wrapper = mount(AppErrorMessage, {
                props: {
                    errorMessage: 'Критическая ошибка',
                    ariaLive: 'assertive',
                },
            });

            const p = wrapper.find('p');
            expect(p.attributes('aria-live')).toBe('assertive');
            expect(p.attributes('role')).toBe('alert');
        });
    });

    describe('Sizes', () => {
        it('applies default size class (text-xs)', () => {
            const wrapper = mount(AppErrorMessage, {
                props: { errorMessage: 'Ошибка' },
            });

            expect(wrapper.find('p').classes()).toContain('text-xs');
        });

        it('applies sm size class when size="sm"', () => {
            const wrapper = mount(AppErrorMessage, {
                props: { errorMessage: 'Ошибка', size: 'sm' },
            });

            expect(wrapper.find('p').classes()).toContain('text-sm');
        });

        it('applies md size class when size="md"', () => {
            const wrapper = mount(AppErrorMessage, {
                props: { errorMessage: 'Ошибка', size: 'md' },
            });

            expect(wrapper.find('p').classes()).toContain('text-base');
        });
    });
});
