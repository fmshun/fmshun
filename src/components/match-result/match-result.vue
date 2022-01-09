<template>
  <div
    :class="{ blue: isTarget == '1' ? true : false }"
    class="com-match-layer-w"
    v-if="bShowMatchResultLayer"
  >
    <div class="mask"></div>
    <div class="content">
      <div class="title">适当性确认</div>
      <img src="./images/buyNew8.png" class="btn-close" @click="closeHandler" />
      <div class="inner-content" :class="{ needEFile: !bEFilePass }">
        <div class="c-title">
          您的风险评估与该金融产品：
          <span v-if="riskMatchResult === '1001'">完全匹配</span>
          <span v-else>不匹配</span>
        </div>

        <div v-if="matchResultItem.length === 1">
          <div class="c-up">
            <img src="./images/oval.png" />
            <p v-if="matchResultItem[0] && matchResultItem[0].result === 'Y'">
              {{ rText[0][0] }}
            </p>
            <p v-else class="red">{{ rText[1][0] }}</p>
          </div>
          <div class="c-do">
            您的风险承受能力等级为：{{
              matchResultItem[0] ? matchResultItem[0].cText : ''
            }}
          </div>
          <div class="c-do">
            该产品风险等级为：{{
              matchResultItem[0] ? matchResultItem[0].pText : ''
            }}
          </div>
        </div>
        <div v-else>
          <!-- 风险承受能力是否匹配 -->
          <template
            v-if="matchResultItem[0] && matchResultItem[0].result === 'Y'"
          >
            <div class="c-up">
              <img src="./images/oval.png" />
              <p>{{ rText[0][0] }}</p>
            </div>
            <div class="c-do">
              您的风险承受能力等级为：{{
                matchResultItem[0] ? matchResultItem[0].cText : ''
              }}
            </div>
            <div class="c-do">
              该产品风险等级为：{{
                matchResultItem[0] ? matchResultItem[0].pText : ''
              }}
            </div>
          </template>
          <template v-else>
            <div class="risk-unmatch">
              <div class="c-up">
                <img src="./images/oval.png" />
                <p class="red">{{ rText[1][0] }}</p>
              </div>
              <div class="c-do">
                您的风险承受能力等级为：{{
                  matchResultItem[0] ? matchResultItem[0].cText : ''
                }}
              </div>
              <div class="c-do">
                该产品风险等级为：{{
                  matchResultItem[0] ? matchResultItem[0].pText : ''
                }}
              </div>
              <div class="c-tip">
                高于您的风险承受能力等级。投资该项金融产品，可能导致高出您自身承受能力的损失。
              </div>
            </div>
          </template>
          <!-- 拟投资期限是否匹配 -->
          <div class="c-up">
            <img src="./images/oval.png" />
            <p v-if="matchResultItem[1] && matchResultItem[1].result === 'Y'">
              {{ rText[0][1] }}
            </p>
            <p v-else class="red">{{ rText[1][1] }}</p>
          </div>
          <div class="c-do">
            您的拟投资期限为：{{
              matchResultItem[1] ? matchResultItem[1].cText : ''
            }}
          </div>
          <div class="c-do">
            该产品投资期限为：{{
              matchResultItem[1] ? matchResultItem[1].pText : ''
            }}
          </div>
          <div
            class="c-do strong"
            v-show="matchResultItem[1] && matchResultItem[1].result !== 'Y'"
          >
            无法满足您预期的流动性需求或导致其他额外风险。
          </div>
          <!-- 拟投资品种是否匹配 -->
          <div class="c-up">
            <img src="./images/oval.png" />
            <p v-if="matchResultItem[2] && matchResultItem[2].result === 'Y'">
              {{ rText[0][2] }}
            </p>
            <p v-else>{{ rText[1][2] }}</p>
          </div>
          <div class="c-do">
            您的拟投资品种为：{{
              matchResultItem[2] ? matchResultItem[2].cText : ''
            }}
          </div>
          <div class="c-do">
            该产品所属投资品种为：{{
              matchResultItem[2] ? matchResultItem[2].pText : ''
            }}
          </div>
          <div
            class="c-do strong"
            v-show="matchResultItem[2] && matchResultItem[2].result !== 'Y'"
          >
            与您确认的投资品种不一致。
          </div>
        </div>

        <div v-if="riskMatchResult === '1001'" class="c-say">
          <p>确认声明</p>
          我司已经向您充分揭示了该金融产品的风险。您的风险承受能力等级、拟投资期限、拟投资品种等投资目标与该金融产品的风险等级、投资期限、投资品种相匹配。但上述匹配结果，并不能取代您的投资判断，也不会降低该金融产品的固有风险，与该金融产品相关的投资风险、履约责任以及费用等将由您自行承担。我司就上述适当性评估结果与您进行确认，并建议您审慎考察该金融产品的特征及风险，进行充分风险评估，自行做出投资决定。如后期您的适当性信息发生变化，导致上述匹配结果与本确认书中载明的不一致后，我司有权暂停或终止提供该项金融服务。
        </div>
        <div v-else class="c-say">
          <p>确认声明</p>
          我司就上述情况向您做出提示，并建议您应当审慎考察该金融产品的特征及风险，自行做出充分风险评估。但上述匹配结果，并不能取代您的投资判断，也不会降低该金融产品的固有风险，与该金融产品相关的投资风险、履约责任以及费用等将由您自行承担。若您经审慎考虑后，仍坚持购买该金融产品，请签署下附投资确认书。如后期您的适当性信息发生变化，导致上述匹配结果与本确认书中载明的不一致后，我司有权暂停或终止提供该项金融服务。
        </div>
        <div class="c-line"></div>
        <div class="h-word">
          <div class="h-title">投资者确认书</div>
          <div class="h-text" v-if="riskMatchResult === '1001'">
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
            <p class="strong">
              华泰证券及工作人员不存在直接或间接主动向本人/本机构推介该金融产品的行为。
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div v-if="bEFilePass" class="f-ensure">
        本人/本机构已阅读、理解适当性匹配内容及投资者确认书内容，同意签署并愿意承担相应的风险和损失，使用数字证书签署并保存本业务相关协议的关键签署信息和文本。
      </div>
      <div v-else class="f-ensure">
        本人/本机构同意开通升级
        <template></template>
        <span
          v-for="(item, index) in oEFileContract.agrtList"
          :key="index"
          class="link"
          :data-url="item.agrtUrl"
          @click="eClickHandler"
        >
          《{{ item.agrtName }}》
        </span>
        <!-- <span class="link">《电子文件签署服务责任书》</span> -->
        ，并已阅读、理解适当性匹配内容及投资者确认书内容，同意签署并愿意承担相应的风险和损失，使用数字证书签署并保存本业务相关协议的关键签署信息和文本。
      </div>
      <div class="foot-btn">
        <span class="f-btn-left" v-on:click="closeHandler">返回</span>
        <span class="f-btn-right" v-on:click="nextStep">确认，下一步</span>
      </div>
    </div>
  </div>
