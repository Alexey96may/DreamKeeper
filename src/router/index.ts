import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {
                title: 'Главная — Dream Keeper',
                description:
                    'Ваш личный дневник осознанных сновидений и ночных видений. Удобный учет, теги, фильтры и статистика.',
            },
        },
        {
            path: '/day/:date',
            name: 'day-details',
            component: () => import('../views/DayView.vue'),
            props: true,
            meta: {
                title: 'Сны за день — Dream Keeper',
                description: 'Хронология и детали сновидений за выбранный день в дневнике снов.',
            },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
            meta: {
                title: 'О проекте — Dream Keeper',
                description:
                    'Информация о приложении Dream Keeper, созданном для фиксации и анализа снов.',
            },
        },
        // --- CRUD Dreams ---
        {
            path: '/dream/new',
            name: 'dream-create',
            component: () => import('../views/dreams/DreamFormView.vue'),
            meta: {
                title: 'Новый сон — Dream Keeper',
                description:
                    'Запишите детали нового сновидения, добавьте категории, эмоции и степень осознанности.',
            },
        },
        {
            path: '/dream/share/import',
            name: 'dream-import-shared',
            component: () => import('../views/dreams/DreamFormView.vue'),
            meta: {
                title: 'Импорт сна — Dream Keeper',
                description: 'Импортируйте разделенное сновидение в свой дневник снов.',
            },
        },
        {
            path: '/dream/:slug/edit',
            name: 'dream-edit',
            component: () => import('../views/dreams/DreamFormView.vue'),
            props: true,
            meta: {
                title: 'Редактировать сон — Dream Keeper',
                description: 'Изменение деталей ранее записанного сновидения.',
            },
        },
        {
            path: '/dream/:slug',
            name: 'dream-details',
            component: () => import('../views/dreams/DreamDetailView.vue'),
            props: true,
            meta: {
                title: 'Сон — Dream Keeper',
                description: 'Подробный просмотр сновидения, анализ и сопутствующие теги.',
            },
        },
        {
            path: '/dream/search',
            name: 'dream-search',
            component: () => import('../views/dreams/DreamSearchView.vue'),
            meta: {
                title: 'Поиск по снам — Dream Keeper',
                description: 'Умный поиск и фильтрация по вашему архиву сновидений.',
            },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
            meta: {
                title: 'Страница не найдена — Dream Keeper',
                description: 'Запрашиваемая страница не существует.',
            },
        },
    ],
    scrollBehavior() {
        return { top: 0 };
    },
});

const updateMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
};

router.afterEach((to) => {
    const defaultTitle = 'Dream Keeper';
    const defaultDescription =
        'Ваш персональный инструмент для фиксации, анализа и систематизации сновидений.';

    // 1. title
    const title = (to.meta.title as string) || defaultTitle;
    document.title = title;

    // 2.  standard description
    const description = (to.meta.description as string) || defaultDescription;
    updateMetaTag('name', 'description', description);

    // 3.  Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', window.location.href);
    updateMetaTag('property', 'og:type', 'website');
});

export default router;
