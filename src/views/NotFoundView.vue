<script setup lang="ts">
    import { Home } from 'lucide-vue-next';
</script>

<template>
    <main
        class="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
        role="main"
        aria-labelledby="error-title"
    >
        <!-- Декоративный код ошибки -->
        <span
            class="text-accent font-mono text-6xl font-extrabold tracking-wider sm:text-8xl"
            aria-hidden="true"
        >
            404
        </span>

        <!-- Заголовок с уникальным ID для aria-labelledby -->
        <h1 id="error-title" class="text-text-primary mt-4 text-2xl font-bold sm:text-3xl">
            Страница не найдена
        </h1>

        <!-- Тематическое описание под проект дневника снов -->
        <p class="text-text-mute mt-2 max-w-md text-sm leading-relaxed">
            Похоже, этот сон растворился в утреннем тумане или ещё не был записан в ваш дневник.
        </p>

        <!-- Кнопка возврата на главную -->
        <div class="mt-6">
            <router-link
                to="/"
                class="bg-accent text-accent-foreground focus-visible:ring-accent inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="Вернуться на главную страницу дневника"
            >
                <Home class="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>На главную</span>
            </router-link>
        </div>
    </main>
</template>
