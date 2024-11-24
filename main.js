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

createSSRApp(App).use(Pinia.createPinia())
import { useUserStore } from '@/store'
const userStore = useUserStore()

// 1、$http 的配置和使用
import { $http } from "@escook/request-miniprogram"
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 1.1 请求拦截器
$http.beforeRequest = function (options) {
  $showLoading('数据加载中')
  console.log(options);
  // 判断请求的是否为有权限的 API 接口
  if (options.url.indexOf('/my/') !== -1) {  // indexOf === -1 表示找不到要查找的 字符串的某个字符 / 数组元素，第二个参数是0，默认从0开始找
    // 为请求头添加身份认证字段
    options.header = {
      // 字段的值可以直接从 vuex 中进行获取
      Authorization: userStore.token
    }
  }
}
// 1.2 响应拦截器
$http.afterRequest = () => {
  uni.hideLoading()
}
// 1.3 将 $http 挂载到 uni 上
uni.$http = $http

import * as Pinia from 'pinia';

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  return {
    app,
    Pinia
  }
}
// #endif