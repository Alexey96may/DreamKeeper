import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AppNumberInput from '@/components/ui/AppNumberInput.vue';

describe('AppNumberInput.vue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Rendering & Props', () => {
        it('renders label, placeholder, and initial value correctly', () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 5,
                    label: 'Уровень вложенности',
                    placeholder: 'Введите число',
                },
            });

            expect(wrapper.find('label').text()).toContain('Уровень вложенности');
            const input = wrapper.find('input[type="number"]');
            expect((input.element as HTMLInputElement).value).toBe('5');
            expect(input.attributes('placeholder')).toBe('Введите число');
        });

        it('renders formatted badge when formatter prop is provided', () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 8,
                    label: 'Время',
                    formatter: (val) => `${val} hrs`,
                },
            });

            expect(wrapper.text()).toContain('8 hrs');
        });

        it('disables input and buttons when disabled or isLoading prop is true', () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 3,
                    isLoading: true,
                },
            });

            const input = wrapper.find('input[type="number"]');
            expect(input.attributes('disabled')).toBeDefined();
            expect(wrapper.find('.animate-spin').exists()).toBe(true);
        });
    });

    describe('User Input & Events', () => {
        it('emits update:modelValue and clear-error on typing valid number', async () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 1,
                    errorMessage: 'Required field',
                },
            });

            const input = wrapper.find('input[type="number"]');
            await input.setValue('7');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7]);
            expect(wrapper.emitted('clear-error')).toBeTruthy();
        });

        it('emits null when input value is cleared', async () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 5,
                },
            });

            const input = wrapper.find('input[type="number"]');
            await input.setValue('');

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
        });
    });

    describe('Step Controls & Min/Max Limits', () => {
        it('increments value by step when stepUp button is clicked', async () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 5,
                    step: 1,
                    min: 0,
                    max: 10,
                },
            });

            const incrementBtn = wrapper.findAll('button').at(0)!;
            await incrementBtn.trigger('pointerdown');

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6]);
        });

        it('decrements value by step when stepDown button is clicked', async () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 5,
                    step: 2,
                    min: 0,
                    max: 10,
                },
            });

            // Находим кнопку декремента (вторая кнопка)
            const decrementBtn = wrapper.findAll('button').at(1)!;
            await decrementBtn.trigger('pointerdown');

            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);
        });

        it('disables decrement button when modelValue reaches min limit', () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 1,
                    min: 1,
                    max: 10,
                },
            });

            const decrementBtn = wrapper.findAll('button').at(1)!;
            expect(decrementBtn.attributes('disabled')).toBeDefined();
        });

        it('disables increment button when modelValue reaches max limit', () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 10,
                    min: 1,
                    max: 10,
                },
            });

            const incrementBtn = wrapper.findAll('button').at(0)!;
            expect(incrementBtn.attributes('disabled')).toBeDefined();
        });
    });

    describe('Hold-to-Repeat Functionality', () => {
        it('repeats stepping actions when pointer is held down', async () => {
            const wrapper = mount(AppNumberInput, {
                props: {
                    modelValue: 5,
                    step: 1,
                    min: 0,
                    max: 20,
                    holdDelay: 400,
                    holdInterval: 100,
                },
            });

            const incrementBtn = wrapper.findAll('button').at(0)!;

            await incrementBtn.trigger('pointerdown');
            expect(wrapper.emitted('update:modelValue')?.length).toBe(1);

            vi.advanceTimersByTime(400);

            vi.advanceTimersByTime(100); // : 2
            vi.advanceTimersByTime(100); // : 3
            vi.advanceTimersByTime(100); // : 4

            await incrementBtn.trigger('pointerup');

            const events = wrapper.emitted('update:modelValue');
            expect(events?.length).toBeGreaterThanOrEqual(4);
        });
    });
});
