<script setup>
  import { computed, ref } from 'vue'
  
  // 一、输入框的处理  →  防抖
  const timer = ref() // 声明 timer 作为计时器的 容器
  const input = (e)=> {
    // 每次触发input事件，先停止计时器
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      getSearchList(e)
      console.log(historyList.value);
    }, 500)
  }
  
  // 二、根据输入字段返回来结果
  const searchList = ref([])
  const getSearchList = async (e) => {
    // 判断关键词是否为空
    if (e === '') {
      searchList.value = []
      return uni.$showToast('暂无数据', 10)
    }
    // 发起请求，获取搜索建议列表
    const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: e })
    if (res.meta.status !== 200) return uni.$showToast()
    searchList.value = res.message
    saveHistoryList(e)
  }
  
  // 三、点击前往商品详情
  const goodsDetail = (id) => {
    uni.navigateTo({
      // 指定详情页面的 URL 地址，并传递 goods_id 参数
      url: '/goods/goodsDetail/goodsDetail?goods_id=' + id
    })
  }
  
  // 四、搜索历史  →  还要逆转搜索历史的顺序，让后搜索的靠前  →  重复出现的，先删除，再添加  ==> 用Set对象！！！没用过，新知识
  // 希望的修改，点击了选择哪一项再记录搜索历史
  const historyList = ref(uni.getStorageSync('historyList') || [])
  // 添加新的搜索历史记录  并且存储到本地
  const saveHistoryList = (e) => {
    // 1. 将 historyList 数组转化为 Set 对象
    const set = new Set(historyList.value)
    // 2. 删除 新的 元素
    set.delete(e)
    // 3. 加入 新的 元素
    set.add(e)
    // 4. 将 set 对象 转换为 数组
    historyList.value = Array.from(set)
    
    // 5. 存储到本地（存储的是逆转后的数组）
    uni.setStorageSync('historyList', reserveHistoreList.value)
  }
  const reserveHistoreList = computed(()=>  [...historyList.value].reverse()) // 注意：reverse方法会修改原数组!!!，不修改阿，好神奇，错了，还是会修改

  // 五、清空搜索记录
  const clearHistoryList = () => {
    historyList.value = []
    uni.setStorageSync('historyList', reserveHistoreList.value)
  }
  
  // 六、点击(就是)搜索历史，前往商品列表页面  →  参考淘宝
  const goGoodsList = () => {
    uni.navigateTo({
      url:'/goods/goodsList/goodsList'
    })
  }
</script>

<template>
  <view>
    <!-- 一、顶部搜索框 -->
    <uni-search-bar 
      placeholder="搜索" focus radius=150 class="uni-search-bar" cancelButton="none" clearButton="auto"
      @input="input"
    >
    </uni-search-bar>
    
    <!-- 二、搜索建议列表 -->
    <view class="sugg-list" v-if="searchList.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchList" :key="i" @click="goodsDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 三、搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clearHistoryList"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in reserveHistoreList" :key="i" @click="goGoodsList"></uni-tag>
      </view>
    </view>
    
  </view>
</template>


<style lang="scss" scoped>
  .uni-search-bar {
    // 加在组件上不生效  →  框架的不作为！  →  这样也不行  →  老老实实去 改 uni组件源码吧
    .uni-searchbar {
      background-color: #c00000;
    }
  }
  
  // 二、搜索建议列表  （无 '一' ）
  .sugg-list {
    padding: 0 5px;
  
    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  
  // 三、搜索历史
  .history-box {
    padding: 0 5px;
  
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 2px solid #efe2d8;
    }
  
    .history-list {
      display: flex;
      flex-wrap: wrap;
  
      uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
