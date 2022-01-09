<template>
  <div id="aip-detail" :class="{ iphoneX: isIphoneX,'android':isAndroid }">
    <waiting v-show="showWaiting"></waiting>
    <div class="title_layer_outer " id="title">
      <div class="title_block "></div>
      <div class="title_layer_inner">
        <div class="layer_back" @click="layer_back">
          <img class="back" src="../assets/aip-detail1.png" alt="" />
        </div>
        <div class="layer_title">
          <div class="title_tip1" id="title_tip1">
            定投详情
          </div>
          <div class="title_tip2" id="title_tip2">
            创建于 {{dataobj.createTime}}
          </div>
        </div>
        <div class="layer_search" @click="manner(true)" v-if="dataobj.status != '4'">
          <!-- <img class="search" src="../assets/search.png" /> -->
          管理
        </div>
      </div>
    </div>

    <div class="aip-detail-con" :style="{'overflow': status.scrollFlag ? 'scroll':'hidden'}" @scroll="moveScroll" ref="scrollOne">
      <div class="aip-detail-con-height" ref="listHei">
        <bulletinBoard
          v-if="dataobj.status != '4'"
          ref="bulletinBoard"
          @bulletinBoardTap="bulletinBoardTap"
          @hasSelfConfirmEvent = 'true'
        />
        <div class="aip-d-background">
          <div class="aip-d-sy-name" @click="fundDetail">
            <div class="fl">
              <p :style="{'max-width': (lable == 2 ? '57%' : lable == 1 ? '76%' : '99%')}">{{dataobj.name}}</p>
              <span v-for="(tab,index) in dataobj.tag" :key="index" >
                <em v-if="tab == '2'">智能定投</em>
                <em v-if="tab == '3'">心愿定投</em>
                <em v-if="tab == '4'">目标投</em>
              </span>
              <!-- <span >
                <em >智能定投</em>
               
              </span> -->
              <span v-if="dataobj.investmentType == '3'"><em >工资理财</em></span>
            </div>
            <img
              class="fr aip-d-sy-name-icon"
              src="../assets/aip-detail2.png"
              alt=""
            />
          </div>
          <!-- <p class="aip-d-sy-info" v-if="dataobj.description && dataobj.status == '1'" v-autoFontSize data-maxFontSize="13" data-maxHeight="20">
            {{dataobj.description.text}}
          </p> -->
          <p class="aip-d-sy-info" v-if="dataobj.description && dataobj.status == '1'" >
            {{dataobj.description.text}}
          </p>

          <div class="aip-d-holding">
            <div class="aip-d-holding-top" :class="{'up':dataobj.status != '1'}">
              <div class="aip-d-holding-money fl">
                <p class="aip-d-holding-m-info">定投资产(元)</p>
                <p class="aip-d-holding-m-num">{{dataobj.element.hold || "0.00"}}</p>
              </div>
              <div class="aip-d-holding-qishu fr " >
                <p class="aip-d-holding-m-qishun">{{dataobj.element.period || "0"}}</p>
                <p class="aip-d-holding-m-qishuy">已投期数</p>
              </div>
            </div>
            <div class="aip-d-holding-center " :class="{ show: status.holding }" v-show="dataobj.status != '4'">
              <p @click="confirm_tip">
                当前总收益
                  <span v-autoFontSize data-maxFontSize="15" data-maxHeight="18" :class="{'red':dataobj.element.yield >= '0','green':dataobj.element.yield<'0'}">{{dataobj.element.yield | formatMoneySign}}</span>
              </p>
              <p>
                定投收益率
                <span v-autoFontSize data-maxFontSize="15" data-maxHeight="18" :class="{'red':dataobj.element.rate >= '0','green': Number(dataobj.element.rate) < 0}">{{dataobj.element.rate | formatMoney}}%</span>
              </p>
              <p>
                持有份额
                
                <span v-autoFontSize data-maxFontSize="15" data-maxHeight="18">{{dataobj.element.part || "0.00"}}</span>
                
              </p>
              <p>
                成本单价
                <span>{{dataobj.element.price || "0.00"}}</span>
              </p>
              <p>
                累计份额
                <span v-autoFontSize data-maxFontSize="15" data-maxHeight="18">{{dataobj.element.totalPart || "0.00"}}</span>
              </p>
              <p>
                累计定投
                <span v-autoFontSize data-maxFontSize="15" data-maxHeight="18">{{dataobj.element.totalAmount || "0.00"}}</span>
              </p>
            </div>
            <div class="aip-d-holding-center already" v-show="dataobj.status == '4'">
              <p class="wid100">
                定投累积收益(元)
                <span :class="{'red':dataobj.element.totalYield >= '0','green':dataobj.element.totalYield<'0'}" >{{dataobj.element.totalYield | formatMoneySign}}</span>
              </p>
              <p class="wid101">
                累计份额(份)
                <span v-autoFontSize data-maxFontSize="15" data-maxHeight="18">{{dataobj.element.totalPart || "0.00"}}</span>
              </p>
              <p class="wid102">
                累计定投(元)
                <span v-autoFontSize data-maxFontSize="15" data-maxHeight="18">{{dataobj.element.totalAmount || "0.00"}}</span>
              </p>
            
            </div>
            <div
              class="aip-d-holding-bottom"
              @click="holdingF(false)"
              v-show="status.holding && dataobj.status != '4'"
            >
              <img src="../assets/aip-detail4.png" alt="" />
            </div>
            <div
              class="aip-d-holding-bottom"
              @click="holdingF(true)"
              v-show="!status.holding && dataobj.status != '4'"
            >
              <img src="../assets/aip-detail3.png" alt="" />
            </div>
            <div class="iconS" v-if="dataobj.status == '2'">已暂停</div>
            <div class="iconS" v-if="dataobj.status == '3'">已终止</div>
            <div class="iconS" v-if="dataobj.status == '4'">已办结</div>
          </div>
        </div>
        <div class="aip-d-holdings">
          <div class="aip-d-charts">
            <span  v-for="(tab,index) in tabs" :class="{'on' : num==index}" @click="trend(tab.id,index)" :key="index">
              {{tab.name}}
              <em></em>
            </span>
          </div>
          <div class="hasChart">
            <div class="aip-d-charts-info" >
              <!-- 无数据也要显示 -->
              <div class="fl" v-show="num == '0'" >
                <img src="../assets/aip-detail6.png" alt="" />
                定投收益率<img src="../assets/aip-detail15.png" class="my-aip-charts-title-icon" @click="chartsIicon">
                <span :class="{'red':rate.pt.slice(-1)[0] > '0','green': Number(rate.pt.slice(-1)[0]) < 0}">{{(rate.pt.slice(-1)[0] ? rate.pt.slice(-1)[0]  : '--') | formatMoneySign}}%</span>
              </div>
              <div class="fr" v-show="num == '0'  && dataobj.tag.indexOf('4')> -1 && dataobj.goalRate">
                目标收益率
                <span :class="{'red':dataobj.goalRate > '0','green': dataobj.goalRate<'0'}">{{dataobj.goalRate | formatMoneySign}}%</span>
              </div>
              <template v-if="rate.pt.slice(-1)[0]">
                <!-- 无数据不显示 -->
                <div class="fl" v-if="num == '1' && dataobj.tag.indexOf('2')> -1 && rate.date.slice(-1)[0]">
                  <img src="../assets/aip-detail6.png" alt="" />
                  20{{rate.date.slice(-1)[0].replace(/\//g,"-")}}&nbsp;&nbsp;定投金额
                  <span :class="{'red':rate.pt.slice(-1)[0] > '0','green':rate.pt.slice(-1)[0]<'0'}">{{rate.pt.slice(-1)[0] | formatMoney}}元</span>
                </div>
                <div class="fl" v-show="num == '1' && dataobj.tag.indexOf('2') == -1">
                  <img src="../assets/aip-detail6.png" alt="" />
                  成本单价：
                  <span :class="{'red':rate.pt.slice(-1)[0] > '0','green':rate.pt.slice(-1)[0]<'0'}">{{rate.pt.slice(-1)[0]}}</span>
                </div>


                <div class="fl" v-show="num == '2'">
                  <img src="../assets/aip-detail6.png" alt="" />
                  成本单价：
                  <span :class="{'red':rate.pt.slice(-1)[0] > '0','green':rate.pt.slice(-1)[0]<'0'}">{{rate.pt.slice(-1)[0] }}</span>
                </div>
              </template>
            </div>
            <div class="chartNoDataA" v-if="!rate.pt.slice(-1)[0]">
              <!-- :class='{"first": num == "0"}' -->
              <img src="../assets/aip-detail13.png"  >
              <p>当前暂无数据，请稍后</p>
            </div>
            <div class="aip-d-charts-info-move none">
            
            </div>
            <div class="aip-d-charts-line" >
              <div class="chart">
                <div id="chart-line"></div>
                <p id="chart-line-last"></p>
                <div id="chart-bluecircle"></div>
              </div>
            </div>
            <div class="profit-tab" v-show="num == '0'">
              <ul>
                <li class="line " v-for="(tabA,indexA) in chartsTabs"  :class="{'on' :chartsNum==indexA}"  @click="trend('2',0,indexA+1)" :key="indexA">{{tabA}}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="aip-d-holdings" v-show="isHisShow">
          <div class="aip-d-symx " v-if="dataobj.investmentType != '1'" @click="goIncomeDetails()">
            收益明细
            <img src="../assets/aip-detail7.png" alt="" class="fr" />
          </div>
          <div class="aip-d-symx-fh" v-if="dataobj.investmentType == '1'" @click="goIncomeDetails()">
              <p class="aip-d-symx-fh-t">收益及分红</p>
              <p class="aip-d-symx-fh-c">查看收益明细、分红记录<img src="../assets/aip-detail7.png" alt=""  /></p>
          </div>
        </div>

        <div class="aip-d-holdings aip-d-plan2">
          <p class="aip-d-plan" v-html="dataobj.setting.investType == '2' ? '智能定投': '基金定投'"></p>
          <p class="aip-d-plan1" v-if="dataobj.setting.type == '1' && !dataobj.setting.bankNum">
            <img src="../assets/aip-detail14.png" alt="" class="fl"/><span class="fl">当前主三方存管银行卡</span>
          </p>
          <p class="aip-d-plan1" v-else-if="dataobj.setting.type == '1'">
            <img :src="imgUrl" alt="" class="fl"/><span class="fl">从{{dataobj.setting.bankName}}({{dataobj.setting.bankNum.substr(-4)}})</span>
          </p>
          <p class="aip-d-plan1" v-else>
            <img src="../assets/logo.png" alt="" class="fl" /><span class="fl">从华泰账户</span>
          </p>
          <p class="aip-d-plan1 " >
            <img src="../assets/aip-detail12.png" alt="" class="fl"  v-if="dataobj.status == '1'"/>
            <img src="../assets/aip-detail10.png" alt="" class="fl"  v-else/>
            <span class="fl" >{{dataobj.setting.text}}</span>
          </p>
        </div>

        <div class="aip-d-holdings" v-if="dataobj.record.length > 0">
          <p class="aip-d-record ">定投记录</p>
          <ul class="aip-d-record-list"  >
            <div class="listHei" >
              <li  @click="aip_record(tab,tab.composeOrderId,tab.orderSource,tab.entrustDate)" v-for="(tab,index) in dataobj.record" :key="index" :class="{'red': tab.type == '4' || tab.type == '2','blue': tab.type == '3'}">
                <div>
                  <span class="fl">{{tab.date}}</span>
                  <span class="fl"  v-if="tab.type == '4' || tab.type == '5' || tab.type == '6' || tab.type == '8'" v-autoFontSize data-maxFontSize="15" data-maxHeight="22">{{tab.part}}份</span>
                  <span class="fl"  v-else-if="tab.isIntelligent" v-autoFontSize data-maxFontSize="15" data-maxHeight="22">{{tab.minMoney}}~{{tab.maxMoney}}元</span>
                  <span class="fl"  v-else v-autoFontSize data-maxFontSize="15" data-maxHeight="22">{{tab.money | formatMoney}}元</span>
                  <img src="../assets/aip-detail7.png" alt="" class="fr" />
                  <span class="fr" v-html="arrStatus[Number(tab.type)-1]"></span>
                </div>
                <p class="aip-d-record-reason" v-if=" tab.type == '2' || tab.type == '4'">{{tab.reason}}</p>
              </li>
            </div>
          </ul>
        </div>
        <div class="aip-d-holdings info" v-if="dataobj.tag.indexOf('4') > -1">定投计划展示的收益率、成本价等数据仅供参考，实际以交割单确认数据为准。止盈收益率达成目标后，继续定投时累计收益及收益率数据会随产品净值产生波动。自动赎回服务可能因赎回当天的净值变化引起最终到账收益偏差，且未包含手续费，止盈收益率以最终到账收益率为准。</div>
        <div class="aip-d-holdings info" v-else>定投计划展示的收益率、成本价等数据仅供参考，实际以交割单确认数据为准。</div>
      </div>
    </div>
    <!-- total -->
    <div class="aip-d-total none">
      <img src="../assets/aip-detail8.png" alt="" />
      <p>定投已终止</p>
    </div>
    <!-- 管理 -->
    <operation 
    ref="operation"
    ></operation>
    <riskAssessment :status='status.riskObj' v-if="status.riskObj.isShowRisk" @scrollFlag="scrollFlag"></riskAssessment>  
    <!-- 三匹配 -->
    <matchresultlayer
      v-if="status.bShowMatchResultLayer"
      :chosen_list="dataobj.chosen_list"
      :hasSelfConfirmEvent='true'
      :is_singleProduct='true'
      @listenMatchResultLayerClose="listenMatchResultLayerClose"
    ></matchresultlayer>
    <!-- 当前总收益弹框 -->
    <div class="my-fund-sy-confirm"  v-show="confirmTypeShow">
      <div class="my-fund-sy-c-con">
        <p class="my-fund-sy-c-con-t">当前总收益(元)</p>
        <p class="my-fund-sy-c-con-n" :class="{'red':(dataobj.element.yield &gt;= 0 ),'green':(dataobj.element.yield &lt; 0)}">{{dataobj.element.yield | formatMoneySign}}</p>
        <p class="my-fund-sy-c-con-i" v-show="dataobj.element.updateTime">更新时间{{ dataobj.element.updateTime }}</p>
        <div class="my-fund-sy-c-con-detail">
          <div>
            <p class="my-fund-sy-c-con-rz" >入账(元)</p>
            <!-- 预估没有颜色判断 -->
            
            <p class="my-fund-sy-c-con-num" :class="{'red':dataobj.element.rzYield &gt;= 0,'green':dataobj.element.rzYield &lt; 0}" >
              {{ dataobj.element.rzYield | formatMoneySign }}
            </p>
            
          </div>
          <img src="../assets/my-fund22.png" alt="" />
          <div>
            <p class="my-fund-sy-c-con-rz" >预估(元)</p>
            <p class="my-fund-sy-c-con-num" :class="{'red':dataobj.element.ygYield &gt;= 0,'green':dataobj.element.ygYield &lt; 0}">
              {{ dataobj.element.ygYield | formatMoneySign }}
            </p>
          </div>
        </div>
        <div class="my-fund-sy-c-confirm-tips">
          当前总收益为当前定投计划本次持仓以来的总收益，根据是否计入总资产，分为入账(已计入)和预估(未计入)两部分。收益数据均为预估值，仅供参考，不作为投资参考及决策依据，账户的实际变现价值请以最终清算结果为准。
        </div>
        <img
          src="../assets/my-fund21.png"
          alt=""
          class="my-fund-sy-close"
          @click="confirmClose"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import * as Api from '../request/api'
import runChartExtendObj from '../components/run-chart-extend.js'
import Waiting from '@/components/waiting/Waiting'
import TalkingData from 'talkingData'
import ajax from 'ajax'
import base from 'base'
import loadScripts from '@/utils/loadScripts'
import loadStyles from '@/utils/loadStyles'
import bankdata from '@/components/bank/bankdata'//银行字段图标
import operation from '../components/operation.vue'//管理中  恢复、暂停、终止操作
import {cycleInfos}  from '@/components/Common'
import bulletinBoard from '@/components/bulletin-board'//公告区域
import riskAssessment from '../components/risk-assessment.vue'//风险测评弹窗
import matchresultlayer from '@/components/three-match-array/match-result'//适当性弹窗 三匹配
import { setTimeout } from 'timers';
export default {
  name: 'aipDetail',
  components: {
    Waiting,
    operation,
    bulletinBoard,
    riskAssessment,
    matchresultlayer,
  },
  directives: {
    autoFontSize: {
      componentUpdated(el) {
        if (el.dataset.isAuto) return;
        el.dataset.isAuto = true;
        const  {maxfontsize, maxheight} = el.dataset
        const curPre =  (document.body.clientWidth || document.documentElement.clientWidth ) / 375;
        const maxFontSize = Math.floor(curPre * Number(maxfontsize));
        const maxHeight = Math.ceil(curPre * Number(maxheight));
        for(let i = maxFontSize; i > 8; i --) {
          el.style.fontSize = `${i}px`;
          const curHeight = el.offsetHeight;
          if (curHeight <= maxHeight) {
            break;
          }
        }
      }
    }
  },
  data() {
    return {
      notice:[],
      tabs:[{id:'2',name:'定投收益率'},{id:'3',name:'成本单价'}],
      chartsTabs:['近三个月','近半年','近一年','成立以来'],
      num:0,
      chartsNum:0,
      showWaiting:true,
      confirmTypeShow:false,
      lable:0,//计算标签数量
      isHisShow:true,//收益明细
      // 是否是iphoneX
      isIphoneX: false,
      status: {
        prdtCode: base.getUrlParameter('prdtCode') || '',
        subFundAccount: base.getUrlParameter('subFundAccount') || '',
        holding: false,
        manner: false,//点击管理状态
        isSalary: false, //是否是工资理财
        isAuto: false, // 是否自动转入
        flag: false,
        scrollFlag:false,//控制页面滚动开关
        configBizType: '', ////业务类型 [30 登记, 31 修改, 32 停止和恢复, 33 终止, 34 二次确认,
        actionIn: '', ////0恢复 1停止
        scrollLoad:true,// 定投明细滑动加载控制
        pageNum:1,//定投记录页数记录
        currentTime:'',//当前时间
        todayIsTradingDay:'',//今日是否是交易日，0否1是
        bShowMatchResultLayer:false,// 三匹配弹框
        riskObj:{
          riskIsInvalidriskIsInvalid:false,//风险测评是否失效
          isShowRisk:false,// 是否显示风险测评
          isOrg:false,//是否是机构户
          riskTitle:"",// 风险测评名称
        }
        
      },
      rate: {
         // mine: [],
          // m300: [],
          pt: [],
          date: [],
      },
      dataobj: {
        chosen_list:[],//适当性入参
        createTime: '', //创建时间 2020-07-02
        name: '', //产品名称
        investmentType: '', //定投类型：1-新定投，2-老定投，3-工资理财
        prdtId:"",//产品id
        tag: '', //定投类型标签 可能为空或多个，逗号分隔 2-智慧定投，3-心愿定投，4-目标止盈
        status: '', //定投状态 1-正常，2-暂停，3-终止，4-已办结
        notice: [
          {
            type:"",//通知类型 见备注
            elementChangeFour:false,//风险要素变更 保守最低型，如果仍然适配
            isOrg:false,
            forkOff:false,
            confirmType:"",//买卖类型 1-买，2-卖
            confirmMoney:"",//金额
            confirmDate:"",//日期 格式MM-DD 例如09-22
            confirmFlag:""//展示标签
          }
        ],
        //已暂停/终止/完结 description字段是空置
        description: {
          // "type":"资金来源：0-资金账户、1-银行卡",
          // "date":"2020-07-06",
          // "bankType":"银行类型编号",
          // "bankNum":"银行卡号",
          // "isIntelligent":false,
          //isIntelligent=true 返回区间范围
          // "minMoney":"最小转入金额",
          // "maxMoney":"最大转入金额",
          //isIntelligent=false 返回固定金额
          // "money":"转入金额"
        },
        element: {
          // "hold":"定投资产",
          // "period":"定投期数",
          // "yield":"累计收益",
          // "rate":"定投收益率",
          // "part":"持有份额",
          // "price":"成本单价",
          // "totalPart":"累计份额",
          // "totalAmount":"累计定投金额",
        },
        goalRate: '', //目标收益 可能空值 空值不展示
        setting: {
          // "type":"定投类型",
          // "bankType":"银行类型编号",
          // "bankNum":"银行卡尾号",
          // "cycle":"定投周期",
          // "money":"定投金额"
          // autoFlag:'',//自动标志
          // applyNo:'',//申请编码
          // positionStr:''// 原定位串，修改/启停/终止必填
          //allotno:''//老定投合同编号
        },
        record: [
          // {
          //   "date":"2020-07-06",
          //isIntelligent=true 返回区间范围
          // "minMoney":"最小转入金额",
          // "maxMoney":"最大转入金额",
          // //isIntelligent=false 返回固定金额
          // "money":"转入金额"
          //   "type":"类型，见备注",
          //   "reason":"失败原因"
          // "composeOrderId":"组合订单id",
          // "orderSource":"订单来源",
          // "entrustDate":"确认日期"
          // }
        ],
      
      },
      arrStatus:['定投确认中','定投失败','等待转入','赎回失败','赎回确认中','赎回成功','定投成功','赎回撤单']
    }
  },
  // provide(){    //provide作为一个方法使用 ( 推荐使用 )。
  //   return{
  //     'status' : this.status,
  //   }
  // },
  created() {
    
  },
  computed: {
    imgUrl: function() {
      if (this.dataobj.setting.logo) {
        return require('@/components/bank/' +this.dataobj.setting.logo)
      }
      return ''
    },
  },
  mounted() {
    //白色顶部状态栏
    base.href('http://action:10066?isShowDarkStatusBar=1')
    var that = this
    if (base.isAndroid()) {
      $('.title_block').addClass("none")
      that.isAndroid = true
    }
    loadScripts(['/common/scripts/prompt.js',
    '/common/scripts/toast.js',
    '/common/charts/chart-vue.js']).then(() => {
      that.getDetailList()
    })
    loadStyles(['/common/styles/toast.css']).then(() => {})
    if (base.isIphoneX()) {
      that.isIphoneX = true
      // $(".title_block").addClass("none")
    } else {
      that.isIphoneX = false
    }
    
    setTimeout(() => {
      TalkingData.onHTSCEvent("page","leaf1227","1.0","理财_基金定投|定投详情页面|0|0", "")
    },500)
    window.GoBackOnLoad = function() {
      that.getDetailList()
      that.status.bShowMatchResultLayer = false;
      ajax.showLoading()
      that.status.pageNum = 1
    }
  },
  destroyed() {},
  updated: function() {
    // if (base.isIOS()) {
    //   $('#monethly-bills .line').css('borderWidth', '0.5px')
    // }
    if (base.isIOS()) {
      $('.line05').css('borderWidth', '0.5px')
    }
    $(".aip-detail-con").css({
        "height": ($("body").height() - $(".title_layer_outer").height())+"px",
        "top": $(".title_layer_outer").height()-1 + "px",
    });
  },
  watch: {},
  methods: {
    getDetailList: function(cycleType) {
      var that = this
      var url =
        '/reqxml?action=27401&path=/time_invest/fixed_investment_detail?prdtCode=' +
        that.status.prdtCode
      var param = {
        clientNo: '($account)',
        subFundAccount: that.status.subFundAccount,
      }
      ajax.run(
        url,
        param,
        function(data) {
          $('.loader-wrapper').hide()
          ajax.hideLoading()
          var dataobj = JSON.parse(data.BINDATA)
          if (dataobj.code != '0') {
            alert(dataobj.msg)
            return
          }
          if(!dataobj.status){
            alert("暂无数据")
            return
          }
          that.dataobj = dataobj
          that.dataobj.tag = that.dataobj.tag == '' ? '' : that.dataobj.tag.split(',')
          if(that.dataobj.tag.indexOf("2")> -1){
            that.tabs=[{id:'2',name:'定投收益率'},{id:'4',name:'定投金额'},{id:'3',name:'成本单价'}]
          }
          that.lable = dataobj.tag.length + (dataobj.investmentType == '3' ? 1 : 0)
          //返回刷新重置风险测评信息
          that.status.riskObj={
            riskIsInvalidriskIsInvalid:false,//风险测评是否失效
            isShowRisk:false,// 是否显示风险测评
            isOrg:false,//是否是机构户
            riskTitle:"",// 风险测评名称
          }
          //是否显示收益明细模块
          //老定投并且已终止状态不显示
          if(that.dataobj.status == '3' && that.dataobj.status == '4' && (that.dataobj.investmentType =='2' || that.dataobj.investmentType =='3')){
            that.isHisShow = false;
          }
          //新定投并且已办结状态不显示
          if(that.dataobj.status == '4' && that.dataobj.investmentType =='1'){
            that.isHisShow = false;
          }

          //分红话术
          var money = ''
          if(that.dataobj.description.isIntelligent){
            money = Number(that.dataobj.description.minMoney).toFixed(2)+"～"+Number(that.dataobj.description.maxMoney).toFixed(2)
          }else{
            money = Number(that.dataobj.description.money).toFixed(2)
          }
          var paths=''
          if(that.dataobj.description.type == '1'){
            if(that.dataobj.description.bankType && that.dataobj.description.bankType !='0000' && that.dataobj.description.bankNum){
              paths = bankdata.getDataByCode(that.dataobj.description.bankType).name+"("+that.dataobj.description.bankNum.substr(-4)+")"
              that.dataobj.description.bankName=bankdata.getDataByCode(that.dataobj.description.bankType).name
            }else{
              paths='未知'
              that.dataobj.description.bankName='未知'
            }
              
          }else{
              paths = '华泰账户'
          }
          that.dataobj.description.text=that.dataobj.description.date.substring(5).replace("-",".")+
          "("+that.weekDay(that.dataobj.description.date)+
          ")将从"+paths+"转入"+money+"元"

          //银行转账周期
          if(that.dataobj.setting.type == '1'){
            if(that.dataobj.setting.bankType && that.dataobj.setting.bankType !='0000'){
              that.dataobj.setting.bankName=bankdata.getDataByCode(that.dataobj.setting.bankType).name
              that.dataobj.setting.logo=bankdata.getDataByCode(that.dataobj.setting.bankType).logo
            }else{
              that.dataobj.setting.bankName='未知'
            }
          }

          var money1 = ''
          if(that.dataobj.setting.isIntelligent){
            money1 = that.dataobj.setting.minMoney+"～"+that.dataobj.setting.maxMoney
          }else{
            money1 = that.dataobj.setting.money
          }
          
          var ts='',ratesNumber=0,textS=''
          if (that.dataobj.setting.dtCycle == '1W'){
              ts = '每周'
              ratesNumber=1
          }else if(that.dataobj.setting.dtCycle == '2W'){
              ts = '每两周'
              ratesNumber=2
          }else if(that.dataobj.setting.dtCycle == '1M'){
              ts = '每月'
              ratesNumber=3
              textS='号'
          }else if(that.dataobj.setting.dtCycle == '1D'){
              ts = '每个交易日'
          }
          if(that.dataobj.setting.dtCycle == '1D'){
            that.dataobj.setting.text=ts+' 转入'+money1+'元'
          }else{
            that.dataobj.setting.text= ts+" "+cycleInfos.rates[ratesNumber][Number(that.dataobj.setting.enFundDate)-1]+textS+' 转入'+money1+'元'
          }
          that.status.scrollFlag = true
          that.noticeFun(dataobj.notice)//公告信息整合
          that.status.isSalary= that.dataobj.investmentType == '3' ? true : false
          that.status.isAuto= that.dataobj.setting.autoFlag == '491001' ? true : false
          //适当性入参
          dataobj.chosen_list=[
            {
              prdtId: that.dataobj.prdtId,
              prdtCode: that.status.prdtCode,
              investType: that.dataobj.investmentType,
              subFundAccount:that.status.subFundAccount,
              allotno: that.dataobj.setting.allotno,
              isSalary:that.status.isSalary
            }
          ]
          that.trend("2",0,1)
          
        },
        function(data) {
          ajax.hideLoading()
          $('.loader-wrapper').hide()
          if (typeof data.ERRORMESSAGE == 'undefined') {
            alert('网络连接失败')
          } else {
            alert(data.ERRORMESSAGE)
          }
          $('#wait').addClass('none')
        }
      )
    },
    
    noticeFun(notice){
      //公告信息整合
      const that = this
      const noticeArr = []
      
      for(var z=0; z < notice.length ; z++ ){//var z in notice  in在IOS9有兼容问题会执行两边
        const obj={}
        if(that.dataobj.notice[z].type == '1'){//风险测评失效
          if(that.dataobj.notice[z].isOrg){//是否是机构户
            obj.title='您当前风险测评已失效，请去就近营业部重新评估。'
            obj.close=that.dataobj.notice[z].forkOff
            that.status.riskObj.isOrg=true
          }else{
            obj.title='您当前风险测评已失效，请重新评估'
            obj.next=true//显示箭头跳转
          }
          that.status.riskObj.riskIsInvalid = true;
        }else if(that.dataobj.notice[z].type == '2'){//定投客户三方存管银行变更
          obj.title='您的三方存管银行发生变更，请确认变更结果及影响'
          obj.next=true//显示箭头跳转
        }else if(that.dataobj.notice[z].type == '3'){//风险要素变更
          obj.title='您自身或产品风险要素变更，请确认最新匹配结果'
          obj.next=true//显示箭头跳转
        }else if(that.dataobj.notice[z].type == '4'){//买入/卖出确认中
          obj.title=(that.dataobj.notice[z].confirmType=='1' ? '买入':'卖出')+
          ' '+that.dataobj.notice[z].confirmMoney +( that.dataobj.notice[z].confirmType=='1' ? '元':'份') + '，预计'+that.dataobj.notice[z].confirmDate+
          that.dataobj.notice[z].confirmFlag
          obj.next=true//显示箭头跳转
        }
        noticeArr.push(obj)
      }
      that.notice = noticeArr;
      that.$refs.bulletinBoard.swiperInit(that.notice);
      //公告信息整合结束
    },
    trend(type,index,cycle){
      var that = this
      //type 1\累计盈亏  2\定投收益率  3\成本单价  4\定投金额
      
      if(type == '2' && !cycle){
        cycle=1
      }
      if(!cycle){
        cycle=''
      }
      ajax.hideLoading()
      // this.rate.pt=['0']
      that.chartsNum = cycle-1 || 0
      var that = this
      ajax.run('/reqxml?action=27401&path=/time_invest/fixed_investment_trend&clientNo=($account)&subFundAccount='+
      that.status.subFundAccount+
      '&type='+type+
      '&cycle='+cycle,
      '',
      function(dataA) {
          that.num = index;
        that.showWaiting = false;
        // dataA.BINDATA='{"code":"0","msg":"success","trend":[{"date":"20/05/01","value":"1.2221"},{"date":"20/05/02","value":"1.0021"},{"date":"20/05/03","value":"1.0121"},{"date":"20/05/04","value":"1.1121"},{"date":"20/05/05","value":"1.1021"}]}'
        dataA = JSON.parse(dataA.BINDATA)
        var obj = {
          pt: [],
          date: [],
        }
        that.status.scrollFlag = true
        if(dataA.trend.length == 0){
          $(".aip-d-charts-line").addClass("none")
          that.rate = {
            pt: [],
            date: [],
          }
          return
        }else{
          $(".aip-d-charts-line").removeClass("none")
        }
         var decimals = 2,hasPercent = true;
        if(type == '3'){
          decimals = 4
          hasPercent =false
        }
        if(type == '4'){
          hasPercent =false
        }
        for (var h = 0; h < dataA.trend.length; h++) {
          obj.pt.push(Number(dataA.trend[h].value).toFixed(decimals) || '0')
          var td = dataA.trend[h].date.replace(
            /^\d{2}(\d{2})\-(\d{2})\-(\d{2})$/gi,
            '$1/$2/$3'
          )
          obj.date.push(td)
        }
        that.rate =obj
        runChartExtendObj.init(that.rate, 0, '246,72,67', '#aip-detail', decimals, hasPercent,type)


      })
    },
    scrollFlag(type){
      this.status.scrollFlag =type
    },
    weekDay(date){
      var dt = new Date(date.split("-")[0], date.split("-")[1]-1,date = date.split("-")[2]);
      var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      return weekDay[dt.getDay()];
    },
    holdingF(type) {
      this.status.holding = type
    },
    manner(type) {
      this.status.scrollFlag = false
      this.status.manner = type
      this.$refs.operation.status=this.status
      this.$refs.operation.dataobj=this.dataobj
      TalkingData.onHTSCEvent("click","leaf1227","1.0","理财_基金定投|定投详情页面|顶部|管理", "")
    },
    goIncomeDetails(){
      //收益明细跳转
      if(this.dataobj.investmentType == '1'){
        base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/account-holding/sy-detail-single-has-bonus.html?prdtCode='+this.status.prdtCode+'&subFundAccount='+this.status.subFundAccount)
      }else{
        base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/account-holding/sy-detail-single.html?prdtCode='+this.status.prdtCode+'&subFundAccount='+this.dataobj.setting.allotno)
      }
    },
    layer_back(){
       base.href('http://action:10002')
    },
    aip_record(tab,composeOrderId,orderSource,entrustDate){
      var that= this
      if(tab.type == '3'){//等待转入
        var money1 = ''
        if(tab.isIntelligent){
          if( tab.maxMoney){
            money1 = tab.minMoney+"～"+tab.maxMoney
          }else{
            money1 = tab.minMoney
          }
        }else{
          money1 = tab.money
        }
        var source = 0 //三方存管
        if(that.dataobj.setting.type == '1'){
            source = 0 //三方存管
        }else{
            source = 1 //华泰转入
        }
        base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-record-detail.html?prdtId='+that.dataobj.prdtId+'&subAccount='+that.status.subFundAccount+'&type='+tab.type+'&prdtCode='+this.status.prdtCode+'&money='+money1+'&name='+this.dataobj.name+'&source='+source)
      }else{
        base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-record-detail.html?prdtId='+that.dataobj.prdtId+'&subAccount='+that.status.subFundAccount+'&composeOrderId='+composeOrderId+'&orderSource='+orderSource+'&entrustDate='+entrustDate+'&type='+tab.type)
      }
    },
    fundDetail(){
      base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode='+this.status.prdtCode)
    },
    confirmClose() {
      this.confirmTypeShow = false
    },
    confirm_tip(){
      this.confirmTypeShow = true
    },
    chartsIicon(){
      var that = this;
      that.status.scrollFlag = false;
      var prompt = new window.Prompt({
        id: 'myAipPro',
        promptIcon: '', //图标，不传不显示
        title: '定投收益率', //不传则不显示标题
        content: '1、定投收益率，根据定投收益、持有份额以及成本单价估算而来。定投收益率除了受产品净值波动的影响，也会受到赎回、分红等情况的影响。<br>2、走势图仅提供2020年X月X后的数据。<br>3、以上数据为预估值，不作为投资者账户最终将能变现价值的保证，投资者账户的实际变现价值请以最终清算结果为准。',
        align: 'left',
        buttons: {
          btnNo: 1,
          left: {
            label: '确认',
            labelColor: '#136ddc',
            bgColor: '#ffffff',
            fontWight: '200',
            fontSize: '18px',
            callback: function() {
              that.status.scrollFlag = true;
            },
          }
        },
        quit: {
          callback: function() {
            that.status.scrollFlag = true;
          },
        },
      })
    },
    bulletinBoardTap(index){//公告跳转链接
      if(this.notice[index].next){
        if(this.dataobj.notice[index].type == '1'){//风险测评失效
          // window.riskalert.alert({
          //     content: '您的风险承受能力评估已过期，根据规定需要重新进行评估，是否现在评估？',
          //     ok: '风险评估',
          //     no: '取消',
          //     okfn: function () { //做风险测评
          //       var url = base.getRiskURL(2);
          //       base.href(url);
          //     },
          //     nofn: function () { //取消
          //       base.href("http://action:3413");
          //       return;
          //     }
          // });
          this.status.riskObj.isShowRisk = true
          this.status.scrollFlag =false
          this.status.riskObj.riskTitle ='风险测评已失效'
        }else if(this.dataobj.notice[index].type == '2'){//定投客户三方存管银行变更
          base.href("http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-detail-confirm.html?type=2&status=1&subFundAccount="+this.status.subFundAccount+"&prdtCode="+this.status.prdtCode)
        }else if(this.dataobj.notice[index].type == '3'){//风险要素变更
          if(this.dataobj.investmentType == '1'){//新定投
            base.href("http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-detail-confirm.html?type=3&status=2&subFundAccount="+this.status.subFundAccount+"&elementChangeFour="+this.dataobj.notice[index].elementChangeFour)
          }else{
            base.href("http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-detail-confirm.html?type=4&status=2&allotno="+this.dataobj.setting.allotno+"&elementChangeFour="+this.dataobj.notice[index].elementChangeFour)
          }
        }else if(this.dataobj.notice[index].type == '4'){//买入/卖出确认中
          base.href('http://action:10061?fullscreen=1&&type=9&&topColor=F64843&&url=/account/confirm.htm?fundtype=1');
        }
      }
    },
    moveScroll(e){//定投记录滚动
      // let scrollTop = this.$refs.scrollOne.pageYOffset || this.$refs.scrollOne.scrollTop || this.$refs.scrollOne.scrollTop;
      var listHeight=this.$refs.scrollOne.offsetHeight
      var listHei=this.$refs.listHei.offsetHeight
      if(e.target.scrollTop > listHei-listHeight-15){
        if(this.status.scrollLoad){
          this.status.scrollLoad =false
          this.loadMove()
        }
      }
    },
    loadMove(e){//定投记录接口请求
      var that = this
      that.status.pageNum++
      ajax.run(
        '/reqxml?action=27401&path=/time_invest/invest_record',
        {
          clientNo: '($account)',
          createTime:that.dataobj.createTime,
          pageNo:that.status.pageNum,
          prdtCode:that.status.prdtCode,
          subFundAccount: that.status.subFundAccount,
        },
        function(data) {
          var listData = JSON.parse(data.BINDATA)
          that.status.scrollLoad =true
          if (listData.code != '0') {
            that.status.pageNum--
            alert(listData.msg)
            return
          }
          if (listData.record.length == 0) {
            that.status.pageNum--
            return
          }
          for(var i =0; i< listData.record.length; i++){
            that.dataobj.record.push(listData.record[i])
          }
        }
      )
    },
    // 三匹配关闭
    listenMatchResultLayerClose({matchListObj,signId,close}) {
      this.status.scrollFlag = true
      if(close){//关闭按钮
        this.status.bShowMatchResultLayer = false;
        return
      }
      if(this.dataobj.investmentType == "1"){// 新定投恢复会有matchListObj，signId
        matchListObj[0].signId=signId
      }
      //准备调用恢复接口
      this.dataobj.status=this.status
      this.$refs.operation.recover(matchListObj);
    }
  },
  filters: {
    formatMoney: function(money) {
      return money == '--' ? money : base.formatMoney(money, 2)
    },
    formatMoneySign: function(money) {
      var text = ''
      if (Number(money) >= 0) {
        text = '+'
      }
      if (money == 0) {
        return  '+0.00'
      }
      return  money == '--' ? money : (text +base.formatMoney(money, 2))
    },
  },
}
</script>
<style src="./Home.css"></style>
