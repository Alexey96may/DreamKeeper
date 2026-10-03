import { useSleepStore } from '@/stores/modules/dream';
import { useUserStateStore } from '@/stores/modules/userState';
import { useUIStore } from '@/stores/modules/ui';

const CURRENT_BACKUP_VERSION = 1;

export type ImportDataMode = 'replace' | 'merge';

/**
 * Export data specifying the schema version
 */
export const exportUserData = () => {
    const sleepStore = useSleepStore();
    const stateStore = useUserStateStore();

    const exportData = {
        version: CURRENT_BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        sleeps: sleepStore.sleeps,
        states: stateStore.states,
    };

    const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');

    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
        'download',
        `dreamkeeper_backup_${new Date().toISOString().split('T')[0]}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
};

/**
 * Import data with mode selection: 'replace' (replace all) or 'merge' (add/update)
 * @param event File input event
 * @param mode Import mode (ImportDataMode)
 */
export const importUserData = async (event: Event, mode: ImportDataMode = 'merge') => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const uiStore = useUIStore();

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const content = e.target?.result as string;
            const parsedData = JSON.parse(content);

            // 1. Проверка версии структуры данных (миграции на будущее)
            const backupVersion = parsedData.version || 1;
            if (backupVersion > CURRENT_BACKUP_VERSION) {
                uiStore.addToast({
                    message:
                        'Этот файл бэкапа создан в более новой версии приложения. Обновите приложение, чтобы импортировать его.',
                    type: 'error',
                });
                return;
            }

            const sleepStore = useSleepStore();
            const stateStore = useUserStateStore();

            let hasBeenImported = false;

            // 2. Import dreams via a special store method
            if (Array.isArray(parsedData.sleeps)) {
                await sleepStore.importDreams(parsedData.sleeps, mode);
                hasBeenImported = true;
            }

            // 3. State import
            if (Array.isArray(parsedData.states) && typeof stateStore.importStates === 'function') {
                await stateStore.importStates(parsedData.states, mode);
                hasBeenImported = true;
            }

            if (hasBeenImported) {
                uiStore.addToast({
                    message: 'Данные успешно импортированы!',
                    type: 'success',
                });
            } else {
                throw new Error('Nothing to import.');
            }
        } catch (error) {
            console.error('Ошибка при чтении файла бэкапа:', error);
            uiStore.addToast({
                message: 'Не удалось импортировать файл. Неверный формат JSON.',
                type: 'error',
            });
        } finally {
            target.value = '';
        }
    };
    reader.readAsText(file);
};
