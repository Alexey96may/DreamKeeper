import type { ThemeOption } from '@/types/Theme';
import { optionsToMap } from './index';
import {
    Sun,
    Moon,
    Sparkles,
    Scroll,
    Zap,
    Flame,
    Gem,
    Trees,
    Wand2,
    Compass,
    Monitor,
} from 'lucide-vue-next';

export const THEME_OPTIONS: ThemeOption[] = [
    { value: 'light', label: 'Светлая', icon: Sun },
    { value: 'dark', label: 'Тёмная', icon: Moon },
    { value: 'night', label: 'Ночная', icon: Sparkles },
    { value: 'sepia', label: 'Сепия', icon: Scroll },
    { value: 'neon', label: 'Неон', icon: Zap },
    { value: 'dracula', label: 'Дракула', icon: Flame },
    { value: 'emerald', label: 'Изумруд', icon: Gem },
    { value: 'forest', label: 'Лес', icon: Trees },
    { value: 'mystic', label: 'Мистическая', icon: Wand2 },
    { value: 'nord', label: 'Север', icon: Compass },
    { value: 'system', label: 'Системная', icon: Monitor },
];

export const THEME_OPTIONS_MAP = optionsToMap(THEME_OPTIONS);
