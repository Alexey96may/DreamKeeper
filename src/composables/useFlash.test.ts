import { nextTick, ref } from 'vue';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFlash } from '@/composables/ui/useFlash';

const mockFlash = ref<any>({});

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => ({
        props: {
            get flash() {
                return mockFlash.value;
            },
        },
    }),
}));

describe('useFlash composable', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        mockFlash.value = {};
    });

    it('should work correctly when notify is called manually', () => {
        const { show, message, type, notify } = useFlash();

        notify('Manual alert', 'success');

        expect(show.value).toBe(true);
        expect(message.value).toBe('Manual alert');
        expect(type.value).toBe('success');
    });

    it('should automatically react to flash changes in Inertia props', async () => {
        const { show, message, type } = useFlash();

        // Simulate Laravel sending a flash message
        mockFlash.value = { success: 'Saved successfully!' };

        await nextTick();

        expect(show.value).toBe(true);
        expect(message.value).toBe('Saved successfully!');
        expect(type.value).toBe('success');
    });

    it('should hide the notification after 4 seconds', () => {
        const { show, notify } = useFlash();

        notify('Self-destruct message');
        expect(show.value).toBe(true);

        vi.advanceTimersByTime(4000);

        expect(show.value).toBe(false);
    });

    it('should reset the existing timer when a new notification is triggered', () => {
        const { show, notify } = useFlash();

        notify('First Message');
        vi.advanceTimersByTime(2000);

        notify('Second Message');
        vi.advanceTimersByTime(3000); // (Total 5s)

        // If the old timer wasn't cleared, 'show' would be false now.
        // But the new timer should have 1 second remaining.
        expect(show.value).toBe(true);

        vi.advanceTimersByTime(1000);
        expect(show.value).toBe(false);
    });
});
