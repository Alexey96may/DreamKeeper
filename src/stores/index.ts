// src/store/index.ts
import { createPinia } from 'pinia';

export { useSleepStore } from './modules/dream';
export { useUserStateStore } from './modules/userState';
export { useUIStore } from './modules/ui';
export { useDreamFilterStore } from './modules/dreamFilter';

export const pinia = createPinia();
export default pinia;
