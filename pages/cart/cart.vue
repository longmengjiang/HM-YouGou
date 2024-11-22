<script setup>
  import { onShow  } from '@dcloudio/uni-app'
  import { useCartStore } from '@/store'
  import { ref, watch } from 'vue'
  
  // 一、渲染导航栏购物车数量 模块
  const cartStore = useCartStore()
  onShow(()=> {
    if(!cartStore.cartTotal) return
    cartStore.setBadge()
    cartTotal.value = cartStore.cartTotal
    cartList.value = cartStore.cartList
  })
  // 二、防止有 显示bug，在商店总数发生变化时，更新页面的数据 模块
  const cartTotal = ref(cartStore.cartTotal.value)
  const cartList = ref(cartStore.cartList.value)
  
  // 三、修改radios的状态模块
  const radioChange = (goods) => {
    cartStore.updateGoodsState(goods)
  }
  
  // 四、添加计数组件，并修改数量 模块
  const numberChange = (goods) => {
    cartStore.updateGoodsCount(goods)
  }
  
  // 五、右滑删除商品模块
  const options = ref([
    {
      text: '删除', // 显示的文本内容
      style: {
        backgroundColor: '#C00000' // 按钮的背景颜色
      }
    }
  ])
  // options 和 getOptions() 选择一个赋值给  <uni-swipe-action-item :right-options="options" @click="deleteGoods(goods)">  吧
  const getOptions = () => {
    return [
      {
        text: '删除', // 显示的文本内容
        style: {
          backgroundColor: '#C00000' // 按钮的背景颜色
        }
      }
    ]
  }
  // 使用监听器试试
  const cartListKey = ref(0)
  watch(
    () => cartStore.cartList,
    (newList) => {
      cartList.value = newList
      cartListKey.value += 1; // 改变 key 以强制重渲染
    },
    {
      deep: true
    }
  )
  const deleteGoods = (goods) => {
    cartStore.deleteGoods(goods)
  }

</script>

<template>
  <view class="cart-container" v-if="cartStore.cartList.length !== 0">
    <!-- 三、收获地址 -->
    <my-address></my-address>
    
    <!-- 一、购物车商品列表的标题区域 -->
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 描述文本 -->
      <text class="cart-title-text">购物车</text>
    </view>
    
    <!-- 二、商品列表区域 -->
    <uni-swipe-action :key="cartListKey"> 
      <view v-for="(goods, i) in cartList" :key="i">
        <!-- 商品列表的每一项 -->
        <uni-swipe-action-item :right-options="getOptions()" @click="deleteGoods(goods)">
          <my-goods :goods="goods" :showRadio="true" @radioChange="radioChange" @numberChange="numberChange" :showNum="true"></my-goods>
        </uni-swipe-action-item>
        
      </view>
    </uni-swipe-action> 

    <!-- 四、结算区域 -->
    <my-settle></my-settle>
  </view>
  
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="@/static/uni.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<style lang="scss" scoped>
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
    
    .cart-title-text {
      margin-left: 10px;
    }
  }
  
  .cart-container {
    padding-bottom: 50px;
  }
  
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
  
    .empty-img {
      width: 90px;
      height: 90px;
    }
  
    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
