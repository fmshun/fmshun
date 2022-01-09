<template>
  <div class="transferin-bank-layer" v-if="bShowBankLayer">
    <div class="mask"></div>
    <div class="outer-w">
      <div class="inner-w">
        <div class="close" @click="closeHandler">取消</div>
        <div class="title">选择转入方式</div>
        <div class="ensure" @click="ensureHandler">确定</div>
        <div class="op-w">
          <div
            class="op"
            @click="bankChooseHandler('htsc', $event)"
            :class="transferInType != 'bank' ? 'selected' : ''"
          >
            <div class="l1">
              <img src="./images/htsc-logo.png" />
              <span>华泰账户</span>
            </div>
            <div class="l2">华泰证券资金账户 {{ strFundAccount }}</div>
          </div>
          <div
            class="op"
            :class="opBankClass"
            @click="bankChooseHandler('bank', $event)"
          >
            <Bank class="l1" :bankCode="bankCode" :bankNum="bankNum"></Bank>
            <!-- <div class="l1">
                        <img :src="imgUrl">
                        <i>招商银行(0981)</i>
            </div>-->
            <div class="l2" v-if="bSupportAutoTransfer">
              请保持银行账户资金充足
            </div>
            <div class="l2" v-else>当前银行卡暂不支持自动转入</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Bank from '@/components/bank/Bank'
export default {
  name: 'transferinbanklayer',
  props: {
    listenBankClose: Function,
    listenBankChoose: Function,
    // bankChooseHandler: Function,
    fundAccount: String,
    bSupportAutoTransfer: Boolean,
    bankCode: String,
    bankNum: String,
    transferInType: String,
    bShowBankLayer: Boolean,
  },
  components: {
    Bank,
  },
  data() {
    return {}
  },
  watch: {
    bShowBankLayer: function() {
      let _this = this
      if (this.bShowBankLayer) {
        this.$nextTick(function() {
          _this.disableScroll()
        })
      }
    },
  },
  mounted() {},
  computed: {
    strFundAccount() {
      if (this.fundAccount) {
        let account = this.fundAccount
        return account.substr(0, 2) + '***' + account.substr(-3)
      }
      return '--'
    },
    opBankClass() {
      if (!this.bSupportAutoTransfer) {
        return 'disable'
      } else if (this.transferInType === 'bank') {
        return 'selected'
      }
      return ''
    },
  },
  methods: {
    closeHandler: function() {
      this.$emit('listenBankClose')
      this.enableScroll()
    },
    ensureHandler: function() {
      this.$emit('listenBankClose')
      this.$emit('listenBankChoose', this.transferInType)
      this.enableScroll()
    },
    bankChooseHandler: function(type, e) {
      let jqDom = $(e.target).parents('.op')
      if (jqDom.length == 0) {
        jqDom = $(e.target)
      }
      // 银行卡不支持自动转入时，不可以选择，置灰
      if (jqDom.hasClass('disable')) {
        return
      }
      // 已经选中的
      if (jqDom.hasClass('selected')) {
        return
      } else {
        jqDom.addClass('selected')
        jqDom.siblings().removeClass('selected')
      }
      this.transferInType = type
    },
    preventEvent: function(event) {
      event.preventDefault()
    },
    disableScroll: function() {
      $('.mask')
        .get(0)
        .addEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
    },
    enableScroll: function() {
      $('.mask')
        .get(0)
        .removeEventListener('touchmove', this.preventEvent, {
          passive: false,
        })
    },
  },
}
</script>
<style lang="less">
.iphoneX .transferin-bank-layer .outer-w .inner-w .op-w {
  padding-bottom: 54px;
}
.transferin-bank-layer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.6);

  .outer-w {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;

    .inner-w {
      position: relative;
      background-color: white;

      .title {
        font-family: PingFangSC-Regular;
        font-size: 17px;
        line-height: 60px;
        color: #323232;
        text-align: center;
        background-color: #f8f9fd;
      }

      .close {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        padding: 19px 20px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        line-height: 22px;
        color: #666666;
      }
      .ensure {
        position: absolute;
        top: 0;
        right: 0;
        display: inline-block;
        padding: 19px 20px;
        font-family: PingFangSC-Regular;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        line-height: 22px;
        color: #666666;
      }
      .op-w {
        padding: 20px;

        .op {
          position: relative;
          width: 335px;
          height: 75px;
          padding: 15px 20px;
          margin-top: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          &:first-child {
            margin-top: 0;
          }

          &::after {
            position: absolute;
            top: 15px;
            right: 20px;
            display: inline-block;
            width: 20px;
            height: 20px;
            content: '';
            background-image: url(./images/bank-check.png);
            background-size: 100% 100%;
          }

          &.selected::after {
            background-image: url(./images/bank-checked.png);
            background-size: 100% 100%;
          }

          &.disable {
            &::after {
              display: none;
            }
            .l1 {
              img {
                filter: progid:dximagetransform.microsoft.alpha(opacity=50);
                -moz-opacity: 1;
                opacity: 0.5;
              }

              span {
                color: #c5c5c5;
              }
            }

            .l2 {
              color: #999999;
            }
          }

          .l1 {
            span {
              font-family: PingFangSC-Regular;
              font-size: 18px;
              color: #323232;
              text-align: left;
            }

            img {
              display: inline-block;
              width: 18px;
              height: 18px;
              margin-top: -8px;
              margin-right: 8px;
              vertical-align: middle;
            }
          }

          .l2 {
            font-family: PingFangSC-Light;
            font-size: 13px;
            color: #969eb6;
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
