import Vue from 'vue'
import App from './App'

import store from './store'
import api from '../common/vmeitime-http/'
import FastClick from './utils/fastclick'
// import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
// let vConsole = new VConsole() // 初始化
FastClick.attach(document.body);
// 全局挂载后使用
Vue.prototype.$api = api
Vue.config.productionTip = false

Vue.prototype.$store = store
//var env="zhengshi" development  "production"
Vue.prototype.$env="production"
App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
