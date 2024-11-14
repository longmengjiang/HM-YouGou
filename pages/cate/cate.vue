<script setup>
  import { ref } from 'vue'
  // 一、获取设备信息
  const deviceInfo = uni.$deviceInfo
  const scrollHeight = deviceInfo.windowHeight
  
  // 二、获取分类列表数据模块  →  包含 一级分类、二级分类，不包含三级分类  →  因为我太乱套了，别问
  const cateList = ref([])
  const cateList2 = ref([])
  const getCateList = async () => {
    const { data: res } = await uni.$http.get('/api/public/v1/categories')
    if (res.meta.status !== 200) return uni.$showToast()
    cateList.value = res.message
    cateList2.value = res.message[0].children
  }
  getCateList()
  
  // 三、分类列表模块的选定项  →  包括选其他项时二级分类回到顶部
  const active = ref(0)
  const scrollTop = ref(0)
  const changeActive = (index) => {
    active.value = index
    // 为二级分类重新赋值，不要嵌套循环
    cateList2.value = cateList.value[index].children
    
    // 改变 二级分类位于屏幕高度变化，在0 / 0.1之间改就行了
    scrollTop.value = scrollTop.value === 0 ? 0.1 :0
  }
  
  // 四、三级列表内容点击跳转到goodList页面
  const goGoodsList = (item3) => {
    uni.navigateTo({
      url: '/goods/goodsList/goodsList?cid=' + item3.cat_id
    })
  }
</script>

<template>
  <view>
    <view class="scroll-view-container">
      
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: scrollHeight + 'px'}">
        <view v-for="(item, index) in cateList" :key="item.cat_id" @click="changeActive(index)">
          <view :class="['left-scroll-view-item', index === active ? 'active': '']">{{item.cat_name}}</view>
        </view>
      </scroll-view>
      
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: scrollHeight + 'px'}" :scroll-top="scrollTop">
        <!-- 二级分类列表 -->
        <view class="cate-lv2" v-for="item2 in cateList2" :key="item2.cat_id">
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          
          <!-- 三级分类列表 -->
          <view class="cate-lv3-list">
            <!-- 冲锋衣后端数据没有 三级列表 -->
            <view class="cate-lv3-item" v-for="item3 in item2.children" :key="item3.cat_id" @click="goGoodsList(item3)">
              <image :src="item3.cat_icon"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
          
        </view>
      </scroll-view>
    </view>
  </view>
</template>



<style lang="scss" scoped>
  // 2个可滚动板块
  .scroll-view-container {
    display: flex;
  
    .left-scroll-view {
      width: 120px;
  
      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;
  
        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;
  
          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  // 二级分类列表
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  
  // 三级分类列表
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
  
    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
  
      image {
        width: 60px;
        height: 60px;
      }
  
      text {
        font-size: 12px;
      }
    }
  }
</style>
