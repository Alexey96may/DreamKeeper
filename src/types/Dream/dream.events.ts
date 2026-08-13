// Особые события во сне
export type DreamPhenomenon =
    | 'irrelevant' // Не имело значения
    | 'death' // Смерть во сне
    | 'flying' // Полёт
    | 'falling' // Падение
    | 'nested_dream' // Ложное пробуждение
    | 'paralysis'; // Сонный паралич

export type ParalysisTiming = 'falling_asleep' | 'waking_up' | 'irrelevant';
export type ParalysisHallucinations = 'auditory' | 'visual' | 'tactile' | 'presence' | 'other';

export interface ParalysisDetails {
    timing?: ParalysisTiming;
    hallucinations?: ParalysisHallucinations[];
}

export interface NestedDreamDetails {
    nestingLevels?: number;
}

export type DeathCause =
    | 'irrelevant'
    | 'fall'
    | 'attack_or_murder'
    | 'disaster'
    | 'execution'
    | 'peaceful'
    | 'natural'
    | 'illness'
    | 'accident'
    | 'other';

export type DeathAftermath =
    | 'irrelevant'
    | 'woke_up' // Мгновенно проснулся (испуг / скачок пульса)
    | 'became_ghost' // Стал призраком / духом (переход в disembodied)
    | 'reincarnated' // Переродился / возродился в новом теле
    | 'black_void' // Попал в темноту / тишину, но продолжал спать
    | 'scene_shift'; // Сюжет просто сменился на другой

export interface DeathDetails {
    /** Причина / контекст смерти */
    cause?: DeathCause;

    /** Что произошло СРАЗУ ПОСЛЕ смерти во сне */
    aftermath?: DeathAftermath;
}

export type FlyingType =
    | 'irrelevant'
    | 'effortless' // Естественный / Легкий (как птица или супергерой)
    | 'swimming' // Гребля руками (как в воде / с давлением)
    | 'apparatus' // С помощью предмета (крылья, ранец, метла, транспорт)
    | 'levitation' // Набор высоты / парение на месте
    | 'uncontrollable'; // Неконтролируемый (уносит ветром / сложно снизиться)

export type FlyingAltitude = 'irrelevant' | 'low' | 'cloud_level' | 'space';

export interface FlyingDetails {
    /** Характер / стиль полёта */
    type?: FlyingType;

    /** Высота полёта */
    altitude?: FlyingAltitude;
}

export type FallingOrigin =
    'irrelevant' | 'building_or_cliff' | 'sky_or_void' | 'abyss' | 'stumbling';

export type FallingOutcome =
    | 'irrelevant'
    | 'hypnic_jerk' // Вздрогнул всей тушкой и проснулся (физический отклик)
    | 'landed_safe' // Мягко приземлился / приземлился без повреждений
    | 'impact' // Удар о землю (с развитием сюжета или переходом в death)
    | 'woke_before_impact' // Проснулся за секунду до удара
    | 'turned_into_flight'; // Падение переросло в полёт (взлетел)

export interface FallingDetails {
    /** Откуда / Контекст падения */
    origin?: FallingOrigin;

    /** Чем закончилось падение */
    outcome?: FallingOutcome;
}

export interface DreamPhenomenaDetails {
    paralysis?: ParalysisDetails;
    nestedDream?: NestedDreamDetails;
    death?: DeathDetails;
    flying?: FlyingDetails;
    falling?: FallingDetails;
}
