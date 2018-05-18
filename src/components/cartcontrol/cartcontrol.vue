<template>
    <div class="cartcontrol">
      <transition name="move-fade">
        <div class="cart-decrease" @click.stop.prevent="decreaseCart" v-show="food.count>0">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
  // 从父组件接收 每个商品的信息
  props: {
    food: {
      type: Object
    }
  },
  created () {
  },
  methods: {
    addCart (event) {
      if (!event._constructed) { // 如果是派发的事件 _constructed是为trun
        // 浏览器原生是没有_constructed属性的
        return
      }
      if (!this.food.count) {
        // 在Vue 对象添加一个不存在的观察属性的话，需要调用Vue.set方法
        Vue.set(this.food, 'count', 1)
        this.food.count = 1
      } else {
        this.food.count++
      }
      // 因为要做添加商品过度动画，需要计算点击此加号的页面位置，需要传入此加号的DOM元素
      // 所以点击的时候派发一个事件cart.add ，event.target 作为参数 在父组件接收此事件
      this.$emit('cart-add', event.target)
    },
    decreaseCart (event) {
      if (!event._constructed) { // 如果是派发的事件 _constructed是为trun
        // 浏览器原生是没有_constructed属性的
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      transition all .4s linear
      &.move-fade-enter-active
        opacity 1
        .inner
          transform rotate(0)
      &.move-fade-leave-active
        opacity 0
      &.move-fade-enter, &.move-fade-leave-to
        transform translate3d(24px,0,0)
        .inner
          transform rotate(180deg)
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        transition all .4s linear
        color #00a0dc
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color #00a0dc
</style>
