<template>
  <!-- 管理 -->
    <div class="aip-d-manage " v-show="status.manner" @click="mannerS(false)">
      <div class="aip-d-manage-list">
        <ul>
          <li class="line05" ref='reedemDom' v-if="dataobj.investmentType == '1' && dataobj.status != '4'" @click.stop="redeem" :class="{'grey': Number(dataobj.element.hold) == 0 || !dataobj.element.hold  || dataobj.status == '4'}">赎回</li>
          <li class="line05" ref='modifyDom' @click.stop="modify()" :class="{'grey': dataobj.status == '2' || dataobj.status == '3'  || dataobj.status == '4'}">修改</li>
          <li class="line05" ref='pauseDom' @click.stop="pausePop(false)" v-if="dataobj.status == '2' " :class="{'grey': dataobj.status == '3' || dataobj.status == '4'}">恢复</li>
          <li class="line05" ref='pauseDom' @click.stop="pausePop(true)" v-if="dataobj.status != '2' && (!status.isSalary || !status.isAuto)" :class="{'grey': dataobj.status == '3' || dataobj.status == '4' }">暂停</li>
          <li ref='stopDom' class="red" @click.stop="stopPop" :class="{'grey': dataobj.status == '3' || dataobj.status == '4'}">终止</li>
        </ul>
        <div class="aip-d-manage-center" @click="mannerS(false)">取消</div>
      </div>
    </div>
</template>

