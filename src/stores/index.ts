// src/store/index.ts
import { createPinia } from 'pinia';

// Экспорты Store
export { useSleepStore } from './modules/dreem';
export { useUserStateStore } from './modules/userState';
export { useUIStore } from './modules/ui';

// Экспорт Pinia
export const pinia = createPinia();
export default pinia;
