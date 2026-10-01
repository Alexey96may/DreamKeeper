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
                Укажите имя автора (по желанию) и скопируйте ссылку. Когда друг откроет её, данные
                сна и имя автора автоматически заполнятся у него в приложении!
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

            <div class="space-y-1.5">
                <label for="shareLink" class="text-text-primary ma mb-2 block text-xs font-medium"
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
        </div>

        <template #footer>
            <AppButton @click="close" variant="secondary">Закрыть</AppButton>
        </template>
    </AppModal>
</template>
