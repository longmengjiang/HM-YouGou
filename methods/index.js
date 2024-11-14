// 说明：存储公共的方法，例如弹窗等等

// toast弹窗
export const $showToast = (title = '数据加载失败！', duration = 1500, icon = 'none') => {
  uni.showToast({
      title,
      duration,
      icon,
    })
}

// loading弹窗
export const $showLoading = (title = '数据加载中', icon = 'none') => {
  uni.showLoading({
    title,
    icon
  })
}

// 获取所在设备的信息  →  宽度、高度、型号、可用宽 / 高 度 等等
export const $deviceInfo = uni.getWindowInfo()  // screenHeight 机身高度    windowHeight 页面可用屏幕高度(不包含标题、导航栏)