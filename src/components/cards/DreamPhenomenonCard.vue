<script setup lang="ts">
    import { computed } from 'vue';
    import {
        DREAM_PHENOMENON_MAP,
        DEATH_CAUSE_MAP,
        DEATH_AFTERMATH_MAP,
        FLYING_TYPE_MAP,
        FLYING_ALTITUDE_MAP,
        FALLING_ORIGIN_MAP,
        FALLING_OUTCOME_MAP,
        PARALYSIS_TIMING_MAP,
        PARALYSIS_HALLUCINATIONS_MAP,
    } from '@/constants/Dream';
    import type { DreamPhenomenon, DreamPhenomenaDetails } from '@/types/Dream';

    interface Props {
        type: DreamPhenomenon;
        details: DreamPhenomenaDetails;
        isPressed?: boolean;
        isInFilter?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        isPressed: false,
        isInFilter: false,
    });

    // Уникальные стили для каждого типа феномена
    const cardClasses = computed(() => {
        switch (props.type) {
            case 'death':
                return 'border-danger-border/30 bg-danger-bg/30 text-xs';
            case 'flying':
                return 'border-success-border/30 bg-success-bg/30 text-xs';
            case 'falling':
                return 'border-warning-border/30 bg-warning-bg/30 text-xs';
            case 'paralysis':
                return 'border-mystical-border/30 bg-mystical-bg/30 text-xs';
            case 'nested_dream':
                return 'border-accent/30 bg-accent/5 text-xs';
            default:
                return 'border-border-subtle/30 bg-bg-secondary/30 text-xs';
        }
    });

    const headerClasses = computed(() => {
        switch (props.type) {
            case 'death':
                return 'font-bold text-danger-text flex items-center gap-2 mb-1.5';
            case 'flying':
                return 'font-bold text-success-text flex items-center gap-2 mb-1.5';
            case 'falling':
                return 'font-bold text-warning-text flex items-center gap-2 mb-1.5';
            case 'paralysis':
                return 'font-bold text-mystical-text flex items-center gap-2 mb-1.5';
            case 'nested_dream':
                return 'font-bold text-accent flex items-center gap-2 mb-1.5';
            default:
                return 'font-bold text-text-primary flex items-center gap-2 mb-1.5';
        }
    });

    const phenomenonConfig = computed(() => DREAM_PHENOMENON_MAP[props.type]);
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
        :aria-label="`Феномен: ${phenomenonConfig?.label || type}`"
        :aria-pressed="isPressed"
    >
        <header :class="headerClasses">
            <component :is="phenomenonConfig?.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{{ phenomenonConfig?.label }}</span>
        </header>

        <!-- 1. (death) -->
        <template v-if="type === 'death' && details.death">
            <p v-if="details.death.cause" class="text-text-secondary">
                Причина:
                <span class="text-text-primary ml-1 font-medium">
                    {{ DEATH_CAUSE_MAP[details.death.cause]?.label || details.death.cause }}
                </span>
            </p>
            <p v-if="details.death.aftermath" class="text-text-secondary mt-0.5">
                После смерти:
                <span class="text-text-primary ml-1 font-medium">
                    {{
                        DEATH_AFTERMATH_MAP[details.death.aftermath]?.label ||
                        details.death.aftermath
                    }}
                </span>
            </p>
        </template>

        <!-- 2. (flying) -->
        <template v-if="type === 'flying' && details.flying">
            <p v-if="details.flying.type" class="text-text-secondary">
                Стиль:
                <span class="text-text-primary ml-1 font-medium">
                    {{ FLYING_TYPE_MAP[details.flying.type]?.label || details.flying.type }}
                </span>
            </p>
            <p v-if="details.flying.altitude" class="text-text-secondary mt-0.5">
                Высота:
                <span class="text-text-primary ml-1 font-medium">
                    {{
                        FLYING_ALTITUDE_MAP[details.flying.altitude]?.label ||
                        details.flying.altitude
                    }}
                </span>
            </p>
        </template>

        <!-- 3. (falling) -->
        <template v-if="type === 'falling' && details.falling">
            <p v-if="details.falling.origin" class="text-text-secondary">
                Откуда:
                <span class="text-text-primary ml-1 font-medium">
                    {{
                        FALLING_ORIGIN_MAP[details.falling.origin]?.label || details.falling.origin
                    }}
                </span>
            </p>
            <p v-if="details.falling.outcome" class="text-text-secondary mt-0.5">
                Итог:
                <span class="text-text-primary ml-1 font-medium">
                    {{
                        FALLING_OUTCOME_MAP[details.falling.outcome]?.label ||
                        details.falling.outcome
                    }}
                </span>
            </p>
        </template>

        <!-- 4. (paralysis) -->
        <template v-if="type === 'paralysis' && details.paralysis">
            <p v-if="details.paralysis.timing" class="text-text-secondary">
                Время:
                <span class="text-text-primary ml-1 font-medium">
                    {{
                        PARALYSIS_TIMING_MAP[details.paralysis.timing]?.label ||
                        details.paralysis.timing
                    }}
                </span>
            </p>
            <p v-if="details.paralysis.hallucinations?.length" class="text-text-secondary mt-1">
                Галлюцинации:
                <span class="text-text-primary ml-1 font-medium">
                    {{
                        details.paralysis.hallucinations
                            .map((e) => PARALYSIS_HALLUCINATIONS_MAP[e]?.label || e)
                            .join(', ')
                    }}
                </span>
            </p>
        </template>

        <!-- 5. (nested_dream) -->
        <template v-if="type === 'nested_dream' && details.nestedDream">
            <p class="text-text-secondary">
                Уровней вложенности:
                <span class="text-text-primary ml-1 font-semibold">
                    {{ details.nestedDream.nestingLevels ?? 1 }}
                </span>
            </p>
        </template>
    </article>
</template>
