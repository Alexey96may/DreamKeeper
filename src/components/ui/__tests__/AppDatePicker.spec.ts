import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AppDatePicker from '@/components/ui/AppDatePicker.vue';
import { Calendar as CalendarIcon } from 'lucide-vue-next';

vi.mock('v-calendar-3', () => ({
    DatePicker: {
        name: 'VDatePicker',
        props: [
            'modelValue',
            'disabled',
            'masks',
            'popover',
            'timezone',
            'maxDate',
            'minDate',
            'locale',
        ],
        emits: ['update:modelValue'],
        template: `
            <div class="v-calendar-mock">
                <slot
                    :inputValue="modelValue ? String(modelValue) : ''"
                    :inputEvents="{
                        click: () => $emit('update:modelValue', new Date('2026-06-15T00:00:00.000Z'))
                    }"
                />
            </div>
        `,
    },
}));

describe('AppDatePicker.vue', () => {
    describe('Rendering & Props', () => {
        it('renders correctly with default props', () => {
            const wrapper = mount(AppDatePicker, {
                props: { label: 'Дата рождения' },
            });

            expect(wrapper.find('input').exists()).toBe(true);
            expect(wrapper.text()).toContain('Дата рождения');
            expect(wrapper.findComponent(CalendarIcon).exists()).toBe(true);
        });

        it('shows required asterisk and hint when provided', () => {
            const wrapper = mount(AppDatePicker, {
                props: {
                    label: 'Срок',
                    required: true,
                    hint: 'Выберите крайнюю дату',
                },
            });

            expect(wrapper.find('.text-status-error').text()).toBe('*');
            expect(wrapper.findComponent({ name: 'AppTooltip' }).exists()).toBe(true);
        });

        it('applies placeholder correctly', () => {
            const wrapper = mount(AppDatePicker, {
                props: { placeholder: 'Укажите день' },
            });

            expect(wrapper.find('input').attributes('placeholder')).toBe('Укажите день');
        });
    });

    // 2. Работа с v-model и событиями
    describe('Model binding & Events', () => {
        it('emits ISO date string when date is selected', async () => {
            const wrapper = mount(AppDatePicker, {
                props: { modelValue: null, isTimeDate: true },
            });

            const input = wrapper.find('input');
            await input.trigger('click');

            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toBeTruthy();
            expect(emitted?.[0]).toEqual(['2026-06-15T00:00:00']);
        });

        it('emits input event when dateValue changes', async () => {
            const wrapper = mount(AppDatePicker, {
                props: { modelValue: '2026-05-10T00:00:00' },
            });

            // Меняем пропс для вызова watch
            await wrapper.setProps({ modelValue: '2026-05-12T00:00:00' });

            expect(wrapper.emitted('input')).toBeTruthy();
        });
    });

    // 3. Состояния (Disabled, Error)
    describe('States & Validation', () => {
        it('disables input and wrapper when isDisabled is true', () => {
            const wrapper = mount(AppDatePicker, {
                props: { isDisabled: true },
            });

            expect(wrapper.find('input').attributes('disabled')).toBeDefined();
            expect(wrapper.classes()).toContain('cursor-not-allowed');
        });

        it('displays error message and sets aria-invalid when errorMessage is provided', () => {
            const wrapper = mount(AppDatePicker, {
                props: { errorMessage: 'Некорректная дата' },
            });

            expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
            expect(wrapper.findComponent({ name: 'AppErrorMessage' }).props('errorMessage')).toBe(
                'Некорректная дата',
            );
        });
    });
});
