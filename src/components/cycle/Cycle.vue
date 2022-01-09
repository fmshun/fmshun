<template>
  <div class="cycle_container">
    <div class="cycle_content">
      <div class="title flex flex_middle">
        <div @click="$emit('click-cycle-close')" class="cycle_content_cancel">
          取消
        </div>
        <div class="cycle_content_title flex_item text_center">
          设置定投周期
        </div>
        <div @click="confirm" class="cycle_content_confirm">确认</div>
      </div>
      <div class="cycle_swipers flex text_center">
        <div class="period_container swiper-container">
          <div class="swiper-wrapper">
            <div
              @click="changePeriodSwiper(index)"
              v-for="(item, index) in periodArr"
              :key="index"
              class="swiper-slide"
            >
              <div>{{ item }}</div>
            </div>
          </div>
        </div>
        <div class="rate_container swiper-container">
          <div class="swiper-wrapper">
            <div
              @click="changeRateSwiper(index)"
              v-for="(item, index) in rateArr[nowPeriodIndex]"
              :key="index"
              class="swiper-slide"
            >
              <div>{{ formatWeek(item) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/libs/swiper4.5.css'
import '@/libs/swiper4.5.min.js'
import { cycleInfos } from '@/components/Common'
export default {
  name: 'Cycle',
  props: {
    period: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      periodArr: cycleInfos.periods,
      rateArr: cycleInfos.rates,
      nowPeriodIndex: 0,
      periodSwiper: null,
      rateSwiper: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // ---------------init
    init() {
      let _this = this
      _this.nowPeriodIndex = _this.period
      _this.$nextTick(() => {
        _this.initSwiper()
        _this.bindSwipers()
      })
    },
    initSwiper() {
      let Swiper = window.Swiper
      this.periodSwiper = new Swiper('.period_container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        centeredSlides: true,
      })
      this.rateSwiper = new Swiper('.rate_container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        centeredSlides: true,
      })
      this.periodSwiper.slideTo(this.period || 0, 0, false)
      this.rateSwiper.slideTo(this.rate, 0, false)
    },
    // ---------------bindEvent
    bindSwipers() {
      let _this = this
      // 滑动左侧时，右侧实时变动
      _this.periodSwiper
        .off('slideChangeTransitionStart')
        .on('slideChangeTransitionStart', () => {
          _this.nowPeriodIndex = _this.periodSwiper.activeIndex
          _this.rateSwiper.slideTo(0, 0, false)
        })
    },
    // 点击弹窗确定
    confirm() {
      this.$emit(
        'click-cycle-confirm',
        this.periodSwiper.activeIndex,
        this.rateSwiper.activeIndex
      )
    },
    formatWeek(item) {
      let str = ''
      if (item.indexOf('周') >= 0) {
        str = item.replace('周', '星期')
      } else {
        str = item
      }
      return str
    },
    changePeriodSwiper(index) {
      if (this.nowPeriodIndex !== index) {
        this.periodSwiper.slideTo(index || 0, 0, false)
        this.nowPeriodIndex = this.periodSwiper.activeIndex
        this.rateSwiper.slideTo(0, 0, false)
      }
    },
    changeRateSwiper(index) {
      this.rateSwiper.slideTo(index || 0, 0, false)
    },
  },
}
</script>

<style lang="less" scoped>
@import '../Common.less';
@import './Cycle.less';
</style>
