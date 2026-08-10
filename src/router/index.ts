import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/day/:date',
            name: 'day-details',
            component: () => import('../views/DayView.vue'),
            props: true,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        // --- CRUD Dreams ---
        {
            path: '/dream/new',
            name: 'dream-create',
            component: () => import('../views/dreams/DreamFormView.vue'),
        },
        {
            path: '/dream/:id',
            name: 'dream-details',
            component: () => import('../views/dreams/DreamDetailView.vue'),
            props: true,
        },
        {
            path: '/dream/:id/edit',
            name: 'dream-edit',
            component: () => import('../views/dreams/DreamFormView.vue'),
            props: true,
        },
    ],
});

export default router;
