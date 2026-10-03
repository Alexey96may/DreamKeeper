import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import UserStateForm from '@/components/sections/UserStateForm.vue';
import { useUserStateStore } from '@/stores/modules/userState';
import type { UserState } from '@/types/UserState';

vi.mock('@/composables/crud/index', () => ({
    useCrud: () => ({
        // @ts-expect-error - the parameter is not used.
        handleDeleteState: vi.fn((id, callback) => callback()),
    }),
}));

vi.mock('@/utils/formatters', () => ({
    dreamValueFormatter: (val: number) => String(val),
}));

vi.mock('@/components/ui/AppRange.vue', () => ({
    default: {
        name: 'AppRange',
        props: ['modelValue', 'label', 'errorMessage'],
        template: `
            <div class="mock-range">
                <label>{{ label }}</label>
                <input
                    type="range"
                    :value="modelValue"
                    @input="$emit('update:modelValue', Number($event.target.value)); $emit('input')"
                />
                <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
            </div>
        `,
    },
}));

vi.mock('@/components/ui/AppTextarea.vue', () => ({
    default: {
        name: 'AppTextarea',
        props: ['modelValue', 'label', 'errorMessage'],
        template: `
            <div class="mock-textarea">
                <label>{{ label }}</label>
                <textarea
                    :value="modelValue"
                    @input="$emit('update:modelValue', $event.target.value); $emit('input')"
                ></textarea>
                <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
            </div>
        `,
    },
}));

vi.mock('@/components/ui/AppErrorMessage.vue', () => ({
    default: {
        name: 'AppErrorMessage',
        props: ['errorMessage'],
        template: '<div v-if="errorMessage" class="global-error">{{ errorMessage }}</div>',
    },
}));

vi.mock('@/components/ui/AppButton.vue', () => ({
    default: {
        name: 'AppButton',
        template: '<button @click="$emit(\'click\')"><slot /></button>',
    },
}));

describe('UserStateForm.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('renders form in creation mode when no initialData is provided', () => {
        const wrapper = mount(UserStateForm, {
            props: {
                date: '2026-10-02',
            },
        });

        expect(wrapper.text()).toContain('Создать');
        expect(wrapper.text()).toContain('Настроение');
        expect(wrapper.text()).toContain('Энергия');
        expect(wrapper.find('button[variant="danger"]').exists()).toBe(false);
    });

    it('renders form in editing mode and displays delete button when initialData is provided', () => {
        const initialData = {
            id: 123,
            date: '2026-10-02',
            mood: 8,
            energy: 7,
            productivity: 9,
            stress: 2,
            focus: 8,
            notes: 'Отличный день',
        };

        const wrapper = mount(UserStateForm, {
            props: {
                date: '2026-10-02',
                initialData,
            },
        });

        expect(wrapper.text()).toContain('Сохранить');
        const deleteButton = wrapper.findComponent({ name: 'AppButton' });
        expect(deleteButton.exists()).toBe(true);
    });

    it('calls addState action and emits change on form submit in creation mode', async () => {
        const userStateStore = useUserStateStore();
        const addStateSpy = vi
            .spyOn(userStateStore, 'addState')
            .mockResolvedValue({ id: 1 } as UserState);

        const wrapper = mount(UserStateForm, {
            props: {
                date: '2026-10-02',
            },
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(addStateSpy).toHaveBeenCalledTimes(1);
        expect(addStateSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                date: '2026-10-02',
                mood: 1,
            }),
        );
        expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('calls updateState action and emits change on form submit in editing mode', async () => {
        const userStateStore = useUserStateStore();
        const updateStateSpy = vi
            .spyOn(userStateStore, 'updateState')
            .mockResolvedValue({ id: 123 } as UserState);

        const initialData = {
            id: 123,
            date: '2026-10-02',
            mood: 5,
            energy: 5,
            productivity: 5,
            stress: 5,
            focus: 5,
            notes: '',
        };

        const wrapper = mount(UserStateForm, {
            props: {
                date: '2026-10-02',
                initialData,
            },
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(updateStateSpy).toHaveBeenCalledTimes(1);
        expect(updateStateSpy).toHaveBeenCalledWith(
            123,
            expect.objectContaining({
                date: '2026-10-02',
                mood: 5,
            }),
        );
        expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('emits change event when cancel button is clicked', async () => {
        const wrapper = mount(UserStateForm, {
            props: {
                date: '2026-10-02',
            },
        });

        const buttons = wrapper.findAllComponents({ name: 'AppButton' });
        const cancelButton = buttons.find((btn) => btn.text() === 'Отмена');

        expect(cancelButton).toBeDefined();
        await cancelButton?.trigger('click');

        expect(wrapper.emitted('change')).toBeTruthy();
    });
});
