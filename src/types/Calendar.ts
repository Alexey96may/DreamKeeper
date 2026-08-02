export interface CalendarAttribute {
    key: string;
    dates: Date[];
    dot?: string;
    bar?: string;
    popover?: {
        label: string;
    };
}
