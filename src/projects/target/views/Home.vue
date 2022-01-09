<template>
  <div id="target-home">
    <div :class="[fontClass]" class="container target_container">
      <div class="wrapper fixed">
        <div class="wrapper_contaniner">
          <!-- 卡片区域 -->
          <div class="card">
            <div class="title text_center">
              <span>滑动设定目标收益率</span>
            </div>
            <!-- 滑动选择收益率 -->
            <Rule
              ref="myRule"
              :isHome="true"
              :initYield="yieldNum"
              :min="min"
              :max="max"
            ></Rule>
            <!-- <Rule
              ref="myRule"
              :isHome="true"
              :initYield="yieldNum"
              :min="min"
              :max="max"
            ></Rule>-->
            <!-- 定投产品 -->
            <div class="product_container">
              <div class="product_title">定投产品:</div>
              <div @click="goSearch" class="product_select">
                <div
                  :class="{ no_popular: !(prdtCode == firstCode) }"
                  class="product_selected flex flex_middle"
                >
                  <div class="name ellipsis flex_item">{{ prdtName }}</div>
                  <img class="more" src="../assets/more.png" alt />
                </div>
              </div>
              <div class="warning_tips">
                风险提示：收益率随市场波动，基金产品可能出现亏损。止盈未包含手续费，止盈收益率以最终到账收益率为准。目标收益率不代表对收益的承诺或保证。
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer @click="nextStep" class="text_center">
        <div>下一步</div>
      </footer>
    </div>
  </div>
</template>

<script>
import base from 'base'
import local from 'local'
// ----SVN公共方法
// web头
import NavigationBar from 'NavigationBar'
// 公共方法库
import * as plugin from '@/components/Common'
// 收益率标尺
import Rule from '@/components/rule/Rule'
// import Rule from '@/components/rule-v2/Rule'
// ajax
import * as API from '../request/api'

