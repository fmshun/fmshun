<template>
  <div id="success">
    <!-- loading -->
    <waiting v-show="!isWeChat && !isRecommend"></waiting>
    <div :class="{ ios: isIOS }" class="container success_container">
      <div class="wrapper fixed">
        <div class="success_top bg_white text_center">
          <img class="img" src="../assets/success.png" alt />
          <div class="title">目标盈定投设置成功</div>
          <p class="infos">{{ cycleInfo }}转入{{ balance }}元</p>
          <p class="tip">如遇非交易日顺延，扣款当日请保持账户资金充足</p>
        </div>
        <div class="success_center bg_white">
          <div class="flex flex_middle">
            <div class="title">定投产品：</div>
            <div class="val flex_item text_right">{{ prdtName }}</div>
          </div>
          <div class="flex flex_middle">
            <div class="title flex_item">转入方式：</div>
            <div class="val text_right">
              <Bank
                class="value bank"
                ref="bankRef"
                v-if="transferInType === 'bank'"
                :bankCode="bankNo"
                :bankNum="bankCard"
              ></Bank>
              <div v-else class="htsc flex flex_middle">
                <img src="../../../components/edit-aip/images/htsc-logo.png" />
                <span>华泰账户</span>
              </div>
            </div>
          </div>
          <div class="flex flex_middle">
            <div class="title">目标止盈</div>
            <div class="val flex_item text_right">
              达到{{ aim }}%{{ formatAimNext }}
            </div>
          </div>
        </div>
        <!-- 微信提醒展示 -->
        <div @click="goWeChat" v-if="isShowWeChat" class="wechat-wrapper">
          <p class="desc">设置微信提醒</p>
          <div class="btn-go">
            <span>去设置</span>
          </div>
        </div>
        <!-- 广告 -->
        <div v-if="adsPicUrl && adsLinkUrl" class="ads-wrapper">
          <img @click="goAds" :src="adsPicUrl" alt />
        </div>
      </div>
    </div>
    <footer @click="back" class="text_center">
      <div class="text_center">确定</div>
    </footer>
  </div>
</template>
<script>
import normalBanner from '../../edit-result-success/images/banner.png'
// ----SVN公共方法
import base from 'base'
// web头
import NavigationBar from 'NavigationBar'
// ----components
import Waiting from '@/components/waiting/Waiting'
// 银行logo等
import Bank from '@/components/bank/Bank'
// 公共方法库
import * as plugin from '@/components/Common'
// xml 转 json
import X2JS from '@/utils/xml2json'
import * as API from '../request/api'
export default {
  name: 'Fail',
  metaInfo: {
    title: '目标盈定投',
  },
  components: {
    Waiting,
    Bank,
  },
  data() {
    return {
      // 是否显示loading
      //   isShowLoading: true,
      isShowLoading: false,
      // 防重复点击
      clickFlag: false,
      // 是否是IOS
      isIOS: false,
      cycleInfo: '',
      prdtName: '',
      transferInType: '',
      aim: '',
      aimNext: '',
      balance: '',
      bankNo: '',
      bankCard: '',
      adsPicUrl: normalBanner,
      adsLinkUrl: '',
      // 是否显示微信提醒
      isShowWeChat: false,
      isWeChat: false,
      isRecommend: false,
    }
  },
  computed: {
    formatAimNext() {
      return plugin.stopParamInfos[this.aimNext] || ''
    },
  },
  created() {
    // 获取router传参
    this.getRouterData()
  },
  mounted() {
    // 初始化
    this.init()
  },
  methods: {
    // 获取router传参
    getRouterData() {
      // /:cycleInfo/:prdtName/:transferInType/:aim/:aimNext/:balance/:bankNo/:bankCard

      // 定投周期
      this.cycleInfo = decodeURIComponent(this.$route.params.cycleInfo || '--')
      // 产品名称
      this.prdtName = decodeURIComponent(this.$route.params.prdtName || '--')
      // 转入方式 'bank'-银行卡
      this.transferInType = this.$route.params.transferInType
      if (this.transferInType === 'bank') {
        this.bankNo = this.$route.params.bankNo
        this.bankCard = this.$route.params.bankCard
      }
      //
      this.aim = this.$route.params.aim
      //
      this.aimNext = this.$route.params.aimNext
      // 定投金额
      this.balance = this.$route.params.balance
    },
    // ----------初始化
    init() {
      // 是否是IOS，区分样式
      this.isIOS = base.isIOS() ? true : false
      // 初始化web头
      this.initHead()
      // 获取微信相关信息
      this.getWechatBind()
      // 获取广告推荐栏信息
      this.getRecommend()
      let _this = this
      // 返回刷新，校验微信绑定
      window.GoBackOnLoad = () => {
        _this.getWechatBind()
      }
    },
    // 初始化web头
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.success_container',
        title: '定投设置结果',
        // 点击左上角返回，关闭当前页面，跳转到目标盈列表页
        leftEvent() {
          if (_this.clickFlag) {
            return
          }
          _this.clickFlag = true
          base.href(
            `http://action:1965/?url=${encodeURIComponent(
              plugin.urls.targetList
            )}`
          )
          _this.clickFlag = false
        },
      })
    },
    // 获取微信相关信息
    getWechatBind() {
      let _this = this
      API.isWechatBind()
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
          _this.isWeChat = true
        })
        .catch((err) => {
          _this.isShowWeChat = true
          _this.isWeChat = true
        })
    },
    // 获取广告推荐栏信息
    getRecommend() {
      let _this = this
      API.getRecommend()
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code
          if (code === '0') {
            _this.adsPicUrl = data.picUrl || normalBanner
            _this.adsLinkUrl = data.linkUrl || ''
          }
          _this.isRecommend = true
        })
        .catch((err) => {
          base.log(err)
          _this.isRecommend = true
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
    // 点击跳转到广告连接
    goAds() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      base.href(this.adsLinkUrl)
      this.clickFlag = false
    },
    back() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      base.href(
        `http://action:1965/?url=${encodeURIComponent(plugin.urls.targetList)}`
      )
      this.clickFlag = false
    },
  },
}
</script>
<style lang="less">
@import '../../../components/navigation-bar/navigation-bar.css';
@import '../../../components/Common.less';
@import './Success.less';
</style>
