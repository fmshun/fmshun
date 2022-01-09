<template>
  <div class="select_box cycle_container">
    <div class="cycle_content">
      <div class="title flex flex_middle">
        <div @click="$emit('timeBoxClose')" class="cycle_content_cancel">
          取消
        </div>
        <div class="cycle_content_title flex_item text_center">
          {{ titleName }}
        </div>
        <div @click="confirm" class="cycle_content_confirm">确认</div>
      </div>
      <div class="cycle_swipers flex text_center">
        <div class="swiper-container time_period flex_item">
          <div class="swiper-wrapper">
            <div
              v-for="(item, index) in periodArr"
              :key="index"
              class="swiper-slide"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="swiper-container time_rate flex_item">
          <div class="swiper-wrapper">
            <div
              v-for="(item, index) in rateArr[nowPeriodIndex]"
              :key="index"
              class="swiper-slide"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="swiper-container day_rate flex_item">
          <div class="swiper-wrapper">
            <div
              v-for="(item, index) in dayArr[nowPeriodIndex][nowRateIndex]"
              :key="index"
              class="swiper-slide"
            >
              {{ item }}
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

export default {
  name: 'Cycle',
  props: {
    titleName: String,
    dateRange: Object,
    period: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    day: {
      type: Number,
      default: 0,
    },
    dateMaxMin: Object,
  },
  data() {
    return {
      periodSwiper: null,
      rateSwiper: null,
      daySwiper: null,
      nowPeriodIndex: 0,
      nowRateIndex: 0,
      dateName: {
        year: '',
        month: '',
        day: '',
      },
    }
  },
  computed: {
    periodArr() {
      return this.dateRange.years
    },
    rateArr() {
      return this.dateRange.months
    },
    dayArr() {
      return this.dateRange.days
    },
  },
  mounted() {
    this.nowPeriodIndex = this.period //先确定好遍历的数组
    this.nowRateIndex = this.rate

    this.dateName.year = this.dateRange.years[this.period]
    this.dateName.month = this.dateRange.months[this.period][this.rate]
    this.dateName.day = this.dateRange.days[this.period][this.rate][this.day]

    this.$nextTick(() => {
      // 初始化swiper
      this.initSwipers()
      // 绑定swiper事件
      this.bindSwipers()

      $('.cycle_container')[0].addEventListener(
        'touchmove',
        function(e) {
          e.preventDefault()
        },
        { passive: false }
      ) //禁止页面滑动
    })
  },
  methods: {
    // ---------------init
    // 初始化swiper
    initSwipers() {
      this.initPeriodSwiper()
      this.initRateSwiper()
      this.initDaySwiper()
    },
    initPeriodSwiper() {
      this.periodSwiper = new Swiper('.time_period', {
        direction: 'vertical',
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        centeredSlides: true,
        initialSlide: this.period,
      })
    },
    initRateSwiper() {
      this.rateSwiper = new Swiper('.time_rate', {
        direction: 'vertical',
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        centeredSlides: true,
        initialSlide: this.rate,
      })
      let _this = this
      //定时 否则不生效？？？？
      setTimeout(() => {
        _this.rateSwiper.slideTo(_this.rate, 0, false)
      }, 100)
    },
    initDaySwiper() {
      this.daySwiper = new Swiper('.day_rate', {
        direction: 'vertical',
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        centeredSlides: true,
        initialSlide: this.day,
      })
      let _this = this
      //定时 否则不生效？？？？
      setTimeout(() => {
        _this.daySwiper.slideTo(_this.day, 0, false)
      }, 100)
    },
    // ---------------bindEvent
    bindSwipers() {
      // 滑动左侧时，右侧实时变动
      this.periodSwiper
        .off('slideChangeTransitionStart')
        .on('slideChangeTransitionStart', () => {
          this.nowPeriodIndex = this.periodSwiper.activeIndex
          this.dateName.year = this.dateRange.years[
            this.periodSwiper.activeIndex
          ]
          let newD = `${this.dateName.year}${this.dateName.month}${this.dateName.day}`
          if (newD >= this.dateMaxMin.min && newD <= this.dateMaxMin.max) {
            //找到名称对应的索引
            this.nowRateIndex = this.dateRange.months[
              this.periodSwiper.activeIndex
            ].indexOf(this.dateName.month)
            setTimeout(() => {
              this.rateSwiper.slideTo(this.nowRateIndex, 0, false)
              this.daySwiper.slideTo(
                this.dateRange.days[this.periodSwiper.activeIndex][
                  this.nowRateIndex
                ].indexOf(this.dateName.day),
                0,
                false
              )
            }, 100)
          } else {
            this.nowRateIndex = 0
            this.dateName.month = this.dateRange.months[
              this.periodSwiper.activeIndex
            ][0]
            this.dateName.day = this.dateRange.days[
              this.periodSwiper.activeIndex
            ][0][0]
            setTimeout(() => {
              //因为slideTo不会触发滑动事件,所有手动置0
              this.rateSwiper.slideTo(0, 0, false)
              this.daySwiper.slideTo(0, 0, false)
            }, 100)
          }
        })

      this.rateSwiper
        .off('slideChangeTransitionStart')
        .on('slideChangeTransitionStart', () => {
          this.nowRateIndex = this.rateSwiper.activeIndex
          this.dateName.month = this.dateRange.months[
            this.periodSwiper.activeIndex
          ][this.rateSwiper.activeIndex]
          let index = this.dateRange.days[this.periodSwiper.activeIndex][
            this.nowRateIndex
          ].indexOf(this.dateName.day)
          if (index > -1) {
            //找到名称对应的索引
            setTimeout(() => {
              this.daySwiper.slideTo(index, 0, false)
            }, 100)
          } else {
            this.dateName.day = this.dateRange.days[
              this.periodSwiper.activeIndex
            ][this.nowRateIndex][0]
            setTimeout(() => {
              //因为slideTo不会触发滑动事件,所有手动置0
              this.daySwiper.slideTo(0, 0, false)
            }, 100)
          }
        })

      this.daySwiper
        .off('slideChangeTransitionStart')
        .on('slideChangeTransitionStart', () => {
          this.dateName.day = this.dateRange.days[
            this.periodSwiper.activeIndex
          ][this.rateSwiper.activeIndex][this.daySwiper.activeIndex]
        })
    },
    // 点击弹窗确定
    confirm() {
      this.$emit(
        'click-cycle-confirm',
        {
          index: this.periodSwiper.activeIndex,
          name: this.dateName.year,
        },
        {
          index: this.rateSwiper.activeIndex,
          name: this.dateName.month,
        },
        {
          index: this.daySwiper.activeIndex,
          name: this.dateName.day,
        }
      )
    },
  },
}
</script>

<style lang="less">
@import './Common.less';
@import './Cycle.less';
.select_box.cycle_container .cycle_content .title .cycle_content_cancel,
.select_box.cycle_container .cycle_content .title .cycle_content_confirm {
  line-height: 24px;
}
.select_box.cycle_container .cycle_content .title .cycle_content_title {
  margin-right: 0;
}
.select_box.cycle_container
  .cycle_content
  .cycle_swipers
  .swiper-container::after {
  right: 0;
  left: 0;
}
.select_box.cycle_container
  .cycle_content
  .cycle_swipers
  .swiper-container::before {
  right: 0;
  left: 0;
}
</style>
