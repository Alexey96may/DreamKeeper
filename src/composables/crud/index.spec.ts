import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCrud } from '@/composables/crud';

const mockAddToast = vi.fn();
const mockRouterPush = vi.fn();
const mockDeleteDream = vi.fn();
const mockDeleteState = vi.fn();

vi.mock('@/stores/modules/ui', () => ({
    useUIStore: () => ({
        addToast: mockAddToast,
    }),
}));

vi.mock('@/stores/modules/dream', () => ({
    useSleepStore: () => ({
        deleteDream: mockDeleteDream,
    }),
}));

vi.mock('@/stores/modules/userState', () => ({
    useUserStateStore: () => ({
        deleteState: mockDeleteState,
    }),
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

describe('useCrud composable', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('isDeleting', () => {
        it('correctly tracks items being deleted', async () => {
            const { deleteWithUndo, isDeleting } = useCrud();
            mockDeleteDream.mockResolvedValueOnce(true);

            expect(isDeleting(10)).toBe(false);

            // Запускаем удаление с undo (таймер 3000мс)
            deleteWithUndo({
                id: 10,
                deleteFn: mockDeleteDream,
            });

            expect(isDeleting(10)).toBe(true);
            expect(isDeleting('10')).toBe(true); // Проверка строкового/числового приведения

            // Завершаем таймер
            vi.advanceTimersByTime(3000);
            await vi.runAllTimersAsync();

            expect(isDeleting(10)).toBe(false);
        });
    });

    describe('deleteWithUndo', () => {
        it('calls deleteFn and triggers redirect/success toast when timer finishes without cancel', async () => {
            const { deleteWithUndo } = useCrud();
            mockDeleteDream.mockResolvedValueOnce(true);
            const onSuccessMock = vi.fn();

            deleteWithUndo({
                id: 1,
                deleteFn: mockDeleteDream,
                duration: 2000,
                redirectUrl: '/dashboard',
                onSuccess: onSuccessMock,
                successMessage: 'Custom deleted',
            });

            // Проверяем, что показан тост с подтверждением
            expect(mockAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'warning',
                    actionLabel: 'Отменить',
                }),
            );

            // Проматываем таймер
            vi.advanceTimersByTime(2000);
            // Даем разрешиться промисам внутри таймера
            await vi.runAllTimersAsync();

            expect(mockDeleteDream).toHaveBeenCalledWith(1);
            expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
            expect(onSuccessMock).toHaveBeenCalledTimes(1);
            expect(mockAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Custom deleted',
                    type: 'info',
                }),
            );
        });

        it('cancels deletion when user clicks undo action', () => {
            const { deleteWithUndo } = useCrud();

            deleteWithUndo({
                id: 5,
                deleteFn: mockDeleteDream,
                duration: 3000,
            });

            // Достаем переданный колбэк onAction из вызова addToast
            const toastCallArg = mockAddToast.mock.calls[0][0];
            expect(toastCallArg.actionLabel).toBe('Отменить');

            // Симулируем нажатие на кнопку "Отменить" в тосте
            toastCallArg.onAction();

            // Проматываем время вперед
            vi.advanceTimersByTime(3000);

            // deleteFn не должна быть вызвана
            expect(mockDeleteDream).not.toHaveBeenCalled();
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    describe('handleDeleteDream / handleDelete', () => {
        it('handles dream deletion with formatted name and date-based redirect', async () => {
            const { handleDeleteDream, handleDelete } = useCrud();
            mockDeleteDream.mockResolvedValueOnce(true);

            // handleDelete
            expect(handleDelete).toBe(handleDeleteDream);

            handleDeleteDream(42, '2026-06-01', 'Very Long Dream Name Here');

            expect(mockAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('«Very Long Dream…»'),
                }),
            );

            vi.advanceTimersByTime(4000);
            await vi.runAllTimersAsync();

            expect(mockDeleteDream).toHaveBeenCalledWith(42);
            expect(mockRouterPush).toHaveBeenCalledWith('/day/2026-06-01');
        });

        it('redirects to root "/" if date is not provided for dream deletion', async () => {
            const { handleDeleteDream } = useCrud();
            mockDeleteDream.mockResolvedValueOnce(true);

            handleDeleteDream(42);

            vi.advanceTimersByTime(4000);
            await vi.runAllTimersAsync();

            expect(mockRouterPush).toHaveBeenCalledWith('/');
        });
    });

    describe('handleDeleteState', () => {
        it('deletes user state and executes onSuccess callback', async () => {
            const { handleDeleteState } = useCrud();
            mockDeleteState.mockResolvedValueOnce(true);
            const onSuccessMock = vi.fn();

            handleDeleteState(100, onSuccessMock);

            vi.advanceTimersByTime(3000);
            await vi.runAllTimersAsync();

            expect(mockDeleteState).toHaveBeenCalledWith(100);
            expect(onSuccessMock).toHaveBeenCalledTimes(1);
            expect(mockAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Состояние удалено!',
                }),
            );
        });
    });
});
