<template>
  <div id="target-set">
    <div class="container target_set_container">
      <div class="wrapper fixed">
        <keep-alive>
          <!-- type = '' - 普通定投 -->
          <editaip
            class="edit-aip-w"
            ref="editAipRef"
            type
            v-bind="resultData"
            :oPaper="oPaper"
            :prdtCode="prdtCode"
            @listenAjaxPaper="listenAjaxPaper"
            :bShowInteTop="bShowInteTop"
            isTarget="1"
            @goTargetSuccess="goTargetSuccess"
            @goTargetFail="goTargetFail"
          ></editaip>
        </keep-alive>
      </div>
    </div>
    <Loading :show="isShowLoading"></Loading>
  </div>
</template>

<script>
// ----SVN公共方法
import base from 'base'
import local from 'local'
// web头
import NavigationBar from 'NavigationBar'
// ----components
// 主要逻辑组件
import editaip from '@/components/edit-aip/edit-aip'
// 公共方法库
import * as plugin from '@/components/Common'
// ajax
import * as API from '../request/api'
import Loading from '@zl/loading'

export default {
  name: 'home',
  components: {
    editaip,
    Loading,
  },
  data() {
    return {
      // 接口是否请求完毕
      is5882: false,
      isInfo: false,
      // 最大值
      NUMBERMAX: '999999999999999',
      resultData: {
        prdtId: base.getUrlParameter('prdtId'),
        lowMoney: 0, //最低起购金额
        highMoney: 999999999999999, //最高可购买金额
      },
      // 产品代码
      prdtCode: base.getUrlParameter('prdtCode') || '',
      // 产品id
      prdtId: base.getUrlParameter('prdtId') || '',
      // 收益率
      yieldNum: base.getUrlParameter('nowYield') || '',
      // 待签署协议
      oPaper: {},
      // 业务协议名称转换
      protocolNoList: {
        B000341: '适当性评估结果确认书',
        B000342: '不适当警示及投资者确认书',
        B000409: '基金定投服务协议',
        B000410: '智能基金定投服务协议',
        B000411: '资金自动转入服务协议',
        B000162: '基金定投特别说明',
      },
      // 产品协议名称转换
      contractCenterTypeList: {
        '1': '基金招募说明',
        '2': '基金产品风险揭示书',
        '4': '基金合同',
        '16': '产品事项告知书',
        '17': '代销风险揭示书',
        '35': '香港互认基金业务风险声明书',
        '61': '基金产品资料概要',
      },
      isShowLoading: false,
    }
  },
  computed: {
    // 基金公司相关信息
    comInfo() {
      let obj = {
        fundCompanyCode: '',
        fundCompanyName: '',
        pass: false,
      }
      if (this.resultData.urlParam && this.resultData.urlParam.openAccount) {
        obj = plugin.StringToJSON(this.resultData.urlParam.openAccount)
      }
      return obj
    },
  },
  watch: {
    is5882: function() {
      this.hideLoading()
    },
    isInfo: function() {
      this.hideLoading()
    },
  },
  mounted() {
    // 初始化
    this.init()
    // 默认开启目标止盈
    this.$refs.editAipRef.bOnStopParam = true
    this.$refs.editAipRef.stopParamRate = this.yieldNum
    setTimeout(() => {
      window.TalkingData.onHTSCEvent(
        'page',
        'leaf1240',
        '1.0',
        '理财_基金定投|新增目标盈定投主页|0|0',
        ''
      )
    }, 1000)
  },
  methods: {
    hideLoading() {
      if (this.is5882 && this.isInfo) {
        $('.loader-wrapper').hide()
      }
    },
    // ----------初始化
    init() {
      // 初始化web头
      this.initHead()
      // 获取数据
      this.getAllData()
    },
    // 初始化web头
    initHead() {
      let _this = this
      new NavigationBar({
        mountDom: '.target_set_container',
        title: '目标盈定投',
        // 点击左上角返回，关闭当前页面
        leftEvent() {
          if (this.clickFlag) {
            return
          }
          this.clickFlag = true
          base.href('http://action:10002')
          this.clickFlag = false
        },
      })
    },
    // 获取数据
    getAllData() {
      let _this = this
      // 读取缓存数据
      local.readObject(
        {
          web_cft_financing_aip_urlParam: '',
        },
        (data) => {
          if (data.WEB_CFT_FINANCING_AIP_URLPARAM) {
            let urlParam = plugin.StringToJSON(
              decodeURIComponent(data.WEB_CFT_FINANCING_AIP_URLPARAM)
            )
            _this.resultData = Object.assign({}, _this.resultData, {
              urlParam: urlParam,
            })
            // 获取接口数据
            _this.getData()
          }
        }
      )
    },
    // 获取接口数据
    getData() {
      this.get5882()
      this.getInfo()
    },
    get5882() {
      let _this = this
      // 获取用户权限
      API.get5827()
        .then((res) => {
          let clientType = res.CLIENTTYPE,
            companyCode = _this.comInfo.fundCompanyCode
          // 查询可委托基金详情
          API.get5882({
            FundCompany: companyCode,
            FundCode: _this.prdtCode,
            Reqno: '($reqno)',
            BussinessFlag: '1',
            // 申购
            wttype: '22',
            Clienttype: clientType,
          })
            .then((xml) => {
              // 是否首次
              let isFirst = parseInt(plugin.getCounterValue(xml, '是否首次'))
              // 最低定投起点
              let lowMoney = plugin.getCounterValue(xml, '最低定投起点')
              // 最大值
              let maxNumber =
                Number(plugin.getCounterValue(xml, '单人上限')) == 0
                  ? _this.NUMBERMAX
                  : plugin.getCounterValue(xml, '单人上限')
              // 产品最大值
              let cpmaxNumber =
                Number(plugin.getCounterValue(xml, '产品规模上限')) == 0
                  ? _this.NUMBERMAX
                  : plugin.getCounterValue(xml, '产品规模上限')
              // 单笔上线
              let maxOnce =
                Number(plugin.getCounterValue(xml, '单笔上限')) == 0
                  ? _this.NUMBERMAX
                  : plugin.getCounterValue(xml, '单笔上限')
              // 单日上限
              let maxDay =
                Number(plugin.getCounterValue(xml, '单日上限')) == 0
                  ? _this.NUMBERMAX
                  : plugin.getCounterValue(xml, '单日上限')
              // 最低定投起点，默认0.01
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
              _this.is5882 = true
            })
            .catch((err) => {
              _this.is5882 = true
              alert(err.ERRORMESSAGE || '网络连接失败')
            })
        })
        .catch((err) => {
          _this.is5882 = true
          alert(err.ERRORMESSAGE || '网络连接失败')
        })
    },
    getInfo() {
      let _this = this
      API.getInfo({
        prdtCode: _this.prdtCode,
        prdtId: _this.prdtId,
      })
        .then((res) => {
          let data = plugin.StringToJSON(res.BINDATA)
          let { code, resultData, msg } = data
          if (code === '0') {
            _this.resultData = Object.assign({}, _this.resultData, resultData)
          } else {
            alert(msg)
          }
          _this.isInfo = true
        })
        .catch((err) => {
          _this.isInfo = true
          alert(err.ERRORMESSAGE || '网络连接失败')
        })
    },
    // ----------绑定事件
    // 监听协议
    listenAjaxPaper(oParam) {
      let _this = this
      _this.isShowLoading = true
      // 获取协议列表
      API.getPaperToSign({
        // 1008 定投
        bizCode: 1008,
        prdtIdList: _this.prdtId,
        paramMap: JSON.stringify({
          fundInvestType: oParam.fundInvestType,
          hasSignAutoShiftToContract: oParam.hasSignAutoShiftToContract,
        }),
      })
        .then((res) => {
          // 清空协议列表
          _this.oPaper = {}
          let oData = plugin.StringToJSON(res.BINDATA),
            code = oData.code,
            msg = oData.msg || '网络超时，请稍后确认您的订单信息'
          if (code === '0') {
            // 查询序号
            let serialId = oData.serialId,
              agrtList = [],
              pdfItem = []
            if (oData.agrtList && oData.agrtList.length > 0) {
              for (let item of oData.agrtList) {
                let showName = '',
                  caSign = ''
                // 1-业务协议
                if (
                  item.contractMainType == 1 &&
                  _this.protocolNoList[item.protocolNo]
                ) {
                  showName = _this.protocolNoList[item.protocolNo]
                }
                // 2-产品协议
                else if (
                  item.contractMainType == 2 &&
                  _this.contractCenterTypeList[item.contractCenterType]
                ) {
                  showName =
                    _this.contractCenterTypeList[item.contractCenterType]
                } else {
                  showName = item.agrtName || '合同签署'
                }
                if (
                  item.contractMainType == 2 &&
                  (item.contractCenterType == '1' ||
                    item.contractCenterType == '4')
                ) {
                  caSign = '0'
                }
                let agrtListItem = {
                  // 产品ID
                  productId: item.productId,
                  // 协议编号
                  protocolNo: item.protocolNo,
                  // 展示在页面上的名字->根据协议号写死
                  showName: showName,
                  // 协议名称
                  agrtName: item.agrtName || '合同签署',
                  // 协议版本
                  version: item.version,
                  // 协议分类，1-业务协议，2-产品协议，3-产品业务协议
                  classify: item.classify,
                  // 协议地址 .replace(/amp;/gi, '')
                  agrtUrl: item.agrtUrl,
                  // 文件md5
                  md5File: item.md5File,
                  // 填充ID
                  fillingSourceId: item.fillingSourceId,
                }
                if (caSign === '0') {
                  agrtListItem.caSign = caSign
                }
                agrtList.push(agrtListItem)
                let oPdfItem = {
                  // 产品ID
                  productId: item.productId,
                  // 协议编号
                  protocolNo: item.protocolNo,
                  // 协议版本
                  version: item.version,
                  // 协议分类，1-业务协议，2-产品协议，3-产品业务协议
                  classify: item.classify,
                  // 文件md5
                  md5File: item.md5File,
                  // 填充ID
                  fillingSourceId: item.fillingSourceId,
                }
                if (caSign === '0') {
                  oPdfItem.caSign = caSign
                }
                pdfItem.push(JSON.stringify(oPdfItem))
              }
              _this.oPaper = Object.assign({}, _this.oPaper, {
                pass: true,
                serialId: serialId,
                bizCode: 1008,
                agrtList: agrtList,
                strAgrtList: '[' + pdfItem.toString() + ']',
              })
            }
            _this.isShowLoading = false
            // 显示三匹配弹窗
            _this.$refs.editAipRef.showMatchResultLayer()
          } else {
            _this.isShowLoading = false
            alert(msg)
          }
        })
        .catch((err) => {
          _this.isShowLoading = false
          alert(err.ERRORMESSAGE || '网络连接失败')
        })
    },
    // 点击跳转到成功页
    goTargetSuccess(params) {
      base.href(
        `http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-fail.html?msg=${msg}`
      )
      this.$router.push({
        // path 传参，页面刷新数据不会丢失，url会有传参
        path: `/success/${params}`,
      })
    },
    // 点击跳转到失败页
    goTargetFail(msg) {
      base.href(
        `http://action:1964/?url=${encodeURIComponent(
          `http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-fail.html?msg=${msg}`
        )}`
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
