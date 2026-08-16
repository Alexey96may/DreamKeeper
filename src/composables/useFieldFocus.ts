import { ref, watch, nextTick, toValue, type MaybeRefOrGetter } from 'vue';

interface UseFieldFocusOptions {
    errorMessage?: MaybeRefOrGetter<string | null | undefined>;
    autoFocusOnError?: MaybeRefOrGetter<boolean>;
    isDisabled?: MaybeRefOrGetter<boolean>;
}

export function useFieldFocus(options: UseFieldFocusOptions = {}) {
    const targetRef = ref<HTMLElement | null>(null);

    const focus = async () => {
        await nextTick();
        if (targetRef.value && typeof targetRef.value.focus === 'function') {
            targetRef.value.focus();
        }
    };

    if (options.errorMessage !== undefined) {
        watch(
            () => toValue(options.errorMessage),
            (newError) => {
                const autoFocus = toValue(options.autoFocusOnError) ?? true;
                const disabled = toValue(options.isDisabled) ?? false;

                if (newError && autoFocus && !disabled) {
                    focus();
                }
            },
            { immediate: true },
        );
    }

    return {
        targetRef,
        focus,
    };
}
