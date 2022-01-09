// 定投策略 本页面的url需要添加 &&backjump=GetBackUrl()
<template>
  <div id="use-nav-top-app" class="wrapper">
    <navtop title="定投策略"></navtop>
    <!-- <waiting v-show="showWaiting"></waiting> -->
    <div class="top-wrapper" @click="jumpInteIntro">
      <p class="title">均线策略</p>
      <p class="content">
        均线策略根据证券市场的指数走势定期不定额买入，低位多投，高位少投。
      </p>
      <img src="./images/icon.png" alt class="icon" />
    </div>
    <div class="br"></div>
    <div class="inner-wrapper">
      <p class="title ml5">更改参数</p>
      <div class="item">
        <div class="left" @click="showDesc('zs')">参考指数</div>
        <div class="right" @click="bShowZS = true">{{ arrZS[zsIndex] }}</div>
      </div>
      <div class="item">
        <div class="left" @click="showDesc('jx')">参考均线</div>
        <div class="right" @click="bShowJX = true">{{ arrJX[jxIndex] }}</div>
      </div>
    </div>

    <swiperchoose
      :list="arrJX"
      v-if="bShowJX"
      :selected="jxIndex"
      :title="'参考均线设置'"
      @listenSwiperChooseConfirm="listenSwiperChooseConfirm('jx', $event)"
      @listenSwiperChooseClose="listenSwiperChooseClose"
    ></swiperchoose>
    <swiperchoose
      :list="arrZS"
      v-if="bShowZS"
      :selected="zsIndex"
      :title="'参考指数设置'"
      @listenSwiperChooseConfirm="listenSwiperChooseConfirm('zs', $event)"
      @listenSwiperChooseClose="listenSwiperChooseClose"
    ></swiperchoose>

    <!-- <div class="btn-ensure highlight" @click="btnEnsureHandler">
      <div class>确定</div>
    </div>-->
  </div>
</template>
<script>
// import Waiting from '@/components/waiting/Waiting'
import navtop from '@/components/nav-top/nav-top'
import swiperchoose from '@/components/swiper-choose/swiper-choose'
import base from 'base'
import ajax from 'ajax'
import local from 'local'
import loadScripts from '@/utils/loadScripts'
import { stockZSInfos, stockJXInfos } from '@/components/Common'

export default {
  name: 'App',
  metaInfo: {
    title: '定投策略',
  },
  components: {
    // Waiting,
    swiperchoose,
    navtop,
  },
  data() {
    return {
      bShowJX: false,
      bShowZS: false,
      jxIndex:
        typeof base.getUrlParameter('jxIndex') != 'undefined'
          ? base.getUrlParameter('jxIndex')
          : 1, //均线默认选中500日均线
      zsIndex:
        typeof base.getUrlParameter('zsIndex') != 'undefined'
          ? base.getUrlParameter('zsIndex')
          : 1, //指数默认选中沪深300
      arrJX: stockJXInfos,
      arrZS: stockZSInfos,
    }
  },
  created() {
    loadScripts(['/common/scripts/prompt.js']).then(() => {})
  },
  mounted() {
    let that = this
    //原生返回按钮
    window.getbackurl = window.GetBackUrl = function() {
      return base.goBackUrl('http://action:3413')
      //   that.btnEnsureHandler()
      //   要是不是跳转 是自定义事件 需要加这个return 自定义跳转链接需要使用base.goBackUrl()
      //   return 'RETURN_WITH_NO_RESPONSE'
    }
    $('.loader-wrapper').hide()
    base.href('http://action:10066?isShowDarkStatusBar=1')
  },
  methods: {
    btnEnsureHandler: function() {
      let _this = this
      local.saveObject(
        {
          financing_aip_edit_intelligent_param: JSON.stringify({
            jxIndex: _this.jxIndex,
            zsIndex: _this.zsIndex,
          }),
        },
        function() {
          //   base.href('http://action:3413')
        }
      )
    },
    preventEvent: function(event) {
      event.preventDefault()
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
    listenSwiperChooseConfirm: function(type, index) {
      if (type == 'jx') {
        this.jxIndex = index
      }
      if (type == 'zs') {
        this.zsIndex = index
      }
      this.bShowJX = false
      this.bShowZS = false
      this.btnEnsureHandler()
    },
    listenSwiperChooseClose: function() {
      this.bShowJX = false
      this.bShowZS = false
    },
    // 智能定投头部图片点击跳转至智能定投介绍页面
    jumpInteIntro: function() {
      let url =
        'http://action:10061/?fullscreen=1&&topcolor=5e9fea&&url=/zlcftajax/ttf/auto-activity/main.htm?pageId=5639'
      base.href(url)
    },
    showDesc: function(type) {
      let _this = this
      let title = '',
        message = ''
      if (type == 'jx') {
        title = '参考均线说明'
        message = '参考均线指的是对应指数过去一段时间收盘价的平均值曲线。'
      }
      if (type == 'zs') {
        title = '参考指数说明'
        message = '参考指数指的是具有代表性、可以用来衡量股市大盘走势的指数。'
      }
      _this.disableScroll()
      new Prompt({
        id: 'change-st',
        title: title,
        content: message,
        align: 'left',
        buttons: {
          btnNo: 1,
          left: {
            label: '我知道了',
            callback: function() {
              $('body').css('overflow', 'scroll')
              _this.enableScroll()
            },
          },
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
// @import '../../components/navigation-bar/navigation-bar.css';
@import '../../components/Prompt.css';
@import './App.less';
</style>
