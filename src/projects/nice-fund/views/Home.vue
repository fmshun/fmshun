<template>
  <div :class="{ android: isAndroid, iphoneX: isIphoneX }" id="nice-fund">
    <div id="header-area">
      <span @click="goback" class="back"></span>
      <span class="titlec">定投好基汇</span>
    </div>
    <div id="content">
      <div :style="styleObj" class="top-area"></div>
      <ul>
        <li @click="goFundDetail(item.prdtCode)" :key="i" v-for="(item, i) in list">
          <div class="left">
            <div class="yield-area">
              <span
                :class="{'special':afterZero(item.rate)}"
                class="yield"
              >{{ item.rate?item.rate:'--' }}</span>
              <span :class="{'special':afterZero(item.rate)}" class="unit">%</span>
            </div>
            <div class="yield-desc">{{item.rateType}}</div>
          </div>
          <div class="right">
            <div class="prdt-name">{{ item.name }}</div>
            <div class="tags">
              <span v-if="item.tag" class="tag tag1">{{ item.tag }}</span>
              <span v-if="item.riskLevel" class="tag tag2">{{ item.riskLevel }}</span>
              <span v-if="item.type" class="tag tag3">{{ item.type }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import base from 'base'
export default {
  name: 'NICE-FUND',
  data() {
    return {
      //顶部图片背景
      pic: '',
      //产品列表
      list: [],
      isAndroid: false,
      isIphoneX: false,
    }
  },
  computed: {
    styleObj() {
      return {
        background: 'url(' + this.pic + ') no-repeat left top',
        backgroundSize: '100% 100%',
      }
    },
  },
  beforeCreate() {
    //白头要显示wifi和电量图表
    base.href('http://action:10066?isShowDarkStatusBar=1')
  },
  beforeMount() {
    if (base.isAndroid()) {
      this.isAndroid = true
    } else if (base.isIphoneX()) {
      this.isIphoneX = true
    }
    this.$nextTick(() => {
      var h = $('#header-area').height()
      $('#content').height(window.innerHeight - h)
    })
    this.getList()
  },
  methods: {
    //跳转到基金详情页
    goFundDetail(code) {
      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode=' +
          code
      )
    },
    afterZero(num) {
      return parseFloat(num) < 0 ? true : false
    },
    //获取产品列表
    getList() {
      var url = '/reqxml?action=27401&path=/time_invest/opportunity',
        that = this
      window.ajax.run(
        url,
        '',
        function(res) {
          $('.loader-wrapper').hide()
          res = JSON.parse(res.BINDATA)
          if (res.code == '0') {
            that.pic = res.resultData.pic
            that.list = res.resultData.prdtList
            that.$nextTick(() => {
              $('.top-area').css('background-size', '100% 100%')
            })
          } else {
            alert(res.msg)
          }
        },
        function() {
          $('.loader-wrapper').hide()
          alert('网络连接失败!')
        }
      )
    },
    goback() {
      base.href('http://action:10002')
    },
  },
}
</script>
<style scoped>
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  -webkit-user-select: none;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
::before,
::after {
  box-sizing: border-box;
}
::-webkit-scrollbar {
  display: none;
}

#nice-fund {
  text-align: left;
}
#content {
  overflow-y: auto;
}
li:not(:first-child) {
  margin-top: 8px;
}
.tags {
  margin-top: 7px;
  font-size: 0;
}
.tags .tag {
  position: relative;
  display: inline-block;
}
.tags .tag:not(:first-child) {
  margin-left: 6px;
}
.tag1 {
  padding: 5px 4px;
  font-family: PingFangSC-Regular;
  font-size: 11px;
  line-height: 10px;
  color: #f64843;
  text-align: center;
  letter-spacing: 0;
  background-image: linear-gradient(0deg, #fffaf9 0%, #ffffff 61%);
}
.tag1::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  border: 1px solid rgba(237, 87, 66, 0.25);
  border-radius: 4px;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.tag2 {
  padding: 5px 9.5px;
  font-family: PingFangSC-Regular;
  font-size: 11px;
  line-height: 10px;
  color: #ff7301;
  text-align: center;
  letter-spacing: 0;
  background: url(../assets/bg.png) no-repeat left top;
  background-size: 100% 100%;
}
.tag2::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  border: 1px solid rgba(255, 115, 1, 0.29);
  border-radius: 4px;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.tag3 {
  padding: 5px 4px;
  font-family: PingFangSC-Regular;
  font-size: 11px;
  line-height: 10px;
  color: #5176e1;
  text-align: center;
  letter-spacing: 0;
  background: url(../assets/button.png) no-repeat center;
  background-size: 100% 100%;
}
.tag3::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  border: 1px solid rgba(81, 118, 225, 0.36);
  border-radius: 4px;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
li .yield-area {
  text-align: center;
}
li .yield {
  display: inline-block;
  font-family: Helvetica;
  font-size: 26px;
  line-height: 31px;
  color: #ed5742;
  letter-spacing: 0;
}
li .prdt-name {
  font-family: PingFangSC-Medium;
  font-size: 17px;
  line-height: 18px;
  color: #4a4a4a;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}
li .yield-desc {
  margin-top: 5px;
  font-family: PingFangSC-Regular;
  font-size: 11px;
  line-height: 12px;
  color: #c5c5c5;
  letter-spacing: 0;
}
li .unit {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: #ed5742;
  letter-spacing: 0;
}
li .yield.special,
li .unit.special {
  color: #5e9f3b;
}
ul {
  padding-bottom: 32px;
}
ul li {
  position: relative;
  height: 92px;
  background-color: #fff;
  white-space: nowrap;
}
li .left {
  float: left;
  margin-top: 19px;
  margin-left: 20px;
}
li .right {
  padding-top: 26px;
  padding-left: 137px;
}
.top-area {
  position: relative;
  height: 190px;
  background: url(../assets/banner.png) no-repeat center;
  background-size: 100% 100%;
}
#header-area {
  position: relative;
  height: 64px;
  background-color: #fff;
}
.android #header-area {
  height: 46px;
}
.iphoneX #header-area {
  height: 84px;
}
#header-area .back {
  position: absolute;
  bottom: 13px;
  left: 0;
  width: 39px;
  height: 19px;
  background: url(../assets/back.png) no-repeat center;
  background-size: 11px 19px;
}
#header-area .titlec {
  position: absolute;
  bottom: 10px;
  left: 50%;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  line-height: 24px;
  color: #000000;
  letter-spacing: 0;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
</style>
