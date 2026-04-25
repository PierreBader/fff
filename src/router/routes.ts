import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/HomePage.vue') },

            { path: 'entities', component: () => import('pages/EntityListPage.vue') },

            {
                path: 'propose',
                component: () => import('pages/ProposeEntityPage.vue'),
                meta: { requiresAuth: true },
            },

            {
                path: 'admin',
                component: () => import('pages/AdminDashboardPage.vue'),
                meta: { requiresAuth: true, requiresManager: true },
            },

            { path: 'login', component: () => import('pages/LoginPage.vue') },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
