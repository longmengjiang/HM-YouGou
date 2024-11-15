<script setup>
  import { ref } from 'vue'

  // 一、轮播图模块
  const swiperList = ref([])
  const getSwiperList = async () => {
    const { data: res } = await  uni.$http.get('/api/public/v1/home/swiperdata')
    if (res.meta.status !== 200) return uni.$showToast('轮播图请求失败')
    swiperList.value = res.message
  }
  getSwiperList()

  // 二、分类导航区域模块
  const navList = ref([])
  const getNavList = async () => {
    const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
    if (res.meta.status !== 200) return uni.$showToast('分类请求失败')
    navList.value = res.message 
  }
  getNavList()
  const navClickHandler = (item) => {
    // 判断点击的是哪个 nav
    if (item.name === '分类') {
      uni.switchTab({
        url: '/pages/cate/cate'
      }) 
    }
  }

  // 三、楼层区域模块
  const floorList = ref([])
  const getFloorList = async () => {
    const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
    if (res.meta.status !== 200) return uni.$showMsg()
    
    // 做 导航的处理  →  因为后端返回的不是一个好地址！！！
    // 通过双层 forEach 循环，处理 URL 地址
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/goods/goodsList/goodsList?' + prod.navigator_url.split('?')[1]
        })
      })
    floorList.value = res.message
  }
  getFloorList()
</script>

<template>
  <!-- 注意：还是使用了 小程序 的标签，而不是 vue的标签    语法用vue的 -->

  <!-- 搜索组件 -->
  <my-search></my-search>

  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <!-- 循环渲染轮播图的 item 项 -->
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/goods/goodsDetail/goodsDetail?goods_id=' + item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
  </view>

  <!-- 分类导航区域 -->
  <view class="nav-list">
    <view class="nav-item" v-for= "(item, index) in navList" :key="index" @click="navClickHandler(item)">
      <image :src="item.image_src" class="nav-img"></image>
    </view>
  </view>

  <!-- 楼层区域 -->
  <view class="floor-list">
    <!-- 楼层每一项 -->
    <view class="floor-item" v-for="(item, index) in floorList" :key="index">
      <!-- 楼层标题 -->
      <image :src="item.floor_title.image_src" class="floor-title"></image>
      
      <!-- 楼层5个图片区域 -->
      <view class="floor-img-box">
        
        <!-- 左侧大图片的盒子 -->
        <navigator class="left-img-box" :url="item.product_list[0].url">
          <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
        </navigator>
        
        <!-- 右侧 4 个小图片的盒子 -->
        <view class="right-img-box">
          <navigator class="right-img-item" v-for="(item2, index2) in item.product_list" :key="index2" :url="item2.url">
            <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}" v-if="index2 !== 0"></image>
          </navigator>
        </view>
        
      </view>
    </view>
  </view>

</template>

<style lang="scss" scoped>
// 轮播图区域
swiper {
 height: 330rpx;

 .swiper-item,
 image {
   width: 100%;
   height: 100%;
 }
}

// 分类导航区域
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

// 楼层图片区域
.floor-list {
  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  
  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
    
    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
}
</style>
