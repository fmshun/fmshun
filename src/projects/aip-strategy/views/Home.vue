<template>
  <div :class="{ android: isAndroid, iphoneX: isIphoneX }" id="aip-strategy">
    <div id="header-area">
      <div class="header-content"></div>
      <span @click="goback" class="back"></span>
      <span class="titlec">定投攻略</span>
    </div>
    <div @scroll="contentScroll" id="content">
      <div class="part1"></div>
      <div class="part2">
        <ul>
          <li
            :style="{'background': 'url('+item.pic+') no-repeat left top','backgroundSize':'100% 100%'}"
            @click="jump(item.link)"
            :key="inx"
            v-for="(item,inx) in arr1"
          ></li>
        </ul>
      </div>
      <div class="part3">
        <div class="swiper-area">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div :key="inx" v-for="(item,inx) in arr2" class="swiper-slide">
                <div class="slide-content">
                  <div
                    :style="{'background':'url('+item.pic+') no-repeat left top','backgroundSize':'100% 100%'}"
                    @click="jump(item.link)"
                    class="swiper-top"
                  ></div>
                  <div class="swiper-bottom"></div>
                </div>
              </div>
            </div>
            <div v-if="arr2.length>1" class="swiper-pagination"></div>
          </div>
        </div>
      </div>
      <div class="part4">
        <div class="title-area">
          <div @click="goMore" class="more">
            <span>更多</span>
          </div>
        </div>
        <div class="contentc">
          <ul>
            <li @click="jump(item.link)" :key="inx" v-for="(item,inx) in arr3">
              <div class="left">{{item.title}}</div>
              <div
                :style="{'background':'url('+item.pic+') no-repeat center','backgroundSize':'100% 100%'}"
                class="right"
              ></div>
              <div class="time">{{item.time}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import '@/libs/swiper4.5.css'
import '@/libs/swiper4.5.min.js'
export default {
  name: 'home',
  data() {
    return {
      isAndroid: false,
      isIphoneX: false,
      arr1: [],
      arr2: [],
      arr3: [],
    }
  },
  beforeCreate() {
    //白头要显示wifi和电量图表
    base.href('http://action:10066?isShowDarkStatusBar=1')
  },
  beforeMount() {
    if (base.isAndroid()) {
      this.isAndroid = true
    } else if (base.isIphoneX()) {
      this.isIphoneX = true
    }
    this.$nextTick(() => {
      var h = $('#header-area').height()
      $('#content').height(window.innerHeight - h)
    })

    this.getData()
  },
  methods: {
    goMore() {
      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/strategy-knowledge.html'
      )
    },
    contentScroll() {
      var obj = $('#header-area .header-content'),
        h = $('#header-area').height()
      //透明度1分配到特定高度的像素上(比如头部高度,相应增减透明度),
      //乘以3是为了放慢进度,即需要滑动更多的像素来改变透明度
      obj.css('opacity', 1 - (1 / (3 * h)) * $('#content').scrollTop())
    },
    jump(link) {
      base.href(link)
    },
    getData() {
      var url = '/reqxml?action=27401&path=/time_invest/invest_st',
        that = this
      window.ajax.run(
        url,
        '',
        function(res) {
          $('.loader-wrapper').hide()
          res = JSON.parse(res.BINDATA)
          if (res.code == '0') {
            var resultData = res.resultData
            resultData &&
              resultData.forEach((item) => {
                if (item.moduleType == '01002') {
                  that.arr1 = item.picList
                } else if (item.moduleType == '02002') {
                  that.arr2 = item.picList
                } else if (item.moduleType == '04001') {
                  that.arr3 = item.paperList
                }
              })
            that.$nextTick(() => {
              that.initSwiper()
            })
          } else {
            $('.loader-wrapper').hide()
            alert(res.msg)
          }
        },
        function(err) {
          $('.loader-wrapper').hide()
          alert('网络连接失败!')
        }
      )
    },
    goback() {
      base.href('http://action:10002')
    },
    initSwiper() {
      return new window.Swiper('.part3 .swiper-container', {
        autoplay: false,
        loop: false,
        slidesPerView: 1,
        pagination: {
          el: '.part3 .swiper-pagination',
        },
      })
    },
  },
}
</script>
<style>
.part3
  .swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  margin-right: 4px;
  margin-left: 0;
}
.part3 .swiper-pagination-bullet {
  width: 4px;
  height: 4px;
  opacity: 1;
  border-radius: 2.5px;
  background-color: #d8d8d8;
}
.part3 .swiper-pagination-bullet-active {
  width: 9px;
  background-color: #5176e1;
  opacity: 0.9;
}
</style>
<style scoped>
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  -webkit-user-select: none;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
::-webkit-scrollbar {
  display: none;
}
::before,
::after {
  box-sizing: border-box;
}
#content {
  overflow: auto;
}

