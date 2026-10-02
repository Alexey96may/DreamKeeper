import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ShareDreamModal from '@/components/ui/ShareDreamModal.vue';
import type { Dream } from '@/types/Dream';

const writeTextMock = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: writeTextMock,
    },
    configurable: true,
});

describe('ShareDreamModal.vue', () => {
    const mockDream: Partial<Dream> = {
        id: 123,
        title: 'Flying over mountains',
        description: 'It was a wonderful dream...',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        authorName: 'Алексей',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Rendering & Props', () => {
        it('renders correctly when modelValue is true', () => {
            const wrapper = mount(ShareDreamModal, {
                props: {
                    dream: mockDream as unknown as Dream,
                    modelValue: true,
                },
                global: {
                    stubs: {
                        AppModal: {
                            template:
                                '<div class="app-modal-stub"><slot /><slot name="footer" /></div>',
                        },
                    },
                },
            });

            expect(wrapper.find('input#sharedAuthorName').exists()).toBe(true);
            expect((wrapper.find('input#sharedAuthorName').element as HTMLInputElement).value).toBe(
                'Алексей',
            );
            expect(wrapper.find('input#shareLink').exists()).toBe(true);
        });

        it('emits update:modelValue with false when close button is clicked', async () => {
            const wrapper = mount(ShareDreamModal, {
                props: {
                    dream: mockDream as unknown as Dream,
                    modelValue: true,
                },
                global: {
                    stubs: {
                        AppModal: {
                            template: '<div><slot /><slot name="footer" /></div>',
                        },
                    },
                },
            });

            const buttons = wrapper.findAllComponents({ name: 'AppButton' });
            const closeButton = buttons.find((btn) => btn.text().includes('Закрыть'));

            expect(closeButton?.exists()).toBe(true);
            await closeButton?.trigger('click');

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        });
    });

    describe('Share Link Generation', () => {
        it('generates a share link containing base64 encoded dream data without sensitive fields (id, dates)', async () => {
            const wrapper = mount(ShareDreamModal, {
                props: {
                    dream: mockDream as unknown as Dream,
                    modelValue: true,
                },
                global: {
                    stubs: {
                        AppModal: {
                            template: '<div><slot /><slot name="footer" /></div>',
                        },
                    },
                },
            });

            const linkInput = wrapper.find('input#shareLink').element as HTMLInputElement;
            const linkValue = linkInput.value;

            expect(linkValue).toContain('/dream/share/import#data=');

            const base64Part = linkValue.split('#data=')[1];
            const jsonString = decodeURIComponent(
                Array.prototype.map
                    .call(
                        atob(base64Part),
                        (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
                    )
                    .join(''),
            );
            const decodedData = JSON.parse(jsonString);

            expect(decodedData.id).toBeUndefined();
            expect(decodedData.createdAt).toBeUndefined();
            expect(decodedData.updatedAt).toBeUndefined();
            expect(decodedData.title).toBe('Flying over mountains');
            expect(decodedData.authorName).toBe('Алексей');
            expect(decodedData.isAlien).toBe(true);
        });

        it('updates share link dynamically when authorName input changes', async () => {
            const wrapper = mount(ShareDreamModal, {
                props: {
                    dream: mockDream as unknown as Dream,
                    modelValue: true,
                },
                global: {
                    stubs: {
                        AppModal: {
                            template: '<div><slot /><slot name="footer" /></div>',
                        },
                    },
                },
            });

            const authorInput = wrapper.find('input#sharedAuthorName');
            await authorInput.setValue('New Author');

            const linkInput = wrapper.find('input#shareLink').element as HTMLInputElement;
            const base64Part = linkInput.value.split('#data=')[1];
            const jsonString = decodeURIComponent(
                Array.prototype.map
                    .call(
                        atob(base64Part),
                        (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
                    )
                    .join(''),
            );
            const decodedData = JSON.parse(jsonString);

            expect(decodedData.authorName).toBe('New Author');
        });
    });

    describe('Clipboard Interaction', () => {
        it('copies share link to clipboard and toggles copied state', async () => {
            const wrapper = mount(ShareDreamModal, {
                props: {
                    dream: mockDream as unknown as Dream,
                    modelValue: true,
                },
                global: {
                    stubs: {
                        AppModal: {
                            template: '<div><slot /><slot name="footer" /></div>',
                        },
                    },
                },
            });

            const linkInput = wrapper.find('input#shareLink').element as HTMLInputElement;
            const expectedLink = linkInput.value;

            const buttons = wrapper.findAllComponents({ name: 'AppButton' });
            const copyButton = buttons.find((btn) => btn.text().includes('Копировать'));

            expect(copyButton?.exists()).toBe(true);

            await copyButton?.trigger('click');

            expect(writeTextMock).toHaveBeenCalledTimes(1);
            expect(writeTextMock).toHaveBeenCalledWith(expectedLink);
            expect(copyButton?.text()).toContain('Скопировано!');

            vi.advanceTimersByTime(2500);
            await wrapper.vm.$nextTick();

            expect(copyButton?.text()).toContain('Копировать');
        });
    });
});
