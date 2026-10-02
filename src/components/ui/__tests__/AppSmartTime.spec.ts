import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AppSmartTime from '@/components/ui/AppSmartTime.vue';

vi.mock('@/utils/formatters', () => ({
    formatDateTime: vi.fn((date, format) => `Exact: ${date} (${format})`),
    formatRelativeTime: vi.fn((date) => `Relative: ${date}`),
}));

describe('AppSmartTime.vue', () => {
    const testDate = '2026-10-15T14:30:00Z';

    describe('Rendering & Guards', () => {
        it('does not render time element if date is null or undefined', () => {
            const wrapper = mount(AppSmartTime, {
                props: {
                    date: null,
                },
            });

            expect(wrapper.find('time').exists()).toBe(false);
        });

        it('renders relative time by default when isExactDate is false', () => {
            const wrapper = mount(AppSmartTime, {
                props: {
                    date: testDate,
                    isExactDate: false,
                },
            });

            const timeEl = wrapper.find('time');
            expect(timeEl.exists()).toBe(true);
            expect(timeEl.text()).toBe(`Relative: ${testDate}`);
            expect(timeEl.attributes('datetime')).toBe(testDate);
            expect(timeEl.attributes('title')).toBe('Нажмите, чтобы увидеть точную дату');
        });

        it('renders exact date initially when isExactDate prop is true', () => {
            const wrapper = mount(AppSmartTime, {
                props: {
                    date: testDate,
                    isExactDate: true,
                },
            });

            const timeEl = wrapper.find('time');
            expect(timeEl.text()).toContain('Exact:');
            expect(timeEl.attributes('title')).toBe('Нажмите, чтобы увидеть время назад');
        });
    });

    describe('Interactivity & Toggling', () => {
        it('toggles between relative and exact time on click and updates title accordingly', async () => {
            const wrapper = mount(AppSmartTime, {
                props: {
                    date: testDate,
                },
            });

            let timeEl = wrapper.find('time');
            expect(timeEl.text()).toContain('Relative:');
            expect(timeEl.attributes('title')).toBe('Нажмите, чтобы увидеть точную дату');

            await timeEl.trigger('click');

            timeEl = wrapper.find('time');
            expect(timeEl.text()).toContain('Exact:');
            expect(timeEl.attributes('title')).toBe('Нажмите, чтобы увидеть время назад');

            await timeEl.trigger('click');

            timeEl = wrapper.find('time');
            expect(timeEl.text()).toContain('Relative:');
            expect(timeEl.attributes('title')).toBe('Нажмите, чтобы увидеть точную дату');
        });
    });
});
