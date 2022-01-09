<template>
  <div class="detail-confirm-note">
    <div class="note-header">
      <img src="../assets/warning.png" alt="" />
      <span>{{ heaerTitle }}</span>
    </div>
    <!-- 三方存管变更 -->
    <template v-if ="statusType === '1'">
      <p>{{!changeable ? '您定投计划的银行卡自动转入服务因存管银行卡变更已失效，且新银行卡不支持自动转入服务，为保持定投计划正常执行，您可修改定投转入方式为资金账户，并手动转入足够资金。'
        : type === '1' ? '您定投计划的银行卡自动转入服务因存管银行卡变更已失效。为保持定投计划正常执行，您可在此统一确认并重新签署协议，也可前往定投计划详情页逐笔确认。'
        : '您定投计划的银行卡自动转入服务因存管银行卡变更已失效。为保持定投计划正常执行，您可在此确认并重新签署协议。'}}</p>
    </template>
    <!-- 风险要素变更 -->
    <template v-if ="statusType === '2'">
      <p v-if="elementChangeFour">
        <template v-if="type === '1'">尊敬的客户您好，由于您的自身风险承受能力发生变更，目前为保守型(最低)风险承受能力，<em>后续与您风险要素不匹配的产品将无法继续定投</em>，请知悉。为保持其它定投计划正常执行，您可在此统一对相关产品适当性要素做确认，也可前往定投计划详情页逐笔确认。</template>
        <template v-else>尊敬的客户您好，由于您的自身风险承受能力发生变更，目前为保守型(最低)风险承受能力，后续与您风险要素不匹配的产品将无法继续定投，请知悉。</template>
      </p>
      <p v-else>
        <template v-if=" type === '1'">您自身或产品风险要素发生变更时，可能会导致您与定投产品风险要素不匹配。为保持定投计划正常执行，您可在此统一对相关产品适当性要素做确认，也可前往定投计划详情页逐笔确认。</template>
        <template v-else>您自身或产品风险要素发生变更时，可能会导致您与定投产品风险要素不匹配。为保持定投计划正常执行，您可在此对相关产品适当性要素做重新确认。</template>
      </p>
    </template>
  </div>
</template>

<script>
import base from 'base';
export default {
  name: 'note',
  props: {
    statusType: Number,
    changeable: Boolean,
    elementChangeFour: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      type: 1, // 1 从定投详情进入
    }
  },
  mounted() {
    // this.elementChangeFour = base.getUrlParameter('elementChangeFour') === 'true' ? true : false;
    this.type = base.getUrlParameter('type') || '1';
  },
  computed: {
    heaerTitle() {
      return this.statusType == 1 ? '三方存管变更' : '风险要素变更'
    },
    listHeight() {
      if (!this.moreFlag) {
        return '267px'
      } else {
        return this.list.length * 89 + 'px'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.detail-confirm-note {
  width: 375px;
  padding: 15px;
  background-color: #fef8eb;
  .note-header {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    height: 22px;

    img {
      width: 18px;
      height: 18px;
      margin-right: 6px;
    }
    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      line-height: 22px;
      color: #f66a14;
      padding-top: 3px;
    }
  }

  p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 22px;
    color: #1c1c1c;

letter-spacing: 0;
text-align: justify;
    em {
      font-weight: 700;
    }
  }
}
</style>
