<script setup>
  
  // 渲染导航栏购物车数量
  import { onShow } from '@dcloudio/uni-app'
  import { useCartStore } from '@/store'
  const cartStore = useCartStore()
  onShow(()=> {
    if(!cartStore.cartTotal) return
    cartStore.setBadge()
  })
  
</script>

<template>
  <view>
    {{ cartStore.ceshi }}
  </view>
</template>

<style lang="scss" scoped>
         
</style>
