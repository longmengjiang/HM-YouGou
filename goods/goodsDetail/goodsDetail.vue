<script setup>
  import { ref, watch } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { useCartStore } from '@/store'
  
  // 页面加载时获取参数
  onLoad((goods_id) => {
    getGoodsInfo(goods_id)
  })
  
  // 一、轮播图模块
  const goodsInfo = ref({})
  const getGoodsInfo = async (goods_id) => {
    const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', goods_id)
    if (res.meta.status !== 200) return uni.$showToast()
    
    // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题   第二个 replace是解决.webp 格式图片在 ios 设备上无法正常显示的问题
    res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
    
    goodsInfo.value = res.message
  }
  
  // 二、获取轮播图大图的预览
  const getBigPicture = (index) => {
    // 补充新知识：  点击时 可以 查看 大图的预览    bug? 放大时移动顺序，小图没有跟着定位
    uni.previewImage({
      current:index,
      urls: goodsInfo.value.pics.map( ele => ele.pics_big )
    })
  }
  
  // 三、商品详情信息图片 之间的 间隙问题  →  使用正则来改变后端所给的数据
  // 见 getGoodsInfo() 函数
  
  // 四、在未加载完毕数据之前，不要渲染商品的所有信息！！！  对谁都好 客户等等  →  使用v-if直接隐藏
  
  // 五、商品导航组件模块数据
  const options = ref([
    {
			icon: 'shop',
			text: '店铺',
			infoBackgroundColor:'#007aff',
			infoColor:"red"
		},
    {
			icon: 'cart',
			text: '购物车',
			info: 0
		}
  ])
  const buttonGroup = ref([
    {
      text: '加入购物车',
      backgroundColor: '#ff0000',
      color: '#fff'
    },
    {
      text: '立即购买',
      backgroundColor: '#ffa200',
      color: '#fff'
    }
	])
  
  // 六、底部商品导航组件模块按钮的导航
  const onClick = (e) => {
    if (e.content.text === '购物车') {
      // 切换到购物车页面
      uni.switchTab({
        url: '/pages/cart/cart'
      })
    }
  }
  
  const cartStore = useCartStore()
  const buttonClick = (e) => {
    // 到这里并没有写内容，直接就提交分支到github了
    // 1. 判断是否点击了 加入购物车 按钮
    if (e.content.text === '加入购物车') {
      // 2. 组织一个商品的信息对象
      const goods = {
        goods_id: goodsInfo.value.goods_id,       // 商品的Id
        goods_name: goodsInfo.value.goods_name,   // 商品的名称
        goods_price: goodsInfo.value.goods_price, // 商品的价格
        goods_count: 1,                           // 商品的数量
        goods_small_logo: goodsInfo.value.goods_small_logo, // 商品的图片
        goods_state: true                         // 商品的勾选状态
      }
      cartStore.addGoodsToCartList(goods)  // 看到这里，这里可能有个bug，做到持久化存储到本地
    }
  } 
   
  // 七、watch监听 商品总数的变化，映射到购物车右上角红色数字上
  watch(
    () => cartStore.cartTotal,
    (newValue) => {
      // 法一：(更推荐，因为直接定位到购物车)
      // 1. 通过数组的 find() 方法，找到购物车按钮的配置对象
      // const findResult = options.value.find((x) => x.text === '购物车')

      // if (findResult) {
        // 2. 动态为购物车按钮的 info 属性赋值
        // findResult.info = newValue
      // }
      
      // 法二：
      options.value[1].info = newValue
    },
    {
      immediate: true,
      deep: true
    }
  )
  
  
  
  // 八、完善购物车徽标，在所有页面都展示
  
  // mixins: ['setBadge']
</script>

<template>
  <view v-if="goodsInfo.goods_name" class="goods-detail-container">
    
    <!-- 一、轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goodsInfo.pics" :key="i">
        <image :src="item.pics_big" @click="getBigPicture(i)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 二、商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goodsInfo.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goodsInfo.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    
    <!-- 三、商品详情信息   使用富文本编辑器 -->
    <!-- 有问题，应该是后端的问题，有一些图片地址失效了 -->
    <!-- 补充，图片之间有缝隙，这里使用 正则法 来更替 -->
    <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
    
    
    <!-- 四、商品导航组件 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <!-- 有个bug，滚动条会滚到导航组件那里，但是实际效果不变，问题就是滚动条影响美观 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
  
</template>

<style lang="scss" scoped>
  .goods-detail-container {
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }
  
  // 一、轮播图模块
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
  
  // 二、商品信息区域的样式模块
  .goods-info-box {
    padding: 10px;
    padding-right: 0;
  
    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }
  
    .goods-info-body {
      display: flex;
      justify-content: space-between;
  
      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }
      // 收藏区域
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }
  
    // 运费
    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }
  
  // 三、商品导航区域模块
  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