<script>
import ajax from 'ajax'
import base from 'base'
export default {
  name: 'operation',
  props: {
   
  },
  components: {},
  data() {
    return {
      dataobj: {
        element:{}
      },
      status:{},
      flag:false
    }
  },
  // inject : ['status'],
  created() {
    
  },
  mounted() {
   
  },
  destroyed() {
  },
  updated: function() {
    
  },
  methods: {
    mannerS(type){
      this.$parent.manner(type)
      this.status.scrollFlag = true
    },
    pausePop(type) {
      var that = this
      if(this.$refs.pauseDom.className.indexOf('grey') > -1){
        return
      }
      that.$parent.manner(false)

      if (type) {//暂停
        var that = this
        this.getTime(function(){//判断时间
          //新定投
          that.status.scrollFlag = false
          var prompt = new Prompt({
            id: 'givenId',
            promptIcon: '', //图标，不传不显示
            title: '温馨提示', //不传则不显示标题
            content: '确定现在暂停定投计划吗？计划暂停后将不再进行定时扣款，如有需要可恢复计划。',
            align: 'left',
            buttons: {
              btnNo: 2,
              left: {
                label: '取消',
                labelColor: '#909090',
                bgColor: '#ffffff',
                fontWight: '200',
                fontSize: '18px',
                callback: function() {
                  that.status.scrollFlag = true
                },
              },
              right: {
                label: '确认暂停',
                labelColor: '#0076ff',
                bgColor: '#ffffff',
                fontWight: '200',
                callback: function() {
                  that.status.scrollFlag = true
                  if (that.dataobj.investmentType == '1') {//新定投
                    that.invest_operate('2',"定投已暂停")
                  } else {
                    that.status.configBizType = 32 //停止恢复
                    that.status.actionIn = 1 //0恢复 1停止
                    that.getTimeInvest("定投已暂停","2")
                  }
                },
              },
            },
            quit: {
              callback: function() {},
            },
          })
        },'当前定投计划正在执行中暂不支持暂停，建议18:00后尝试')
      } else {//恢复
        this.getTime(function(){//判断时间
          if(that.$parent.status.riskObj.riskIsInvalid){//风险测评失效
            that.$parent.status.riskObj.isShowRisk =true
            that.$parent.status.riskObj.riskTitle ='风险测评已失效'
          }else{
            //判断保守型最低类别弹窗在组件里面match_list接口报错提示了。
              that.status.bShowMatchResultLayer = true//打开三匹配弹窗
              that.status.scrollFlag = false

          }
        },'当前系统正在执行中，暂不支持恢复操作，建议18:00后尝试')
      }
      
    },
    recover(matchListObj) {
      var that =this
      if (that.dataobj.investmentType == '1') {//新定投
        that.invest_operate('1',"定投计划恢复成功",matchListObj)
      }else{
        //34清除标记在three-match-array 中调用
        that.status.configBizType = 32 //停止恢复
        that.status.actionIn = 0 //0恢复 1停止
        that.getTimeInvest("定投计划恢复成功","1")
      }
    },
    redeem(){//赎回
      var that =this
      if(this.$refs.reedemDom.className.indexOf('grey') == -1){
        that.$parent.manner(false)
        this.status.scrollFlag = true
        // this.getTime(function(){
          let end =0
          if( that.dataobj.status == '3'){
            end=1
          }
          base.href("http://action:10061/?type=9&&topcolor=ffffff&&fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/redeem.html?end="+end+"&prdtCode="+that.status.prdtCode+"&prdtId="+that.dataobj.prdtId+"&sub="+that.status.subFundAccount)
        // },'当前系统正在执行中，暂无法执行赎回操作，建议18:00后尝试')
      }
    },
    modify(){//修改
      if(this.$refs.modifyDom.className.indexOf('grey') >- 1){
        return
      }
      var that = this
      that.$parent.manner(false)
      that.status.scrollFlag = true
      this.getTime(function(){
        if (that.dataobj.investmentType == '1') {//新定投
          var url='http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/modify-aip.html?aipType='+(that.dataobj.investmentType == '1' ? '2' : '1')+
          '&prdtCode='+that.status.prdtCode+
          '&prdtId='+that.dataobj.prdtId+//基金ID
          '&subFundAccount='+that.status.subFundAccount+
          '&rate='+that.dataobj.element.rate//定投收益率
          base.href(url)
        }else{
          if (that.status.isSalary) {//工资理财
            var url = 'http://action:10061/?shownavigationbar=0&&type=9&&fullscreen=1&&url=/licai/salary-financing/add.htm?'
            +'reqmu=1'//是修改定投
            +'&prdtCode='+that.status.prdtCode//产品代码
            +'&balance='+that.dataobj.setting.dtBalance
            +'&enFundDate='+that.dataobj.setting.enFundDate
            +'&orgPositionStr='+that.dataobj.setting.positionStr
            +'&autoTransfer='+(that.status.isAuto ?'1':'0')//银证转账开通标识，登录/变更必传 [0 否; 1 是]
            +'&applyNo='+that.dataobj.setting.applyNo ;//原申请编号，二次确认必填
          }else{
            url = 'http://action:10061/?fullscreen=1&&topcolor=ff8400&&type=9&&url=/licai/fund-aip/mutual-set.htm?code='+ that.status.prdtCode +
            '&com='+that.dataobj.setting.fundCompany +
            '&fundName='+ encodeURIComponent(that.dataobj.setting.prdtName) +
            '&positionStr='+that.dataobj.setting.positionStr +
            '&reqmu=1&applyNo='+that.dataobj.setting.applyNo + 
            '&dtCycle='+ that.dataobj.setting.dtCycle + 
            '&dtBalance='+ that.dataobj.setting.dtBalance + 
            '&enFundDate='+ that.dataobj.setting.enFundDate+ 
            '&dtTerm='+ that.dataobj.setting.dtTerm + 
            '&totalCycle='+ that.dataobj.setting.totalCycle;
          }
          base.href(url)
        }
      },'当前系统正在执行中，暂不支持修改操作，建议18:00后尝试')
    },
    stopPop() {//终止
      if(this.$refs.stopDom.className.indexOf('grey') > -1){
        return
      }
      var that = this
      that.$parent.manner(false)
      that.getTime(function(){//判断时间
        
          var promptText='确定现在终止定投计划吗？终止后将不再进行定期扣款，且终止后不可恢复。'
          if(that.dataobj.description.type == '1'){//银行卡
              promptText='确定现在终止定投计划吗？终止后将不再进行定期扣款，自动转入资金服务也将一并终止，且终止后不可恢复。'
          }
          //新定投
          that.status.scrollFlag = false
          new window.Prompt({
            id: 'givenId',
            promptIcon: '', //图标，不传不显示
            title: '温馨提示', //不传则不显示标题
            content: promptText,
            align: 'left',
            buttons: {
              btnNo: 2,
              left: {
                label: '取消',
                labelColor: '#909090',
                bgColor: '#ffffff',
                fontWight: '200',
                fontSize: '18px',
                callback: function() {
                  that.status.scrollFlag = true
                },
              },
              right: {
                label: '确认终止',
                labelColor: '#0076ff',
                bgColor: '#ffffff',
                fontWight: '200',
                callback: function() {
                  if (that.dataobj.investmentType == '1') {//新定投
                    that.status.scrollFlag = true
                    that.invest_operate('3',"定投已终止")
                  }else{
                    that.status.scrollFlag = true
                    that.status.configBizType = 33 //终止
                    that.getTimeInvest("定投已终止","3")
                  }
                },
              },
            },
            quit: {
              callback: function() {},
            },
          })
      },'当前系统正在执行中，暂不支持终止操作，建议18:00后尝试')

    },
    getTimeInvest(mess,type) {
      //老定投调用的接口
      //终止接口
      var that = this
      var option = {
        configBizType: that.status.configBizType, //业务类型 30登记、31修改、32停止恢复、33终止、34变更到三匹配
        actionIn: that.status.actionIn, //0恢复 1停止
        clientNo: '($account)',
        TFrom: '($tfrom)',
        fundAccount: '($fund_account)',
        password: '($password)',
        sysNodeId: '($tztsysnodeid)',
        prdtCode: that.status.prdtCode,
        orgPositionStr: that.dataobj.setting.positionStr, // 原定位串，修改/启停/终止必填
      }
      var registration,
        url = '/reqxml?action=27401&path=/financing/salary/action'
      //如果是工资理财
      if (that.status.isSalary) {
        registration = {
          opType: 1, //工资理财
        }
      } else {
        registration = {
          opType: 2, //普通定投
        }
      }
      option = $.extend(registration, option)

      ajax.showLoading()
      if(that.flag){
        return
      }
      that.flag =true
      ajax.run(
        url,
        option,
        function(data) {
          var b = data.BINDATA,
            code = $(b).find('flag').attr('code'),
            msg = $(b).find('flag').attr('msg')
          that.status.bShowMatchResultLayer = false;
          that.$parent.manner(false)
          that.status.scrollFlag = true
          if (code != 0) {
            // code为0是成功，其他为失败
            ajax.hideLoading()
            if (
              msg == '该基金公司在交易参数设置中被设置为暂停交易' ||
              msg == '交易时间非法' ||
              msg == '该功能禁止在目前系统状态下运行'
            ) {
              msg = '系统正在努力清算中，该业务稍后开放'
            }
            var title =''
            if(type == "1"){
              title="定投恢复失败"
            }else if(type == "2"){
              title="定投暂停失败"
            }else if(type == "3"){
              title="定投终止失败"
            }
            base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-fail.html?msg='+encodeURIComponent(msg)+'&setPageTitle='+encodeURIComponent(title))
          
          } else {
            ajax.hideLoading()
            var toastImg=require('../assets/aip-detail8.png' )
            var modal = new Toast({
                id: "aip-detail-c",
                text: mess,//必填
                delay:4000,
                icon: toastImg,
                callback:function(){
                }
            });
            setTimeout(()=>{
              that.$parent.getDetailList()// 刷新页面
            },4000)

          }
          that.flag =false
        },
        function(data) {
          that.status.scrollFlag = true
          that.flag =false
          var msg = data.ERRORMESSAGE
            ? data.ERRORMESSAGE
            : '请求超时,请稍后再试'
          var title=''
          if(type == "1"){
            title="定投恢复失败"
          }else if(type == "2"){
            title="定投暂停失败"
          }else if(type == "3"){
            title="定投终止失败"
          }
          base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-fail.html?msg='+encodeURIComponent(msg)+'&setPageTitle='+encodeURIComponent(title))
          ajax.hideLoading()
          
        }
      )
    },
    invest_operate(type,mess,matchListObj){//新定投（智能定投）---1、恢复  2、暂停 3、终止
      var that = this
      if(that.flag){
        return
      }
      that.flag =true
      var option = {
        clientNo: '($account)',
        TFrom: '($tfrom)',
        fundAccount: '($fund_account)',
        sysNodeId: '($tztsysnodeid)',
        prdtId: that.dataobj.prdtId,
        subFundAccount: that.status.subFundAccount, 
        type: type
      }
      if(type == "1"){
        var obj={
          signId:'',
          agrType:'',
          riskFlag:'',
          termFlag:'',
          varietyFlag:''
        }
        matchListObj.forEach(el => {
          const { prdtCode, riskMatchList, riskMatchResult} = el;
          obj.agrType= el.riskMatchResult
          obj.signId= el.signId
          // 811010-风险承受能力，811013-偏好品种，811014-投资期限
          riskMatchList.forEach(risk => {
            switch(risk.itemType) {
              case '811010':
                obj.riskFlag = risk.itemResult;
                break;
              case '811013':
                obj.varietyFlag = risk.itemResult; 
                break;
              case '811014':
                obj.termFlag = risk.itemResult; 
                break;
              default:
                break;
            }
          })
        })
      }
      option = {...option,...obj}
      ajax.showLoading()
     
      ajax.run('/reqxml?action=27401&path=/time_invest/invest_operate',
        option,
        function(data) {
          that.flag =false
          var dataResult = JSON.parse(data.BINDATA)
          ajax.hideLoading()
          that.status.bShowMatchResultLayer = false;
          that.$parent.manner(false)
          that.status.scrollFlag = true
          if (dataResult.code != '0') {
            var title =''
            if(type == "1"){
              title="定投恢复失败"
            }else if(type == "2"){
              title="定投暂停失败"
            }else if(type == "3"){
              title="定投终止失败"
            }
            base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-fail.html?msg='+encodeURIComponent(dataResult.msg)+'&setPageTitle='+encodeURIComponent(title))
            return
          }
          setTimeout(()=>{
            that.$parent.getDetailList()// 刷新页面
            that.status.scrollFlag = true
          },2000)
          var toastImg=require('../assets/aip-detail8.png' )
          var modal = new Toast({
            id: "aip-detail-c",
            text: mess,//必填
            delay:2000,
            icon: toastImg,
            callback:function(){
            }
          });
          
        },
        function(data) {
          that.status.scrollFlag = true
          that.flag =false
          var msg = data.ERRORMESSAGE
            ? data.ERRORMESSAGE
            : '请求超时,请稍后再试'
          ajax.hideLoading()
          var title =''
          if(type == "1"){
            title="定投恢复失败"
          }else if(type == "2"){
            title="定投暂停失败"
          }else if(type == "3"){
            title="定投终止失败"
          }
          base.href('http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-fail.html?msg='+encodeURIComponent(msg)+'&setPageTitle='+encodeURIComponent(title))
        }
      )
    },
    getTime(fn,text,text2){//请求交易日时间== //15:00-18:00判断
     var that= this
     if(that.flag){
        return
      }
     that.flag =true
     ajax.run('/reqxml?action=27006&path=/common/time',{tradingDay: 1},
        function(data) {
          that.flag =false
          var timeData = $(data.BINDATA)
          if (timeData.find('flag').attr('code') != '0'){
            return
          }
          that.status.currentTime=timeData.find('data').attr('currentTime') //当前时间，格式为2017-11-29 10:01:02
          that.status.todayIsTradingDay=timeData.find('data').attr('todayIsTradingDay')//今日是否是交易日，0否1是
          var reg = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
          //如果是交易日 && 有当前时间 && 符合日期格式
          if (that.status.todayIsTradingDay === '1' &&
              that.status.currentTime &&
              reg.test( that.status.currentTime)) 
          {
              //获取服务器时间 hh:mm:ss => hhmmss
              var serverTime = that.status.currentTime.slice(-8).replace(/:/g, '');
              if (serverTime >= '150000' &&  serverTime <= '180000' &&  that.status.todayIsTradingDay === '1') {
                that.$parent.manner(false)
                var modal = new Toast({
                    id: "aip-detail-c",
                    text: text,//必填
                    delay:2000,
                    callback:function(){
                      that.status.scrollFlag = true
                    }
                });
              }else{
                return fn && fn()
              }
          }else{
            return fn && fn()
          }
          
        },function(){
          that.flag =false
        }
      )
    }
  }
}
</script>
