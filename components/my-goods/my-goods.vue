<script setup>
  defineProps({
    goods: {
      type: Object,
      default: {}
    }
  })
  
  // 默认图片
  const defaultPic = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMDg3MV8zfDF8c2VhcmNofDJ8fHNwcm5nfGVufDB8fHx8MTY0NzM5NTY1Mw&ixlib=rb-1.2.1&q=80&w=1080'
  
  // 二
</script>

<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price.toFixed(2)}}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
  
    .goods-item-left {
      margin-right: 5px;
  
      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }
  
    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  
      .goods-name {
        font-size: 13px;
      }
  
      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }   
</style>