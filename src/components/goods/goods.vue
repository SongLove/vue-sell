<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menu">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="ment-item" @click="selectMenu(index, $event)" :class="{'current' : currentIndex === index}">
          <span class="text border-1px">
            <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foods">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food, index) in item.foods" @click="selectFood(food,$event)" class="food-item border-1px" :key="index">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率：{{food.price}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol v-on:cart-add="cartAdd" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food v-on:cart-adds="cartAdds" :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () { // 给cart组件传的参数
      let foods = []
      this.goods.forEach((good) => { // 先拿到goods下面的foods
        good.foods.forEach((food) => {
          if (food.count) { // 判断food.count不为空的话
            foods.push(food) // 就说明此商品被选择过
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((res) => { // 本地模拟请求
      res = res.body
      if (res.errno === ERR_OK) { // 当请求状态为0 时表示请求成功
        this.goods = res.data
        this.$nextTick(() => {
        // vue 在更新DOM的时候是异步的，也就是说虽然改变了数据，
        // 但是DOM还没更新，所以计算不了高度，要用这个方法更新
          this._initScroll()
          this._calculateHeight()
        })
        console.log(this.goods)
      }
    })
  },
  methods: {
    selectMenu (index, event) {
      // 判断是否是原生事件还是派发的时候，
      if (!event._constructed) { // 如果是派发的事件 _constructed是为trun
        // 浏览器原生是没有_constructed属性的
        return
      }
      let foodList = this.$refs.foods.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
      console.log(index)
    },
    _initScroll () { // $els 在vue里面用来选择元素的  BScroll 接收两个参数，一个是元素，一个是object
      this.meunSroll = new BScroll(this.$refs.menu, {
        // 在实例化BScroll 的时候，会阻止默认事件 click true就是给元素派发事件
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foods, {
        // 传这个属性的 让scroll在滚动的时候能实时获取 滚动的位置
        probeType: 3,
        click: true
      })
      // 通过这个foodsScroll 这个对象监听 滚动的  pos就是滚动值
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      // 获取每个food list
      let foodList = this.$refs.foods.getElementsByClassName('food-list-hook')
      // 第一个的高度是0
      let height = 0
      // 先push进去
      this.listHeight.push(height)
      // 用一个循环遍历 获取food list 的个数，
      for (let i = 0; i < foodList.length; i++) {
        // 拿到每个遍历 food list
        let item = foodList[i]
        // 把每个 list 的高度计算起来，相加是要加上上一个list 的高度，才等于当前list 的顶端高度
        height += item.clientHeight - 4
        // 把每个计算好的list 高度加入listHeight
        this.listHeight.push(height)
      }
    },
    cartAdd (target) {
      // 父组件接收到了shopcart的事件，这里来处理
      // 在cartcontrol组件  添加v-on:cart-add="cartAdd" 用来监听
      // 体验优化，异步执行 购物车抛物线小球动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target) // 用ref 定义一个变量shopcart 来访问shopcart组件的方法
      })
    },
    cartAdds (target) {
      // 父组件接收到了shopcart的事件，这里来处理
      // 在cartcontrol组件  添加v-on:cart-add="cartAdd" 用来监听
      // 体验优化，异步执行 购物车抛物线小球动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target) // 用ref 定义一个变量shopcart 来访问shopcart组件的方法
      })
    },
    selectFood (food, event) {
      // 获取单个商品的详情
      if (!event._constructed) {
        return
      }
      console.log(food)
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .ment-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          vertical-align top
          display inline-block
          width 12px
          height 20px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          font-size 12px
          vertical-align middle
          border-1px(#fff)
          width 56px
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(#f3f5f7)
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7,17,27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147,153,159)
          .desc
            line-height 12px
            margin-bottom 8px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147,153,159)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
