<template>
    <div class="fixed fund-layer-wrapper-aip" v-show="isShow">
        <div class="fixed-bottom-aip fund-inner-layer-aip">
            <div class="btn-close-aip" @click="closeAip()" ></div>
            <img src="../assets/layer-icon.png" alt>
            <p class="title-aip">{{status.riskTitle}}</p>
            <p class="sub-title-aip" v-if="status.isOrg">机构客户购买前需前往线下营业部<br>进行风险测评</p>
            <p class="sub-title-aip" v-else>购买前需重新进行测评</p>
            <p class="content-aip line05" v-if="!hasSigned && !status.isOrg">开始测评前需签署<span @click="jumpToPdf()">《{{riskDataObj.agrtName}}》</span>，本人同意开通升级、签署并愿意承担相应的风险和损失，使用数字证书签署并保存本业务相关协议的关键签署信息和文本。</p>
            <div class="btn-ensure-aip" @click="closeAip" v-if="status.isOrg">确认</div>
            <div class="btn-ensure-aip" @click="aipGoRisk" v-else-if='!hasSigned'>同意并开始测评</div>
            <div class="btn-ensure-aip" @click="aipGoRisk" v-else>开始测评</div>

        </div>
    </div>
</template>
<script>
import ajax from 'ajax'
import base from 'base'
//此组件调用三匹配接口 查询风险测评状态
export default {
  name: 'aipRecovery',
  props: {
    status: {
    },
  },
  data() {
    return {
        riskDataObj:[
            // "bizCode":"业务代码",
            // "agrtCode":"协议编号",
            // "agrtName":"协议名称",
            // "agrtVersion":"协议版本",
            // "agrtDigest":"协议摘要",
            // "agrtUrl":"协议地址"
        ],
        hasSigned:false,//是否签署过
        isShow:false,
        flag:false,
        scrollFlag:true
    }
  },

  mounted() {
    this.ajaxPaperToSign()
  },
  watch: {
   
  },
  computed: {
      
  },
  methods: {
    ajaxPaperToSign(){
        var that=this
        if(that.flag){
            return
        }
        that.flag =true
        ajax.showLoading()
        ajax.run(
        '/reqxml?action=27401&path=/agrt_center/query_e_file_contract',
        {
          clientNo: '($account)',
          branchNo: '($khbranch)',
          TFrom: '($tfrom)',
        },
        ({ BINDATA }) => {
          that.flag =false
          const {
            code,
            msg = '网络超时，请稍后再试',
            data,
            hasSigned,//hasSigned：是否签署过
            agrtList,
          } = JSON.parse(BINDATA);
          ajax.hideLoading()
          that.isShow=true
          if (code === '0') {
            that.hasSigned =hasSigned
            if(!hasSigned){
                that.riskDataObj =agrtList[0]
            }
          }
        },
        (err) => {
            that.flag =false
        }
      )
    },
    closeAip(){
        this.status.isShowRisk=false
        
        this.$emit('scrollFlag', this.scrollFlag)
    },
    aipGoRisk(){
        var that =this
        if(that.flag){
            return
        }
        that.flag =true
        if(!this.hasSigned){
            var agrtListA =[{"bizCode":that.riskDataObj.bizCode,"protocolNo":that.riskDataObj.agrtCode,"version":that.riskDataObj.agrtVersion}]
            ajax.run(
            '/reqxml?action=27401&path=/agrt_center/sign_e_file_contract',
            {
            clientNo: '($account)',
            fundAccount: '($fund_account)',
            agrtList: JSON.stringify(agrtListA),
            },({BINDATA}) => {
                ajax.hideLoading()
                that.isShow=true
                that.flag =false
                const flag = $(BINDATA).find('flag');
                const code = flag.attr('code');
                const msg = flag.attr('msg') || '网络连接失败';
                if (code === '0') {
                   that.status.isShowRisk=false
                   base.href(base.getRiskURL(2));
                } else {
                    alert(msg)
                }
            }, (err) => {
                that.flag =false
                alert(err.ERRORMESSAGE || "网络连接失败")
            })
        }else{
            that.status.isShowRisk=false
            that.flag =false
            base.href(base.getRiskURL(2));
        }
    },
    jumpToPdf() {
     var that = this
     var url = 'http://action:80022/?func='+encodeURIComponent(
        JSON.stringify({
          title: that.riskDataObj.agrtName,
          pdfs: that.riskDataObj.agrtUrl,
          topColor: 'F64843',
          isTipShow: false,
        }))+'&&type=1'
      base.href(url);
    },
  },
}
</script>
<style scoped>
.fund-layer-wrapper-aip {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.62);
}

