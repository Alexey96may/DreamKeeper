import { useRouter } from 'vue-router';

export function useNavigation() {
    const router = useRouter();

    const goBack = (fallback?: string | object) => {
        if (fallback) {
            router.push(fallback);
        } else if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const goToDreamDetail = (slug: string | undefined) => {
        if (!slug) return;

        router.push(`/dream/${slug}`);
    };

    const goToAddDream = (date: string) => {
        router.push(`/dream/new?date=${date}`);
    };

    const goToEdit = (slug: string | undefined) => {
        if (!slug) return;
        router.push(`/dream/${slug}/edit`);
    };

    return {
        goBack,
        goToDreamDetail,
        goToAddDream,
        goToEdit,
    };
}
