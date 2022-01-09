// 设置目标止盈

<template>
  <div class="set-stop-param">
    <div class="title" :class="on ? 'on' : ''" @click="toggleStatus">
      目标止盈
    </div>
    <div class="set-w" v-if="on">
      <p class="l1">
        目标持仓收益率
        <span class="strong">{{ targetRate }}%</span>
        ，到达目标后
        <span class="strong redeem">{{ strResumeType }}</span>
      </p>
      <!-- 自动赎回 -->
      <p class="l2" @click="linkHandler" v-if="resumeType === 0">
        定投产品达到目标收益率后自动卖出锁定收益，并回款到您的华泰账户，您可
        <span class="link">修改相关参数</span>
      </p>
      <!-- 继续定投 -->
      <p class="l2" @click="linkHandler" v-if="resumeType === 1">
        定投产品达到目标收益率后我们会提醒您目标达成，但不影响定投的继续执行，您可
        <span class="link">修改相关参数</span>
      </p>
      <!-- 终止定投 -->
      <p class="l2" @click="linkHandler" v-if="resumeType === 2">
        定投产品达到目标收益率后我们将自动为您终止该定投计划，您可
        <span class="link">修改相关参数</span>
      </p>
    </div>
    <div class="tips">
      自动赎回服务可能因赎回当天的净值变化引起最终到账收益偏差，且未包含手续费，止盈收益率以最终到账收益率为准。
    </div>
  </div>
</template>
<script>
import base from 'base'
import { stopParamInfos } from '@/components/Common'
export default {
  name: 'setstopparam',
  props: {
    stopParamRate: [Number, String],
    stopParamType: [Number, String],
    on: Boolean,
    isTarget: String,
    isModify: [String, Number],
    accountRate: [String, Number],
  },
  components: {},
  data() {
    return {
      resumeType: this.stopParamType || 0, //自动赎回0, 继续定投1，终止定投2
      targetRate: this.stopParamRate || 10,
    }
  },
  computed: {
    strResumeType: function() {
      //   let arrResumeType = ['自动赎回', '继续定投', '终止定投']
      return stopParamInfos[this.resumeType]
    },
  },
  mounted() {},

  methods: {
    setParam: function(targetRate, resumeType) {
      this.targetRate = targetRate
      this.resumeType = resumeType
    },
    toggleStatus: function() {
      // 是选中状态 & 目标盈
      if (this.on && this.isTarget == 1) {
        this.$Dialog({
          title: '提示',
          message: '在目标盈定投场景中，暂不提供取消目标收益率选项操作',
          confirmButtonText: '知道了',
        })
      } else {
        this.on = !this.on
        this.$emit('listenOnStopParam', this.on)
      }
    },
    // 进入修改参数页面
    linkHandler: function() {
      let url =
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=' +
        '/web_cft/financing-aip/edit-stop-param.html' +
        '?yieldNum=' +
        this.targetRate +
        '&selectedType=' +
        this.resumeType
      if (this.isModify == '1') {
        url += '&isModify=1&accountRate=' + (this.accountRate || '')
      }
      /* url =
        'http://localhost:8080/edit-stop-param.html' +
        '?yieldNum=' +
        this.targetRate +
        '&selectedType=' +
        this.resumeType */
      base.href(url)
    },
  },
}
</script>
<style lang="less">
.set-stop-param {
  padding: 0 15px;
  margin-top: 10px;
  background-color: #fff;
  .title {
    position: relative;
    padding: 0 5px;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    line-height: 52px;
    color: #323232;
    text-align: left;
    letter-spacing: 0;
    &::after {
      position: absolute;
      top: 5px;
      right: 5px;
      display: inline-block;
      width: 56px;
      height: 41px;
      content: '';
      background-image: url(./images/off.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    &.on::after {
      right: -6px;
      background-image: url(./images/on.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .set-w {
    position: relative;
    padding: 12px 5px 14px 5px;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      display: block;
      width: 200%;
      height: 200%;
      pointer-events: none;
      content: ' ';
      border-top: 1px solid #f2f2f2;
      border-radius: 0;
      -webkit-transform: scale(0.5, 0.5);
      transform: scale(0.5, 0.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    }

    .redeem {
      margin-left: -4px;
    }
  }
  .tips {
    padding: 13px 21px;
    margin: 0 -15px;
    font-size: 12px;
    line-height: 20px;
    color: #b2b2b2;
    background: #f8f8f8;
  }
  .l1 {
    //   margin-top: 12px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #4a4a4a;
    text-align: left;
    letter-spacing: 0;
    .strong {
      font-family: PingFangSC-Medium;
      font-size: 17px;
      color: #000;
    }
  }
  .l2 {
    margin-top: 9px;
    font-family: PingFangSC-Light;
    font-size: 13px;
    line-height: 21px;
    color: #9b9b9b;
    text-align: left;
    .link {
      margin-left: -0.3em;
      font-family: PingFangSC-Light;
      color: #468ee5;
      &::after {
        display: inline-block;
        width: 4px;
        height: 7px;
        margin-left: 4px;
        vertical-align: middle;
        content: ' ';
        background-image: url(./images/arrow.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
// 默认弹窗样式修改
.visula-dialog {
  .dialog-content {
    border-radius: 8px !important;
    .title {
      padding-top: 26px !important;
      padding-bottom: 8px !important;
      font-size: 18px !important;
      font-weight: bold !important;
      line-height: 25px !important;
      color: #030303 !important;
    }
    .text {
      min-height: auto !important;
      padding-bottom: 22px !important;
      font-family: PingFangSC-Regular !important;
      font-size: 15px !important;
      line-height: 23px !important;
      color: #444444 !important;
    }
    .btn {
      height: auto !important;
      padding: 12px 0 !important;
      font-family: PingFangSC-Regular !important;
      font-size: 17px !important;
      line-height: 24px !important;
      color: #0076ff !important;
      letter-spacing: -0.41px !important;
    }
  }
}
.iphone,
.iphoneX,
.iphoneXR,
.iphoneXSMax {
  .visula-dialog {
    .title {
      font-family: PingFangSC-Medium !important;
      font-weight: normal !important;
    }
  }
}
.android {
  .set-stop-param {
    .l1 {
      .strong {
        font-weight: bold;
      }
    }
  }
  .visula-dialog {
    .title {
      font-weight: bold;
    }
  }
}
</style>
