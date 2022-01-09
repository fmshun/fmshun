<template>
  <div class="match-layer" v-show="layerFlag" @touch.stop=''>
    <div class="content">
      <img src="./images/close.png" class="btn-close" @click="closeHandler" />
      <div class="title">
        <span>适当性确认</span>
      </div>

      <div class="inner-content" v-if="matchList">
        <div class="container_wrapper"
          v-for="key in Object.keys(matchList)" :key="key">
          <template v-if="matchList[key].length > 0">
            <p class="c-title">
              <span v-if="is_singleProduct">您的风险评估与该金融产品：</span>
              <span v-else>您的风险评估与以下金融产品：</span>
              <span :class="[key === 'notMatch' ? 'c-title-nomatch':'c-title-match']">{{key === "match" ? '完全匹配' : '不匹配' }}</span>
            </p>

            <div
              class="match-container"
              v-for="(matchItem, idx) in matchList[key]"
              :key="idx">
              
              <p class="math-header-title"  v-if="!is_singleProduct">{{matchItem.name}}</p>

              <div v-for="risk in matchItem.riskMatchList" :key="risk.itemType" class="match-bx">
                <p :class="{
                  'c-up': true,
                  'c-up-nomatch': risk.itemResult === 'N'
                }">
                  {{riskMatchObj[risk.itemType].tit}}{{ risk.itemResult === 'Y' ? '匹配' : '不匹配'}}
                </p>
                <p class="c-do">{{riskMatchObj[risk.itemType].clientText}}：{{risk.clientValueText}}</p>
                <p class="c-do">{{riskMatchObj[risk.itemType].prdtText}}：{{risk.prdtValueText}}</p>
                <p class="c-words" v-if="risk.itemResult === 'N'">{{riskMatchObj[risk.itemType].warning}}</p>
              </div>
            </div>

             <div class="c-say">
              <p class="c-say-tit">确认声明</p>
              <p v-if="key === 'match'">
                我司已经向您充分揭示了该金融产品的风险。您的风险承受能力等级、拟投资期限、拟投资品种等投资目标与该金融产品的风险等级、投资期限、投资品种相匹配。但上述匹配结果，并不能取代您的投资判断，也不会降低该金融产品的固有风险，与该金融产品相关的投资风险、履约责任以及费用等将由您自行承担。我司就上述适当性评估结果与您进行确认，并建议您审慎考察该金融产品的特征及风险，进行充分风险评估，自行做出投资决定。如后期您的适当性信息发生变化，导致上述匹配结果与本确认书中载明的不一致后，我司有权暂停或终止提供该项金融服务。
              </p>
              <p v-else>
                我司就上述情况向您做出提示，并建议您应当审慎考察该金融产品的特征及风险，自行做出充分风险评估。但上述匹配结果，并不能取代您的投资判断，也不会降低该金融产品的固有风险，与该金融产品相关的投资风险、履约责任以及费用等将由您自行承担。若您经审慎考虑后，仍坚持购买该金融产品，请签署下附投资确认书。如后期您的适当性信息发生变化，导致上述匹配结果与本确认书中载明的不一致后，我司有权暂停或终止提供该项金融服务。
              </p>
            </div>

            <div class="h-word">
              <div class="h-title">投资者确认书</div>
              <div class="h-text" v-if="key === 'match'">
                <p>
                  本人/本机构已认真阅读了贵司关于该金融产品的相关提示，并已充分了解该金融产品的特征和风险。
                </p>
                <p>
                  本人/本机构在此确认自身风险承受能力等级、拟投资期限、投资品种等投资目标与该金融产品风险等级、投资期限、投资品种等投资目标相匹配。
                </p>
                <p>
                  本人/本机构知悉因本人/本机构相关情况变化，与本确认书中载明的不一致后，贵公司有权暂停或终止向本人/本机构提供该项金融服务，对此本人无异议，并自愿承担由此可能造成的一切损失。
                </p>
                <p>
                  本人/本机构接受该项金融产品的决定，系本人/本机构独立、自主、真实的意思表达，与贵公司及相关从业人员无关。
                </p>
              </div>
              <div v-else class="h-text">
                <p>
                  本人/本机构已认真阅读了贵公司关于该金融产品的相关提示，并已充分了解该金融产品的特征和风险，充分知悉上述不匹配情况。
                </p>
                <p>
                  本人/本机构知悉因本人/本机构相关情况变化，与本确认书中载明的不一致后，贵公司有权暂停或终止向本人/本机构提供该项金融服务，对此本人无异议，并自愿承担由此可能造成的一切损失。
                </p>
                <p>
                  本人/本机构经审慎考虑后，仍坚持投资该项金融产品，并愿意承担该项金融产品的相关投资风险、履约责任、费用及可能引起的损失和其他后果。投资该项金融产品的决定，系本人/本机构独立、自主、真实的意思表达，与贵公司及相关从业人员无关。
                </p>
                <p><em>华泰证券及工作人员不存在直接或间接主动向本人/本机构推介该金融产品的行为。</em></p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <p class="f-ensure">
        <span>本人/本机构</span>
        <template v-if="electronic_agr && electronic_agr.bizCode">
          同意开通升级<span class="link" @click="jumpToPdf">《电子文件签署服务责任书》</span>,并
        </template>
        <span>已阅读、理解适当性匹配内容及投资者确认书内容，同意签署并愿意承担相应的风险和损失，使用数字证书签署并保存本业务相关协议的关键签署信息和文本。</span>
      </p>

      <div class="foot-btn">
        <span class="f-btn-right" @click="signEFileContract">确认，下一步</span>
      </div>
    </div>
  </div>
