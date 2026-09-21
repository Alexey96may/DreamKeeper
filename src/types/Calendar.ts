import type { Dream } from '@/types/Dream';

export interface CalendarDay {
    date: Date;
    ariaLabel: string;
    isToday: boolean;
    day: number;
    month: number;
    year: number;
    inMonth: boolean;
    inPrevMonth: boolean;
    inNextMonth: boolean;
    isDisabled: boolean;
}

export interface Highlight {
    fillMode: 'outline' | 'solid' | 'light' | 'outline';
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
}

export interface CalendarAttribute {
    key: string;
    dates: Date[];
    dot?: string;
    highlight?: boolean | string | Highlight;
    bar?: string;
    popover?: {
        label?: string;
        visibility?: 'click' | 'hover' | 'hover-focus' | 'focus';
    };
    customData?: {
        type?: string;
        mood?: number;
        totalCount?: number;
        dreams?: Dream[];
        hiddenCount?: number;
        hasOverflow?: boolean;
    };
}
