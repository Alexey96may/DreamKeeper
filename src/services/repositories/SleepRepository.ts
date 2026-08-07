import type { Dream } from '@/types/Dream';
import type { IDataService } from '@/types/databases/DataService';

import { BaseRepository } from './BaseRepository';

export class SleepRepository extends BaseRepository<Dream> {
    constructor(dataService: IDataService) {
        super(dataService, 'dreams');
    }
}
