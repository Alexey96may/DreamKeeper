<script setup lang="ts">
    // Скелетон не требует пропсов, но можно добавить count или оставить стандартную одну заглушку
</script>

<template>
    <div class="bg-bg-secondary/50 border-border-primary rounded-lg border px-4 py-6 select-none">
        <div class="relative flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-4">
            <!-- Плейсхолдер рейтинга -->
            <div class="bg-border-primary/40 h-8 w-16 animate-pulse rounded-md" />

            <!-- Основной контент (Плейсхолдер заголовка и описания) -->
            <div class="flex flex-col items-center gap-2 sm:flex-1 sm:items-stretch">
                <!-- Плейсхолдер мини-заголовка -->
                <div class="bg-border-primary/40 h-4 w-24 animate-pulse rounded-full" />

                <!-- Плейсхолдер текста описания (две строки для реалистичности) -->
                <div class="flex w-full flex-col items-center space-y-2 sm:items-start">
                    <div class="bg-border-primary/40 h-4 w-full max-w-md animate-pulse rounded" />
                    <div class="bg-border-primary/40 h-4 w-3/4 max-w-xs animate-pulse rounded" />
                </div>
            </div>

            <!-- Плейсхолдер кнопок действий -->
            <div class="flex min-w-1/5 flex-row-reverse items-center justify-end gap-2 sm:flex-row">
                <div class="bg-border-primary/40 h-8 w-8 animate-pulse rounded-md" />
                <div class="bg-border-primary/40 h-8 w-8 animate-pulse rounded-md" />
            </div>
        </div>
    </div>
</template>
