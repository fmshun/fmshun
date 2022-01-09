<template>
  <div id="use-nav-top-app">
    <navtop title="提交结果" :leftEvent="btnEnsureHandler"></navtop>
    <div :class="['result-container', status === '1' ? 'result-container1': '']">
      <img src="./assets/icon.png" alt="" />
      <h3>确认信息提交成功</h3>
      <p>
        {{
          status === '1'
            ? '您所选中定投计划的银行卡自动转入服务确认信息已提交，请稍后查看计划是否恢复正常执行。'
            : '您所选中定投计划的相关产品适当性要素确认信息已提交。'
        }}
      </p>
    </div>

    <div class="confirm-btn" @click="btnEnsureHandler">确认</div>

  </div>
</template>

<script>
import base from 'base';
import navtop from '@/components/nav-top/nav-top';

export default {
  name: 'App',
  metaInfo: {
    title: '提交结果',
  },
  components: {
    navtop,
  },
  data() {
    return {
      status: null, // 1 三方存管提交结果   2 风险要素变更提交结果
    }
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    this.status = base.getUrlParameter('status'); // 1 三方 2 风险
    $('.loader-wrapper').hide();
  },
  methods: {
    // 头部 返回  /  底部 确认
    btnEnsureHandler() {
      base.href('http://action:3413');
    },
  },
}
</script>

<style lang="less">
body,
html {
  background-color: #f7f8fa;
}

.result-container {
  height: 312px;
  width: 100%;
  padding: 70px 60px;
  text-align: center;
  background-color: #fff;

  &.result-container1 {
    padding: 70px 34px 70px 33px;
  }

  img {
    width: 60px;
    height: 60px;
  }

  h3 {
    margin: 19px auto 14px;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    line-height: 28px;
    color: #323232;
  }

  p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 23px;
    color: #999999;
  }
}

.confirm-btn {
  width: 343px;
  height: 44px;
  background: #FF8300;
  border-radius: 22px;
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 20px;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
  line-height: 44px;
}

.iphoneX {
  .confirm-btn {
    bottom: 34px;
  }
}
</style>
