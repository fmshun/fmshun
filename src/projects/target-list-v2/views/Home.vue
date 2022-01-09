<template>
  <div id="target-list">
    <!-- loading -->
    <waiting v-show="isShowLoading"></waiting>
    <div :class="{ ios: isIOS }" class="container">
      <div class="wrapper fixed">
        <div class="scroll">
          <img class="top_bg" src="../assets/container_top.png" />
          <div class="top_total">
            <img class="bg" src="../assets/total_bg.png" alt />
            <div class="flex text_center">
              <div class="flex_item">
                <div class="title">总定投持仓(元)</div>
                <div :class="[getFont(strTotalHold.length)]" class="val">
                  {{ strTotalHold }}
                </div>
              </div>
              <div class="flex_item">
                <div class="title">定投数量</div>
                <div class="val">
                  {{ totalNum }}
                  <span>个</span>
                </div>
              </div>
              <div class="flex_item">
                <div class="title">当前总收益(元)</div>
                <div :class="[getFont(strTotalIncome.length)]" class="val">
                  {{ strTotalIncome }}
                </div>
              </div>
            </div>
          </div>
          <!-- 无列表数据时显示 -->
          <div class="no_data text_center" v-if="lists.length === 0">
            <img src="../assets/none.png" alt />
            <div>您当前暂无目标止盈定投</div>
            <div @click="goHistory" class="go_history">
              查看历史定投
              <img class="more" src="../assets/more.png" alt />
            </div>
          </div>
          <!-- </div> -->
          <!-- 目标盈列表 -->
          <div
            @click="goDetail(item)"
            v-for="(item, index) in nowLists"
            :key="index"
            class="list bg_white"
          >
            <div class="flex">
              <div class="name ellipsis">{{ item.prdtName }}</div>
              <div class="label" v-if="item.status && item.status.label">
                {{ item.status.label }}
              </div>
            </div>
            <div v-if="item.status" class="status flex flex_middle">
              <img v-if="item.status.img" :src="item.status.img" alt />
              <div v-if="item.status.txt">{{ item.status.txt }}</div>
            </div>
            <div class="total flex text_center">
              <div class="flex_item">
                <div class="val">{{ item.investedMoney }}</div>
                <div class="title">持仓金额</div>
              </div>
              <div class="flex_item">
                <div :class="[item.holdIncome.className]" class="val">
                  {{ item.holdIncome.val }}
                </div>
                <div class="title">当前总收益</div>
              </div>
            </div>
            <div class="yield">
              <i>目标收益率</i>
              <span>{{ item.yield }}</span>
              <i>%</i>
            </div>
            <Trend
              v-if="chartsLists[index] && !isNaN(item.yield)"
              :index="index"
              :nums="chartsLists[index].nums"
              :yield="item.yield"
              :ref="'myTrend' + index"
              :myScroll="mySwiper"
            ></Trend>
            <div v-else>
              <canvas style="display:none"></canvas>
            </div>
            <div
              v-if="chartsLists[index] && chartsLists[index].nums.length > 0"
              class="dates flex flex_middle"
            >
              <div class="flex_item">{{ chartsLists[index].date[0] }}</div>
              <div
                class="text_right flex_item"
                v-if="chartsLists[index].date.length > 1"
              >
                {{
                  chartsLists[index].date[chartsLists[index].date.length - 1]
                }}
              </div>
            </div>

            <!-- 走势图没有数据 -->
            <div
              v-if="!(chartsLists[index] && !isNaN(item.yield))"
              class="no_chart text_center"
            >
              <img src="../assets/no_chart.png" alt />
              <div>当前暂无数据，请稍后</div>
            </div>
            <!-- 走势图周期筛选 -->
            <div class="tabs flex flex_middle text_center">
              <div
                @click="toggleTrend(index, i, item)"
                :class="{ active: item.tabIndex == i }"
                v-for="(tab, i) in trendTab"
                :key="i"
                class="tab flex_item"
              >
                {{ tab }}
              </div>
            </div>
            <div
              v-if="item.tips && item.date && item.status.status === '1'"
              class="tips"
            >
              <img class="dot" src="../assets/dot.png" alt />
              {{ item.tips }}
              <span v-if="item.isIntelligent">{{ item.minMoney }}</span>
              <i v-if="item.isIntelligent">~</i>
              <span v-if="item.isIntelligent">{{ item.maxMoney }}</span>
              <span v-else>{{ item.money }}</span>
              <i>元</i>
            </div>
          </div>
          <!-- <div
            v-if="lists.length > 0 && nowPageIndex < totalPageIndex"
            class="load_more text_center swiper-slide"
          >
            {{ pullTxt[nowPullIndex] }}
          </div>-->
          <!-- 拉到最底部时显示的数据 -->
          <div v-if="lists.length > 0 && nowPageIndex >= totalPageIndex">
            <div class="last_swiper text_center">
              <div @click="goHistory" class="go_history">
                查看历史定投
                <img class="more" src="../assets/more.png" alt />
              </div>
              <div class="tips">
                自动赎回服务可能因赎回当天的净值变化引起最终到账收益偏差，且未包含手续费，止盈收益率以最终到账收益率为准。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div
        v-if="lists.length === 0 && isShowTips"
        class="footer_tips flex flex_middle"
      >
        <div>去选一支优质的定投基金</div>
        <img
          @click="isShowTips = false"
          class="close"
          src="../assets/close.png"
          alt
        />
      </div>
      <div class="flex btns text_center">
        <!-- <div @click="goRankingList" class="flex_item">新增定投</div> -->
        <div @click="goAipHome" class="flex_item">定投专区</div>
      </div>
    </footer>
  </div>
