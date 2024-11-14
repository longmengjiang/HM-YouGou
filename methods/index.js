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