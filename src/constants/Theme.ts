import type { ThemeOption } from '@/types/Theme';
import { optionsToMap } from './index';
import {
    Sun,
    Telescope,
    Cpu,
    Trees,
    Scroll,
    Compass,
    Wand2,
    Clapperboard,
    Waves,
    Archive as ArchiveIcon,
    Search,
    Activity,
    Landmark,
    Monitor,
} from 'lucide-vue-next';

export const THEME_OPTIONS: ThemeOption[] = [
    { value: 'light', label: 'Светлая', icon: Sun },
    { value: 'astronomy', label: 'Астрономия', icon: Telescope },
    { value: 'hifi', label: 'Hi-Fi', icon: Cpu },
    { value: 'nature', label: 'Природа', icon: Trees },
    { value: 'alchemy', label: 'Алхимия', icon: Scroll },
    { value: 'pagan', label: 'Язычество', icon: Compass },
    { value: 'astrology', label: 'Астрология', icon: Wand2 },
    { value: 'cinema', label: 'Кино', icon: Clapperboard },
    { value: 'cthulhu', label: 'Ктулху', icon: Waves },
    { value: 'archive', label: 'Архив', icon: ArchiveIcon },
    { value: 'noir', label: 'Нуар', icon: Search },
    { value: 'clinic', label: 'Клиника', icon: Activity },
    { value: 'temple', label: 'Храм', icon: Landmark },
    { value: 'system', label: 'Системная', icon: Monitor },
];

export const THEME_OPTIONS_MAP = optionsToMap(THEME_OPTIONS);
