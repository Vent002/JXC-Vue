/*
 * @Date: 2020-02-12 15:38:22
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-14 19:58:50
 * @FilePath: \webfrontend\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(Element)

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})