.part4 {
  padding-top: 31px;
  background-color: #fff;
}
.part4 .title-area {
  margin-left: 20px;
  height: 28px;
  background: url(../assets/tip.png) no-repeat left center;
  background-size: 92px 28px;
  position: relative;
}
.part4 .more {
  position: absolute;
  top: 50%;
  right: 20px;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  padding-right: 12px;
  background: url(../assets/more.png) no-repeat right center;
  background-size: 6px 10px;
  font-size: 0;
}
.part4 .more span {
  font-family: PingFangSC-Light;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  display: inline-block;
  line-height: 20px;
}
.part4 ul {
  padding-bottom: 12px;
  padding-top: 16px;
}
.part4 li {
  margin: 0 20px;
  padding-bottom: 18px;
  position: relative;
}
.part4 li:first-child {
  padding-top: 0;
}
.part4 li:not(:first-child) {
  padding-top: 20.5px;
}
.part4 li:not(:first-child)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(220, 220, 220, 0.9);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
}
.part4 li .time {
  font-family: PingFangSC-Light;
  font-size: 13px;
  color: #999999;
  letter-spacing: 0;
  position: absolute;
  left: 0;
  bottom: 14px;
}
.part4 .left {
  float: left;
  max-width: 229px;
  text-align: left;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #4a4a4a;
  line-height: 22px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.part4 .right {
  float: right;
  width: 100px;
  height: 71px;
  background: url(../assets/pic1.png) no-repeat center;
  background-size: 100% 100%;
}
.part4 li::after {
  content: '';
  clear: both;
  height: 0;
  width: 100%;
  display: block;
}

.part1 {
  height: 162px;
  background: url(../assets/part1.png) no-repeat left top;
  background-size: 100% 100%;
}

.part2 {
  height: 212px;
  background: url(../assets/part2.png) no-repeat left top;
  background-size: 100% 100%;
  position: relative;
}
.part2 ul {
  position: absolute;
  left: 0;
  width: 100%;
  top: -63px;
  z-index: 2;
}
.part2 li {
  width: 335px;
  height: 105px;
  margin: 0 auto;
  box-shadow: 2px 2px 5px 0 rgba(148, 166, 200, 0.29);
  border-radius: 5px;
}
.part2 li:nth-child(1) {
  background: url(../assets/1.png) no-repeat left top;
  background-size: 100% 100%;
}
.part2 li:nth-child(2) {
  background: url(../assets/2.png) no-repeat left top;
  background-size: 100% 100%;
}
.part2 li:nth-child(3) {
  background: url(../assets/3.png) no-repeat left top;
  background-size: 100% 100%;
}
.part2 li:not(:first-child) {
  margin-top: 26px;
}

.part3 {
  height: 383px;
  background: url(../assets/part3.png) no-repeat left top;
  background-size: 100% 100%;
  position: relative;
}
.part3 .slide-content {
  margin: 0 20px;
}
.part3 .swiper-top {
  width: 335px;
  height: 180px;
  background: url(../assets/p.png) no-repeat left top;
  background-size: 100% 100%;
  box-shadow: 0 0 9px 0 rgba(171, 171, 171, 0.24);
  position: relative;
}
.part3 .swiper-top::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 200%;
  border: 1px solid rgba(81, 118, 225, 0.22);
  border-radius: 8px;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
}
.part3 .swiper-bottom {
  height: 17px;
}
.part3 .swiper-area {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.part3 .swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 0;
  font-size: 0;
}

#header-area {
  height: 64px;
  background-color: #fff;
  position: relative;
}
#header-area .header-content {
  height: 100%;
  position: relative;
  background: url(../assets/64.png) no-repeat left top;
  background-size: 100% 100%;
}
.android #header-area {
  height: 44px;
}
.android .header-content {
  background: url(../assets/44.png) no-repeat left top;
  background-size: 100% 100%;
}
.iphoneX #header-area {
  height: 88px;
}
.iphoneX .header-content {
  background: url(../assets/88.png) no-repeat left top;
  background-size: 100% 100%;
}
#header-area .back {
  position: absolute;
  bottom: 13px;
  left: 0;
  width: 39px;
  height: 19px;
  background: url(../assets/back.png) no-repeat center;
  background-size: 11px 19px;
}
#header-area .titlec {
  position: absolute;
  bottom: 10px;
  left: 50%;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  line-height: 24px;
  color: #000000;
  letter-spacing: 0;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
</style>
