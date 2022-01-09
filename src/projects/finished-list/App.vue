<template>
  <div id="app">
    <waiting v-show="isShowLoading"></waiting>
    <div class="container">
      <div class="wrapper">
        <div
          :style="{ minHeight: minHeight }"
          class="cards"
          v-if="lists.length > 0"
        >
          <div
            @click="goDetail(index)"
            v-for="(item, index) in lists"
            :key="index"
            class="card"
          >
            <div class="top flex">
              <div class="name ellipsis">{{ item.name }}</div>
              <div
                v-for="(tag, i) in lists[index].tagList"
                :key="i"
                class="label"
              >
                {{ tag }}
              </div>
            </div>
            <div class="bottom flex">
              <div class="flex_item">
                <div class="title">累计定投(元)</div>
                <div class="val">{{ item.invest }}</div>
              </div>
              <div class="text_right">
                <div class="title">累积收益(元)</div>
                <div class="val">{{ item.income }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          :style="{ minHeight: minHeight }"
          v-else
          class="no_data text_center"
        >
          <img src="./assets/none.png" alt />
          <div>暂无历史定投计划</div>
        </div>
        <footer class="footer_tip">
          <!-- 历史定投：包含2020年10月22日之前创建并终止的定投计划以及该日期之后创建并终止且清仓的定投计划。 -->
          温馨提示：
          <br />
          1、历史定投：包括2020年X月X日之前创建并终止的定投计划以及该日期之后创建并终止且清仓的定投计划。
          <br />
          2、2020年X月X日前终止的定投，不提供累积收益数据参考。
          <br />
          3、以上数据仅供参考，请投资者以账户实际定投情况为准。
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
// ---plugin
import base from 'base'
import ajax from 'ajax'
// -----------ajax
// 获取已完结定投列表
import { getData } from './request/api'
// ----components
// web头
import NavigationBar from 'NavigationBar'
// loading
import Waiting from '@/components/waiting/Waiting'
import * as plugin from '@/components/Common'

export default {
  name: 'App',
  // title
  metaInfo: {
    title: '历史定投',
  },
  components: {
    Waiting,
  },
  data() {
    return {
      isShowLoading: true,
      lists: [],
      // form = target 目标盈
      from: base.getUrlParameter('from'),
      clickFlag: false,
      minHeight: '0px',
    }
  },
  mounted() {
    // 白头要显示wifi和电量图表
    base.href('http://action:10066?isShowDarkStatusBar=1')
    this.init()
  },
  methods: {
    init() {
      this.initHead()
      this.initData()
      this.initHeight()
    },
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.container',
        title: '历史定投',
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
    initData() {
      let _this = this
      _this.lists = []
      getData({
        // 是否为目标盈
        investLabel: _this.from === 'target' ? '4' : '',
      })
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          if (code === '0') {
            let arr = data.data
            if (Array.isArray(arr) && arr.length > 0) {
              for (let item of arr) {
                _this.lists.push({
                  // 产品代码
                  code: item.prdtCode || '',
                  //  产品名称
                  name: item.prdtName || '--',
                  // 产品id
                  id: item.prdtId || '',
                  // 累计定投
                  invest: item.accInvest || '0.00',
                  // 累计收益
                  income: item.accIncome || '0.00',
                  // 标签
                  tagList: item.tagList,
                  // 子账户
                  sub: item.subAccount || '',
                })
              }
            }
          } else {
            alert(msg)
          }
          _this.isShowLoading = false
          $('.loader-wrapper').hide()
        })
        .catch((err) => {
          alert(err.ERRORMESSAGE || '网络连接失败！')
          _this.isShowLoading = false
          $('.loader-wrapper').hide()
        })
    },
    initHeight() {
      let _this = this
      this.$nextTick(() => {
        _this.minHeight =
          document.querySelector('body').clientHeight -
          document.querySelector('.navigation-bar').clientHeight +
          'px'
      })
    },
    goDetail(index) {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      let item = this.lists[index]
      base.href(
        `${plugin.urls.aipDetail}?prdtCode=${item.code}&subFundAccount=${item.sub}`
      )
      this.clickFlag = false
    },
  },
}
</script>
<style lang="less">
@import '../../components/navigation-bar/navigation-bar.css';
@import '../../components/Common.less';
@import './App.less';
</style>
