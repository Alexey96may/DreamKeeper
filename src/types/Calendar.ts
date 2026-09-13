export interface CalendarAttribute {
    key: string;
    dates: Date[];
    dot?: string;
    highlight?: string;
    bar?: string;
    popover?: {
        label: string;
    };
}
