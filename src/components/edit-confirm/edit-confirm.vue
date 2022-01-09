<template>
  <!--确认弹窗-->
  <div
    :class="{ blue: isTarget == '1' ? true : false }"
    class="buy-confirm-wrapper"
    v-if="bShowConfirmLayer"
  >
    <div class="mask"></div>
    <div class="buy-confirm">
      <div class="buy-confirm-close" @click="clickCloseHandler"></div>
      <p class="buy-confirm-title">每期定投金额</p>
      <p class="buy-confirm-money">
        <span :class="{ small: buyNum && buyNum.length > 14 }">
          {{ buyNum }}
        </span>
        元
      </p>
      <div class="buy-confirm-content">
        <div id="ht">
          <p class="buy-confirm-info">
            <span class="fl">定投产品：</span>
            <span class="fr buy-confirm-info-name">{{ prdtName }}</span>
          </p>
          <!-- <p class="buy-confirm-info">
          <span class="fl">产品代码：</span>
          <span class="fr">{{ productCode }}</span>
          </p>-->
          <p class="buy-confirm-info">
            <span class="fl">定投时间：</span>
            <span class="fr">{{ time }}</span>
          </p>
          <p class="buy-confirm-info">
            <span class="fl">转入方式：</span>
            <span class="fr">{{ transferInType }}</span>
          </p>
          <p class="buy-confirm-info" v-if="openAccount && !openAccount.pass">
            <span class="fl">开通账户：</span>
            <span class="fr buy-confirm-info-account">
              {{ openAccount.fundCompanyName }}
            </span>
          </p>
          <p class="buy-confirm-info" v-if="bShowTarget">
            <span class="fl">目标持仓收益率：</span>
            <span class="fr">{{ targetRate + '%' }}</span>
          </p>
          <p class="buy-confirm-info" v-if="bShowTarget">
            <span class="fl">目标达成后：</span>
            <span class="fr">{{ targetStopType }}</span>
          </p>
        </div>

        <div
          class="buy-confirm-tip"
          @click.self="clickSelectedHandler"
          :class="{ selected: bContractSelected }"
          v-if="oPaper"
        >
          <span
            v-if="openAccount && !openAccount.pass && isOrg"
            class="contract-p"
          >
            本机构已阅读、同意并签署
          </span>
          <span v-else class="contract-p">本人/本机构已阅读、同意并签署</span>
          <template v-if="oPaper.agrtList && oPaper.agrtList.length > 0">
            <span
              class="contract-item"
              v-for="(item, index) in oPaper.agrtList"
              :key="index"
              :data-path="item.agrtUrl"
              :data-title="item.showName"
              @click.stop="clickContractHandler"
            >
              《{{ item.showName || item.agrtName || '--' }}》
            </span>
          </template>
          <template v-else>
            <span class="contract-item">--</span>
          </template>
          ，已理解并愿意自行承担风险和损失，使用数字证书签署并保存本业务相关协议的关键签署信息和文本。
          <div v-if="openAccount && !openAccount.pass && isOrg">
            同时，本机构确认当前账户信息为最新信息。
          </div>
        </div>
        <!-- 没开户 & 机构户 增加提示话术 -->
        <p
          class="buy-confirm-org-tip"
          v-if="openAccount && !openAccount.pass && isOrg"
        >
          账户信息包含如下：客户名称,住所地,经营范围,依法设立或依法开展经营、社会活动的执照及证件(名称、号码和有效期限),控股股东或者实际控制人、负责人、法定代表人、授权办理业务人员相关信息(姓名、身份证件或者身份证明文件的种类、号码、有效期限),受益所有人相关信息(姓名、地址、身份证件或者身份证明文件的种类、号码和有效期限、持股比例)。
        </p>
      </div>
      <!-- 底部按钮 -->
      <div
        class="confirm-btn-ensure"
        @click="clickOrderHandler"
        :class="{ highlight: bContractSelected || !oPaper }"
      >
        <div class>确认</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'editconfirmlayer',
  props: {
    bShowConfirmLayer: Boolean, //是否展示该弹框
    buyNum: String,
    prdtName: String,
    time: String, // 定投时间
    transferInType: String, // 转入方式
    openAccount: Object, // 开通账户
    bShowTarget: Boolean, //是否展示目标定投相关参数
    targetRate: String, // 目标持仓收益率
    targetStopType: String, // 目标达成后
    oPaper: [Object, Boolean], // 协议 新建流程必须要传入{}， 修改流程不需要签署时传入false
    clickContractHandler: Function,
    isTarget: String,
    isOrg: Boolean,
  },
  data() {
    return {
      bContractSelected: false,
    }
  },
  watch: {
    bShowConfirmLayer: function() {
      if (this.bShowConfirmLayer) {
        if (this.isTarget === '1') {
          setTimeout(() => {
            window.TalkingData.onHTSCEvent(
              'page',
              'leaf1242',
              '1.0',
              '理财_基金定投|新增目标盈定投金额确认页面|0|0',
              ''
            )
          }, 1000)
        }
        let _this = this
        this.$nextTick(() => {
          _this.disableScroll()
        })
      }
    },
  },
  mounted() {},
  computed: {},
  methods: {
    disableScroll() {
      document.querySelector('.mask').addEventListener(
        'touchmove',
        (event) => {
          event.preventDefault()
        },
        {
          passive: false,
        }
      )
    },
    clickCloseHandler: function() {
      this.bContractSelected = false
      this.$emit('listenConfirmLayerClose')
    },
    clickOrderHandler: function() {
      if (!this.bContractSelected && this.oPaper) {
        return
      }
      if (this.isTarget === '1') {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1242',
          '1.0',
          '理财_基金定投|新增目标盈定投金额确认页面|底部|确认',
          ''
        )
      }

      this.bContractSelected = false
      this.$emit('listenConfirmLayerEnsure')
    },
    clickSelectedHandler: function() {
      this.bContractSelected = !this.bContractSelected
    },
  },
}
</script>
<style scoped lang="less">
// 机构户提示
.buy-confirm-org-tip {
  padding: 8px 25px 0 62px;
  font-family: PingFangSC-Regular;
  font-size: 11px;
  line-height: 20px;
  color: #bababa;
  text-align: justify;
  letter-spacing: 0;
}

