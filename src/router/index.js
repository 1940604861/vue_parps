import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import webcome from '../components/webcome.vue'
import user from '../components/user/user.vue'
import rights from '../components/power/right.vue'
import roles from '../components/power/roles.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/webcome',
      children: [
        { path: '/webcome', component: webcome },
        { path: '/users', component: user },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles }
      ]
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   // to  访问的路径
//   // from  从哪个路径跳转
//   // next  放行
//   if (to.path === './login') return next()
//   const tokenstr = window.sessionStorage.getItem('token')    //读取数据
//   if (!tokenstr) return next('./login')
//   next()
// })

export default router
