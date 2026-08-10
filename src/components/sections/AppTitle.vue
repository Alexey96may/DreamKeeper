<!-- <AppTitle
    title="📊 Статистика снов"
    subtitle="Анализ за последний месяц"
    button-text="📥 Экспорт PDF"
    button-variant="default"
    button-aria-label="Скачать отчет по снам в формате PDF"
    @action="goToNewDream"
/> -->

<template>
    <header
        class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        aria-labelledby="page-main-heading"
    >
        <div>
            <h1 id="page-main-heading" class="text-accent text-3xl font-bold">
                <slot name="title">{{ title }}</slot>
            </h1>

            <p v-if="subtitle || $slots.subtitle" class="text-text-soft mt-1 text-sm">
                <slot name="subtitle">{{ subtitle }}</slot>
            </p>
        </div>

        <div v-if="showButton">
            <BaseButton
                :variant="buttonVariant"
                :disabled="buttonDisabled"
                :aria-label="
                    buttonAriaLabel || (typeof buttonText === 'string' ? buttonText : undefined)
                "
                @click="$emit('action', $event)"
            >
                <slot name="button-content">
                    {{ buttonText }}
                </slot>
            </BaseButton>
        </div>
    </header>
</template>

<script setup lang="ts">
    import BaseButton from '@/components/ui/AppButton.vue';

    interface Props {
        title?: string;
        subtitle?: string;
        showButton?: boolean;
        buttonText?: string;
        buttonVariant?: 'dream' | 'default';
        buttonDisabled?: boolean;
        buttonAriaLabel?: string;
    }

    withDefaults(defineProps<Props>(), {
        title: '🌙 DreamKeeper',
        subtitle: 'Хранитель твоих снов и состояния',
        showButton: true,
        buttonText: '✨ Новый сон',
        buttonVariant: 'dream',
        buttonDisabled: false,
        buttonAriaLabel: undefined,
    });

    defineEmits<{
        (e: 'action', event: MouseEvent): void;
    }>();
</script>
