import Vue from 'vue'
//导入axios
import axios from 'axios'
//导入router
import router from '../router'
//导入本地token
import { getToken } from './token'
// 把$axios属性设置给Vue原型
Vue.prototype.$axios = axios
// 设置基地址
axios.defaults.baseURL = "http://ttapi.research.itcast.cn"

// 添加请求拦截器
axios.interceptors.request.use( (config) => {
    // 在发送请求之前做些什么
    // console.log(config);
    let user = JSON.parse(getToken())
    // 有值才添加token
    if(user){
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config;
  },  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use( (response) => {
    // 对响应数据做点什么
    return response;
  },  (error) => {
    //提示请先登录
    Vue.prototype.$message.error('请先登录')

    //打回登录页
    router.push('/login')
    // 对响应错误做点什么
    return Promise.reject(error);
  });

  export {axios}