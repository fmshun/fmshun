<template>
  <div id="use-nav-top-app">
    <navtop title="资金自动转入服务说明" :leftEvent="btnEnsureHandler"></navtop>
    <div class="content">
      <div class="container">
        <p>
          1.自动转入资金服务（下称“本服务”）是指华泰证券为符合条件的客户定期从主资金账户绑定的银行卡（下称“银行卡”）向资金账户划转定额资金。
        </p>
        <P>
          2.目前持有以下银行储蓄卡的客户，在银行卡与主资金账户绑定，且签署《自动转入资金服务》协议后可开通本服务。
          <br />
          支持银行：{{ bankList.join('、') }}。
        </P>
        <P>
          3.划转资金的日期同您在设置定投计划时指定的投资日期，划转金额同投资金额。本服务的开通与定投计划逐一对应。如果自动转入资金日恰逢节假日，则顺延至下一交易日操作。
        </P>
        <P>
          4.本服务仅提供银行卡向资金账户的资金划转，是否成功与否取决于银转证时银行卡状态是否正常、卡内余额是否充足等多重因素，华泰证券不保证划转一定成功，转入结果请留意银行及证券端的资金流水。
        </P>
        <P>
          5.本服务的终止与定投计划逐一对应。定投计划终止或暂停时，与计划对应的自动转入资金服务将终止。
        </P>
        <P>
          6.若日间将通过本服务转入的资金用于其他交易，可能导致定投计划购买基金份额失败，请保障16：00前账户可用余额充足，如有需要可通过手动转入资金的方式临时补足账户余额。
        </P>
        <P>
          7.自动转入资金服务生效期间，如变更主资金账户的银行卡，则与原三方存管银行建立的相关自动转入资金服务计划失效，不再为您自动转入。如您仍需变更存管银行卡，请先终止此服务后再行变更。
        </P>
        <P>
          8、若设置自动转入日为日期当天，则可能会出现无法自动转入的情况。则第一个转入日为下一个月当日之后的第一个交易日。
        </P>
      </div>

      <p class="confirm-agreement">
        <span>更多内容请查阅</span>
        <span class="c1" @click="jumpToAgr">《资金自动转入服务协议》</span>
      </p>

      <div class="btns-box">
        <div @click="confirm">确认，下一步</div>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import ajax from 'ajax'
import bankdata from '../../components/bank/bankdata'
import navtop from '@/components/nav-top/nav-top';

