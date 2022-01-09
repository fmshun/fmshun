<template>
  <div id="use-nav-top-app">
    <navtop :title="status === '1' ? '三方存管变更确认' : '风险要素变更确认'" :leftEvent="btnEnsureHandler"></navtop>

    <div class="container">
      <Note
        :statusType="status"
        :changeable="changeable"
        :elementChangeFour="elementChangeFour"/>
      <!-- 三方 -->
      <CustodyPage v-if="status == 1"/>
      <!-- 风险 -->
      <RishFactors v-if="status == 2"/>
    </div> 
  </div>
</template>

<script>
import navtop from '@/components/nav-top/nav-top'; // nav
import CustodyPage from './components/custody-page'; // 三方
import Note from './components/note'
import RishFactors from './components/risk-factors'
import base from 'base'
import ajax from 'ajax'

export default {
  name: 'App',
  metaInfo: {
    title: '三方存管变更确认',
  },
  components: {
    navtop,
    Note,
    CustodyPage, // 三方
    RishFactors,
  },
  data() {
    return {
      status: null,
      changeable: true, // 控制 note 显示
      elementChangeFour: false, // 是否是保守最低型 适当性需要
    }
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    // 初始化顶部导航
    this.status = base.getUrlParameter('status') || 1; // status： 1 三方存管   2 风险要素
  },
  methods: {
    // 点击左上角返回，关闭当前页面
    btnEnsureHandler() {
      base.href('http://action:3413')
    },
  },
}
</script>

<style lang="less">
@import '../../components/navigation-bar/navigation-bar.css';
* {
  padding: 0;
  margin: 0;
  -webkit-touch-callout: none;

  /* 系统默认菜单被禁用 */
  -webkit-user-select: none;

  /* webkit浏览器 */
  -khtml-user-select: none;

  /* 早期浏览器 */
  -moz-user-select: none;

  /* 火狐 */
  -ms-user-select: none;

  /* IE10 */
  user-select: none;
}

.iphoneX {
  .container {
    padding-top: 93px;
    // padding-bottom: 34px;
  }
}

.container {
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 0;
  width: 100%;
  // background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 73px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toast {
  z-index: 9999 !important;
}
</style>
