import type { Dream } from '@/types/Dream';
import type { UserState } from '@/types/UserState';
import type { InterprSource } from '@/types/Interpretation/Source';
import type { Interpretation } from '@/types/Interpretation/Interpretation';
import type { DreamSymbol } from '@/types/Interpretation/DreamSymbol';
import type { DreamAspect } from '@/types/Interpretation/DreamAspect';

export interface DreamKeeperDB {
    dreams: Dream;
    userStates: UserState;
    interprSources: InterprSource;
    dreamInterpretations: Interpretation;
    dream_symbols: DreamSymbol;
    dream_aspects: DreamAspect;
}