</template>
<script>
import local from 'local'
export default {
  name: 'matchresultlayer',
  props: {
    riskMatchResult: String,
    matchResultItem: Array,
    eFileContract: String,
    checkVersion: Function,
    // jumpPdf: Function,
    jumpEFilePdf: Function,
    bShowMatchResultLayer: Boolean,
    isTarget: String,
  },
  data() {
    return {
      rText: [
        ['与您风险承受能力等级匹配', '与您投资期限匹配', '与您投资品种匹配'],
        [
          '与您风险承受能力等级不匹配',
          '与您投资期限不匹配',
          '与您投资品种不匹配',
        ],
      ],
    }
  },

  mounted() {
    // [
    //   {
    //     result: 'Y',
    //     type: '811010',
    //     text: '风险承受能力',
    //     cText: '激进型',
    //     pText: '低风险',
    //   },
    //   {
    //     result: 'Y',
    //     type: '811014',
    //     text: '投资期限',
    //     cText: '无特别要求',
    //     pText: '无特别要求',
    //   },
    //   {
    //     result: 'Y',
    //     type: '811013',
    //     text: '偏好品种',
    //     cText: '固收类、权益类、期货、期权和两融、复杂或高风险产品、其他产品',
    //     pText: '债券、货币市场基金、债券基金等固定收益类投资品种',
    //   },
    // ]
    // base.log(this.matchResultItem)
  },
  watch: {
    bShowMatchResultLayer: function() {
      let _this = this
      if (this.bShowMatchResultLayer) {
        this.$nextTick(function() {
          _this.disableScroll()
        })
      }
    },
  },
  computed: {
    oEFileContract: function() {
      try {
        return JSON.parse(this.eFileContract) || {}
      } catch (err) {
        return {}
      }
    },
    bEFilePass: function() {
      return this.oEFileContract.pass || this.eFileContract == '{}'
    },
  },
  methods: {
    nextStep: function() {
      this.$emit('listenMatchResultLayerEnsure', true)
      this.enableScroll()
    },
    closeHandler: function() {
      this.$emit('listenMatchResultLayerClose', true)
      this.enableScroll()
    },
    eClickHandler: function(e) {
      let _this = this
      // ajax.showLoading()
      var pdfUrl = $(e.target).attr('data-url')
      local.saveObject(
        {
          jumpPdf: true,
        },
        function() {
          _this.jumpEFilePdf(pdfUrl)
        }
      )

      e.stopPropagation()
    },
    preventEvent: function(event) {
      event.preventDefault()
    },
    disableScroll: function() {
      $('.com-match-layer-w .mask')
        .get(0)
        .addEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
      $('.com-match-layer-w .foot')
        .get(0)
        .addEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
      $('.com-match-layer-w .title')
        .get(0)
        .addEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
      $('.com-match-layer-w .btn-close')
        .get(0)
        .addEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
    },
    enableScroll: function() {
      $('.com-match-layer-w .mask')
        .get(0)
        .removeEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
      $('.com-match-layer-w .foot')
        .get(0)
        .removeEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
      $('.com-match-layer-w .title')
        .get(0)
        .removeEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
      $('.com-match-layer-w .btn-close')
        .get(0)
        .addEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
    },
  },
}
</script>
<style lang="less" scoped>
.com-match-layer-w {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
}
.btn-close {
  position: absolute;
  top: 23px;
  right: 20px;
  width: 35px;
  height: 35px;
  padding: 10px;
  margin: -10px;
}
.title {
  padding-top: 31px;
  padding-bottom: 10px;
  font-family: PingFangSC-Medium, sans-serif;
  font-size: 18px;
  line-height: 25px;
  color: #4a4a4a;
  text-align: center;
  background: #fff;
}
.content {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 492px;
  background-color: #fff;
}
.inner-content {
  position: relative;
  max-height: 421px;
  padding-bottom: 145px;
  overflow: scroll;
}
.inner-content.needEFile {
  padding-bottom: 183px;
}
.iphoneX .inner-content {
  /* 145+34 */
  padding-bottom: 180px;
}
.iphoneX .inner-content.needEFile {
  /* 183+34 */
  padding-bottom: 217px;
}
.c-title {
  padding-top: 12px;
  padding-left: 20px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 16px;
  line-height: 22px;
  color: #323232;
  letter-spacing: 0;
}

.c-title span {
  font-family: PingFangSC-Medium, sans-serif;
  font-size: 16px;
  line-height: 22px;
  color: #141414;
  letter-spacing: 0;
}
.c-up {
  position: relative;
  margin-top: 20px;
  margin-bottom: 4px;
  margin-left: 20px;
}
.c-up p {
  display: inline-block;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #323232;
  letter-spacing: 0;
}
.c-up.red {
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 14px;
  color: #f64843;
  letter-spacing: 0;
}
.c-up img {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-top: -2px;
  margin-right: 10px;
}

.c-do {
  margin-right: 37px;
  margin-left: 37px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 13px;
  line-height: 19px;
  color: #999;
  letter-spacing: 0;
}
.c-do.strong {
  margin-top: 3px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 13px;
  color: #4a4a4a;
}
.risk-unmatch {
  padding: 11px 7px 15px 24px;
  margin-top: 13px;
  margin-right: 20px;
  margin-left: 14px;
  background: #fffbe3;
  border: 1px solid #fff9d1;
  border-radius: 4px;
}
.risk-unmatch .c-up {
  margin-top: 0;
  margin-left: -17px;
}
.risk-unmatch .c-up p {
  display: inline-block;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 14px;
  color: #ff4637;
  letter-spacing: 0;
}

