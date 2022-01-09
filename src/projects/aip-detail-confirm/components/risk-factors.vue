<template>
  <div class="factors">
    <div class="factors-list">
      <div class="changeable" v-if="nomatchList.length">
        <p class="list-classify">变更后不匹配的定投计划：
          <span>(需重新确认)</span>
        </p>
        <div class="chose-wrap" v-if="nomatchList.length >= 3 && !elementChangeFour">
          <div class="chose-all">
            <i
              :class="['icon', allChosenFlag ? 'chosenImg' : 'unchosenImg']"
              @click="chosenAll" />
            <span>全选</span>
          </div>
        </div>

        <ListItem
          v-for="item in nomatchList"
          :key="item.id"
          :item="item"
          @choseItem="choseItem" />
      </div>

      <div class="notMatchOperate" v-if="notMatchOperate.length">
        <p class="list-classify">变更后不匹配的定投计划：
          <span>(无法继续执行)</span>
        </p>

        <ListItem
          v-for="item in notMatchOperate"
          :key="item.id"
          :item="item"
          changeable="false"
          @choseItem="choseItem" />
      </div>

      <div
        class="dischangeable"
        v-if="showMatch">
        <p class="list-classify">变更后仍然匹配的定投计划：</p>

        <ListItem
          v-for="item in matchList"
          :key="item.id"
          :item="item"
          hasMask="true"
        />
      </div>

      <div class="confirm-more" v-if="UporDownFlag" @click="showMore">
        <i :class="['icon', moreFlag ? 'top' : 'bottom']"></i>
        <span>
          {{ moreFlag ? '收起变更后仍匹配计划' : '展开变更后仍匹配计划' }}
        </span>
      </div>
    </div>
    <div class="confirm-btn" @click="confirm" v-if="confirmBtnFlag">
      <template v-if="onlyMathList">我知道了</template>
      <template v-else>我已知悉，确认</template>
    </div>

    <matchresultlayer
      v-if="bShowMatchResultLayer"
      :chosen_list="chosen_list"
      @listenMatchResultLayerClose="listenMatchResultLayerClose"
    ></matchresultlayer>
  </div>
</template>

<script>
import matchresultlayer from '@/components/three-match-array/match-result';
import ListItem from './listItem';
import ajax from 'ajax';
import base from 'base';

