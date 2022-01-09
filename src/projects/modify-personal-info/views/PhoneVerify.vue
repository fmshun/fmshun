<template>
  <div class="phone-verify">
    <section class="section-xgxx-yz">
      <p>
        请确认修改的信息为您本人真实有效的信息。信息修改需要手机验证码进行验证。
      </p>
      <!--短信验证码-->
      <div class="phone-demo">
        <div class="dt">
          <img class="phone-no-img" src="../assets/phoneNo.png" />
        </div>
        <div>
          <input
            type="text"
            name="text"
            class="mobile"
            readonly
            :value="phoneStr"
          />
          <div
            class="extraction get-sms-code-demo"
            :class="{ inactive: timerOn }"
            @click="clickSmsCode"
          >
            {{ smsBtnStr }}
          </div>
        </div>
      </div>
      <div class="bottom-line"></div>
      <div class="sms-code-demo">
        <div class="dt">
          <img class="sms-code-img" src="../assets/smsCode.png" />
        </div>
        <input
          placeholder="请输入验证码"
          type="tel"
          max="6"
          v-model="smsCode"
          class="mobile-node"
          name="smsCodeInput"
        />
        <img
          src="../assets/clear.png"
          class="clear-icon-style"
          v-show="smsCode != ''"
          @click="smsCode = ''"
        />
      </div>
      <!--语音验证码-->
      <div class="tip-div col-xs-12">
        <div class="tip1-span" v-show="tip1Show">
          <span class="normal">没收到短信？点击获取</span>
          <span class="warning" @click="clickVoiceCode">语音验证码</span>
        </div>
        <div class="tip3-span" v-show="tip3Show">
          语音验证码拨号中（{{ timerNumVoice }}s）
        </div>
      </div>
      <div class="section-xgxx-yz-btn btns" @click="verifyCode">确认修改</div>
    </section>
    <Loading :show="isLoading"></Loading>
  </div>
</template>

<script>
import * as Api from '../request/api'
import Loading from '@zl/loading'

let intervalId = null
let intervalIdVoice = null

export default {
  name: 'PhoneVerify',
  components: {
    Loading,
  },
  data() {
    return {
      phoneNum: '13050552311',
      tip1Show: false,
      tip3Show: false,
      smsBtnStr: '获取验证码',
      timerOn: false,
      timerNum: 60,
      timerNumVoice: 60,
      isLoading: false,
      smsCode: '',
      checkType: 'sms',
    }
  },
  computed: {
    phoneStr() {
      return this.phoneNum.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
    },
  },
  methods: {
    clickSmsCode() {
      if (this.timerOn) {
        return
      }
      this.tip1Show = true
      this.timerOn = true
      this.updateTimer('sms') //先调用一次，否则要等一秒
      intervalId = setInterval(() => {
        this.updateTimer('sms')
      }, 1000)
      // send sms
      Api.getSmsCode({
        mobileNo: this.phoneNum,
      })
        .then((res) => {
          if (res) {
            this.$Dialog({
              title: '系统提示',
              message: '成功',
            })
          }
        })
        .catch(() => {
          this.intervalEnd('sms')
          this.$Dialog({
            title: '系统提示',
            message: '网络连接失败，请稍后再试。',
          })
        })
    },
    clickVoiceCode() {
      this.tip1Show = false
      this.tip3Show = true
      this.updateTimer('voice')
      intervalIdVoice = setInterval(() => {
        this.updateTimer('voice')
      }, 1000)
      // send voice
      Api.getVoiceCode({
        mobileNo: this.phoneNum,
      })
        .then(() => {
          //提示
          this.$Toast('稍后华泰证券客服电话95597将电话告诉您验证码')
          this.checkType = 'voice'
        })
        .catch(() => {
          this.intervalEnd('voice')
          this.$Dialog({
            title: '系统提示',
            message: '网络连接失败，请稍后再试。',
          })
          //TODO just for demo
          this.checkType = 'voice'
        })
    },
    updateTimer(type) {
      if (type === 'sms') {
        if (this.timerNum === 0) {
          this.intervalEnd(type)
        } else {
          this.timerNum--
          this.smsBtnStr = this.timerNum + 's重新发送'
        }
      } else if (type === 'voice') {
        if (this.timerNumVoice === 0) {
          this.intervalEnd(type)
        } else {
          this.timerNumVoice--
        }
      }
    },
    intervalEnd(type) {
      if (type === 'sms') {
        clearInterval(intervalId)
        this.timerNum = 60
        this.smsBtnStr = '获取验证码'
        this.timerOn = false
      } else if (type === 'voice') {
        clearInterval(intervalIdVoice)
        this.timerNumVoice = 60
        this.tip3Show = false
        this.tip1Show = true
      }
    },
    verifyCode() {
      if (this.isLoading) {
        return
      }
      let regCode = /^\d{6}$/
      if (!regCode.test(this.smsCode)) {
        this.$Toast('验证码必须为6位数字！')
        return
      }
      this.isLoading = true
      let checkPara = {
        mobileNo: this.phoneNum,
        identityCode: this.smsCode,
      }
      if (this.checkType === 'sms') {
        Api.checkSmsCode(checkPara)
          .then((res) => {
            this.isLoading = false
            if (res.code === 0) {
              this.$router.push('/success')
            } else {
              this.$Dialog({
                isTitle: false,
                message: '您的验证码有误，请重新输入',
              })
            }
          })
          .catch(() => {
            this.isLoading = false
            // this.$Dialog({
            //   title: '系统提示',
            //   message: "网络连接失败，请稍后再试。",
            // });
            //TODO just for demo
            this.$router.push('/success')
          })
      } else {
        Api.checkVoiceCode(checkPara)
          .then((res) => {
            this.isLoading = false
            if (res.code === 0) {
              this.$router.push('/success')
            } else {
              this.$Dialog({
                isTitle: false,
                message: '您的验证码有误，请重新输入',
              })
            }
          })
          .catch(() => {
            this.isLoading = false
            // this.$Dialog({
            //   title: '系统提示',
            //   message: "网络连接失败，请稍后再试。",
            // });
            //TODO just for demo
            this.$router.push('/fail')
          })
      }
    },
  },
  mounted() {
    //TODO 读取本地电话localStorage(应该封装方法)
  },
}
</script>

