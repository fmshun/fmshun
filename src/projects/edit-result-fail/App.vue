<template>
  <div id="use-nav-top-app">
    <!-- <waiting v-show="showWaiting"></waiting> -->
    <navtop :leftEvent="closeHandler" title="定投设置结果"></navtop>
    <div class="conent-wrapper" :class="{ target: from == 2 }">
      <img src="./images/icon.png" alt class="icon" />

      <p class="l1">
        {{
          setPageTitle || (from == 2 ? '目标盈定投设置失败' : '定投设置失败')
        }}
      </p>
      <p class="l2">{{ msg }}</p>
    </div>
    <div class="resButton">
      <div @click="closeHandler">
        <span>{{ from == 2 ? '确定' : '确认' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import navtop from '@/components/nav-top/nav-top'

export default {
  name: 'App',
  metaInfo: {
    title: '定投设置结果',
  },
  components: {
    // Waiting,
    navtop,
  },
  computed: {
    way: function() {
      if (this.from == '1') {
        return '智能定投'
      }
      return '普通定投'
    },
  },
  data() {
    return {
      setPageTitle: base.getUrlParameter('setPageTitle')
        ? decodeURIComponent(base.getUrlParameter('setPageTitle'))
        : '',
      // 来源页 2-目标盈
      from: base.getUrlParameter('from'),
      // 错误话术
      msg: decodeURIComponent(base.getUrlParameter('msg') || '网络连接失败'),
    }
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    $('.loader-wrapper').hide()
    let _this = this
    //iphoneX 底部填充
    if (base.isIphoneX()) {
      $('.resButton').addClass('iphoneX')
    }
    setTimeout(function() {
      if (_this.from == 2) {
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1243',
          '1.0',
          '理财_基金定投|新增目标盈结果页面|0|0',
          'result={失败}'
        )
      } else {
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1159',
          '1.0',
          '理财_基金定投|定投结果页面|0|0',
          'way={' + _this.way + '}|condition={失败}'
        )
      }
    }, 1000)
  },
  methods: {
    closeHandler() {
      if (this.from == 2) {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1243',
          '1.0',
          '理财_基金定投|新增目标盈结果页面|底部|确定',
          'result={失败}'
        )
      } else {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1159',
          '1.0',
          '理财_基金定投|定投结果页面|底部|确认',
          'way={' + this.way + '}|condition={失败}'
        )
      }
      let _this = this
      setTimeout(function() {
        if (_this.from === '2') {
          base.href('http://action:10002')
        } else {
          base.href('http://action:3413')
        }
      }, 100)
    },
  },
}
</script>
<style lang="less">
@import './App.less';
</style>
