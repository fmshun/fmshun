// 智能定投 from=1, 目标盈 from=2, 其他默认为普通定投
<template>
  <div id="use-nav-top-app" class="edit-result-success">
    <!-- <waiting v-show="showWaiting"></waiting> -->
    <navtop title="定投设置结果"></navtop>
    <!-- 智能定投 -->
    <div class="top-wrapper" v-if="from == 1">
      <img v-if="isTarget" src="./images/icon1.png" alt class="success" />
      <img v-else src="./images/icon.png" alt class="success" />
      <p v-if="isTarget" class="l1">目标盈定投设置成功</p>
      <p v-else class="l1">{{ setPageTitle || '智能定投设置成功' }}</p>
      <p class="l2">
        {{ cycleInfo }}转入{{ minDeduction }}～{{ maxDeduction }}元
      </p>
      <p class="l3" v-if="transferInType === 'bank'">
        如遇非交易日顺延，扣款当日请保持银行卡资金充足
      </p>
      <p class="l3" v-else>如遇非交易日顺延，扣款当日请保持账户资金充足</p>
    </div>
    <!-- 目标盈 -->
    <!-- <div class="top-wrapper" v-else-if="from == 2">
      <img src="./images/icon1.png" alt class="success" />
      <p class="l1">目标盈定投设置成功</p>
      <p class="l2">{{ cycleInfo }}转入{{ balance }}元</p>
      <p class="l3" v-if="transferInType === 'bank'">
        如遇非交易日顺延，扣款当日请保持银行卡资金充足
      </p>
      <p class="l3" v-else>如遇非交易日顺延，扣款当日请保持账户资金充足</p>
    </div>-->
    <!-- 普通定投 -->
    <div class="top-wrapper" v-else>
      <img v-if="isTarget" src="./images/icon1.png" alt class="success" />
      <img v-else src="./images/icon.png" alt class="success" />
      <p v-if="isTarget" class="l1">目标盈定投设置成功</p>
      <p v-else class="l1">{{ setPageTitle || '定投设置成功' }}</p>
      <p class="l2">{{ cycleInfo }}转入{{ balance }}元</p>
      <p class="l3" v-if="transferInType === 'bank'">
        如遇非交易日顺延，扣款当日请保持银行卡资金充足
      </p>
      <p class="l3" v-else>如遇非交易日顺延，扣款当日请保持账户资金充足</p>
    </div>
    <div class="content-wrapper">
      <div>
        <span class="left">定投产品：</span>
        <span class="right">{{ prdtName }}</span>
      </div>
      <div>
        <span class="left">转入方式：</span>
        <span class="right">
          <Bank
            class="value flex_item text_right bank"
            ref="bankRef"
            v-if="transferInType === 'bank'"
            :bankCode="bankNo"
            :bankNum="bankCard"
          ></Bank>
          <span class="value flex_item text_right htsc" v-else>
            <img src="./images/htsc-logo.png" />
            <span>华泰账户</span>
          </span>
        </span>
      </div>
      <div v-if="bOnStopParam == 1">
        <span class="left">目标止盈:</span>
        <span class="right">达到{{ aim }}%{{ aimNext }}</span>
      </div>
    </div>
    <!-- 微信提醒展示 -->
    <div class="wechat-wrapper" v-if="wechatNeedBind">
      <p class="desc">设置微信提醒</p>
      <div class="btn-go">
        <div>去设置</div>
      </div>
    </div>
    <!-- 广告 -->
    <div class="ads-wrapper rel" v-show="adsLinkUrl != '' && adsPicUrl != ''">
      <img :src="adsPicUrl" alt :url="adsLinkUrl" @click="clickAds" />
    </div>

    <div :class="{ blue: isTarget }" class="resButton rel">
      <div @click="closeHandler">
        <span>{{ from == 2 ? '确定' : '确认' }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import VueMeta from 'vue-meta'
import base from 'base'
import ajax from 'ajax'
// import Waiting from '@/components/waiting/Waiting'
import navtop from '@/components/nav-top/nav-top'
// 银行logo等
import Bank from '@/components/bank/Bank'
import { stopParamInfos } from '@/components/Common'
export default {
  name: 'App',
  data() {
    return {
      setPageTitle: base.getUrlParameter('setPageTitle')
        ? decodeURIComponent(base.getUrlParameter('setPageTitle'))
        : '', //设置页面话术
      prdtCode: base.getUrlParameter('productCode'), //产品代码
      prdtName: decodeURIComponent(base.getUrlParameter('prdtName')), //产品名称
      orderNo: base.getUrlParameter('orderNo'), //订单号
      cycleInfo: base.getUrlParameter('cycleInfo')
        ? decodeURIComponent(base.getUrlParameter('cycleInfo'))
        : '',
      balance: base.getUrlParameter('balance') || '', //金额
      maxDeduction: base.getUrlParameter('maxDeduction') || '',
      minDeduction: base.getUrlParameter('minDeduction') || '',
      wechatNeedBind: true, //有无设置微信提醒, 默认需要绑定
      // 来源 1-智能 2-目标盈
      from: base.getUrlParameter('from'),
      transferInType: base.getUrlParameter('transferInType'),
      // 银行代码
      bankNo: base.getUrlParameter('bankNo'),
      // 银行卡号
      bankCard: base.getUrlParameter('bankCard'),
      bOnStopParam: base.getUrlParameter('bOnStopParam'),
      aim: base.getUrlParameter('aim'),
      aimNext: base.getUrlParameter('aimNext')
        ? stopParamInfos[base.getUrlParameter('aimNext')]
        : '',
      adsPicUrl: './images/banner.png',
      adsLinkUrl: '',
      isTarget: base.getUrlParameter('isTarget') === '1' ? true : false,
    }
  },
  components: {
    // Waiting,
    Bank,
    navtop,
  },
  metaInfo: {
    title: '定投设置结果',
  },
  computed: {
    way: function() {
      if (this.from == '1') {
        return '智能定投'
      }
      return '普通定投'
    },
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    let _this = this
    _this.$nextTick(function() {
      $('.loader-wrapper').hide()
      if (base.isIphoneX()) {
        $('.resButton').addClass('iphoneX')
      }
      if (window.outerHeight <= 667) {
        $('.resButton').removeClass('rel')
        $('.ads-wrapper').removeClass('rel')
      }
      setTimeout(function() {
        if (_this.isTarget) {
          window.TalkingData.onHTSCEvent(
            'page',
            'leaf1243',
            '1.0',
            '理财_基金定投|新增目标盈结果页面|0|0',
            'result={成功}'
          )
        } else {
          window.TalkingData.onHTSCEvent(
            'page',
            'leaf1159',
            '1.0',
            '理财_基金定投|定投结果页面|0|0',
            'way={' + _this.way + '}|condition={成功}'
          )
        }
      }, 1000)
    })
    $.when(
      _this.wechatBind($.Deferred()),
      _this.getRecommend($.Deferred())
    ).done(function() {
      _this.bindEvent()
    })

    window.GoBackOnLoad = function() {
      ajax.showLoading()
      $.when(
        _this.wechatBind($.Deferred()),
        _this.getRecommend($.Deferred())
      ).done(function() {
        ajax.hideLoading()
      })
    }
  },
  methods: {
    bindEvent() {
      let _this = this
      //微信消息提醒 - 去设置
      $('.btn-go')
        .unbind()
        .bind('click', function() {
          if (_this.flag) {
            return
          }
          _this.flag = true
          setTimeout(function() {
            _this.flag = false
          }, 1000)
          // 微信绑定跳转链接地址
          base.href(
            'http://action:10092/?url=http%3a%2f%2faction%3a10061%2f%3ffullscreen%3d1%26%26type%3d9%26%26url%3d%2fzlcftajax%2fwechat-bind%2fmain.htm'
          )
        })
    },
    /**
     * 查询弱账号是否绑定公众号
     */
    wechatBind(dtd) {
      let _this = this
      // ajax里会判断弱账户登录，未登录错误码-201，直接跳转了65007
      ajax.run(
        '/reqxml?action=27006&path=/3g/weixin/push/query_user_bindInfo?uid=($weakaccount)&wtoken=($weaktoken)',
        '',
        function(xml) {
          var $data = $(xml.BINDATA)
          var code = $data.find('flag').attr('code')
          var msg = $data.find('flag').attr('msg') || '网络超时，请稍后再试'
          var weakValue = $data.find('registerAccount').attr('authValue')
          var clientValue = $data.find('clientNo').attr('authValue')
          if (code === '0') {
            /* <response><flag code="0" msg="success"/>
                           <resultData><registerAccount/><clientNo/></resultData></response> */
            if (weakValue) {
              //弱账号已绑定公众号
              _this.wechatNeedBind = false
            } else {
              _this.wechatNeedBind = true
            }
          } else if (code === '-201') {
            // <flag code="-201" msg="wtoken error"/></response>
            // 未登录
            _this.wechatNeedBind = true
          } else if (code === '-2700') {
            _this.wechatNeedBind = true
          } else {
            _this.wechatNeedBind = true
            //alert(msg);
          }
          dtd.resolve()
        },
        function(msg) {
          //alert(msg.ERRORMESSAGE || '网络连接失败');
          _this.wechatNeedBind = true
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    // 在本页面最后方增加运营banner配置功能，后台可在定投计划结果页面配置一个图片+链接；
    getRecommend(dtd) {
      let _this = this
      var url = '/reqxml?action=27401&path=/time_invest/advertise_info'
      ajax.run(
        url,
        '',
        function(data) {
          //   let test = {
          //     "picUrl":"http://s3.cn-north-1.amazonaws.com.cn/cft-3g-test/cft/picture/20200615/202006151592206974086.png",
          //     "linkUrl":"https://www.baidu.com/",
          //     "code":"0",
          //     "msg":"success"
          //   }

          if (data.BINDATA) {
            var oData
            try {
              oData = JSON.parse(data.BINDATA)
            } catch (err) {
              oData = {}
            }

            var code = oData.code
            var msg = oData.msg || '网络超时，请稍后确认您的订单信息'
            var url = ''
            if (code == 0) {
              if (oData.picUrl && oData.linkUrl) {
                _this.adsPicUrl = oData.picUrl
                _this.adsLinkUrl = oData.linkUrl
              }
            }
          }
          dtd.resolve()
        },
        function(data) {
          ajax.hideLoading()
          alert(data.ERRORMESSAGE || '网络连接失败')
          dtd.resolve()
        }
      )
      return dtd.promise()
    },
    clickAds: function(e) {
      let url = $(e.target).attr('url')
      base.href(url)
    },
    closeHandler() {
      if (this.isTarget) {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1243',
          '1.0',
          '理财_基金定投|新增目标盈结果页面|底部|确定',
          'result={成功}'
        )
      } else {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf1159',
          '1.0',
          '理财_基金定投|定投结果页面|底部|确认',
          'way={' + this.way + '}|condition={成功}'
        )
      }
      let _this = this
      setTimeout(function() {
        let url = ''
        if (_this.isTarget) {
          // 点击确认跳转至目标赢列表页面
          url = `http://action:1964/?url=${encodeURIComponent(
            'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/target-list-v2.html'
          )}`
          base.href(url)
        } else {
          // 点击确认跳转至我的定投列表页面
          url = `http://action:1965/?url=${encodeURIComponent(
            'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/account-holding/my-aip.html'
          )}`
          base.href(url)
        }
      }, 100)
    },
  },
}
</script>
<style lang="less">
@import './App.less';
</style>