export default {
  name: 'App',
  metaInfo: {
    title: '资金自动转入服务',
  },
  components: {
    navtop,
  },
  data() {
    return {
      bankList: [],
      serialId: null,
      agrtList: null,
      getAgrFlag:false,
      confirmFlag: false,
    }
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    // 获取支持银行
    this.initBank();
  },
  methods: {
    // 顶部 返回
    btnEnsureHandler() {
      base.href('http://action:10002');
    },
    // 获取支持银行
    initBank() {
      // 获取支持银行
      ajax.run(
        '/reqxml?action=27006&path=/financing/salary/bank_list',
        '',
        ({ BINDATA }) => {
          const { code, msg, bankList = [] } = JSON.parse(BINDATA)
          if (code === '0') {
            for (let i in bankList) {
              this.bankList.push(
                bankdata.getDataByCode(bankList[i].interBankNo).name
              )
            }
          }
           $('.loader-wrapper').hide()
        },
        (err) => {
           $('.loader-wrapper').hide()
        }
      )
    },
    // 获取协议
    getAgr() {
      return new Promise((resolve, reject) => {
         ajax.run('/reqxml?action=27502&path=/financing/trade/paper_to_sign',
          {
              clientNo: '($account)',
              bizCode: '1009',
              prdtIdList: base.getUrlParameter('prdtId'),
              TFrom: '($tfrom)',
              token: '($token)',
          },({BINDATA})=> {
          const {
              code,
              msg = '网络超时，请稍后再试',
              serialId,
              agrtList
          } = JSON.parse(BINDATA);
          if (code === '0') {
            // 判断是否 查到 电子服务协议
            const newAgr = agrtList.filter(el => el.contractMainType == 1 && el.protocolNo == 'B000411')
            if (newAgr.length === 0) {
              this.$Toast('网络超时，请稍后再试')
              reject()
            } else {
              resolve({
                serialId,
                agrtList: newAgr[0],
              })
            }            
          } else {
            this.$Toast(msg)
            reject()
            this.getAgrFlag = false;
          }
          ajax.hideLoading()
      }, err => {
        ajax.hideLoading()
        this.$Toast(err.ERRORMESSAGE || '网络连接失败')
        reject()
        this.getAgrFlag = false;
      })
      })
     
    },
    // 资金自动转入服务协议
    async jumpToAgr(pdfs) {
      if (this.getAgrFlag) {
        return
      }
      this.getAgrFlag = true;
      ajax.showLoading();
      // 判断是否获取过协议
      if (!this.agrtList || !this.serialId) {
        const {serialId, agrtList} = await this.getAgr();
        this.serialId = serialId;
        this.agrtList = agrtList;
      }

      if (this.agrtList.agrtUrl) {
        base.href(`http://action:80022?func=${encodeURIComponent(JSON.stringify({
          title: '资金自动转入服务协议',
          pdfs: this.agrtList.agrtUrl,
          isTipShow: false,
          buttonText: '确定',
          topColor: 'ff8300',
        }))}'&&type=1`);
      }
      this.getAgrFlag = false;
      ajax.hideLoading();
    },
    // 确认，下一步
    async confirm() {
      if (this.confirmFlag) {
        return
      }
      this.confirmFlag = true;

      ajax.showLoading();
      if (!this.agrtList || !this.serialId) {
        const {serialId, agrtList} = await this.getAgr();
        this.serialId = serialId;
        this.agrtList = agrtList;
      }

      const agrtList = [{
        productId: this.agrtList.productId,
        protocolNo:this.agrtList.protocolNo,
        version:this.agrtList.version,
        classify: this.agrtList.classify,
        md5File: this.agrtList.md5File,
        fillingSourceId: this.agrtList.fillingSourceId,
        caSign: null,
      }];
      // 签订协议
      ajax.run('/reqxml?action=27502&path=/financing/trade/sign_paper',{
        clientNo: '($account)',
        bizCode: 1009,
        serialId: this.serialId,
        TFrom:  '($tfrom)',
        branchNo: '($khbranch)',
        fundAccount: '56809019', // '($fund_account)',
        password: '123123', //'($password)',
        sysNodeId: 2, //'($tztsysnodeid)',
        agrtList: JSON.stringify(agrtList),
        token: '($token)',
      }, ({BINDATA})=> {
        const flag = $(BINDATA).find('flag');
        const code = flag.attr('code');
        const msg = flag.attr('msg') || '网络连接失败';
        if (code === '0') {
          const signId = $(BINDATA).find('data').attr('signId');
          this.confirm_sfcg(signId); // 三方存管变更确认接口
        } else {
          ajax.hideLoading();
          this.$Toast(msg)
          this.confirmFlag = false;
        }
      }, err => {
        ajax.hideLoading();
        this.$Toast(err.ERRORMESSAGE || '网络连接失败')
        this.confirmFlag = false;
      })
    },
    // 二次确认
    confirm_sfcg(signId) {
      ajax.run('/reqxml?action=27401&path=/time_invest/confirm_sfcg',{
        clientNo: '($account)',
        fundAccount: '($fund_account)',
        subFundAccount: base.getUrlParameter('subFundAccount'),
        sysNodeId: '($tztsysnodeid)',
        signId: signId,
        TFrom:  '($tfrom)',
        token: '($token)',
        password: '($password)',
      }, ({BINDATA})=> {
        const {code, msg, list} = JSON.parse(BINDATA);
        if (code === '0') {
          // 关闭当前容器 跳入 到结果页面
          // let url = 'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-confirm-result.html?status=1'
          base.href('http://action:1964/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-confirm-result.html?status=1')
        } else {
          this.$Toast(msg)
        }
        ajax.hideLoading();
        this.confirmFlag = false;
      }, err => {
        ajax.hideLoading();
        this.$Toast(err.ERRORMESSAGE || '网络连接失败')
        this.confirmFlag = false;
      })
    }
  },
}
</script>

<style lang="less">
body,
html {
  width: 100%;
  height: 100%;
}
* {
  padding: 0;
  margin: 0;
}

.iphoneX {
  .content {
    padding-top: 93px;

    .btns-box {
      padding-bottom: 34px;
    }
  }
}

.content {
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 73px;

  .container {
    flex: 1;
    padding: 24px 25px 12px;
    overflow-y: auto;
    background-color: #fff;
    p {
      margin-bottom: 18px;
      font-size: 14px;
      line-height: 21px;
      color: #666;
      font-family: PingFangSC-Regular;
    }
  }

  .confirm-agreement {
    width: 100%;
    height: 57px;
    padding-top: 15px;
    padding-left: 25px;

    span {
      font-size: 13px;
      color: rgba(102, 102, 102, 0.77);
      font-family: PingFangSC-Regular;
    }

    .c1 {
      color: rgba(0, 118, 255, 0.77);
    }
  }

  .btns-box {
    width: 375px;
    // height: 92px;
    padding: 12px 25px 20px 27px;
    background: #fff;

    div {
      width: 323px;
      height: 44px;
      font-size: 18px;
      line-height: 44px;
      color: #fff;
      text-align: center;
      background-color: #ff8300;
      border-radius: 22px;
      font-family: PingFangSC-Regular;
    }
  }
}
</style>
