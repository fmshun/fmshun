<template>
  <div class="cycle_box cycle_container">
    <div class="cycle_content">
      <div class="title flex flex_middle">
        <div @click="$emit('cycleClose')" class="cycle_content_cancel">
          取消
        </div>
        <div class="cycle_content_title flex_item text_center">
          {{ titleName }}
        </div>
        <div @click="confirm" class="cycle_content_confirm">确认</div>
      </div>
      <div class="cycle_swipers flex text_center">
        <div class="swiper-container cc_period flex_item">
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
        <div class="swiper-container cc_rate flex_item">
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
      </div>
    </div>
  </div>
</template>

<script>
import "@/libs/swiper4.5.css";
import "@/libs/swiper4.5.min.js";
import cycleInfos from "./cycle";

export default {
  name: "Cycle",
  props: {
    titleName: String,
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
      periodSwiper: null,
      rateSwiper: null,
      periodArr: cycleInfos.periods,
      rateArr: cycleInfos.rates,
      nowPeriodIndex: 0,
    };
  },
  mounted() {
    this.nowPeriodIndex = this.period;
    this.$nextTick(() => {
      // 初始化swiper
      this.initSwipers();
      // 绑定swiper事件
      this.bindSwipers();

      $(".cycle_container")[0].addEventListener(
        "touchmove",
        function (e) {
          e.preventDefault();
        },
        { passive: false }
      ); //禁止页面滑动
    });
  },
  methods: {
    // 初始化swiper
    initSwipers() {
      this.initPeriodSwiper();
      this.initRateSwiper();
    },
    initPeriodSwiper() {
      this.periodSwiper = new Swiper(".cc_period", {
        direction: "vertical",
        slidesPerView: "auto",
        observer: true,
        observeParents: true,
        centeredSlides: true,
        initialSlide: this.period || 0,
      });
    },
    initRateSwiper() {
      this.rateSwiper = new Swiper(".cc_rate", {
        direction: "vertical",
        slidesPerView: "auto",
        observer: true,
        observeParents: true,
        centeredSlides: true,
        initialSlide: this.rate,
      });
      let _this = this;
      //定时 否则不生效？？？？
      setTimeout(function () {
        _this.rateSwiper.slideTo(_this.rate, 0, false);
      }, 100);
    },
    // ---------------bindEvent
    bindSwipers() {
      let _this = this;
      // 滑动左侧时，右侧实时变动
      _this.periodSwiper
        .off("slideChangeTransitionStart")
        .on("slideChangeTransitionStart", () => {
          _this.nowPeriodIndex = _this.periodSwiper.activeIndex;
          _this.rateSwiper.slideTo(0, 0, false);
        });
    },
    // 点击弹窗确定
    confirm() {
      this.$emit(
        "click-cycle-confirm",
        {
          index: this.periodSwiper.activeIndex,
          name: cycleInfos.periods[this.periodSwiper.activeIndex],
        },
        {
          index: this.rateSwiper.activeIndex,
          name: cycleInfos.rates[this.periodSwiper.activeIndex][
            this.rateSwiper.activeIndex
          ],
        }
      );
    },
  },
};
</script>

<style lang="less">
@import "./Common.less";
@import "./Cycle.less";
.cycle_box.cycle_container .cycle_content .title .cycle_content_cancel,
.cycle_box.cycle_container .cycle_content .title .cycle_content_confirm {
  line-height: 24px;
}
.cycle_box.cycle_container .cycle_content .title .cycle_content_title {
  margin-right: 0;
}
</style>