.fund-layer-wrapper-aip .fixed-bottom-aip {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
}

.fund-layer-wrapper-aip .fixed-aip {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.fund-layer-wrapper-aip .mask-aip {
    background: rgba(51, 51, 51, 0.70);
    opacity: 1;
}

.fund-layer-wrapper-aip .fund-inner-layer-aip {
    /* 40 */
    padding-top: 30px;
    text-align: center;
    background: #FFFFFF;
}

.fund-layer-wrapper-aip img {
    position: relative;
    display: block;

    /* 80 */
    width: 80px;
    height: 80px;

    /* 20 */
    margin-bottom: 14px;

    /* 148 */
    margin-left: 148px;
}

.fund-layer-wrapper-aip .btn-close-aip {
    display: inline-block;
    float: right;

    /* 15+20+20 */
    width: 53px;
    height: 53px;

    /* -40 */
    margin-top: -40px;
    content: "";
    background-image: url(../assets/layer-close.png);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 15px 15px;
}

.fund-layer-wrapper-aip .title-aip {
    /* 4 */
    margin-bottom: 8px;
    font-family: PingFangSC-Medium;

    /* 22 */
    font-size: 21px;
    color: #333333;
    text-align: center;
    letter-spacing: 0;
}
.android .fund-layer-wrapper-aip .title-aip{
  font-weight: bold
}
.fund-layer-wrapper-aip .sub-title-aip {
    /* 34 */
    margin-bottom: 26px;
    font-family: PingFangSC-Regular;
    /* 16 */
    font-size: 15px;

    /* 22 */
    line-height: 22px;
    color: #666666;
    text-align: justify;
    text-align: center;
    letter-spacing: 0;
}

.fund-layer-wrapper-aip .open-ta-aip {
    /* 21-34 */
    margin-top: -13px;

    /* 23 */
    margin-bottom: 23px;
    font-family: PingFangSC-Regular;

    /* 15 */
    font-size: 15px;
    color: #999999;
    text-align: center;
}

.fund-layer-wrapper-aip .open-ta-aip .open-ta-name-aip {
    font-family: PingFangSC-Regular;

    /* 15 */
    font-size: 15px;
    color: #333333;
}

.fund-layer-wrapper-aip .link-aip {
    font-family: PingFangSC-Light;

    /* 13 */
    font-size: 13px;

    /* 19 */
    line-height: 19px;
    color: #4990e2;
    text-align: justify;
    letter-spacing: 0;
}

.fund-layer-wrapper-aip .content-aip {
    padding: 0 30px;

    /* 30 */
    margin-bottom: 15px;
    font-family: PingFangSC-Light;

    /* 13 */
    font-size: 13px;

    /* 19 */
    line-height: 19px;
    color: #999999;
    text-align: justify;
    letter-spacing: 0;
}

.fund-layer-wrapper-aip .btn-ensure-aip {
  display: inline-block;
    width: 343px;
    height: 44px;
  margin-bottom: 15px;
  font-family: "PingFangSC-Regular";
  font-size: 17px;
    line-height: 44px;
  color: #ffffff;
    text-align: center;
    background: #ff8300;
    border-radius: 22px
}

.iphoneX .fund-layer-wrapper-aip .btn-ensure-aip {
    margin-bottom: 34px;
    border-bottom: 1px solid #ededed;
}

/* 联系服务经理 */
.fund-layer-wrapper-aip .link-account-manager-aip {
    font-family: PingFangSC-Regular;
    font-size: 15px;
    line-height: 23px;

    /* 15 */
    color: #4A90E2;
    text-align: justify;
}
.fund-layer-wrapper-aip .content-aip{
    padding: 0 30px;
    padding-top: 15px;

    /* 30 */
    margin-bottom: 30px;
    font-family: PingFangSC-Light;

    /* 13 */
    font-size: 13px;

    /* 19 */
    line-height: 19px;
    color: #999999;
    text-align: justify;
    letter-spacing: 0;
    border-top: solid 1px #e7e7e7
}
.content-aip span{
    width: 336px;
    height: 68px;
    font-family: "PingFangSC-Regular";
    font-size: 13px;
    font-weight: 400;
    color: #4a90e2;
}

</style>
