import Vue from 'vue'
import App from './App'

import store from './store'
import api from '../common/vmeitime-http/'

// 全局挂载后使用
Vue.prototype.$api = api
Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
