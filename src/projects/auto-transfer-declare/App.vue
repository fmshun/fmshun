<template>
  <div id="use-nav-top-app">
    <!-- <waiting v-show="showWaiting"></waiting> -->
    <navtop title="资金自动转入服务说明"></navtop>
    <div class="auto-transfer-declare-wrapper">
      <div class="rules">
        <p>
          1.自动转入资金服务（下称“本服务”）是指华泰证券为符合条件的客户定期从主资金账户绑定的银行卡（下称“银行卡”）向资金账户划转定额资金。
        </p>
        <p>
          2.目前持有以下银行储蓄卡的客户，在银行卡与主资金账户绑定，且签署《自动转入资金服务》协议后可开通本服务。
          <br />
          支持银行：
          <span class="bank">{{ strBank }}</span>
        </p>
        <p>
          3.划转资金的日期同您在设置定投计划时指定的投资日期，划转金额同投资金额。本服务的开通与定投计划逐一对应。如果自动转入资金日恰逢节假日，则顺延至下一交易日操作。
        </p>
        <p>
          4.本服务仅提供银行卡向资金账户的资金划转，是否成功与否取决于银转证时银行卡状态是否正常、卡内余额是否充足等多重因素，华泰证券不保证划转一定成功，转入结果请留意银行及证券端的资金流水。
        </p>
        <p>
          5.本服务的终止与定投计划逐一对应。定投计划终止或暂停时，与计划对应的自动转入资金服务将终止。
        </p>
        <p>
          6.若日间将通过本服务转入的资金用于其他交易，可能导致定投计划购买基金份额失败，请保障16：00前账户可用余额充足，如有需要可通过手动转入资金的方式临时补足账户余额。
        </p>
        <p>
          7.自动转入资金服务生效期间，如变更主资金账户的银行卡，则与原三方存管银行建立的相关自动转入资金服务计划失效，不再为您自动转入。如您仍需变更存管银行卡，请先终止此服务后再行变更。
        </p>
        <p>
          8.若设置自动转入日为日期当天，则可能会出现无法自动转入的情况。则第一个转入日为下一个月当日之后的第一个交易日。
        </p>
      </div>

      <div class="bottom">
        <div class="more">
          <p>
            <span>更多内容请查阅</span>
            <span @click="contractClick">《资金自动转入服务协议》</span>
          </p>
        </div>
        <div class="resButton" @click.capture="btnClick">
          <span>确认</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Waiting from '@/components/waiting/Waiting'
import base from 'base'
import ajax from 'ajax'
import bankdata from '@/components/bank/bankdata'
import navtop from '@/components/nav-top/nav-top'

export default {
  name: 'App',
  metaInfo: {
    title: '资金自动转入服务说明',
  },
  components: {
    // Waiting,
    navtop,
  },
  data() {
    return {
      //   showWaiting: true,
      bankList: [],
      prdtId: base.getUrlParameter('prdtId') || '',
    }
  },
  computed: {
    strBank: function() {
      return this.bankList.join('、') + '。'
    },
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    this.init()
  },
  methods: {
    init: function() {
      let that = this

      //   this.initHead()
      this.getData($.Deferred()).done(function() {
        // that.showWaiting = false
        $('.loader-wrapper').hide()
      })
    },
    getData: function(dtd) {
      let that = this
      var url = '/reqxml?action=27006&path=/financing/salary/bank_list'
      ajax.run(
        url,
        '',
        function(res) {
          var BINDATA = JSON.parse(res.BINDATA),
            code = BINDATA.code,
            msg = BINDATA.msg
          if (code === '0') {
            var len = BINDATA.bankList.length
            for (var i = 0; i < len; i++) {
              that.bankList.push(
                bankdata.getDataByCode(BINDATA.bankList[i].interBankNo).name
              )
            }
          }
          dtd.resolve()
        },
        function(err) {
          dtd.resolve(false)
        }
      )
      return dtd.promise()
    },
    contractClick: function() {
      ajax.showLoading()
      // 调取协议
      $.when(this.ajaxPaperToSign($.Deferred())).done(function() {
        ajax.hideLoading()
      })
    },
    // 获取协议列表
    ajaxPaperToSign: function(dtd, oParam) {
      let _this = this
      var url = '/reqxml?action=27502&path=/financing/trade/paper_to_sign'
      var obj = {
        clientNo: '($account)',
        token: '($token)',
        TFrom: '($tfrom)',
        bizCode: 1008, //1008 定投
        prdtIdList: _this.prdtId,
        // fundAccount: "($fund_account)", //资产账号
        // sysNodeId: "($tztsysnodeid)", //系统节点号
        // branchNo: "($khbranch)"
        // 基金定投类型 fundInvestType  1-普通 2-智能
        // 是否签署自动转入协议 hasSignAutoShiftToContract 0-否 1-是
        paramMap: JSON.stringify({
          fundInvestType: 2,
          hasSignAutoShiftToContract: 1,
        }),
      }

      ajax.run(
        url,
        obj,
        function(data) {
          var msg = ''
          if (data.BINDATA) {
            var oData = JSON.parse(data.BINDATA)
            var code = oData.code
            msg = oData.msg || '网络超时，请稍后再试'
            if (code == 0) {
              var serialId = oData.serialId //查询序号
              let agrtList = [],
                pdfItem = []
              // 基金招募说明书和基金合同改为不需要CA签署, 对应参数传caSign=0，其他默认不传就行
              if (oData.agrtList && oData.agrtList.length > 0) {
                oData.agrtList.forEach(function(item, index) {
                  if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000411'
                  ) {
                    let showName = '资金自动转入服务协议'

                    var func = {
                      title: showName,
                      pdfs: item.agrtUrl,
                      isTipShow: false,
                      buttonText: '确定',
                      topColor: 'ff8300',
                    }
                    base.href(
                      'http://action:80022?func=' +
                        encodeURIComponent(JSON.stringify(func)) +
                        '&&type=1'
                    )
                    dtd.resolve()
                    return
                  }
                })
              }
            } else {
              alert(msg)
            }
          }

          dtd.resolve()
        },
        function(data) {
          alert(data.ERRORMESSAGE || '网络连接失败')
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    btnClick: function() {
      base.href('http://action:3413') // 关闭当前容器
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
  },
}
</script>
<style lang="less">
// @import '../../components/navigation-bar/navigation-bar.css';
@import './App.less';
</style>
