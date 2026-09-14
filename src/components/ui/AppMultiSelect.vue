<!--
  import AppMultiSelect from '@/components/ui/AppMultiSelect.vue';

  <AppMultiSelect
    id="form-tags"
    v-model="form.selectedTags"
    label="Теги сновидения"
    :options="tagOptions"
    placeholder="Выберите теги"
    :error="errors.selectedTags"
  />
-->

<script setup lang="ts" generic="T extends string | number = string">
    import { ref, computed, onMounted, onUnmounted, nextTick, useId } from 'vue';
    import { ChevronDown, Check } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFieldFocus } from '@/composables/useFieldFocus';
    import type { DreamOption } from '@/types/Dream';

    // Опция может быть объектом DreamOption или просто строкой/числом
    type RawOption<T> = DreamOption<T> | T;

    interface Props {
        id?: string;
        modelValue: T[];
        options: readonly RawOption<T>[];
        hint?: string;
        label?: string;
        placeholder?: string;
        errorMessage?: string;
        isDisabled?: boolean;
        autoFocusOnError?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        id: () => useId(),
        label: '',
        placeholder: 'Выберите значения',
        errorMessage: '',
        isDisabled: false,
        autoFocusOnError: true,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: T[]): void;
        (e: 'change', value: T[]): void;
        (e: 'clear-error'): void;
    }>();

    const isOpen = ref(false);
    const highlightedIndex = ref(-1);
    const selectContainer = ref<HTMLElement | null>(null);
    const listboxRef = ref<HTMLElement | null>(null);

    // Нормализуем options: если передана строка, превращаем ее в объект вида { value: item, label: item }
    const normalizedOptions = computed(() => {
        return props.options.map((opt) => {
            if (typeof opt === 'object' && opt !== null && 'value' in opt) {
                return opt as DreamOption<T>;
            }
            return {
                value: opt as T,
                label: String(opt),
                isDisabled: false,
            };
        });
    });

    // Выбранные опции для отображения
    const selectedOptions = computed(() => {
        return normalizedOptions.value.filter((opt) => props.modelValue.includes(opt.value));
    });

    // Текст-заглушка или строка выбранных элементов через запятую
    const displayText = computed(() => {
        if (selectedOptions.value.length === 0) return props.placeholder;
        return selectedOptions.value.map((opt) => opt.label).join(', ');
    });

    // Проверка, выбран ли элемент
    const isSelected = (value: T) => {
        return props.modelValue.includes(value);
    };

    // Открытие / закрытие списка
    const toggleOpen = () => {
        if (props.isDisabled) return;
        if (isOpen.value) {
            closeListbox();
        } else {
            openListbox();
        }
    };

    const openListbox = () => {
        isOpen.value = true;
        highlightedIndex.value = highlightedIndex.value >= 0 ? highlightedIndex.value : 0;

        nextTick(() => {
            listboxRef.value?.focus();
        });
    };

    const closeListbox = () => {
        isOpen.value = false;
        highlightedIndex.value = -1;
    };

    // Переключение выбора элемента
    const toggleOptionSelection = (option: DreamOption<T>) => {
        if (option.isDisabled) return;

        const newValue = [...props.modelValue];
        const index = newValue.indexOf(option.value);

        if (index >= 0) {
            newValue.splice(index, 1);
        } else {
            newValue.push(option.value);
        }

        emit('update:modelValue', newValue);
        emit('change', newValue);
        emit('clear-error');
    };

    // Навигация с клавиатуры
    const handleKeyDown = (event: KeyboardEvent) => {
        if (props.isDisabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (isOpen.value) {
                    if (
                        highlightedIndex.value >= 0 &&
                        normalizedOptions.value[highlightedIndex.value]
                    ) {
                        toggleOptionSelection(normalizedOptions.value[highlightedIndex.value]);
                    }
                } else {
                    openListbox();
                }
                break;

            case 'ArrowDown':
                event.preventDefault();
                if (!isOpen.value) {
                    openListbox();
                } else {
                    highlightNextOption();
                }
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (!isOpen.value) {
                    openListbox();
                } else {
                    highlightPrevOption();
                }
                break;

            case 'Escape':
            case 'Tab':
                if (isOpen.value) {
                    closeListbox();
                }
                break;

            case 'Home':
                if (isOpen.value) {
                    event.preventDefault();
                    highlightedIndex.value = 0;
                }
                break;

            case 'End':
                if (isOpen.value) {
                    event.preventDefault();
                    highlightedIndex.value = normalizedOptions.value.length - 1;
                }
                break;
        }
    };

    const highlightNextOption = () => {
        let nextIndex = highlightedIndex.value + 1;
        while (
            nextIndex < normalizedOptions.value.length &&
            normalizedOptions.value[nextIndex]?.isDisabled
        ) {
            nextIndex++;
        }
        if (nextIndex < normalizedOptions.value.length) {
            highlightedIndex.value = nextIndex;
        }
    };

    const highlightPrevOption = () => {
        let prevIndex = highlightedIndex.value - 1;
        while (prevIndex >= 0 && normalizedOptions.value[prevIndex]?.isDisabled) {
            prevIndex--;
        }
        if (prevIndex >= 0) {
            highlightedIndex.value = prevIndex;
        }
    };

    // Клик снаружи (Click Outside)
    const handleClickOutside = (event: MouseEvent) => {
        if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
            closeListbox();
        }
    };

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    const { targetRef, focus } = useFieldFocus({
        errorMessage: () => props.errorMessage,
        autoFocusOnError: () => props.autoFocusOnError,
        isDisabled: () => props.isDisabled,
    });

    defineExpose({
        focus,
        inputRef: targetRef,
    });
