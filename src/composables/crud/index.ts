import { ref } from 'vue';
import { useFlash } from '@/composables/useFlash';
import { useSleepStore } from '@/stores/modules/dream';
import { useRouter } from 'vue-router';

export function useCrud() {
    const { notifyWithUndo, notify } = useFlash();
    const sleepStore = useSleepStore();
    const router = useRouter();

    const deletingItems = ref<number[]>([]);

    const handleDelete = async (id: number | string, date: string) => {
        const numericId = Number(id);
        if (!numericId) return;

        deletingItems.value.push(numericId);
        try {
            const isTimeOut = await notifyWithUndo('Удалить эту запись сна?');

            if (isTimeOut) {
                const targetDate = date;
                const success = await sleepStore.deleteDream(numericId);
                if (success) {
                    notify('Сон удалён!');

                    router.push(targetDate ? `/day/${targetDate}` : '/');
                }
            }
        } finally {
            deletingItems.value = deletingItems.value.filter((item) => item !== numericId);
        }
    };

    const isDeleting = (id: number): boolean => {
        return deletingItems.value.includes(id);
    };

    return { handleDelete, isDeleting };
}
