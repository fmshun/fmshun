<template>
  <div id="app" class="text_center">
    <waiting v-show="showWaiting"></waiting>
    <div class="container">
      <div class="wrapper fixed">
        <div class="top bg_white">
          <img class="error" src="./assets/icon.png" alt />
          <div class="title">赎回失败</div>
          <div class="info">{{ error }}</div>
        </div>
      </div>
    </div>

    <div @click="confirm" :class="{ iphoneX: isIphoneX }" class="resButton">
      <div>
        <span>确认</span>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import Waiting from '@/components/waiting/Waiting'
// web头
import NavigationBar from 'NavigationBar'
export default {
  name: 'App',
  metaInfo: {
    title: '赎回结果',
  },
  components: {
    Waiting,
  },
  data() {
    return {
      error: decodeURIComponent(base.getUrlParameter('error') || '--'),
      isIphoneX: base.isIphoneX(),
      // 防重复点击
      clickFlag: false,
    }
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    this.initHead()
    setTimeout(() => {
      window.TalkingData.onHTSCEvent(
        'page',
        'leaf1215',
        '1.0',
        '理财_基金定投|赎回结果页面|0|0',
        'condition={失败}'
      )
    }, 1000)
    $('.loader-wrapper').hide()
  },
  methods: {
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.container',
        title: '赎回结果',
        // 点击左上角返回，关闭当前页面
        leftEvent() {
          if (_this.clickFlag) {
            return
          }
          _this.clickFlag = true
          base.href('http://action:3413')
          _this.clickFlag = false
        },
      })
    },
    // 点击底部确认
    confirm() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1215',
        '1.0',
        '理财_基金定投|赎回结果页面|底部|确认',
        'condition={失败}'
      )
      setTimeout(() => {
        base.href('http://action:3413')
      }, 500)
      this.clickFlag = false
    },
  },
}
</script>
<style lang="less">
// 顶部导航
@import '../../components/navigation-bar/navigation-bar.css';
@import '../../components/Common.less';
@import './App.less';
</style>
