<template>
  <div id="app">
    <!-- <waiting v-show="showWaiting"></waiting> -->
    <div class="top-w">
      <div class="top">
        <div class="left" @click="closePage"></div>
        <div class="tabs">
          <div class="tab">
            {{ resultData.type == 'intelligence' ? '智能定投' : '基金定投' }}
          </div>
        </div>
        <div
          class="right ignore"
          v-show="resultData.type == 'intelligence'"
          @click="jumpInteIntro"
        ></div>
      </div>
    </div>
    <div class="modify-aip-wrapper">
      <editaip
        ref="editAipRef"
        :isModify="1"
        v-bind="resultData"
        :oPaper="oPaper"
        :prdtCode="prdtCode"
        @listenAjaxPaper="listenAjaxPaper"
      ></editaip>
    </div>
  </div>
</template>
<script>
// import Waiting from '@/components/waiting/Waiting'
import base from 'base'
import ajax from 'ajax'
import local from 'local'
import loadScripts from '@/utils/loadScripts'
import editaip from '@/components/edit-aip/edit-aip'

export default {
  name: 'App',
  metaInfo: {
    title: '基金定投',
  },
  components: {
    // Waiting,
    editaip,
  },
  data() {
    return {
      resultData: {
        prdtCode: base.getUrlParameter('prdtCode'),
        prdtId: base.getUrlParameter('prdtId'),
        // companyCode: base.getUrlParameter('companyCode'), //基金公司代码
        lowMoney: 0.01, //最低起购金额
        highMoney: 999999999999999, //最高可购买金额
        // isCurrencyFund: '', //是否是货币基金
        // bankNo: '', //银行代码
        // cardNo: '', //银行卡号
        // allowTransPlan: '', //银行是否支持自动转入
        rateRelationList: [],
        // ------从上一个页面带来的参数--------
        subFundAccount: base.getUrlParameter('subFundAccount'), //定投子账户
        accountRate: base.getUrlParameter('rate'), //定投收益率
      },
      NUMBERMAX: '999999999999999',
      prdtName: base.getUrlParameter('prdtName'), //基金名称
      prdtCode: base.getUrlParameter('prdtCode'), //基金代码
      prdtId: base.getUrlParameter('prdtId'), //基金id
      //   companyCode: base.getUrlParameter('companyCode'), //基金公司代码
      //   showWaiting: true,
    }
  },
  created() {
    loadScripts(['/common/scripts/prompt.js']).then(() => {})
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    let _this = this
    if (base.isAndroid()) {
      $('.top-w').addClass('android')
      $('#app').addClass('android')
    } else if (base.isIphoneX()) {
      $('.top-w').addClass('iphoneX')
      $('#app').addClass('iphoneX')
    }
    _this.$nextTick(function() {
      let topHeight = $('.top-w').outerHeight()
      $('.modify-aip-wrapper').css('margin-top', topHeight)
    })

    this.init()
  },
  methods: {
    init: function() {
      let that = this
      $.when(that.getData($.Deferred()), that.getOrderInfo($.Deferred())).done(
        function() {
          if (!that.resultData.companyCode) {
            // that.showWaiting = false
            $('.loader-wrapper').hide()
            return
          }
          that.action5882($.Deferred()).done(function() {
            that.$nextTick(function() {
              that.$refs.editAipRef.initModifyData(that.resultData)
              //   that.showWaiting = false
              $('.loader-wrapper').hide()
            })
          })
        }
      )
    },
    getData: function(dtd) {
      let that = this
      let url = '/reqxml?action=27401&path=/forward&funcId=881018',
        option = {
          clientNo: '($account)', //客户号
          // ($TFrom)
          fundAccount: '($fund_account)', //资产账户
          sysNodeId: '($tztsysnodeid)', //系统ID
          password: '($password)', //用户密码
          prdtCode: this.prdtCode, //产品代码
          prdtId: this.prdtId,
        }
      ajax.run(
        url,
        option,
        function(data) {
          var oData

          try {
            oData = JSON.parse(data.BINDATA)
          } catch (error) {
            oData = {}
          }
          let { code, resultData, msg } = oData

          that.resultData = Object.assign({}, that.resultData, resultData)
          if (code != 0) {
            alert(msg || '网络超时，请稍后再试')
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
    // 智能定投_修改查询接口
    getOrderInfo: function(dtd) {
      let that = this
      let url = '/reqxml?action=27017&path=/time_invest/invest_modify_info',
        option = {
          clientNo: '($account)', //客户号
          subFundAccount: this.resultData.subFundAccount, //资产账户
        }
      ajax.run(
        url,
        option,
        function(jsonData) {
          var oData
          try {
            oData = JSON.parse(jsonData.BINDATA)
          } catch (error) {
            oData = {}
          }
          let { code, data, msg } = oData
          if (code == 0) {
            that.resultData.type = data.aipType == '2' ? 'intelligence' : '' //定投类型;1 普通 2 智能 Int
            that.resultData.m_balance = data.balance // 定投金额
            that.resultData.m_transferType = data.transferType //划款方式;主账户0，银证转账1
            that.resultData.m_period = data.period //周期;1 日;2 周;3 双周;4 月
            that.resultData.m_aipDay = data.aipDay //定投日，周/双周是周X;月是日期，日是空
            that.resultData.m_stockIndex = data.stockIndex //均线策略参考指数;1-沪深300，2-中证500，3-中小板指， 4-创业板指
            that.resultData.m_MA = data.MA //均线策略参考均线;1-500日均线，2-250日均线
            that.resultData.m_withAim = data.withAim //是否目标止盈;0 否 1 是
            that.resultData.m_aim = data.aim //目标止盈参数;普通/智能–比率；心愿，数字金额
            that.resultData.m_aimNext = data.aimNext //目标止盈到达后操作类型，0无效，1继续，2终止，3赎
            that.resultData.companyCode = data.fundCompany
          } else {
            alert(msg || '网络超时，请稍后再试')
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
    jsonParse: function(str) {
      try {
        return JSON.parse(str) || {}
      } catch (err) {
        return {}
      }
    },
    // 确定是否信息有修改
    checkInfoModified: function() {
      let oInfo = this.$refs.editAipRef.getModifyData()
      let bbalance = this.resultData.m_balance == oInfo.balance,
        bperiod = this.resultData.m_period == oInfo.period,
        baipDay = this.resultData.m_aipDay == oInfo.aipDay,
        btransferType = this.resultData.m_transferType == oInfo.transferType, //划款方式,主账户0，银证转账1
        bwithAim = this.resultData.m_withAim == oInfo.withAim,
        bstockIndex = true,
        bMA = true,
        baim = true,
        baimNext = true
      if (this.resultData.type == 'intelligence') {
        bstockIndex = this.resultData.m_stockIndex == oInfo.stockIndex
        bMA = this.resultData.m_MA == oInfo.MA
      }

      if (bwithAim && this.resultData.m_withAim == '1') {
        baim = this.resultData.m_aim == oInfo.aim //base.calculate(oInfo.aim, 100, '/')
        baimNext = this.resultData.m_aimNext == oInfo.aimNext
      }

      return (
        bbalance &&
        btransferType &&
        bperiod &&
        baipDay &&
        bstockIndex &&
        bMA &&
        bwithAim &&
        baim &&
        baimNext
      )
    },
    listenAjaxPaper: function(oParam) {
      let _this = this
      //   首先确认修改是否有改动
      if (!this.checkInfoModified()) {
        //划款方式,主账户0，银证转账1
        // 由账户->银行卡才需要签署
        if (
          oParam.hasSignAutoShiftToContract == '1' &&
          this.resultData.m_transferType != '1'
        ) {
          ajax.showLoading()
          $.when(this.ajaxPaperToSign($.Deferred(), oParam)).done(function() {
            let op = {
              oPaper: _this.oPaper,
            }
            _this.$refs.editAipRef.showModifyConfirm(op)
            ajax.hideLoading()
          })
        } else {
          _this.$refs.editAipRef.showModifyConfirm()
        }
      } else {
        new Prompt({
          id: 'modify-nochange-pop',
          title: '系统提示',
          content: '您的定投计划未做任何修改。',
          align: 'center',
          buttons: {
            btnNo: 1,
            left: {
              label: '确认',
              callback: function() {
                base.href('http://action:3413')
              },
            },
          },
        })
      }
    },
    // 获取协议列表
    ajaxPaperToSign: function(dtd, oParam) {
      let _this = this
      var url = '/reqxml?action=27502&path=/financing/trade/paper_to_sign'
      var obj = {
        clientNo: '($account)',
        token: '($token)',
        TFrom: '($tfrom)',
        bizCode: 1009, //1009 自动转入服务协议
        prdtIdList: _this.prdtId,
        // fundAccount: "($fund_account)", //资产账号
        // sysNodeId: "($tztsysnodeid)", //系统节点号
        // branchNo: "($khbranch)"
        // 基金定投类型 fundInvestType  1-普通 2-智能
        // 是否签署自动转入协议 hasSignAutoShiftToContract 0-否 1-是
        paramMap: JSON.stringify({
          fundInvestType: oParam.fundInvestType,
          hasSignAutoShiftToContract: oParam.hasSignAutoShiftToContract,
        }),
      }

      ajax.run(
        url,
        obj,
        function(data) {
          _this.oPaper = {}
          var msg = ''
          if (data.BINDATA) {
            // var oData = data.BINDATA;
            var oData = _this.jsonParse(data.BINDATA)
            var code = oData.code
            msg = oData.msg || '网络超时，请稍后再试'
            if (code == 0) {
              var serialId = oData.serialId //查询序号
              let agrtList = [],
                pdfItem = []
              // 基金招募说明书和基金合同改为不需要CA签署, 对应参数传caSign=0，其他默认不传就行
              if (oData.agrtList && oData.agrtList.length > 0) {
                oData.agrtList.forEach(function(item, index) {
                  let showName = ''
                  if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000411'
                  ) {
                    showName = '资金自动转入服务协议'
                  }
                  let agrtListItem = {
                    productId: item.productId, // 产品ID
                    protocolNo: item.protocolNo, // 协议编号
                    showName: showName, //展示在页面上的名字->根据协议号写死
                    agrtName: item.agrtName || '合同签署', // 协议名称
                    version: item.version, // 协议版本
                    classify: item.classify, // 协议分类，1-业务协议，2-产品协议
                    agrtUrl: item.agrtUrl, // 协议地址 .replace(/amp;/gi, '')
                    md5File: item.md5File, //文件md5
                    fillingSourceId: item.fillingSourceId, //填充ID
                  }
                  agrtList.push(agrtListItem)
                  let oPdfItem = {
                    productId: item.productId, //'产品ID',
                    protocolNo: item.protocolNo, //'协议编号'
                    version: item.version, //'协议版本'
                    classify: item.classify, //'协议分类，1-业务协议，2-产品协议'
                    md5File: item.md5File, //'文件md5'
                    fillingSourceId: item.fillingSourceId, //填充ID
                  }
                  pdfItem.push(JSON.stringify(oPdfItem))
                })
              }
              _this.oPaper = Object.assign({}, _this.oPaper, {
                pass: true,
                serialId: oData.serialId,
                bizCode: 1009,
                agrtList: agrtList,
                strAgrtList: '[' + pdfItem.toString() + ']',
              })
              dtd.resolve()
              return
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
    // 获取用户权限
    action5882: function(dtd) {
      let _this = this
      ajax.run(
        '/reqxml?action=5827&Token=($token)&MobileCode=($mobilecode)&Account=($account)',
        '',
        function(xml) {
          var clientType = xml.CLIENTTYPE
          var ajaxUrl =
            '/reqxml?action=5882&Token=($token)&MobileCode=($mobilecode)&Account=($account)' +
            '&FundCompany=' +
            _this.resultData.companyCode +
            '&FundCode=' +
            _this.prdtCode +
            '&Reqno=($reqno)&BussinessFlag=1&wttype=22' + //22为申购
            '&Clienttype=' +
            clientType
          ajax.run(
            ajaxUrl,
            '',
            function(xml) {
              let isFirst = parseInt(_this.getCounterValue(xml, '是否首次'))
              let lowMoney = _this.getCounterValue(xml, '最低定投起点')
              let maxNumber =
                Number(_this.getCounterValue(xml, '单人上限')) == 0
                  ? _this.NUMBERMAX
                  : _this.getCounterValue(xml, '单人上限')
              let cpmaxNumber =
                Number(_this.getCounterValue(xml, '产品规模上限')) == 0
                  ? _this.NUMBERMAX
                  : _this.getCounterValue(xml, '产品规模上限')
              let maxOnce =
                Number(_this.getCounterValue(xml, '单笔上限')) == 0
                  ? _this.NUMBERMAX
                  : _this.getCounterValue(xml, '单笔上限')
              let maxDay =
                Number(_this.getCounterValue(xml, '单日上限')) == 0
                  ? _this.NUMBERMAX
                  : _this.getCounterValue(xml, '单日上限')
              //   最低
              if (!lowMoney) {
                lowMoney = 0.01
              }
              // 最高
              let highMoney = ''
              if (
                Number(Math.min(maxNumber, maxOnce, maxDay, cpmaxNumber)) !== 0
              ) {
                highMoney = Math.min(maxNumber, maxOnce, maxDay, cpmaxNumber)
              }
              _this.resultData = Object.assign({}, _this.resultData, {
                lowMoney: lowMoney,
                highMoney: highMoney,
              })
              dtd.resolve()
            },
            function(msg) {
              alert(msg.ERRORMESSAGE || '网络连接失败')
              dtd.resolve()
            }
          )
        },
        function(msg) {
          alert(msg.ERRORMESSAGE || '网络连接失败')
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    getCounterValue: function(data, attr) {
      if (data && data.GRID0 && attr) {
        var arr = data.GRID0
        var b = this.strToArrs(arr)
        if (typeof attr === 'string') {
          return b[1][$.inArray(attr, b[0])]
        } else if (attr instanceof Array) {
          var value = []
          for (var i = 0; i < attr.length; i++) {
            value[attr[i]] = b[1][$.inArray(attr[i], b[0])]
          }
          return value
        }
      }
    },
    // 字符串转换为数组 有标题
    strToArrs: function(arr) {
      var b = []
      for (var i = 0, j = arr.length; i < j; i++) {
        var a = arr[i].split('|')
        a.splice(a.length - 1, 1)
        b.push(a)
      }
      return b
    },
    // 智能定投头部图片点击跳转至智能定投介绍页面
    jumpInteIntro: function() {
      alert('智能定投头部图片点击跳转至智能定投介绍页面')
      return
      //   let url = ''
      //   base.href(url)
    },
    closePage: function() {
      base.href('http://action:3413')
    },
  },
}
</script>
<style lang="less">
@import '../../components/Prompt.css';
@import './App.less';
.prompt.center .content {
  padding: 8px 10px 20px 10px;
}
</style>
