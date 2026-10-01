import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useSleepStore } from '@/stores/modules/dream';
import { sanitizeDateString } from '@/utils/date';
import {
    DREAM_CATEGORY_MAP,
    DREAM_PHENOMENON_MAP,
    PERSPECTIVE_MAP,
    SENSORY_ASPECT_MAP,
    PARTICIPANT_ROLE_MAP,
    VISUAL_STYLE_MAP,
    TIME_OF_DAY_MAP,
} from '@/constants/Dream';

import type {
    DreamCategory,
    TimeOfDay,
    VisualStyle,
    Perspective,
    ParticipantRole,
    SensoryAspect,
    DreamPhenomenon,
} from '@/types/Dream';

export interface DreamFilterState {
    isActive: boolean;
    searchQuery: string;
    dateFrom?: string;
    dateTo?: string;
    categories: DreamCategory[];
    events: DreamPhenomenon[];
    minLucidControl?: number;
    maxNightmareFear?: number;
    propheticFulfilled?: boolean;
    minQuality?: number;
    minClarity?: number;
    minMoodAfter?: number;
    timeOfDay: TimeOfDay[];
    visualStyle: VisualStyle[];
    perspective: Perspective[];
    roles: ParticipantRole[];
    sensations: SensoryAspect[];
    characters: string[];
    locations: string[];
    objects: string[];
    emotions: string[];
    authorNames: string[];
    isAlien: boolean;
    isFavorite: boolean;
    isPinned: boolean;
    isArchived: boolean;
    isDeleted: boolean;
    isDraft: boolean;
    isPrivate: boolean;
}

export interface ActiveFilterTag<T = unknown> {
    key: keyof DreamFilterState;
    label: string;
    value?: T;
    subKey?: string;
}

type ArrayFilterKey =
    | 'categories'
    | 'events'
    | 'timeOfDay'
    | 'visualStyle'
    | 'perspective'
    | 'roles'
    | 'sensations'
    | 'characters'
    | 'locations'
    | 'objects'
    | 'emotions'
    | 'authorNames';

type BooleanFilterKeys = {
    [K in keyof DreamFilterState]-?: NonNullable<DreamFilterState[K]> extends boolean ? K : never;
}[keyof DreamFilterState];

type NumberFilterKeys = {
    [K in keyof DreamFilterState]-?: NonNullable<DreamFilterState[K]> extends number ? K : never;
}[keyof DreamFilterState];

const STORAGE_KEY = 'dreamkeeper_filters';

const getDefaultFilters = (): DreamFilterState => ({
    isActive: false,
    searchQuery: '',
    dateFrom: undefined,
    dateTo: undefined,
    propheticFulfilled: undefined,
    minLucidControl: undefined,
    maxNightmareFear: undefined,
    minQuality: undefined,
    minClarity: undefined,
    minMoodAfter: undefined,
    categories: [],
    events: [],
    timeOfDay: [],
    visualStyle: [],
    perspective: [],
    roles: [],
    sensations: [],
    characters: [],
    locations: [],
    objects: [],
    emotions: [],
    authorNames: [],
    isAlien: false,
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    isDraft: false,
    isPrivate: false,
});

const loadFiltersFromStorage = (): DreamFilterState => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return { ...getDefaultFilters(), ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Ошибка чтения фильтров из localStorage:', e);
    }
    return getDefaultFilters();
};

