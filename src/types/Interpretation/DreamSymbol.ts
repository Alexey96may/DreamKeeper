export type SymbolCategory =
    | 'character'
    | 'location'
    | 'object'
    | 'action'
    | 'nature'
    | 'animal'
    | 'body'
    | 'place'
    | 'person'
    | 'archetype'
    | 'phenomenon'
    | 'abstract'
    | 'emotion'
    | 'food'
    | 'transport'
    | 'ritual'
    | 'color'
    | 'number';

export interface DreamSymbol {
    tag: string; // Primary Key (уникальный слаг, например: 'voda')
    title: string; // Название на русском (например: 'Вода')
    description?: string; // Опциональное общее описание символа// Название ('Вода')
    category: SymbolCategory;
    createdAt?: string;
    updatedAt?: string;
}
