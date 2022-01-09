<template>
  <div id="use-nav-top-app">
    <!-- <waiting v-show="showWaiting"></waiting> -->
    <navtop title="交易规则"></navtop>
    <div class="wrapper">
      <div class="head-tabs">
        <div class="bar"></div>
        <div
          class="tab"
          :class="selectedTab === 0 ? 'selected' : ''"
          @click="headTabToggle(0)"
        >
          买入规则
        </div>
        <div
          class="tab"
          :class="selectedTab === 1 ? 'selected' : ''"
          @click="headTabToggle(1)"
        >
          赎回规则
        </div>
      </div>

      <div class="content-tabs">
        <!-- 买入 -->
        <div class="tab" v-if="selectedTab === 0">
          <div class="info-wrapper">
            <p>
              首次定投扣款开始于定投方案所设置的最早的交易日，并且每个扣款日都为交易日
              (例如：2017年4月30日设置了按月定投方案，约定每月1日扣款，则2017年5月4日（5月1日-5月3日为节假日，顺延到5月4日)
              为首次扣款日，第二个扣款日为2017年6月1日）。
            </p>
            <br />
            <p>
              如遇客户扣款日15:00前资金账户余额不足等原因，造成当期扣款失败，由于客户账户余额不足导致申购失败所造成的损失由客户自负。
            </p>
          </div>
          <!-- 定投买入费率 buyfeeMode=3-->
          <div class="inner-wrapper rate-wrapper" v-if="buyRateItem.length > 0">
            <p class="title">定投买入费率</p>
            <div class="tb">
              <div class="th">
                <div class="item">{{ buyfeename }}</div>
                <div class="item right">买入费率</div>
              </div>
              <div class="tr" v-for="(item, index) in buyRateItem" :key="index">
                <div class="item" v-html="getRateLeft(item, buyfeename)"></div>
                <div class="item right" v-html="getRateRight(item)"></div>
              </div>
            </div>
            <p class="desc">
              注：此表费率仅供参考，真实费率以购买时实际收取为准。
            </p>
          </div>
          <!-- 定投买入费率 buyfeeMode=4-->
          <div
            class="inner-wrapper rate-wrapper"
            v-if="newBuyRateItem.length > 0"
          >
            <p class="title">定投买入费率</p>
            <div class="tb">
              <div class="th">
                <div class="item"></div>
                <div class="item right">买入费率</div>
              </div>
              <div
                class="new-rate-content"
                v-for="(item, index) in newBuyRateItem"
                :key="index"
              >
                <div class="content-left">
                  <div class="content" v-html="getNewRateLeft(item, 0)"></div>
                  <div class="content" v-html="getNewRateLeft(item, 1)"></div>
                </div>
                <div class="content-right" v-html="getRateRight(item)"></div>
              </div>
            </div>
            <p class="desc">
              注：此表费率仅供参考，真实费率以购买时实际收取为准。
            </p>
          </div>
          <div class="inner-wrapper time-wrapper">
            <p class="title">买入时间</p>
            <div class="time-w">
              <div class="top">
                <div class="item item1">买入提交</div>
                <div class="item item2">确认份额</div>
                <div class="item item3">查看持仓</div>
              </div>
              <img class="process" src="./images/progress.png" />
              <div class="bottom">
                <div class="item item1">T日</div>
                <div class="item item2">{{ strBuyDate }}</div>
                <div class="item item3">{{ strBuyDate1 }}</div>
              </div>
              <div class="desc">
                T日：指管理人在规定时间受理委托人提出参与、退出或其他交易申请的工作日。
                <br />
                T+n日：指T日后的第 n 个交易日。
              </div>
            </div>

            <div class="tb date-w">
              <div class="th">
                <div class="item item1">买入时间</div>
                <div class="item item2">确认份额</div>
                <div class="item item3">查看持仓</div>
              </div>
              <div class="tr" v-for="n in 5" :key="n">
                <div class="item item1">
                  <p>{{ dateArray[n - 1] }}15:00至</p>
                  <p>{{ dateArray[n] }}15:00</p>
                </div>
                <div class="item item2">
                  <div>{{ buyconfirmArray[n - 1] }}</div>
                </div>
                <div class="item item3">
                  <div>{{ buyholdArray[n - 1] }}</div>
                </div>
              </div>
            </div>
            <div class="tip">
              以上默认周一至周五为交易日，周六及周日为非交易日，如遇节假日调休等特殊情况则业务顺延处理。
            </div>
            <div class="desc">
              以上信息揭示仅供参考，不排除系统清算、升级等其他特殊情况的发生引起的偏差，具体以实际到账时间和管理人收益计算结果为准，如遇问题可通过95597或在线客服进行咨询。
            </div>
          </div>

          <div
            class="inner-wrapper other-wrapper"
            v-if="buyOtherItem.length > 0"
          >
            <p class="title">其他</p>
            <div class="tb">
              <div class="th">
                <div class="item">费用类别</div>
                <div class="item right">费率</div>
              </div>
              <div
                class="tr"
                v-for="(item, index) in buyOtherItem"
                :key="index"
              >
                <div class="item">{{ item.name }}</div>
                <div class="item right">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 赎回 -->
        <div class="tab" v-if="selectedTab === 1">
          <!-- <div class="info-wrapper">
            <p>
              客户可自行暂停定投计划。
              <br>定投计划亦可能因以下原因暂停：1）客户风险承受能力评估失效；2）产品三要素与客户三要素变更造成适当性不匹配；3）适当性三要素变更后未重新签署确认等，定投计划暂停会导致扣款失败等相关风险。
            </p>
            <br>
            <p>
              客户可自行终止定投计划。
              <br>基金定投计划亦可能因以下原因终止：1）客户定投期限到期(若已设置定投期限)；2）产品三要素与客户三要素适当性不匹配且客户为最低风险承受能力者或适当性三要素变更后未重新确认；3）客户风险承受能力评估失效；4）扣款日客户资金账户余额不足等原因，造成连续6个扣款周期扣款失败，系统将自动终止该定投计划。并由投资者承担相应的投资结果。由于客户账户余额不足导致申购失败所造成的损失由客户自负。
            </p>
            <br>
            <p>基金定投计划可能因以下外部意外因素导致扣款失败或计划终止：基金公司暂停申购、系统故障、通讯故障、投资市场停止交易、客户风险测评变更或失效、定投产品的风险要素变更等，特予以揭示。</p>
          </div>-->

          <!-- 赎回费率 -->
          <div
            class="inner-wrapper rate-wrapper"
            v-if="backRateItem.length > 0"
          >
            <p class="title">赎回费率</p>
            <div class="tb">
              <div class="th">
                <div class="item">{{ backfeename }}</div>
                <div class="item right">赎回费率</div>
              </div>
              <div
                class="tr"
                v-for="(item, index) in backRateItem"
                :key="index"
              >
                <div class="item" v-html="getRateLeft(item, backfeename)"></div>
                <div class="item right" v-html="getRateRight(item)"></div>
              </div>
            </div>
            <p class="desc">
              注：此表费率仅供参考，真实费率以购买时实际收取为准。
              赎回费用＝赎回金额＊赎回费率。
            </p>
          </div>
          <!-- 赎回费率 backfeeMode=4-->
          <div
            class="inner-wrapper rate-wrapper"
            v-if="backNewRateItem.length > 0"
          >
            <p class="title">赎回费率</p>
            <div class="tb">
              <div class="th">
                <div class="item"></div>
                <div class="item right">赎回费率</div>
              </div>
              <div
                class="new-rate-content"
                v-for="(item, index) in backNewRateItem"
                :key="index"
              >
                <div class="content-left">
                  <div class="content" v-html="getNewRateLeft(item, 0)"></div>
                  <div class="content" v-html="getNewRateLeft(item, 1)"></div>
                </div>
                <div class="content-right" v-html="getRateRight(item)"></div>
              </div>
            </div>
            <p class="desc">
              注：此表费率仅供参考，真实费率以购买时实际收取为准。
              赎回费用＝赎回金额＊赎回费率。
            </p>
          </div>
          <!-- 赎回时间 -->
          <div class="inner-wrapper time-wrapper">
            <p class="title">赎回时间</p>
            <div class="time-w">
              <div class="top">
                <div class="item item1">赎回提交</div>
                <div class="item item2 sh">确认赎回资金</div>
                <div class="item item3">资金到账</div>
              </div>
              <img class="process" src="./images/progress.png" />
              <div class="bottom">
                <div class="item item1">T日</div>
                <div class="item item2">{{ strBackDate }}</div>
                <div class="item item3">{{ strBackDate1 }}</div>
              </div>
              <div class="desc">
                T日：指管理人在规定时间受理委托人提出参与、退出或其他交易申请的工作日。
                <br />
                T+n日：指T日后的第 n 个交易日。
              </div>
            </div>
            <!-- 具体自然日 -->
            <div class="tb date-w">
              <div class="th">
                <div class="item item1">赎回时间</div>
                <div class="item item2">确认赎回金额</div>
                <div class="item item3">资金到账</div>
              </div>

              <div class="tr" v-for="n in 5" :key="n">
                <div class="item item1">
                  <p>{{ dateArray[n - 1] }}15:00至</p>
                  <p>{{ dateArray[n] }}15:00</p>
                </div>
                <div class="item item2">
                  <div>{{ backconfirmArray[n - 1] }}</div>
                </div>
                <div class="item item3">
                  <div>
                    <p>{{ backholdArray[n - 1] }}</p>
                    <p>{{ backholdArray[n - 1] != '--' ? '24:00前' : '' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="tip">
              以上默认周一至周五为交易日，周六及周日为非交易日，如遇节假日调休等特殊情况则业务顺延处理。
            </div>
            <idv class="desc">
              以上信息揭示仅供参考，不排除系统清算、升级等其他特殊情况的发生引起的偏差，具体以实际到账时间和管理人收益计算结果为准，如遇问题可通过95597或在线客服进行咨询。
            </idv>
          </div>
        </div>
        <p class="risk-tip">投资有风险，理财须谨慎</p>
      </div>
    </div>
  </div>
</template>
<script>
// import Waiting from '@/components/waiting/Waiting'
import navtop from '@/components/nav-top/nav-top'
import base from 'base'
import ajax from 'ajax'
// import NavigationBar from '@/components/navigation-bar/navigation-bar'

export default {
  name: 'App',
  metaInfo: {
    title: '交易规则',
  },
  components: {
    // Waiting,
    navtop,
  },
  computed: {
    buyfeename: function() {
      if (this.buyfeeMode == 3) {
        return '持有期限'
      }
      return '定投金额'
    },
    backfeename: function() {
      if (this.backfeeMode == 3 || this.backfeeMode == 4) {
        return '持有期限'
      }
      return '购买金额'
    },
    strBuyDate: function() {
      if (this.buyDays !== undefined && this.buyDays !== '') {
        return 'T+' + this.buyDays + '日'
      }
      return '--'
    },
    strBuyDate1: function() {
      if (this.buyDays !== undefined && this.buyDays !== '') {
        return 'T+' + (parseInt(this.buyDays) + 1) + '日'
      }
      return '--'
    },
    strBackDate: function() {
      if (this.backDays === undefined || this.backDays === '') {
        return '--'
      }
      return 'T+' + this.backDays + '日'
    },
    strBackDate1: function() {
      if (this.backDaysAdd === undefined || this.backDaysAdd === '') {
        return '--'
      }
      return 'T+' + this.backDaysAdd + '日'
    },
  },
  data() {
    return {
      selectedTab: Number(base.getUrlParameter('tab')) || 0,
      prdtCode: base.getUrlParameter('prdtCode'), //产品代码
      dateArray: ['周一', '周二', '周三', '周四', '周五', '下周一'],
      buyconfirmArray: [], //确认份额时间
      buyholdArray: [], //查看持仓时间
      buyfeeMode: '', //费率模式
      buyRateItem: [], //结构化费率数据
      newBuyRateItem: [], //buyfeeMode为4时存入的数据
      buyOtherItem: [],
      backconfirmArray: [],
      backholdArray: [],
      backRateItem: [],
      backNewRateItem: [], //backfeeMode为4时存入的数据
      buyDays: '',
      backfeeMode: '',
      backDaysAdd: '',
      backDays: '',
    }
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    if (base.isAndroid()) {
      $('.head-tabs').addClass('android')
    } else if (base.isIphoneX()) {
      $('.head-tabs').addClass('iphoneX')
    }
    this.init()
  },
  methods: {
    init: function() {
      let that = this

      this.getData($.Deferred()).done(function() {
        // that.showWaiting = false
        $('.loader-wrapper').hide()
      })
      window.GoBackOnLoad = function() {
        ajax.showLoading()

        that.getData($.Deferred()).done(function() {
          ajax.hideLoading()
        })
      }
    },
    headTabToggle: function(index) {
      this.selectedTab = index
    },
    getData: function(dtd) {
      let that = this
      let url =
          '/reqxml?action=27006&path=/financing/prdt_detail/rule&prdtCode=' +
          this.prdtCode,
        option = {}
      ajax.run(
        url,
        option,
        function(data) {
          var oData = $(data.BINDATA),
            ERRORNO = oData.find('flag').attr('code'),
            MESSAGE = oData.find('flag').attr('msg')
          base.log(oData)
          if (ERRORNO === '0') {
            var fundName = oData.find('topInfo').attr('name') || ''
            var managerName = oData.find('topInfo').attr('managerName') || ''
            var period = oData.find('buy').attr('period') //  时期：1-申购或封闭,2-认购

            that.buyfeeMode =
              oData
                .find('buy')
                .find('invest')
                .attr('feeMode') || ''
            that.buyDays = oData.find('tradeRule').attr('purConfirmDay') // 申购确认天数

            if (that.buyfeeMode && that.buyfeeMode == 4) {
              that.newBuyRateItem = []
              oData
                .find('buy')
                .find('invest')
                .find('item')
                .each(function(index) {
                  let item = $(this)
                  let obj = {
                    mgt: item.attr('mgt'),
                    mlt: item.attr('mlt'),
                    mgtTag: item.attr('mgttag'),
                    mltTag: item.attr('mlttag'),
                    dgt: item.attr('dgt'),
                    dlt: item.attr('dlt'),
                    dgtTag: item.attr('dgttag'),
                    dltTag: item.attr('dlttag'),
                    original: item.attr('original') || '',
                    upnew: item.attr('new') || '--',
                  }
                  that.newBuyRateItem.push(obj)
                })
            } else {
              that.buyRateItem = []
              oData
                .find('buy')
                .find('invest')
                .find('item')
                .each(function() {
                  let item = $(this)
                  let obj = {
                    gt: item.attr('gt'),
                    lt: item.attr('lt'),
                    gtTag: item.attr('gtTag'),
                    ltTag: item.attr('ltTag'),
                    original: item.attr('original'),
                    name: item.attr('name'),
                    upnew: item.attr('new') || '--',
                  }
                  that.buyRateItem.push(obj)
                })
            }

            that.buyOtherItem = []

            oData
              .find('buy')
              .find('other')
              .find('item ')
              .each(function() {
                let obj = {
                  name: $(this).attr('name'),
                  value: $(this).attr('value'),
                }
                if (
                  typeof $(this).attr('value') == 'undefined' ||
                  $(this).attr('value') === ''
                ) {
                  obj.value = '--'
                }
                if (obj.name != '销售服务费分成比例') {
                  that.buyOtherItem.push(obj)
                }
              })

            that.backfeeMode =
              oData
                .find('back')
                .find('daily')
                .attr('feeMode') || ''
            that.backDays = oData.find('tradeRule').attr('redeConfirmDay') // 赎回确认天数
            that.backDaysAdd = oData.find('tradeRule').attr('redeSettleDay') // 赎回到帐天数
            if (that.backfeeMode && that.backfeeMode == 4) {
              that.backNewRateItem = []
              oData
                .find('back')
                .find('daily')
                .find('item')
                .each(function(index) {
                  let item = $(this)
                  let obj = {
                    mgt: item.attr('mgt'),
                    mlt: item.attr('mlt'),
                    mgtTag: item.attr('mgttag'),
                    mltTag: item.attr('mlttag'),
                    dgt: item.attr('dgt'),
                    dlt: item.attr('dlt'),
                    dgtTag: item.attr('dgttag'),
                    dltTag: item.attr('dlttag'),
                    original: item.attr('original') || '',
                    upnew: item.attr('new') || '--',
                  }
                  that.backNewRateItem.push(obj)
                })
            } else {
              that.backRateItem = []
              oData
                .find('back')
                .find('daily')
                .find('item')
                .each(function() {
                  let item = $(this)
                  let obj = {
                    gt: item.attr('gt'),
                    lt: item.attr('lt'),
                    gtTag: item.attr('gtTag'),
                    ltTag: item.attr('ltTag'),
                    original: item.attr('original'),
                    name: item.attr('name'),
                    upnew: item.attr('new') || '--',
                  }
                  that.backRateItem.push(obj)
                })
            }

            that.renderBuyRule()

            that.renderSellRule()
          } else {
            alert(MESSAGE)
          }
          dtd.resolve()
        },
        function() {
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    getRateLeft: function(item, name) {
      //结构费率
      //   GT: greater than 大于
      //   LT: less than 小于
      //   GE: greater than or equal 大于等于
      //   LE: less than or equal 小于等于
      let gt = item.gt,
        lt = item.lt,
        gtTag = item.gtTag,
        ltTag = item.ltTag,
        newgt = '',
        newlt = ''

      if (gt != undefined && gt != '' && lt != undefined && lt != '') {
        if (gtTag == 'gt') {
          newgt = gt + '＜'
        } else if (gtTag == 'ge') {
          newgt = gt + '≤'
        }
        if (ltTag == 'lt') {
          newlt = '＜' + lt
        } else if (ltTag == 'le') {
          newlt = '≤' + lt
        }
      } else if (gt != undefined && gt != '' && (lt == undefined || lt == '')) {
        if (gtTag == 'gt') {
          newlt = '＞' + gt
        } else if (gtTag == 'ge') {
          newlt = '≥' + gt
        }
      } else if (
        (gt == undefined || gt == '') &&
        (lt != undefined || lt != '')
      ) {
        if (ltTag == 'lt') {
          newlt = '＜' + lt
        } else if (ltTag == 'le') {
          newlt = '≤' + lt
        }
      }
      return newgt + name + newlt
    },
    getNewRateLeft: function(item, type, isBack) {
      //结构费率
      //   GT: greater than 大于
      //   LT: less than 小于
      //   GE: greater than or equal 大于等于
      //   LE: less than or equal 小于等于
      let gt = item.dgt,
        lt = item.dlt,
        gtTag = item.dgtTag,
        ltTag = item.dltTag,
        name = '持有期限',
        newgt = '',
        newlt = ''
      if (type == 1) {
        gt = item.mgt
        lt = item.mlt
        gtTag = item.mgtTag
        ltTag = item.mltTag
        name = '购买金额'
        if (isBack) {
          name = '赎回金额'
        }
      }
      if (gt != undefined && gt != '' && lt != undefined && lt != '') {
        if (gtTag == 'gt') {
          newgt = gt + '＜'
        } else if (gtTag == 'ge') {
          newgt = gt + '≤'
        }
        if (ltTag == 'lt') {
          newlt = '＜' + lt
        } else if (ltTag == 'le') {
          newlt = '≤' + lt
        }
      } else if (gt != undefined && gt != '' && (lt == undefined || lt == '')) {
        if (gtTag == 'gt') {
          newlt = '＞' + gt
        } else if (gtTag == 'ge') {
          newlt = '≥' + gt
        }
      } else if (
        (gt == undefined || gt == '') &&
        (lt != undefined || lt != '')
      ) {
        if (ltTag == 'lt') {
          newlt = '＜' + lt
        } else if (ltTag == 'le') {
          newlt = '≤' + lt
        }
      }
      return newgt + name + newlt
    },
    getRateRight: function(item) {
      let original = item.original,
        upnew = item.upnew || '--'
      if (original == undefined || original == '') {
        return `${upnew}`
      }
      return `<span class="origin">${original}</span>
                  <span class="new">${upnew}</span>`
    },
    //渲染买入逻辑
    renderBuyRule: function() {
      let weekDay = [
        '周二',
        '周三',
        '周四',
        '周五',
        '下周一',
        '下周二',
        '下周三',
        '下周四',
        '下周五',
        '下下周一',
        '下下周二',
        '下下周三',
        '下下周四',
      ]

      if (this.buyDays == '' || this.buyDays == undefined) {
        this.buyconfirmArray = ['--', '--', '--', '--', '--']
        this.buyholdArray = ['--', '--', '--', '--', '--']
      } else {
        this.buyDays = parseInt(this.buyDays)
        this.buyconfirmArray = weekDay.slice(this.buyDays, this.buyDays + 5)
        this.buyholdArray = weekDay.slice(this.buyDays + 1, this.buyDays + 6)
      }
    },
    // 渲染卖出逻辑
    renderSellRule: function() {
      if (
        this.backDaysAdd === '' ||
        this.backDaysAdd === undefined ||
        this.backDays === '' ||
        this.backDays === undefined
      ) {
        this.backconfirmArray = ['--', '--', '--', '--', '--']
        this.backholdArray = ['--', '--', '--', '--', '--']
      } else {
        let weekDay = [
          '周二',
          '周三',
          '周四',
          '周五',
          '下周一',
          '下周二',
          '下周三',
          '下周四',
          '下周五',
          '下下周一',
          '下下周二',
          '下下周三',
          '下下周四',
          '下下周五',
        ]
        this.backconfirmArray = weekDay.slice(
          parseInt(this.backDays),
          parseInt(this.backDays) + 5
        )
        this.backholdArray = weekDay.slice(
          parseInt(this.backDaysAdd),
          parseInt(this.backDaysAdd) + 5
        )
      }
    },
    preventEvent: function(event) {
      event.preventDefault()
    },
    disableScroll: function() {
      document.removeEventListener('touchmove', this.preventEvent, {
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
