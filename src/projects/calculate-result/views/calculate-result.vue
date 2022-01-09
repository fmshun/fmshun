<template>
  <div class="calculate-result">
    <!--<div class="loading" v-if="loading"></div>-->
    <topHeader titleWord="计算结果" ref="header"></topHeader>
    <div class="main-content">
      <div class="fund-info">
        <div class="fund-name" style="height: 28px;line-height: 28px;">
          <span class="name-title" style="font-size: 20px;">
            {{ resultData.prdtName }}
          </span>
          <span
            class="code-wrap"
            v-if="judgeIOS"
            style="width: 56px;height: 19px;margin-left: 7px;font-size: 14px;line-height: 19px;"
          >
            ({{ resultData.prdtCode }})
          </span>
          <!--兼容Andriod-->
          <span
            class="code-wrap"
            v-else
            style="position: relative;height: 19px;margin-left: 7px;font-size: 14px;line-height: 19px"
          >
            <span style="position: absolute;top: 0;left: 0;font-size: 14px;">
              (
            </span>
            <span
              class="andriod-code"
              style="position: absolute;top: 1.3px;font-size: 14px;"
            >
              {{ resultData.prdtCode }}
            </span>
            <span
              class="right-brack"
              style="position: absolute;top: 0;font-size: 14px;"
            >
              ){{ judgeLeft() }}
            </span>
          </span>
        </div>
        <div class="invest-time-date">
          <div class="invest-time">
            <img src="../assets/time@2x.png" alt="" />
            <span>{{ investDate }}</span>
          </div>
          <div class="invest-date">
            <img src="../assets/transferin@2x.png" alt="" />
            <span>{{ resultData.investPlan }}</span>
          </div>
        </div>
      </div>
      <!--定投收益率和盈利-->
      <div class="invest-income-box">
        <div class="top-income-div">
          <div class="income-title">
            <div>定投收益率</div>
            <div>定投收益(元)</div>
          </div>
          <div class="income-amount">
            <div
              style="font-weight: bold;"
              :style="{
                color:
                  resultData.rate && resultData.rate.indexOf('-') !== -1
                    ? '#5E9F3B'
                    : '#ED5742',
              }"
            >
              <span>{{ resultData.rate }}</span>
              <span v-show="resultData.rate" class="per-cent">%</span>
            </div>
            <div class="total-amount">{{ resultData.profit }}</div>
          </div>
          <div class="result-title-box">
            <div class="result-title-item">
              <div class="item-title">定投期数</div>
              <div class="item-num">{{ resultData.times }}</div>
            </div>
            <div class="result-title-item">
              <div class="item-title">投入本金(元)</div>
              <div class="item-num">{{ resultData.cost }}</div>
            </div>
            <div class="result-title-item">
              <div class="item-title">期末总资产(元)</div>
              <div class="item-num">{{ resultData.lastAsset }}</div>
            </div>
          </div>
        </div>
        <div class="expand-other-info" v-if="excessOneYear">
          <!--定投超过一年,其他计算信息-->
          <div class="other-info-title" @click="expandOther">
            其他计算信息
            <img class="other-img" src="../assets/up@2x.png" alt="" />
          </div>

          <div class="chart-box">
            <div class="switch-btn">
              <div @click="switchClick" class="btn btn-income active">
                近6月年化收益
              </div>
              <div @click="switchClick" class="btn btn-cost">
                成本单价
              </div>
            </div>

            <div v-show="tabIndex === 0">
              <div class="legend invest">
                <span
                  class="square"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <div class="word1 two-row-1">
                  定投年化收益
                  <div class="word-num">{{ showLegend1(resultData) }}</div>
                </div>
                <span
                  class="square-two"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <div class="word2 two-row-2">
                  单笔投资年化收益
                  <div class="word-num two">
                    {{ showLegend2(resultData) }}
                  </div>
                </div>
              </div>
              <!--定投收益涨势chart-->
              <div class="invest-profit-canvas" style="margin-top: 19px;"></div>

              <div class="why-box">
                <img
                  @click="explainCost"
                  src="../assets/information@2x.png"
                  alt=""
                />
                <span @click="explainCost">
                  为什么要看年化收益率
                </span>
              </div>
            </div>
            <div v-show="tabIndex === 1">
              <div class="legend cost">
                <span
                  class="square cost"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <span class="word1">定投持有成本</span>
                <span class="word-num cost">
                  {{ showLegend1(resultData) }}
                </span>
                <span
                  class="square-two"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <span class="word2">基金净值走势</span>
                <span class="word-num two">
                  {{ showLegend2(resultData) }}
                </span>
              </div>
              <!--成本单价涨势chart-->
              <div class="cost-profit-canvas"></div>

              <div class="why-box">
                <img
                  @click="explainCost"
                  src="../assets/information@2x.png"
                  alt=""
                />
                <span @click="explainCost">帮你解读什么是成本单价</span>
              </div>
            </div>
          </div>
        </div>

        <div class="no-year-info" v-else>
          <!--定投未超过一年-->
          <div class="no-excess-year" style="width: 20px;height: 20px;">
            <img
              @click="expandNoYear"
              style="width: 16px;height: 16px;"
              src="../assets/up@2x.png"
              alt=""
            />
          </div>

          <div class="chart-box">
            <div class="switch-btn">
              <div @click="switchClick" class="btn btn-income active">
                定投收益
              </div>
              <div @click="switchClick" class="btn btn-cost">
                成本单价
              </div>
            </div>

            <div v-show="tabIndex === 0">
              <div class="legend invest">
                <span
                  class="square"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <span class="word1">定投收益</span>
                <span class="word-num">{{ showLegend1(resultData) }}</span>
                <span
                  class="square-two"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <span class="word2">单笔投资收益</span>
                <span class="word-num two">
                  {{ showLegend2(resultData) }}
                </span>
              </div>
              <!--定投收益涨势chart-->
              <div class="invest-profit-canvas"></div>
            </div>
            <div v-show="tabIndex === 1">
              <div class="legend cost">
                <span
                  class="square cost"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <span class="word1">定投持有成本</span>
                <span class="word-num cost">
                  {{ showLegend1(resultData) }}
                </span>
                <span
                  class="square-two"
                  style="width: 4px;height: 4px;border-radius: 2px;"
                ></span>
                <span class="word2">基金净值走势</span>
                <span class="word-num two">
                  {{ showLegend2(resultData) }}
                </span>
              </div>
              <!--成本单价涨势chart-->
              <div class="cost-profit-canvas"></div>

              <div class="why-box">
                <img
                  @click="explainCost"
                  src="../assets/information@2x.png"
                  alt=""
                />
                <span @click="explainCost">帮你解读什么是成本单价</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--定投按钮-->
      <div class="this-plan-btn" @click="thisPlanInvest">按此计划定投</div>
      <!--重新计算-->
      <div class="reset-btn" @click="againCount">重新计算</div>
      <!--温馨提示-->
      <div class="kindly-remind">
        温馨提示：该计算结果基于默认产品当前费率和红利再投等简化设置，可能与实际投资结果存在误差，仅供参考。
      </div>
    </div>

    <div class="explain-dialog">
      <!--为什么要看年化收益-->
      <div class="why-year-income" v-if="tabIndex === 0">
        <div class="dialog-title">比较年化收益率的好处</div>
        <div class="two-stage-title">
          年化收益率考虑资金的时间价值，更有可比性
        </div>
        <div class="year-income-chart">
          <img
            style="display: block;width: 100%;height: auto;"
            src="../assets/charts@3x.png"
            alt=""
          />
        </div>
        <div class="my-know-btn" @click="knowClick">我知道了</div>
      </div>

      <!--解读成本单价-->
      <div class="unit-price-explain" v-else>
        <div class="dialog-title">帮你解读</div>
        <div class="dialog-content">
          在基金走势的不同阶段进行定投，你的基金持有成本会不断发生变化，若当前持仓成本低于基金当前净值，意味着未来基金上涨时你会获得更多收益
        </div>
        <div class="my-know-btn" @click="knowClick">我知道了</div>
      </div>
    </div>

    <!--兜底展示-->
    <div class="visual-mask">
      <div class="dialog-content">
        <h3 class="title">系统提示</h3>
        <p class="text">对不起，计算器开了个小差～</p>
        <div class="btn-group">
          <div class="btn ok btnwidth" @click="goBack">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import topHeader from '../components/top-header'
