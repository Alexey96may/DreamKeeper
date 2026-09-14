<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';

    import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-vue-next';

    import { useFlash } from '@/composables/useFlash';

    const { show, message, type, isCountingDown, undoRequested, timerDuration } = useFlash();

    const icons = {
        success: CheckCircle2,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const iconComponent = computed(() => icons[type.value] || Info);

    const typeStyles = {
        success: 'border-success-border bg-success-bg/90 text-success-text',
        error: 'border-danger-border bg-danger-bg/90 text-danger-text',
        warning: 'border-warning-border bg-warning-bg/90 text-warning-text',
        info: 'border-info-border bg-info-bg/90 text-info-text',
    };

    const isServer = ref(true);

    onMounted(() => {
        isServer.value = false;
    });
</script>

<template>
    <Teleport to="body" :disabled="isServer">
        <Transition
            enter-active-class="transform transition duration-500 ease-out"
            enter-from-class="translate-y-12 opacity-0 scale-95"
            enter-to-class="translate-y-0 opacity-100 scale-100"
            leave-active-class="transition duration-300 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-90"
        >
            <div
                v-if="show"
                :key="message"
                :role="type === 'error' ? 'alert' : 'status'"
                aria-live="polite"
                class="fixed right-8 bottom-8 z-[9999] flex min-w-[320px] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md"
                :class="typeStyles[type]"
            >
                <div class="flex items-center gap-4 px-6 py-4">
                    <component :is="iconComponent" class="h-5 w-5 shrink-0" aria-hidden="true" />

                    <div class="flex-1 text-xs font-black tracking-widest uppercase">
                        {{ message }}
                    </div>

                    <button
                        v-if="isCountingDown"
                        @click="undoRequested = true"
                        class="ml-2 rounded-lg bg-current/10 px-3 py-1.5 text-[10px] font-black uppercase transition-all outline-none hover:bg-current/20 focus-visible:ring-2 focus-visible:ring-current active:scale-95"
                    >
                        Отмена
                    </button>
                    <button
                        v-else
                        @click="show = false"
                        aria-label="Close notification"
                        class="rounded-md opacity-50 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none"
                    >
                        <X class="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                <div v-if="isCountingDown" class="relative h-1 w-full bg-current/10">
                    <div
                        class="absolute inset-y-0 left-0 bg-current shadow-[0_0_10px_currentColor]"
                        :style="{
                            animation: `shrink ${timerDuration}ms linear forwards`,
                        }"
                        aria-hidden="true"
                    ></div>
                    <span class="sr-only"
                        >This notification will disappear in
                        {{ timerDuration / 1000 }} seconds</span
                    >
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style>
    @keyframes shrink {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
</style>
