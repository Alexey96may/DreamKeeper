import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { useFieldFocus } from '@/composables/useFieldFocus'; // Укажите актуальный путь

describe('useFieldFocus composable', () => {
    it('focuses target element manually when focus() is called', async () => {
        const { targetRef, focus } = useFieldFocus();

        const mockElement = {
            focus: vi.fn(),
        } as unknown as HTMLElement;

        targetRef.value = mockElement;

        await focus();

        expect(mockElement.focus).toHaveBeenCalledTimes(1);
    });

    it('does nothing on manual focus if targetRef is null', async () => {
        const { focus } = useFieldFocus();
        await expect(focus()).resolves.toBeUndefined();
    });

    it('automatically focuses when errorMessage becomes truthy', async () => {
        const errorMessage = ref<string | null>(null);
        const { targetRef } = useFieldFocus({ errorMessage });

        const mockElement = {
            focus: vi.fn(),
        } as unknown as HTMLElement;
        targetRef.value = mockElement;

        errorMessage.value = 'Invalid value';

        await vi.waitFor(() => {
            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });
    });

    it('respects autoFocusOnError option when set to false', async () => {
        const errorMessage = ref<string | null>(null);
        const { targetRef } = useFieldFocus({
            errorMessage,
            autoFocusOnError: false,
        });

        const mockElement = {
            focus: vi.fn(),
        } as unknown as HTMLElement;
        targetRef.value = mockElement;

        errorMessage.value = 'Error occurred';

        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(mockElement.focus).not.toHaveBeenCalled();
    });

    it('respects isDisabled option and prevents auto-focus', async () => {
        const errorMessage = ref<string | null>(null);
        const isDisabled = ref(true);
        const { targetRef } = useFieldFocus({
            errorMessage,
            isDisabled,
        });

        const mockElement = {
            focus: vi.fn(),
        } as unknown as HTMLElement;
        targetRef.value = mockElement;

        errorMessage.value = 'Error occurred';

        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(mockElement.focus).not.toHaveBeenCalled();
    });

    it('supports getter functions for options', async () => {
        const errorMessage = ref<string | null>(null);
        const { targetRef } = useFieldFocus({
            errorMessage: () => errorMessage.value,
            isDisabled: () => false,
            autoFocusOnError: () => true,
        });

        const mockElement = {
            focus: vi.fn(),
        } as unknown as HTMLElement;
        targetRef.value = mockElement;

        errorMessage.value = 'Getter error';

        await vi.waitFor(() => {
            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });
    });
});
