<script setup>
  // 如果要使用 父组件传递过来的数据，要定义一个变量 例如props 来接收
  const props = defineProps({
    goods: {
      type: Object,
      default: {}
    },
    showRadio: {
      type: Boolean,
      // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
      default: false
    },
    showNum: {
      type: Boolean,
      // 如果外界没有指定 show-radio 属性的值，则默认不展示 uni-number-box 组件
      default: false
    }
  })
  // 默认图片
  const defaultPic = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMDg3MV8zfDF8c2VhcmNofDJ8fHNwcm5nfGVufDB8fHx8MTY0NzM5NTY1Mw&ixlib=rb-1.2.1&q=80&w=1080'
  
  // 一、修改 radios的状态
  const emit = defineEmits(['radioChange', 'numberChange'])
  const radioChange = () => {
    emit('radioChange', {
      // 传入商品的 id 和 选中状态state，每次点击都取 反状态
      goods_id: props.goods.goods_id,
      goods_state: !props.goods.goods_state,
      goods_count: +props.goods.goods_count  // 有朝一日 能够填了这个坑  导航栏购物车右上角徽标数量改变
    })
  }
  
  // 二、修改 商品的数量  numValue是多少？→ 输入框当前的 value
  const numberChange = (numValue) => {
    emit('numberChange', {
      // 传入商品的 id 和 选中状态state，每次点击都取 反状态
      goods_id: props.goods.goods_id,
      goods_count: +numValue // 隐式转换
    })
  }
</script>

<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <radio v-if="showRadio" :checked="goods.goods_state" color="#C00000" @click="radioChange"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price.toFixed(2)}}</view>
        <!-- 商品数量 -->
        <uni-number-box :min="1" :value="goods.goods_count" @change="numberChange" v-if="showNum"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
  
    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
  
      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }
  
    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
    
      .goods-name {
        font-size: 13px;
      }
    
      .goods-info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    
      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }   
</style>