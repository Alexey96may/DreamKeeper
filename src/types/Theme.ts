import type { Component } from 'vue';

export type ThemeMode =
    | 'light'
    | 'dark'
    | 'night'
    | 'sepia'
    | 'neon'
    | 'nord'
    | 'dracula'
    | 'forest'
    | 'emerald'
    | 'mystic'
    | 'system';

export interface ThemeOption {
    value: ThemeMode;
    label: string;
    icon: Component;
}
