import { createRouter, createWebHistory } from 'vue-router';
import { userAuthStore } from '../stores/auth-store';

import Home from '../views/HomepageView.vue';
import Accounts from '../views/AccountPageView.vue';
import Users from '../views/UserPageView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/accounts', name: 'Accounts', component: Accounts, meta: { requiresAuth: true } },
    { path: '/users', name: 'Users', component: Users, meta: { requiresAuth: true } },
  ]
});

router.beforeEach((to, from, next) => {
  const store = userAuthStore();
  store.autoLogin();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !store.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router