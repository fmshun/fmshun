<template>
  <div class="confirm-item_wrap">
  <div class="confirm-item">
    <div class="confirm-mask" v-if="hasMask" @click.stop="next"></div>
    <i :class="['icon', item.isChosen || hasMask ? 'chosenImg' : 'unchosenImg']"
      @click="choseItem"
      v-if="changeable"/>

    <div :class="['right_box', !changeable ? 'noIcon' : '']"  @click="next">
      <div class="confirm-item-content">
        <p class="confrim-item-tit">{{item.name}}</p>

        <p class="confrim-item-desc"
          v-if="!item.isPause"
          >{{date}}(星期{{week}})从{{accountName}}存入<span v-if="item.isIntelligent">{{item.minMoney}}~{{item.maxMoney}}</span><span v-else>{{parseFloat(item.money).toFixed(2)}}</span>元</p>
      </div> 

      <img class="moreImg" src="../assets/more.png" alt="" />
    </div>
  </div>
  </div>
</template>

<script>
import bankdata from '@/components/bank/bankdata';
import base from 'base';
export default {
  name: 'note',
  props: {
    item: Object,
    changeable: {
      type: Boolean,
      default: true,
    },
    hasMask: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: 1,
      status: 1,
    }
  },
  created() {
    this.type = base.getUrlParameter('type') || '1';
    this.status = base.getUrlParameter('status') || 1; // status： 1 三方存管   2 风险要素
  },
  computed:{
      date() {
          const m = new Date(this.item.date).getMonth() + 1;
          const d = new Date(this.item.date).getDate();
          return `${m > 9 ? m : ('0' + m)}.${d > 9 ? d : ('0' + d)}`;
      },
      accountName() {
        const { type, bankType, bankCard } = this.item;
        if (type == '0') {
            return '华泰账户'
        }
        if (bankType) {
          const bank = bankdata.getDataByCode(bankType);
          const newBC = bankCard && bankCard.length > 4 ?  bankCard.slice(-4) : bankCard;

          let str = '';
          if (bank) {
            str += bank.name;
          }
          if (newBC) {
            str += `(${newBC})`
          }
          return str; 
        }
        return '--'
      },
      week() {
        return  '日一二三四五六'.charAt(new Date(this.item.date).getDay());
      },
  },
  methods: {
      choseItem() {
        this.$emit('choseItem', this.item);
      },
      next() {
        /**
         * status 1 三方  type 2 定投详情页
         * 定投详情 进入 三方 ，三方 进入详情
         * 
         * status 2 风险要素  type 3 定投详情页（新定投）4 定投详情页（老定投）
         * 定投详情 进入 三方 ，三方 进入详情
         */
        if ((this.type === '2' && this.status == '1') || (this.status === '2' && ['3', '4'].includes(this.type))) {
          base.href('http://action:10002');
          return;
        }
        //"investType":"定投类型：1-新定投，2-老定投",
        const subFundAccount = (this.status=== '2' && this.item.investType === '2') ? this.item.allotno : this.item.subFundAccount ;
        const url = `http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-detail.html?prdtCode=${this.item.prdtCode}&subFundAccount=${subFundAccount}`;
        /**
         * status 1 三方  type 1 其他  3 单产品
         * 其他/单产品 进入 三方， 三方 进入详情, 详情 返回到三方
         * 其他/单产品 进入 风险， 风险 进入详情, 详情 返回到风险
        */
        base.href(url);
        // if (this.status === '1') {
        //   base.href(url);
        //   return;
        // }
        // base.href(`http://action:1965/?url=${encodeURIComponent(url)}`);
      }
  }
}
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}

.confirm-item_wrap {
  width: 100%;
  background-color: #fff;
}
.confirm-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width:331px;
  margin: 0 24px 0 20px;
  padding-top: 20px;
  margin-left: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f2f2f2;

  .confirm-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(255,255,255, 0.4);
    z-index: 10;
  }

  .icon {
    width: 18px;
    height: 22px;
    margin-right: 12px;
    background-size: 100% 18px;
    background-repeat: no-repeat;
    background-position: center center;

    &.chosenImg {
      background-image: url('../assets/choose.png');
    }

    &.unchosenImg {
      background-image: url('../assets/unchoose.png');
    }
  }

  .right_box {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 19.5px;
    &.noIcon {
      width: 324px;

      .confirm-item-content {
        .confrim-item-tit {
          width: 300px;
        }
        .confrim-item-desc {
          width: 300px;
        }
      }
    }
    .confirm-item-content {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 296px;
      .confrim-item-tit {
        font-family: PingFangSC-Medium;
        width: 290px;
        height: 22px;
        font-size: 16px;
        line-height: 22px;
        color: #323232;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .confrim-item-desc {
        width: 290px;
        margin-top: 9px;
        line-height: 18px;
        color: #666;
        letter-spacing: 0;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        span {
          color: #323232;
          font-family: PingFangSC-Medium;
        }
      }


    }

    .moreImg {
      width: 6px;
      height: 9px;
    }
  }
}
</style>
