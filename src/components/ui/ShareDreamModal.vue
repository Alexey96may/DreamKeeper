<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import type { Dream } from '@/types/Dream';
    import AppModal from '@/components/sections/AppModal.vue';
    import AppButton from '@/components/ui/AppButton.vue';
    import { Copy, Check, QrCode } from 'lucide-vue-next';
    import { Download } from 'lucide-vue-next';
    import QRCode from 'qrcode';

    const props = defineProps<{
        dream: Dream;
        modelValue: boolean;
    }>();

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
    }>();

    const copied = ref(false);
    const qrCodeSvg = ref('');
    const showQr = ref(false); // Переключатель: показывать ли сам QR-код

    const authorName = ref(props.dream.authorName ?? '');

    const shareLink = computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...cleanDream } = props.dream;

        if (!cleanDream.isAlien) cleanDream.isAlien = true;

        if (authorName.value.trim()) {
            cleanDream.authorName = authorName.value.trim();
        }

        const payload = {
            ...cleanDream,
            authorName: authorName.value.trim(),
        };

        const jsonString = JSON.stringify(payload);
        const base64Data = btoa(
            encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
                String.fromCharCode(parseInt(p1, 16)),
            ),
        );

        const origin = window.location.origin;
        const base = import.meta.env.BASE_URL || '/';

        const cleanBase = base.startsWith('/') ? base : `/${base}`;
        const normalizedBase = cleanBase.endsWith('/') ? cleanBase : `${cleanBase}/`;

        return `${origin}${normalizedBase}dream/share/import#data=${base64Data}`;
    });

    // Генерация QR-кода в виде SVG строки при изменении ссылки или имени
    const generateQrCode = async () => {
        try {
            qrCodeSvg.value = await QRCode.toString(shareLink.value, {
                type: 'svg',
                margin: 2,
                width: 200,
                color: {
                    dark: '#000000',
                    light: '#ffffff00',
                },
                errorCorrectionLevel: 'L',
            });
        } catch (err) {
            console.error('Ошибка генерации QR-кода', err);
        }
    };

    const downloadQrCode = () => {
        // Находим созданный SVG внутри контейнера
        const svgElement = document.querySelector('.qr-container svg');
        if (!svgElement) return;

        // Сериализуем SVG в строку
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        // Рисуем на canvas, чтобы получить PNG
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const context = canvas.getContext('2d');

            if (context) {
                context.fillStyle = '#FFFFFF';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                // Создаем ссылку для скачивания PNG
                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `dream-qr-${Date.now()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        };
        image.src = blobURL;
    };

    // Следим за изменением ссылки (если меняется имя автора — ссылка меняется, QR пересоздается)
    watch(
        shareLink,
        () => {
            generateQrCode();
        },
        { immediate: true },
    );

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink.value);
            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2500);
        } catch (e) {
            console.error('Не удалось скопировать ссылку', e);
        }
    };

    const close = () => {
        emit('update:modelValue', false);
    };
</script>

<template>
    <AppModal
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        title="Поделиться сном"
    >
        <div class="mb-4 space-y-4">
            <p class="text-text-secondary text-sm">
                Укажите имя автора (по желанию) и поделитесь ссылкой или покажите QR-код другу.
                Когда он сканирует его, сон автоматически добавится в приложение!
            </p>

            <!-- Поле ввода имени автора -->
            <div class="space-y-1.5">
                <label
                    for="sharedAuthorName"
                    class="text-text-primary mb-2 block text-xs font-medium"
                    >Автор сновидения</label
                >
                <input
                    type="text"
                    v-model="authorName"
                    id="sharedAuthorName"
                    placeholder="Например, Незнакомец"
                    class="border-border-primary bg-bg-primary text-text-primary w-full rounded-lg border px-3 py-3 text-xs focus:border-indigo-500 focus:outline-none"
                />
            </div>

            <!-- Ссылка для шеринга -->
            <div class="space-y-1.5">
                <label for="shareLink" class="text-text-primary mb-2 block text-xs font-medium"
                    >Ссылка для шеринга</label
                >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        id="shareLink"
                        readonly
                        :value="shareLink"
                        class="border-border-primary bg-bg-primary text-text-primary w-full rounded-lg border px-3 py-3 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                    <AppButton
                        @click="copyToClipboard"
                        variant="primary"
                        :icon-left="copied ? Check : Copy"
                    >
                        {{ copied ? 'Скопировано!' : 'Копировать' }}
                    </AppButton>
                </div>
            </div>

            <!-- Блок QR-кода -->
            <div class="flex flex-col items-center justify-center gap-4 py-6">
                <AppButton @click="showQr = !showQr" variant="primary" :icon-left="QrCode">
                    {{ showQr ? 'Скрыть QR-код' : 'Показать QR-код' }}
                </AppButton>

                <Transition name="fade-slide">
                    <div
                        v-if="showQr"
                        class="border-border-primary flex flex-col items-center rounded-xl border bg-white p-4 shadow-inner"
                    >
                        <!-- Добавили класс qr-container для поиска через JS -->
                        <div
                            v-html="qrCodeSvg"
                            class="qr-container flex h-48 w-48 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                        ></div>

                        <!-- Кнопка скачивания картинки -->
                        <AppButton
                            @click="downloadQrCode"
                            variant="secondary"
                            size="xs"
                            class="mt-6"
                            :icon-left="Download"
                        >
                            Скачать QR-код (PNG)
                        </AppButton>
                    </div>
                </Transition>
            </div>
        </div>

        <template #footer>
            <AppButton @click="close" variant="secondary">Закрыть</AppButton>
        </template>
    </AppModal>
</template>

<style scoped>
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.25s ease;
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-8px);
    }
</style>
