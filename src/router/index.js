import Vue from 'vue'
import VueRouter from 'vue-router'

//导入其他页面
import Login from '../views/login'
import Home from '../views/home'

//导入token
import { getToken } from '../utils/token'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },//重定向
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  //   {
  //     path: '/about',
  //     name: 'About',
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  //   }
]

const router = new VueRouter({
  routes
})

// to： 去哪
// from：从哪来
// next：放行的方法，只有调用这个方法，才让你去接下来的地方
router.beforeEach((to, from, next) => {
  // 如果你去的路径不是登录页
  if (to.path != '/login') {
    var res = getToken()
    //判断是否有token
    if (res) {
      //有就放行
      next()
    } else {
      //提示
      Vue.prototype.$message.error('请先登录')
      //没登录，打回登录页
      next('/login')
    }
  } else {
    //如果你去的是登录页面，直接放行
    next()
  }
})

export default router
