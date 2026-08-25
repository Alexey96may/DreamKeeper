import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import * as locales from 'date-fns/locale';

export const dreamValueFormatter = (val: number, max: number | string) => {
    if (val === 0) return 'Не важно';
    return `${val} / ${max}`;
};

/**
 * Converts a comma-separated string into an array of trimmed strings
 */
export const parseCommaSeparated = (str: string | null | undefined): string[] => {
    if (!str) return [];
    return str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

/**
 * Converts an array of strings into a single comma-separated string
 */
export const formatCommaSeparated = (arr: string[] | null | undefined): string => {
    return (arr ?? []).join(', ');
};

export function formatMoney(value: number | null | undefined): string {
    if (!value) return '0 ₽';

    const rubles = value / 100;

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(rubles);
}

export function formatDistance(value: number | null | undefined): string {
    if (!value) return '0 км';

    const km = value / 1000;

    return (
        new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
        }).format(km) + ' км'
    );
}

export function sanitizeNumber(num: number, numLength: number = 3): string {
    const numToString = String(num);
    const numMinify = numToString.slice(0, numLength);
    const idSanitize = numToString.length <= numLength ? numMinify : numMinify + '..';

    return idSanitize;
}

/**
 * Converts an ISO string to a readable date, taking into account the browser's time zone
 */
export const formatDateTime = (
    dateString: string | null,
    dateFormat: string = 'do MMMM yyyy HH:mm',
): string => {
    if (!dateString) return '';

    const localeCode = 'ru';

    const localesMap: Record<string, Locale> = {
        ru: locales.ru,
        fr: locales.fr,
        en: locales.enUS,
        el: locales.el,
        es: locales.es,
    };

    const selectedLocale = localesMap[localeCode] || locales.ru;

    try {
        const date = parseISO(dateString);

        return format(date, dateFormat, { locale: selectedLocale });
    } catch (error) {
        console.error('Failed to format:', error);
        return dateString;
    }
};

/**
 * Time "back" (e.g. "5 minutes ago")
 */
export const formatRelativeTime = (dateString: string | null): string => {
    if (!dateString) return '';

    try {
        const date = parseISO(dateString);

        const localeCode = 'ru';

        const localesMap: Record<string, Locale> = {
            ru: locales.ru,
            fr: locales.fr,
            en: locales.enUS,
            el: locales.el,
            es: locales.es,
        };

        const selectedLocale = localesMap[localeCode] || locales.ru;

        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: selectedLocale,
        });
    } catch (error) {
        console.error('Failed to format:', error);
        return dateString || '';
    }
};