.risk-unmatch .c-do {
  margin-left: 0;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 13px;
  line-height: 19px;
  color: #999;
  letter-spacing: 0;
}
.risk-unmatch .c-tip {
  margin-top: 8px;
  font-family: PingFangSC-Medium, sans-serif;
  font-size: 12px;
  line-height: 17px;
  color: #a4752d;
  letter-spacing: 0;
}
.c-say {
  padding: 0 20px;
  margin-top: 35px;
  margin-bottom: 40px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 11px;
  line-height: 17px;
  color: #999;
  text-align: justify;
  letter-spacing: 0;
}
.c-say p {
  margin-bottom: 5px;
}
.c-line {
  margin: 0 20px;
  border-top: 1px solid #e7e7e7;
  opacity: 0.6;
}

/* foot */
.f-height {
  height: 55px;
}

.foot {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;

  /* border-top: 1px solid #ededed; */
  background-color: #fff;
}

.f-ensure {
  padding: 14px 20px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 13px;
  color: #ff8300;
  text-align: justify;
  letter-spacing: 0;
  background: #ffefdd;
}
.link {
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 13px;
  line-height: 18px;
  color: #508cee;
  text-align: justify;
  letter-spacing: 0;
}
.foot-btn {
  width: 100%;
  padding: 13px 0 14px 0;
  overflow: hidden;
  background: #fff;
}
.iphoneX .foot-btn {
  padding-bottom: 34px;
}
.f-btn-left {
  display: block;
  float: left;
  width: 169px;
  margin-left: 14px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 18px;
  line-height: 44px;
  color: #999;
  text-align: center;
  background: #ededed;
  border-radius: 23px;
}
.f-btn-right {
  display: block;
  float: left;
  width: 169px;
  margin-left: 9px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 18px;
  line-height: 44px;
  color: #fff;
  text-align: center;
  background: #ff8300;
  border-radius: 23px;
}

/* ------------投资者确认书------------- */
.h-word {
  /* 32 */
  padding: 0 24px 32px 22px;
}

.h-title {
  margin-top: 23px;
  margin-bottom: 14px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 16px;
  color: #444;
  text-align: center;
  letter-spacing: 0;
}

.h-text p {
  font-family: PingFangSC-Light, sans-serif;
  font-size: 13px;
  color: #666;
  text-align: justify;
  letter-spacing: 0;
}
.h-text .strong {
  font-family: PingFangSC-Medium, sans-serif;
  font-size: 13px;
  line-height: 18px;
  color: #2a2a2a;
  text-align: justify;
  letter-spacing: 0;
}

/* scroll bar hidden */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* iphoneX底部适配 */
.iPhoneX-fixBottom {
  bottom: 34px;
}

.iPhoneX-fixBottom::after {
  position: absolute;
  bottom: -34px;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 34px;
  content: '';
  background: #fff;
  border-top: 1px solid #eee;
}
.h-word.iphoneX {
  /* 122+34 */
  padding-bottom: 156px;
}

/* 目标盈样式 */
.blue .f-ensure {
  color: #999999;
  background: #f5f8ff;
}
.blue .f-btn-right {
  background: #1e86f8;
}
</style>
