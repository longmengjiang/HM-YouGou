// #ifndef VUE3
import Vue from 'vue'
import App from './App'



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'


// 全局引入弹窗，要挂载的
import { $showToast, $showLoading, $deviceInfo } from './methods'
uni.$showToast = $showToast // 就这样挂载，使用也是 uni.$showToast 即可
uni.$showLoading = $showLoading
uni.$deviceInfo = $deviceInfo

// 1、$http 的配置和使用
import { $http } from "@escook/request-miniprogram"
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 1.1 请求拦截器
$http.beforeRequest = function (options) {
  $showLoading('数据加载中')
}
// 1.2 响应拦截器
$http.afterRequest = () => {
  uni.hideLoading()
}
// 1.3 将 $http 挂载到 uni 上
uni.$http = $http


export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif