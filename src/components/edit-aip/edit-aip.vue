// 注意该组件中 写了 gobackonload // isTarget 是否是目标盈，1-是 // isModify
是否是修改流程 1是
<template>
  <div
    :class="{ blue: isTarget == '1' ? true : false }"
    class="edit-aip-content-wrapper"
  >
    <div class="name">
      <span>{{ prdtName || '--' }}（{{ prdtCode }}）</span>
    </div>

    <!-- 输入框部分 -->
    <div class="con">
      <div class="top">
        <div class="aip-label">定投金额</div>
        <div class="rule" @click="jumpTradeRule">交易规则</div>
      </div>
      <div class="input-w" @click="inputFocusHandler">
        <img src="./images/buyNew2.png" class="dollar" />
        <div
          class="input"
          :class="{
            placeholder: inputData === '',
            font38: inputData.length > INPUT_MAX_LENGTH,
          }"
          data-on="inputData"
          v-html="strInputData"
        ></div>
        <div
          class="clear"
          v-show="bShowClear && bInputFocus"
          @click="clickClearHandler"
        ></div>
      </div>
      <!-- 当输入金额超过万元时，在万位底部后方显示“万”字；
      每多输入一位，则底部固定区域显示中文翻译对应单位，即万、十万、百万、千万、亿-->
      <div class="line" v-show="strLine">
        <div class="lineTip" :class="lineClass">{{ strLine }}</div>
      </div>

      <!-- 费率展示 -->
      <!-- 普通定投 -->
      <p v-if="type !== 'intelligence'" class="rate-tip">
        <span v-html="strBuyRate"></span>
      </p>
      <!-- 智能定投提示 -->
      <div class="inte-tip" v-else>
        <p v-if="inputData === ''" class="rate-tip">
          <span v-html="strBuyRate"></span>
        </p>
        <p v-else>
          预估定投金额
          <span class="val">{{ minDeduction }}～{{ maxDeduction }}元</span>
          <img
            src="./images/qa.png"
            alt
            class="qa ignore"
            @click="clickIntelligenceDesc"
          />
        </p>
        <p class="reference">
          参考指数：{{ strZS }}，参考均线：{{ strJX }}。
          <span class="modify" @click="clickModifyStockInfos">修改</span>
        </p>
      </div>
      <!-- 金额不正确提示 -->
      <!-- <div
        class="error-tip"
        :class="{
          'intell-tip': type === 'intelligence' && !strErrorTip,
          error: strErrorTip,
        }"
      >
        <p
          v-show="
            (type !== 'intelligence' && !strErrorTip) ||
              (type === 'intelligence' && inputData === '')
          "
        >
          <span v-html="strBuyRate"></span>
        </p>
        
      </div>-->
      <p class="error-tip" v-show="strErrorTip">
        <img class="ignore" src="./images/error.png" alt />
        {{ strErrorTip }}
      </p>
    </div>

    <!-- 设置部分 -->
    <div class="transferin-w">
      <!-- 转入方式 -->
      <!-- 默认展示银行卡定投 -->
      <div class="transferin-bank" @click="clickBankHandler">
        <div class="fl">转入方式</div>
        <Bank
          class="fr"
          ref="bankRef"
          v-if="transferInType === 'bank' && bSupportAutoTransfer"
          :bankCode="interBankNo"
          :bankNum="cardNo"
        ></Bank>
        <div class="fr htsc" v-else>
          <img src="./images/htsc-logo.png" />
          <span>华泰账户</span>
        </div>
        <!-- <div class="fr bank-name" data-bankNo="0005">
                <img src="/zlcftajax/yzzz/img/bank_cg/logo_cmb_cg.png">
                <i>招商银行</i>
        </div>-->
      </div>

      <!-- 定投周期 -->
      <div class="transferin-date" @click="clickDateHandler">
        <div class="fl">定投周期</div>
        <div class="fr transferin-date-inner">
          <p class="l1" id="transferinDate">{{ cycleInfo }}</p>
        </div>
        <div class="h10"></div>
        <!-- 转入方式为“银行卡” -->
        <!-- 点击箭头，进入资金自动转入服务说明页面 -->
        <!-- 智能定投转入方式为银行卡 -->
        <p
          class="detail bank"
          v-if="type === 'intelligence' && transferInType === 'bank'"
          @click.stop="jumpAutoTransferDeclare"
        >
          根据参考指数波动调整每期定投金额，最近转入时间
          <span class="transferin-date-text">{{ regDate || '--' }}</span>
          ，遇非交易日向后顺延
          <!-- 在11:30-15:00之间创建银行卡定投且是创建当日扣款的 -->
          <span v-if="nextTradeDate == currentDate && bAfterBankTranfer">
            。由于今日定投银证转账时间已过，将从华泰账户扣款，请保持账户资金充足。银行卡转入从下一转入时间开始。
          </span>
          <span v-else>。请保持银行账户资金充足</span>
        </p>
        <!-- 智能定投转入方式为华泰账户 -->
        <p
          class="detail"
          v-else-if="type === 'intelligence' && transferInType === 'htsc'"
        >
          根据参考指数波动调整每期定投金额，最近转入时间
          <span class="transferin-date-text">{{ regDate || '--' }}</span>
          ，遇非交易日向后顺延
        </p>
        <!-- 普通定投转入方式为银行卡 -->
        <p
          class="detail bank"
          v-else-if="transferInType === 'bank'"
          @click.stop="jumpAutoTransferDeclare"
        >
          最近转入时间
          <span class="transferin-date-text">{{ regDate || '--' }}</span>
          ，遇非交易日向后顺延
          <!-- 在11:30-15:00之间创建银行卡定投且是创建当日扣款的 -->
          <span v-if="nextTradeDate == currentDate && bAfterBankTranfer">
            。由于今日定投银证转账时间已过，将从华泰账户扣款，请保持账户资金充足。银行卡转入从下一转入时间开始。
          </span>
          <span v-else>。请保持银行账户资金充足</span>
        </p>
        <!-- 转入方式为“华泰账户” -->
        <p class="detail" v-else>
          最近转入时间
          <span class="transferin-date-text">{{ regDate || '--' }}</span>
          ，遇非交易日向后顺延
        </p>
      </div>
      <!-- 设置定投周期 -->
      <!-- <div class="transferin-date-layer"></div>
      <p class="auto-tip tip">已为您开通自动转入资金服务功能，将定期为您转入资金</p>
      <p class="mutual-tip tip none" style="display: none;">请确保投资日账户可用余额充足，如有需要可手动转入资金。</p>
      <span class="change-transfer-btn">更改转入设置</span>-->
    </div>

    <!-- 设置目标止盈 -->
    <!-- 除货币基金以外，均提供目标止盈功能 设置开关默认关闭 -->
    <setstopparam
      class="setstopparam"
      ref="setStopParamRef"
      :isTarget="isTarget"
      v-if="isCurrencyFund === 'N'"
      :on="bOnStopParam"
      :isModify="isModify"
      :accountRate="accountRate"
      :stopParamRate="Number(stopParamRate)"
      :stopParamType="stopParamType"
      @listenOnStopParam="listenOnStopParam"
    ></setstopparam>

    <!-- 底部按钮 -->
    <div
      class="btn-ensure"
      :class="{ highlight: bValValid }"
      @click.stop="btnEnsureHandler"
    >
      <div v-if="isModify == '1'">确认修改</div>
      <div v-else>下一步</div>
    </div>
    <!-- 键盘 -->
    <!-- :confirmHighlight="bValValid" -->
    <keyboard
      @listenKeyboardClick="listenKeyboardClick"
      :inputData="inputData"
      :maxLength="INPUT_MAX_LENGTH"
      v-show="bInputFocus"
    ></keyboard>
    <!-- 选择转入方式 -->
    <transferinbanklayer
      :bShowBankLayer="bShowBankLayer"
      @listenBankChoose="listenBankChoose"
      @listenBankClose="listenBankClose"
      :fundAccount="fundAccount"
      :bankCode="interBankNo"
      :bankNum="cardNo"
      :bSupportAutoTransfer="bSupportAutoTransfer"
      :transferInType="
        transferInType == 'bank' && bSupportAutoTransfer ? 'bank' : 'htsc'
      "
    ></transferinbanklayer>
    <!-- 设置定投周期 -->
    <!-- 默认展示每周周四 -->
    <cycle
      v-if="isShowCycle"
      :period="period"
      :rate="rate"
      @click-cycle-close="clickCycleClose"
      @click-cycle-confirm="clickCycleConfirm"
    ></cycle>
    <!-- 三匹配弹框 -->
    <matchresultlayer
      :isTarget="isTarget"
      :bShowMatchResultLayer="bShowMatchResultLayer"
      :eFileContract="JSON.stringify(eFileContract)"
      :riskMatchResult="riskMatchResult"
      :matchResultItem="matchResultItem"
      :jumpEFilePdf="jumpEFilePdf"
      :checkVersion="checkVersion"
      @listenMatchResultLayerEnsure="listenMatchResultLayerEnsure"
      @listenMatchResultLayerClose="listenMatchResultLayerClose"
    ></matchresultlayer>
    <!-- <div class="confirmA" id="confirmAlter"> -->
    <editconfirmlayer
      :isTarget="isTarget"
      v-bind="getConfirmData()"
      :bShowConfirmLayer="bShowConfirmLayer"
      @listenConfirmLayerClose="listenConfirmLayerClose"
      @listenConfirmLayerEnsure="listenConfirmLayerEnsure"
      :clickContractHandler="clickContractHandler"
      :isOrg="isOrg"
    ></editconfirmlayer>
    <!-- :code="prdtCode"
        :name="prdtName"
        :transferinTime="transferinTime"
    :transferinType="transferinType"-->
    <!-- </div> -->
  </div>
</template>
<script>
import buyNew16 from './images/buyNew16.gif'
import base from 'base'
import ajax from 'ajax'
import local from 'local'
import Keyboard from '@/components/keyboard/Keyboard'
import Bank from '@/components/bank/Bank'
import {
  cycleInfos,
  stopParamInfos,
  stockZSInfos,
  stockJXInfos,
} from '@/components/Common'
import Cycle from '@/components/cycle/Cycle'
import matchresultlayer from '@/components/match-result/match-result'
import editconfirmlayer from '@/components/edit-confirm/edit-confirm'
import transferinbanklayer from '@/components/set-transferin-style/set-transferin-style'
import setstopparam from '@/components/set-stop-param/set-stop-param'

// import NavigationBar from '@/components/navigation-bar/navigation-bar'

export default {
  name: 'editaip',
  props: {
    type: String, //表示是否为智能定投
    prdtCode: String, //基金代码
    prdtId: String, //基金id
    prdtName: String, //基金名称
    lowMoney: [String, Number], //最低起购金额
    highMoney: [String, Number], //最高可购买金额
    isCurrencyFund: String, //是否是货币基金
    bankNo: String, //银行代码
    interBankNo: String, //内部银行编号interBankNo用来返回补0的银行编号，之前返回的bankNo用来下单
    cardNo: String, //银行卡号
    allowTransPlan: String, //银行是否支持自动转入
    minDeductionRatio: String, //智能定投最低
    maxDeductionRatio: String, //智能定投最高
    rateRelationList: Array,
    fixedInvestDisCount: [Number, String], //定投固定的折扣
    oPaper: Object, //签署的协议
    urlParam: Object,
    jumpInteIntro: Function,
    inteTopCloseHandler: Function,
    isTarget: String, // 是否是目标盈，1-是
    isModify: String, //是否是修改流程 1是
    feeMode: [String, Number], //申购费计算模式 1-固定收费 2-按金额分级 3-按持有期限分级 4-按金额与持有期限分级
  },
  watch: {
    rateRelationList: function() {
      this.checkBuyRateRange()
    },
    lowMoney: function() {
      this.updateIntelliLowMoney()
    },
    type: function() {
      //当普通定投和智能定投切换的时候，将弹框都隐藏
      this.bShowMatchResultLayer = false
      this.bShowConfirmLayer = false
      this.enableScroll()
      this.updateIntelliLowMoney()
      this.checkValValid()
    },
    allowTransPlan: function() {
      if (this.allowTransPlan === 'false') {
        this.transferInType = 'htsc'
      }
    },
  },
  components: {
    Keyboard,
    Bank,
    matchresultlayer, //三匹配浮层
    editconfirmlayer, //下单浮层
    transferinbanklayer, //设置转入方式
    Cycle,
    setstopparam, //设置目标止盈
  },

  data() {
    let _this = this
    return {
      //   prdtCode: '110011', //基金代码
      //   prdtName: '汇添富成长焦点混合', //基金名称
      //   isCurrencyFund: false, //是否是货币基金

      //   bankNo: '0005', //银行代码
      //   cardNo: '0999', //银行卡号
      fundAccount: '', //华泰账户
      clientMoney: '', //资金账户余额
      isClientMoneyError: '', //是不是资金余额的错误
      isInTime: true, //是否在交易时间
      data: {}, //从接口请求回来的数据
      inputData: '',
      INPUT_MAX_LENGTH: 9, //数据最大长度 小数点前的
      bShowClear: false, //是否展示清除图标
      strErrorTip: '', //输入数据校验-错误提示
      bInputFocus: false, //输入框是否聚焦
      strBuyRate: '买入费率 --%', //结构化收益率数据
      stockZSIndex: 1, //均线策略参考指数  默认显示参考指数沪深300
      stockJXIndex: 0, //均线策略参考均线 默认参考均500日均线
      transferInType: 'bank',
      bShowBankLayer: false, //展示转入方式弹框
      isShowCycle: false, //展示定投周期
      period: 1, //默认展示每周周四
      rate: 3,
      bOnStopParam: false, //是否打开目标定投
      stopParamRate: 10, //目标止盈收益率
      stopParamType: 0, //目标止盈终止方式  ['自动赎回', '继续定投', '终止定投']
      bShowMatchResultLayer: false, //展示三匹配弹框
      bOpenAccountChange: true, //
      bShowConfirmLayer: false, //展示二次确认弹框
      regDate: '--', //最近转入时间
      nextTradeDate: '', //下一转入日 20200910
      currentDate: '', //当前日期 20200910
      bAfterBankTranfer: false, //是否在11:30-15:00
      //   rateRelationList: _this.rateRelationList,
      showLowMoney: '',
      subFundAccount: '',
      accountRate: '', //修改流程中需要用到的 持仓收益率
    }
  },
  computed: {
    way: function() {
      return this.type == 'intelligence' ? '智能定投' : '普通定投'
    },
    bSupportAutoTransfer: function() {
      return this.allowTransPlan == 'true' ? true : false
    },
    minDeduction: function() {
      if (this.inputData === '') {
        return '--'
      }
      return parseFloat(
        base.calculate(this.minDeductionRatio, this.inputData, '*')
      ).toFixed(2)
    },
    maxDeduction: function() {
      if (this.inputData === '') {
        return '--'
      }
      return parseFloat(
        base.calculate(this.maxDeductionRatio, this.inputData, '*')
      ).toFixed(2)
    },
    strZS: function() {
      return stockZSInfos[this.stockZSIndex]
    },
    strJX: function() {
      return stockJXInfos[this.stockJXIndex]
    },
    riskMatchResult: function() {
      if (this.urlParam && this.urlParam.riskMatchResult) {
        return this.urlParam.riskMatchResult
      }
      return ''
    },
    // 三匹配信息
    matchResultItem: function() {
      if (this.urlParam && this.urlParam.matchResultItem) {
        return this.jsonParse(this.urlParam.matchResultItem) || {}
      }
      return {}
    },
    // 开户信息
    openAccount: function() {
      if (this.isModify == '1') {
        return { pass: true }
      }
      if (this.urlParam && this.urlParam.openAccount) {
        return this.jsonParse(this.urlParam.openAccount) || {}
      }
      return {}
    },
    // 是否是机构户
    isOrg() {
      let isOrg = false
      if (this.urlParam && this.urlParam.isOrg) {
        isOrg = true
      }
      return isOrg
    },
    // 电子签名约定书
    eFileContract: function() {
      if (this.urlParam && this.urlParam.eFileContract) {
        return this.jsonParse(this.urlParam.eFileContract) || {}
      }
      return {}
    },
    //输入数据是否合法 底部按钮和键盘是否高亮
    bValValid() {
      if (this.inputData == '.' || Number(this.inputData) == 0) {
        return false
      }
      if (this.strErrorTip === '') {
        return true
      }
      if (this.isClientMoneyError) {
        return true
      }
      return false
    },
    //   输入框默认用户最多只能输入9位整数+2位小数
    strInputData() {
      let imgGif = `<img src="${buyNew16}">`

      //   未输入时默认显示产品最低定投金额，话术为“最低定投金额x元“
      if (!this.bInputFocus && this.inputData === '') {
        return `最低定投金额${this.showLowMoney}元`
      } else if (!this.bInputFocus && this.inputData) {
        //不聚焦输入框
        return `${this.inputData}`
      } else if (this.inputData === '') {
        return `${imgGif}最低定投金额${this.showLowMoney}元`
      }
      return `${this.inputData}${imgGif}`
    },
    lineClass() {
      if (this.inputData.length > this.INPUT_MAX_LENGTH) {
        if (Number(this.inputData.substr(0, 1)) == 1) {
          return 'left small'
        }
        return 'small'
      }
      let moneyLength = this.inputData.split('.')[0].length
      if (moneyLength >= 5 && Number(this.inputData.substr(0, 1)) == 1) {
        //如果第一位数是1，则标尺线要向左移动
        return 'left'
      }
      return ''
    },
    // 根据输入数字进行万位及以上的实时输入提示。当输入金额超过万元时，在万位底部后方显示“万”字；
    // 每多输入一位，则底部固定区域显示中文翻译对应单位，即万、十万、百万、千万、亿
    strLine() {
      let moneyLength = this.inputData.split('.')[0].length
      var moneyUnitMap = {
        '5': '万',
        '6': '十万',
        '7': '百万',
        '8': '千万',
        '9': '亿',
        '10': '十亿',
        '11': '百亿',
        '12': '千亿',
      }
      if (moneyUnitMap[moneyLength]) {
        return moneyUnitMap[moneyLength]
      }
      return ''
    },
    cycleInfo() {
      var str = ''
      if (this.period == 0) {
        str = '每个交易日'
      } else if (this.period == 3) {
        str = `${cycleInfos.periods[this.period]}${Number(
          cycleInfos.rates[this.period][this.rate]
        )}号`
      } else {
        str = `${cycleInfos.periods[this.period]}${
          cycleInfos.rates[this.period][this.rate]
        }`
      }
      return str
    },
  },
  created() {},
  mounted() {
    let _this = this

    _this.getAccountInfo($.Deferred())
    _this.action5620(_this.cuttime)
    _this.enableMoney($.Deferred()).done(function() {})
    this.checkBuyRateRange()
    // 下面这段会引起在IOS上跳转回来后页面不响应一段时间
    $('body')
      .unbind()
      .on('click', function(e) {
        if ($(e.target).parents('.input-w').length > 0) {
          return
        }
        if (_this.bInputFocus) {
          _this.bInputFocus = false
          _this.enableScroll()
        }
      })
    window.GoBackOnLoad = _this.back
  },
  methods: {
    getIsPreventTouchMove: function() {
      if (
        this.bShowMatchResultLayer ||
        this.bShowConfirmLayer ||
        this.bInputFocus ||
        this.bShowBankLayer ||
        this.isShowCycle
      ) {
        return true
      }
      return false
    },
    updateIntelliLowMoney: function() {
      if (this.type === 'intelligence') {
        this.showLowMoney = base.calculate(
          this.lowMoney,
          this.minDeductionRatio,
          '/'
        )
        this.showLowMoney = parseFloat(this.showLowMoney).toFixed(2)
      } else {
        this.showLowMoney = this.lowMoney
      }
    },
    initModifyData: function(oParam) {
      if (this.isModify != '1') {
        return
      }
      this.type = oParam.type
      this.inputData = '' + oParam.m_balance
      this.checkBuyRateRange()
      this.accountRate = oParam.accountRate
      if (this.type === 'intelligence') {
        let stockZSMap = {
          //   ['中证500', '沪深300', '创业板指']
          2: 0,
          1: 1,
          4: 2,
        }
        //   ['250日均线', '500日均线']
        let stockJXMap = {
          2: 0,
          1: 1,
        }

        this.stockZSIndex = stockZSMap[oParam.m_stockIndex] //均线策略参考指数,1-沪深300，2-中证500，3-中小板指， 4-创业板指
        this.stockJXIndex = stockJXMap[oParam.m_MA] //均线策略参考均线,1-500日均线，2-250日均线
      }
      this.transferInType = oParam.m_transferType == '1' ? 'bank' : 'htsc' //划款方式,主账户0，银证转账1

      this.period = oParam.m_period - 1
      if (this.period == 0) {
        this.rate = 0
      } else {
        this.rate = oParam.m_aipDay - 1
      }
      this.cuttime()
      this.bOnStopParam = oParam.m_withAim == '1' ? true : false //是否目标止盈,0 否 1 是
      if (this.bOnStopParam) {
        let stopParamTypeMap = {
          3: 0,
          1: 1,
          2: 2,
        }
        this.stopParamRate = base.calculate(oParam.m_aim, 100, '*') //目标止盈参数,普通/智能–比率；心愿，数字金额
        this.stopParamType = stopParamTypeMap[oParam.m_aimNext] //目标止盈到达后操作类型，0无效，1继续，2终止，3赎
        this.$refs.setStopParamRef.setParam(
          this.stopParamRate,
          this.stopParamType
        )
      }
      this.subFundAccount = oParam.subFundAccount
      this.updateIntelliLowMoney()
      this.checkValValid()
      this.$forceUpdate()
    },
    initCounter: function(oParam) {
      this.inputData = '' + oParam.m_balance
      this.checkBuyRateRange()
      this.period = oParam.m_period - 1
      if (this.period == 0) {
        this.rate = 0
      } else {
        this.rate = oParam.m_aipDay - 1
      }
      this.cuttime()
      this.checkValValid()
      this.$forceUpdate()
    },
    back() {
      let _this = this
      //   ajax.showLoading()
      //读取目标设置数值
      local.readObject(
        {
          financing_aip_edit_stop_param: '',
        },
        function(data) {
          if (_this.isTarget == '1') {
            // ajax.hideLoading()
            if (!data.FINANCING_AIP_EDIT_STOP_PARAM) {
              return
            }
            let oData = JSON.parse(data.FINANCING_AIP_EDIT_STOP_PARAM)
            _this.stopParamRate = oData.yieldNum
            _this.stopParamType = oData.selectedType
            _this.$refs.setStopParamRef.setParam(
              _this.stopParamRate,
              _this.stopParamType
            )
          } else {
            local.saveObject(
              {
                financing_aip_edit_stop_param: '',
              },
              function() {
                // setTimeout(function() {
                //   ajax.hideLoading()
                // }, 1000)

                if (!data.FINANCING_AIP_EDIT_STOP_PARAM) {
                  return
                }
                let oData = {}
                try {
                  oData = JSON.parse(data.FINANCING_AIP_EDIT_STOP_PARAM)
                } catch (e) {
                  oData = {}
                }

                _this.stopParamRate = oData.yieldNum
                _this.stopParamType = oData.selectedType
                _this.$refs.setStopParamRef.setParam(
                  _this.stopParamRate,
                  _this.stopParamType
                )
              }
            )
          }
        }
      )
      local.readObject(
        {
          financing_aip_edit_intelligent_param: '',
        },
        function(data) {
          local.saveObject(
            {
              financing_aip_edit_intelligent_param: '',
            },
            function() {
              if (!data.FINANCING_AIP_EDIT_INTELLIGENT_PARAM) {
                return
              }
              let oData = JSON.parse(data.FINANCING_AIP_EDIT_INTELLIGENT_PARAM)
              _this.stockZSIndex = oData.zsIndex
              _this.stockJXIndex = oData.jxIndex
            }
          )
        }
      )
    },
    //获取可用资金
    enableMoney: function(dtd) {
      let _this = this
      var url =
          '/reqxml?action=27502&path=/financing/trade/query_client_avail_fund',
        objParam = {
          clientNo: '($account)',
          sysnodeId: '($tztsysnodeid)',
          fundAccount: '($fund_account)',
        }
      ajax.run(
        url,
        objParam,
        function(data) {
          var oData = _this.jsonParse(data.BINDATA)
          var code = oData.code
          var msg = oData.msg
          if (code === '0') {
            _this.clientMoney = oData.clientAvailFund
            base.log('资金账户余额：' + _this.clientMoney)
          } else {
            alert(msg || '网络超时，请稍后再试')
          }
          dtd.resolve()
        },
        function(msg) {
          alert(msg.ERRORMESSAGE || '网络连接失败')
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    getHasPop() {
      return this.bShowMatchResultLayer || this.bShowConfirmLayer
    },
    jsonParse: function(str) {
      try {
        return JSON.parse(str) || {}
      } catch (err) {
        return {}
      }
    },
    getRateHtml: function(original, upnew) {
      if (original == undefined || original == '' || original == upnew) {
        if (upnew.indexOf('元') > -1) {
          let n = upnew.replace('元', '')
          return `买入费用 <span class="new">${n}</span>元`
        }
        return `买入费率 <span class="new">${upnew}</span>`
      }
      return `买入费率 <span class="origin">${original}</span>
                    <span class="new">${upnew}</span>`
    },
    checkBuyRateRange: function() {
      // 输入金额最大时，费率怎么展示 买入费用：xxx元
      let inputData = Number(this.inputData)
      // 若固定费率，则展示固定费用
      // 若根据买入金额分段，则根据输入金额实时计算
      // 若根据持有时长分段，则展示固定话术：买入费率根据份额持有时长而定，具体以实际收取为准（字体样式与买入费率保持一致）
      // 其他收费模式，则展示固定话术：买入费率以实际收取为准（字体同上）
      if (this.feeMode == 3) {
        this.strBuyRate = '买入费率根据份额持有时长而定，具体以实际收取为准'
        return
      }
      if (this.feeMode == 4) {
        this.strBuyRate = '买入费率以实际收取为准'
        return
      }
      if (!this.rateRelationList) {
        return '--'
      }
      // oInfo.rateRelationList = [{
      //     gtAmount: '', //大于该值
      //     gtTag: '',
      //     ltAmount: 1000000, //小于该值
      //     ltTag: 'lt',
      //     originalRate: '1.5%',
      //     newRate: '0.15%',
      // }]
      //  结构费率: GT 大于 LT 小于 GE 大于等于 LE 小于等于
      for (let i = 0; i < this.rateRelationList.length; i++) {
        let item = this.rateRelationList[i]
        let gtAmount = item.gtAmount, //大于
          ltAmount = item.ltAmount, //小于
          //   {
          //     "gtAmount" : 10000000,
          //     "gtTag" : "ge",
          //     "ltAmount" : 0,
          //     "ltTag" : "",
          //     "originalRate" : "1000元",
          //     "newRate" : "1000元"
          //     }
          //   bGt = gtAmount != undefined && gtAmount != '', //此处不能用强等于，会存在配置为0的情况。(102上的510080产品)
          //   bLt = ltAmount != undefined && ltAmount != '',
          // 改成使用  gtTag来判断是否为只有一个区间
          gtTag = item.gtTag,
          ltTag = item.ltTag,
          bGt = gtTag != '',
          bLt = ltTag != '',
          originalRate = item.originalRate,
          newRate = item.newRate

        if (bGt && !bLt) {
          //   只有>或>=
          if (gtTag == 'gt' && inputData > gtAmount) {
            this.strBuyRate = this.getRateHtml(originalRate, newRate)
            return
          } else if (gtTag == 'ge' && inputData >= gtAmount) {
            this.strBuyRate = this.getRateHtml(originalRate, newRate)
            return
          }
        } else if (!bGt && bLt) {
          //只有小于或小于等于
          if (ltTag == 'lt' && inputData < ltAmount) {
            this.strBuyRate = this.getRateHtml(originalRate, newRate)
            return
          } else if (ltTag == 'le' && inputData <= ltAmount) {
            this.strBuyRate = this.getRateHtml(originalRate, newRate)
            return
          }
        } else {
          if (gtTag == 'gt') {
            gtAmount = gtAmount + 0.000000001
          }
          if (ltTag == 'lt') {
            ltAmount = ltAmount - 0.000000001
          }
          if (Math.max(gtAmount, inputData) == Math.min(inputData, ltAmount)) {
            this.strBuyRate = this.getRateHtml(originalRate, newRate)
            return
          }
          continue
        }
      }
      this.strBuyRate = '买入费率 --%'
    },
    // 交易规则
    jumpTradeRule: function() {
      let url =
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=' +
        '/web_cft/financing-aip/trade-rule.html' +
        '?prdtCode=' +
        this.prdtCode
      base.href(url)
    },
    // 跳转产品详情页
    // jumpDetail: function() {
    //   let url =
    //     'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode=' +
    //     this.prdtCode
    //   base.href(url)
    // },
    inputFocusHandler: function() {
      this.bInputFocus = true
      this.checkClear()
      this.disableScroll()
    },
    // 监听键盘点击事件
    listenKeyboardClick: function(type, inputData) {
      this.inputData = inputData
      this.checkValValid()
      this.checkClear()
      this.checkBuyRateRange()
      //   this.bInputFocus &&
      if (type == 'confirm') {
        this.bInputFocus = false
        this.enableScroll()
      }
    },
    // 检查数据是否合法
    checkValValid: function() {
      this.isClientMoneyError = false
      if (this.inputData == '') {
        this.strErrorTip = ''
        return
      }
      // 用户输入金额小于当前产品最小定投金额，报错为“最低定投金额X元“
      if (Number(this.inputData) < this.showLowMoney) {
        this.strErrorTip = '最低定投金额' + this.showLowMoney + '元'
      } else if (Number(this.inputData) > this.highMoney) {
        // 若用户输入金额超出单笔定投金额，报错为“购买金额超出单笔最高限额“
        this.strErrorTip = '购买金额超出单笔最高限额'
      } else if (Number(this.inputData) > this.clientMoney) {
        this.strErrorTip = '扣款日请保证余额充足，以免定投失败'
        this.isClientMoneyError = true
      } else {
        this.strErrorTip = ''
      }
    },

    // 检查是否展示清除图标
    checkClear: function() {
      // 展示清除图标
      if (this.inputData !== '') {
        this.bShowClear = true
      } else {
        this.bShowClear = false
      }
    },
    // 点击清除图标，清空输入框中内容
    clickClearHandler: function() {
      this.inputData = ''
      this.strErrorTip = ''
      this.checkClear()
      this.checkBuyRateRange()
    },
    // 点击进入具体计算规则详情说明页面
    clickIntelligenceDesc: function() {
      let url =
        'http://action:10061/?fullscreen=1&&topcolor=5e9fea&&url=/zlcftajax/ttf/auto-activity/main.htm?pageId=5606'
      base.href(url)
    },
    // 智能定投修改参考指数
    clickModifyStockInfos: function() {
      let url =
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&backjump=GetBackUrl()&&url=/web_cft/financing-aip/edit-intelligent-param.html'
      //   url = 'http://localhost:8080/edit-intelligent-param.html'
      url += '?jxIndex=' + this.stockJXIndex + '&zsIndex=' + this.stockZSIndex
      base.href(url)
    },
    // 点击转入银行
    clickBankHandler: function() {
      this.disableScroll()
      this.bShowBankLayer = true
      let functionButton = '转入方式'
      if (this.isTarget === '1') {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1240',
          '1.0',
          '理财_基金定投|新增目标盈定投主页|中部|转入方式',
          `function_button={转入方式}|fund_code={${this.prdtCode}}`
        )
      } else {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1156',
          '1.0',
          '理财_基金定投|定投设置主页面|中部|功能按钮',
          'way={' +
            this.way +
            '}|fund_code={' +
            this.prdtCode +
            '}|function_button={' +
            functionButton +
            '}'
        )
      }
    },
    // 关闭选择转入方式弹框
    listenBankClose: function() {
      this.enableScroll()
      this.bShowBankLayer = false
    },
    // 进入资金自动转入服务说明页面
    jumpAutoTransferDeclare: function() {
      let url =
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=' +
        '/web_cft/financing-aip/auto-transfer-declare.html?prdtId=' +
        this.prdtId
      base.href(url)
    },
    // 选择转入方式
    listenBankChoose: function(type) {
      this.transferInType = type
    },
    // 点击定投周期
    clickDateHandler: function() {
      this.disableScroll()
      this.isShowCycle = true
      let functionButton = '定投周期'
      if (this.isTarget === '1') {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1240',
          '1.0',
          '理财_基金定投|新增目标盈定投主页|中部|转入方式',
          `function_button={定投周期}|fund_code={${this.prdtCode}}`
        )
      } else {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1156',
          '1.0',
          '理财_基金定投|定投设置主页面|中部|功能按钮',
          'way={' +
            this.way +
            '}|fund_code={' +
            this.prdtCode +
            '}|function_button={' +
            functionButton +
            '}'
        )
      }
    },
    // 点击定投周期弹窗-取消
    clickCycleClose() {
      this.isShowCycle = false
      this.enableScroll()
    },
    // 点击定投周期弹窗-确定
    clickCycleConfirm(period, rate) {
      this.period = period || 0
      this.rate = rate || 0
      this.isShowCycle = false
      this.cuttime()
      this.enableScroll()
    },
    // 定投最近转入时间
    cuttime: function() {
      let date = new Date()
      let week = date.getDay()
      if (this.period == 3) {
        //   每月
        let periodDate = Number(cycleInfos.rates[this.period][this.rate]) //每月的X号
        var strDate = date.getDate(),
          disTime
        if (periodDate - strDate < 0) {
          //下月
          disTime = this.getNextMonth(this.getCurDate(periodDate))
        } else if (periodDate - strDate == 0) {
          //当天
          if (!this.isInTime) {
            //不在交易时间内，要获取下个月
            disTime = this.getNextMonth(this.getCurDate(periodDate))
            var reg = /[\u4E00-\u9FA5]/g
            disTime = disTime.replace(reg, '-')
          } else {
            //闭市状态
            disTime = this.getCurDate(periodDate)
          }
        } else {
          //当月
          disTime = this.getCurDate(periodDate)
        }

        var reg = /[\u4E00-\u9FA5]/g,
          result = disTime.replace(reg, '')
        // $('.cut-time').text(disTime)
        this.get5825Data(this.getPreDay(result))
        return
      } else if (this.period == 0) {
        //   每日
        // 交易日 交易时间 当天
        if (week !== 0 && week !== 6 && this.isInTime) {
          this.getDateStr(-1)
        } else if (week === 0) {
          // 周日 +2
          this.getDateStr(1)
        } else {
          // 周六/交易日非交易时间 +1
          this.getDateStr(0)
        }
        return
      } else {
        // 每周/每两周 周X

        var str = '' + week
        var bettime = this.rate + 1 - str
        if (bettime >= 1) {
          this.getDateStr(bettime - 1)
        } else if (bettime == 0) {
          if (this.isInTime == false) {
            //不在交易时间内
            this.getDateStr(6)
          } else {
            this.getDateStr(-1)
          }
        } else {
          this.getDateStr(bettime + 6)
        }
      }
    },
    getCurDate: function(dayd) {
      var date = new Date()
      var seperator1 = '-'
      var month
      var strDate = date.getDate()
      // DATA.curTime = false;
      if (strDate - dayd > 0) {
        month = date.getMonth() + 1
      } else {
        month = date.getMonth()
      }
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (dayd >= 0 && dayd <= 9) {
        dayd = '0' + dayd
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate =
        date.getFullYear() + seperator1 + month + seperator1 + dayd
      return currentdate
    },
    getNextMonth: function(date) {
      var arr = date.split('-')
      var year = arr[0] //获取当前日期的年
      var month = arr[1] //获取当前日期的月
      var day = arr[2] //获取当前日期的日
      var days = new Date(year, month, 0)
      days = days.getDate() //获取当前日期中的月的天数
      var year2 = year
      var month2 = parseInt(month) + 1
      if (month2 == 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      var t2 = year2 + '年' + month2 + '月' + day2 + '日'
      return t2
    },
    getPreDay: function(s) {
      //算出指定日期的前一天
      var y, m, d
      if (s.indexOf('-') >= 0) {
        var arr = s.split('-')
        y = arr[0] //获取当前日期的年
        m = arr[1] //获取当前日期的月
        d = arr[2] //获取当前日期的日
      } else {
        y = parseInt(s.substr(0, 4), 10)
        m = parseInt(s.substr(4, 2), 10) - 1
        d = parseInt(s.substr(6, 2), 10)
      }
      var dt = new Date(y, m, d - 1)
      y = dt.getFullYear()
      m = dt.getMonth() + 1
      d = dt.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      return y + '' + m + '' + d
    },
    getDateStr: function(adddaycount) {
      var dd = new Date()
      dd.setDate(dd.getDate() + adddaycount) //获取AddDayCount天后的
      var y = dd.getFullYear()
      var m = dd.getMonth() + 1 //获取当前月份的日子
      var d = dd.getDate()
      if (m < 10) {
        m = '0' + m
      }

      if (d < 10) {
        d = '0' + d
      }
      this.get5825Data('' + y + m + d)
    },
    /*
     * 顺延下一个交易日
     * */
    get5825Data: function(begDate) {
      let _this = this
      var url5825 =
        '/reqxml?action=5825&MobileCode=($MobileCode)&Token=($Token)&Account=($account)&Interval=1&Begindate=' +
        begDate
      ajax.run(url5825, '', function(data) {
        var nextrade = data.NEXTTRADEDATE
        var regDate = nextrade.replace(
          /^(\d{4})(\d{2})(\d{2})$/,
          '$2' + '月' + '$3' + '日'
        )
        // var date = new Date(),
        //   year = date.getFullYear(),
        //   month = date.getMonth() + 1,
        //   day = date.getDate()
        // if (month < 10) {
        //   month = '0' + month
        // }
        // if (day < 10) {
        //   day = '0' + day
        // }
        _this.regDate = regDate
        _this.nextTradeDate = nextrade
        // $('.transferin-date-text').html(regDate)
        // var currentDate = '' + year + month + day
      })
    },
    // 获取强账号
    getAccountInfo(dtd) {
      let _this = this
      ajax.run(
        '/reqlocal?account=',
        '',
        function(oData) {
          _this.fundAccount = oData.ACCOUNT || 'null'
          dtd.resolve()
        },
        function() {
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    //  交易日 当前时间查询 从5878替换为5620
    action5620: function(fn) {
      let _this = this
      var url5620 =
        '/reqxml?action=5620&MobileCode=($MobileCode)&Token=($Token)&Account=($account)'
      ajax.run(
        url5620,
        '',
        function(data) {
          var formatTime = '00000' + data.CURRTIME
          formatTime = formatTime.substr(formatTime.length - 6, 6)
          /* timeType
                     涨乐随取不可用时间
                     交易日：15:00-18:00，22:00-2:00
                     非交易日：22:00-2:00
                     */
          _this.isInTime = false //隐藏
          if (data.INITDATE == data.CURRDATE) {
            //交易时间段不可用
            if (formatTime >= '150000') {
              _this.isInTime = false
            } else {
              _this.isInTime = true
            }
          } else {
            //非交易日
            _this.isInTime = false
          }
          _this.currentDate = data.CURRDATE
          if (formatTime < 150000 && formatTime >= 113000) {
            _this.bAfterBankTranfer = true
          }
          fn && fn()
        },
        function(data) {
          alert(data.ERRORMESSAGE ? data.ERRORMESSAGE : '网络连接失败')
        }
      )
    },
    //   二次确认弹框需要的数据
    getConfirmData: function() {
      let transferInType = '--'
      if (this.transferInType === 'htsc') {
        transferInType = '华泰账户'
      } else {
        if (this.$refs.bankRef) {
          transferInType = this.$refs.bankRef.getBankInfo()
        }
      }
      let obj = {
        buyNum: parseFloat(this.inputData).toFixed(2), // 转入金额
        prdtName: this.prdtName, // 定投产品
        time: this.cycleInfo, // 定投时间
        transferInType: transferInType, // 转入方式
        openAccount: this.openAccount, // 开通账户
        oPaper: this.oPaper, // 协议
        bShowTarget: this.bOnStopParam,
      }
      if (this.type == 'intelligence') {
        obj.buyNum = `${this.minDeduction}～${this.maxDeduction}`
      }
      if (this.bOnStopParam) {
        obj.targetRate = this.stopParamRate // 目标持仓收益率
        obj.targetStopType = stopParamInfos[this.stopParamType] // 目标达成后
      }
      if (this.oPaper && this.oPaper.agrtList) {
        let agrtList = [],
          pdfItem = []
        //   用户使用银行卡定投需额外签署《基金定投资金自动转入协议》
        //   用户开启目标止盈，还需签署《目标止盈定投协议》
        //   用户使用智能定投还需签署《策略定投服务协议》
        this.oPaper.agrtList.forEach(function(item, index) {
          if (
            item.contractMainType == 1 &&
            item.protocolNo == 'B000410' &&
            this.type !== 'intelligence'
          ) {
            // 智能定投协议
            return
          }
          if (
            item.contractMainType == 1 &&
            item.protocolNo == 'B000411' &&
            this.transferInType !== 'bank'
          ) {
            // 资金自动转入服务协议
            return
          }
          agrtList.push(item)
          pdfItem.push({
            productId: item.productId, //'产品ID',
            protocolNo: item.protocolNo, //'协议编号'
            version: item.version, //'协议版本'
            classify: item.classify, //'协议分类，1-业务协议，2-产品协议'
            md5File: item.md5File, //'文件md5'
            fillingSourceId: item.fillingSourceId, //填充ID
          })
        })
      }
      return obj
    },

    // 记录目标定投是否打开
    listenOnStopParam: function(bOnStopParam) {
      this.bOnStopParam = bOnStopParam
      let functionButton = '目标止盈'
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1156',
        '1.0',
        '理财_基金定投|定投设置主页面|中部|功能按钮',
        'way={' +
          this.way +
          '}|fund_code={' +
          this.prdtCode +
          '}|function_button={' +
          functionButton +
          '}'
      )
    },
    // 点击按钮事件
    btnEnsureHandler: function(e) {
      let jqDom = $(e.target).parent('.btn-ensure')
      if (!jqDom.hasClass('highlight')) {
        return
      }
      if (this.isTarget === '1') {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1240',
          '1.0',
          '理财_基金定投|新增目标盈定投主页|底部|下一步',
          ''
        )
        let _this = this
        setTimeout(() => {
          window.TalkingData.onHTSCEvent(
            'page',
            'leaf1241',
            '1.0',
            '理财_基金定投|新增目标盈适当性确认页面|0|0',
            `condition={${
              _this.riskMatchResult === '1001' ? '完全匹配' : '不匹配'
            }}`
          )
        }, 1000)
      } else {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1156',
          '1.0',
          '理财_基金定投|定投设置主页面|中部|下一步',
          'way={' + this.way + '}'
        )
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1157',
          '1.0',
          '理财_基金定投|适当性匹配页面|0|0',
          'way={' + this.way + '}'
        )
      }

      this.ajaxPaper()
    },
    ajaxPaper: function() {
      // 基金定投类型 fundInvestType  1-普通 2-智能
      // 是否签署自动转入协议 hasSignAutoShiftToContract 0-否 1-是
      let oParam = {
        fundInvestType: this.type === 'intelligence' ? 2 : 1,
        hasSignAutoShiftToContract: this.transferInType === 'bank' ? 1 : 0,
      }
      this.$emit('listenAjaxPaper', oParam)
    },
    // 修改流程直接展示二次确认
    showModifyConfirm: function(oParam) {
      // 新建流程必须要传入{}， 修改流程不需要签署时传入false
      if (oParam && oParam.oPaper) {
        this.oPaper = oParam.oPaper
      } else {
        this.oPaper = false
      }
      this.disableScroll()
      this.bShowConfirmLayer = true
    },
    // 请求协议回来后，展示三匹配
    showMatchResultLayer: function() {
      this.bShowMatchResultLayer = true
      //   this.disableScroll()
    },
    //三匹配点击后，如为签署数字证书，签署，否则弹框
    listenMatchResultLayerEnsure: function() {
      let _this = this
      this.bShowMatchResultLayer = false
      if (this.isTarget === '1') {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1241',
          '1.0',
          '理财_基金定投|新增目标盈适当性页面|底部|确认，下一步',
          `condition={${
            this.riskMatchResult === '1001' ? '完全匹配' : '不匹配'
          }}`
        )
      } else {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1157',
          '1.0',
          '理财_基金定投|适当性匹配页面|底部|确认，下一步',
          'way={' + this.way + '}'
        )
      }
      //   this.enableScroll()
      if (
        JSON.stringify(this.eFileContract) != '{}' &&
        !this.eFileContract.pass
      ) {
        ajax.showLoading()
        $.when(this.signEFileContract($.Deferred())).done(function(bPass) {
          ajax.hideLoading()
          if (bPass) {
            // _this.disableScroll()
            window.TalkingData.onHTSCEvent(
              'page',
              'leaf1158',
              '1.0',
              '理财_基金定投|定投确认页面|0|0',
              'way={' + _this.way + '}'
            )
            _this.bShowConfirmLayer = true
          }
        })
      } else {
        // _this.disableScroll()
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1158',
          '1.0',
          '理财_基金定投|定投确认页面|0|0',
          'way={' + _this.way + '}'
        )
        _this.bShowConfirmLayer = true
      }
    },
    // 三匹配关闭
    listenMatchResultLayerClose: function() {
      this.bShowMatchResultLayer = false
      //   this.enableScroll()
    },
    listenConfirmLayerClose: function() {
      // this.enableScroll()
      this.bShowConfirmLayer = false
    },
    //二次确认弹框点击确定
    listenConfirmLayerEnsure: function() {
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1158',
        '1.0',
        '理财_基金定投|定投确认页面|底部|确认',
        'way={' + this.way + '}'
      )
      ajax.showLoading()
      // this.enableScroll()
      this.bShowConfirmLayer = false
      // 1. 判断是否需要开户
      // 2. 签署的协议
      // 3. 下单
      let _this = this
      if (!_this.openAccount.pass) {
        $.when(_this.ajaxOpenTa($.Deferred())).done(function(
          openPass,
          failMsg
        ) {
          // 开通账户成功再进行下一步
          if (openPass) {
            _this.openAccount.pass = true
            // _this.bOpenAccountChange = false
            // _this.urlParam.openAccount = JSON.stringify(_this.openAccount)
            _this.signProcess() //下单
          }
        })
      } else {
        _this.signProcess()
      }
    },
    ajaxOpenTa: function(dtd) {
      let _this = this
      ajax.run(
        '/reqxml?action=27401&path=/asset_alloc/open/open_fund_com_list',
        {
          clientNo: '($account)',
          fundAccount: '($fund_account)', //资金帐户
          fcCodeList: _this.openAccount.fundCompanyCode, //需要开通的基金公司列表，以英文逗号分隔，最多10个！
          branchNo: '($khbranch)', //分支机构号
          TFrom: '($tfrom)',
          password: '($password)', //交易密码
          token: '($token)',
          isPromise: _this.urlParam.isOrg ? '1' : '0',
        },
        function(data) {
          let oData = _this.jsonParse(data.BINDATA),
            code = oData.code,
            msg = oData.msg
          if (code === '0') {
            let msg1 = ''
            if (oData.fcList.length > 0) {
              for (var i = 0; i < oData.fcList.length; i++) {
                // 开户成功
                if (
                  oData.fcList[i].fcCode == _this.openAccount.fundCompanyCode &&
                  (oData.fcList[i].success ||
                    oData.fcList[i].failMsg === '基金账户信息表记录已存在')
                ) {
                  dtd.resolve(true)
                  return
                } else {
                  ajax.hideLoading()
                  msg1 = oData.fcList[i].failMsg || '网络连接失败'
                  dtd.resolve(false, msg1)
                  alert(msg1)
                  return
                }
              }
            }
          }
          //   _this.clickFlag = false
          //   _this.bShowConfirmLayer = false
          //   _this.bOpenAccountChange = true
          ajax.hideLoading()
          dtd.resolve(false, msg || '网络连接失败')
          alert(msg || '网络连接失败')
        },
        function(msg) {
          //   _this.clickFlag = false
          //   _this.bShowConfirmLayer = false
          //   _this.bOpenAccountChange = true
          ajax.hideLoading()
          alert(msg.ERRORMESSAGE || '网络连接失败')
          dtd.resolve(false, msg.ERRORMESSAGE || '网络连接失败')
        }
      )
      return dtd.promise()
    },
    //签署协议
    signProcess: function() {
      let _this = this
      if (_this.oPaper.pass) {
        $.when(_this.ajaxSignPaper($.Deferred())).done(function(
          signPass,
          webParamF,
          failMsg
        ) {
          if (signPass) {
            if (_this.isModify) {
              _this.ajaxModifyAip(webParamF)
              return
            }
            _this.ajaxNewAip(webParamF)
          }
        })
      } else {
        if (_this.isModify) {
          _this.ajaxModifyAip()
          return
        }
      }
    },
    //创建新的定投 fps_order/881019
    ajaxNewAip: function(webParamF) {
      let _this = this
      let option = {
        clientNo: '($account)', //客户号
        fundAccount: '($fund_account)', //资产账号
        aipType: this.type === 'intelligence' ? 2 : 1, //定投类型,1 普通 2 智能 Int
        TFrom: '($tfrom)', //销售渠道
        prdtId: Number(this.prdtId), //产品ID int类型
        opBranchNo: '($khbranch)', //'($opBranchNo)', //操作分支机构
        // opStation:
        //   'MI;MIP:117.136.45.16;UUID: 1 F964FE1 - AB15 - 450 B - B78F - 96409 C29384B;MPN: 18795900328 @CFROM: CFT.HTSC | TFROM: HTSC.IPHONE.LC | FROM: | SOFTVER: 6.7 .5', //'($opStation)', //站点地址
        branchNo: '($khbranch)', //分支机构
        balance: Number(this.inputData), //发生金额 number类型
        agrType: _this.riskMatchResult, //适当不适当
        riskFlag: _this.matchResultItem[0].result || '', //风险是否匹配，Y/N
        termFlag: _this.matchResultItem[1].result || '', // 期限是否匹配，Y/N
        varietyFlag: _this.matchResultItem[2].result || '', //品种是否匹配，Y/N
        signId: webParamF, //协议签署流水Id
        transferType: this.transferInType == 'bank' ? 1 : 0, //划款方式,主账户0，银证转账1
        period: this.period + 1, //周期,1 日,2 周,3 双周,4 月
        aipDay: this.period == 0 ? '' : this.rate + 1, //定投日，周/双周是周X,月是日期，日是空
        withAim: this.bOnStopParam ? 1 : 0, //是否目标止盈,0 否 1 是
        sysNodeId: '($tztsysnodeid)', //系统ID
      }
      if (this.type === 'intelligence') {
        let stockZSMap = {
          //   ['中证500', '沪深300', '创业板指']
          0: 2,
          1: 1,
          2: 4,
        }
        //   ['250日均线', '500日均线']
        let stockJXMap = {
          0: 2,
          1: 1,
        }
        option.shareIndex = stockZSMap[this.stockZSIndex] //均线策略参考指数,1-沪深300，2-中证500，3-中小板指， 4-创业板指
        option.mA = stockJXMap[this.stockJXIndex] //均线策略参考均线,1-500日均线，2-250日均线
      }
      if (this.transferInType == 'bank') {
        option.bankNo = this.bankNo //三方存管银行编号
        option.bankCard = this.cardNo //银行卡号
      }
      if (this.bOnStopParam) {
        option.aim = base.calculate(this.stopParamRate, 100, '/') //目标止盈参数,普通/智能–比率；心愿，数字金额
        let stopParamTypeMap = {
          0: 3,
          1: 1,
          2: 2,
        }
        option.aimNext = stopParamTypeMap[this.stopParamType] //目标止盈到达后操作类型，0无效，1继续，2终止，3赎
      }

      var url = '/reqxml?action=27401&path=/forward&funcId=881019'
      ajax.run(
        url,
        option,
        function(data) {
          //   {
          //     "code":"0",
          //     "msg":"success",
          //     "scOrderNo":"销售中心订单号",
          //     "allotNoOut":"柜台申请编号",
          //     "serialNo":1234567, //柜台流水号
          //     "initDate":20191218,//柜台初始日期 无用
          //     "scStatus":2  //2表示压单成功，4表示报单成功 无用
          // }

          if (data.BINDATA) {
            // var oData = data.BINDATA;
            var oData = _this.jsonParse(data.BINDATA)
            var code = oData.code
            var msg = oData.msg || '网络超时，请稍后确认您的订单信息'
            var url = ''
            var targetUrl = ''
            // code = 0 //TODO:
            if (code == 0) {
              ajax.hideLoading()
              var sOrder = oData.scOrderNo //获取订单号
              //   成功
              //   智能定投 from=1, 目标盈 from=2
              url =
                'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-success.html'
              //   url = 'http://localhost:8080/edit-result-success.html'
              targetUrl = '/web_cft/financing-aip/edit-result-success.html'
              url += '?cycleInfo=' + encodeURIComponent(_this.cycleInfo)
              targetUrl += '?cycleInfo=' + encodeURIComponent(_this.cycleInfo)
              url += '&prdtName=' + encodeURIComponent(_this.prdtName)
              targetUrl += '&prdtName=' + encodeURIComponent(_this.prdtName)
              //   转入方式
              if (_this.transferInType == 'bank') {
                url += '&transferInType=bank'
                targetUrl += '&transferInType=bank'
                url += '&bankNo=' + _this.interBankNo //三方存管银行编号
                targetUrl += '&bankNo=' + _this.interBankNo //三方存管银行编号
                url += '&bankCard=' + _this.cardNo //银行卡号
                targetUrl += '&bankCard=' + _this.cardNo //银行卡号
              } else {
                url += '&transferInType=htsc'
                targetUrl += '&transferInType=htsc'
              }
              // 目标止盈
              if (_this.bOnStopParam) {
                url += '&bOnStopParam=1' //
                targetUrl += '&bOnStopParam=1' //
                url += '&aim=' + _this.stopParamRate //目标止盈参数,普通/智能–比率；心愿，数字金额
                targetUrl += '&aim=' + _this.stopParamRate //目标止盈参数,普通/智能–比率；心愿，数字金额
                url += '&aimNext=' + _this.stopParamType //目标止盈到达后操作类型，0无效，1继续，2终止，3赎
                targetUrl += '&aimNext=' + _this.stopParamType //目标止盈到达后操作类型，0无效，1继续，2终止，3赎
              }

              if (_this.type == 'intelligence') {
                url +=
                  '&maxDeduction=' +
                  parseFloat(_this.maxDeduction).toFixed(2) +
                  '&minDeduction=' +
                  parseFloat(_this.minDeduction).toFixed(2) +
                  '&from=1'
                targetUrl +=
                  '&maxDeduction=' +
                  parseFloat(_this.maxDeduction).toFixed(2) +
                  '&minDeduction=' +
                  parseFloat(_this.minDeduction).toFixed(2) +
                  '&from=1'
              } else {
                url +=
                  '&balance=' +
                  parseFloat(_this.inputData).toFixed(2) +
                  '&from=0'
                targetUrl +=
                  '&balance=' +
                  parseFloat(_this.inputData).toFixed(2) +
                  '&from=0'
              }
              /* url = 'http://action:1965/?url=' + encodeURIComponent(url) */
              if (_this.isTarget === '1') {
                targetUrl += '&isTarget=1'
                targetUrl =
                  'http://action:1964/?url=' + encodeURIComponent(targetUrl)
                base.href(targetUrl)
                /*  let targetParams = `${encodeURIComponent(
                  _this.cycleInfo
                )}/${encodeURIComponent(_this.prdtName)}/${
                  _this.transferInType
                }/${_this.stopParamRate}/${_this.stopParamType}/${parseFloat(
                  _this.inputData
                ).toFixed(2)}/${_this.interBankNo}/${_this.cardNo}`
                _this.$emit('goTargetSuccess', targetParams) */
              } else {
                url = 'http://action:1965/?url=' + encodeURIComponent(url)
                base.href(url)
              }
              return
            }
            //失败
            /*  url =
              'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=' +
              '/web_cft/financing-aip/edit-result-fail.html' +
              '?msg=' +
              encodeURIComponent(msg)
            url = 'http://action:1965/?url=' + encodeURIComponent(url) */
            if (_this.isTarget === '1') {
              url =
                '/web_cft/financing-aip/edit-result-fail.html' +
                '?from=2&msg=' +
                encodeURIComponent(msg)
              url = 'http://action:1964/?url=' + encodeURIComponent(url)
              base.href(url)
            } else {
              url =
                'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=' +
                '/web_cft/financing-aip/edit-result-fail.html' +
                '?msg=' +
                encodeURIComponent(msg)
              if (_this.type == 'intelligence') {
                url += '&from=1'
              }
              url = 'http://action:1965/?url=' + encodeURIComponent(url)
              base.href(url)
            }
            ajax.hideLoading()
            // _this.clickFlag = false
          }
        },
        function(data) {
          ajax.hideLoading()
          alert(data.ERRORMESSAGE || '网络连接失败')
        }
      )
    },
    // 返回需确认有无修改的信息
    getModifyData: function() {
      let option = {
        balance: Number(this.inputData), //发生金额 number类型
        transferType: this.transferInType == 'bank' ? 1 : 0, //划款方式,主账户0，银证转账1
        period: this.period + 1, //周期,1 日,2 周,3 双周,4 月
        aipDay: this.period == 0 ? '' : this.rate + 1, //定投日，周/双周是周X,月是日期，日是空
        withAim: this.bOnStopParam ? 1 : 0, //是否目标止盈,0 否 1 是
      }
      if (this.type === 'intelligence') {
        let stockZSMap = {
          //   ['中证500', '沪深300', '创业板指']
          0: 2,
          1: 1,
          2: 4,
        }
        //   ['250日均线', '500日均线']
        let stockJXMap = {
          0: 2,
          1: 1,
        }
        option.stockIndex = stockZSMap[this.stockZSIndex] //均线策略参考指数,1-沪深300，2-中证500，3-中小板指， 4-创业板指
        // 空：不开通1：180日均线2：250日均线3：500日均线 --定投修改的参数跟新建的不一致
        option.MA = stockJXMap[this.stockJXIndex] //均线策略参考均线,1-500日均线，2-250日均线
      }
      if (this.transferInType == 'bank') {
        option.bankNo = this.bankNo //三方存管银行编号
        option.bankCard = this.cardNo //银行卡号
      }
      if (this.bOnStopParam) {
        option.aim = base.calculate(this.stopParamRate, 100, '/') //目标止盈参数,普通/智能–比率；心愿，数字金额
        let stopParamTypeMap = {
          0: 3,
          1: 1,
          2: 2,
        }
        option.aimNext = stopParamTypeMap[this.stopParamType] //目标止盈到达后操作类型，0无效，1继续，2终止，3赎
      }
      return option
    },
    // 修改定投
    ajaxModifyAip: function(webParamF) {
      let _this = this
      let option = {
        clientNo: '($account)', //客户号
        fundAccount: '($fund_account)', //资产账号
        subFundAccount: this.subFundAccount, //子账户
        aipType: this.type === 'intelligence' ? 2 : 1, //定投类型,1 普通 2 智能 Int
        TFrom: '($tfrom)', //销售渠道
        prdtId: Number(this.prdtId), //产品ID int类型
        opBranchNo: '($khbranch)', //'($opBranchNo)', //操作分支机构
        // opStation:
        //   'MI;MIP:117.136.45.16;UUID: 1 F964FE1 - AB15 - 450 B - B78F - 96409 C29384B;MPN: 18795900328 @CFROM: CFT.HTSC | TFROM: HTSC.IPHONE.LC | FROM: | SOFTVER: 6.7 .5', //'($opStation)', //站点地址
        branchNo: '($khbranch)', //分支机构
        // moneyType //币种
        signId: webParamF || '', //协议签署流水Id
        // aipAlias //定投别名
        sysNodeId: '($tztsysnodeid)', //系统ID
      }
      let oInfo = this.getModifyData()
      option = $.extend(option, oInfo)
      var url = '/reqxml?action=27401&path=/time_invest/invest_modify'
      ajax.run(
        url,
        option,
        function(data) {
          if (data.BINDATA) {
            // var oData = data.BINDATA;
            var oData = _this.jsonParse(data.BINDATA)
            var code = oData.code
            var msg = oData.msg || '网络超时，请稍后确认您的订单信息'
            var url = ''
            if (code == 0) {
              ajax.hideLoading()
              var sOrder = oData.scOrderNo //获取订单号
              //   成功
              //   智能定投 from=1, 目标盈 from=2
              url =
                'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-success.html'
              //   url = 'http://localhost:8080/edit-result-success.html'
              url += '?cycleInfo=' + encodeURIComponent(_this.cycleInfo)
              url += '&prdtName=' + encodeURIComponent(_this.prdtName)
              //   转入方式
              if (_this.transferInType == 'bank') {
                url += '&transferInType=bank'
                url += '&bankNo=' + _this.interBankNo //三方存管银行编号
                url += '&bankCard=' + _this.cardNo //银行卡号
              } else {
                url += '&transferInType=htsc'
              }
              // 目标止盈
              if (_this.bOnStopParam) {
                url += '&bOnStopParam=1' //
                url += '&aim=' + _this.stopParamRate //目标止盈参数,普通/智能–比率；心愿，数字金额
                url += '&aimNext=' + _this.stopParamType //目标止盈到达后操作类型，0无效，1继续，2终止，3赎
              }

              if (_this.type == 'intelligence') {
                url +=
                  '&maxDeduction=' +
                  parseFloat(_this.maxDeduction).toFixed(2) +
                  '&minDeduction=' +
                  parseFloat(_this.minDeduction).toFixed(2) +
                  '&from=1'
                url += '&setPageTitle=' + encodeURIComponent('智能定投修改成功')
              } else {
                url +=
                  '&balance=' +
                  parseFloat(_this.inputData).toFixed(2) +
                  '&from=0'
                url += '&setPageTitle=' + encodeURIComponent('定投计划修改成功')
              }

              url = 'http://action:1965/?url=' + encodeURIComponent(url)
              if (_this.isTarget === '1') {
                let targetParams = `${encodeURIComponent(
                  _this.cycleInfo
                )}/${encodeURIComponent(_this.prdtName)}/${
                  _this.transferInType
                }/${_this.stopParamRate}/${_this.stopParamType}/${parseFloat(
                  _this.inputData
                ).toFixed(2)}/${_this.interBankNo}/${_this.cardNo}`
                _this.$emit('goTargetSuccess', targetParams)
              } else {
                base.href(url)
              }
              return
            }
            //失败
            url =
              'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=' +
              '/web_cft/financing-aip/edit-result-fail.html' +
              '?msg=' +
              encodeURIComponent(msg)
            url += '&setPageTitle=' + encodeURIComponent('定投修改失败')
            url = 'http://action:1965/?url=' + encodeURIComponent(url)
            if (_this.isTarget === '1') {
              _this.$emit('goTargetFail', encodeURIComponent(msg))
            } else {
              base.href(url)
            }
            ajax.hideLoading()
            // _this.clickFlag = false
          }
        },
        function(data) {
          ajax.hideLoading()
          alert(data.ERRORMESSAGE || '网络连接失败')
        }
      )
    },
    //签署协议
    ajaxSignPaper: function(dtd) {
      let _this = this
      var url = '/reqxml?action=27502&path=/financing/trade/sign_paper'
      var obj = {
        clientNo: '($account)',
        TFrom: '($tfrom)',
        bizCode: _this.oPaper.bizCode,
        serialId: _this.oPaper.serialId,
        token: '($token)',
        password: '($password)', // 密码
        fundAccount: '($fund_account)', //资产账号
        sysNodeId: '($tztsysnodeid)', //系统节点号
        branchNo: '($khbranch)',
        agrtList: _this.oPaper.strAgrtList,
      }
      //   "caSign":"1-需要CA签署，0-不需要
      ajax.run(
        url,
        obj,
        function(xml) {
          // <response>
          //      <flag code="0" msg="success" />
          //      <data webParam="&amp;signId=签署流水号" signId="签署流水号" />
          // </response>
          var code = $(xml.BINDATA)
            .find('flag')
            .attr('code')
          //如果msg为空，则为"网络超时，请稍后确认您的订单信息"
          var msg =
            $(xml.BINDATA)
              .find('flag')
              .attr('msg') || '网络连接失败'
          if (code === '0') {
            var webParamF = $(xml.BINDATA)
              .find('data')
              .attr('webParam')
            if (webParamF) {
              webParamF = webParamF
                .replace(/amp;/g, '')
                .split('&signId=')
                .splice(1)
                .join(',')
            } else {
              webParamF = ''
            }
            dtd.resolve(true, webParamF)
            return
          }
          //   _this.clickFlag = false
          ajax.hideLoading()
          alert(msg)
          //   _this.bShowConfirmLayer = false
          //   _this.bOpenAccountChange = true
          dtd.resolve(false, '', msg)
        },
        function(data) {
          ajax.hideLoading()
          //   _this.clickFlag = false
          alert(data.ERRORMESSAGE || '网络连接失败')
          //   _this.bShowConfirmLayer = false
          //   _this.bOpenAccountChange = true
          dtd.resolve(false, '', data.ERRORMESSAGE || '网络连接失败')
        }
      )
      return dtd.promise()
    },
    // 签署电子签名约定书
    signEFileContract: function(dtd) {
      let _this = this

      var agrtList = []
      this.eFileContract.agrtList.forEach(function(item) {
        agrtList.push(
          JSON.stringify({
            bizCode: item.bizCode, //业务代码
            protocolNo: item.agrtCode, //协议编号
            version: item.agrtVersion, //协议版本
          })
        )
      })

      var digiAgrtUrl = this.eFileContract.agrtList[0].agrtUrl //协议地址
      var strAgrtList = agrtList.toString()
      var digiAjaxUrl =
        '/reqxml?action=27401&path=/agrt_center/sign_e_file_contract' +
        '?clientNo=($account)' + //强账号
        '&TFrom=($tfrom)' + // 接口文档中没有，但在电脑端调试必要
        '&agrtList=' +
        '[' +
        strAgrtList +
        ']' +
        '&fundAccount=($fund_account)' +
        '&sysNodeId=($tztsysnodeid)'
      ajax.run(
        digiAjaxUrl,
        '',
        function(xml) {
          var ERRORNO = $(xml.BINDATA)
            .find('flag')
            .attr('code')
          var msg = $(xml.BINDATA)
            .find('flag')
            .attr('msg')
          if (ERRORNO === '0') {
            // 开通成功后，不应该再在适当性弹层让签署。
            _this.eFileContract.pass = true
            dtd.resolve(true)
            return
          }
          alert(msg || '网络连接失败')
          dtd.resolve()
        },
        function(data) {
          alert(data.ERRORMESSAGE || '网络连接失败')
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    preventEvent: function(event) {
      event.preventDefault()
    },
    disableScroll: function() {
      let _this = this
      setTimeout(function() {
        document.addEventListener('touchmove', _this.preventEvent, {
          passive: false,
        })
      }, 100)
    },
    enableScroll: function() {
      document.removeEventListener('touchmove', this.preventEvent, {
        passive: false,
      })
    },
    // 跳转数字证书
    jumpEFilePdf: function(pdfUrl) {
      var _this = this
      let callback = function() {
        var func = {
          title: '电子文件签署服务责任书',
          pdfs: pdfUrl,
          topColor: 'ff8300',
          isTipShow: false,
        }
        var url =
          'http://action:80022?func=' +
          encodeURIComponent(JSON.stringify(func)) +
          '&&type=1'
        base.href(url)
      }
      this.checkVersion(callback)
    },
    jumpPdf: function(pdf) {
      let _this = this
      if (pdf.length === 0) {
        //无代签署文件直接跳转购买页
        alert('无签署列表')
        return false
      }
      var type = 2
      if (pdf.length === 1) {
        type = 1
      }
      var callback = function() {
        var func = {
          title: decodeURIComponent(_this.prdtName) || '合同签署',
          pdfs: pdf.length > 1 ? pdf : pdf[0].path,
          topColor: 'ff8300',
          isTipShow: false,
        }

        if (base.versionCompare(_this.appVersion, '5.4.0') >= 0) {
          //高于等于5.4.0版本
          var addPDFtitle = {
            title: decodeURIComponent(_this.prdtName) || '合同签署',
            subTitle:
              pdf.length > 1
                ? '协议告知及合同签署'
                : pdf[0].title || '协议告知及合同签署',
            topColor: 'ff8300',
          }
          func = $.extend(func, addPDFtitle)
        }
        var url =
          'http://action:80022?func=' +
          encodeURIComponent(JSON.stringify(func)) +
          '&&type=' +
          type
        base.href(url)
      }
      _this.checkVersion(callback)
    },
    // 点击协议跳转
    clickContractHandler: function(event) {
      let _this = this
      var pdf = {
        path: $(event.target).attr('data-path'),
        // type: $(event.target).attr('data-type'),
        title: $(event.target).attr('data-title'),
      }
      local.saveObject(
        {
          jumpPdf: true,
        },
        function() {
          _this.jumpPdf([pdf])
        }
      )
    },
    //低版本提示升级
    checkVersion: function(callback) {
      ajax.run('/reqlocal?upversion=', '', function(data) {
        var v = data.UPVERSION
        if (base.versionCompare(v, '4.1.1') < 0) {
          //提示版本过低
          //弹出层  确认按钮跳转
          this.$Dialog({
            title: '温馨提示',
            message:
              '您的当前财富通还是旧版本哦,为了保证协议签署的正常使用,请尽快升级至最新版本',
            btns: 2,
            cancelButtonText: '关闭',
            confirmButtonText: '去升级',
            submitCallback: () => {
              base.href(base.getAPPDownloadURL())
            },
          })
        } else {
          if (callback) {
            callback()
          }
        }
      })
    },
  },
}
</script>
<style lang="less">
// @import '../../components/navigation-bar/navigation-bar.css';
@import './edit-aip.less';
</style>
