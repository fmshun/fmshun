<template>
  <div id="app" :class="{ iphoneX: isIphoneX }">
    <!-- loading -->
    <Waiting v-show="isShowLoading"></Waiting>
    <!-- 内容部分 -->
    <div class="container">
      <div class="wrapper fixed">
        <!-- 产品模块 -->
        <Product :name="prdtName" :code="prdtCode"></Product>
        <!-- 输入框部分 -->
        <div class="input_container bg_white">
          <!-- 顶部 -->
          <div class="input_top flex">
            <div class="input_top_title flex_item">赎回份额</div>
            <div class="input_top_rule" @click="goRule">交易规则</div>
          </div>
          <!-- input区域 -->
          <div class="input">
            <div @click.stop="inputFocus" class="flex flex_middle">
              <div class="flex_item">
                <div class="flex flex_middle">
                  <!-- 金额区域 -->
                  <div class="value" :class="[nowFont]">{{ inputData }}</div>
                  <!-- 光标 -->
                  <img
                    v-if="isFocus"
                    class="pointer"
                    src="./assets/pointer.gif"
                    alt
                  />
                </div>
                <!-- 金额单位 -->
                <div v-if="strline && isFocus" class="line">
                  <div class="lineTip" :class="[nowFont]">{{ strline }}</div>
                </div>
              </div>
              <!-- placeholder -->
              <div v-if="inputData === ''" class="placeholder">
                当前可赎回{{ strShares }}份
              </div>
              <!-- 清空按钮 -->
              <img
                v-if="inputData !== '' && isFocus"
                @click.stop="clearInput"
                class="clear"
                src="./assets/clear.png"
                alt
              />
            </div>
          </div>
          <!-- 错误提示 -->
          <div v-if="isShowError" class="input_error flex flex_middle">
            <img class="error" src="./assets/error.png" alt />
            <div>{{ errorInfo }}</div>
          </div>
          <!-- 快捷购买 -->
          <div class="input_bottom flex flex_middle">
            <div class="input_bottom_title">快捷赎回份额：</div>
            <div
              v-for="(item, index) in fastArr"
              :key="index"
              class="flex_item"
            >
              <div @click.stop="toggleFast(index)" class="flex flex_middle">
                <img
                  :src="index == nowFastIndex ? checkImgs[1] : checkImgs[0]"
                  class="checkbox"
                  alt
                />
                <div>{{ item.title }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 提示部分 -->
        <div class="tips_container bg_white">
          <div>
            当前卖出将按{{ redeemDate
            }}{{ isCurrencyFund ? '万份收益' : '净值' }}计算金额，预计{{
              settlementDate
            }}到账，赎回费率 {{ redeemRate }}。
          </div>
          <!-- 货币基金 赎回费率是0%，不展示 -->
          <div v-if="!isCurrencyFund" class="flex less_tips">
            <div class="star">*</div>
            <div>若持有少于7天,将收取{{ sevenDaysRate }}手续费</div>
          </div>
          <div class="flex less_tips">
            <div class="star">*</div>
            <div>
              赎回操作可能影响定投收益率的计算。若为“目标投”定投计划，可能导致定投计划触达目标收益的提前或延后，请知悉。
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="resButton text_center">
      <div @click="confirm" :class="{ active: bValValid && !isShowError }">
        <span>下一步</span>
      </div>
    </div>
    <!-- 键盘 -->
    <keyboard
      @listenKeyboardClick="listenKeyboardClick"
      :inputData="inputData"
      :maxLength="13"
      :confirmHighlight="bValValid"
      v-show="isFocus"
    ></keyboard>
    <Confirm
      @click-confirm-ensure="submit"
      @click-confirm-close="isShowConfirm = false"
      :name="prdtName"
      :shares="formatInputData"
      v-if="isShowConfirm"
    ></Confirm>
  </div>
</template>
<script>
// -----------svn
import base from 'base'
import ajax from 'ajax'
// -----------components
// loading
import Waiting from '@/components/waiting/Waiting'
// 产品模块
import Product from '@/components/product/Product'
// 键盘
import Keyboard from '@/components/keyboard/Keyboard'
// 确认金额弹窗
import Confirm from './components/confirm/Confirm'
// web头
import NavigationBar from 'NavigationBar'
import loadScripts from '@/utils/loadScripts'
// -----------ajax
import { getData, submitData } from './request/api'
// -----------plugin
import * as plugin from '@/components/Common'
// images
import choose from './assets/choose.png'
import unchoose from './assets/unchoose.png'

export default {
  name: 'App',
  // 原生头部标题
  metaInfo: {
    title: '定投赎回',
  },
  components: {
    // loading
    Waiting,
    // 产品模块
    Product,
    // 键盘
    Keyboard,
    // 确认金额弹窗
    Confirm,
  },
  data() {
    return {
      // 是否展示loading
      isShowLoading: true,
      // -----------传参
      // 产品代码
      prdtCode: base.getUrlParameter('prdtCode'),
      // 产品Id
      prdtId: base.getUrlParameter('prdtId'),
      // 子账户
      subFundAccount: base.getUrlParameter('sub'),
      // -----------接口返回
      // 产品名称
      prdtName: '',
      // 产品份额
      shares: 0,
      // 赎回日期
      redeemDate: '',
      // 到账日期
      settlementDate: '',
      // 赎回费率范围
      redeemRate: '',
      // 是否小于7天
      islessSeven: false,
      // 7天赎回费率
      sevenDaysRate: '',
      // 是否是货币基金
      isCurrencyFund: '',
      // 最低赎回份额
      limitShare: '',
      // -----------输入框相关参数
      // 输入框是否聚焦
      isFocus: false,
      // 当前输入框的值
      inputData: '',
      // 输入框当前单位
      strline: '',
      // 输入数据是否合法
      bValValid: false,
      // 是否显示错误提示
      isShowError: false,
      // 提示话术
      errorInfo: '',
      // 字号缩放
      fontObj: {
        9: 'normal',
        10: 'small',
        12: 'smaller',
        13: 'smaller',
        15: 'smallest',
      },
      // 是否选中
      checkImgs: [unchoose, choose],
      // 输入框当前字号
      nowFont: '',
      // 快捷购买
      fastArr: [
        {
          title: '1/2份额',
          shares: '0.00',
          isActive: false,
        },
        {
          title: base.getUrlParameter('end') === '1' ? '全部清仓' : '全部份额',
          shares: '0.00',
          isActive: false,
        },
      ],
      // 当前选中的快捷购买
      nowFastIndex: 2,
      // 是否显示确认金额弹窗
      isShowConfirm: false,
      // -----------其他
      // 防重复点击
      clickFlag: false,
      isIphoneX: false,
      // 赎回份额
      redeemShares: 0,
    }
  },
  created() {
    loadScripts(['/common/scripts/prompt.js']).then(() => {})
  },
  mounted() {
    // TODO
    base.href('http://action:10066?isShowDarkStatusBar=1')
    if (base.isIphoneX()) {
      this.isIphoneX = true
    }
    this.initHead()
    // 初始化页面数据
    this.initData()
    // 绑定事件
    this.bindEvent()
    setTimeout(function() {
      window.TalkingData.onHTSCEvent(
        'page',
        'leaf1209',
        '1.0',
        '理财_基金定投|赎回设置页面|0|0',
        ''
      )
    }, 1000)
  },
  computed: {
    // 份额 - 两位小数
    strShares() {
      return Number(this.shares).toFixed(2)
    },
    formatInputData() {
      let data = ''
      if (this.inputData == '清仓转出') {
        data = this.shares
      } else {
        data = this.inputData
      }
      data = Number(data).toFixed(2)
      return data
    },
  },
  methods: {
    // -------------init
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.container',
        title: '定投赎回',
        // 点击左上角返回，关闭当前页面
        leftEvent() {
          if (_this.clickFlag) {
            return
          }
          _this.clickFlag = true
          base.href('http://action:3413')
          _this.clickFlag = false
        },
      })
    },
    // 初始化页面数据
    initData() {
      let _this = this
      getData({
        // 产品id
        prdtId: _this.prdtId,
        // 产品代码
        prdtCode: _this.prdtCode,
        // 客户号
        clientNo: '($account)',
        // 资金帐户
        fundAccount: '($fund_account)',
        // 子账户
        subFundAccount: _this.subFundAccount,
        // 系统ID
        sysNodeId: '($tztsysnodeid)',
        // 密码
        password: '($password)',
        branchNo: '($khbranch)',
        TFrom: '($tfrom)',
      })
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          if (code === '0') {
            let result = data.resultData
            if (result && typeof result === 'object') {
              // 产品代码
              _this.prdtCode = result.prdtCode || ''
              // 产品名称
              _this.prdtName = result.prdtName || '--'
              // 产品份额
              _this.shares = result.currentShare || 0
              // 赎回日期
              _this.redeemDate = result.redeemDate || '--'
              // 到账日期
              _this.settlementDate = result.settlementDate || '--'
              // 赎回费率范围
              _this.redeemRate = result.redeemRate || '--'
              // 是否小于7天
              _this.islessSeven =
                result.isLessThanSevenDays === 'Y' ? true : false
              // 7天赎回费率
              _this.sevenDaysRate = result.sevenDaysRate || '--'
              // 是否是货币基金
              _this.isCurrencyFund =
                result.isCurrencyFund === 'Y' ? true : false
              // 1/2份额
              _this.fastArr[0].shares = base
                .calculate(_this.shares, 2, '/')
                .toFixed(2)
              // 全部份额
              _this.fastArr[1].shares = Number(_this.shares).toFixed(2)
              // 最低赎回份额
              _this.limitShare = result.redeemLimitShare || ''
            }
          } else {
            alert(msg)
          }
          _this.isShowLoading = false
          $('.loader-wrapper').hide()
        })
        .catch((err) => {
          base.log(err)
          alert(err.ERRORMESSAGE || '网络连接失败！')
          _this.isShowLoading = false
          $('.loader-wrapper').hide()
        })
    },
    // -------------event
    bindEvent() {
      let _this = this
      // 点击页面任意处，取消键盘聚焦事件
      document.querySelector('body').addEventListener('click', function() {
        _this.isFocus = false
      })
    },
    // 点击交易规则,跳转到交易规则页面
    goRule() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      if (plugin.urls && plugin.urls.rule) {
        base.href(plugin.urls.rule + this.prdtCode + '&tab=1')
      }
      this.clickFlag = false
    },
    // 点击输入框区域,输入框聚焦
    inputFocus() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      this.isFocus = true
      this.clickFlag = false
    },
    // 监听键盘点击事件
    listenKeyboardClick(type, inputData) {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      // 点击确认
      if (type == 'confirm') {
        this.isFocus = false
        this.clickFlag = false
        // this.confirm()
      } else {
        // 检查数据是否合法
        this.checkValValid(inputData)
        this.clickFlag = false
      }
    },
    // 检查数据是否合法
    checkValValid(inputData) {
      // 输入框赋值，如果是清仓转出 删除，则全部清空
      if (inputData === '.' || !isNaN(inputData) || inputData === '清仓转出') {
        this.inputData = inputData
      } else {
        this.inputData = ''
      }
      // 字体大小切换
      if (this.fontObj[this.inputData.length]) {
        this.nowFont = this.fontObj[this.inputData.length] || ''
      }
      // 输入金额单位
      this.strline = plugin.unitNum(inputData)
      this.isShowError = false
      if (this.inputData) {
        // 输入金额必须大于0
        if (
          Number(this.inputData) == 0 ||
          (inputData === '清仓转出' && Number(this.shares) == 0)
        ) {
          this.errorInfo = '赎回份额必须大于0'
          this.isShowError = true
        }
        // 输入金额 <= 可赎回份额，显示错误提示
        if (Number(this.inputData) > this.shares) {
          this.errorInfo = '超出您当前可赎回份额'
          this.isShowError = true
        }
        // 用户持仓 > 最低可赎回份额 & 输入金额 < 最低可赎回份额
        if (
          Number(this.shares) > Number(this.limitShare) &&
          Number(this.inputData) < Number(this.limitShare)
        ) {
          this.errorInfo = `${Number(this.limitShare)}份起赎`
          this.isShowError = true
        }
        // 用户持仓 < 最低可赎回份额 & 输入金额 < 全部份额
        if (
          Number(this.shares) < Number(this.limitShare) &&
          Number(this.inputData) < Number(this.shares)
        ) {
          this.errorInfo = `${Number(
            this.limitShare
          )}份起赎，目前持仓份额仅支持全部清仓赎回`
          this.isShowError = true
        }
      }

      // 键盘确认按钮是否高亮
      if (this.inputData === '') {
        this.nowFastIndex = 2
        this.bValValid = false
      } else if (Number(this.inputData) === 0) {
        // 键盘确认按钮是否高亮
        this.bValValid = false
        // 取消快捷购买选中
        // this.nowFastIndex = 2
      } else {
        this.bValValid = true
        // 快捷购买选中 & 金额不符，则取消选中
        if (
          (this.nowFastIndex == 0 &&
            Number(inputData) != Number(this.fastArr[0].shares)) ||
          (this.nowFastIndex == 1 &&
            Number(this.fastArr[1].title !== '全部清仓') &&
            Number(inputData) != Number(this.fastArr[1].shares))
        ) {
          this.nowFastIndex = 2
        }
      }
    },
    // 点击清空按钮，清空输入框
    clearInput() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      this.checkValValid('')
      this.clickFlag = false
    },
    // 切换快捷购买选中
    toggleFast(index) {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      this.isFocus = true
      if (this.nowFastIndex !== index) {
        this.nowFastIndex = index
        if (this.fastArr[index].title === '全部清仓') {
          this.checkValValid('清仓转出')
        } else {
          this.checkValValid(this.fastArr[index].shares)
        }
      } else {
        this.checkValValid('')
      }
      this.clickFlag = false
    },
    // 点击键盘确认/底部下一步按钮
    confirm() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      // 置灰，不继续执行
      if (!this.bValValid || this.isShowError) {
        this.clickFlag = false
        return
      }
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1209',
        '1.0',
        '理财_基金定投|赎回设置页面|底部|下一步',
        ''
      )
      this.isFocus = false
      let _this = this
      // 1、时间检查
      submitData({
        // 客户号
        clientNo: '($account)',
        // 赎回份额
        redeemShare: _this.formatInputData,
        // 资金帐户
        fundAccount: '($fund_account)',
        // 子账户
        subFundAccount: _this.subFundAccount,
        // 是否清仓 已终止&全部赎回
        isClearance:
          base.getUrlParameter('end') === '1' &&
          _this.shares === _this.formatInputData
            ? 'Y'
            : 'N',
        TFrom: '($tfrom)',
        // 产品id
        prdtId: _this.prdtId,
        password: '($password)',
        sysNodeId: '($tztsysnodeid)',
        isOnlyCheckTradeTime: 'Y',
      })
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          if (code === '0') {
            // 2、持有天数检查 持有<7天 & 非货币
            if (_this.islessSeven && !_this.isCurrencyFund) {
              // 显示7天提示弹窗
              _this.showSevenDialog()
            } else {
              // 3、金额检查 总份额-赎回份额<最低赎回份额，则全部赎回
              if (
                _this.shares !== _this.formatInputData &&
                _this.shares - _this.formatInputData < _this.limitShare
              ) {
                /* _this.$Dialog({
                  title: '温馨提示',
                  message:
                    '由于您赎回后剩余产品份额低于该产品最低赎回份额，系统会一并全部赎回，以避免剩余份额无法赎回情况的发生，请知悉。',
                  btns: 2,
                  cancelButtonText: '取消',
                  confirmButtonText: '确认',
                  submitCallback: () => {
                    // _this.redeemShares = _this.shares
                    _this.inputData = _this.shares
                    _this.isShowConfirm = true
                  },
                }) */
                new Prompt({
                  id: 'redeem-dialog',
                  title: '温馨提示',
                  content:
                    '由于您赎回后剩余产品份额低于该产品最低赎回份额，系统会一并全部赎回，以避免剩余份额无法赎回情况的发生，请知悉。',
                  align: 'left',
                  buttons: {
                    btnNo: 2,
                    left: {
                      label: '取消',
                      labelColor: '#999',
                      bgColor: '#ffffff',
                      fontWight: '200',
                      fontSize: '18px',
                      callback() {},
                    },
                    right: {
                      label: '确认',
                      labelColor: '#0076FF',
                      bgColor: '#ffffff',
                      fontWight: '200',
                      callback() {
                        _this.inputData = _this.shares
                        _this.isShowConfirm = true
                        setTimeout(() => {
                          window.TalkingData.onHTSCEvent(
                            'page',
                            'leaf1214',
                            '1.0',
                            '理财_基金定投|赎回确认页面|0|0',
                            ''
                          )
                        }, 1000)
                      },
                    },
                  },
                })
              } else {
                // _this.redeemShares = _this.formatInputData
                _this.isShowConfirm = true
                setTimeout(() => {
                  window.TalkingData.onHTSCEvent(
                    'page',
                    'leaf1214',
                    '1.0',
                    '理财_基金定投|赎回确认页面|0|0',
                    ''
                  )
                }, 1000)
              }
            }
          } else if (code === '201881021070002') {
            // 清仓不在时间
            /* _this.$Dialog({
              title: '温馨提示',
              message:
                '定投清仓赎回支持时间为交易日8:30至14:45，当前时间暂不支持清仓赎回，您可在15:00之前进行部分赎回操作。',
              btns: 1,
              confirmButtonText: '确认',
              submitCallback() {},
            }) */
            new Prompt({
              id: 'redeem-dialog',
              title: '温馨提示',
              content:
                '定投清仓赎回支持时间为交易日8:30至14:45，当前暂不支持清仓赎回，您可在15:00之前进行部分赎回操作。',
              align: 'left',
              buttons: {
                btnNo: 1,
                left: {
                  label: '确认',
                  callback() {
                    /* $('body').css('overflow', 'scroll')
                    _this.enableScroll() */
                  },
                },
              },
            })
          } else if (code === '201881021070001') {
            // 赎回不在时间内
            // 清仓不在时间
            /* _this.$Dialog({
              title: '温馨提示',
              message:
                '定投持仓可赎回时间为交易日8:30至15:00，当前时间暂不支持赎回。',
              btns: 1,
              confirmButtonText: '确认',
              submitCallback() {},
            }) */
            new Prompt({
              id: 'redeem-dialog',
              title: '温馨提示',
              content:
                '定投持仓可赎回时间为交易日8:30至15:00，当前暂不支持赎回。',
              align: 'left',
              buttons: {
                btnNo: 1,
                left: {
                  label: '确认',
                  callback() {
                    /* $('body').css('overflow', 'scroll')
                    _this.enableScroll() */
                  },
                },
              },
            })
          } else {
            alert(msg)
          }
          _this.clickFlag = false
        })
        .catch((err) => {
          alert(err.ERRORMESSAGE || '网络连接失败！')
          _this.clickFlag = false
          ajax.hideLoading()
        })
    },
    // 显示7天提示弹窗
    showSevenDialog() {
      let _this = this
      /* _this.$Dialog({
        title: '温馨提示',
        message: `赎回持有不足7天的份额时，基金公司将会收取${_this.sevenDaysRate}的赎回费率，请谨慎操作。`,
        btns: 1,
        confirmButtonText: '确认',
        submitCallback() {
          if (_this.shares - _this.formatInputData < _this.limitShare) {
            _this.$Dialog({
              title: '温馨提示',
              message:
                '由于您赎回后剩余产品份额低于该产品最低赎回份额，系统会一并全部赎回，以避免剩余份额无法赎回情况的发生，请知悉。',
              btns: 2,
              cancelButtonText: '取消',
              confirmButtonText: '确认',
              submitCallback: () => {
                _this.inputData = _this.shares
                _this.isShowConfirm = true
              },
            })
          } else {
            _this.isShowConfirm = true
          }
        },
      }) */
      new Prompt({
        id: 'redeem-dialog',
        title: '温馨提示',
        content: `赎回持有不足7天的份额时，基金公司将会收取${_this.sevenDaysRate}的赎回费率，请谨慎操作。`,
        align: 'left',
        buttons: {
          btnNo: 1,
          left: {
            label: '确认',
            callback() {
              if (
                _this.shares !== _this.formatInputData &&
                _this.shares - _this.formatInputData < _this.limitShare
              ) {
                new Prompt({
                  id: 'redeem-dialog',
                  title: '温馨提示',
                  content:
                    '由于您赎回后剩余产品份额低于该产品最低赎回份额，系统会一并全部赎回，以避免剩余份额无法赎回情况的发生，请知悉。',
                  align: 'left',
                  buttons: {
                    btnNo: 2,
                    left: {
                      label: '取消',
                      labelColor: '#909090',
                      bgColor: '#ffffff',
                      fontWight: '200',
                      fontSize: '18px',
                      callback() {},
                    },
                    right: {
                      label: '确认',
                      labelColor: '#0076ff',
                      bgColor: '#ffffff',
                      fontWight: '200',
                      callback() {
                        _this.inputData = _this.shares
                        _this.isShowConfirm = true
                        setTimeout(() => {
                          window.TalkingData.onHTSCEvent(
                            'page',
                            'leaf1214',
                            '1.0',
                            '理财_基金定投|赎回确认页面|0|0',
                            ''
                          )
                        }, 1000)
                      },
                    },
                  },
                })
              } else {
                _this.isShowConfirm = true
                setTimeout(() => {
                  window.TalkingData.onHTSCEvent(
                    'page',
                    'leaf1214',
                    '1.0',
                    '理财_基金定投|赎回确认页面|0|0',
                    ''
                  )
                }, 1000)
              }
            },
          },
        },
      })
    },
    // 点击确认金额弹窗-确认按钮
    submit() {
      let _this = this
      // TODO 调试
      // let TEST = true
      let TEST = false
      ajax.showLoading()
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1214',
        '1.0',
        '理财_基金定投|赎回确认页面|底部|确认',
        ''
      )
      submitData({
        // 客户号
        clientNo: '($account)',
        // 赎回份额
        redeemShare: _this.formatInputData,
        // 资金帐户
        fundAccount: '($fund_account)',
        // 子账户
        subFundAccount: _this.subFundAccount,
        // 是否清仓 已终止&全部赎回
        isClearance:
          base.getUrlParameter('end') === '1' &&
          _this.shares == _this.formatInputData
            ? 'Y'
            : 'N',
        TFrom: '($tfrom)',
        // 产品id
        prdtId: _this.prdtId,
        password: '($password)',
        sysNodeId: '($tztsysnodeid)',
        isOnlyCheckTradeTime: 'N',
      })
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          if (code === '0') {
            var result = data.resultData
            if (result && typeof result === 'object' && result.scOrderNo) {
              // 产品名称 赎回份额 订单号
              let params = `?name=${encodeURIComponent(
                `${_this.prdtName}`
              )}&shares=${_this.formatInputData}&order=${
                result.scOrderNo
              }&code=${this.prdtCode}`
              if (TEST) {
                base.href(`${plugin.urls.redeemSuccessTEST}${params}`)
              } else {
                base.href(
                  `http://action:1965/?url=${encodeURIComponent(
                    `${plugin.urls.redeemSuccess}${params}`
                  )}`
                )
              }
            }
          } else {
            // 201881021070001 - 特殊错误码 不在服务时间内
            if (TEST) {
              base.href(`${plugin.urls.redeemFailTEST}${msg}`)
            } else {
              base.href(
                `http://action:1965/?url=${encodeURIComponent(
                  `${plugin.urls.redeemFail}${msg}`
                )}`
              )
            }
          }
          ajax.hideLoading()
        })
        .catch((err) => {
          alert(err.ERRORMESSAGE || '网络连接失败！')
          ajax.hideLoading()
        })
    },
  },
}
</script>
<style lang="less">
// 顶部导航
@import '../../components/navigation-bar/navigation-bar.css';
@import '../../components/Prompt.css';
// 通用
@import '../../components/Common.less';
// self
@import './App.less';
</style>
