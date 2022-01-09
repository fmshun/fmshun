<template>
  <div id="target">
    <!-- loading -->
    <waiting v-show="isShowLoading"></waiting>
    <div :class="{ ios: isIOS }" class="container target_container">
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
    </div>
    <footer @click="nextStep" class="text_center">
      <div>下一步</div>
    </footer>
  </div>
</template>
<script>
// ----SVN公共方法
import base from 'base'
import local from 'local'
// web头
import NavigationBar from 'NavigationBar'
// ----components
// loading
import Waiting from '@/components/waiting/Waiting'
// 公共方法库
import * as plugin from '@/components/Common'
// 收益率标尺
import Rule from '@/components/rule/Rule'
// import Rule from '@/components/rule-v3/Rule'
// ajax
import * as API from '../request/api'

export default {
  name: 'Home',
  metaInfo: {
    title: '目标盈定投',
  },
  components: {
    Waiting,
    Rule,
  },
  data() {
    return {
      // 是否显示loading
      isShowLoading: true,
      // 防重复点击
      clickFlag: false,
      // 是否是IOS
      isIOS: false,
      // ------收益率相关
      // 目标收益率
      yieldNum: base.getUrlParameter('yield') || 10,
      // 标尺最小值
      min: 4,
      // 标尺最大值
      max: 100,
      // ------产品相关
      // 是否是人气定投
      isPopular: true,
      // 是否已登录
      isLogin: false,
      // 产品代码
      prdtCode: base.getUrlParameter('code') || '',
      // 产品id
      prdtId: base.getUrlParameter('prdtId') || '',
      // 产品名称
      prdtName: decodeURIComponent(base.getUrlParameter('name') || ''),
      // 基金公司代码
      comCode: '',
      // 基金公司名称
      comName: '',
      // 人气定投第一只产品代码
      firstCode: base.getUrlParameter('code') || '',
    }
  },
  created() {
    // let _this = this
    // 动态加载js库-点击下一步，预检查定投需要
    this.$loadScripts([
      '/common/vendor/md5-2.11.0/md5.js',
      '/common/vendor/flexible-0.3.2/flexible.js',
      '/licai/com/component/js/antiMoneyLaundering.js',
      '/licai/com/component/js/layer.js',
      '/licai/com/js/buy-process-v3.js',
      '/licai/com/js/quick-buy-alter.js',
    ]).then(() => {
      // _this.buyProcess = window.buyProcess
    })
  },
  mounted() {
    // 初始化
    this.init()
  },
  methods: {
    // ----------初始化
    init() {
      // 是否是IOS，区分样式
      this.isIOS = base.isIOS() ? true : false
      // 初始化web头
      this.initHead()
      // 获取登录状态
      this.getLogin()
      if (!this.prdtCode && !this.prdtId) {
        // 获取初始化页面的数据
        this.getData()
      } else {
        this.isPopular = false
        this.isShowLoading = false
        $('.loader-wrapper').hide()
      }
      // 绑定登录后返回事件
      window.CheckLogin = this.checkLogin
      let _this = this
      // 返回刷新，切换产品
      window.GoBackOnLoad = this.changeProduct
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
              _this.isPopular = false
            }
          )
        }
      )
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
          base.href(plugin.urls.targetList)
          _this.clickFlag = false
        },
      })
    },
    // 获取页面数据
    getLogin() {
      let _this = this
      // 获取登录状态
      API.getLogin()
        .then((res) => {
          // 登录状态
          _this.isLogin = res.JYLOGINFLAG > 1 ? true : false
        })
        .catch((err) => {
          base.log(err.ERRORMESSAGE)
        })
    },
    // 获取初始化页面的数据
    getData() {
      // prdtCode
      let _this = this,
        obj = {}
      // Object.assign({}, this.oPaper, obj)
      if (_this.prdtCode) {
        obj.prdtCode = _this.prdtCode
      }
      API.getProduct(obj)
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let code = data.code,
            msg = data.msg || '网络连接失败！'
          // TODO 假数据
          // code = '0'
          if (code === '0' && data.resultData && data.resultData[0]) {
            let obj = data.resultData[0]
            // 产品代码
            _this.prdtCode = obj.prdtCode
            _this.firstCode = obj.prdtCode
            // 产品id
            _this.prdtId = obj.prdtId
            // 产品名称
            _this.prdtName = obj.name || '--'
          } else {
            alert(msg)
          }
          $('.loader-wrapper').hide()
          _this.isShowLoading = false
        })
        .catch((err) => {
          $('.loader-wrapper').hide()
          alert(err.ERRORMESSAGE || '网络连接失败！')
          _this.isShowLoading = false
        })
    },
    // ----------click
    // 点击产品，跳转到搜索页
    goSearch() {
      let _this = this
      if (_this.clickFlag) {
        return
      }
      _this.clickFlag = true
      base.href(`${plugin.urls.search}&from=target`)
      _this.clickFlag = false
    },
    // 点击底部按钮，下一步
    nextStep() {
      let _this = this
      if (_this.clickFlag) {
        return
      }
      _this.clickFlag = true
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
    // 点击下一步，登录后返回
    checkLogin() {
      this.preCheck()
    },
    // 预检查
    preCheck() {
      let _this = this
      // TODO 假数据，待修改
      window.buyProcess.preCheck({
        // 来源-定投
        fromBranch: 'isAip',
        // 产品代码
        productCode: _this.prdtCode,
        // 基金公司代码 必传
        companyCode: _this.comCode,
        // 基金名称 三匹配页面要需要用到 必传
        productName: _this.prdtName,
        // 公司名称
        companyName: _this.comName,
        // 产品类型 2-基金
        productType: '2',
        // 是否是目标盈入口
        isTarget: true,
        callback() {
          _this.$router.push({
            // path 传参，页面刷新数据不会丢失，url会有传参
            path: `/set/${_this.prdtId}/${_this.prdtCode}/${_this.$refs.myRule.nowYield}`,
          })
        },
      })
    },
  },
  activated() {
    // alert('activated')
    // 返回刷新，切换产品
    window.GoBackOnLoad = this.changeProduct
    // 重置标尺位置为输入金额页面参数
    this.$refs.myRule.changeStartYield()
  },
}
</script>
<style lang="less">
@import '../../../components/navigation-bar/navigation-bar.css';
@import '../../../components/Common.less';
@import './Home.less';
</style>
