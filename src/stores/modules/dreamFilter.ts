import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useSleepStore } from '@/stores/modules/dream';
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
    isFavorite?: boolean;
    isPinned?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
    isDraft?: boolean;
    isPrivate?: boolean;
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
    | 'emotions';

type BooleanFilterKeys = {
    [K in keyof DreamFilterState]-?: NonNullable<DreamFilterState[K]> extends boolean ? K : never;
}[keyof DreamFilterState];

type NumberFilterKeys = {
    [K in keyof DreamFilterState]-?: NonNullable<DreamFilterState[K]> extends number ? K : never;
}[keyof DreamFilterState];

export const useDreamFilterStore = defineStore('dreamFilter', () => {
    const sleepStore = useSleepStore();

    const filters = ref<DreamFilterState>({
        isActive: false,
        searchQuery: '',
        dateFrom: undefined,
        dateTo: undefined,
        categories: [],
        events: [],
        minLucidControl: undefined,
        maxNightmareFear: undefined,
        propheticFulfilled: undefined,
        minQuality: undefined,
        minClarity: undefined,
        minMoodAfter: undefined,
        timeOfDay: [],
        visualStyle: [],
        perspective: [],
        roles: [],
        sensations: [],
        characters: [],
        locations: [],
        objects: [],
        emotions: [],
        isFavorite: undefined,
        isPinned: undefined,
        isArchived: undefined,
        isDeleted: undefined,
        isDraft: undefined,
        isPrivate: undefined,
    });

    const filteredDreams = computed(() => {
        if (!filters.value.isActive) {
            return sleepStore.sleeps;
        }

        return sleepStore.sleeps.filter((dream) => {
            if (filters.value.searchQuery.trim()) {
                const query = filters.value.searchQuery.trim().toLowerCase();
                const titleMatch = dream.title?.toLowerCase().includes(query) ?? false;
                const descMatch = dream.description?.toLowerCase().includes(query) ?? false;
                const notesMatch = dream.personalNotes?.toLowerCase().includes(query) ?? false;
                if (!titleMatch && !descMatch && !notesMatch) return false;
            }

            if (filters.value.dateFrom && dream.date < filters.value.dateFrom) return false;
            if (filters.value.dateTo && dream.date > filters.value.dateTo) return false;

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

            if (
                filters.value.isFavorite !== undefined &&
                !!dream.isFavorite !== filters.value.isFavorite
            )
                return false;
            if (filters.value.isPinned !== undefined && !!dream.isPinned !== filters.value.isPinned)
                return false;
            if (
                filters.value.isArchived !== undefined &&
                !!dream.isArchived !== filters.value.isArchived
            )
                return false;
            if (
                filters.value.isDeleted !== undefined &&
                !!dream.isDeleted !== filters.value.isDeleted
            )
                return false;
            if (filters.value.isDraft !== undefined && !!dream.isDraft !== filters.value.isDraft)
                return false;
            if (
                filters.value.isPrivate !== undefined &&
                !!dream.isPrivate !== filters.value.isPrivate
            )
                return false;

            return true;
        });
    });

    const matchingCount = computed(() => filteredDreams.value.length);

    // Метод для ручного переключения главного тумблера активности
    const toggleActive = (forceState?: boolean) => {
        filters.value.isActive = forceState ?? !filters.value.isActive;
    };

    const resetFilters = () => {
        filters.value = {
            isActive: false,
            searchQuery: '',
            dateFrom: undefined,
            dateTo: undefined,
            categories: [],
            events: [],
            minLucidControl: undefined,
            maxNightmareFear: undefined,
            propheticFulfilled: undefined,
            minQuality: undefined,
            minClarity: undefined,
            minMoodAfter: undefined,
            timeOfDay: [],
            visualStyle: [],
            perspective: [],
            roles: [],
            sensations: [],
            characters: [],
            locations: [],
            objects: [],
            emotions: [],
            isFavorite: undefined,
            isPinned: undefined,
            isArchived: undefined,
            isDeleted: undefined,
            isDraft: undefined,
            isPrivate: undefined,
        };
    };

    // Автоматически включаем фильтр при любом изменении параметров
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

        filters.value.isActive = true;
        const currentValue = filters.value[id];
        if (currentValue === undefined) {
            filters.value[id] = true as any;
        } else if (currentValue === true) {
            filters.value[id] = false as any;
        } else {
            filters.value[id] = undefined as any;
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
        filteredDreams,
        matchingCount,
        toggleActive,
        resetFilters,
        toggleArrayFilter,
        toggleBooleanFilter,
        toggleNumberFilter,
    };
});
