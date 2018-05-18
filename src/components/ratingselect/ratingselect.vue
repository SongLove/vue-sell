<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block postive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block postive" :class="{'active':selectType===0}">{{desc.positve}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negtives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看内容的评价</span>
    </div>
  </div>
</template>

<script>
const POSITIVE = 0 // 正向评价
const NEGATIVE = 1 // 负向评价
const ALL = 2 // 全部评价
export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: { // 选择类型
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: { // 描述
      type: Object,
      default () {
        return {
          all: '全部',
          positve: '满意',
          negative: '不满意'
        }
      }
    }
  },
  computed: {
    positives () { // 正向评论
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negtives () { // 负向评论
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select (type, event) { // 切换评论 传入type
      if (!event._constructed) {
        return
      }
      this.$emit('ratingtype-select', type)
    },
    toggleContent () { // 勾选是否只查看有内容评论
      if (!event._constructed) {
        return
      }
      this.$emit('content-toggle', this.onlyContent)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.ratingselect
  .rating-type
    padding 18px 0
    margin 0 18px
    border-1px(rgba(7,17,27,0.1))
    font-size 0
    .block
      display inline-block
      padding 8px 12px
      line-height 16px
      margin-right 8px
      border-radius 1px
      color rgb(77,85,93)
      font-size 12px
      &.active
        color #fff
      .count
        margin-left 2px
        font-size 8px
      &.postive
        background rgba(0,160,220,0.2)
        &.active
          background #00a0dc
      &.negative
        background rgba(77,85,93,0.2)
        &.active
          background rgb(77,85,93)
  .switch
    padding 12px 18px
    line-height 24px
    border-bottom 1px solid rgba(7,17,27,0.1)
    color rgb(147,153,159)
    font-size 0
    &.on
      .icon-check_circle
        color #00c850
    .icon-check_circle
      display inline-block
      vertical-align top
      margin-right 4px
      font-size 24px
    .text
      font-size 12px
</style>
