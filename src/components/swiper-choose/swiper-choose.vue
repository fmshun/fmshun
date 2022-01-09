<template>
  <div class="swiper-choose-pop">
    <div class="content">
      <div class="head">
        <span class="btn cancel" @click="cancelHandler">取消</span>
        <span class="title">{{ title || '' }}</span>
        <span class="btn confirm" @click="confirmHandler">完成</span>
      </div>
      <div class="inner-w">
        <div class="swiper-container" :style="mT">
          <!-- <span class="">固定的文字</span> -->
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(item, index) in list"
              :key="item.message"
              @click="changePeriodSwiper(index)"
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
// import loadScripts from '@/utils/loadScripts'
import '@/libs/swiper4.5.css'
import '@/libs/swiper4.5.min.js'
export default {
  name: 'swiper-choose',
  props: {
    selected: Number, //默认选中的index
    title: String,
    list: Array,
  },
  components: {},
  data() {
    return {
      swiperInstance: {},
    }
  },
  computed: {
    mT: function() {
      if (this.list.length < 3) {
        let paddingTop = (3 - this.list.length) * 25
        return (
          'paddingTop:' +
          paddingTop +
          'px;padding-bottom: ' +
          paddingTop +
          'px;'
        )
      }
      return 'paddingTop:0;overflow:hidden;'
    },
  },
  mounted() {
    let _this = this
    // loadScripts([
    //   '/common/vendor/swiper-4.5/swiper.min.js',
    //   '/common/scripts/file.js',
    // ]).then(() => {
    let Swiper = window.Swiper
    _this.swiperInstance = new Swiper('.swiper-container', {
      direction: 'vertical',
      slidesPerView: _this.list.length,
      centeredSlides: true,
      autoResize: false,
      initialSlide: _this.selected || 0,
    })
    // })
  },

  methods: {
    changePeriodSwiper: function(index) {
      if (this.selected !== index) {
        this.swiperInstance.slideTo(index || 0, 0, false)
        this.selected = this.swiperInstance.activeIndex
      }
    },
    cancelHandler: function() {
      this.$emit('listenSwiperChooseClose', true)
    },
    confirmHandler: function() {
      this.$emit('listenSwiperChooseConfirm', this.swiperInstance.activeIndex)
    },
  },
}
</script>
<style lang="less" scoped>
@import './swiper4.5.css';
.swiper-choose-pop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.6);
  .content {
    position: absolute;
    bottom: 0;
    left: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-flow: column nowrap;
    flex-flow: column nowrap;
    width: 100%;
    text-align: center;
    background-color: #fff;
    .head {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      height: 60px;
      padding: 17px 13px;
      color: #323232;
      background: #f8f9fd;
      .btn {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        color: #666666;
      }

      .title {
        font-family: PingFangSC-Regular;
        font-size: 17px;
        line-height: 1;
        color: #323232;
        text-align: center;
      }

      span {
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;
        &:first-child {
          text-align: left;
        }
        &:last-child {
          text-align: right;
        }
      }
    }
  }
  .inner-w {
    position: relative;
    height: 206px;
    padding: 28px 0;
    &::before {
      position: absolute;
      top: 0;
      left: 130px;
      z-index: 2;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 232px;
      height: 160px;
      pointer-events: none;
      content: '';
      background-image: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.83) 45%
      );
      border-bottom: 1px solid #e0e0e0;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    }
    &::after {
      position: absolute;
      top: 130px;
      left: 130px;
      z-index: 2;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 232px;
      height: 152px;
      pointer-events: none;
      content: '';
      background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.83) 45%
      );
      //   background-image: linear-gradient(
      //     180deg,
      //     rgba(255, 255, 255, 0) 0%,
      //     rgba(255, 255, 255, 0.63) 45%
      //   );
      border-top: 1px solid #e0e0e0;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    }
  }
  .swiper-container {
    // min-height: 150px;
    // margin-top: 28px;
    // margin-bottom: 28px;
    width: 100%;
    // overflow: visible;
    // min-height: 100px;
    .swiper-slide {
      height: 50px;
      font-family: PingFangSC-Regular;
      font-size: 19px;
      line-height: 50px;
      color: #989898;
      text-align: center;
      span {
        font-size: 14px;
      }
      &.swiper-slide-active {
        font-family: PingFangSC-Regular;
        font-size: 19px;
        color: #323232;
        &.disable {
          color: #e0e0e0;
        }
      }
    }
  }
}

// .pop {
//   padding-bottom: 22px;
//   text-align: center;
// }

.iphoneX .swiper-choose-pop .content {
  padding-bottom: 34px;
}
</style>
