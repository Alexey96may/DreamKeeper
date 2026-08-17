<template>
    <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AppTextInput
                :model-value="rawArrays.characters"
                @update:model-value="onFieldChange('characters', $event)"
                label="Персонажи (через запятую)"
                placeholder="Друг, Незнакомец в маске..."
            />

            <AppTextInput
                :model-value="rawArrays.locations"
                @update:model-value="onFieldChange('locations', $event)"
                label="Локации (через запятую)"
                placeholder="Старый дом, Космодром..."
            />

            <AppTextInput
                :model-value="rawArrays.objects"
                @update:model-value="onFieldChange('objects', $event)"
                label="Предметы (через запятую)"
                placeholder="Ключ, Старинная книга..."
            />

            <AppTextInput
                :model-value="rawArrays.emotions"
                @update:model-value="onFieldChange('emotions', $event)"
                label="Эмоции (через запятую)"
                placeholder="Страх, Удивление, Восторг..."
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import { parseCommaSeparated, formatCommaSeparated } from '@/utils/formatters';
    import type { Dream } from '@/types/Dream';

    type ArrayFieldKey = 'characters' | 'locations' | 'objects' | 'emotions';
    type RawArrayFields = Record<ArrayFieldKey, string>;

    interface Props {
        characters?: Dream['characters'];
        locations?: Dream['locations'];
        objects?: Dream['objects'];
        emotions?: Dream['emotions'];
    }

    const props = withDefaults(defineProps<Props>(), {
        characters: () => [],
        locations: () => [],
        objects: () => [],
        emotions: () => [],
    });

    const emit = defineEmits<{
        'update:characters': [value: Dream['characters']];
        'update:locations': [value: Dream['locations']];
        'update:objects': [value: Dream['objects']];
        'update:emotions': [value: Dream['emotions']];
    }>();

    const rawArrays = ref<RawArrayFields>({
        characters: '',
        locations: '',
        objects: '',
        emotions: '',
    });

    watch(
        () => [props.characters, props.locations, props.objects, props.emotions],
        () => {
            rawArrays.value = {
                characters: formatCommaSeparated(props.characters),
                locations: formatCommaSeparated(props.locations),
                objects: formatCommaSeparated(props.objects),
                emotions: formatCommaSeparated(props.emotions),
            };
        },
    );

    const onFieldChange = (field: ArrayFieldKey, val: string) => {
        rawArrays.value[field] = val;
        const parsed = parseCommaSeparated(val);

        switch (field) {
            case 'characters':
                emit('update:characters', parsed);
                break;
            case 'locations':
                emit('update:locations', parsed);
                break;
            case 'objects':
                emit('update:objects', parsed);
                break;
            case 'emotions':
                emit('update:emotions', parsed);
                break;
        }
    };
</script>