</template>

<script>
import local from 'local';
import base from 'base';
import ajax from 'ajax';

export default {
  name: 'matchresultlayer',
  props: {
    /**
     * hasSelfConfirmEvent true [{prdtCode: xxxx}]
     * hasSelfConfirmEvent false  签完协议 二次确认接口
     * [{
     *  prdtCode, subFundAccount, investType
     *  prdtCode: xxxx,
     *  prdtId
     *  investType: '1' 新定投 '2' 老定投
     *  subFundAccount:xxxxx 子账户
     *  allotno: xxxx  原申请编号，老定投二次确认必填
     *  isSalary   //true 1 工资理财  false 2普通定投
     * }]
     */
    chosen_list: Array, 
    /**
     * 签完协议sign_paper  调用自定义事件 或 二次确认接口
     */
    hasSelfConfirmEvent: {
      default: false
    },
    /**
     * 是否是单产品
     */
    is_singleProduct: {
      default: false,
    },
  },
  data() {
    return {
      layerFlag: false,
      prdtCodeList: [],
      electronic_agr: null, // 电子文件签署服务责任书
      matchList: null,
      matchListObj: [],
      riskMatchObj: {  // 811010-风险承受能力，811013-偏好品种，811014-投资期限
        '811010': {
          tit: '与您风险承受能力等级',
          clientText: '您的风险承受能力等级为',
          prdtText: '该产品风险等级为',
          warning: '高于您的风险承受能力等级。投资该项金融产品，可能导致高出您自身承受能力的损失。'
        },
        '811013': {
          tit: '与您投资品种',
          clientText: '您的拟投资品种为',
          prdtText: '该产品所属投资品种为',
          warning: '与您确认的投资品种不一致。'
        },
        '811014': {
          tit: '与您投资期限',
          clientText: '您的拟投资期限为',
          prdtText: '该产品投资期限为',
           warning: '无法满足您预期的流动性需求或导致其他额外风险。'
        },
      },
      curVersion: null, // 当前版本
      nextFlag: false,
    }
  },
  mounted() {
    this.pagerInit();
  },
  methods: {
    pagerInit() {
      this.chosen_list.forEach(item => {
        this.prdtCodeList.push(item.prdtCode);
      })
      this.match_list() // 三匹配
    },
    // 三匹配
    match_list() {
      ajax.run(
        '/reqxml?action=27401&path=/time_invest/match_list',
        {
          clientNo: '($account)',
          prdtCodeList:this.prdtCodeList.join(','),
          branchNo: '($khbranch)',
          TFrom: '($tfrom)',
        },
        ({ BINDATA }) => {
          const {
            code,
            msg = '网络超时，请稍后再试',
            notMatch,
            match,
            agrtList,
          } = JSON.parse(BINDATA);
          if (code === '0') {
            this.matchList = {
              notMatch,
              match,
            };

            this.matchListObj = [...notMatch, ...match];
            if (agrtList.length) {
              this.electronic_agr = agrtList[0];
            }
            this.layerFlag = true;
            
          } else if (code === '101006') {
            alert("您的风险承受能力为保守型（最低类别），根据监管要求，您不能购买高于您风险承受能力的产品。具体请联系您的服务经理。")
          }
          
          this.getDataFail((code === '0' || code === '101006') ? '' : msg, code !== '0');
        },
        (err) => {
          this.getDataFail(err.ERRORMESSAGE || '网络连接失败', true);
        }
      )
    },
    // 关闭三匹配
    closeHandler(par = {}) {
      this.$emit('listenMatchResultLayerClose', {
        close: true,
        ...par,
      })
    },
    // 获取接口失败  toast 内容 是否关闭三匹配
    getDataFail(msg, isClose = false, par = {}) {
      if (msg) {
        this.$Toast(msg);
      }
      if (!isClose) {
        this.nextFlag = false;
      }
      ajax.hideLoading();
      isClose && this.closeHandler(par);
    },
    // pdf
    async jumpToPdf() {
      if (!this.curVersion) {
        this.curVersion = await this.getVersion();
      }
      if (base.versionCompare(this.curVersion, '4.1.1') < 0) {
        //弹出层  确认按钮跳转
        this.$Dialog({
          title: '温馨提示',
          message:'您的当前财富通还是旧版本哦,为了保证协议签署的正常使用,请尽快升级至最新版本',
          btns: 2,
          cancelButtonText: '关闭',
          confirmButtonText: '去升级',
          submitCallback: () => {
            base.href(base.getAPPDownloadURL())
          },
        })
        return;
      }
      base.href(`http://action:80022?func=${encodeURIComponent(
        JSON.stringify({
          title: this.electronic_agr.agrtName,
          pdfs: this.electronic_agr.agrtUrl,
          topColor: 'F64843',
          isTipShow: false,
        })
      )}&&type=1`);
    },
    // 获取当前版本
    getVersion() {
      return new Promise((resolve) => {
        ajax.run('/reqlocal?upversion=', '', ({UPVERSION}) => resolve(UPVERSION));
      })
    },
    // 确认下一步
    async signEFileContract() {
      if (this.nextFlag) {
        this.$Toast('协议正在签署中')
        return;
      }
      this.nextFlag = true;
      ajax.showLoading();
      // 查协议
      const { serialId, agrtList_f } = await this.getPaperSign();
      // 签署电子签名约定书
      if (this.electronic_agr) {
        await this.signAgrt();
      }
      // 签署适当不适当协议
      const signId = await this.signPager(serialId, agrtList_f);
      // 存在自定义确认事件 执行自定义事件
      if (this.hasSelfConfirmEvent) {
        const { investType } = this.chosen_list[0];
        // 存在自定义事件 && 是新定投
        if (investType === '1') {
          this.$emit('listenMatchResultLayerClose',{
            matchListObj: this.matchListObj,
            signId,
          })
          return
        }
      }
      // 二次确认
      this.confirm_fxys(signId);
    },
    // 获取协议
    getPaperSign() {      
      return new Promise((resolve, reject) => {
        ajax.run('/reqxml?action=27502&path=/financing/trade/paper_to_sign',{
          clientNo: '($account)',
          bizCode: '1010',
          prdtCodeList: this.prdtCodeList.join(','),
          TFrom: '($tfrom)',
          token: '($token)',
        },({ BINDATA }) => {
          const {
            code,
            msg = '网络超时，请稍后再试',
            serialId,
            agrtList,
          } = JSON.parse(BINDATA)
          if (code === '0') {
            const agrtList_f = [];
            agrtList.forEach( agr => {
              agrtList_f.push({
                productId: agr.productId,
                protocolNo:agr.protocolNo,
                version:agr.version,
                classify: agr.classify,
                md5File: agr.md5File,
                fillingSourceId: agr.fillingSourceId,
                caSign: null,
              })
            })
            resolve({
              serialId,
              agrtList_f,
            })
          } else {
            this.getDataFail(msg)
            reject();
          }
      },
        (err) => {
          this.getDataFail(err.ERRORMESSAGE || '网络连接失败')
          reject(err);
        })
      })
    },
    // 签署电子签名约定书
    signAgrt() {
      return new Promise((resolve, reject) => {
        const agrtList = [{
          bizCode: this.electronic_agr.bizCode,
          protocolNo: this.electronic_agr.agrtCode,
          version: this.electronic_agr.agrtVersion
        }];
        ajax.run('/reqxml?action=27401&path=/agrt_center/sign_e_file_contract',{
          clientNo: '($account)',
          fundAccount: '($fund_account)',
          agrtList: JSON.stringify(agrtList),
          TFrom:  '($tfrom)',
        },({BINDATA}) => {
          const flag = $(BINDATA).find('flag');
          const code = flag.attr('code');
          const msg = flag.attr('msg') || '网络连接失败';
          if (code === '0') {
            const signId = $(BINDATA).find('data').attr('signId');
            resolve(BINDATA)
          } else {
            this.getDataFail(msg)
            reject(false)
          }
        }, err => {
          this.getDataFail(err.ERRORMESSAGE || '网络连接失败')
          reject(false);
        })
      })
    },
    // 签署适当不适当协议
    signPager(serialId, agrtList_f) {
      return new Promise((resolve, reject) => {
        if(!agrtList_f.length) {
          this.$Toast('协议查询失败')
          return;
        }

        ajax.run('/reqxml?action=27502&path=/financing/trade/sign_paper',{
          clientNo: '($account)',
          bizCode: 1010,
          serialId: serialId,
          TFrom:  '($tfrom)',
          branchNo: '($khbranch)',
          fundAccount: '($fund_account)',
          password: '($password)',
          sysNodeId: '($tztsysnodeid)',
          agrtList: JSON.stringify(agrtList_f),
          token: '($token)',
        }, ({BINDATA})=> {
          const flag = $(BINDATA).find('flag');
          const code = flag.attr('code');
          const msg = flag.attr('msg') || '网络连接失败';
          if (code === '0') {
            const signId = $(BINDATA).find('data').attr('signId');
            resolve(signId)           
          } else {
            this.getDataFail(msg)
            reject()
          }
        }, err => {
          this.getDataFail(err.ERRORMESSAGE || '网络连接失败')
          reject()
        })
      })  
    },
    // 二次确认
    confirm_fxys(signId) { 
      const older = []
      const matchListObj = {};

      this.matchListObj.forEach(el => {
        const { prdtCode, riskMatchList, riskMatchResult} = el;
        const obj = {
          agrType: el.riskMatchResult,
          prodCode: prdtCode,
        };
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
        matchListObj[prdtCode] = obj;
      })

      const subList = [];
      const newChose = [];
      this.chosen_list.forEach(chosen => {
        const { prdtCode, subFundAccount, investType } = chosen;
        const matchItem = matchListObj[prdtCode];
        if (investType === '1') {
          newChose.push({
            ...matchItem,
            subFundAccount
          })
        } else {
          // 新接口
          subList.push({
            orgAllotNo: chosen.allotno,  // 原申请编号，二次确认必填
            businessType: chosen.isSalary ? 302005 : 301005, //定投二次确认-301005,工资理财二次确认-302005
            prodID: chosen.prdtId,
            prodCode: prdtCode,
            agrType: matchItem.agrType, // 适当性协议书:1001/1002 匹配就是1001，不匹配时1002
            riskFlag: matchItem.riskFlag,  // 风险承受能力
            termFlag: matchItem.termFlag,  // 投资期限
            varietyFlag: matchItem.varietyFlag, // 偏好品种
          })
        }
      })


      let promiseFun = [];
      if (newChose.length) {
        promiseFun.push(this.new_confirm_fxys(signId, newChose))
      } 
      if (subList.length) {
        promiseFun.push(this.old_confirm_fxys(signId, subList))
      }

      this.promise_all(promiseFun);
    },
    // 老定投 二次确认
    old_confirm_fxys(signId, subList) {
      return new Promise((resolve, reject) => {
        ajax.run('/reqxml?action=27401&path=/time_invest/second_confirm', {
          clientNo: '($account)',
          TFrom: '($tfrom)',
          fundAccount: '($fund_account)',
          sysNodeId: '($tztsysnodeid)',
          signId: signId,
          subList: JSON.stringify(subList),        
          password: '($password)',
          token: '($token)',
        }, ({BINDATA}) => {
          const { code, msg, list} = JSON.parse(BINDATA);
          if (code === '0') {
            resolve(true)
          } else {
            reject(msg)
          }
        }, err => {
          reject(err)
        })
      })
    },
    promise_all(promiseFun) {
      Promise.all(promiseFun).then(res => {
        if (this.hasSelfConfirmEvent) {
          this.getDataFail('', true, {
            close: false
          });
          return;
        }
        // 跳转到成功页面
        base.href(`http://action:1964/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-confirm-result.html?status=2`);
      }).catch(err=>{
        if (this.hasSelfConfirmEvent) {
          ajax.hideLoading();
          this.layerFlag = false;
          base.href(`http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/edit-result-fail.html?msg=${encodeURIComponent(err)}&setPageTitle=${encodeURIComponent('定投恢复失败')}`)
          return;
        }
        this.getDataFail(err, true, {
          refresh: true,
        });
      })
    },
    // 新定投 二次确认
    new_confirm_fxys(signId, obj) {
     return new Promise((resolve, reject) => {
         ajax.run('/reqxml?action=27401&path=/time_invest/confirm_sdx',{
            clientNo: '($account)',
            fundAccount: '($fund_account)',
            signId: signId,
            sysNodeId: '($tztsysnodeid)',
            TFrom: '($tfrom)',
            jsonStr:JSON.stringify(obj),
          },
          ({ BINDATA }) => {
            const { code, msg, list} = JSON.parse(BINDATA);
            if (code === '0') {
              resolve(true)
            } else {
              reject(msg)
            }
          }, err => {
            reject(err)
          }
        )
      })
    }
  },
}
</script>

