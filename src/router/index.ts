import { defineRouter } from '#q-app/wrappers';
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router';
import routes from './routes';

import { supabase } from 'boot/supabase';

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
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const authUser = session?.user;

        if (to.meta.requiresAuth && !authUser) {
            return '/login';
        }

        if (to.meta.requiresManager && authUser?.app_metadata?.role !== 'manager') {
            console.log('Petit malin');
            return '/';
        }

        return true;
    });

    return Router;
});
