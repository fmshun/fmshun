<template>
  <div @click="goFundDetail" class="product flex flex_middle bg_white">
    <div class="name flex_item">
      <div class="flex">
        <div class="ellipsis">{{ name }}</div>
        <div>（{{ code }}）</div>
      </div>
    </div>
    <img class="more" src="./assets/arrow.png" alt />
  </div>
</template>

<script>
import base from 'base'
import { urls } from '@/components/Common'
export default {
  name: 'Product',
  props: {
    name: String,
    code: String,
  },
  data() {
    return {
      // 防重复点击
      clickFlag: false,
    }
  },
  mounted() {},
  methods: {
    // 跳转到基金详情页
    goFundDetail() {
      if (this.clickFlag) {
        return
      }
      this.clickFlag = true
      if (this.code && urls.fundDetail) {
        base.href(`${urls.fundDetail}${this.code}`)
      }
      this.clickFlag = false
    },
  },
}
</script>

<style lang="less">
@import '../Common.less';
@import './Product.less';
</style>
