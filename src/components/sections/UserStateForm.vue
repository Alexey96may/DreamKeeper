<script setup lang="ts">
    import { reactive, computed } from 'vue';
    import type { UserState, UserStateWrite } from '@/types/UserState';
    import AppRange from '@/components/ui/AppRange.vue';
    import AppTextarea from '@/components/ui/AppTextarea.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFlash } from '@/composables/useFlash';
    import { X } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';
    import { useUserStateStore } from '@/stores/modules/userState';
    import { dreamValueFormatter } from '@/utils/formatters';

    const props = defineProps<{
        date: string;
        initialData?: UserState;
    }>();

    const emit = defineEmits<{
        (e: 'change'): void;
    }>();

    const isEditing = computed(() => !!props.initialData?.id);

    const computedDreamValueFormatter = computed(() => dreamValueFormatter);

    const userStateStore = useUserStateStore();
    const { notifyWithUndo, notify } = useFlash();

    const form = reactive({
        mood: props.initialData?.mood ?? 1,
        energy: props.initialData?.energy ?? 0,
        productivity: props.initialData?.productivity ?? 0,
        stress: props.initialData?.stress ?? 0,
        focus: props.initialData?.focus ?? 0,
        notes: props.initialData?.notes || '',
    });

    const handleSubmit = async () => {
        const payload: UserStateWrite = {
            ...form,
            notes: form.notes || undefined,
            date: props.initialData?.date ? props.initialData?.date : props.date,
        };

        if (isEditing.value && props.initialData?.id) {
            // --- Editing ---
            const targetId = Number(props.initialData.id);
            const updatedDream = await userStateStore.updateState(targetId, payload);

            if (updatedDream) {
                emit('change');
            }
        } else {
            // --- Creating ---
            const createdDream = await userStateStore.addState(payload);

            if (createdDream) {
                emit('change');
            }
        }
    };

    const handleDelete = async (id: number | string) => {
        const numericId = Number(id);
        if (!numericId) return;

        const isTimeOut = await notifyWithUndo('Удалить состояние?', 3000);

        if (isTimeOut) {
            const success = await userStateStore.deleteState(numericId);

            if (success) {
                emit('change');
                notify('Состояние удалено!');
            }
        }
    };
</script>

<template>
    <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
        aria-label="Форма состояния пользователя"
    >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AppRange
                v-model="form.mood"
                label="Настроение"
                :min="1"
                :max="10"
                hint="Оцените ваше эмоциональное состояние."
                :value-formatter="computedDreamValueFormatter"
                :required="true"
                :error-message="userStateStore.validationErrors.mood"
                @input="userStateStore.clearError('mood')"
            />

            <AppRange
                v-model="form.energy"
                label="Энергия"
                :min="0"
                :max="10"
                hint="Уровень физического и ментального тонуса."
                :value-formatter="computedDreamValueFormatter"
                :error-message="userStateStore.validationErrors.energy"
                @input="userStateStore.clearError('energy')"
            />

            <AppRange
                v-model="form.productivity"
                label="Продуктивность"
                :min="0"
                :max="10"
                hint="Насколько результативным был день."
                :value-formatter="computedDreamValueFormatter"
                :error-message="userStateStore.validationErrors.productivity"
                @input="userStateStore.clearError('productivity')"
            />

            <AppRange
                v-model="form.stress"
                label="Уровень стресса"
                :min="0"
                :max="10"
                hint="Степень напряженности или тревожности."
                :value-formatter="computedDreamValueFormatter"
                :error-message="userStateStore.validationErrors.stress"
                @input="userStateStore.clearError('stress')"
            />

            <AppRange
                v-model="form.focus"
                label="Фокус / Концентрация"
                :min="0"
                :max="10"
                hint="Способность удерживать внимание на задачах."
                :value-formatter="computedDreamValueFormatter"
                :error-message="userStateStore.validationErrors.focus"
                @input="userStateStore.clearError('focus')"
            />
        </div>

        <!-- Заметки (AppTextarea) -->
        <AppTextarea
            v-model="form.notes"
            label="Заметки о дне"
            placeholder="Опишите события, мысли или факторы, повлиявшие на состояние..."
            :rows="4"
            :error-message="userStateStore.validationErrors.notes"
            @input="userStateStore.clearError('notes')"
        />

        <AppErrorMessage :error-message="userStateStore.error" />

        <!-- Кнопки управления -->
        <div class="flex items-center justify-end gap-2 pt-2">
            <AppButton @click="emit('change')" variant="ghost">Отмена</AppButton>

            <AppButton
                v-if="initialData"
                @click.stop="handleDelete(initialData.id)"
                size="xs"
                variant="danger"
            >
                <X />
            </AppButton>

            <AppButton size="xs" type="submit" variant="primary" :disabled="userStateStore.loading">
                {{ userStateStore.loading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать' }}
            </AppButton>
        </div>
    </form>
</template>
