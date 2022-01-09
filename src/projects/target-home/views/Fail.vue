<template>
  <div id="fail">
    <div :class="{ ios: isIOS }" class="container fail_container">
      <div class="wrapper fixed">
        <div class="bg_white text_center error_container">
          <img class="img" src="../assets/error.png" alt />
          <div class="title">目标盈定投设置失败</div>
          <div class="msg">{{ msg }}</div>
        </div>
      </div>
    </div>
    <footer class="text_center">
      <div @click="back" class="text_center">确定</div>
    </footer>
  </div>
</template>
<script>
// ----SVN公共方法
import base from 'base'
// web头
import NavigationBar from 'NavigationBar'
// ----components
// 公共方法库
import * as plugin from '@/components/Common'
export default {
  name: 'Fail',
  metaInfo: {
    title: '目标盈定投',
  },
  data() {
    return {
      // 防重复点击
      clickFlag: false,
      // 是否是IOS
      isIOS: false,
      // 失败话术
      msg: '',
    }
  },
  created() {
    // 获取router传参
    this.getRouterData()
  },
  mounted() {
    // 初始化
    this.init()
  },
  methods: {
    // 获取router传参
    getRouterData() {
      // 失败话术
      this.msg = decodeURIComponent(this.$route.params.msg || '网络连接失败')
    },
    // ----------初始化
    init() {
      // 是否是IOS，区分样式
      this.isIOS = base.isIOS() ? true : false
      // 初始化web头
      this.initHead()
    },
    // 初始化web头
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.fail_container',
        title: '定投设置结果',
        // 点击左上角返回，关闭当前页面
        leftEvent() {
          _this.back()
        },
      })
    },
    // 返回到目标盈首页
    back() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      this.$router.go(-2)
      this.clickFlag = false
    },
  },
}
</script>
<style lang="less">
@import '../../../components/navigation-bar/navigation-bar.css';
@import '../../../components/Common.less';
@import './Fail.less';
</style>
