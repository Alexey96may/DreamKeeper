import { BaseRepository } from './BaseRepository';
import type { IDataService } from '@/types/databases/DataService';
import type { InterprSource } from '@/types/Interpretation/Source';
import { type InterprSourceWrite } from '@/services/schemas/interpretationSource.schema';

/**
 * Репозиторий для работы со источниками интерпретаций сновидений.
 * Наследуется от BaseRepository
 */
export class InterpretationSourceRepository extends BaseRepository<
    InterprSource,
    InterprSourceWrite
> {
    constructor(dataService: IDataService) {
        super(dataService, 'interprSources');
    }
}
