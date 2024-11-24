<script setup>
  import { ref, computed } from 'vue'
  import { useCartStore, useUserStore } from '@/store'
  
  const cartStore = useCartStore()
  const userStore = useUserStore()
  
  // 一、声明计算属性 用 商品总数 === 已勾选的商品总数 判断isFullChecked 的值
  const isFullChecked = computed(()=> {
    if(cartStore.cartTotal === 0) return false
    return cartStore.cartTotal === cartStore.checkedGoodsCount
  })
  
  // 二、全选/反选 模块
  const updateCheckedGoodsState = () => {
    cartStore.updateCheckedGoodsState(!isFullChecked.value)
  }
  
  // 三、根据用户是否 选择地址/商品 / 是否登录 来判断 点击 "结算商品后" 是否能够跳转到登录页面
  const settlement = () => {
    if (!userStore.newUserInfo.nickname) return delayNavigate()
    if (!cartStore.checkedGoodsCount) return uni.$showToast('请选择要结算的商品!')
    console.log(userStore.addressString)
    if (!userStore.addressString) return uni.$showToast('请先选择收获地址!')
    
    // 创建订单
    payOrder()
  }
  
  // 四、点击结算，未登录时的处理  →  延迟3s后跳转到登录页面
  const seconds = ref(3)
  const timer = ref()
  const showTips = (n) => {
    uni.showToast({
      icon: 'none',
      title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
      // 为页面添加透明遮罩，防止点击穿透
      mask: true,
      // 1.5 秒后自动消失
      duration: 1500
    })
  }
  const delayNavigate = () => {
    // 1. 展示提示消息，此时 seconds 的值等于 3
    showTips(seconds.value)
    
     // 创建定时器，每隔 1 秒执行一次
    timer.value = setInterval(() => {
      // 先让秒数自减 1
      seconds.value--
      
      // 2. 判断秒数是否 <= 0
      if (seconds.value <= 0) {
        // 2.1 清除定时器
        clearInterval(timer.value)
  
        // 2.2 跳转到 my 页面
        uni.switchTab({
          url: '/pages/my/my',
          complete: () => {
            // 调用商店的 更新redirectInfo的方法
            userStore.updateRedirectInfo({
              // 跳转的方式
              openType: 'switchTab',
              // 从哪个页面跳到登录页面的
              from: '/pages/cart/cart'
            })
          }
        })
  
        // 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
        return seconds.value = 3
      }
      
      // 2.2 再根据最新的秒数，进行消息提示
      showTips(seconds.value)
    }, 1000)
  }
  
  // 五、创建订单的函数
  const payOrder = async () => {
    // 1. 创建订单
    // 1.1 组织订单的信息对象
    const orderInfo = {
      // 开发期间，注释掉真实的订单价格，
      // order_price: this.checkedGoodsAmount,
      // 写死订单总价为 1 分钱
      order_price: 0.01,
      consignee_addr: userStore.addressString,
      goods: cartStore.cartList.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
    }
    // 1.2 发起请求创建订单
    const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
    console.log('111', res) // {msg: "创建订单成功", status: 200}
    if (res.meta.status !== 200) return uni.$showToast('创建订单失败！')
    // 1.3 得到服务器响应的“订单编号”
    const orderNumber = res.message.order_number
  
    // 创建订单成功！！！
    
    // 2. 订单预支付
    // 2.1 发起请求获取订单的支付信息
    const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
    console.log('222', res2) // {msg: "预付订单生成成功", status: 200}
    // 2.2 预付订单生成失败
    if (res2.meta.status !== 200) return uni.$showToast('预付订单生成失败！')
    // 2.3 得到订单支付相关的必要参数
    const payInfo = res2.message.pay
    console.log(payInfo) // 下面这段就是 payInfo
    // 预付订单生成成功！！！  成功又失败了
    /* 
      err_code: "NOAUTH"
      err_code_des: "此商家的收款功能已被限制，暂无法支付。商家可登录微信商户平台/微信支付商家助手小程序/经营账户页面查看原因和解决方案。"
      nonce_str: "TSZmdtnWRdMge8Rj"
      result_code: "FAIL"
      return_code: "SUCCESS"
      return_msg: "OK"
      sign: "23198456EDDA0505F542611AD559164C"
    */
    if(payInfo.err_code === "NOAUTH") return uni.$showToast('此商家的收款功能已被限制，暂无法支付')
   
   
    // 3. 发起微信支付
    // 3.1 调用 uni.requestPayment() 发起微信支付
    const [err, succ] = await uni.requestPayment(payInfo)
    console.log('333', err, succ)
    // 3.2 未完成支付
    if (err) return uni.$showToast('订单未支付！')
    // 3.3 完成了支付，进一步查询支付的结果
    const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
    // 3.4 检测到订单未支付
    if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
    // 3.5 检测到订单支付完成
    uni.showToast({
      title: '支付完成！',
      icon: 'success'
    })
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
      <view class="btn-settle" @click="settlement">结算({{ cartStore.checkedGoodsCount }})</view>
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