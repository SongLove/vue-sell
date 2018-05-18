<template>
  <div>
    <div class="shopcart">
      <div class="countent" @click="toggleList">
        <div class="countent-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'hightlight':totalCount != 0}">
              <i class="icon-shopping_cart"></i>
            </div>
            <div v-show="totalCount!=0" class="num">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'hightlight':totalCount != 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}} 元</div>
        </div>
        <div @click.stop.prevent="pay" class="countent-right">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition v-on:before-enter="beforeEnter"
                      v-on:enter="enter"
                      v-on:after-enter="afterEnter" name="drop-fade" >
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="emptylist">清空</span>
          </div>
          <div class="list-content" ref="listheader">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fades">
      <div @click="hideList" class="list-mask" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
import cartcontrol from "../cartcontrol/cartcontrol";
import BScroll from 'better-scroll'
export default {
  components: {cartcontrol},
  props: {
    // 父组件传递一个selectFoods 数组，记录购买商品的数量
    // 传递购买个数 与购买商品的单价
    selectFoods: {
      type: Array,
      default () {
        return [
          {}
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        {show: false},
        {show: false},
        {show: false},
        {show: false}
      ],
      dropBalls: [],
      fole: true
    }
  },
  created () {
    console.log(this.selectFoods)
  },
  updated () {
  },
  computed: {
    totalPrice () {
      let total = 0
      // 遍历相加得出购买商品总价
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      }else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      }else{
        return `去结算`
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      }else{
        return 'enough'
      }
    },
    listShow () {
      // 购买商品展开列表控制
      // this.totalCount > 0表示有选择的商品  收起
      if (!this.totalCount) {
        this.fole = true
        return false
      }
      let show = !this.fole
      if(show){
        this.$nextTick(() => {
         if (!this.scroll) {
           this.scroll = new BScroll(this.$refs.listheader,{
             click: true
           })
         }else{
           this.scroll.refresh()
         }
        })
      }
      return show
    }
  },
  methods: {
    drop (el){ // el接收goods 组件传过来的加号DOM
      console.log(el)
      // 在五个球体里面取一个出来做动画
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true
          ball.el = el
          // dropBalls添加 球体的状态以及球体DOM
          this.dropBalls.push(ball)
          return
        }
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fole = !this.fole
    },
    beforeEnter (el) {
      console.log(1)
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter (el) {
      console.log(2)
      // 添加下面的注释是让vue 重绘，重新计算高度
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter (el) {
      console.log(1)
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    emptylist () {
      // 把选择商品的数量清空
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideList(){
      this.fole = true
    },
    pay () {
      // 小于配送价的时候 return
      if(this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background #000
    .countent
      display flex
      background #141d27
      flex 0
      color rgba(255,255,255,.4)
      .countent-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .num
            position: absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px;
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.hightlight
              background rgb(0,160,220)
              .icon-shopping_cart
                color #fff
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,.1)
          font-size 16px
          font-weight 700
          &.hightlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 10px
      .countent-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          background #2b333b
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-fade-enter-active
          transition all .4s cubic-bezier(0.49,-0.29,0.75,0.41)
          .inner
            width 16px
            height 16px
            border-radius 50%
            background #00a0dc
            transition all .4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transition  all .5s
      transform translate3d(0,-100%,0)
      &.fold-leave-active
        transform translate3d(0,0,0)
      &.fold-enter, &.fole-leave-to
        transform translate3d(0,0,0)
      .list-header
        height 40px
        line-height 40px
        padding 0 10px
        background #f3f5f7
        border-bottom 2px solid rgba(7,17,27,.1)
        .title
          float left
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    -webkit-backdrop-filter blur(10px)
    transition all .2s
    background rgba(7,17,27,.6)
    &.fades-enter, &.fades-leave-to
      opacity 1
    &.fades-enter-active, &.fades-leave-active
      opacity 0
      background rgba(7,17,27,0)
</style>
