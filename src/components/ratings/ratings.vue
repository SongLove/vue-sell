<template>
  <div class="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
    </div>
    <div class="rating-scroll" ref="ratings">
      <div>
        <ratingselect @content-toggle="contentToggle" @ratingtype-select="ratingtypeSelect" :ratings="ratings" :only-content="onlyContent" :select-type="selectType"></ratingselect>
        <div class="rating-wrapper">
          <ul>
            <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating, index) in ratings" :key="index" class="rating-item">
              <div class="avatar">
                <img width="28" height="28" :src="rating.avatar"/>
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
                </div>
                <div class="time">
                  {{rating.rateTime | formatDate}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from '../../components/star/star'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import {formatDate} from '../../common/js/date'
const ALL = 2
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      // 可export 一个 formatDate 方法，方便其他组件应用
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  created () {
    this.$http.get('/api/ratings').then((res) => {
      res = res.body
      if (res.errno === ERR_OK) {
        this.ratings = res.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      }
    })
  },
  methods: {
    needShow (type, text) { // 过滤选中评论
      if (this.onlyContent && !text) { // 判断是否显示内容 而且没有内容 就不显示
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    ratingtypeSelect (type) { // 监听ratingselect组件 切换评论 接入type
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    contentToggle (onlyContent) { // 监听ratingselect组件 勾选是否只查看有内容评论
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  components: {
    star,
    split,
    ratingselect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.ratings
  .ratings-content
    .overview
      display flex
      padding 18px
      .overview-left
        padding 6px 0
        flex 0 0 137px
        width 137px
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        @media only screen and (max-width 320px)
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            vertical-align top
            font-size 12px
            line-height 18px
            color rgb(7,17,27)
          .star
            display inline-block
            vertical-align top
            margin 0 12px
          .score
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(255,153,0)
        .delivery-wrapper
          font-size 0
          .title
            font-size 12px
            line-height 18px
            color rgb(7,17,27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147,153,159)
  .rating-scroll
    position absolute
    top 311px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7,17,27,0.1 ))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          margin-bottom 4px
          position relative
          flex 1
          font-size 10px
          color rgb(7,17,27)
        .star-wrapper
          margin-bottom 6px
          font-size 0
          .star
            display inline-block
            margin-right 6px
            vertical-align top
          .delivery
            display inline-block
            vertical-align top
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
        .text
          margin-bottom 8px
          line-height 18px
          color rgb(7,17,27)
          font-size 12px
        .recommend
          line-height 16px
          font-size 0
          .icon-thumb_up, .item
            display inline-block
            margin 0 8px 4px 0
            font-size 9px
          .icon-thumb_up
            color rgb(0,160,220)
          .item
            padding 0 6px
            border: 1px solid rgba(7,17,27,0.1)
            border-radius 1px
            color rgb(147,153,159)
            background #fff
        .time
          position absolute
          top 0
          right 0
          line-height 10px
          font-size 10px
</style>
