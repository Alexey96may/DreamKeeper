export interface OptionWithKey<K extends PropertyKey> {
    value: K;
}

export function optionsToMap<K extends PropertyKey, T extends OptionWithKey<K>>(
    options: readonly T[],
): Record<K, T> {
    return Object.fromEntries(options.map((option) => [option.value, option])) as Record<K, T>;
}
