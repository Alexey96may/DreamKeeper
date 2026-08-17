<template>
    <div class="border-border bg-bg-primary rounded-xl border p-4 sm:p-6">
        <div class="flex flex-wrap gap-2">
            <AppTag
                :is-pressed="props.isPinned"
                :icon="Pin"
                @click="onFieldChange('isPinned', !props.isPinned)"
            >
                {{ props.isPinned ? 'Закреплен' : 'Закрепить' }}
            </AppTag>

            <AppTag
                :is-pressed="props.isFavorite"
                :icon="Bookmark"
                @click="onFieldChange('isFavorite', !props.isFavorite)"
            >
                {{ props.isFavorite ? 'В избранном' : 'В избранное' }}
            </AppTag>

            <AppTag
                :is-pressed="props.isDraft"
                :icon="props.isDraft ? FileText : CheckCircle2"
                @click="onFieldChange('isDraft', !props.isDraft)"
            >
                {{ props.isDraft ? 'Черновик' : 'Опубликован' }}
            </AppTag>

            <AppTag
                :is-pressed="props.isArchived"
                :icon="Archive"
                @click="onFieldChange('isArchived', !props.isArchived)"
            >
                {{ props.isArchived ? 'В архиве' : 'Архивировать' }}
            </AppTag>

            <AppTag
                :is-pressed="props.isPrivate"
                :icon="props.isPrivate ? Lock : Globe"
                @click="onFieldChange('isPrivate', !props.isPrivate)"
            >
                {{ props.isPrivate ? 'Приватный' : 'Публичный' }}
            </AppTag>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Pin, Bookmark, Lock, Globe, FileText, CheckCircle2, Archive } from 'lucide-vue-next';
    import AppTag from '@/components/ui/AppTag.vue';

    interface Props {
        isPinned?: boolean;
        isFavorite?: boolean;
        isDraft?: boolean;
        isArchived?: boolean;
        isPrivate?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        isPinned: false,
        isFavorite: false,
        isDraft: false,
        isArchived: false,

        isPrivate: true,
    });

    type FieldKey = 'isPinned' | 'isFavorite' | 'isDraft' | 'isArchived' | 'isPrivate';

    const emit = defineEmits<{
        'update:isPinned': [value: boolean];
        'update:isFavorite': [value: boolean];
        'update:isDraft': [value: boolean];
        'update:isArchived': [value: boolean];
        'update:isPrivate': [value: boolean];
    }>();

    const onFieldChange = (field: FieldKey, val: boolean) => {
        switch (field) {
            case 'isPinned':
                emit('update:isPinned', val);
                break;
            case 'isFavorite':
                emit('update:isFavorite', val);
                break;
            case 'isDraft':
                emit('update:isDraft', val);
                break;
            case 'isArchived':
                emit('update:isArchived', val);
                break;
            case 'isPrivate':
                emit('update:isPrivate', val);
                break;
        }
    };
</script>
