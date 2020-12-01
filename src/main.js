import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//导入axios
import axios from 'axios'
// 把$axios属性设置给Vue原型
Vue.prototype.$axios = axios
// 设置基地址
axios.defaults.baseURL = "http://ttapi.research.itcast.cn"

//导入全局默认样式
import './assets/css/base.css'

Vue.config.productionTip = false

//使用
Vue.use(ElementUI);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