export default {
  name: 'home',
  data() {
    return {
      // 防重复点击
      clickFlag: false,
      // 字体样式class
      fontClass: '',
      // ------收益率相关
      // 目标收益率
      yieldNum: base.getUrlParameter('yield') || 10,
      // 标尺最小值
      min: 4,
      // 标尺最大值
      max: 100,
      // ------产品相关
      // 产品代码
      prdtCode: base.getUrlParameter('code') || '',
      // 产品id
      prdtId: base.getUrlParameter('prdtId') || '',
      // 产品名称
      prdtName: decodeURIComponent(base.getUrlParameter('name') || ''),
      // 人气定投第一个产品
      firstCode: '',
      firstId: '',
      firstName: '',
      isPopular: true,
      // 是否已登录
      isLogin: false,
    }
  },
  components: {
    Rule,
  },
  created() {
    // 动态加载js库-点击下一步，预检查定投需要
    this.$loadScripts([
      '/common/vendor/md5-2.11.0/md5.js',
      '/common/vendor/flexible-0.3.2/flexible.js',
      '/licai/com/component/js/antiMoneyLaundering.js',
      '/licai/com/component/js/layer.js',
      '/licai/com/js/buy-process-v3.js',
      '/licai/com/js/quick-buy-alter.js',
    ]).then(() => {})
  },
  mounted() {
    // 初始化
    this.init()
    setTimeout(() => {
      window.TalkingData.onHTSCEvent(
        'page',
        'leaf1239',
        '1.0',
        '理财_基金定投|新增主页页面|0|0',
        ''
      )
    }, 1000)
  },
  methods: {
    // ----------初始化
    init() {
      // 是否是IOS，区分样式
      this.fontClass = base.isIOS() ? 'ios' : 'andriod'
      // 初始化web头
      this.initHead()
      // 获取登录状态
      this.getLogin()
      // 获取人气定投第一个产品
      this.getData()
      // 绑定登录后返回事件
      window.CheckLogin = this.checkLogin
      // 绑定返回刷新事件
      window.GoBackOnLoad = this.refresh
    },
    // 初始化web头
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.target_container',
        title: '',
        // 点击左上角返回，关闭当前页面
        leftEvent() {
          if (_this.clickFlag) {
            return
          }
          _this.clickFlag = true
          base.href('http://action:3413')
          _this.clickFlag = false
        },
        // 右上角标题
        rightTitle: '我的目标盈',
        // 右上角点击事件-跳转到目标盈列表页
        rightEvent() {
          if (_this.clickFlag) {
            return
          }
          _this.clickFlag = true
          window.TalkingData.onHTSCEvent(
            'click',
            'leaf1239',
            '1.0',
            '理财_基金定投|新增主页页面|顶部|我的目标盈',
            ''
          )
          base.href(plugin.urls.targetList)
          _this.clickFlag = false
        },
      })
    },
    // 获取登录状态
    getLogin() {
      let _this = this
      // 获取登录状态
      API.getLogin()
        .then((res) => {
          // 登录状态
          _this.isLogin = res.JYLOGINFLAG > 1 ? true : false
        })
        .catch((err) => {
          _this.isLogin = false
          base.log(err.ERRORMESSAGE)
        })
    },
    // 获取人气定投第一个产品
    getData() {
      let _this = this
      API.getProduct()
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          if (code === '0') {
            if (data.resultData && data.resultData[0]) {
              let obj = data.resultData[0]
              _this.firstCode = obj.prdtCode
              _this.firstId = obj.prdtId
              _this.firstName = obj.name || '--'
              // 来源页没有传参，默认则展示人气定投第一个产品
              if (!_this.prdtCode && !_this.prdtId) {
                _this.prdtCode = _this.firstCode
                _this.prdtId = _this.firstId
                _this.prdtName = _this.firstName
              }
            }
          } else {
            alert(msg)
          }
          $('.loader-wrapper').hide()
        })
        .catch((err) => {
          $('.loader-wrapper').hide()
          alert(err.ERRORMESSAGE || '网络连接失败！')
        })
    },
    // 点击产品卡片，跳转到产品搜索页
    goSearch() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1239',
        '1.0',
        '理财_基金定投|新增主页页面|底部|定投产品按钮',
        `automatic_investment={${this.prdtName}}`
      )
      base.href(`${plugin.urls.search}&from=target`)
      this.clickFlag = false
    },
    // 点击底部按钮，下一步
    nextStep() {
      let _this = this
      if (_this.clickFlag) {
        return
      }
      _this.clickFlag = true
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf1239',
        '1.0',
        '理财_基金定投|新增主页页面|底部|下一步',
        ''
      )
      // 如果已登录
      if (_this.isLogin) {
        // 预检查
        _this.preCheck()
        setTimeout(() => {
          _this.clickFlag = false
        }, 3000)
      } else {
        // 如果未登录
        base.href(`${plugin.urls.login}CheckLogin()`)
        _this.clickFlag = false
      }
    },
    // 点击下一步，登录后返回事件
    checkLogin() {
      this.preCheck()
    },
    // 预检查
    preCheck() {
      let _this = this
      window.buyProcess.preCheck({
        // 来源-定投
        fromBranch: 'isAip',
        // 产品代码
        productCode: _this.prdtCode,
        // 基金名称 三匹配页面要需要用到 必传
        productName: _this.prdtName,
        // 产品类型 2-基金
        productType: '2',
        // 是否是目标盈入口
        isTarget: true,
        callback() {
          base.href(
            `/web_cft/financing-aip/target-set.html?prdtId=${_this.prdtId}&prdtCode=${_this.prdtCode}&nowYield=${_this.$refs.myRule.nowYield}`
          )
        },
      })
    },
    refresh() {
      // 切换产品
      this.changeProduct()
      // 重置标尺位置为输入金额页面参数
      this.$refs.myRule.changeStartYield()
    },
    // 切换产品
    changeProduct() {
      let _this = this
      local.readObject(
        {
          financing_aip_choose_target_param: '',
        },
        (data) => {
          local.saveObject(
            {
              financing_aip_choose_target_param: '',
            },
            () => {
              if (!data.FINANCING_AIP_CHOOSE_TARGET_PARAM) {
                return
              }
              let obj = plugin.StringToJSON(
                data.FINANCING_AIP_CHOOSE_TARGET_PARAM
              )
              // 产品代码
              _this.prdtCode = obj.prdtCode || ''
              // 产品id
              _this.prdtId = obj.prdtId || ''
              // 产品名称
              _this.prdtName = decodeURIComponent(obj.prdtName || '--')
            }
          )
        }
      )
    },
  },
}
</script>

<style lang="less">
@import '../../../components/navigation-bar/navigation-bar.css';
@import '../../../components/Common.less';
@import './Home.less';
</style>
