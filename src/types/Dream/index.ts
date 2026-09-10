import { type Component } from 'vue';

import type { DreamCategory, DreamCategoryDetails } from './dream.categories';

import type { DreamPhenomenon, DreamPhenomenaDetails } from './dream.events';

import type { VisualStyle, Perspective, ParticipantRole, SensoryAspect } from './dream.styles';

import type { DreamInterpretationRef, RelatedDreamRef } from './dream.relations';

export type {
    DreamCategory,
    DreamCategoryDetails,
    LucidTrigger,
    LucidDetails,
    NightmareDetails,
    PropheticDetails,
} from './dream.categories';

export type {
    DreamPhenomenon,
    ParalysisTiming,
    ParalysisHallucinations,
    ParalysisDetails,
    NestedDreamDetails,
    DeathCause,
    DeathAftermath,
    DeathDetails,
    FlyingType,
    FlyingAltitude,
    FlyingDetails,
    FallingOrigin,
    FallingOutcome,
    FallingDetails,
    DreamPhenomenaDetails,
} from './dream.events';

export type { VisualStyle, Perspective, ParticipantRole, SensoryAspect } from './dream.styles';

export type {
    DreamInterpretationRef,
    DreamRelationType,
    RelatedDreamRef,
    DreamInterpretationRefWithSource,
    EnrichedRelatedDream,
} from './dream.relations';

export type TimeOfDay =
    | 'night' // Ночной (основной ночной сон)
    | 'morning' // Утренний (досыпание / сон под утро)
    | 'day' // Дневной (сиеста / дневной сон / nap)
    | 'evening' // Вечерний
    | 'unknown';

export type AnaliticsIds =
    'characters' | 'locations' | 'objects' | 'emotions' | 'categories' | 'timeOfDay';

export interface DreamElementsObject {
    id: AnaliticsIds;
    title: string;
    tags: string[];
}

export interface Dream {
    // --- Обязательные (MVP) ---
    id: number;
    slug: string;
    date: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;

    categories: DreamCategory[];
    categoryDetails?: DreamCategoryDetails;

    phenomena?: DreamPhenomenon[];
    phenomenaDetails?: DreamPhenomenaDetails;

    // --- Оценки ---
    quality?: number; // Качество сна (1-10)
    clarity?: number; // Яркость/Ясность (1-10)
    moodAfter?: number; // Настроение после (1-10)

    // --- Свойства сна ---
    timeOfDay?: TimeOfDay;
    visualStyle?: VisualStyle; // Визуальный стиль
    perspective?: Perspective; // Точка зрения (1-е / 3-е лицо)
    roles?: ParticipantRole[]; // 👈 Массив ролей (было role?: ParticipantRole)
    sensations?: SensoryAspect[];

    // --- Аналитика (Arrays) ---
    characters?: string[];
    locations?: string[];
    objects?: string[];
    emotions?: string[];

    preSleepContext?: string;
    personalNotes?: string;

    // --- Интерпретация ---
    interpretations?: DreamInterpretationRef[];

    relatedDreams?: RelatedDreamRef[];

    isFavorite?: boolean;
    isPinned?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
    isDraft?: boolean;
    isPrivate?: boolean;

    //На будущее

    //Длительности
    // startTime?: string;
    // endTime?: string;
    // duration?: number;

    // audioUrl?: string; + voiceNote
    // galley?: string[]; + photoNote (AI)
    // isFulfilled + fulfilledDate *Зависимость от категории prophetic!
    // isNSFW?: boolean / containsTriggerWarnings?: boolean — Пометка чувствительного контента (кошмары, эротические сны, насильственные сюжеты).
}

export type DreamWrite = Omit<Dream, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;

export interface DreamOption<T> {
    value: T;
    label: string;
    description?: string;
    icon?: Component;
    isDisabled?: boolean;
}
