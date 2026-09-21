import { ref } from 'vue';
import { useUIStore } from '@/stores/modules/ui';
import { useSleepStore } from '@/stores/modules/dream';
import { useRouter } from 'vue-router';

export function useCrud() {
    const { addToast } = useUIStore();
    const sleepStore = useSleepStore();
    const router = useRouter();

    const deletingItems = ref<number[]>([]);

    const handleDelete = async (id: number | string, date: string) => {
        const numericId = Number(id);
        if (!numericId) return;

        let isCancelled = false;
        const duration = 4000;

        deletingItems.value.push(numericId);

        const timer = setTimeout(async () => {
            if (isCancelled) return;

            try {
                const success = await sleepStore.deleteDream(numericId);
                if (success) {
                    router.push(date ? `/day/${date}` : '/');
                    addToast({ message: 'Сон забыт!', type: 'info', duration: 1000 });
                }
            } finally {
                deletingItems.value = deletingItems.value.filter((item) => item !== numericId);
            }
        }, duration);

        addToast({
            message: 'Забыть этот сон?',
            type: 'warning',
            showProgress: true,
            duration,
            actionLabel: 'Отменить',
            onAction: () => {
                isCancelled = true;
                clearTimeout(timer);
                deletingItems.value = deletingItems.value.filter((item) => item !== numericId);
                addToast({ message: 'Сон восстановлен', type: 'info', duration: 1000 });
            },
        });
    };

    const isDeleting = (id: number): boolean => {
        return deletingItems.value.includes(id);
    };

    return { handleDelete, isDeleting };
}
