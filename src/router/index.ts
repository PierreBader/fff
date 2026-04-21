import { defineRouter } from '#q-app/wrappers';
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router';
import routes from './routes';

import { useAuthStore } from 'stores/auth';
import { fetchUserProfile } from 'src/services/auth';

export default defineRouter(() => {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === 'history'
          ? createWebHistory
          : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,
        history: createHistory(process.env.VUE_ROUTER_BASE),
    });

    Router.beforeEach(async (to) => {
        const authStore = useAuthStore();

        if (authStore.loading) {
            const user = await fetchUserProfile();
            authStore.setUser(user);
        }

        const user = authStore.user;

        if (to.meta.requiresAuth && !user) {
            return '/login';
        }

        if (to.meta.requiresAdmin && user?.role !== 'admin') {
            return '/';
        }

        return true;
    });

    return Router;
});
