<template>
  <div id="use-nav-top-app">
    <navtop />

    <div class="conent-wrapper">
      <div class="aip-record">
        <div class="aip-record-detail-info" v-if="record">
          <div class="aip-record-detail-info-money">
            <span class="money">{{ record.tradingShare | formateMoney }}</span>
            <span class="money-spec">{{ sellFlag ? '份' : '元'}}</span>
          </div>

          <InfoState :status="tradingStatus" />

          <p class="aip-record-detail-info-note"
            v-if="record.tradingDesc && descShowFlag"
          >
            {{ record.tradingDesc }}
          </p>
        </div>

        <div class="api-record-info" v-if="tradeInfo">
          <h3 class="api-record-info-title">
            {{ sellFlag ? '卖出' : '买入' }}信息
          </h3>
          <div class="api-record-info-message api-record-info-no">
            <span class="tit">{{ sellFlag ? '卖出' : '买入' }}产品</span>
            <img src="./assets/more.png" class="more"  v-if="!sellFlag" @click="jump" />
            <i class="feature-tit" @click="jump">{{ tradeInfo.prdtName || '--' }}</i>
          </div>
          <div class="api-record-info-message">
            <template v-if="!sellFlag">
              <span class="tit">买入金额</span>
              <span>{{ tradeInfo.tradingMoney | formateMoney }}元</span>
            </template>
            <template v-if="sellFlag">
              <span class="tit">卖出份额</span>
              <span>{{ tradeInfo.tradingMoney | formateMoney }}份</span>
            </template>
          </div>
          <div class="api-record-info-message" v-show="tradeInfo.isT0 != '1'">
            <span class="tit">{{ sellFlag ? '交易' : '支付' }}账户</span>
            <template v-if="sellFlag">
               <span class="info-name">
                <img src="./assets/logo.png" />
                <i>华泰账户</i>
              </span>
            </template>
            <!-- source 0 三方 1 华泰 -->
            <template v-else-if="tradingStatus == 3">
              <span v-if="tradeInfo.source == 0">
                当前主三方存管银行卡
              </span>
              <span class="info-name" v-if="tradeInfo.source == 1">
                <img src="./assets/logo.png" />
                <i>华泰账户</i>
              </span>
            </template>
            <span v-else-if="tradeInfo.bankNo == 'Y'">
              当前主三方存管银行卡
            </span>
            <span v-else-if="tradeInfo.bankNo">
              <Bank
                :bankCode="tradeInfo.bankNo"
                :bankNum="tradeInfo.bankNum"
                :isSmall="'true'"
              />
            </span>
            <span class="info-name" v-else>
              <img src="./assets/logo.png" />
              <i>华泰账户</i>
            </span>
          </div>
          <div class="api-record-info-message" v-if="tradingStatus != 3">
            <span class="tit">{{ sellFlag ? '卖出' : '买入' }}时间</span>
            <span>{{ tradeInfo.tradingDate || '--' }}</span>
          </div>
        </div>

        <div
          class="api-record-info confirmInfo"
          v-if="confirmFlag && confirmInfo"
        >
          <h3 class="api-record-info-title">确认信息</h3>
          <div class="api-record-info-message">
            <template v-if="sellFlag">
              <span class="tit">交易状态</span>
              <span>确认成功</span>
            </template>
            <template v-else>
              <span class="tit">确认金额</span>
              <span>{{ confirmInfo.confirmMoney | formateMoney }}元</span>
            </template>
          </div>
          <div class="api-record-info-message">
            <span class="tit">确认份额</span>
            <span>{{ confirmInfo.confirmShare | formateMoney }}份</span>
          </div>
          <div
            class="api-record-info-message"
            v-if="!sellFlag"
          >
            <span class="tit">确认净值</span>
            <span>{{ confirmInfo.confirmNetValue | formateMoney }}</span>
          </div>
          <div class="api-record-info-message">
            <span class="tit">手续费</span>
            <span>{{ confirmInfo.fee | formateMoney }}元</span>
          </div>
          <div class="api-record-info-message">
            <span class="tit">确认时间</span>
            <span>{{ confirmInfo.confirmDate || '--' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="api-record-btns">
      <template v-if="cancelDugFlag">
        <span class="btns-cancel" @click="cancelOrder">撤单</span>
        <span @click="bugOne">再投一笔</span>
      </template>
      <span class="api-record-btn" @click="moreStroke" v-else>
        {{ knowFlag ? '知道了' : '再投一笔' }}
      </span>
    </div>
    
  </div>
</template>

<script>
import base from 'base'
import ajax from 'ajax'
import InfoState from './components/InfoState'
import Bank from '@/components/bank/Bank'
import loadScripts from '@/utils/loadScripts'
import navtop from './components/nav-top/nav-top'
import { setTimeout } from 'timers';

export default {
  name: 'App',
  metaInfo: {
    title: '定投记录详情',
  },
  components: {
    InfoState,
    Bank,
    navtop,
  },
  data() {
    return {
      record: null, // 记录
      tradeInfo: null, // 买入/卖出 信息
      confirmInfo: null, // 确认信息
      /**
       * 1 买入确认中
       * 2 定投失败
       * 3 等待转入
       * 4 卖出失败
       * 5 卖出确认中
       * 6 卖出成功
       * 7 定投成功
       */
      tradingStatus: null,
      cancelFlag: false, // 撤单flag
    }
  },
  created() {
    // 动态加载js库-点击下一步，预检查定投需要
    loadScripts([
      '/licai/com/js/buy-process-v3.js',
      '/common/scripts/local.js',
      '/common/scripts/prompt.js',
      '/licai/com/component/js/antiMoneyLaundering.js',
      '/licai/com/component/js/layer.js',
      '/licai/com/js/quick-buy-alter.js',
      '/common/vendor/flexible-0.3.2/flexible.js',
      '/common/vendor/talkingdata/TalkingData.js',
      '/common/vendor/md5-2.11.0/md5.js',
      '/licai/com/js/steps-serial.js',
    ]).then(() => {})
  },
  filters: {
    formateMoney(val) {
      let newVal = val + ''

      if (newVal.indexOf('.') > 0 || newVal.indexOf('~') > 0) {
        return val
      }

      return Number(val).toFixed(2)
    },
  },
  mounted() {
    
    base.href('http://action:10066?isShowDarkStatusBar=1')
    const tradingStatus = base.getUrlParameter('type')

    // 等待转入 前页面 带数据
    if (tradingStatus === '3') {
      this.tradingStatus = tradingStatus
      const money = decodeURIComponent(base.getUrlParameter('money'))
      this.record = {
        tradingShare: money,
      }

      this.tradeInfo = {
        prdtName: decodeURIComponent(base.getUrlParameter('name')),
        tradingMoney: money,
        prdtCode: base.getUrlParameter('prdtCode'),
        prdtId: base.getUrlParameter('prdtId'),
        source: base.getUrlParameter('source'),  // 0 三方 1 华泰
      }
      $('.loader-wrapper').hide()
      return
    }

    // 获取记录数据
    ajax.run(
      '/reqxml?action=27017&path=/time_invest/invest_record_detail',
      {
        composeOrderId: base.getUrlParameter('composeOrderId'),
        orderSource: base.getUrlParameter('orderSource'),
        entrustDate: base.getUrlParameter('entrustDate'),
        clientNo: '($account)',
        sysNodeId: '($tztsysnodeid)',
      },
      ({ BINDATA }) => {
        const data = JSON.parse(BINDATA).data
        this.record = data.record
        this.tradingStatus = tradingStatus || this.record.tradingStatus
        this.tradeInfo = data.tradeInfo
        this.confirmInfo = data.confirmInfo
        $('.loader-wrapper').hide()
      },
      (err) => {
        $('.loader-wrapper').hide()
        this.$Toast(err.ERRORMESSAGE || '网络连接失败')
      }
    )
  },
  computed: {
    // 卖出成功 定投成功  确认消息
    confirmFlag() {
      return ['6', '7'].includes(this.tradingStatus)
    },

    // 卖出失败 卖出等待不可撤单 知道了（底部）
    knowFlag() {
      return ['4', '5'].includes(this.tradingStatus)
    },

    /*
     * 卖出可撤单 撤单 + 再来一笔 （底部）
     */
    cancelDugFlag() {
      return ['5'].includes(this.tradingStatus) && this.record.isCancelAble
    },

    // 卖出消息
    sellFlag() {
      return ['4', '5', '6', '8'].includes(this.tradingStatus)
    },

    // 是否展示 记录说明
    descShowFlag() {
      return ['1', '2', '4'].includes(this.tradingStatus)
    },
  },
  methods: {
    // 撤单
    cancelOrder() {
      if (this.cancelFlag) {
        this.$Toast('正在撤单中')
        return
      }
      this.cancelFlag = true
      ajax.run(
        '/reqxml?action=27017&path=/time_invest/cancel_invest_order',
        {
          clientNo: '($account)',
          TFrom: '($tfrom)',
          password: '($password)',
          subAccount: base.getUrlParameter('subAccount'), // type = 5
          entrustNo: this.tradeInfo.entrustNo,
          entrustDate: base.getUrlParameter('entrustDate'),
          sysNodeId: '($tztsysnodeid)',
          token: '($token)',
        },
        ({ BINDATA }) => {
          const { code, msg = '网络连接失败' } = JSON.parse(BINDATA)
          if (code === '0') {
            const { prdtCode } = this.tradeInfo
            this.$Toast('正在撤单中',4000)
            setTimeout(()=>{
              this.$Toast('撤单成功')
              this.cancelFlag = false;
              base.href('http://action:3413')
            },4000)
            // 撤单成功 跳转到 单产品持仓详情
            // base.href(`http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/account-holding/my-hold-single.html?account=($account)&productCode=${prdtCode}`)
            // 返回上一页
            
          } else {
            this.$Toast(msg)
          }
        },
        (err) => {
          this.cancelFlag = false
        }
      )
    },
    // 知道了 or 再买一笔
    moreStroke() {
      // 知道了
      if (this.knowFlag) {
        base.href('http://action:3413')
        return
      }
      this.bugOne()
    },
    bugOne() {
      // 再买一笔
      const { prdtCode, prdtId, prdtName } = this.tradeInfo
      // window.buyProcess.preCheck({
      //   fromBranch: 'isAip',
      //   productCode: prdtCode,
      //   productName: prdtName,
      //   from: '定投记录详情',
      //   enter: '',
      //   productType: '2', // 产品类型 2-基金
      // })
      base.href("http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode="+prdtCode)
    },
    // 点击产品名称 跳转至产品详情
    jump() {
      if (this.sellFlag) return
      const { prdtCode } = this.tradeInfo
      base.href(
        `http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode=${prdtCode}`
      )
    },
  },
}
</script>

<style lang="less">
@import '/common/styles/prompt.css';
@import '/licai/com/css/quick-buy-alter.css';
@import '/licai/com/component/css/layer.css';

// @import '../../components/Common.less';

body,
html {
  width: 100%;
  height: 100%;
  background-color: #f7f8fa;
}
* {
  padding: 0;
  margin: 0;
}

.iphoneX {

  .api-record-info {
    &.confirmInfo {
      padding-bottom: 147px;  // 113 + 34
    }
  }

  .api-record-btns {
    bottom: 59px;  //25 +34
  }
}

.aip-record {
  flex: 1;
  flex: 1;
  overflow-y: auto;
}

.aip-record-detail-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 375px;
  min-height: 174px;
  padding: 46px 0 28px;
  background-color: #fff;

  .aip-record-detail-info-money {
    height: 48px;
    margin-bottom: 3px;
    font-family: PingFangSC-Medium;
    color: #323232;
    .money {
      font-size: 34px;
    }
    .money-spec {
      font-size: 16px;
    }
  }

  .aip-record-detail-info-note {
    font-family: PingFangSC-Regular;
    font-size: 15px;
    line-height: 21px;
    color: #999;
    text-align: center;
  }
}

.api-record-info {
  width: 375px;
  padding: 18px 20px;
  margin-top: 10px;
  background-color: #fff;

  &.confirmInfo {
    padding-bottom: 113px;
  }

  .api-record-info-title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    line-height: 25px;
    color: #323232;
  }

  .api-record-info-message {
    height: 20px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 20px;
    font-family: PingFangSC-Regular;
    clear: both;

    span {
      float: right;
      color: #323232;
      white-space: nowrap;

      .bank {
        width: 14px;
        height: 14px;
        margin-right: 3px;
      }
    }

    .tit {
      float: left;
    }

    .feature-tit {
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 20px;
      float:right;
      font-size: 14px;
    }
    .more {
      float:right;
      width: 5px;
      height: 8px;
      margin-left: 5px;
      margin-top: 5px;
    }

    .tit {
      display: inline-block;
      width: 75px;
      color: #666666;
    }

    .info-name {
      img {
        height: 15px;
        margin-top: -3.5px;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
  }

  .api-record-info-no {
    font-size: initial;
    span {
      font-size: 14px;
    }
  }
}

.api-record-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 343px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  // background-color: #f7f8fa;
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);

  span {
    width: 161px;
    height: 44px;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #fff;
    background: #ff8300;
    border-radius: 22px;
  }

  .btns-cancel {
    margin-right: 17px;
    color: #999999;
    background-color: #e1e1e1;
  }

  .api-record-btn {
    width: 343px;
  }
}
</style>