import { Chart, linemove } from '@/libs/chart-v2.js'
import { getCalResult } from '../request/api'
import loadScripts from '@/utils/loadScripts'
import { setTimeout } from 'timers'

export default {
  name: 'calculate-result',
  components: { topHeader },
  data() {
    return {
      loading: false,
      investDate: '',
      reqParam: {},
      resultData: {},
      excessOneYear: false,
      tabIndex: 0,
      firstLoad: true,
    }
  },
  computed: {
    judgeIOS() {
      return base.isIOS()
    },
  },
  mounted() {
    loadScripts([
      '/licai/com/js/buy-process-v3.js',
      '/common/scripts/local.js',
      '/common/scripts/prompt.js',
      '/licai/com/component/js/antiMoneyLaundering.js',
      '/licai/com/component/js/layer.js',
      '/licai/com/js/quick-buy-alter.js',
      '/common/vendor/flexible-0.3.2/flexible.js',
      '/common/vendor/md5-2.11.0/md5.js',
      '/licai/com/js/steps-serial.js',
    ]).then(() => {})

    this.getCalResultData((data) => {
      this.$nextTick(() => {
        //定投日期处理,换行展示全部日期
        let start =
          this.reqParam.startDate.substring(0, 4) +
          '.' +
          this.reqParam.startDate.substring(4, 6) +
          '.' +
          this.reqParam.startDate.substring(6, 8)
        let end =
          this.reqParam.endDate.substring(0, 4) +
          '.' +
          this.reqParam.endDate.substring(4, 6) +
          '.' +
          this.reqParam.endDate.substring(6, 8)

        if ($('.invest-date')[0].offsetTop === 0) {
          this.investDate = start.substr(2) + ' - ' + end.substr(2)
        } else {
          this.investDate = start + ' - ' + end
        }

        //初始化年化收益折线图
        let investData = {
            yearProfitList: [],
            profitList: [],
          },
          date1 = []
        data.investProfitList.forEach((v) => {
          investData.yearProfitList.push(v.profitRate)
          investData.profitList.push(v.perProfitRate)
          date1.push(v.date)
        })
        this.drawLineCanvas(investData, date1, '.invest-profit-canvas') //定投收益/年化收益
      })
      //温馨提示贴底
      setTimeout(() => {
        if (
          $('.calculate-result').height() <
          document.documentElement.clientHeight
        ) {
          $('.kindly-remind').css(
            'margin-top',
            document.documentElement.clientHeight -
              $('.calculate-result').height() +
              'px'
          )
        } else {
          $('.kindly-remind').css('margin-top', '0px')
        }
        $('.loader-wrapper').hide() //关闭加载动画

        //弹窗页面禁止背景滑动
        $('.explain-dialog')[0].addEventListener(
          'touchmove',
          function(e) {
            e.preventDefault()
          },
          { passive: false }
        )

        //legend手机兼容
        if (window.screen.width < 350) {
          $('.two-row-1').css('margin-right', '10vw')
          // $('.no-year-info .square').css('margin-left', '25px')
          // $('.expand-other-info .invest .square').css('margin-left', '5px')
          // $('.expand-other-info .cost .square').css('margin-left', '15px')
        }
      }, 500)
    })
    setTimeout(function() {
      window.TalkingData.onHTSCEvent(
        'page',
        'leaf1255',
        '1.0',
        '理财_基金定投|定投计算器结果页面|0|0',
        ''
      )
    }, 1000)
  },
  methods: {
    //返回
    goBack() {
      $('.visual-mask').hide()
      base.href('http://action:3413')
    },
    judgeLeft() {
      this.$nextTick(() => {
        $('.andriod-code').css('left', $('.right-brack').width() + 'px')
        $('.right-brack').css(
          'left',
          $('.right-brack').width() + $('.andriod-code').width() + 'px'
        )
      })
    },
    //日期特殊处理
    handleDate(reqParam) {
      if (reqParam.startDate && reqParam.endDate) {
        let start =
          reqParam.startDate.substring(0, 4) +
          '.' +
          reqParam.startDate.substring(4, 6) +
          '.' +
          reqParam.startDate.substring(6, 8)
        let end =
          reqParam.endDate.substring(0, 4) +
          '.' +
          reqParam.endDate.substring(4, 6) +
          '.' +
          reqParam.endDate.substring(6, 8)

        if ($('.invest-date')[0].offsetTop === 0) {
          return start.substr(2) + ' - ' + end.substr(2)
        } else {
          return start + ' - ' + end
        }
      }
    },
    //定投金额处理
    investType(param) {
      if (param.periodType === 'M') {
        return `每月${param.aipDay}号定投${param.amount}元`
      } else if (param.periodType === 'D') {
        return `每双周${this.switchWeek(param.aipDay)}定投${param.amount}元`
      } else if (param.periodType === 'W') {
        return `每周${this.switchWeek(param.aipDay)}定投${param.amount}元`
      } else if (param.periodType === '') {
        return `每个交易日定投${param.amount}元`
      }
    },
    switchWeek(n) {
      if (n === '1') {
        return '一'
      } else if (n === '2') {
        return '二'
      } else if (n === '3') {
        return '三'
      } else if (n === '4') {
        return '四'
      } else if (n === '5') {
        return '五'
      }
    },
    //legend1,取当天的定投收益/单笔投资收益
    showLegend1(data) {
      //profitRate
      if (data.investProfitList && data.costList) {
        if (this.tabIndex === 0) {
          // let num =
          //   data.investProfitList[data.investProfitList.length - 1].profitRate
          // if (num < 0) {
          //   $('.invest .word-num').css('color', '#5E9F3B')
          // } else {
          //   $('.invest .word-num').css('color', '#4b92fe')
          // }
          return (
            data.investProfitList[data.investProfitList.length - 1].profitRate +
            '%'
          )
        } else if (this.tabIndex === 1) {
          return data.costList[data.costList.length - 1].cost
        }
      }
    },
    //legend2
    showLegend2(data) {
      if (data.investProfitList && data.costList) {
        if (this.tabIndex === 0) {
          // let num =
          //   data.investProfitList[data.investProfitList.length - 1]
          //     .perProfitRate
          // if (num < 0) {
          //   $('.invest .word-num.two').css('color', '#5E9F3B')
          // } else {
          //   $('.invest .word-num.two').css('color', '#ff8537')
          // }
          return (
            data.investProfitList[data.investProfitList.length - 1]
              .perProfitRate + '%'
          )
        } else if (this.tabIndex === 1) {
          return data.costList[data.costList.length - 1].worth
        }
      }
    },
    //获取计算结果
    getCalResultData(callback) {
      this.reqParam = {
        aipDay: base.getUrlParameter('aipDay') || '',
        amount: base.getUrlParameter('amount'),
        prdtId: base.getUrlParameter('prdtId'),
        startDate: base.getUrlParameter('startDate'),
        endDate: base.getUrlParameter('endDate'),
        periodType: base.getUrlParameter('periodType') || '',
      }
      base.log(this.reqParam)
      getCalResult(this.reqParam).then((data) => {
        base.log(JSON.parse(data.BINDATA))
        // $('.loader-wrapper').hide() //关闭加载动画
        let result = data.BINDATA ? JSON.parse(data.BINDATA) : {}
        let code = result.code
        let msg = result.msg
        if (code === '0') {
          this.resultData = result.resultData
          // this.resultData.costList=[
          //   {date: "20160905", cost: "1.21", worth: "1.19"}
          // ]
          if (this.resultData.oneYearMore === 'true') {
            this.excessOneYear = true
          } else {
            this.excessOneYear = false
          }

          if (callback) {
            callback(result.resultData)
          }
        } else {
          $('.visual-mask').show()
          setTimeout(() => {
            $('.visual-mask .dialog-content').css({
              transform: 'scale(1,1)',
            })
          }, 100)
        }
      })
    },
    //定投超过一年展开其他信息
    expandOther(e) {
      if (
        $('.other-img').hasClass('expand') &&
        $('.expand-other-info').hasClass('expand')
      ) {
        $('.other-img').removeClass('expand')
        $('.expand-other-info').removeClass('expand')
        $('.this-plan-btn').css('margin-top', '16.267vw')
      } else {
        $('.other-img').addClass('expand')
        $('.expand-other-info').addClass('expand')
        $('.this-plan-btn').css('margin-top', '7.467vw')
      }

      //温馨提示贴底
      if (
        $('.calculate-result').height() < document.documentElement.clientHeight
      ) {
        $('.kindly-remind').css(
          'margin-top',
          document.documentElement.clientHeight -
            $('.calculate-result').height() +
            'px'
        )
      } else {
        $('.kindly-remind').css('margin-top', '0px')
      }
    },
    //定投未超过一年
    expandNoYear(e) {
      if (
        $(e.target).hasClass('expand') &&
        $('.no-year-info').hasClass('expand')
      ) {
        $(e.target).removeClass('expand')
        $('.no-year-info').removeClass('expand')
        $('.no-year-info').css('margin-top', '2.133vw')
        $('.this-plan-btn').css('margin-top', '16.267vw')
      } else {
        $(e.target).addClass('expand')
        $('.no-year-info').addClass('expand')
        $('.no-year-info').css('margin-top', '6.4vw')
        $('.this-plan-btn').css('margin-top', '8vw')
      }
      //温馨提示贴底
      if (
        $('.calculate-result').height() < document.documentElement.clientHeight
      ) {
        $('.kindly-remind').css(
          'margin-top',
          document.documentElement.clientHeight -
            $('.calculate-result').height() +
            'px'
        )
      } else {
        $('.kindly-remind').css('margin-top', '0px')
      }
    },
    //展开信息tab切换
    switchClick(e) {
      $(e.target)
        .addClass('active')
        .siblings()
        .removeClass('active')
      this.tabIndex = $(e.target).index()
      if (this.firstLoad) {
        this.firstLoad = false
        let costData = {
            yearProfitList: [],
            profitList: [],
          },
          date2 = []
        this.resultData.costList.forEach((v) => {
          costData.yearProfitList.push(v.cost)
          costData.profitList.push(v.worth)
          date2.push(v.date)
        })
        this.$nextTick(() => {
          this.drawLineCanvas(costData, date2, '.cost-profit-canvas') //成本单价
        })
      }
    },
    /**
     * 画折线图 近半年收益走势图
     */
    drawLineCanvas: function(data, date, dom) {
      // console.log(data, date, dom)
      let self = this,
        yearPrintList = data.yearProfitList,
        printList = data.profitList,
        charts = [],
        valueY = []

      let chartOptions = {
        dom: dom,
        scale: 1,
        drawType: 0,
        saveImg: false,
        series: [
          {
            // 年化收益
            type: 'line',
            drawType: 0, //画图方式
            data: yearPrintList,
            lineStyle: {
              lineWidth: '0.5',
              strokeStyle: '#277CFF',
              fillStyle: ['rgba(196,224,255,.4)', 'rgba(246,250,255,0.4)'],
              font: '10px PingFangSC-Regular',
            },
            //节点 木有则不显示 默认不展示
            node: {
              //类型目前为元
              type: 'circle',
              drawIndex: [yearPrintList.length - 1], //需要画的索引号
              // size 目前为半径,后续可为数组 扩展对应类型
              size: 2,
              show: true,
              lineStyle: {
                strokeStyle: 'rgba(192,210,255,0.8)',
                lineWidth: 5,
                fillStyle: '#277CFF',
              },
              //负值
              negativeLineStyle: {
                strokeStyle: 'rgba(192,210,255,0.8)',
                lineWidth: 5,
                fillStyle: '#277CFF',
              },
            },
          },
          {
            // 单笔投资
            type: 'line',
            drawType: 0, //画图方式
            data: printList,
            lineStyle: {
              lineWidth: '0.5',
              strokeStyle: '#FF9E7A',
              fillStyle: ['rgba(249,152,68,.3)', 'rgba(249,152,68,0)'],
              font: '10px PingFangSC-Regular',
            },
            //节点 木有则不显示 默认不展示
            node: {
              //类型目前为元
              type: 'circle',
              drawIndex: [printList.length - 1], //需要画的索引号
              // size 目前为半径,后续可为数组 扩展对应类型
              size: 2,
              show: true,
              lineStyle: {
                strokeStyle: 'rgba(249,152,68,0.40)',
                lineWidth: 5,
                fillStyle: '#F99844',
              },
              //负值
              negativeLineStyle: {
                strokeStyle: 'rgba(249,152,68,0.40)',
                lineWidth: 5,
                fillStyle: '#F99844',
              },
            },
          },
        ],
        flexible: {
          left: self.tabIndex === 0 ? 50 : 40,
          top: 18.5,
          right: 5,
          bottom: 27,
        },
        events: {
          touchstart: function(x) {},
          touchmove: function(x) {},
          touchend: function(x) {},
        },
        touchCanvas: function(obj) {
          charts.push(obj)
          let params = {
            dom: dom,
            scale: 1,
            max: 0,
            min: 0,
            maxRangeList: yearPrintList, //年化收益
            sumRangeList: printList, //单笔投资
            dayList: date, //对应日期
            size: 3, //圆的半径
            left: 53,
            isShow: 1,
          }
          new linemove(charts, params)
        },
        xAxis: {
          show: true,
          data: [
            `${date[0].substring(0, 4)}-${date[0].substring(
              4,
              6
            )}-${date[0].substring(6, 8)}`,
            `${date[date.length - 1].substring(0, 4)}-${date[
              date.length - 1
            ].substring(4, 6)}-${date[date.length - 1].substring(6, 8)}`,
          ],
          dataBind: 'bottom',
          // x轴文字 位置 top 顶轴 middle 中轴 bottom 底轴
          margin: [11, 0, 0, 3],
          lineStyle: {
            lineWidth: 1,
            strokeStyle: '#ECEEF0',
          },
          textStyle: {
            font: '10px HelveticaNeue-Light',
            fillStyle: 'rgba(128, 128, 128, 0.45)',
            textBaseline: 'middle',
            fontWeight: 'lighter',
          },
        },
        yAxis: {
          show: true,
          avgNum: 4,
          margin: self.tabIndex === 0 ? [5, 5, 10, 3] : [5, 5, 10, 6.5],
          labelAlign: 'outside',
          basisPoint: false,
          lineStyle: {
            type: 'dashed',
            lineWidth: 1,
            strokeStyle: 'rgba(224, 226, 228, 0.6)', //#ECEEF0
          },
          textStyle: {
            font: '10px HelveticaNeue-Light',
            fillStyle: 'rgba(128, 128, 128, 0.67)',
            textAlign: 'right',
            textBaseline: 'middle',
          },
          formatter: function(value) {
            //防止坐标值重叠
            valueY.push(value)
            let obj = {}
            for (let i of valueY) {
              if (!obj[i]) {
                obj[i] = true
              } else {
                return ''
              }
            }
            //收益与成本Y坐标区分
            if (self.tabIndex === 0) {
              // 保留一位小数
              value = value.toFixed(2)
              // 坐标点，添加缩进
              if (value == 0) {
                return ' 0.00%'
              }
              // 大于0的情况
              else {
                return value + '%'
              }
            } else if (self.tabIndex === 1) {
              value = value.toFixed(2)
              return value
            }
          },
        },
        grid: {
          showYgridLine: true,
          /**
           * 画辅助线
           * @param {object} ctx canvas的画图对象
           * @param {object} option 画图插件的选项对象
           */
          drawYCustomGraph: function(ctx, option) {
            let width = $(option.dom).width() - 5
            let height = $(option.dom).height() - 0
            // 中间横线
            ctx.beginPath()
            ctx.moveTo(self.tabIndex === 0 ? 50 : 40, height / 2)
            ctx.lineTo(width, height / 2)
            ctx.strokeStyle = 'rgba(211,211,211,.6)'
            ctx.lineWidth = 0.5
            ctx.stroke()
          },
        },
      }
      new Chart(chartOptions)
    },
    //年化收益/解读成本单价
    explainCost() {
      $('.explain-dialog').show()
    },
    //我知道了
    knowClick() {
      $('.explain-dialog').hide()
    },
    //按此计算定投
    thisPlanInvest() {
      let self = this
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1255',
        '1.0',
        '理财_基金定投|定投计算器结果页面|底部|当前主入口按钮',
        'main_enter={按此计划定投}'
      )
      window.buyProcess.preCheck({
        //来源定投
        fromBranch: 'isAip',
        //产品代码
        productCode: this.resultData.prdtCode,
        //产品名称 三匹配页面要需要用到必传
        productName: this.resultData.prdtName,
        //基金公司代码必传
        companyCode: this.resultData.managerCode,
        //基金公司名称
        companyName: this.resultData.managerName,
        //产品类型2-基金
        productType: '2',
        isCounter: '1',
        //定投时间
        period: this.resultData.period,
        //定投金额
        amount: this.reqParam.amount,
        //定投周期
        periodType: (function() {
          if (self.reqParam.periodType === '') {
            return '1'
          } else if (self.reqParam.periodType === 'W') {
            return '2'
          } else if (self.reqParam.periodType === 'D') {
            return '3'
          } else if (self.reqParam.periodType === 'M') {
            return '4'
          }
        })(),
        //定投日
        aipDay: this.reqParam.aipDay,
      })
      // let url = `http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/new-aip.html?prdtCode=${this.resultData.prdtCode}&prdtId=${this.reqParam.prdtId}`
      // base.href(url)
    },
    //重新计算
    againCount() {
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1255',
        '1.0',
        '理财_基金定投|定投计算器结果页面|底部|当前主入口按钮',
        'main_enter={重新计算}'
      )
      setTimeout(() => {
        //返回计算器计算页面
        base.href('http://action:3413')
      }, 500)
    },
  },
}
</script>

