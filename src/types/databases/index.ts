import type { Dream } from '@/types/Dream';
import type { UserState } from '@/types/UserState';
import type { InterprSource } from '@/types/Interpretation/Source';
import type { Interpretation } from '@/types/Interpretation/Interpretation';

export interface DreamKeeperDB {
    dreams: Dream;
    userStates: UserState;
    interprSources: InterprSource;
    dreamInterpretations: Interpretation;
}
