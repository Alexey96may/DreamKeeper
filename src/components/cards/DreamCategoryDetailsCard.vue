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

    const props = defineProps<{
        /** Dream category type */
        type: DreamCategory;
        /** Object with details for the selected category */
        details: LucidDetails | NightmareDetails | PropheticDetails;
    }>();

    const cardClasses = computed(() => {
        switch (props.type) {
            case 'nightmare':
                return 'space-y-1.5 rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs';
            case 'prophetic':
                return 'space-y-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs';
            case 'lucid':
            default:
                return 'bg-bg-secondary/30 border-border/30 space-y-1.5 rounded-lg border p-3.5 text-xs';
        }
    });

    const headerClasses = computed(() => {
        switch (props.type) {
            case 'nightmare':
                return 'font-bold text-red-400 flex items-center gap-1.5';
            case 'prophetic':
                return 'font-bold text-indigo-400 flex items-center gap-1.5';
            case 'lucid':
            default:
                return 'text-accent font-bold flex items-center gap-1.5';
        }
    });

    const categoryConfig = computed(() => DREAM_CATEGORY_MAP[props.type]);
</script>

<template>
    <article
        :class="cardClasses"
        :aria-label="`Детали категории: ${categoryConfig?.label || type}`"
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
                <span class="text-text-mute">Уровень контроля:</span>
                <span class="text-text-primary ml-1 font-semibold">
                    {{ (details as LucidDetails).controlLevel }}/10
                </span>
            </div>
            <div v-if="(details as LucidDetails).trigger">
                <span class="text-text-mute">Триггер осознания:</span>
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
                <span class="text-text-mute">Уровень страха:</span>
                <span class="text-text-primary ml-1 font-semibold">
                    {{ (details as NightmareDetails).fearLevel }}/10
                </span>
            </div>
            <div v-if="(details as NightmareDetails).copingMechanism">
                <span class="text-text-mute">Как справился:</span>
                <p class="text-text-primary m-0 mt-0.5">
                    {{ (details as NightmareDetails).copingMechanism }}
                </p>
            </div>
            <div v-if="(details as NightmareDetails).hasPhysicalResponse !== undefined">
                <span class="text-text-mute">Физическая реакция:</span>
                <span class="text-text-primary ml-1 font-medium">
                    {{ (details as NightmareDetails).hasPhysicalResponse ? 'Да' : 'Нет' }}
                </span>
            </div>
        </template>

        <!-- 3. prophetic -->
        <template v-if="type === 'prophetic'">
            <div v-if="(details as PropheticDetails).isFulfilled !== undefined">
                <span class="text-text-mute">Статус:</span>
                <span
                    :class="[
                        (details as PropheticDetails).isFulfilled
                            ? 'text-emerald-400'
                            : 'text-amber-400',
                        'ml-1 font-bold',
                    ]"
                >
                    {{
                        (details as PropheticDetails).isFulfilled ? 'Сбылся' : 'Ожидает исполнения'
                    }}
                </span>
            </div>
            <div v-if="(details as PropheticDetails).expectedByDate">
                <span class="text-text-mute">{{
                    (details as PropheticDetails).isFulfilled ? 'Ожидался:' : 'Ожидается:'
                }}</span>
                <span class="text-text-primary ml-1 font-medium">
                    <AppSmartTime :date="(details as PropheticDetails).expectedByDate!" />
                </span>
            </div>
            <div v-if="(details as PropheticDetails).fulfilledDate">
                <span class="text-text-mute">{{
                    (details as PropheticDetails).isFulfilled ? 'Сбылся:' : 'Сбудется:'
                }}</span>
                <span class="text-text-primary ml-1 font-medium">
                    <AppSmartTime :date="(details as PropheticDetails).fulfilledDate!" />
                </span>
            </div>
            <div v-if="(details as PropheticDetails).fulfillmentNotes">
                <span class="text-text-mute">Что произошло:</span>
                <p class="text-text-primary m-0 mt-0.5">
                    {{ (details as PropheticDetails).fulfillmentNotes }}
                </p>
            </div>
        </template>
    </article>
</template>