<style lang="less">
@import '/licai/com/css/quick-buy-al.css';
@import '/licai/com/component/css/layer.css';

/* loading动画 */
.loading {
  position: absolute;
  z-index: 200990;
  width: 100%;
  height: 100%;
  background: #fff url('../assets/loading.gif') no-repeat center;
  background-size: 28px 28px;
}

.main-content {
  padding-top: 62px;
  .fund-info {
    padding-top: 25px;
    padding-right: 20px;
    padding-left: 25px;
    .fund-name {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      .name-title {
        overflow: hidden;
        font-family: PingFangSC-Medium, sans-serif;
        color: #ffffff;
        text-align: left;
        text-overflow: ellipsis;
        letter-spacing: 0;
        white-space: nowrap;
      }
      .code-wrap {
        position: relative;
        font-family: PingFangSC-Light, sans-serif;
        font-weight: 300;
        color: #ffffff;
        text-align: center;
        letter-spacing: 0;
        opacity: 0.5;
      }
    }

    /* 定投起始结束时间和日期 */
    .invest-time-date {
      position: relative;
      display: -webkit-flex;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 6px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 13px;
      color: #ffffff;
      letter-spacing: 0;
      .invest-time {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        width: 183px;
        height: 18px;
        margin-bottom: 8px;
        line-height: 18px;
        img {
          width: 13px;
          height: 14px;
        }
        span {
          position: relative;
          top: 0.5px;
          margin-left: 6px;
          opacity: 0.5;
        }
      }
      .invest-date {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        height: 18px;
        margin-bottom: 8px;
        line-height: 18px;
        img {
          width: 13px;
          height: 14px;
        }
        span {
          position: relative;
          top: 0.5px;
          flex: 1;
          margin-left: 6px;
          white-space: nowrap;
          opacity: 0.5;
        }
      }
    }
  }

  /* 定投收益率 */
  .invest-income-box {
    position: relative;
    padding-bottom: 29px;

    /* height: 900px; */
    margin: 9px 20px 0;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 6px 20px 0 rgba(99, 126, 205, 0.1);
    .top-income-div {
      padding: 28px 20px 0;
      background-image: linear-gradient(4deg, #ffffff 50%, #f3f6ff 100%);
      background-size: 100% 400px;
      border-radius: 5px;
      .income-title {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: space-between;
        height: 20px;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 14px;
        color: #666666;
        opacity: 0.83;
      }
      .income-amount {
        position: relative;
        box-sizing: content-box;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 32px;
        padding-bottom: 19.5px;
        margin-top: 4px;
        font-family: PingFangSC-Medium, sans-serif;
        font-size: 32px;
        line-height: 32px;
        letter-spacing: 0;
        .per-cent {
          font-size: 16px;
        }
        .total-amount {
          font-size: 23px;
          color: #2e2e2e;
        }

        &::after {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 1px;
          pointer-events: none;
          content: '';
          background-color: rgba(70, 102, 199, 0.27);
          opacity: 0.5;
          transform: scale(1, 0.5);
        }
      }
      .result-title-box {
        padding-top: 0.5px;
      }
      .result-title-item {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: space-between;
        height: 21px;
        margin-top: 23px;
        .item-title {
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 15px;
          color: #666666;
          opacity: 0.89;
        }
        .item-num {
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 17px;
          color: #3d3d3d;
          text-align: right;
        }
      }
    }

    /* 超过一年样式 其他计算信息 */
    .expand-other-info {
      width: 315px;
      height: 42px;
      margin: 24px 10px 0;
      overflow: hidden;
      background-image: linear-gradient(
        -58deg,
        rgba(228, 243, 255, 0.18) 0%,
        rgba(228, 243, 255, 0.35) 100%
      );
      .other-info-title {
        position: relative;
        box-sizing: content-box;
        height: 16px;
        padding: 13px 0;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 13px;
        line-height: 16px;
        color: #999999;
        text-align: center;
        letter-spacing: 0;
        img {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 204px;
          z-index: 1;
          width: 16px;
          height: 16px;
          margin: auto;
          transition: transform 0.3s linear;
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }
        img.expand {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      .switch-btn {
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 4px;
        .btn {
          position: relative;
          height: 26px;
          font-family: PingFangSC-Light, sans-serif;
          font-size: 12px;
          line-height: 26px;
          color: #4a4a4a;
          text-align: center;
          letter-spacing: 0;
          background: #ffffff;
        }
        .btn-income {
          width: 110px;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        .btn-income::after {
          position: absolute;
          top: -1px;
          left: -1px;

          /* z-index: -1; */
          width: 200%;
          height: 200%;
          overflow: auto;
          content: '';
          background-color: #fff0;
          border: 1px solid #dcdcdc;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          -webkit-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }
        .btn-cost {
          width: 110px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .btn-cost::after {
          position: absolute;
          top: -1px;
          left: -1px;

          /* z-index: -1; */
          width: 200%;
          height: 200%;
          overflow: auto;
          content: '';
          background-color: #fff0;
          border: 1px solid #dcdcdc;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
          -webkit-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }
        .btn.active {
          color: #2f8eff;
          background: #f2f8ff;
          &::after {
            border: 1px solid rgba(47, 142, 255, 0.5);
          }
        }
      }
    }
    .expand-other-info.expand {
      height: auto;
      overflow: visible;
    }

    /* 未超过一年样式 */
    .no-year-info {
      width: 315px;
      height: 0;
      margin: 8px 10px 0;
      overflow: hidden;
      background-image: linear-gradient(
        -58deg,
        rgba(228, 243, 255, 0.18) 0%,
        rgba(228, 243, 255, 0.35) 100%
      );
      .no-excess-year {
        position: absolute;
        right: 0;
        bottom: -6px;
        left: 0;
        margin: auto;
        background-color: #fff;
        border-radius: 10px;
        img {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          display: block;
          margin: auto;
          transition: transform 0.3s linear;
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }
        img.expand {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }

      .switch-btn {
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-top: 17px;
        .btn {
          position: relative;
          width: 97px;
          height: 26px;
          font-family: PingFangSC-Light, sans-serif;
          font-size: 12px;
          line-height: 26px;
          color: #4a4a4a;
          text-align: center;
          letter-spacing: 0;
          background: #ffffff;
        }
        .btn-income {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        .btn-income::after {
          position: absolute;
          top: -1px;
          left: -1px;

          /* z-index: -1; */
          width: 200%;
          height: 200%;
          overflow: auto;
          content: '';
          background-color: #fff0;
          border: 1px solid #dcdcdc;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          -webkit-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }
        .btn-cost {
          margin-right: 61px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .btn-cost::after {
          position: absolute;
          top: -1px;
          left: -1px;

          /* z-index: -1; */
          width: 200%;
          height: 200%;
          overflow: auto;
          content: '';
          background-color: #fff0;
          border: 1px solid #dcdcdc;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
          -webkit-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }
        .btn.active {
          color: #2f8eff;
          background: #f2f8ff;
          &::after {
            border: 1px solid rgba(47, 142, 255, 0.5);
          }
        }
      }
    }
    .no-year-info.expand {
      height: auto;
      overflow: visible;
    }
  }
}

.legend {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  height: 17px;

  /* line-height: 17px; */
  margin-top: 16px;
  font-family: PingFangSC-Light, sans-serif;
  font-size: 12px;
  letter-spacing: 0;
  .word1 {
    font-family: PingFangSC-Light, sans-serif;
    color: #277cff;
    opacity: 0.8;
  }
  .word2 {
    font-family: PingFangSC-Light, sans-serif;
    color: #f99844;
    opacity: 0.8;
  }

  .word-num {
    width: 51px;
    margin-left: 5px;
    color: #4b92fe;
  }
  .word-num.cost {
    width: 51px;
  }
  .word-num.two {
    width: 35px;
    min-width: 35px;
    color: #ff8537;
    white-space: nowrap;
  }

  .two-row-1 {
    position: relative;
    margin-right: 61px;
    .word-num {
      position: absolute;
      top: 19px;
      left: 0;
      margin-left: 0;
    }
  }
  .two-row-2 {
    position: relative;
    .word-num {
      position: absolute;
      top: 19px;
      left: 0;
      margin-left: 0;
    }
  }
}

//超过一年的画圆
.expand-other-info {
  .square {
    margin-right: 5px;

    /* margin-left: 12px; */
    background: #277cff;
  }
  .square.cost {
    /* margin-left: 42px; */
  }
  .square-two {
    margin-right: 5px;
    background: #f99844;
  }
}
//未超过一年
.no-year-info {
  .square {
    margin-right: 5px;

    /* margin-left: 45px; */
    background: #277cff;
  }
  .square.cost {
    /* margin-left: 42px; */
  }
  .square-two {
    margin-right: 5px;
    background: #f99844;
  }
}

.invest-profit-canvas {
  position: relative;
  width: 303px;
  height: 160px;
}
.cost-profit-canvas {
  position: relative;
  width: 303px;
  height: 160px;
}

.why-box {
  box-sizing: content-box;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  padding-bottom: 15px;

  /* margin-top: 12px; */
  font-family: PingFangSC-Light, sans-serif;
  font-size: 12px;
  font-weight: lighter;
  color: #999999;
  letter-spacing: 0;

  /* opacity: 0.8; */
  img {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    margin-left: 90px;
  }
}

/* 年化收益/解读成本单价 */
.explain-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999999999;
  display: none;
  background: rgba(0, 0, 0, 0.6);
}
.why-year-income {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 316px;
  height: 365px;
  margin: auto;
  overflow: hidden;
  background: #ffffff;
  border-radius: 4px;
  .dialog-title {
    margin-top: 30px;
    font-family: PingFangSC-Medium, sans-serif;
    font-size: 19px;
    color: #030303;
    text-align: center;
  }
  .two-stage-title {
    margin-top: 5px;
    font-family: PingFangSC-Light, sans-serif;
    font-size: 13px;
    line-height: 17px;
    color: #999999;
    text-align: center;
  }
  .year-income-chart {
    width: 280px;
    margin: 18px auto 14px;
  }
  .my-know-btn {
    position: relative;
    height: 49px;
    margin-top: 15px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 17px;
    line-height: 49px;
    color: #0076ff;
    text-align: center;
    letter-spacing: -0.41px;
    &::before {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 1px;
      pointer-events: none;
      content: '';
      background-color: #ededed;
      -webkit-transform: scale(1, 0.5);
      transform: scale(1, 0.5);
    }
  }
}
.unit-price-explain {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 272px;
  height: 234px;
  margin: auto;
  overflow: hidden;
  background: #ffffff;

  /* background: rgba(255,255,255,0.50); */
  border-radius: 4px;
  .dialog-title {
    margin-top: 20px;
    font-family: PingFangSC-Medium, sans-serif;
    font-size: 18px;
    color: #030303;
    text-align: center;
  }
  .dialog-content {
    width: 240px;
    margin: 13.5px auto 0;
    font-family: PingFangSC-Light, sans-serif;
    font-size: 15px;
    line-height: 23px;
    color: #444444;
    opacity: 0.89;
  }
  .my-know-btn {
    position: relative;
    height: 45px;
    margin-top: 16px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 17px;
    line-height: 45px;
    color: #0076ff;
    text-align: center;
    letter-spacing: -0.41px;
    &::before {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 1px;
      pointer-events: none;
      content: '';
      background-color: #ededed;
      -webkit-transform: scale(1, 0.5);
      transform: scale(1, 0.5);
    }
  }
}

.this-plan-btn {
  width: 340px;
  height: 60px;
  margin: 61px auto 0;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 17px;
  line-height: 46px;
  color: #ffffff;
  text-align: center;
  background: url('../assets/button.png') no-repeat;
  background-size: 340px 60px;
}
.reset-btn {
  position: relative;
  width: 340px;
  height: 44px;
  margin: 0 auto;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 17px;
  line-height: 44px;
  color: #999999;
  text-align: center;
  background: #ffffff;
  border-radius: 22px;
  &::after {
    position: absolute;
    top: -1px;
    left: -1px;

    /* z-index:-1; */
    width: 200%;
    height: 200%;
    overflow: auto;
    content: '';
    background-color: #fff0;
    border: 1px solid rgba(53, 101, 236, 0.27);
    border-radius: 44px;
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
}
.kindly-remind {
  width: 340px;

  /* height: 84px; */
  padding: 16.2px 0 32px;
  margin: 0 auto;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 12px;
  color: #c5c5c5;
  text-align: justify;
  letter-spacing: 0;
}

.visual-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50001;
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
  .dialog-content {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50002;
    display: table;
    width: 72%;
    max-width: 300px;
    margin: auto;
    text-align: center;
    background-color: #fff;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    transition: transform 0.3s ease-in-out;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
  .dialog-content .title {
    width: 100%;
    padding-top: 15.5px;
    padding-bottom: 11.5px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 18px;
    color: #000;
    text-align: center;
  }
  .dialog-content .text {
    min-height: 39px;
    padding: 0 15px 8.5px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 15px;
    color: #444;
    text-align: center;
    word-break: break-all;
  }
  .btn-group .btn {
    position: relative;
    height: 52px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 16px;
    line-height: 52px;
    color: #367fdf;
    text-align: center;
    &::before {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 1px;
      pointer-events: none;
      content: '';
      background-color: #ededed;
      -webkit-transform: scale(1, 0.5);
      transform: scale(1, 0.5);
    }
  }
}
</style>
