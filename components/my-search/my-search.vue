<script setup>
// 一、这是父传子，子组件（本组件）接收父组件的值
defineProps({
  backgroundColor: {
    type: String,
    default: '#c00000'
  },
  borderRadius: {
    type: Number,
    default: 15
  }
})

// vue3的语法
// const emit = defineEmits(['goSearch'])
// const goSearch = () => {
//   emit('goSearch')
// }

// 二、点击跳转到搜索页面
const goSearch = () => {
  uni.navigateTo({
    url:'/goods/goodsSearch/goodsSearch'
  })
}
</script>

<template>
 <view class="my-search-container" :style="{ 'background-color': backgroundColor }">
     <!-- 使用 view 组件模拟 input 输入框的样式 -->
     <view class="my-search-box" :style="{ 'border-radius': borderRadius + 'px' }" @click="goSearch">
       <uni-icons type="search" size="17"></uni-icons>
       <text class="placeholder">搜索</text>
     </view>
   </view>
</template>

<style lang="scss">
.my-search-container {
  // background-color: #c00000;
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  
  // 设置定位效果为“吸顶”
  position: sticky;
  // 吸顶的“位置”
  top: 0;
  // 提高层级，防止被轮播图覆盖
  z-index: 999;
}

.my-search-box {
  height: 36px;
  background-color: #ffffff;
  // border-radius: 15px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder {
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>