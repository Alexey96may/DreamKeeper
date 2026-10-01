<!--
/**
 * @file DreamCardSkeleton.vue
 * @description Skeleton loader component mirroring DreamCard structure.
 */
-->
<script setup lang="ts"></script>

<template>
    <article class="dream-card border-border-primary rounded-lg border p-4 transition duration-200">
        <div class="flex items-start justify-between gap-4">
            <div class="w-full animate-pulse space-y-4">
                <div class="bg-border-primary/60 h-3 w-1/3 rounded"></div>

                <div class="space-y-2">
                    <div class="bg-border-primary/60 h-4 w-full rounded"></div>
                    <div class="bg-border-primary/60 h-4 w-5/6 rounded"></div>
                    <div class="bg-border-primary/60 h-4 w-4/6 rounded"></div>
                </div>

                <div class="bg-border-primary/60 h-3 w-1/4 rounded"></div>
            </div>
        </div>
    </article>
</template>
