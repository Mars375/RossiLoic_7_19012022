import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  next()
})

export default router