<script setup lang="ts">
    import { computed } from 'vue';
    import { LUCID_TRIGGER_MAP, DREAM_CATEGORY_MAP } from '@/constants/Dream';
    import type {
        DreamCategory,
        LucidDetails,
        NightmareDetails,
        PropheticDetails,
    } from '@/types/Dream';
    import AppSmartTime from '@/components/ui/AppSmartTime.vue';

    interface Props {
        type: DreamCategory;
        details: LucidDetails | NightmareDetails | PropheticDetails;
        isPressed?: boolean;
        isInFilter?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        isPressed: false,
        isInFilter: false,
    });

    const cardClasses = computed(() => {
        switch (props.type) {
            case 'nightmare':
                return 'border-danger-border/30 bg-danger-bg/30 text-xs';
            case 'prophetic':
                return 'border-mystical-border/30 bg-mystical-bg/30 text-xs';
            case 'lucid':
                return 'border-success-border/30 bg-success-bg/30 text-xs';
            default:
                return 'border-border-subtle/30 bg-bg-secondary/30 text-xs';
        }
    });

    const headerClasses = computed(() => {
        switch (props.type) {
            case 'nightmare':
                return 'font-bold text-danger-text flex items-center gap-1.5';
            case 'prophetic':
                return 'font-bold text-mystical-text flex items-center gap-1.5';
            case 'lucid':
                return 'font-bold text-success-text flex items-center gap-1.5';
            default:
                return 'text-accent font-bold flex items-center gap-1.5';
        }
    });

    const categoryConfig = computed(() => DREAM_CATEGORY_MAP[props.type]);
</script>

<template>
    <article
        :class="[
            'space-y-1.5 rounded-lg border p-3.5 transition-all duration-200',
            cardClasses,
            isPressed
                ? 'border-accent! bg-accent/25! text-text-primary ring-accent/50 cursor-pointer font-semibold shadow-sm ring-2'
                : isInFilter
                  ? 'border-accent/60 hover:border-accent hover:bg-accent/10 animate-pulse cursor-pointer shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.15)]'
                  : 'hover:border-border/80 hover:text-text-primary',
        ]"
        :aria-label="`Детали категории: ${categoryConfig?.label || type}`"
        :aria-pressed="isPressed"
    >
        <header :class="headerClasses">
            <component :is="categoryConfig?.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{{ categoryConfig?.label }}</span>
        </header>

        <!-- 1. lucid -->
        <template v-if="type === 'lucid'">
            <div
                v-if="
                    (details as LucidDetails).controlLevel !== undefined &&
                    (details as LucidDetails).controlLevel! > 0
                "
            >
                <span class="text-text-secondary">Уровень контроля:</span>
                <span class="text-text-primary ml-1 font-semibold">
                    {{ (details as LucidDetails).controlLevel }}/10
                </span>
            </div>
            <div v-if="(details as LucidDetails).trigger">
                <span class="text-text-secondary">Триггер осознания:</span>
                <span class="text-text-primary ml-1 font-medium">
                    {{
                        LUCID_TRIGGER_MAP[(details as LucidDetails).trigger!]?.label ||
                        (details as LucidDetails).trigger
                    }}
                </span>
            </div>
        </template>

        <!-- 2. nightmare -->
        <template v-if="type === 'nightmare'">
            <div
                v-if="
                    (details as NightmareDetails).fearLevel !== undefined &&
                    (details as NightmareDetails).fearLevel! > 0
                "
            >
                <span class="text-text-secondary">Уровень страха:</span>
                <span class="text-text-primary ml-1 font-semibold">
                    {{ (details as NightmareDetails).fearLevel }}/10
                </span>
            </div>
            <div v-if="(details as NightmareDetails).copingMechanism">
                <span class="text-text-secondary">Как справился: </span>
                <span class="text-text-primary m-0 mt-0.5">
                    {{ (details as NightmareDetails).copingMechanism }}
                </span>
            </div>
            <div v-if="(details as NightmareDetails).hasPhysicalResponse !== undefined">
                <span class="text-text-secondary">Физическая реакция:</span>
                <span class="text-text-primary ml-1 font-medium">
                    {{ (details as NightmareDetails).hasPhysicalResponse ? 'Да' : 'Нет' }}
                </span>
            </div>
        </template>

        <!-- 3. prophetic -->
        <template v-if="type === 'prophetic'">
            <div v-if="(details as PropheticDetails).isFulfilled !== undefined">
                <span class="text-text-secondary">Статус: </span>
                <span
                    :class="[
                        (details as PropheticDetails).isFulfilled
                            ? 'text-success-text'
                            : 'text-warning-text',
                        'ml-1 font-bold',
                    ]"
                >
                    {{
                        (details as PropheticDetails).isFulfilled ? 'Сбылся' : 'Ожидает исполнения'
                    }}
                </span>
            </div>
            <div v-if="(details as PropheticDetails).expectedByDate">
                <span class="text-text-secondary">{{
                    (details as PropheticDetails).isFulfilled ? 'Ожидался:' : 'Ожидается:'
                }}</span>
                <span class="text-text-primary ml-1 font-medium">
                    <AppSmartTime :date="(details as PropheticDetails).expectedByDate!" />
                </span>
            </div>
            <div v-if="(details as PropheticDetails).fulfilledDate">
                <span class="text-text-secondary">{{
                    (details as PropheticDetails).isFulfilled ? 'Сбылся:' : 'Сбудется:'
                }}</span>
                <span class="text-text-primary ml-1 font-medium">
                    <AppSmartTime :date="(details as PropheticDetails).fulfilledDate!" />
                </span>
            </div>
            <div v-if="(details as PropheticDetails).fulfillmentNotes">
                <span class="text-text-secondary">Что произошло: </span>
                <span class="text-text-primary m-0 mt-0.5 text-xs">
                    {{ (details as PropheticDetails).fulfillmentNotes }}
                </span>
            </div>
        </template>
    </article>
</template>
