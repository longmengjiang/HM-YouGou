<script setup>
  import { ref } from 'vue'
  import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
  
  // 一、声明数据
  const queryObj = ref({
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 20,
  })

  // 二、获取传递的参数  →  告一段落，实在是写不出来
  const data = ref()
  onLoad((e)=> {
    data.value = e
    queryObj.value.query = data.value.query || ''
    queryObj.value.cid = data.value.cid || ''
    getGoodsList()
  })
  
  // 三、获取商品列表模块
  const goodsList = ref([])
  const total = ref(0)
  const isLoading = ref(false)  // true 表示正在请求
  const getGoodsList = async (stopRefreshFunc) => {
    isLoading.value = true
    // 发起请求
    const { data: res } = await uni.$http.get('/api/public/v1/goods/search', queryObj.value)  // 只有刚刚好10个数据
    if (res.meta.status !== 200) return uni.$showToast()
    // 为数据赋值
    goodsList.value = [...goodsList.value, ...res.message.goods] // 为了能够 上拉加载更多
    total.value = res.message.total
    isLoading.value = false
    // 有传入参数就继续执行函数
    stopRefreshFunc && stopRefreshFunc()
  }
  
  // 四、上拉加载更多模块
  onReachBottom(()=> {
    // 正在请求，页码不允许 +1
    if (isLoading.value) return
    queryObj.value.pagenum += 1
    console.log(goodsList.value.length, total.value);
    if(goodsList.value.length >= total.value) return uni.$showToast('暂时没有更多了!')
    getGoodsList()
  })
  
  // 五、下拉刷新模块
  onPullDownRefresh(()=> {
    // 重置所有数据
    queryObj.value.pagenum = 1
    total.value = 0
    isLoading.value = false
    goodsList.value = []
    // 重新发起请求，并且携带停止下拉的函数(因为下拉不会自动停止)
    getGoodsList(() => uni.stopPullDownRefresh())
  })
  
  // 六、导航前往 商品详情页面
  const goGoodsDetail = (goods) => {
    uni.navigateTo({
      url:'/goods/goodsDetail/goodsDetail?goods_id=' + goods.goods_id
    })
  }
</script>

<template>
  <view>
      <view class="goods-list">
        <view v-for="(goods, i) in goodsList" :key="i" @click="goGoodsDetail(goods)">
          <!-- 商品列表 -->
          <my-goods :goods="goods"></my-goods>
        </view>
      </view>
    </view>
</template>

<style lang="scss">
  
</style>
