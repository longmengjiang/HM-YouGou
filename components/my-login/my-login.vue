<script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/store'
  
  const userStore = useUserStore()
  
  // 定义 头像 / 昵称
  const userInfo = ref({
    nickname: '',
    avatar: ''
  })
  
  // 一、点击登录模块（实际上现在只是获取了头像信息而已）
  const chooseavatar = async (e) => {
    if(!userInfo.value.nickname) return uni.$showToast('请输入昵称')
    // 判断是否获取用户信息成功
    console.log(e.detail.avatarUrl)
    userInfo.value.avatar = e.detail.avatarUrl
    
    // 传送一个假的token吧，没办法了
    userStore.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
    userStore.updateNewUserInfo(userInfo.value)
    navigateBack()
    
    // 旧文档：if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showToast('您取消了登录授权！')
    // 旧文档：获取用户信息成功， e.detail.userInfo 就是用户的基本信息
        
    // 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 code2Session，使用 code 换取 openid、unionid、session_key 等信息
    const res = await uni.login().catch(err => err)
    // 判断 uni.login() 是否调用失败
    if (res.errMsg !== 'login:ok') return uni.$showToast('登录失败！') 
  }
  
  // 二、获取昵称模块
  const getNickname = (e) => {
    userInfo.value.nickname = e.detail.value
  }
  
  // 三、判断是否需要跳转回去购物车页面（点击结算时未登录会跳转到登录页面）
  const navigateBack = () => {
    // 如果商店的 redirectInfo对象是空，则不用跳转
    if(!userStore.redirectInfo) return
    uni.switchTab({
      url: userStore.redirectInfo.from,
      // 无论导航成功/失败，把 vuex 中的 redirectInfo 对象重置为 {}
      complete: () => {
        userStore.updateRedirectInfo({})
      }
    })
  }
</script>

<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
    <button type="primary" class="btn-login" open-type="chooseAvatar" @chooseavatar="chooseavatar">一键登录</button>
    
    <!-- 获取昵称 -->
    <label for="" class="nicknameInputLabel">
      <span class="span">昵称</span>
      <input class="nicknameInput" type="nickname" placeholder="请输入昵称" @change="getNickname"/>
    </label>
    
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
    <view class="">
      温馨提示：仅小程序能够登录，app无法一键登录
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    padding-top: 20rpx;
    font-size: 12px;
    color: gray;
  }
}
.nicknameInputLabel {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  width: 750rpx;
  height: 100rpx;
  display: flex;
  
  .span {
    display: inline-block;
    // width: 300rpx;
    height: 100rpx;
    line-height: 100rpx;
    padding-left: 50rpx;
  }
  
  .nicknameInput {
    width: 450rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
}

</style>