import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportUserData, importUserData } from '@/composables/useExportImportDB';
import { useSleepStore } from '@/stores/modules/dream';
import { useUserStateStore } from '@/stores/modules/userState';
import { useUIStore } from '@/stores/modules/ui';
import type { Dream } from '@/types/Dream';
import type { UserState } from '@/types/UserState';

vi.mock('@/stores/modules/dream', () => ({
    useSleepStore: vi.fn(),
}));

vi.mock('@/stores/modules/userState', () => ({
    useUserStateStore: vi.fn(),
}));

vi.mock('@/stores/modules/ui', () => ({
    useUIStore: vi.fn(),
}));

interface MockSleepStore {
    sleeps: Dream[];
    importDreams: ReturnType<typeof vi.fn>;
}

interface MockUserStateStore {
    states: UserState[];
    importStates: ReturnType<typeof vi.fn>;
}

interface MockUIStore {
    addToast: ReturnType<typeof vi.fn>;
}

interface MockProgressEvent {
    readonly target: {
        readonly result: string | ArrayBuffer | null;
    } | null;
}

describe('Backup Service', () => {
    let mockSleepStore: MockSleepStore;
    let mockStateStore: MockUserStateStore;
    let mockUiStore: MockUIStore;

    beforeEach(() => {
        vi.clearAllMocks();

        mockSleepStore = {
            sleeps: [{ id: 1, title: 'Lucid dream' }] as unknown as Dream[],
            importDreams: vi.fn().mockResolvedValue(undefined),
        };

        mockStateStore = {
            states: [{ id: 1, mood: 8 }] as unknown as UserState[],
            importStates: vi.fn().mockResolvedValue(undefined),
        };

        mockUiStore = {
            addToast: vi.fn(),
        };

        vi.mocked(useSleepStore).mockReturnValue(
            mockSleepStore as unknown as ReturnType<typeof useSleepStore>,
        );
        vi.mocked(useUserStateStore).mockReturnValue(
            mockStateStore as unknown as ReturnType<typeof useUserStateStore>,
        );
        vi.mocked(useUIStore).mockReturnValue(
            mockUiStore as unknown as ReturnType<typeof useUIStore>,
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('exportUserData', () => {
        it('should create a download link and trigger click', () => {
            const createElementSpy = vi.spyOn(document, 'createElement');
            const appendChildSpy = vi
                .spyOn(document.body, 'appendChild')
                .mockImplementation((node: Node): Node => node);
            const removeSpy = vi.spyOn(Element.prototype, 'remove').mockImplementation(() => {});

            const clickSpy = vi.fn();
            createElementSpy.mockReturnValueOnce({
                setAttribute: vi.fn(),
                click: clickSpy,
                remove: removeSpy,
            } as unknown as HTMLAnchorElement);

            exportUserData();

            expect(createElementSpy).toHaveBeenCalledWith('a');
            expect(appendChildSpy).toHaveBeenCalled();
            expect(clickSpy).toHaveBeenCalled();
            expect(removeSpy).toHaveBeenCalled();
        });
    });

    describe('importUserData', () => {
        it('should successfully parse and import valid backup JSON', async () => {
            const backupData = {
                version: 1,
                sleeps: [{ id: 2, title: 'Nightmare' }],
                states: [{ id: 2, mood: 5 }],
            };

            const file = new File([JSON.stringify(backupData)], 'backup.json', {
                type: 'application/json',
            });
            const event = {
                target: { files: [file], value: 'fakepath' },
            } as unknown as Event;

            class MockFileReader {
                result: string = '';
                onload: ((e: MockProgressEvent) => void) | null = null;
                readAsText() {
                    this.result = JSON.stringify(backupData);
                    if (this.onload) {
                        this.onload({
                            target: { result: this.result },
                        });
                    }
                }
            }
            vi.stubGlobal('FileReader', MockFileReader);

            await importUserData(event, 'merge');

            // Ожидаем завершения асинхронного обработчика onload через vi.waitFor
            await vi.waitFor(() => {
                expect(mockSleepStore.importDreams).toHaveBeenCalledWith(
                    backupData.sleeps,
                    'merge',
                );
            });

            expect(mockStateStore.importStates).toHaveBeenCalledWith(backupData.states, 'merge');
            expect(mockUiStore.addToast).toHaveBeenCalledWith({
                message: 'Данные успешно импортированы!',
                type: 'success',
            });
        });

        it('should reject backup with higher version', async () => {
            const backupData = {
                version: 99,
                sleeps: [],
                states: [],
            };

            const file = new File([JSON.stringify(backupData)], 'backup.json', {
                type: 'application/json',
            });
            const event = {
                target: { files: [file], value: 'fakepath' },
            } as unknown as Event;

            class MockFileReader {
                onload: ((e: MockProgressEvent) => void) | null = null;
                readAsText() {
                    if (this.onload) {
                        this.onload({
                            target: { result: JSON.stringify(backupData) },
                        });
                    }
                }
            }
            vi.stubGlobal('FileReader', MockFileReader);

            await importUserData(event, 'merge');

            expect(mockSleepStore.importDreams).not.toHaveBeenCalled();
            expect(mockStateStore.importStates).not.toHaveBeenCalled();
            expect(mockUiStore.addToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'error',
                    message: expect.stringContaining('более новой версии'),
                }),
            );
        });

        it('should handle invalid JSON gracefully', async () => {
            const file = new File(['invalid json content'], 'backup.json', {
                type: 'application/json',
            });
            const event = {
                target: { files: [file], value: 'fakepath' },
            } as unknown as Event;

            class MockFileReader {
                onload: ((e: MockProgressEvent) => void) | null = null;
                readAsText() {
                    if (this.onload) {
                        this.onload({
                            target: { result: 'invalid json content' },
                        });
                    }
                }
            }
            vi.stubGlobal('FileReader', MockFileReader);

            await importUserData(event, 'replace');

            expect(mockUiStore.addToast).toHaveBeenCalledWith({
                message: 'Не удалось импортировать файл. Неверный формат JSON.',
                type: 'error',
            });
        });

        it('should do nothing if no file selected', async () => {
            const event = {
                target: { files: [], value: '' },
            } as unknown as Event;

            await importUserData(event);

            expect(mockUiStore.addToast).not.toHaveBeenCalled();
            expect(mockSleepStore.importDreams).not.toHaveBeenCalled();
        });
    });
});
