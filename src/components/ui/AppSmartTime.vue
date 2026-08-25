<script setup lang="ts">
    import { computed, ref } from 'vue';

    import { formatDateTime, formatRelativeTime } from '@/utils/formatters';

    const props = defineProps({
        date: {
            type: String as () => string | null | undefined,
            required: true,
            default: null,
        },
        dateFormat: {
            type: String as () => string,
            default: 'do MMMM yyyy HH:mm',
        },
    });

    const showExactDate = ref(false);

    const toggleDate = () => {
        showExactDate.value = !showExactDate.value;
    };

    const computedDateTime = computed(() => formatDateTime(props.date, props.dateFormat));
    const computedRelativeTime = computed(() => formatRelativeTime(props.date));
</script>

<template>
    <Transition name="fade-date" mode="out-in">
        <time
            v-if="date"
            :key="showExactDate.toString()"
            :datetime="date"
            :title="
                showExactDate
                    ? 'Нажмите, чтобы увидеть время назад'
                    : 'Нажмите, чтобы увидеть точную дату'
            "
            @click="toggleDate"
            class="text-text-mute hover:text-text-soft cursor-pointer text-[10px] font-medium transition-colors select-none"
        >
            {{ showExactDate ? computedDateTime : computedRelativeTime }}
        </time>
    </Transition>
</template>

<style scoped>
    .fade-date-enter-active,
    .fade-date-leave-active {
        transition:
            opacity 0.2s ease,
            transform 0.2s ease;
    }

    .fade-date-enter-from {
        opacity: 0;
        transform: translateY(2px);
    }

    .fade-date-leave-to {
        opacity: 0;
        transform: translateY(-2px);
    }
</style>
