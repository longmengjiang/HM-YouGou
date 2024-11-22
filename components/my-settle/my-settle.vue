<script setup>
  import { ref, computed } from 'vue'
  import { useCartStore } from '@/store'
  
  const cartStore = useCartStore()
  
  // 一、声明计算属性 用 商品总数 === 已勾选的商品总数 判断isFullChecked 的值
  const isFullChecked = computed(()=> {
    if(cartStore.cartTotal === 0) return false
    return cartStore.cartTotal === cartStore.checkedGoodsCount
  })
  
  // 二、全选/反选 模块
  const updateCheckedGoodsState = () => {
    cartStore.updateCheckedGoodsState(!isFullChecked.value)
  }
  

</script>

<template>
  <view>
    
    <!-- 最外层的容器 -->
    <view class="my-settle-container">
      <!-- 全选区域 -->
      <label class="radio" @click="updateCheckedGoodsState">
        <radio color="#C00000" :checked="isFullChecked" /><text>全选</text>
      </label>
    
      <!-- 合计区域 -->
      <view class="amount-box">
        合计:<text class="amount">￥{{ cartStore.checkedGoodsAmount }}</text>
      </view>
    
      <!-- 结算按钮 -->
      <view class="btn-settle">结算({{ cartStore.checkedGoodsCount }})</view>
    </view>
    
  </view>
</template>

<style lang="scss" scoped>
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  // 将背景色从 cyan 改为 white
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;

  .radio {
    display: flex;
    align-items: center;
  }

  .amount {
    color: #c00000;
  }

  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>