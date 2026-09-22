import type { Component } from 'vue';

export type ThemeMode =
    | 'light'
    | 'astronomy'
    | 'hifi'
    | 'nature'
    | 'alchemy'
    | 'pagan'
    | 'astrology'
    | 'cinema'
    | 'cthulhu'
    | 'archive'
    | 'noir'
    | 'clinic'
    | 'temple'
    | 'system';

export interface ThemeOption {
    value: ThemeMode;
    label: string;
    icon: Component;
}
