import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 很难了，四 五 两个模块基本没用了，从 一二三六……模块 重新用吧  为此新用了 '新用户信息'模块
// 从P172开始，用户的登录基本是注定失败的，建议自己手动写死token以完成后续开发 token的赋值可以写在my-login组件的getToken的失败条件里，这样可以完整的走一下登录流程 token的值为："Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo" 注意Bearer后面有一个空格！有一个空格！有一个空格！别漏了拿着这个token可以一直开发到P186，如果你按照上面token赋值的话，订单是可以创建成功的，创建不成功就退出登录然后重登一下，务必反复确认Storage界面里面token数值正确然后来到P187，到这里就走不动了，预支付订单生成时会报错"用户ID不符"，手动修改用户ID也无果，可能就只能走到这一步了，不过也就2P的内容就完结了，无伤大雅

export const useUserStore = defineStore('user', () => {
  
  // 一、收获地址模块
  const address = ref( uni.getStorageSync('address') || {}) // res 收货地址的所有信息（包括请求成功）
  // const addressString = ref( uni.getStorageSync('addressString') || '') // 仅仅包含 类似 身份证的收货地址
  const addressString = computed(() => {
    return address.value.provinceName + address.value.cityName + address.value.countyName + address.value.detailInfo
  })
  
  // 二、更新收获地址，并且存储到本地
  const updateAddress = (res) => {
    address.value = res // res 收货地址的所有信息（包括请求成功）
    uni.setStorageSync('address', res)
    // uni.setStorageSync('addressString', addressString) // 仅仅包含 类似 身份证的收货地址
  }
  
  // 三、登录的token模块 和 用户的基本信息 模块
  // const token = ref( uni.getStorageSync('token') || '' ) 
  const token = ref('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
  // 这是 写死的 token
  // token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
  const userInfo = ref( uni.getStorageSync('userInfo') || {} )
  
  // 很难了，四 五 两个模块基本没用了,理由看 statement.txt
  // 四、更新用户的基本信息
  const updateUserInfo = (info) => {
    userInfo.value = info
    saveUserInfoToStorage(userInfo.value)
    console.log(userInfo.value)
  } 
  // 五、存储用户的基本信息到本地
  const saveUserInfoToStorage = (info) => {
    uni.setStorageSync('userInfo', info)
  }
  
  // 很难了，四 五 两个模块基本没用了，从下面的模块重新用吧
  // 六、更新token模块
  const updateToken = (newToken) => {
    token.value = newToken
    saveTokenToStorage()
  }
  
  // 七、存储token到本地
  const saveTokenToStorage = () => {
    uni.setStorageSync('token', token.value)
  }
  
  // 还是需要用户信息的渲染，全部加上 '新'字，例如 newUserInfo
  // 八、定义新用户信息模块  仅包含 用户头像 / 用户昵称
  const newUserInfo = ref( uni.getStorageSync('newUserInfo') || {} )
  
  // 九、更新新用户信息模块
  const updateNewUserInfo = (info) => {
    newUserInfo.value = info
    saveNewUserInfoToStorage(newUserInfo.value)
    console.log(newUserInfo.value)
  }
  
  // 十、存储新用户信息到本地
  const saveNewUserInfoToStorage = (info) => {
    uni.setStorageSync('newUserInfo', info)
  }
  
  // 十一、定义跳转回到购物车页面的模块
  const redirectInfo = ref({})
  const updateRedirectInfo = (ele) => {
    redirectInfo.value = ele
  }
  
  
  return {
    address,
    token,
    userInfo,
    newUserInfo,
    redirectInfo,
    
    addressString,
    
    updateAddress,
    updateUserInfo,
    updateToken,
    saveTokenToStorage,
    newUserInfo,
    updateNewUserInfo,
    saveNewUserInfoToStorage,
    updateRedirectInfo
  }
})