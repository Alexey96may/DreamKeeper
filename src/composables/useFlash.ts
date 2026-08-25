import { ref } from 'vue';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

const show = ref(false);
const message = ref('');
const type = ref<NotificationType>('info');
const isCountingDown = ref(false);
const undoRequested = ref(false);
const timerDuration = ref(4000);

const lastProcessedKey = ref<string | null>(null);
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let currentResolve: ((value: boolean) => void) | null = null;
let activeInterval: ReturnType<typeof setInterval> | null = null;

export function useFlash() {
    const forceClose = (result: boolean) => {
        if (timeoutId) clearTimeout(timeoutId);
        if (activeInterval) clearInterval(activeInterval);

        if (currentResolve) {
            currentResolve(result);
            currentResolve = null;
        }

        show.value = false;
        isCountingDown.value = false;
    };

    const notify = (msg: string, t: NotificationType = 'info') => {
        forceClose(false);

        message.value = msg;
        type.value = t;
        show.value = true;

        timeoutId = setTimeout(() => {
            show.value = false;
        }, 4000);
    };

    const notifyWithUndo = (msg: string, duration: number = 5000): Promise<boolean> => {
        forceClose(true);

        lastProcessedKey.value = null;

        message.value = msg;
        type.value = 'warning';
        show.value = true;
        isCountingDown.value = true;
        undoRequested.value = false;
        timerDuration.value = duration;

        return new Promise((resolve) => {
            currentResolve = resolve;
            const start = Date.now();
            activeInterval = setInterval(() => {
                if (undoRequested.value) {
                    forceClose(false); // Пользователь нажал Undo
                } else if (Date.now() - start >= duration) {
                    forceClose(true); // Таймер истек — подтверждаем удаление
                }
            }, 50);
        });
    };

    return {
        show,
        message,
        type,
        isCountingDown,
        undoRequested,
        timerDuration,
        notify,
        notifyWithUndo,
    };
}
