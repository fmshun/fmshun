<template>
  <div class="confirm_container">
    <div class="confirm_content bg_white">
      <img
        @click="closeConfirm"
        class="confirm_close"
        src="./assets/close.png"
        alt
      />
      <div class="confirm_title text_center">赎回份额</div>
      <div class="confirm_value flex flex_center flex_bottom">
        <div class="confirm_value_num">{{ formatShares }}</div>
        <div class="confirm_value_per">份</div>
      </div>
      <div class="confirm_bottom flex flex_middle">
        <div class="confirm_bottom_title">产品名称：</div>
        <div class="confirm_bottom_name ellipsis flex_item text_right">
          {{ name }}
        </div>
      </div>
      <div @click="ensureConfirm" class="confirm_footer text_center">确认</div>
    </div>
  </div>
</template>
<script>
import * as plugin from '@/components/Common'
export default {
  name: 'Confrim',
  props: {
    name: String,
    shares: String,
  },
  data() {
    return {
      clickFlag: false,
    }
  },
  computed: {
    // 1234->1,234
    formatShares() {
      return plugin.thousandBitSeparator(this.shares)
    },
  },
  methods: {
    // 点击右上角X，关闭弹窗
    closeConfirm() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      this.$emit('click-confirm-close')
      this.clickFlag = false
    },
    // 点击底部确认按钮
    ensureConfirm() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      this.$emit('click-confirm-ensure')
      this.clickFlag = false
    },
  },
}
</script>
<style lang="less">
@import '../../../../components/Common.less';
@import './Confrim.less';
</style>
