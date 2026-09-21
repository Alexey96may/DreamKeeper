<template>
    <div
        class="pointer-events-none fixed right-5 bottom-5 z-50 flex w-full max-w-95 flex-col-reverse gap-2.5 px-4 sm:px-0"
    >
        <TransitionGroup
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-y-4 opacity-0 scale-95"
            enter-to-class="transform translate-y-0 opacity-100 scale-100"
            leave-active-class="transition duration-200 ease-in absolute w-full"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-90"
            move-class="transition duration-300 ease-in-out"
        >
            <div
                v-for="toast in toastStore.toasts"
                :key="toast.id"
                :class="[
                    'pointer-events-auto relative overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all',
                    getConfig(toast.type).borderClass,
                    getConfig(toast.type).bgClass,
                ]"
            >
                <!-- Контент тоста -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <component
                            :is="getConfig(toast.type).icon"
                            :class="['h-5 w-5 shrink-0', getConfig(toast.type).iconClass]"
                        />
                        <p class="text-text-primary text-sm leading-snug font-medium">
                            {{ toast.message }}
                        </p>
                    </div>

                    <div class="flex shrink-0 grow-0 items-center gap-2">
                        <!-- Кнопка действия -->

                        <AppButton
                            v-if="toast.actionLabel"
                            @click="handleAction(toast)"
                            size="sm"
                            variant="secondary"
                            >{{ toast.actionLabel }}</AppButton
                        >

                        <AppButton
                            v-if="!toast.showProgress"
                            @click="toastStore.removeToast(toast.id)"
                            size="sm"
                            variant="danger"
                            :icon-left="X"
                        />
                    </div>
                </div>

                <!-- Полоса прогресса отображается ТОЛЬКО если явно передан showProgress: true -->
                <div
                    v-if="toast.showProgress && (toast.duration ?? 4000) > 0"
                    class="progress-bar absolute bottom-0 left-0 h-1 w-full"
                    :class="getConfig(toast.type).progressClass"
                    :style="{ animationDuration: `${toast.duration ?? 4000}ms` }"
                />
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
    import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next';
    import { useUIStore } from '@/stores/modules/ui';
    import AppButton from '@/components/ui/AppButton.vue';
    import type { Toast } from '@/types/Notification';

    const toastStore = useUIStore();

    const typeConfig = {
        success: {
            icon: CheckCircle2,
            iconClass: 'text-success-text',
            bgClass: 'bg-success-bg',
            borderClass: 'border-success-border/30',
            progressClass: 'bg-accent',
        },
        error: {
            icon: AlertCircle,
            iconClass: 'text-danger-text',
            bgClass: 'bg-danger-bg',
            borderClass: 'border-danger-border/30',
            progressClass: 'bg-accent',
        },
        warning: {
            icon: AlertTriangle,
            iconClass: 'text-warning-text',
            bgClass: 'bg-warning-bg',
            borderClass: 'border-warning-border/30',
            progressClass: 'bg-accent',
        },
        info: {
            icon: Info,
            iconClass: 'text-info-text',
            bgClass: 'bg-info-bg',
            borderClass: 'border-info-border/30',
            progressClass: 'bg-accent',
        },
    };

    const getConfig = (type: Toast['type'] = 'info') => {
        return typeConfig[type || 'info'];
    };

    const handleAction = (toast: Toast) => {
        if (toast.onAction) toast.onAction();
        toastStore.removeToast(toast.id);
    };
</script>

<style scoped>
    @keyframes shrink {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }

    .progress-bar {
        animation-name: shrink;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
    }
</style>
