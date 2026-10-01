<template>
    <article
        class="border-border-primary bg-bg-primary relative flex h-full flex-col justify-between rounded-sm border p-5 pt-8 shadow-sm lg:rounded-lg"
    >
        <div
            class="border-danger-border bg-danger-bg/40 absolute -top-2 -left-2 h-6 w-32 animate-pulse rounded-sm border px-2.5 py-0.5 lg:rounded-lg"
        ></div>

        <div class="mb-3">
            <!-- Верхняя строка: дата создания и иконки-флаги -->
            <div class="mb-5 flex items-start justify-between gap-2">
                <div class="flex items-center gap-1.5">
                    <div class="bg-border-primary/60 h-3.5 w-3.5 animate-pulse rounded-sm"></div>
                    <div class="bg-border-primary/60 h-3.5 w-24 animate-pulse rounded"></div>
                </div>

                <div class="flex items-center gap-1.5">
                    <div class="bg-border-primary/60 h-3.5 w-3.5 animate-pulse rounded"></div>
                    <div class="bg-border-primary/60 h-3.5 w-3.5 animate-pulse rounded"></div>
                </div>
            </div>

            <!-- Заголовок и описание -->
            <div class="mb-6 flex flex-col gap-2">
                <!-- Эмуляция заголовка -->
                <div class="bg-border-primary/60 h-5 w-3/4 animate-pulse rounded"></div>

                <!-- Эмуляция трех строк описания -->
                <div class="flex flex-col gap-1.5 pt-1">
                    <div class="bg-border-primary/40 h-3.5 w-full animate-pulse rounded"></div>
                    <div class="bg-border-primary/40 h-3.5 w-5/6 animate-pulse rounded"></div>
                    <div class="bg-border-primary/40 h-3.5 w-2/3 animate-pulse rounded"></div>
                </div>
            </div>

            <!-- Блок аналитики (персонажи, локации, эмоции) -->
            <div class="border-border/60 mb-4 flex flex-col gap-y-2 border-t pt-3 text-xs">
                <div class="flex items-center gap-1.5">
                    <div class="bg-border-primary/50 h-3 w-3 shrink-0 animate-pulse rounded"></div>
                    <div class="bg-border-primary/40 h-3 w-1/2 animate-pulse rounded"></div>
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="bg-border-primary/50 h-3 w-3 shrink-0 animate-pulse rounded"></div>
                    <div class="bg-border-primary/40 h-3 w-2/5 animate-pulse rounded"></div>
                </div>
            </div>
        </div>

        <!-- Футер: счетчики толкований/связей и стрелочка -->
        <footer class="flex items-center justify-end">
            <div class="flex items-center gap-3 text-xs">
                <div class="flex items-center gap-1">
                    <div class="bg-border-primary/60 h-3.5 w-3.5 animate-pulse rounded"></div>
                    <div class="bg-border-primary/40 h-3.5 w-4 animate-pulse rounded"></div>
                </div>
                <div class="flex items-center gap-1">
                    <div class="bg-border-primary/60 h-3.5 w-3.5 animate-pulse rounded"></div>
                    <div class="bg-border-primary/40 h-3.5 w-4 animate-pulse rounded"></div>
                </div>
                <div class="bg-border-primary/60 ml-1 h-4 w-4 animate-pulse rounded"></div>
            </div>
        </footer>
    </article>
</template>

<script setup lang="ts"></script>
