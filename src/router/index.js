import Vue from 'vue'
import VueRouter from 'vue-router'

//导入其他页面
import Login from '../views/login'
import Home from '../views/home'
import Article from '../views/home/article'
import Publish from '../views/home/publish'
import Comment from '../views/home/comment'
import User from '../views/home/user'
import Overview from '../views/home/overview'

//导入token
import { getToken } from '../utils/token'

//导入NProgress
import NProgress from 'nprogress'
import "nprogress/nprogress.css"


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
    component: Home,
    children:[
      {
        path: '/article',
        component: Article
      },
      {
        path: '/publish',
        component: Publish
      },
      {
        path: '/publish/:id',
        name: 'publish-edit',
        component: Publish
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/user',
        name: 'user',
        component: User
      },
      {
        path: '/overview',
        name: 'overview',
        component: Overview
      },
    ]
  },

]

const router = new VueRouter({
  routes
})

// to： 去哪
// from：从哪来
// next：放行的方法，只有调用这个方法，才让你去接下来的地方
router.beforeEach((to, from, next) => {
  //进度条动画开始
  NProgress.start() 
  next()
  // 如果你去的路径不是登录页
  // if (to.path != '/login') {
  //   var res = getToken()
  //   //判断是否有token
  //   if (res) {
  //     //有，放行
  //     next()
  //   } else {
  //     //提示
  //     Vue.prototype.$message.error('请先登录')
  //     //没登录，打回登录页
  //     next('/login')
  //   }
  // } else {
  //   //如果你去的是登录页面，直接放行
  //   next()
  // }
})

//全局后置钩子
router.afterEach((to, from) => {
  // ...
  setTimeout(()=>{
    NProgress.done() //加载动画结束
  },200)
  
})

export default router
