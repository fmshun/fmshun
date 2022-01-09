<template>
  <div id="app">
    <!-- <waiting v-show="showWaiting"></waiting> -->
    <div class="wrapper">
      <!-- 头部tab选择 -->
      <div class="top-w" v-if="bEquityFunds">
        <div class="top">
          <div class="left" @click="closePage"></div>
          <div class="tabs">
            <div
              class="tab"
              :class="selectedTab == 0 ? 'selected' : ''"
              @click="headTabToggle(0)"
            >
              普通定投
            </div>
            <div
              class="tab"
              :class="selectedTab == 1 ? 'selected' : ''"
              @click="headTabToggle(1)"
            >
              智能定投
            </div>
          </div>
          <div
            class="right ignore"
            v-show="selectedTab == 1 && !bShowInteTop"
            @click="jumpInteIntro"
          ></div>
        </div>
      </div>
      <div class="top-w" v-else>
        <div class="top">
          <div class="left" @click="closePage"></div>
          <div class="tabs">
            <div class="tab">基金定投</div>
          </div>
        </div>
      </div>

      <div class="content-w">
        <div class="content-tab">
          <!-- v-show="bShowInteTop" -->
          <div class="inte-top" v-if="selectedTab == 1 && bShowInteTop">
            <img
              src="./images/inte-top.png"
              class="icon"
              alt
              @click="jumpInteIntro"
            />
            <div class="close" @click="inteTopCloseHandler"></div>
          </div>
          <keep-alive>
            <editaip
              class="edit-aip-w"
              ref="editAipRef"
              :type="selectedTab == 1 ? 'intelligence' : ''"
              v-bind="resultData"
              :oPaper="oPaper"
              :prdtCode="prdtCode"
              @listenAjaxPaper="listenAjaxPaper"
              :jumpInteIntro="jumpInteIntro"
              :inteTopCloseHandler="inteTopCloseHandler"
            ></editaip>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Waiting from '@/components/waiting/Waiting'