export const useDreamFilterStore = defineStore('dreamFilter', () => {
    const sleepStore = useSleepStore();

    const filters = ref<DreamFilterState>(loadFiltersFromStorage());

    // Проксируем состояние загрузки из sleepStore (или можно завести свой ref, если нужно)
    const loading = computed(() => sleepStore.loading);

    watch(
        filters,
        (newFilters) => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
            } catch (e) {
                console.error('Ошибка сохранения фильтров в localStorage:', e);
            }
        },
        { deep: true },
    );

    const filteredDreams = computed(() => {
        if (!filters.value.isActive) {
            return sleepStore.sleeps;
        }

        return sleepStore.sleeps.filter((dream) => {
            if (filters.value.searchQuery.trim()) {
                const query = filters.value.searchQuery.trim().toLowerCase();
                const titleMatch = dream.title?.toLowerCase().includes(query) ?? false;
                const descMatch = dream.description?.toLowerCase().includes(query) ?? false;
                if (!titleMatch && !descMatch) return false;
            }

            if (
                filters.value.dateFrom &&
                sanitizeDateString(dream.date) < sanitizeDateString(filters.value.dateFrom)
            )
                return false;

            if (
                filters.value.dateTo &&
                sanitizeDateString(dream.date) > sanitizeDateString(filters.value.dateTo)
            )
                return false;

            if (filters.value.categories.length > 0) {
                const hasCategory = filters.value.categories.every((cat) =>
                    dream.categories?.includes(cat),
                );
                if (!hasCategory) return false;
            }

            if (filters.value.events.length > 0) {
                const hasCategory = filters.value.events.every((ev) =>
                    dream.phenomena?.includes(ev),
                );
                if (!hasCategory) return false;
            }

            if (filters.value.minLucidControl !== undefined) {
                const control = dream.categoryDetails?.lucid?.controlLevel ?? 0;
                if (control < filters.value.minLucidControl) return false;
            }
            if (filters.value.maxNightmareFear !== undefined) {
                const fear = dream.categoryDetails?.nightmare?.fearLevel ?? 10;
                if (fear > filters.value.maxNightmareFear) return false;
            }
            if (filters.value.propheticFulfilled !== undefined) {
                const fulfilled = dream.categoryDetails?.prophetic?.isFulfilled ?? false;
                if (fulfilled !== filters.value.propheticFulfilled) return false;
            }

            if (
                filters.value.minQuality !== undefined &&
                (dream.quality ?? 0) < filters.value.minQuality
            )
                return false;
            if (
                filters.value.minClarity !== undefined &&
                (dream.clarity ?? 0) < filters.value.minClarity
            )
                return false;
            if (
                filters.value.minMoodAfter !== undefined &&
                (dream.moodAfter ?? 0) < filters.value.minMoodAfter
            )
                return false;

            if (
                filters.value.timeOfDay.length > 0 &&
                (!dream.timeOfDay || !filters.value.timeOfDay.includes(dream.timeOfDay))
            )
                return false;

            if (
                filters.value.visualStyle.length > 0 &&
                (!dream.visualStyle || !filters.value.visualStyle.includes(dream.visualStyle))
            )
                return false;
            if (
                filters.value.perspective.length > 0 &&
                (!dream.perspective || !filters.value.perspective.includes(dream.perspective))
            )
                return false;

            if (filters.value.roles.length > 0) {
                const hasRole = filters.value.roles.every((r) => dream.roles?.includes(r));
                if (!hasRole) return false;
            }

            if (filters.value.sensations.length > 0) {
                const hasSens = filters.value.sensations.every((s) =>
                    dream.sensations?.includes(s),
                );
                if (!hasSens) return false;
            }

            if (filters.value.characters.length > 0) {
                const hasChar = filters.value.characters.every((c) =>
                    dream.characters?.includes(c),
                );
                if (!hasChar) return false;
            }
            if (filters.value.locations.length > 0) {
                const hasLoc = filters.value.locations.every((l) => dream.locations?.includes(l));
                if (!hasLoc) return false;
            }
            if (filters.value.objects.length > 0) {
                const hasObj = filters.value.objects.every((o) => dream.objects?.includes(o));
                if (!hasObj) return false;
            }
            if (filters.value.emotions.length > 0) {
                const hasEmo = filters.value.emotions.every((e) => dream.emotions?.includes(e));
                if (!hasEmo) return false;
            }
            if (filters.value.authorNames.length > 0 && filters.value.isAlien) {
                const hasName = filters.value.authorNames.some((e) => {
                    return dream.authorName?.trim().toLocaleLowerCase() === e.toLocaleLowerCase();
                });
                if (!hasName) return false;
            }

            if (filters.value.isAlien && !!dream.isAlien !== filters.value.isAlien) return false;
            if (filters.value.isFavorite && !!dream.isFavorite !== filters.value.isFavorite)
                return false;
            if (filters.value.isPinned && !!dream.isPinned !== filters.value.isPinned) return false;
            if (filters.value.isArchived && !!dream.isArchived !== filters.value.isArchived)
                return false;
            if (filters.value.isDeleted && !!dream.isDeleted !== filters.value.isDeleted)
                return false;
            if (filters.value.isDraft && !!dream.isDraft !== filters.value.isDraft) return false;
            if (filters.value.isPrivate && !!dream.isPrivate !== filters.value.isPrivate)
                return false;

            return true;
        });
    });

    const matchingCount = computed(() => filteredDreams.value.length);

    const activeFilterTags = computed<ActiveFilterTag[]>(() => {
        if (!filters.value.isActive) return [];

        const tags: ActiveFilterTag[] = [];

        if (filters.value.searchQuery.trim()) {
            tags.push({
                key: 'searchQuery',
                label: `Поиск: «${filters.value.searchQuery.trim()}»`,
            });
        }

        if (filters.value.dateFrom) {
            tags.push({
                key: 'dateFrom',
                label: `От: ${filters.value.dateFrom}`,
            });
        }
        if (filters.value.dateTo) {
            tags.push({
                key: 'dateTo',
                label: `До: ${filters.value.dateTo}`,
            });
        }

        if (filters.value.minLucidControl !== undefined) {
            tags.push({
                key: 'minLucidControl',
                label: `Осознанность от ${filters.value.minLucidControl}`,
            });
        }
        if (filters.value.maxNightmareFear !== undefined) {
            tags.push({
                key: 'maxNightmareFear',
                label: `Страх до ${filters.value.maxNightmareFear}`,
            });
        }
        if (filters.value.propheticFulfilled !== undefined) {
            tags.push({
                key: 'propheticFulfilled',
                label: filters.value.propheticFulfilled ? 'Вещий (сбылся)' : 'Вещий (не сбылся)',
            });
        }
        if (filters.value.minQuality !== undefined) {
            tags.push({ key: 'minQuality', label: `Качество сна ≥ ${filters.value.minQuality}` });
        }
        if (filters.value.minClarity !== undefined) {
            tags.push({ key: 'minClarity', label: `Четкость ≥ ${filters.value.minClarity}` });
        }
        if (filters.value.minMoodAfter !== undefined) {
            tags.push({
                key: 'minMoodAfter',
                label: `Настроение после ≥ ${filters.value.minMoodAfter}`,
            });
        }

        const arrayLabels: Record<ArrayFilterKey, string> = {
            categories: 'Категория',
            events: 'Феномен',
            timeOfDay: 'Время суток',
            visualStyle: 'Стиль',
            perspective: 'Перспектива',
            roles: 'Роль',
            sensations: 'Ощущение',
            characters: 'Персонаж',
            locations: 'Место',
            objects: 'Объект',
            emotions: 'Эмоция',
            authorNames: 'Автор',
        };

        const mapsRecord: Partial<Record<ArrayFilterKey, Record<string, { label: string }>>> = {
            categories: DREAM_CATEGORY_MAP,
            events: DREAM_PHENOMENON_MAP,
            timeOfDay: TIME_OF_DAY_MAP,
            visualStyle: VISUAL_STYLE_MAP,
            perspective: PERSPECTIVE_MAP,
            roles: PARTICIPANT_ROLE_MAP,
            sensations: SENSORY_ASPECT_MAP,
        };

        (Object.keys(arrayLabels) as ArrayFilterKey[]).forEach((key) => {
            const items = filters.value[key] as string[];
            const mapObj = mapsRecord[key];

            items.forEach((item) => {
                const humanLabel = mapObj && mapObj[item]?.label ? mapObj[item].label : item;

                if (!(key === 'authorNames' && !filters.value.isAlien)) {
                    tags.push({
                        key,
                        subKey: item,
                        label: `${arrayLabels[key]}: ${humanLabel}`,
                    });
                }
            });
        });

        if (filters.value.isAlien) tags.push({ key: 'isAlien', label: 'Чужой сон' });
        if (filters.value.isFavorite) tags.push({ key: 'isFavorite', label: 'Избранные' });
        if (filters.value.isPinned) tags.push({ key: 'isPinned', label: 'Закрепленные' });
        if (filters.value.isArchived) tags.push({ key: 'isArchived', label: 'В архиве' });
        if (filters.value.isDraft) tags.push({ key: 'isDraft', label: 'Черновики' });
        if (filters.value.isPrivate) tags.push({ key: 'isPrivate', label: 'Личные' });

        return tags;
    });

    const removeFilterTag = (tag: ActiveFilterTag) => {
        const { key, subKey } = tag;

        const arrayKeys: Array<ArrayFilterKey> = [
            'categories',
            'events',
            'timeOfDay',
            'visualStyle',
            'perspective',
            'roles',
            'sensations',
            'characters',
            'locations',
            'objects',
            'emotions',
            'authorNames',
        ];

        if (subKey !== undefined && (arrayKeys as string[]).includes(key)) {
            const targetArray = filters.value[key as ArrayFilterKey] as string[];
            const index = targetArray.indexOf(subKey);
            if (index > -1) {
                targetArray.splice(index, 1);
            }
            return;
        }

        switch (key) {
            case 'searchQuery':
                filters.value.searchQuery = '';
                break;
            case 'dateFrom':
                filters.value.dateFrom = undefined;
                break;
            case 'dateTo':
                filters.value.dateTo = undefined;
                break;
            case 'minLucidControl':
                filters.value.minLucidControl = undefined;
                break;
            case 'maxNightmareFear':
                filters.value.maxNightmareFear = undefined;
                break;
            case 'propheticFulfilled':
                filters.value.propheticFulfilled = undefined;
                break;
            case 'minQuality':
                filters.value.minQuality = undefined;
                break;
            case 'minClarity':
                filters.value.minClarity = undefined;
                break;
            case 'minMoodAfter':
                filters.value.minMoodAfter = undefined;
                break;
            case 'isAlien':
                filters.value.isAlien = false;
                filters.value.authorNames = [];
                break;
            case 'isFavorite':
                filters.value.isFavorite = false;
                break;
            case 'isPinned':
                filters.value.isPinned = false;
                break;
            case 'isArchived':
                filters.value.isArchived = false;
                break;
            case 'isDeleted':
                filters.value.isDeleted = false;
                break;
            case 'isDraft':
                filters.value.isDraft = false;
                break;
            case 'isPrivate':
                filters.value.isPrivate = false;
                break;
            case 'categories':
            case 'events':
            case 'timeOfDay':
            case 'visualStyle':
            case 'perspective':
            case 'roles':
            case 'sensations':
            case 'characters':
            case 'locations':
            case 'objects':
            case 'emotions':
            case 'authorNames':
                filters.value[key] = [];
                break;
        }
    };

    const toggleActive = (forceState?: boolean) => {
        filters.value.isActive = forceState ?? !filters.value.isActive;
    };

    const resetFilters = () => {
        filters.value = getDefaultFilters();
        localStorage.removeItem(STORAGE_KEY);
    };

    const toggleArrayFilter = (id: ArrayFilterKey, value: string) => {
        if (!filters.value.isActive) return;

        filters.value.isActive = true;
        const targetArray = filters.value[id] as string[];
        const index = targetArray.indexOf(value);

        if (index > -1) {
            targetArray.splice(index, 1);
        } else {
            targetArray.push(value);
        }
    };

    const toggleBooleanFilter = (id: BooleanFilterKeys) => {
        if (!filters.value.isActive) return;

        const currentValue = filters.value[id];
        if (currentValue === undefined || currentValue === false) {
            filters.value[id] = true;
        } else {
            filters.value[id] = false;
        }
    };

    const toggleNumberFilter = (id: NumberFilterKeys, value: number) => {
        if (!filters.value.isActive) return;

        filters.value.isActive = true;
        const currentValue = filters.value[id];
        if (typeof currentValue === 'number') {
            filters.value.isActive = true;
            filters.value[id] = currentValue === value ? undefined : value;
        } else {
            filters.value[id] = value;
        }
    };

    return {
        filters,
        loading,
        filteredDreams,
        matchingCount,
        activeFilterTags,
        toggleActive,
        resetFilters,
        removeFilterTag,
        toggleArrayFilter,
        toggleBooleanFilter,
        toggleNumberFilter,
    };
});
