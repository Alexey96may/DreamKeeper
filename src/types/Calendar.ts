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
        label: string;
    };
}
