<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :key="itemClass.index" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'
export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: { // 计算属性
    starType () {
      return 'star-' + this.size
    },
    itemClasses () { // 计算获取星星数
      let result = [] // 定义一个数组让span遍历
      let score = Math.floor(this.score * 2) / 2 // score是传过来的分数值，有1.1 4.1浮点数，向下取整
      let hasDecimal = score % 1 !== 0 // 判断是否有半星 例如4.5
      let integer = Math.floor(score) // 数值取整 表示整星
      for (let i = 0; i < integer; i++) { // 取得全星
        result.push(CLS_ON)
      }
      if (hasDecimal) { // 如果得到分数有半星，将添加一个半星
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) { // 如果数组没有满5 有没有半星，添加全灰星
        result.push(CLS_OFF)
      }
      return result // 返回最后的星星 类名数组
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .star
    font-size:0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width 12px
        height 13px
        margin-right 6px
        background-size 12px 13px
        &:last-child
          margin-right 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width 12px
        height 13px
        margin-right 6px
        background-size 12px 13px
        &:last-child
          margin-right 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
