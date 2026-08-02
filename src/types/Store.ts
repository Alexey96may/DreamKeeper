import type { DreamKeeperDB } from '@/types/databases';

export type StoreName = keyof DreamKeeperDB;
export type StoreType<T extends StoreName> = DreamKeeperDB[T];
