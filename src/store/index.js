import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //写数据的地方
  state: {
    userInfo:{
      name:'',
      photo:'',
    }
  },
  //写方法的地方
  mutations: {
    changeUserInfo(state,value) {
      //把value这个对象的所有属性值，都赋值给state这个对象的所有属性值
      Object.assign( state.userInfo, value)
      // state.userInfo.name = value.name
      // state.userInfo.photo = value.photo
    }
  },
  actions: {
  },
  modules: {
  }
})
