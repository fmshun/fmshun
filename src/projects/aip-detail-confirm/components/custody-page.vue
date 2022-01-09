<template>
  <div class="custdoy-confirm">
    <div class="line"></div>
    <div class="chose-wrap" v-if="showAllBtn && autoTransfer">
        <div class="chose-all">
        <i
          :class="['icon', allChosenFlag ? 'chosenImg' : 'unchosenImg']"
          @click="chosenAll"
        />
        <span>全选</span>
        </div>
    </div>
    
    <div class="detail-confirm-list">
        <ListItem
          v-for="item in firstList"
          :key="item.prdtId"
          :item="item"
          :changeable="autoTransfer"
          @choseItem="choseItem" />

        <template v-if="threeList.length > 0 && moreFlag">
          <ListItem
            v-for="item in threeList"
            :key="item.prdtId"
            :item="item"
            :changeable="autoTransfer"
            @choseItem="choseItem"
          />
        </template>
      <div class="confirm-more" v-if="threeList.length > 0" @click="showMore">
        <i :class="['icon', moreFlag ? 'top' : 'bottom']"></i>
        <span>{{ moreFlag ? '收起更多' : '展开更多' }}</span>
      </div>
    </div>

    <div class="confirm-btn" v-if="autoTransfer && firstList.length" @click="confirm">我已知悉，确认</div>
  </div>
</template>

<script>
import ListItem from './listItem'
import ajax from 'ajax'
import base from 'base'
import topHeaderVue from '../../financing-counter/components/top-header.vue'

export default {
  name: 'custody',
  components: {
    ListItem,
  },
  data() {
    return {
        autoTransfer: true, // 是否可变更
        allChosenFlag: false,
        showAllBtn: false,
        threeList: [],
        firstList: [],
        moreFlag: false,
        confirmFlag: false,
        type: null, // 1  其他页面 2 定投详情页（新定投）3 单产品持仓页
        subFundAccount: null,  //（type=2 必传）  子账户
        prdtCode: null,  //（type=3 必传） 产品code
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.type = base.getUrlParameter('type') || '1';
      this.prdtCode = base.getUrlParameter('prdtCode') || '';
      this.subFundAccount = base.getUrlParameter('subFundAccount') || '';

      const binData = await this.initData();
      if (binData) {
        const {code, msg = '网络超时，请稍后再试', autoTransfer , isIntelligent, list} = binData;
        if (code === '0') {
          this.autoTransfer = autoTransfer;
          if (list.length ===0 ) {
            alert('暂无三方存管变更')
            base.href('http://action:3413');
            return;
          }
          list.map(item => {
            item.isChosen = false;
          });

          this.showAllBtn = list.length > 3 ? true : false;

          //this.list = list;
          this.firstList = list.splice(0, 3);
          this.threeList = list;
        } else {
          this.$Toast(msg)
        }

        this.$parent.changeable = this.autoTransfer;
      };
      $('.loader-wrapper').hide();
    },
    initData() {
      return new Promise((resolve, reject) => {
        ajax.run('/reqxml?action=27401&path=/time_invest/sfcg_info',
        {
            clientNo: '($account)',
            type: this.type,
            prdtCode: this.prdtCode,
            subFundAccount: this.subFundAccount,
            TFrom: '($tfrom)',
            fundAccount: '($fund_account)',
            password: '($password)',
            sysNodeId: '($tztsysnodeid)',
        },
        ({BINDATA})=> {
            resolve(JSON.parse(BINDATA));
        }, err => {
            $('.loader-wrapper').hide();
            alert(err.ERRORMESSAGE || '网络超时，请稍后再试')
            base.href('http://action:3413');
            resolve(false)
        })
      })
    },
    chosenAll() {
        this.allChosenFlag = !this.allChosenFlag;
        this.firstList.forEach(item => item.isChosen = this.allChosenFlag);
        this.threeList.forEach(item => item.isChosen = this.allChosenFlag);
    },
    choseItem(item) {
      item.isChosen = !item.isChosen;
      const list = [...this.firstList, ...this.threeList];
      this.allChosenFlag = list.every(item => item.isChosen);
    },
    showMore() {
      this.moreFlag = !this.moreFlag;
    },
    confirm() {
      if (this.confirmFlag) {
        return;
      }

      const prdtId = [];
      const subFundAccount = [];
      const list = [...this.firstList, ...this.threeList];
      list.forEach(item => {
        if (item.isChosen) {
          prdtId.push(item.prdtId);
          subFundAccount.push(item.subFundAccount);
        }
      })
      if (!prdtId.length) {
        this.$Toast('请选择需要确认的定投计划');
        return;
      }

      const str= [... new Set(prdtId)].join(',');
      const subFundAccountStr = [... new Set(subFundAccount)].join(',');
      // 跳转到 资金自动转入服务说明 页面
      let url = `/web_cft/financing-aip/auto-transfer-desc.html?prdtId=${str}&subFundAccount=${subFundAccountStr}`
      base.href(url)
      /* 
      * 判断当前 三方存管是否都选中
      * 都选中 结果 页面返回 到 上页
      * 存在未选中的 返回到 结果 当前页
      */
      // if (this.allChosenFlag) {
      //   base.href(url)
      // } else {
      //   base.href(`http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=${url}`);
      // }
     
  }
  },
}
</script>

<style lang="less" scoped>
.custdoy-confirm {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    background-color: #f8f8f8;

    .line {
      width: 100%;
      height: 20px;
      background-color: #fff;
    }
    .chose-wrap {
      width: 100%;
      height: 35px;
      background-color: #fff;
    }
    .chose-all {
        margin-left: 20px;
        display: flex;
        width: 331px;
        height: 35px;
        position: relative;
        &::after {
            width: 200%;
            height: 0;
            content: '';
            position: absolute;
            bottom: 0;
            left: -50%;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            border-bottom: 1px solid #f2f2f2;
        }
        span {
            font-size: 14px;
            color: #666666;
            line-height: 25px;
        }
        .icon {
            width: 18px;
            height: 25px;
            margin-right: 13px;
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
    }

    .confirm-btn {
      width: 375px;
      height: 60px;
      font-family: PingFangSC-Regular;
      font-size: 18px;
      line-height: 60px;
      color: #a4752d;
      text-align: center;
      background-color: #fff;
      position: relative;

        &::before {
            width: 200%;
            height: 0;
            content: '';
            position: absolute;
            top: 0;
            left: -50%;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            border-bottom: 1px solid #e6e6e6;
        }
    }

    .detail-confirm-list {
        width: 100%;
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
        padding-bottom: 6px;

        &::-webkit-scrollbar {
            display: none;
        }

        .confirm-more {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 375px;
            height: 57px;
            background-color: #fff;
            .icon {
                width: 9px;
                height: 5px;
                background-size: 100% 100%;
                margin-right: 4.5px;
            }
            .top {
                background-image: url('../assets/top.png');
            }
            .bottom {
                background-image: url('../assets/bottom.png');
            }

            span {
                font-size: 12px;
                color: #999;
                font-family: PingFangSC-Light;
            }
        }
    }
}

.iphoneX {
  .confirm-btn {
    height: 94px;
    padding-bottom: 34px;
  }
}
</style>
