// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import EntityListPage from '../pages/EntityListPage.vue';
import AdminDashboardPage from '../pages/AdminDashboardPage.vue';
import ProposeEntityPage from '../pages/ProposeEntityPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage },
  { path: '/entities', component: EntityListPage },
  { path: '/propose', component: ProposeEntityPage, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminDashboardPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/login', component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.fetchUser();

  if (to.meta.requiresAuth && !authStore.user) {
    return '/login';
  }
  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return '/';
  }
});

export default router;