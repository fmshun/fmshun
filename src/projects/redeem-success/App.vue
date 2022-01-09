<template>
  <div id="app">
    <waiting v-show="isShowLoading"></waiting>
    <div class="container">
      <div class="wrapper fixed">
        <div class="top bg_white">
          <img class="success" src="./assets/icon.png" alt />
          <div class="title text_center">赎回申请已提交</div>
          <div class="info_list">
            <div class="flex">
              <div class="info_title">产品名称：</div>
              <div class="flex_item text_right">{{ name }}</div>
            </div>
            <div class="flex">
              <div class="info_title">赎回份额：</div>
              <div class="flex_item text_right">{{ formatShares }}份</div>
            </div>
          </div>
          <div class="time_list">
            <div class="flex">
              <div class="flex_item">
                <div class="time_title">订单申请已提交</div>
                <div class="time">{{ redeemDate }}</div>
              </div>
              <div class="flex_item text_center">
                <div class="time_title">份额确认</div>
                <div class="time">预计{{ confirmDayOfRede }}</div>
              </div>
              <div class="flex_item text_right">
                <div class="time_title">资金可取</div>
                <div class="time">预计{{ settlementDayOfRede }}</div>
              </div>
            </div>
            <img class="progress" src="./assets/progress.png" alt />
            <div class="tips">
              以上展示的时间节点仅供参考，具体以实际确认、到账时间为准。如遇问题可通过95597或在线客服进行咨询
            </div>
          </div>
        </div>
        <div @click="goWeChat" v-if="isShowWeChat" class="wechat flex bg_white">
          <div class="flex_item">设置微信提醒</div>
          <img class="set" src="./assets/set.png" alt />
        </div>
      </div>
    </div>

    <div :class="{ iphoneX: isIphoneX }" class="resButton text_center">
      <div @click="confirm">
        <span>确认</span>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import Waiting from '@/components/waiting/Waiting'
import * as plugin from '@/components/Common'
// web头
import NavigationBar from 'NavigationBar'
// xml 转 json
import X2JS from '../../utils/xml2json'
import { successInfo, isWechatBind } from './request/api'
export default {
  name: 'App',
  metaInfo: {
    title: '赎回结果',
  },
  components: {
    Waiting,
  },
  data() {
    return {
      // 产品名称
      name: decodeURIComponent(base.getUrlParameter('name') || '--'),
      // 产品代码
      code: base.getUrlParameter('code'),
      // 赎回份额
      shares: base.getUrlParameter('shares') || '0.00',
      // 订单号
      allotno: base.getUrlParameter('order'),
      isShowLoading: true,
      isIphoneX: base.isIphoneX(),
      // 赎回日期
      redeemDate: '--',
      // 确认卖出资金日
      confirmDayOfRede: '--',
      // 资金到账日
      settlementDayOfRede: '--',
      // 是否显示微信提醒
      isShowWeChat: false,
      clickFlag: false,
    }
  },
  computed: {
    // 1234->1,234
    formatShares() {
      return plugin.thousandBitSeparator(this.shares)
    },
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    this.initHead()
    // 获取页面相关信息
    this.getInfo()
    // 获取微信相关信息
    this.getWechatBind()
    let _this = this
    // 返回刷新，校验微信绑定
    window.GoBackOnLoad = () => {
      _this.getWechatBind()
    }
    setTimeout(() => {
      window.TalkingData.onHTSCEvent(
        'page',
        'leaf1215',
        '1.0',
        '理财_基金定投|赎回结果页面|0|0',
        'condition={成功}'
      )
    }, 1000)
  },
  methods: {
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.container',
        title: '赎回结果',
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
    // 获取页面相关信息
    getInfo() {
      let _this = this
      successInfo({
        // 订单号
        allotno: _this.allotno,
        // 是否预约赎回 0-否 1-是
        appointmentFlag: 0,
        // 产品代码
        fundCode: _this.code,
      })
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          if (code === '0') {
            let result = data.resultData
            // 赎回类型 1-单笔立即赎回 2-单笔预约赎回 3-混合赎回
            // _this.applyRedeemType = result.applyRedeemType
            _this.redeemDate = _this.formateDate(
              result.list[0].redeemDate,
              false
            )
            _this.confirmDayOfRede = _this.formateDate(
              result.list[0].confirmDayOfRede,
              true
            )
            _this.settlementDayOfRede = _this.formateDate(
              result.list[0].settlementDayOfRede,
              true
            )
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
    // 获取微信相关信息
    getWechatBind() {
      let _this = this
      isWechatBind('')
        .then((res) => {
          let obj = new X2JS().xml_str2json(res.BINDATA).response,
            code = obj.flag._code,
            msg = obj.flag._msg || '网络超时，请稍后再试',
            weakValue = ''
          if (code === '0') {
            if (obj.resultData) {
              if (
                obj.resultData.registerAccount &&
                obj.resultData.registerAccount._authValue
              ) {
                weakValue = obj.resultData.registerAccount._authValue
              }
            }
            _this.isShowWeChat = weakValue ? false : true
          } else if (code === '-201') {
            // 未登录
            _this.isShowWeChat = true
          } else if (code === '-2700') {
            _this.isShowWeChat = true
          } else {
            _this.isShowWeChat = true
          }
        })
        .catch((err) => {
          _this.isShowWeChat = true
        })
    },
    // 点击跳转到微信设置页
    goWeChat() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      base.href(plugin.urls.weChat)
      this.clickFlag = false
    },
    // 点击底部确认，关闭当前页面
    confirm() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1215',
        '1.0',
        '理财_基金定投|赎回结果页面|底部|确认',
        'condition={成功}'
      )
      setTimeout(() => {
        base.href('http://action:3413')
      }, 500)
      this.clickFlag = false
    },
    // 格式化日期
    formateDate(date, isSub) {
      let format = ''
      if (!date || date.length !== 10) {
        format = '--'
      } else {
        if (isSub) {
          format = date.substr(5, 5)
        } else {
          format = date
        }
      }
      return format
    },
  },
}
</script>
<style lang="less">
// 顶部导航
@import '../../components/navigation-bar/navigation-bar.css';
@import '../../components/Common.less';
@import './App.less';
</style>
