import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import axios from '../utils/http';
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { redirectAlreadyLogin: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Signup.vue'),
    meta: { redirectAlreadyLogin: true },
  },
  {
    path: '/column/:id',
    name: 'column',
    component: () => import('../views/ColumnDetail.vue'),
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/CreatePost.vue'),
    meta: { requiredLogin: true },
  },
  {
    path: '/posts/:id',
    name: 'post',
    component: () => import('../views/PostDetail.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const { user, token } = store.state;
  const { requiredLogin, redirectAlreadyLogin } = to.meta;

  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      store
        .dispatch('fetchCurrentUser')
        .then(() => {
          if (redirectAlreadyLogin) {
            next('/');
          } else {
            next();
          }
        })
        .catch((e) => {
          console.log(e);
          store.commit('logout');
          next('/login');
        });
    } else {
      if (requiredLogin) {
        next('/login');
      } else {
        next();
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/');
    } else {
      next();
    }
  }
});
export default router;