</script>

<template>
    <div ref="selectContainer" class="relative w-full">
        <div class="flex flex-col gap-1.5">
            <!-- Label -->
            <label
                v-if="label"
                :id="`${id}-label`"
                :for="id"
                class="text-text-soft flex items-center text-sm font-medium"
                @click="toggleOpen"
            >
                <AppTooltip v-if="hint" :content="hint" />
                <span>{{ label }}</span>
            </label>

            <!-- Кнопка-триггер выпадающего списка -->
            <button
                :id="id"
                type="button"
                role="combobox"
                ref="targetRef"
                :aria-haspopup="'listbox'"
                :aria-expanded="isOpen"
                :aria-labelledby="label ? `${id}-label ${id}` : id"
                :aria-controls="`${id}-listbox`"
                :aria-invalid="Boolean(errorMessage)"
                :aria-describedby="errorMessage ? `${id}-error` : undefined"
                :aria-activedescendant="
                    isOpen && highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined
                "
                :disabled="isDisabled"
                class="bg-bg-secondary text-text-primary flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-sm transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                :class="[
                    errorMessage
                        ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/50'
                        : 'border-border focus-visible:ring-accent focus-visible:ring-2',
                ]"
                @click="toggleOpen"
                @keydown="handleKeyDown"
            >
                <span class="flex items-center gap-2 truncate">
                    <span
                        class="truncate"
                        :class="{ 'text-text-mute': selectedOptions.length === 0 }"
                    >
                        {{ displayText }}
                    </span>
                </span>

                <ChevronDown
                    class="text-text-mute ml-2 h-4 w-4 shrink-0 transition-transform duration-200"
                    :class="{ 'rotate-180': isOpen }"
                    aria-hidden="true"
                />
            </button>

            <AppErrorMessage :error-message="errorMessage" :error-id="`${id}-error`" />
        </div>

        <!-- Выпадающее меню с анимацией -->
        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-1"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-1"
        >
            <div
                v-if="isOpen"
                :id="`${id}-listbox`"
                ref="listboxRef"
                role="listbox"
                tabindex="-1"
                aria-multiselectable="true"
                :aria-labelledby="`${id}-label`"
                class="bg-bg-secondary border-border absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border py-1 shadow-lg focus:outline-none"
                @keydown="handleKeyDown"
            >
                <div
                    v-for="(option, index) in normalizedOptions"
                    :id="`${id}-option-${index}`"
                    :key="String(option.value)"
                    role="option"
                    :aria-selected="isSelected(option.value)"
                    :aria-disabled="option.isDisabled"
                    class="flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors"
                    :class="[
                        option.isDisabled
                            ? 'text-text-mute cursor-not-allowed opacity-50'
                            : index === highlightedIndex
                              ? 'bg-accent/10 text-text-primary'
                              : 'text-text-primary hover:bg-accent/5',
                        isSelected(option.value) ? 'font-semibold' : 'font-normal',
                    ]"
                    @click="toggleOptionSelection(option)"
                    @mouseenter="highlightedIndex = index"
                >
                    <span class="flex items-center gap-2 truncate">
                        <component
                            :is="option.icon"
                            v-if="option.icon"
                            class="h-4 w-4 shrink-0 transition-colors"
                            :class="isSelected(option.value) ? 'text-accent' : 'text-text-mute'"
                            aria-hidden="true"
                        />
                        <span class="truncate">{{ option.label }}</span>
                    </span>

                    <!-- Галочка активного элемента -->
                    <Check
                        v-if="isSelected(option.value)"
                        class="text-accent ml-2 h-4 w-4 shrink-0"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </Transition>
    </div>
</template>