export default {
  name: 'home',
  components: {
    ListItem,
    matchresultlayer,
  },
  data() {
    return {
      bShowMatchResultLayer: false,
      nomatchList: [],  // 不匹配(不包括 最低保守型)
      notMatchOperate: [], // 不匹配中 最低保守型
      matchList: [],  // 匹配项
      chosen_list: [], //选中项
      onlyMathList: false, // 只有匹配list
      confirmBtnFlag: true, // 底部确认btn
      allChosenFlag: false, // 全选按钮
      moreFlag: false, // 展开 收起
      confirmFlag: false, // 提交开发 节流
      elementChangeFour: false, // 是否 最低保守型
    }
  },
  mounted() {
    this.refresh()
  },
  computed: {
    // 匹配 开展 收起展示
    UporDownFlag() {
      const mathchLen = this.matchList.length;
      const nomathchLen = this.nomatchList.length;
      // 匹配 = 0 （不需要下拉）|| 不匹配 = 0 （匹配全展示）, 
      if ((mathchLen === 0) || nomathchLen=== 0) {
        return false;
      }

      // 匹配 < 3, 不匹配 < 3 （匹配全展示）
      if (mathchLen < 3 && nomathchLen < 3) {
        return false
      }

      // 其他情况 都是 收起
      return true
    },
    // 匹配 list 展示
    showMatch() {
      // 匹配 = 0  匹配的定投计划 不展示
      if (this.matchList.length === 0) {
        return false;
      }
      // 不匹配 = 0  匹配的定投计划 全部展示
      if (this.nomatchList.length === 0) {
        return  true;
      }
      // 匹配 < 3, 不匹配 < 3 （匹配全展示）
      if (this.nomatchList.length < 3 && this.matchList.length < 3) {
        return true;
      }
      // 其他情况 + 开展 （匹配全展示）
      if (this.moreFlag) {
        return true;
      }
      return  false;
    },
  },
  methods: {
    // 页面刷新
    refresh() {
      this.nomatchList = [];
      this.matchList = [];
      this.notMatchOperate = [];
      this.allChosenFlag = false;
      this.moreFlag= false;
      this.confirmFlag= false;
      this.init();
    },
    // 数据初始化
    async init() {
      const binData = await this.initData();
      
      if (binData) {
        const { code, msg = '网络超时，请稍后再试', isLowestRiskLevel= false,notMatch, match, notMatchOperate} = binData;
        this.$parent.elementChangeFour = isLowestRiskLevel
        if (code === '0') {
          notMatch.map((item) => {
            item.isChosen = false
          })
         
          match.map((item) => {
            item.isChosen = true
          })
          
          this.nomatchList = notMatch;
          this.matchList = match;
          this.notMatchOperate = notMatchOperate;

          // 判断是否只有 匹配list 存在
          if (this.nomatchList.length === 0 && this.notMatchOperate.length === 0 && this.matchList.length > 0) {
            this.onlyMathList = true;
          }

          // 只有 不匹配(最低保守型) 存在， 底部btn 不显示
          if (this.nomatchList.length === 0 && this.matchList.length === 0) {
            this.confirmBtnFlag = false;

            // 不存在风险要素变更的内容
            if (this.notMatchOperate.length === 0) {
              alert('暂无风险要素需要变更')
              base.href('http://action:3413');
              return;
            }
          }
        } else {
          alert(msg)
          base.href('http://action:3413');
        }
      }
      $('.loader-wrapper').hide();
    },
    // 获取 风险要素 list
    initData() {
      return new Promise((resolve, reject) => {
        ajax.run('/reqxml?action=27401&path=/time_invest/riskLevel_change_list',
        {
          clientNo: '($account)',
          type: base.getUrlParameter('type'),
          prdtCode: base.getUrlParameter('prdtCode'),
          subFundAccount: base.getUrlParameter('subFundAccount'),
          allotno: base.getUrlParameter('allotno'),
        }, ( { BINDATA } ) => {
          resolve(JSON.parse(BINDATA))
        }, err => {
          alert(err.ERRORMESSAGE || '网络超时，请稍后再试');
          base.href('http://action:3413');
           $('.loader-wrapper').hide()
          reject(false)
        })
      })
    },
    // 选中  取消选中
    chosenAll() {
      this.allChosenFlag = !this.allChosenFlag
      this.nomatchList.forEach(
        (item) => (item.isChosen = this.allChosenFlag)
      )
    },
    // 选择 某个
    choseItem(item) {
      item.isChosen = !item.isChosen
      this.allChosenFlag = this.nomatchList.every((item) => item.isChosen)
    },
    // 开展 收起
    showMore() {
      this.moreFlag = !this.moreFlag
    },
    confirm() {
      // 确认下一步 节流
      if (this.confirmFlag) {
        return
      }
      this.confirmFlag = true;
      console.log(2)

      // 不匹配（非最低风险）+ 匹配 两者 不能同时为空
      if (this.nomatchList.length === 0 && this.matchList.length === 0) {
        return
      }

      // 选中 list
      let chosen_list = [];
      // 不匹配（不是最低 保守型）选中数据
      if (this.nomatchList && this.nomatchList.length > 0) {
        chosen_list = this.nomatchList.filter(item => item.isChosen);
        // 只存在 不匹配（不是最低 保守型）且 未选中 数据
        if (this.matchList.length === 0 && !chosen_list.length) {
          this.$Toast('请选择需要确认的定投计划');
          this.confirmFlag = false;
          return
        }
      }
      
      // 匹配
      if (this.matchList && this.matchList.length > 0) {
        chosen_list = chosen_list.concat(this.matchList);
      }
      
      // 风险评估弹窗
      this.chosen_list = chosen_list;
      this.bShowMatchResultLayer = true;
      this.confirmFlag = false;
    },
    // 三匹配关闭
    listenMatchResultLayerClose({refresh}) {
      this.bShowMatchResultLayer = false;

      // 刷新当前 风险要素页面
      if (refresh) {
        this.refresh();
      }
    },
  },
}
</script>

<style lang="less">
.factors {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background-color: #f8f8f8;
  &::scroll-behavior {
    display: none;
  }

  .factors-list {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-bottom: 23px;

    &::-webkit-scrollbar {
      display: none;
    }

    .chose-wrap {
      width: 100%;
      background-color: #fff;
    }
    .chose-all {
      margin-left: 20px;
      position: relative;
      display: flex;
      padding-top: 15px;
      padding-bottom: 10px;
      width: 331px;
      height: 50px;
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

    .changeable, 
    .dischangeable,
    .notMatchOperate {
      width: 100%;
    }

    .list-classify {
      padding: 20px 0 3px 20px;
      line-height: 21px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #4a4a4a;
      background-color: #fff;
      span {
        color: #f66a14;
      }
    }

    .dischangeable {
      overflow: hidden;
      transition: height 0.2s;
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
}

.iphoneX {
  .confirm-btn {
    height: 94px;
    padding-bottom: 34px;
  }
}
</style>
