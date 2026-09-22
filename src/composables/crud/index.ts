import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUIStore } from '@/stores/modules/ui';
import { useSleepStore } from '@/stores/modules/dream';
import { useUserStateStore } from '@/stores/modules/userState'; // Поменяйте путь на ваш стор состояний

export interface DeleteConfig {
    id: number | string;
    deleteFn: (id: number) => Promise<boolean>;
    confirmMessage?: string;
    successMessage?: string;
    restoredMessage?: string;
    duration?: number;
    redirectUrl?: string;
    onSuccess?: () => void;
}

export function useCrud() {
    const { addToast } = useUIStore();
    const sleepStore = useSleepStore();
    const userStateStore = useUserStateStore();
    const router = useRouter();

    const deletingItems = ref<number[]>([]);

    const deleteWithUndo = async (config: DeleteConfig) => {
        const numericId = Number(config.id);
        if (!numericId) return;

        const {
            deleteFn,
            confirmMessage = 'Удалить этот элемент?',
            successMessage = 'Удалено',
            restoredMessage = 'Восстановлено',
            duration = 3000,
            redirectUrl,
            onSuccess,
        } = config;

        let isCancelled = false;

        deletingItems.value.push(numericId);

        const timer = setTimeout(async () => {
            if (isCancelled) return;

            try {
                const success = await deleteFn(numericId);
                if (success) {
                    if (redirectUrl) {
                        router.push(redirectUrl);
                    }
                    if (onSuccess) {
                        onSuccess();
                    }
                    addToast({ message: successMessage, type: 'info', duration: 1000 });
                }
            } finally {
                deletingItems.value = deletingItems.value.filter((item) => item !== numericId);
            }
        }, duration);

        addToast({
            message: confirmMessage,
            type: 'warning',
            showProgress: true,
            duration,
            actionLabel: 'Отменить',
            onAction: () => {
                isCancelled = true;
                clearTimeout(timer);
                deletingItems.value = deletingItems.value.filter((item) => item !== numericId);
                addToast({ message: restoredMessage, type: 'info', duration: 1000 });
            },
        });
    };

    /**
     * Удаление сна
     */
    const handleDeleteDream = (id: number | string, date?: string) => {
        return deleteWithUndo({
            id,
            deleteFn: (numericId) => sleepStore.deleteDream(numericId),
            confirmMessage: 'Забыть этот сон?',
            successMessage: 'Сон забыт!',
            restoredMessage: 'Сон восстановлен',
            duration: 4000,
            redirectUrl: date ? `/day/${date}` : '/',
        });
    };

    /**
     * Удаление состояния
     */
    const handleDeleteState = (id: number | string, onSuccess?: () => void) => {
        return deleteWithUndo({
            id,
            deleteFn: (numericId) => userStateStore.deleteState(numericId),
            confirmMessage: 'Удалить состояние?',
            successMessage: 'Состояние удалено!',
            restoredMessage: 'Восстановлено',
            duration: 3000,
            onSuccess,
        });
    };

    const isDeleting = (id: number | string): boolean => {
        return deletingItems.value.includes(Number(id));
    };

    return {
        deleteWithUndo,
        handleDeleteDream,
        handleDeleteState,
        handleDelete: handleDeleteDream,
        isDeleting,
    };
}
