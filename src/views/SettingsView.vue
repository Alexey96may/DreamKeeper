<script setup lang="ts">
    import { ref } from 'vue';
    import {
        exportUserData,
        importUserData,
        type ImportDataMode,
    } from '@/composables/useExportImportDB';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppSelect from '@/components/ui/AppSelect.vue';

    // Ссылка на скрытый инпут для выбора файла
    const fileInputRef = ref<HTMLInputElement | null>(null);

    // Выбранный режим импорта: 'merge' (слияние) или 'replace' (полная замена)
    const importMode = ref<ImportDataMode>('merge');

    const selectArray = [
        { value: 'merge', label: 'Слить (добавить новые, пропустить дубликаты)' },
        { value: 'replace', label: 'Заменить всё (очистить текущую базу)' },
    ];

    // 1. Обработчик клика по кнопке экспорта
    const handleExport = () => {
        exportUserData();
    };

    // 2. Клик по кнопке «Импортировать» открывает системное окно выбора файла
    const triggerFileInput = () => {
        fileInputRef.value?.click();
    };

    // 3. Обработчик выбора файла пользователем
    const handleFileSelected = async (event: Event) => {
        // Передаем событие и выбранный режим в функцию из вашего файла
        await importUserData(event, importMode.value);
    };
</script>

<template>
    <div class="space-y-6 p-6">
        <h2 class="text-xl font-bold">Резервное копирование данных</h2>

        <!-- Секция экспорта -->
        <section v-scroll-reveal class="dream-card space-y-4 p-4">
            <div class="space-y-2">
                <h3 class="font-semibold">Экспорт бэкапа</h3>

                <p class="text-text-secondary text-sm">
                    Скачать все ваши сны и состояния в формате JSON.
                </p>
            </div>

            <AppButton @click="handleExport" size="sm" variant="primary">Скачать бэкап</AppButton>
        </section>

        <!-- Секция импорта -->
        <section v-scroll-reveal class="dream-card space-y-4 rounded-lg border p-4">
            <h3 class="font-semibold">Импорт бэкапа</h3>

            <AppSelect
                id="form-time-of-day"
                v-model="importMode"
                label="Восстановить данные из ранее сохраненного файла."
                :options="selectArray"
            />

            <input
                ref="fileInputRef"
                type="file"
                accept=".json"
                class="hidden"
                @change="handleFileSelected"
            />

            <AppButton @click="triggerFileInput" size="sm" variant="primary"
                >Выбрать файл и импортировать
            </AppButton>
        </section>
    </div>
</template>
