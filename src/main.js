import Vue from 'vue'
import App from './App'
import store from './store'

// 禁用原生tabBar
wx.hideTabBar()

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
