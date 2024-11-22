import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // 三、
  return {
    address,
    addressString,
    
    updateAddress
  }
})