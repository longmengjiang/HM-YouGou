import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 声明 数据 / 方法
  
  // 购物车的数组，用来存储购物车中每个商品的信息对象
  // 每个商品的信息对象，都包含如下 6 个属性：
  // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
  const ceshi = ref('abc')
  const cartList = ref( uni.getStorageSync('cartList') || [] )
  
  // 一、加入购物车模块  →  顺便要本地存储，真实情况应该是存储到后端
  const addGoodsToCartList = (goods) => {
    // 判断购物车有没有该商品，有则加，没有则推入到cartList数组里
    // 根据提交的商品的Id，查询购物车中是否存在这件商品
    // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
    const findResult = cartList.value.find((ele) => ele.goods_id === goods.goods_id)
    if (!findResult) {
      // 如果购物车中没有这件商品，则直接 push
      cartList.value.push(goods)
    } else {
      // 如果购物车中有这件商品，则只更新数量即可
      findResult.goods_count++         // 为什么这样反而可以加上商品的数量？？？？？？？？？？？
      // cartList.value[0].goods_count++  // 为什么这样不行？？？？？？？？？？？
      // 答案来了：第一，cartList.value是一个数组，不是具体到某个商品
      //          第二，上面的 findResult使用了 find方法，使得  findResult本身就是那件商品的 引用 ！！！
      // console.log(cartList.value[0].goods_count) // 这样就可以加了，只不过不方便
    }
    setBadge() // 更改tabbar导航栏的购物车数量
    saveToLocalStorage() // 购物车清单存储到本地
  }
  
  // 二、计算商品总数 total
  const cartTotal = computed(() => {
    return cartList.value.reduce( (pre, current) => pre += current.goods_count, 0 )
  })
  
  // 三、本地存储购物车列表数据
  const saveToLocalStorage = () => {
    uni.setStorageSync('cartList', cartList.value)
    uni.setStorageSync('cartTotal', cartTotal.value)
  }
  
  // 四、全局设置 购物车 的商品数量
  const setBadge = () => {
    // 调用 uni.setTabBarBadge() 方法，为tabBar导航栏 的 购物车设置右上角的徽标
    if(cartTotal.value === 0) return uni.removeTabBarBadge({
      index: 2
    })
    // uni.removeTabBarBadge
    uni.setTabBarBadge({
      index: 2, // 索引  首页、分类、购物车、我的  索引是'2'
      text: cartTotal.value + '', // 注意：text 的值必须是字符串，不能是数字
    })
  }
  
  // 五、更改购物车页面的商品勾选状态
  const updateGoodsState = (ele) => {
    // 首选找到要更改的商品，再改变值  →  用数组的find方法  →  返回值就相当于 其引用
    const findResult = cartList.value.find( findEle => findEle.goods_id === ele.goods_id )
    
    // 加个判断，减少压力
    if(findResult) findResult.goods_state = ele.goods_state
    setBadge() // 更改tabbar导航栏的购物车数量  没有发生变化 是因为 此举动没有改变商品总数
    saveToLocalStorage() // 存储到本地
  }
  
  // 六、更改购物车页面的单个商品数量
  const updateGoodsCount = (ele) => {
    // 首选找到要更改的商品，再改变值  →  用数组的find方法  →  返回值就相当于 其引用
    const findResult = cartList.value.find( findEle => findEle.goods_id === ele.goods_id )
    
    // 加个判断，减少压力
    if(findResult) findResult.goods_count = ele.goods_count
    setBadge() // 更改tabbar导航栏的购物车数量
    saveToLocalStorage() // 存储到本地
  }
  
  // 七、删除购物车的某个商品
  const deleteGoods = (goods) => {
    // 使用filter过滤器来判断谁不需要删除，从而保留赋值给cartList
    const filterResult = cartList.value.filter( ele => ele.goods_id !== goods.goods_id )
    cartList.value = filterResult
    setBadge() // 更改tabbar导航栏的购物车数量
    saveToLocalStorage() // 存储到本地
  }
  
  // 八、定义已勾选的商品总数量
  const checkedGoodsCount = computed(() => {
    // 先筛选已勾选的，再相加
    return cartList.value.filter( ele => ele.goods_state ).reduce((pre, current) => pre += current.goods_count, 0)
  })
  
  // 九、更新已勾选的状态
  const updateCheckedGoodsState = (state) => {
    cartList.value.forEach( ele => ele.goods_state = state)
    setBadge() // 更改tabbar导航栏的购物车数量
    saveToLocalStorage() // 存储到本地，很神奇，这里存储到本地后，全选反选 就出bug
  }
  
  // 十、商品总价格（已勾选）
  const checkedGoodsAmount = computed(() => {
    return cartList.value.filter( ele => ele.goods_state ).reduce( (pre, current) => pre += current.goods_count * current.goods_price, 0 ).toFixed(2)
  })
  
  // 返回暴露出去 数据 / 方法
  return {
    ceshi,
    cartList,
    
    cartTotal,
    checkedGoodsCount,
    checkedGoodsAmount,
    
    addGoodsToCartList,
    setBadge,
    updateGoodsState,
    updateGoodsCount,
    deleteGoods,
    updateCheckedGoodsState
  }
  //   无法这样开启持久化，另寻他法吧  万一呢 我还没有试过，不想试了
  // {
  //   // 记得开启持久化
  //   persist: {
  //     key: 'useCounterStore', // 自定义持久化键名
  //     storage: localStorage, // 指定存储方式
  //     pick: ['cartList'] // 指定要持久化的数据, 不指定则全部持久化
  //   }
  // }
})