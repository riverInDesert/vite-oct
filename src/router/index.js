import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path:'/login',
      name:'login',
      component: LoginView
    },
    {
      path:'/register',
      name:'register',
      component: RegisterView
    },
    {
      path:'/shopDetails/:id',
      name:'shopDetails',
      component: ()=>import('../views/ShopDetailsViews.vue')
    },
    {
      path:'/order',
      name:'order',
      component: ()=>import('../views/OrderView.vue')
    },
    {
      path:'/orderRecord',
      name: 'orderRecord',
      component: ()=>import('../views/OrderRecordView.vue')
    }
  ]
})
router.beforeEach((to, from, next)=> {
  //const {isLogin}=localStorage;
  (localStorage.isLogin||(to.name==="login"||to.name==="register"))? next(): next({name:"login"})
});

export default router
