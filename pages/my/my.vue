<script setup>
  
  // 渲染导航栏购物车数量
  import { onShow } from '@dcloudio/uni-app'
  import { useCartStore, useUserStore } from '@/store'
  const cartStore = useCartStore()
  onShow(()=> {
    if(!cartStore.cartTotal) return
    cartStore.setBadge()
  })
  
  const userStore = useUserStore()
</script>

<template>
  <view class="my-container">
    <!-- 用户未登录时，显示登录组件   原本是以 token 作判断的-->
    <my-login v-if="!userStore.newUserInfo.avatar"></my-login>

    <!-- 用户登录后，显示用户信息组件 -->
    <my-userInfo v-else></my-userInfo>
  </view>
</template>

<style lang="scss" scoped>
  .my-container {
    height: 100%;
  } 
</style>
