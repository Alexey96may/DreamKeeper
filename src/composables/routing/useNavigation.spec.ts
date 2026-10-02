import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNavigation } from '@/composables/routing/useNavigation';

// vue-router
const mockRouterPush = vi.fn();
const mockRouterBack = vi.fn();

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        back: mockRouterBack,
    }),
}));

describe('useNavigation composable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('goBack', () => {
        it('pushes fallback route if provided (string or object)', () => {
            const { goBack } = useNavigation();

            goBack('/dashboard');
            expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');

            goBack({ name: 'Home' });
            expect(mockRouterPush).toHaveBeenCalledWith({ name: 'Home' });
        });

        it('calls router.back() if history length > 1 and no fallback provided', () => {
            //  history.length
            vi.spyOn(window.history, 'length', 'get').mockReturnValue(3);

            const { goBack } = useNavigation();
            goBack();

            expect(mockRouterBack).toHaveBeenCalledTimes(1);
            expect(mockRouterPush).not.toHaveBeenCalled();
        });

        it('falls back to "/" if history length <= 1 and no fallback provided', () => {
            vi.spyOn(window.history, 'length', 'get').mockReturnValue(1);

            const { goBack } = useNavigation();
            goBack();

            expect(mockRouterPush).toHaveBeenCalledWith('/');
            expect(mockRouterBack).not.toHaveBeenCalled();
        });
    });

    describe('goToDreamDetail', () => {
        it('navigates to dream detail page when valid slug is provided', () => {
            const { goToDreamDetail } = useNavigation();

            goToDreamDetail('flying-in-space');

            expect(mockRouterPush).toHaveBeenCalledWith('/dream/flying-in-space');
        });

        it('does nothing if slug is undefined or empty', () => {
            const { goToDreamDetail } = useNavigation();

            goToDreamDetail(undefined);

            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    describe('goToAddDream', () => {
        it('navigates to new dream page with query date parameter', () => {
            const { goToAddDream } = useNavigation();

            goToAddDream('2026-06-01');

            expect(mockRouterPush).toHaveBeenCalledWith('/dream/new?date=2026-06-01');
        });
    });

    describe('goToEdit', () => {
        it('navigates to dream edit page when valid slug is provided', () => {
            const { goToEdit } = useNavigation();

            goToEdit('flying-in-space');

            expect(mockRouterPush).toHaveBeenCalledWith('/dream/flying-in-space/edit');
        });

        it('does nothing if slug is undefined', () => {
            const { goToEdit } = useNavigation();

            goToEdit(undefined);

            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });
});