import base from 'base'
import ajax from 'ajax'
import local from 'local'
import editaip from '@/components/edit-aip/edit-aip'
// import { getClientHeight } from '@/components/Common'
export default {
  name: 'App',
  metaInfo: {
    title: '普通定投/智能定投',
  },
  components: {
    // Waiting,
    editaip, //很大的一个组件
  },
  data() {
    return {
      //   showWaiting: true,
      resultData: {
        prdtId: base.getUrlParameter('prdtId'),
        lowMoney: 0, //最低起购金额
        highMoney: 999999999999999, //最高可购买金额
      }, //基金代码
      oPaper: {}, //需要签署的协议
      NUMBERMAX: '999999999999999', //最大值
      bEquityFunds: true, // 国内权益基金 提供 智能定投服务,其他标题只展示为 基金定投
      selectedTab: 0, //默认选中普通定投
      prdtCode: base.getUrlParameter('prdtCode'), //基金代码
      prdtId: base.getUrlParameter('prdtId'), //基金代码
      bShowInteTop: true, //智能定投是否展示顶部图片
      contentSwiper: '',
      isCounter: base.getUrlParameter('isCounter'),
    }
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    let _this = this
    this.initSwiper()
    this.changeInteTop()
    if (base.isAndroid()) {
      $('.top-w').addClass('android')
      $('#app').addClass('android')
    } else if (base.isIphoneX()) {
      $('.top-w').addClass('iphoneX')
      $('#app').addClass('iphoneX')
    }
    if (window.outerHeight <= 667) {
      $('.content-w').addClass('rel')
      $('.btn-ensure').addClass('rel')
    }
    _this.$nextTick(function() {
      _this.initHead()
      $('.content-tab').height($('.content-w').height())
      setTimeout(function() {
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1156',
          '1.0',
          '理财_基金定投|定投设置主页面|0|0',
          'way={普通定投}'
        )
      }, 1000)
    })
    this.init()
  },
  methods: {
    init: function() {
      let that = this
      local.readObject(
        {
          web_cft_financing_aip_urlParam: '',
        },
        function(data) {
          if (data.WEB_CFT_FINANCING_AIP_URLPARAM) {
            let urlParam = JSON.parse(
              decodeURIComponent(data.WEB_CFT_FINANCING_AIP_URLPARAM)
            )
            that.resultData = Object.assign({}, that.resultData, {
              urlParam: urlParam,
            })
          }
          $.when(
            that.action5882($.Deferred()),
            that.getData($.Deferred())
          ).done(function() {
            that.$nextTick(function() {
              if (that.isCounter === '1') {
                let data = JSON.parse(
                  decodeURIComponent(base.getUrlParameter('counterInfo')) ||
                    '{}'
                )
                that.resultData.m_period = data.periodType //周期;1 日;2 周;3 双周;4 月
                that.resultData.m_aipDay = data.aipDay //定投日，周/双周是周X;月是日期，日是空
                that.resultData.m_balance = data.amount // 定投金额
                that.$refs.editAipRef.initCounter(that.resultData)
              }

              $('.loader-wrapper').hide()
              //   that.showWaiting = false
            })
          })
        }
      )
    },
    initHead: function() {
      let className = ''
      if (base.isAndroid()) {
        className = 'andriod'
      } else if (base.isIphoneX()) {
        className = 'iphoneX'
      }
      let topHeight = $('.top-w').outerHeight()
      $('.content-w').css('top', topHeight)
    },
    initSwiper() {
      let _this = this
      var startx,
        starty,
        endx,
        endy,
        direction,
        content = $('.content-tab').get(0)

      //刷新完成，回归之前的状态
      var touchStart = function(event) {
        if (!event) {
          return
        }
        if (event.touches.length > 1) {
          //多个触摸则返回
          return
        }
        var target = event.targetTouches[0]
        startx = target.pageX
        starty = target.pageY
      }

      var touchMove = function(event) {
        if (!event) {
          return
        }
        if (event.touches.length > 1) {
          //多个触摸则返回
          return
        }
        if (_this.$refs.editAipRef.getIsPreventTouchMove()) {
          return
        }
        var target = event.targetTouches[0]
        endx = target.pageX
        endy = target.pageY
        let bMove = Math.abs(endx - startx) > 60
        direction = _this.GetSlideDirection(startx, starty, endx, endy)
        let bHavePop = _this.$refs.editAipRef.getHasPop()
        // 3：向左，4：向右
        if (
          direction == 3 &&
          _this.selectedTab != 1 &&
          bMove &&
          !bHavePop &&
          _this.bEquityFunds
        ) {
          _this.headTabToggle(1)
          event.preventDefault()
          return
        }
        if (
          direction == 4 &&
          _this.selectedTab != 0 &&
          bMove &&
          !bHavePop &&
          _this.bEquityFunds
        ) {
          _this.headTabToggle(0)
          event.preventDefault()
          return
        }
      }
      var touchEnd = function(event) {}
      //   var touchCancel = function(event) {
      //     event.preventDefault()
      //   }
      content.addEventListener('touchstart', touchStart, {
        passive: false,
      })
      content.addEventListener('touchmove', touchMove, {
        passive: false,
      })
      content.addEventListener('touchend', touchEnd, {
        passive: false,
      })
      //   content.addEventListener('touchcancel', touchCancel, {
      //     passive: false,
      //   })
    },
    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    GetSlideDirection(startX, startY, endX, endY) {
      var dy = startY - endY
      var dx = endX - startX
      var result = 0

      //如果滑动距离太短
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result
      }

      var angle = this.GetSlideAngle(dx, dy)
      if (angle >= -45 && angle < 45) {
        result = 4
      } else if (angle >= 45 && angle < 135) {
        result = 1
      } else if (angle >= -135 && angle < -45) {
        result = 2
      } else if (
        (angle >= 135 && angle <= 180) ||
        (angle >= -180 && angle < -135)
      ) {
        result = 3
      }

      return result
    },
    GetSlideAngle(dx, dy) {
      return (Math.atan2(dy, dx) * 180) / Math.PI
    },
    //滑动页面 智能定投
    changeInteTop(oData) {
      let that = this
      $('.content-tab')
        .off()
        .on('scroll', function() {
          if (that.selectedTab != 1) {
            // 普通定投滑动不作为
            return
          }
          if (!that.bShowInteTop) {
            // 智能定投 & 已经不展示图片了
            return
          }
          let scrollTop = $('.content-tab').get(0).scrollTop
          let topH = $('.inte-top').outerHeight()
          if (scrollTop > topH) {
            that.bShowInteTop = false
            $('.inte-top').fadeOut(300)
          }
        })
    },
    closePage: function() {
      base.href('http://action:3413')
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

          //   oData = {
          //     code: '0',
          //     msg: 'ok',
          //     resultData: {
          //       prdtCode: '000719', //产品code
          //       prdtName: '南方现金通货币E', //产品名称
          //       lowestFixedAmount: 10, //最低起投金额
          //       fixedInvestDisCount: 0.1, //定投固定的折扣
          //       rateRelationList: [
          //         //结构费率
          //         //   GT: greater than 大于
          //         //   LT: less than 小于
          //         //   GE: greater than or equal 大于等于
          //         //   LE: less than or equal 小于等于
          //         {
          //           gtAmount: '', //大于该值
          //           gtTag: '',
          //           ltAmount: 1000000, //小于该值
          //           ltTag: 'lt',
          //           originalRate: '1.5%',
          //           newRate: '0.15%',
          //         },
          //         {
          //           gtAmount: 1000000,
          //           gtTag: 'ge',
          //           ltAmount: 5000000,
          //           ltTag: 'lt',
          //           originalRate: '1.2%',
          //           newRate: '0.12%',
          //         },
          //         {
          //           gtAmount: 5000000,
          //           gtTag: 'ge',
          //           ltAmount: 10000000,
          //           ltTag: 'lt',
          //           originalRate: '0.3%',
          //           newRate: '0.03%',
          //         },
          //         {
          //           gtAmount: 10000000,
          //           gtTag: 'ge',
          //           ltAmount: '',
          //           ltTag: '',
          //           originalRate: '1000元',
          //           newRate: '1000元',
          //         },
          //       ],
          //       minDeductionRatio: '0.5', //智能定投最低
          //       maxDeductionRatio: '2.75',
          //       isCurrencyFund: 'Y', //是否为货币基金
          //       isDomesticRightFund: 'Y', //是否为国内权益基金
          //       bankNo: '0005', //银行代码
          //       cardNo: '11111111111111', //银行卡号
          //       allowTransPlan: 'Y', //银行卡是否支持自动转入
          //     },
          //   }
          // feeMode int 申购费计算模式
          // 1-固定收费
          // 2-按金额分级
          // 3-按持有期限分级
          // 4-按金额与持有期限分级
          let { code, resultData, msg } = oData
          that.bEquityFunds = resultData.isDomesticRightFund == 'Y'
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
    jsonParse: function(str) {
      try {
        return JSON.parse(str) || {}
      } catch (err) {
        return {}
      }
    },
    listenAjaxPaper: function(oParam) {
      let _this = this
      ajax.showLoading()
      $.when(this.ajaxPaperToSign($.Deferred(), oParam)).done(function() {
        _this.$refs.editAipRef.showMatchResultLayer()
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
          fundInvestType: oParam.fundInvestType,
          hasSignAutoShiftToContract: oParam.hasSignAutoShiftToContract,
        }),
      }

      ajax.run(
        url,
        obj,
        function(data) {
          // {
          //     "code":"0",
          //     "msg":"success",
          //     "serialId":"",
          //     "agrtList":[
          //         {
          //             "productId":"产品ID",
          //             "protocolNo":"协议编号",
          //             "agrtName":"协议名称",
          //             "version":"协议版本",
          //             "classify":"协议分类，1-业务协议，2-产品协议",
          //             "agrtUrl":"协议地址",
          //             "md5File":"文件md5",
          //             "fillingSourceId":"填充ID"
          //         }
          //     ]
          // }
          //   ajax.hideLoading()
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
                  let showName = '',
                    caSign = ''
                  if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000341'
                  ) {
                    showName = '适当性评估结果确认书'
                  } else if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000342'
                  ) {
                    showName = '不适当警示及投资者确认书'
                  }
                  // 产品事项告知书
                  else if (
                    item.contractMainType == 2 &&
                    item.contractCenterType == '16'
                  ) {
                    showName = '产品事项告知书'
                  }
                  // 代销风险揭示书
                  else if (
                    item.contractMainType == 2 &&
                    item.contractCenterType == '17'
                  ) {
                    showName = '代销风险揭示书'
                  }
                  // 基金招募说明
                  else if (
                    item.contractMainType == '2' &&
                    item.contractCenterType == '1'
                  ) {
                    showName = '基金招募说明'
                    caSign = '0'
                  }
                  // 基金合同
                  else if (
                    item.contractMainType == '2' &&
                    item.contractCenterType == '4'
                  ) {
                    showName = '基金合同'
                    caSign = '0'
                  }
                  // 基金产品风险揭示书
                  else if (
                    item.contractMainType == '2' &&
                    item.contractCenterType == '2'
                  ) {
                    showName = '基金产品风险揭示书'
                  }
                  // 香港互认基金业务风险声明书
                  else if (
                    item.contractMainType == '2' &&
                    item.contractCenterType == '35'
                  ) {
                    showName = '香港互认基金业务风险声明书'
                  } else if (
                    item.contractMainType == '2' &&
                    item.contractCenterType == '61'
                  ) {
                    showName = '基金产品资料概要'
                    caSign = '0'
                  } else if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000409'
                  ) {
                    showName = '普通基金定投服务协议'
                  } else if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000410'
                  ) {
                    showName = '智能基金定投服务协议'
                  } else if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000411'
                  ) {
                    showName = '资金自动转入服务协议'
                  } else if (
                    item.contractMainType == 1 &&
                    item.protocolNo == 'B000162'
                  ) {
                    showName = '基金定投特别说明'
                  } else {
                    showName = item.agrtName || '合同签署'
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
                  if (caSign === '0') {
                    agrtListItem.caSign = caSign
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
                  if (caSign === '0') {
                    oPdfItem.caSign = caSign
                  }
                  pdfItem.push(JSON.stringify(oPdfItem))
                })
              }
              // 基金产品资料概要
              _this.oPaper = Object.assign({}, _this.oPaper, {
                pass: true,
                serialId: oData.serialId,
                bizCode: 1008,
                agrtList: agrtList,
                strAgrtList: '[' + pdfItem.toString() + ']',
              })
              dtd.resolve()
              return
            }
          }
          _this.showErrorPrompt(msg)
          dtd.resolve()
        },
        function(data) {
          alert(data.ERRORMESSAGE || '网络连接失败')
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    // 获取协议失败， 弹框报错，点击关闭本页面
    showErrorPrompt: function(msg) {
      this.$Dialog({
        title: '温馨提示',
        message: msg || '网络异常，请稍后再试',
        btns: 1,
        confirmButtonText: '确认',
        submitCallback: () => {
          base.href('http://action:3413')
        },
      })
    },
    // 获取用户权限
    action5882: function(dtd) {
      let _this = this
      let openAccount = JSON.parse(this.resultData.urlParam.openAccount)
      let companyCode = openAccount.fundCompanyCode
      ajax.run(
        '/reqxml?action=5827&Token=($token)&MobileCode=($mobilecode)&Account=($account)',
        '',
        function(xml) {
          var clientType = xml.CLIENTTYPE
          var ajaxUrl =
            '/reqxml?action=5882&Token=($token)&MobileCode=($mobilecode)&Account=($account)' +
            '&FundCompany=' +
            companyCode +
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
              //   let firstCount = _this.getCounterValue(xml, '首次最少金额')
              //   let notFirstCount = _this.getCounterValue(xml, '非首次最少金额')
              let lowMoney = _this.getCounterValue(xml, '最低定投起点')
              //   let unit = _this.getCounterValue(xml, '申购认购单位')
              //   let append = _this.getCounterValue(xml, '追加金额')
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
              //   lowMoney = isFirst == 1 ? firstCount : notFirstCount
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
    // 点击Tab或滑动页面均可切换Tab页
    headTabToggle: function(index) {
      this.selectedTab = index
      if (this.selectedTab != 1) {
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1156',
          '1.0',
          '理财_基金定投|定投设置主页面|0|0',
          'way={普通定投}'
        )
      } else {
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1156',
          '1.0',
          '理财_基金定投|定投设置主页面|0|0',
          'way={智能定投}'
        )
      }
    },
    // 智能定投头部图片点击跳转至智能定投介绍页面
    jumpInteIntro: function() {
      let url =
        'http://action:10061/?fullscreen=1&&topcolor=f5c590&&url=/zlcftajax/ttf/auto-activity/main.htm?pageId=5615'
      base.href(url)
    },
    // 下单页面上滑时或点击图片右上角叉 智能定投头部点击事件
    inteTopCloseHandler: function() {
      this.bShowInteTop = false
      $('.inte-top').fadeOut(300)
    },
  },
}
</script>
<style lang="less">
@import './App.less';
</style>
