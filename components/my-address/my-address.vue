<script setup>
  import { ref, watch } from 'vue'
  import { useUserStore } from '@/store'
  
  const userStore = useUserStore()
  
  // 一、收货地址的按需展示模块
  const address = ref(userStore.address) // 收货地址的所有信息（包括请求成功）
  const addressString = ref(userStore.addressString) // 仅仅包含 类似 身份证的收货地址

  // 二、选择收获地址模块
  const chooseAddress = async () => {
    // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
    //    返回值res: 收货地址的所有信息（包括请求成功）
    const res = await uni.chooseAddress().catch(err => err)
    
    // 2. 用户成功的选择了收货地址
    if (res.errMsg === 'chooseAddress:ok') {
      // 调取商店的方法，更新个人地址详情以及地址
      return userStore.updateAddress(res)
      // console.log(address.value) // 此时是 {}
    }
    
     // 3. 用户没有授权
    if (res && (res.errMsg === 'chooseAddress:fail auth deny' || res.errMsg === 'chooseAddress:fail authorize no response') ) {
      reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
    }
  }
  
  // 三、调用此方法，重新发起收货地址的授权
  const reAuth = async () => {
    // 3.1 提示用户对地址进行授权
    const [err2, confirmResult] = await uni.showModal({
      content: '检测到您没打开地址权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
    })
  
    // 3.2 如果弹框异常，则直接退出
    if (err2) return
  
    // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
    if (confirmResult.cancel) return uni.$showToast('您取消了地址授权！')
  
    // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
    if (confirmResult.confirm) return uni.openSetting({
      // 3.4.1 授权结束，需要对授权的结果做进一步判断
      success: (settingResult) => {
        // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
        if (settingResult.authSetting['scope.address']) return uni.$showToast('授权成功！请选择地址')
        // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
        if (!settingResult.authSetting['scope.address']) return uni.$showToast('您取消了地址授权！')
      }
    })
  }
  
  // 四、监听收获地址的变化
  watch(
    () => userStore,
    (value) => {
      address.value = value.address
      addressString.value = value.addressString
      console.log('111', addressString.value)
    },
    {
      deep: true
    }
  )
</script>

<template>
  <view>
  
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
  
    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：<text>{{address.userName}}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{address.telNumber}}</text></view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addressString}}</view>
      </view>
    </view>
  
    <!-- 底部的边框线 -->
    <image src="@/static/c9.png" class="address-border"></image>
  </view>
</template>

<style lang="scss" scoped>
  // 底部边框线的样式
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }
  
  // 选择收货地址的盒子
  .address-choose-box {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  // 渲染收货信息的盒子
  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
  
    // 第一行
    .row1 {
      display: flex;
      justify-content: space-between;
  
      .row1-right {
        display: flex;
        align-items: center;
  
        .phone {
          margin-right: 5px;
        }
      }
    }
  
    // 第二行
    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;
  
      .row2-left {
        white-space: nowrap;
      }
    }
  }
</style>