import {createRouter, createWebHistory} from 'vue-router';
import {h} from 'vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
  },
  {
    path: '/bbs/register',
    name: 'BBS Register',
    component: () => import('../pages/BBS/Register.vue'),
  },
  {
    path: '/bbs/list',
    name: 'BBS List',
    component: () => import('../pages/BBS/List.vue'),
  },
  {
    path: '/members/register',
    name: 'Members Register',
    component: () => import('../pages/Members/Register.vue'),
  },
  {
    path: '/members/list',
    name: 'Members List',
    component: () => import('../pages/Members/List.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
