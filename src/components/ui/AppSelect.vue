<!--
  ПРИМЕР ИСПОЛЬЗОВАНИЯ В РОДИТЕЛЬСКОМ КОМПОНЕНТЕ:
  import AppSelect from '@/components/ui/AppSelect.vue';

  <AppSelect
    id="form-time-of-day"
    v-model="form.timeOfDay"
    label="Время суток"
    :options="timeOfDayOptions"
    placeholder="Выберите время суток"
    :error="errors.timeOfDay"
  />
-->

<script setup lang="ts" generic="T">
    import { ref, computed, onMounted, onUnmounted, nextTick, useId, type Component } from 'vue';
    import { ChevronDown, Check } from 'lucide-vue-next';
    import AppTooltip from '@/components/ui/AppTooltip.vue';
    import AppErrorMessage from '@/components/ui/AppErrorMessage.vue';
    import { useFieldFocus } from '@/composables/useFieldFocus';

    export interface SelectOption<ValueType = string | number> {
        value: ValueType;
        label: string;
        icon?: Component;
        isDisabled?: boolean;
    }

    interface Props {
        id?: string;
        modelValue: T | undefined;
        options: readonly SelectOption<T>[];
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
        placeholder: 'Выберите значение',
        error: '',
        isDisabled: false,
        autoFocusOnError: true,
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: T): void;
        (e: 'change', value: T): void;
        (e: 'clear-error'): void;
    }>();

    const isOpen = ref(false);
    const highlightedIndex = ref(-1);
    const selectContainer = ref<HTMLElement | null>(null);
    const listboxRef = ref<HTMLElement | null>(null);

    // Находим текущую выбранную опцию для отображения
    const selectedOption = computed(() => {
        return props.options.find((opt) => opt.value === props.modelValue);
    });

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
        const currentIndex = props.options.findIndex((opt) => opt.value === props.modelValue);
        highlightedIndex.value = currentIndex >= 0 ? currentIndex : 0;

        nextTick(() => {
            listboxRef.value?.focus();
        });
    };

    const closeListbox = () => {
        isOpen.value = false;
        highlightedIndex.value = -1;
    };

    // Выбор элемента
    const selectOption = (option: SelectOption<T>) => {
        if (option.isDisabled) return;
        emit('update:modelValue', option.value);
        emit('change', option.value);
        emit('clear-error');
        closeListbox();
    };

    // Навигация с клавиатуры
    const handleKeyDown = (event: KeyboardEvent) => {
        if (props.isDisabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (isOpen.value) {
                    if (highlightedIndex.value >= 0 && props.options[highlightedIndex.value]) {
                        selectOption(props.options[highlightedIndex.value]);
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
                    highlightedIndex.value = props.options.length - 1;
                }
                break;
        }
    };

    const highlightNextOption = () => {
        let nextIndex = highlightedIndex.value + 1;
        while (nextIndex < props.options.length && props.options[nextIndex]?.isDisabled) {
            nextIndex++;
        }
        if (nextIndex < props.options.length) {
            highlightedIndex.value = nextIndex;
        }
    };

    const highlightPrevOption = () => {
        let prevIndex = highlightedIndex.value - 1;
        while (prevIndex >= 0 && props.options[prevIndex]?.isDisabled) {
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
        <!-- Label -->
        <label
            v-if="label"
            :id="`${id}-label`"
            :for="id"
            class="text-text-soft mb-1 flex items-center gap-1.5 text-sm font-medium"
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
                <!-- Иконка выбранной опции -->
                <component
                    :is="selectedOption.icon"
                    v-if="selectedOption?.icon"
                    class="text-text-mute h-4 w-4 shrink-0"
                    aria-hidden="true"
                />
                <span>{{ selectedOption ? selectedOption.label : placeholder }}</span>
            </span>

            <ChevronDown
                class="text-text-mute ml-2 h-4 w-4 shrink-0 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
                aria-hidden="true"
            />
        </button>

        <AppErrorMessage :error-message="errorMessage" :error-id="`${id}-error`" />

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
                :aria-labelledby="`${id}-label`"
                class="bg-bg-secondary border-border absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border py-1 shadow-lg focus:outline-none"
                @keydown="handleKeyDown"
            >
                <div
                    v-for="(option, index) in options"
                    :id="`${id}-option-${index}`"
                    :key="String(option.value)"
                    role="option"
                    :aria-selected="option.value === modelValue"
                    :aria-disabled="option.isDisabled"
                    class="flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors"
                    :class="[
                        option.isDisabled
                            ? 'text-text-mute cursor-not-allowed opacity-50'
                            : index === highlightedIndex
                              ? 'bg-accent/10 text-text-primary'
                              : 'text-text-primary hover:bg-accent/5',
                        option.value === modelValue ? 'font-semibold' : 'font-normal',
                    ]"
                    @click="selectOption(option)"
                    @mouseenter="highlightedIndex = index"
                >
                    <span class="flex items-center gap-2 truncate">
                        <component
                            :is="option.icon"
                            v-if="option.icon"
                            class="h-4 w-4 shrink-0 transition-colors"
                            :class="option.value === modelValue ? 'text-accent' : 'text-text-mute'"
                            aria-hidden="true"
                        />
                        <span class="truncate">{{ option.label }}</span>
                    </span>

                    <!-- Галочка активного элемента -->
                    <Check
                        v-if="option.value === modelValue"
                        class="text-accent ml-2 h-4 w-4 shrink-0"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </Transition>
    </div>
</template>
