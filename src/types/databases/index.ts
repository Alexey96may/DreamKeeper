import type { Dream } from '@/types/Dream';
import type { UserState } from '@/types/UserState';

export interface DreamKeeperDB {
    dreams: Dream;
    userStates: UserState;
}
