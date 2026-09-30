<script setup lang="ts">
    import { ref, computed } from 'vue';
    import type { Dream } from '@/types/Dream';
    import AppModal from '@/components/sections/AppModal.vue';
    import AppButton from '@/components/ui/AppButton.vue';
    import { Copy, Check } from 'lucide-vue-next';

    const props = defineProps<{
        dream: Dream;
        modelValue: boolean;
    }>();

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
    }>();

    const copied = ref(false);

    // Генерация защищенной Base64-ссылки из объекта сна (с исключением лишнего локального мусора)
    const shareLink = computed(() => {
        const { id, createdAt, updatedAt, ...cleanDream } = props.dream;

        // Превращаем в JSON и кодируем в Base64 (с поддержкой кириллицы через encodeURIComponent)
        const jsonString = JSON.stringify(cleanDream);
        const base64Data = btoa(
            encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
                String.fromCharCode(parseInt(p1, 16)),
            ),
        );

        const baseUrl = window.location.origin;
        return `${baseUrl}/dream/share/import#data=${base64Data}`;
    });

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
        <div class="mb-2 space-y-4">
            <p class="text-text-secondary text-sm">
                Скопируйте эту ссылку и отправьте другу. Когда он откроет её, данные сна
                автоматически заполнятся в его приложении, и ему останется только указать автора!
            </p>

            <div class="flex items-center gap-2">
                <input
                    type="text"
                    readonly
                    :value="shareLink"
                    class="border-border-primary bg-bg-primary text-text-primary focus:border-accent-active w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
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

        <template #footer>
            <AppButton @click="close" variant="secondary"> Закрыть </AppButton>
        </template>
    </AppModal>
</template>
