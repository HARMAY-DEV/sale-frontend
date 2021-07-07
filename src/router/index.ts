import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '@/views/Home.vue';
import { StorageKey } from '@/utils/consts';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/shopping-cart',
    children: [
      {
        path: 'shopping-cart',
        name: 'shopping-cart',
        component: () => import(/* webpackPrefetch: true */ '@/views/Cart.vue'),
      },
      {
        path: 'order',
        name: 'order',
        component: () => import(/* webpackPrefetch: true */ '@/views/Order.vue'),
      },
      {
        path: 'device',
        name: 'device',
        component: () => import(/* webpackPrefetch: true */ '@/views/Device.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import(/* webpackPrefetch: true */ '@/views/Profile.vue'),
      }
    ],
    beforeEnter(to, from, next) {
      const isLogin = localStorage.getItem(StorageKey.IS_LOGIN);
      const token = localStorage.getItem(StorageKey.TOKEN);
      if (to.path !== '/login' && (!isLogin || !token)) {
        next({ path: '/login' });
      } else {
        next();
      }
    }
  },
  {
    path: '/login',
    name: '登录',
    component: () => import(/* webpackPrefetch: true */ '@/views/Login.vue'),
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  // base: 'harmay/harmayCS/'+process.env.BASE_URL,
  base: process.env.BASE_URL,
  routes,
});

export default router;