.buy-confirm-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
}
.buy-confirm {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 22;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
}
.iphoneX .buy-confirm {
  padding-bottom: 24px;
}
.buy-confirm-title {
  margin-top: 51px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 17px;
  line-height: 25px;
  color: #4a4a4a;
  text-align: center;
}

.buy-confirm-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 55px;
  height: 55px;
  background-image: url('./images/buyNew8.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 15px 15px;
}
.buy-confirm-content {
  max-height: 305px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.buy-confirm-money {
  height: 59px;
  margin-top: 3px;
  margin-bottom: 25px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 14px;
  line-height: 59px;
  color: #4a4a4a;
  text-align: center;
  span {
    margin-right: -5px;
    font-family: PingFangSC-Semibold, sans-serif;
    font-size: 38px;
    color: #000;
    &.small {
      margin-right: -2px;
      font-size: 22px;
    }
  }
}

.buy-confirm-info {
  width: 100%;
  padding: 0 24px 0 20px;
  margin-top: 9px;
  overflow: hidden;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #8d8d8d;
  .fr {
    font-family: PingFangSC-Regular, sans-serif;
    color: #333333;
  }
}

.buy-confirm-info:first-child {
  margin-top: 0;
}
.buy-confirm-info:last-child {
  margin-bottom: 20px;
}
.buy-confirm-info-name,
.buy-confirm-info-account {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.buy-confirm .tip {
  margin: 20px 30px 0;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 11px;
  line-height: 15px;
  color: #c5c5c5;
  letter-spacing: 0;
}

.buy-confirm-tip {
  position: relative;
  padding: 20px 0 4px 44px;
  margin: 20px 24px 0 20px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 12px;
  line-height: 17px;
  color: #999;
  text-align: justify;
}

.buy-confirm-tip::before {
  position: absolute;
  left: 0;
  display: inline-table;
  width: 24px;
  height: 24px;
  margin-right: 21px;
  content: '';
  background-image: url('./images/select.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.buy-confirm-tip::after {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: inline-block;
  content: '';
  border-top: 1px solid #e7e7e7;
  -webkit-transform: scaleY(0.5);
  -moz-transform: scale(0.5, 0.5);
  transform: scaleY(0.5);
}

.buy-confirm-tip.selected::before {
  background-image: url('./images/selected.png');
}

.buy-confirm-tip .contract-item {
  color: #508cee;
}

.fast-buy-confirm-tip {
  margin: 28px 44px 40px 44px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 11px;
  line-height: 16px;
  color: #999;
  text-align: justify;
  letter-spacing: 0;
}
.confirm-btn-ensure {
  padding: 13px 0 14px;
  //   background-color: #f8f8f8;
  &.highlight div {
    color: #ffffff;
    background-color: #ff8300;
  }
  div {
    width: 347px;
    margin: 0 auto;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    line-height: 46px;
    color: #999999;
    text-align: center;
    background-color: #ededed;
    border-radius: 23px;
  }
}

/* 目标盈样式 */
.blue .confirm-btn-ensure.highlight div {
  background: #1e86f8;
}
</style>
