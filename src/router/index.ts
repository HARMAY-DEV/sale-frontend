import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/shopping-cart',
    children: [
      {
        path: 'shopping-cart',
        name: 'shopping-cart',
        component: () => import('@/views/ShoppingCart.vue'),
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/Order.vue'),
      },
      {
        path: 'device',
        name: 'device',
        component: () => import('@/views/Device.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
      }
    ],
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