</template>
<script>
// images
import pass from '../assets/pass.png'
import pause from '../assets/pause.png'
import time from '../assets/time.png'

import base from 'base'
// web头
import NavigationBar from 'NavigationBar'
// ----components
// loading
import Waiting from '@/components/waiting/Waiting'
// ajax
import * as API from '../request/api'
// 公共方法库
import * as plugin from '@/components/Common'
// 银行相关数据
import bankdata from '@/components/bank/bankdata'
// 加载SVN JS
import loadScripts from '@/utils/loadScripts'
// 加载SVN css
import loadStyles from '@/utils/loadStyles'

// 走势图
// import Trend from '../components/Trend/Trend'
import Trend from '../components/Trend-v2/Trend'

export default {
  name: 'Home',
  metaInfo: {
    title: '我的目标盈',
  },
  components: {
    Waiting,
    Trend,
  },
  data() {
    return {
      mySwiper: null,
      // 当前分页数
      nowPageIndex: 1,
      // 分页总数
      totalPageIndex: 1,
      pullTxt: ['松开刷新', '上拉加载', '加载中...'],
      nowPullIndex: 1,
      // 是否显示loading
      isShowLoading: true,
      // 是否是ios，用于区分字体
      isIOS: false,
      // 防重复点击
      clickFlag: false,
      // 是否显示底部提示
      isShowTips: true,
      // 定投总持仓
      totalHold: '0.00',
      // 当前总收益(元)
      totalIncome: '0.00',
      // 定投数量
      totalNum: 0,
      // 定投计划列表
      lists: [],
      // 当前展示的定投计划列表
      nowLists: [],
      // 目标定投状态
      status: [
        // 目标定投已达成
        {
          img: pass,
          txt: '目标定投已达成',
        },
        // 目标定投进行中
        {
          img: time,
          txt: '定投计划进行中',
        },
        // 目标定投已暂停
        {
          img: pause,
          txt: '定投计划已暂停，可前往恢复',
        },
        // 目标定投终止中
        {
          img: pause,
          txt: '该定投计划终止中，可前往恢复',
        },
        // 目标定投已终止
        {
          img: pause,
          txt: '定投计划已终止，可前往查看持仓',
        },
      ],
      statusTxt: {
        2: '已暂停',
        3: '终止中',
        4: '已终止',
      },
      trendTab: ['近三个月', '近半年', '近一年', '成立以来'],
      chartsUrls: [],
      nowChartsUrls: [],
      chartsLists: [],
      isRefresh: false,
      isInit: false,
    }
  },
  created() {
    /* loadScripts([
      '/common/vendor/iscroll-4.2-custom/iscroll.js',
      '/common/scripts/refresh.js',
    ]).then(() => {}) */
    loadStyles(['/common/styles/refresh.css']).then(() => {})
  },
  updated() {
    /* if (this.lists.length > 0 && this.nowPageIndex >= this.totalPageIndex) {
      this.mySwiper && this.mySwiper.refresh()
    } */
  },
  computed: {
    // 总定投持仓
    strTotalHold() {
      // return plugin.thousandBitSeparator(this.totalHold)
      return this.totalHold
    },
    // 当前总收益
    strTotalIncome() {
      let join = ''
      if (this.totalIncome.replace(/,/g, '') > 0) {
        join = '+'
      }
      // return `${join}${plugin.thousandBitSeparator(this.totalIncome)}`
      return `${join}${this.totalIncome}`
    },
  },
  mounted() {
    // ios 头部状态栏文字显示黑色
    base.href('http://action:10066?isShowDarkStatusBar=1')
    this.init()
  },
  methods: {
    // ---------init
    init() {
      let _this = this
      // 是否是IOS
      _this.isIOS = base.isIOS() ? true : false
      // 初始化顶部导航
      _this.initHead()
      // 获取数据
      _this.getData()
      window.GoBackOnLoad = _this.refresh
      setTimeout(() => {
        window.TalkingData.onHTSCEvent(
          'page',
          'leaf1238',
          '1.0',
          '理财_基金定投|我的目标盈页面|0|0',
          ''
        )
      }, 1000)
    },
    refresh() {
      if (this.isInit) {
        // this.isShowLoading = true
        ajax.showLoading()
        this.isRefresh = false
        this.getData('refresh')
      }
    },
    // 初始化顶部导航
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.container',
        title: '我的目标盈',
        // 点击左上角返回，关闭当前页面，跳转到目标盈列表页
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
    // 获取列表数据
    getData(type) {
      let _this = this

      // 清空数据
      // _this.lists = []
      // _this.nowLists = []
      // _this.chartsUrls = []
      // _this.nowChartsUrls = []
      // _this.chartsLists = []
      // _this.nowPageIndex = 1
      // _this.totalPageIndex = 1

      API.getData({
        clientNo: '($account)',
        // 4-目标止盈
        investLabel: 4,
      })
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络超时，请稍后再试'
          if (code === '0') {
            let obj = data.data
            if (obj) {
              // 用户定投信息
              if (obj.userInfo) {
                // console.log(obj.userInfo)
                // 定投天数 investedDays 暂时没用到
                // 定投总持仓
                _this.totalHold = obj.userInfo.totalHold || '0.00'
                // 当前总收益(元)
                _this.totalIncome = obj.userInfo.totalIncome || '0.00'
                // 定投数量
                _this.totalNum = obj.userInfo.totalNum || 0
              }
              // 列表数据
              if (Array.isArray(obj.investList) && obj.investList.length > 0) {
                // 清空数据
                _this.lists = []
                _this.nowLists = []
                _this.chartsUrls = []
                _this.nowChartsUrls = []
                _this.chartsLists = []
                _this.nowPageIndex = 1
                _this.totalPageIndex = 1
                for (let item of obj.investList) {
                  _this.lists.push({
                    // 产品代码
                    prdtCode: item.prdtCode,
                    // 产品名称
                    prdtName: item.prdtName || '--',
                    // dtStatus - 状态 1-正常 2-暂停 3-终止 4-终止中
                    // aipAimStatus - 是否达成目标收益
                    status: _this.handleStatus(
                      item.dtStatus,
                      item.aipAimStatus,
                      item.subAccount
                    ),
                    // dtStatus: item.dtStatus,
                    // 累计定投金额
                    investedMoney: item.investedMoney || '--',
                    // 当前总收益
                    holdIncome: _this.holdIncome(item.holdIncome || '0.00'),
                    // 目标收益率
                    yield: Number(item.aipAimAmt),
                    // 走势图默认选中第一个
                    tabIndex: 0,
                    money: item.money || '--',
                    date: item.date,
                    // 07.22(星期二)从华泰账户存入
                    // <span>300.00</span>元
                    tips: _this.formatTips(
                      // 下次扣款日期
                      item.date,
                      // 下次扣款星期
                      item.week,
                      // 资金来源：1-银行卡、0-资金账户
                      item.type,
                      // 卡号
                      item.bankNum || '--',
                      // 银行编号
                      item.bankType
                    ),
                    subAccount: item.subAccount,
                    // 是否是智能定投
                    isIntelligent: item.isIntelligent,
                    // 最小金额
                    minMoney: item.minMoney || '--',
                    // 最大金额
                    maxMoney: item.maxMoney || '--',
                  })
                  _this.chartsUrls.push({
                    urls: `/reqxml?action=27401&path=/time_invest/fixed_investment_trend?type=2&clientNo=($account)&subFundAccount=${item.subAccount}&cycle=`,
                    cycle: '1',
                  })
                }
              }
              if (_this.lists.length > 0) {
                // 分页总数
                _this.totalPageIndex = Math.ceil(_this.lists.length / 2)
                // 截取前两个列表展示
                _this.nowLists = _this.lists.slice(0, 2)
                _this.nowChartsUrls = _this.chartsUrls.slice(0, 2)
                _this.getCharts()
              }
              if (!_this.mySwiper && _this.lists.length > 0) {
                _this.$nextTick(() => {
                  _this.initSwiper()
                })
              } else {
                _this.mySwiper && _this.mySwiper.refresh()
                if (type === 'refresh') {
                  _this.mySwiper && _this.mySwiper.scrollTo(0, 0)
                }
                _this.isShowLoading = false
                ajax.hideLoading()
                _this.isInit = true
                $('.loader-wrapper').hide()
              }
            }
          } else {
            alert(msg)
            _this.isShowLoading = false
            ajax.hideLoading()
            _this.isInit = true
            $('.loader-wrapper').hide()
          }
        })
        .catch((err) => {
          base.log(err)
          alert(err.ERRORMESSAGE || '网络连接失败')
          _this.isShowLoading = false
          ajax.hideLoading()
          _this.isInit = true
          $('.loader-wrapper').hide()
        })
    },
    getCharts() {
      let _this = this
      let urls = this.formatChartsUrls(this.nowChartsUrls)
      API.ajaxAll(urls).then((arr) => {
        for (let i in arr) {
          let index = (_this.nowPageIndex - 1) * 2 + Number(i)
          /* _this.chartsLists[index] = {
            nums: [],
            max: 0,
            min: 0,
          } */
          let data = plugin.StringToJSON(arr[i].BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          if (code === '0') {
            _this.isShowLoading = false
            ajax.hideLoading()
            _this.isInit = true
            $('.loader-wrapper').hide()
            // 走势图有数据
            if (Array.isArray(data.trend) && data.trend.length > 0) {
              let trendObj = {
                // 日期
                dates: [],
                // 收益率
                nums: [],
              }
              data.trend.map((item, index, arr) => {
                // 日期只需要开始 & 结尾
                if (index === 0 || index === arr.length - 1) {
                  trendObj.dates.push(item.date)
                }
                trendObj.nums.push(item.value)
              })
              _this.chartsLists[index] = {
                date: trendObj.dates,
                nums: trendObj.nums,
              }
              // 否则走势图不渲染
              _this.$forceUpdate()
            } else {
              _this.chartsLists[index] = {
                date: [],
                nums: [],
              }
              // 否则走势图不渲染
              _this.$forceUpdate()
            }
          } else {
            _this.chartsLists[index] = {
              date: [],
              nums: [],
            }
            // 否则走势图不渲染
            _this.$forceUpdate()
          }
        }
        _this.mySwiper && _this.mySwiper.refresh()
      })
    },
    formatChartsUrls(urls) {
      let url = []
      url = urls.map((item) => {
        return `${item.urls}${item.cycle}`
      })
      return url
    },
    // 初始化swiper
    initSwiper() {
      let _this = this
      /* // 初始化swiper
      loadScripts(['/common/vendor/iscroll-5.2.0/iscroll-probe.js']).then(
        () => {
          let IScroll = window.IScroll
          _this.mySwiper = new IScroll('.wrapper', {
            bounce: false,
            mouseWheel: true,
            probeType: 3,
            click: base.isIOS() ? false : true,
            preventDefault: false, //不阻止事件冒泡，解决部分手机onclick失效问题
          })
          document.addEventListener(
            'touchmove',
            function(e) {
              e.preventDefault()
            },
            false
          )
          // 如果需要上拉加载，绑定上拉加载事件
          if (
            _this.lists.length > 0 &&
            _this.nowPageIndex < _this.totalPageIndex
          ) {
            _this.bindSwiperEvent()
          }
          _this.isShowLoading = false
          ajax.hideLoading()
          _this.isInit = true
          $('.loader-wrapper').hide()
        }
      ) */
      loadScripts([
        '/common/vendor/iscroll-4.2-custom/iscroll.js',
        '/common/scripts/refresh.js',
      ]).then(() => {
        refresh.launch('.scroll', {
          //下拉相关参数,label的图标及背景色
          pullDownOptions: {
            //指定lebel加载的图片
            // img: pullImg,
            //背景色
            bgColor: '',
          },

          //上拉相关参数
          pullUpOptions: {
            //背景色
            bgColor: '',
          },
          // 下拉刷新
          pullDownAction() {},
          // 上拉加载
          pullUpAction() {
            if (_this.nowPageIndex < _this.totalPageIndex) {
              _this.nowPageIndex++
              _this.nowLists = _this.lists.slice(0, _this.nowPageIndex * 2)
              _this.nowChartsUrls = _this.chartsUrls.slice(
                _this.nowPageIndex * 2 - 2,
                _this.nowPageIndex * 2
              )
              _this.getCharts()
              _this.nowPullIndex = 1
              if (_this.nowPageIndex >= _this.totalPageIndex) {
                $('#pullUp').hide()
              }
            } else {
              $('#pullUp').hide()
            }
          },
        })
        if (_this.nowPageIndex >= _this.totalPageIndex) {
          $('#pullUp').hide()
        }
        _this.mySwiper = window.refresh.getScroll()
        _this.isShowLoading = false
        ajax.hideLoading()
        _this.isInit = true
        $('.loader-wrapper').hide()
      })
    },
    // ---------click
    // 无数据点击查看历史定投，跳转到历史定投页
    goHistory() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      base.href(
        `http://action:10090/?url=${encodeURIComponent(
          `${plugin.urls.finishedList}target`
        )}`
      )
      this.clickFlag = false
    },
    // 点击底部新增定投，跳转到定投排行榜
    goRankingList() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      base.href(plugin.urls.fundRanking)
      this.clickFlag = false
    },
    // 点击底部定投专区，跳转到定投专区
    goAipHome() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1238',
        '1.0',
        '理财_基金定投|我的目标盈页面|底部|新增定投',
        'main_enter={定投专区}'
      )
      base.href(plugin.urls.aipHome)
      this.clickFlag = false
    },
    // 上拉加载事件
    bindSwiperEvent() {
      let _this = this,
        containerHeight = 0,
        loadHeight = 0,
        isPull = false
      _this.mySwiper.on('scrollStart', () => {
        if (_this.clickFlag) {
          return
        }
        _this.clickFlag = true
        isPull = false
        loadHeight =
          document.querySelector('.load_more') &&
          document.querySelector('.load_more').clientHeight
        containerHeight =
          document.querySelector('.wrapper').clientHeight -
          document.querySelector('.scroll').clientHeight
      })
      _this.mySwiper.on('scroll', () => {
        if (_this.mySwiper.y < containerHeight + loadHeight / 2) {
          isPull = true
        } else {
          isPull = false
        }
      })
      _this.mySwiper.on('scrollEnd', () => {
        if (isPull) {
          if (_this.nowPageIndex < _this.totalPageIndex) {
            _this.nowPageIndex++
            _this.nowLists = _this.lists.slice(0, _this.nowPageIndex * 2)
            _this.nowChartsUrls = _this.chartsUrls.slice(
              _this.nowPageIndex * 2 - 2,
              _this.nowPageIndex * 2
            )
            _this.getCharts()
            _this.nowPullIndex = 1
            isPull = false
          }
        }
        setTimeout(() => {
          _this.clickFlag = false
        }, 500)
      })
    },
    // 点击跳转到定投详情页
    goDetail(item) {
      if (event.target.className.indexOf('tab') < 0) {
        if (this.clickFlag) {
          return
        }
        this.clickFlag = true
        base.href(
          `${plugin.urls.aipDetail}?prdtCode=${item.prdtCode}&subFundAccount=${item.subAccount}`
        )
        this.clickFlag = false
      }
    },
    // 点击切换走势图
    toggleTrend(index, i, item) {
      let _this = this
      if (_this.clickFlag) {
        return
      }
      _this.clickFlag = true
      // 当前tab 未选中
      if (i !== item.tabIndex) {
        item.tabIndex = i
        // 重新请求走势图
        // _this.nowChartsUrls
        this.chartsUrls[index].cycle = item.tabIndex + 1
        API.getTrend({
          type: 2,
          clientNo: '($account)',
          subFundAccount: item.subAccount,
          cycle: _this.chartsUrls[index].cycle,
        })
          .then((res) => {
            _this.chartsLists[index] = {
              nums: [],
            }
            // 否则走势图不渲染
            _this.$forceUpdate()
            let data = plugin.StringToJSON(res.BINDATA)
            let code = data.code,
              msg = data.msg || '网络连接失败！'
            if (code === '0') {
              // 走势图有数据
              if (Array.isArray(data.trend) && data.trend.length > 0) {
                let trendObj = {
                  // 日期
                  dates: [],
                  // 收益率
                  nums: [],
                  // 最大值
                  max: 0,
                  // 最小值
                  min: 0,
                }
                data.trend.map((item, index, arr) => {
                  // 日期只需要开始 & 结尾
                  if (index === 0 || index === arr.length - 1) {
                    trendObj.dates.push(item.date)
                  }
                  trendObj.nums.push(item.value)
                })
                trendObj.max = Math.max.apply(null, trendObj.nums)
                trendObj.min = Math.min.apply(null, trendObj.nums)
                if (trendObj.min == trendObj.max) {
                  trendObj.max = trendObj.min + 100
                }
                _this.chartsLists[index] = {
                  date: trendObj.dates,
                  nums: trendObj.nums,
                }
              }
              // 否则走势图不渲染
              _this.$forceUpdate()
              if (
                _this.$refs[`myTrend${index}`] &&
                _this.$refs[`myTrend${index}`][0]
              ) {
                _this.$refs[`myTrend${index}`][0].dates =
                  _this.chartsLists[index].dates
                _this.$refs[`myTrend${index}`][0].nums =
                  _this.chartsLists[index].nums
                _this.$refs[`myTrend${index}`][0].changeTrend()
              }
            }
            _this.clickFlag = false
          })
          .catch((err) => {
            base.log(err)
            _this.clickFlag = false
          })
      } else {
        _this.clickFlag = false
      }
    },
    // ---------plugin
    // 字体大小缩放
    getFont(len) {
      let font = ''
      if (len >= 9) {
        font = 'f18'
      }
      if (len >= 14) {
        font = 'f16'
      }
      return font
    },
    // 处理当前定投状态
    handleStatus(dtStatus, aipAimStatus, subAccount) {
      let obj = {}
      obj.label = ''
      // dtStatus - 状态 1-正常 2-暂停 3-终止中 4-终止
      // aipAimStatus - 是否达成目标收益
      // 未达成目标收益，显示状态
      if (!aipAimStatus && dtStatus) {
        obj = Object.assign({}, this.status[dtStatus])
      }
      // 已达成目标收益，显示已达成+状态标签
      if (aipAimStatus) {
        obj = Object.assign({}, this.status[0])
        if (this.statusTxt[dtStatus]) {
          obj = Object.assign({}, obj, { label: this.statusTxt[dtStatus] })
          // obj.label = this.statusTxt[dtStatus]
        }
      }
      obj.status = dtStatus
      obj = JSON.stringify(obj)
      return JSON.parse(obj)
    },
    // 处理当前总收益
    holdIncome(income) {
      let className = '',
        num = '',
        len = income.length
      if (income > 0) {
        ;(className = 'red'), (num = `+${income}`)
      } else {
        num = income
        if (income < 0) {
          className = 'green'
        }
      }
      return {
        val: num,
        className: className,
      }
    },
    // 处理计划底部提示 07.22(星期二)从华泰账户存入
    formatTips(date, week, type, bankNum, bankType) {
      let str = ''
      // 1-银行卡、0-资金账户
      if (type === '1') {
        let bankObj = bankdata.getDataByCode(bankType)
        if (bankObj && bankObj.name) {
          str = `${bankObj.name}(${bankNum.substr(-4)})`
        }
      } else {
        str = '华泰账户'
      }
      return `${date}(${week})从${str}存入`
    },
  },
}
</script>
<style lang="less">
@import '../../../components/navigation-bar/navigation-bar.css';
@import '../../../components/Common.less';
@import './Home.less';
</style>