<style scoped>
/* html,body{ */

/*    width:100%; */

/*    padding:0 ; */

/*    margin: 0; */

/*    overflow: hidden; */

/* } */
.container {
  width: 100%;
  color: #555;
  background-color: #f0f0f0;
}
.hide {
  display: none;
}
.phone-verify input {
  border: none;
}
.section-xgxx-yz-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px 0;
  font-size: 18px;
  color: #9f7624;
  text-align: center;
  background: #fff;
  border-top: 1px solid #ddd;
}
.section-xgxx-yz {
  padding-top: 19px;
}
.section-xgxx-yz p {
  padding: 0 10px 10px;
  font-size: 15px;
  line-height: 22px;
  color: #a8a8a8;
  text-align: start;
}
.phone-demo .dt,
.sms-code-demo .dt {
  max-height: 50px;
}
.section-xgxx-yz .phone-demo .dt,
.section-xgxx-yz .sms-code-demo .dt {
  float: left;
  margin-right: 19px;
}
.phone-no-img {
  width: 12px;
  margin: 14px 0 0 8px;
}

.section-xgxx-yz .phone-demo,
.section-xgxx-yz .sms-code-demo {
  height: 50px;
  padding: 0 14px;
  line-height: 50px;
  background: #fff;
}
.section-xgxx-yz .sms-code-demo {
  margin-top: -1px;
}
.bottom-line {
  width: 100%;
  height: 1px;
  margin-left: 14px;
  background-color: #ededed;

  /* border-bottom: 1px solid #ededed; */
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.sms-code-demo input::-webkit-input-placeholder {
  font-family: PingFangSC-Regular, serif;
  font-size: 15px;
  color: #ddd;
  letter-spacing: 0;
}
#sms-code {
  font-family: PingFangSC-Regular, serif;
  font-size: 17px;
  line-height: 24px !important;
  color: #323232;
}
.mobile {
  max-width: 200px;
  font-family: PingFangSC-Regular, serif;
  font-size: 17px;
  line-height: 50px;
  color: #323232;
  letter-spacing: 2px;
  background: #fff;
}
.get-sms-code-demo {
  box-sizing: content-box;
  float: right;
  width: 84px;
  height: 27px !important;
  margin-top: 10px;
  font-family: PingFangSC-Regular, serif;
  font-size: 12px;
  line-height: 27px;
  color: #ff8a21;
  text-align: center;
  letter-spacing: 0;
  background: #fff;
  border: 1px solid #ff8a21;
  border-radius: 4px;
}
.active {
  color: #ff8a21;
  border: 1px solid #ff8a21;
}
.inactive {
  color: #999;
  border: 1px solid rgba(153, 153, 153, 0.8);
}
.sms-code-img {
  width: 16px;
  margin: 14px 0 0 8px;
}
.mobile-node {
  width: 250px;
  margin-right: 50px;
  font-size: 17px;
  line-height: 24px;
  color: #323232;
}
.sms-code-demo .b-cancel {
  top: 18px;
  display: none;
  float: right;
  width: 14px;
  height: 14px;
  margin-top: 14px;
}
.tip-div {
  margin-top: 12px;
}
.tip-div div {
  margin-left: 14px;
}
.tip1-span,
.tip3-span {
  margin-bottom: 14px;
  font-family: PingFangSC-Regular, serif !important;
  font-size: 13px;
  line-height: 14px;
  text-align: start;
  letter-spacing: 0;
}
.normal {
  display: inline-block;
  color: #4a4a4a;
}
.warning {
  display: inline-block;
  color: #ff8a21;
  border-bottom: 1px solid #ff8a21;
}
.tip3-span {
  color: #df3031;
}
.popup-cover {
  opacity: 0.7 !important;
}
.popup.center {
  width: 100%;
  padding: 0 53px;
}
.popup .title {
  display: none;
}
.popup.center .content {
  padding: 0 15px;
  line-height: 23px;
  text-align: center;
  -webkit-box-pack: center;
}
.popup.center .bottom .button.single {
  font-size: 17px;
  color: #4a90e2;
  letter-spacing: -0.4px;
}
.clear-icon-style {
  position: absolute;
  right: 14px;
  width: 15px;
  height: 15px;
  margin-top: 20px;
}

.load {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}

.load img {
  position: absolute;
  top: 280px;
  left: -15px;
  width: 30px;
  margin-left: 50%;
}
</style>