<style lang="less" scoped>
.wait-wrapper {
  z-index: 99999;
  background: rgba(255,255,255,0.5);
}
.match-layer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);

  .content {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 14px;
    background-color: #fff;

    .btn-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 13px;
      height: 13px;
    }

    .title {
      width: 100%;
      height: 51.5px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #666666;
      text-align: center;
      border-bottom: 0.5px solid #E7E7E7;
      padding-top: 15px;
    }

    .inner-content {
      position: relative;
      height: 260px;
      overflow: scroll;

      .c-title {
        margin-top: 24.5px;
        margin-bottom:29px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #323232;
        letter-spacing: 0;

        .c-title-nomatch {
          color: #FF8300;
          font-family: PingFangSC-Medium;
        }

        .c-title-match {
          font-family: PingFangSC-Medium;
        }
      }

      .match-container {
        width: 325px;
        padding-bottom: 7px;
        .math-header-title {
          position: relative;
          height: 22px;
          padding-left: 18px;
          margin-bottom: 13px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          line-height: 22px;
          color: #323232;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &::before {
            position: absolute;
            top: 50%;
            left: 1.5px;
            width: 3px;
            height: 16px;
            margin-top: -8px;
            content: '';
            background-color: #ff8400;
          }
        }
        
        .match-bx {
          margin-bottom: 23px;
          .c-up {
            position: relative;
            padding-left: 17px;
            margin-bottom: 6px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #323232;

            &.c-up-nomatch {
              color: #FF8300 ;
            }

            &::before {
              position: absolute;
              top: 50%;
              left: 0;
              width: 7px;
              height: 7px;
              margin-top: -4.5px;
              content: '';
              border: 1px solid #C1C1C1;
              border-radius: 50%;
            }
          }

          .c-do {
            padding-left: 17px;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            line-height: 19px;
            margin-bottom: 1px;
            color: #999;
          }

          .c-words {
            padding-left: 17px;
            margin-top: 4px;
            font-family: PingFangSC-Medium;
            font-size: 13px;
            line-height: 19px;
            color: #999;
          }
        }
      }

      .c-say {
        width: 325px;
        padding: 29px 0 34px;
        margin: 0 auto;
        font-family: PingFangSC-Regular;
        font-size: 11px;
        line-height: 17px;
        color: #999;
        text-align: justify;
        border-top: 0.5px solid #E7E7E7;
        border-bottom: 0.5px solid #E7E7E7;

        .c-say-tit {
          margin-bottom: 5px;
        }
      }

      .h-word {
        width: 325px;
        margin: 34px auto 15.5px;

        .h-title {
          margin-bottom: 14px;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 16px;
          color: #444;
          text-align: center;
          letter-spacing: 0;
        }

        .h-text {
          p {
            font-family: PingFangSC-Light, sans-serif;
            font-size: 13px;
            line-height: 18px;
            color: #666;
            text-align: justify;
            &.strong {
              font-family: PingFangSC-Medium, sans-serif;
              font-weight: 500;
            }
          }
        }
      }
    }

    .f-ensure {
      max-height: 102px;
      padding: 14px 20px;
      font-family: PingFangSC-Regular, sans-serif;
      color: #FF8300;
      text-align: justify;
      letter-spacing: 0;
      background: #FFF5EA;
      .link {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 13px;
        line-height: 18px;
        color: #508CEE;
        text-align: justify;
        letter-spacing: 0;
      }

      span {
        font-size: 13px;
      }
    }

    .foot-btn {
      width: 100%;
      padding-top: 12px;
      overflow: hidden;

      .f-btn-right {
        display: block;
        width: 345px;
        height: 46px;
        margin: 0 auto;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 18px;
        font-weight: 500;
        line-height: 46px;
        color: #fff;
        text-align: center;
        background: #ff8300;
        border-radius: 23px;
      }
    }
    
  }
}

.content {
  padding-bottom: 14px;
}
.iphoneX .content {
  padding-bottom: 34px; 
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
