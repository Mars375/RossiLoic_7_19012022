import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VueCookies from 'vue-cookies'
import Store from '../store/index'

Vue.use(VueCookies);
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/profil/:id',
    name: 'Profil',
    component: () => import('../views/Profil.vue'),
  },
  {
    path: '/profil/:id/follower',
    name: 'Follower',
    component: () => import('../views/Follower.vue')
  },
  {
    path: '/profil/:id/following',
    name: 'Following',
    component: () => import('../views/Following.vue')
  },
  {
    path: '/submit',
    name: 'NewPost',
    component: () => import('../views/NewPost.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})


router.beforeEach((to, from, next) => {
  Store.commit('setToken', document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("jwt="))
  );
  if(!document.cookie)
    Store.commit('setUser', null)
  next()
})

export default router