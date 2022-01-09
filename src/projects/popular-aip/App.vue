<template>
  <div id="app" :class="{ android: isAndroid, iphoneX: isIphoneX }">
    <!--    <waiting v-show="showWaiting"></waiting>-->
    <div id="header-area">
      <span class="back-img" @click="goback"></span>
      <span class="header-title">人气定投</span>
    </div>
    <div class="wrapper">
      <div id="top-word">
        <img v-if="pic" :src="pic" alt="" width="100%" />
        <img
          v-else
          src="./images/banner.png"
          alt=""
          width="100%"
          height="100%"
        />
      </div>
      <div class="swiper-container" id="titleTab">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            @click="headTabToggle(0)"
            :class="selectedTab == 0 ? 'selected' : ''"
          >
            全部
          </div>
          <div
            class="swiper-slide"
            @click="headTabToggle(1)"
            :class="selectedTab == 1 ? 'selected' : ''"
          >
            股票型
          </div>
          <div
            class="swiper-slide"
            @click="headTabToggle(2)"
            :class="selectedTab == 2 ? 'selected' : ''"
          >
            混合型
          </div>
          <div
            class="swiper-slide"
            @click="headTabToggle(3)"
            :class="selectedTab == 3 ? 'selected' : ''"
          >
            指数型
          </div>
          <div
            class="swiper-slide"
            @click="headTabToggle(4)"
            :class="selectedTab == 4 ? 'selected' : ''"
          >
            债券型
          </div>
          <div
            class="swiper-slide"
            @click="headTabToggle(5)"
            :class="selectedTab == 5 ? 'selected' : ''"
          >
            QDII
          </div>
          <div
            class="swiper-slide"
            @click="headTabToggle(6)"
            :class="selectedTab == 6 ? 'selected' : ''"
          >
            FOF
          </div>
        </div>
      </div>
      <div class="split">
        <span class="split_left">基金名称</span>
        <span class="split_right">累计定投次数</span>
      </div>
      <!--人气定投-->
      <div id="hot-aip">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="slide-content">
                <ul
                  class="prdt-list"
                  v-if="hotList.all != null && hotList.all.length > 0"
                  key="0"
                >
                  <li
                    v-for="(item, index) in hotList.all"
                    :key="index"
                    @click="goFundDetail(item.name, item.prdtCode)"
                  >
                    <div class="name-area">
                      <span v-if="index < 3" class="rank"></span>
                      <span v-else class="rankLeft">{{ index + 1 }}.</span>
                      <span class="prdt-name">{{ item.name }}</span>
                      <span class="prdt-code">{{ item.num }}</span>
                    </div>
                    <div class="content-div">
                      <div class="sec">
                        <span class="sec-left">近1年定投收益率</span>
                        <span
                          class="sec-right"
                          :class="[
                            !item.rate || item.rate.charAt(0) != '-'
                              ? 'red'
                              : 'green',
                          ]"
                        >
                          {{ item.rate ? item.rate : '--%' }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="noData" v-else>
                  <img src="./images/404.png" alt="无数据保护图" />
                  <span>当前暂无数据,请稍后</span>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="slide-content">
                <ul
                  class="prdt-list"
                  v-if="hotList.stock != null && hotList.stock.length > 0"
                  key="1"
                >
                  <li
                    v-for="(item, index) in hotList.stock"
                    :key="index"
                    @click="goFundDetail(item.name, item.prdtCode)"
                  >
                    <div class="name-area">
                      <span v-if="index < 3" class="rank"></span>
                      <span v-else class="rankLeft">{{ index + 1 }}.</span>
                      <span class="prdt-name">{{ item.name }}</span>
                      <span class="prdt-code">{{ item.num }}</span>
                    </div>
                    <div class="content-div">
                      <div class="sec">
                        <span class="sec-left">近1年定投收益率</span>
                        <span
                          class="sec-right"
                          :class="[
                            !item.rate || item.rate.charAt(0) != '-'
                              ? 'red'
                              : 'green',
                          ]"
                        >
                          {{ item.rate ? item.rate : '--%' }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="noData" v-else>
                  <img src="./images/404.png" alt="无数据保护图" />
                  <span>当前暂无数据,请稍后</span>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="slide-content">
                <ul
                  class="prdt-list"
                  v-if="hotList.mix != null && hotList.mix.length > 0"
                  key="2"
                >
                  <li
                    v-for="(item, index) in hotList.mix"
                    :key="index"
                    @click="goFundDetail(item.name, item.prdtCode)"
                  >
                    <div class="name-area">
                      <span v-if="index < 3" class="rank"></span>
                      <span v-else class="rankLeft">{{ index + 1 }}.</span>
                      <span class="prdt-name">{{ item.name }}</span>
                      <span class="prdt-code">{{ item.num }}</span>
                    </div>
                    <div class="content-div">
                      <div class="sec">
                        <span class="sec-left">近1年定投收益率</span>
                        <span
                          class="sec-right"
                          :class="[
                            !item.rate || item.rate.charAt(0) != '-'
                              ? 'red'
                              : 'green',
                          ]"
                        >
                          {{ item.rate ? item.rate : '--%' }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="noData" v-else>
                  <img src="./images/404.png" alt="无数据保护图" />
                  <span>当前暂无数据,请稍后</span>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="slide-content">
                <ul
                  class="prdt-list"
                  v-if="hotList.index != null && hotList.index.length > 0"
                  key="3"
                >
                  <li
                    v-for="(item, index) in hotList.index"
                    :key="index"
                    @click="goFundDetail(item.name, item.prdtCode)"
                  >
                    <div class="name-area">
                      <span v-if="index < 3" class="rank"></span>
                      <span v-else class="rankLeft">{{ index + 1 }}.</span>
                      <span class="prdt-name">{{ item.name }}</span>
                      <span class="prdt-code">{{ item.num }}</span>
                    </div>
                    <div class="content-div">
                      <div class="sec">
                        <span class="sec-left">近1年定投收益率</span>
                        <span
                          class="sec-right"
                          :class="[
                            !item.rate || item.rate.charAt(0) != '-'
                              ? 'red'
                              : 'green',
                          ]"
                        >
                          {{ item.rate ? item.rate : '--%' }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="noData" v-else>
                  <img src="./images/404.png" alt="无数据保护图" />
                  <span>当前暂无数据,请稍后</span>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="slide-content">
                <ul
                  class="prdt-list"
                  v-if="hotList.debt != null && hotList.debt.length > 0"
                  key="4"
                >
                  <li
                    v-for="(item, index) in hotList.debt"
                    :key="index"
                    @click="goFundDetail(item.name, item.prdtCode)"
                  >
                    <div class="name-area">
                      <span v-if="index < 3" class="rank"></span>
                      <span v-else class="rankLeft">{{ index + 1 }}.</span>
                      <span class="prdt-name">{{ item.name }}</span>
                      <span class="prdt-code">{{ item.num }}</span>
                    </div>
                    <div class="content-div">
                      <div class="sec">
                        <span class="sec-left">近1年定投收益率</span>
                        <span
                          class="sec-right"
                          :class="[
                            !item.rate || item.rate.charAt(0) != '-'
                              ? 'red'
                              : 'green',
                          ]"
                        >
                          {{ item.rate ? item.rate : '--%' }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="noData" v-else>
                  <img src="./images/404.png" alt="无数据保护图" />
                  <span>当前暂无数据,请稍后</span>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="slide-content">
                <ul
                  class="prdt-list"
                  v-if="hotList.qdii != null && hotList.qdii.length > 0"
                  key="5"
                >
                  <li
                    v-for="(item, index) in hotList.qdii"
                    :key="index"
                    @click="goFundDetail(item.name, item.prdtCode)"
                  >
                    <div class="name-area">
                      <span v-if="index < 3" class="rank"></span>
                      <span v-else class="rankLeft">{{ index + 1 }}.</span>
                      <span class="prdt-name">{{ item.name }}</span>
                      <span class="prdt-code">{{ item.num }}</span>
                    </div>
                    <div class="content-div">
                      <div class="sec">
                        <span class="sec-left">近1年定投收益率</span>
                        <span
                          class="sec-right"
                          :class="[
                            !item.rate || item.rate.charAt(0) != '-'
                              ? 'red'
                              : 'green',
                          ]"
                        >
                          {{ item.rate ? item.rate : '--%' }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="noData" v-else>
                  <img src="./images/404.png" alt="无数据保护图" />
                  <span>当前暂无数据,请稍后</span>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="slide-content">
                <ul
                  class="prdt-list"
                  v-if="hotList.fof != null && hotList.fof.length > 0"
                  key="6"
                >
                  <li
                    v-for="(item, index) in hotList.fof"
                    :key="index"
                    @click="goFundDetail(item.name, item.prdtCode)"
                  >
                    <div class="name-area">
                      <span v-if="index < 3" class="rank"></span>
                      <span v-else class="rankLeft">{{ index + 1 }}.</span>
                      <span class="prdt-name">{{ item.name }}</span>
                      <span class="prdt-code">{{ item.num }}</span>
                    </div>
                    <div class="content-div">
                      <div class="sec">
                        <span class="sec-left">近1年定投收益率</span>
                        <span
                          class="sec-right"
                          :class="[
                            !item.rate || item.rate.charAt(0) != '-'
                              ? 'red'
                              : 'green',
                          ]"
                        >
                          {{ item.rate ? item.rate : '--%' }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="noData" v-else>
                  <img src="./images/404.png" alt="无数据保护图" />
                  <span>当前暂无数据,请稍后</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Waiting from '@/components/waiting/Waiting'
import '@/libs/swiper4.5.css'
import '@/libs/swiper4.5.min.js'
import base from 'base'
import ajax from 'ajax'
import { urls } from '@/components/Common'

export default {
  name: 'App',
  metaInfo: {
    title: '人气定投',
  },
  components: {
    // Waiting,
  },
  data() {
    return {
      selectedTab: 0, //默认选中股票型
      hotList: {},
      mySwiper: null,
      clickFlag: false,
      isAndroid: base.isAndroid(),
      isIphoneX: base.isIphoneX(),
      pic: '',
      mytitleSwiper: null,
      // showWaiting: true,
    }
  },
  mounted() {
    if (base.isAndroid()) {
      this.isAndroid = true
    } else if (base.isIphoneX()) {
      this.isIphoneX = true
    }
    this.init()
  },
  beforeCreate() {
    //白头要显示wifi和电量图表
    base.href('http://action:10066?isShowDarkStatusBar=1')
  },
  methods: {
    init: function() {
      let that = this
      this.getData($.Deferred()).done(function() {
        that.$nextTick(() => {
          var hHeader = $('#header-area').height()
          var hImg = $('#top-word').height()
          var hTabs = $('#titleTab').height()
          var hSplit = $('.split').height()
          $('.wrapper').height(window.innerHeight - hHeader)
          $('#hot-aip .slide-content').css(
            'min-height',
            window.innerHeight - hHeader - hImg - hTabs - hSplit
          )
          $('.noData').css(
            'height',
            window.innerHeight - hHeader - hImg - hTabs - hSplit
          )
        })
        $('#app').css('padding-top', '0px')
        // that.showWaiting = false
      })
    },
    getData: function(dtd) {
      let that = this
      var url = '/reqxml?action=27401&path=/time_invest/hot_invest'
      ajax.run(
        url,
        '',
        function(res) {
          $('.loader-wrapper').hide()
          var BINDATA = JSON.parse(res.BINDATA),
            code = BINDATA.code,
            msg = BINDATA.msg
          if (code === '0') {
            base.log(BINDATA.resultData)
            that.hotList = BINDATA.resultData.hotList
            that.pic = BINDATA.resultData.pic
            that.$nextTick(() => {
              that.initSwiper()
            })
          }
          dtd.resolve()
        },
        function(err) {
          $('.loader-wrapper').hide()
          dtd.resolve(false)
        }
      )

      return dtd.promise()
    },
    initSwiper: function() {
      let that = this
      that.mytitleSwiper = new window.Swiper('#titleTab', {
        // silde宽度自适应
        slidesPerView: 'auto',
        spaceBetween: 30,
        paginationClickable: true,
        // observer: true, //修改swiper自己或子元素时，自动初始化swiper
        // observeParents: true, //修改swiper的父元素时，自动初始化swiper
        resistanceRatio: 0,
        on: {
          transitionEnd: function() {
            console.log(this.activeIndex)
          },
        },
      })
      that.mySwiper = new window.Swiper('#hot-aip .swiper-container', {
        autoplay: false,
        loop: false,
        slidesPerView: 1,
        autoHeight: true,
        resistanceRatio: 0,
        on: {
          slideChange: function() {
            // that.mytitleSwiper.slideTo(this.activeIndex)
            that.headTabToggle(this.activeIndex)
            // that.mytitleSwiper.update()
          },
        },
      })
      setTimeout(function() {
        that.mySwiper.update()
      }, 500)
    },
    headTabToggle: function(index) {
      this.selectedTab = index
      this.mySwiper.slideTo(index, 150, true)
      // 顶部导航滚动到当前选中
      this.mytitleSwiper.slideTo(index >= 2 ? index - 2 : 0, 500, false)
    },
    preventEvent: function(event) {
      event.preventDefault()
    },
    // 跳转到基金详情页
    goFundDetail(name, code) {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      if (code && urls.fundDetail) {
        base.href(`${urls.fundDetail}${code}`)
      }
      this.clickFlag = false
    },
    disableScroll: function() {
      document.addEventListener('touchmove', this.preventEvent, {
        passive: false,
      })
    },
    enableScroll: function() {
      document.removeEventListener('touchmove', this.preventEvent, {
        passive: false,
      })
    },
    goback() {
      base.href('http://action:3413')
    },
  },
}
</script>
<style lang="less">
// @import '../../components/navigation-bar/navigation-bar.css';
@import './App.less';
</style>
