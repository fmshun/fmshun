<template>
  <div :class="{ android: isAndroid, iphoneX: isIphoneX }" id="strategy-knowledge">
    <div id="header-area">
      <span @click="goback" class="back"></span>
      <span class="titlec">攻略小知识</span>
    </div>
    <div id="content">
      <div class="list">
        <div class="contentc">
          <ul>
            <li @click="jump(item.link)" :key="inx" v-for="(item,inx) in data">
              <div class="left">{{item.title}}</div>
              <div
                :style="{'background':'url('+item.pic+') no-repeat center','backgroundSize':'100% 100%'}"
                class="right"
              ></div>
              <div class="time">{{item.time}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import '@/libs/swiper4.5.css'
import '@/libs/swiper4.5.min.js'
export default {
  name: 'home',
  data() {
    return {
      isAndroid: false,
      isIphoneX: false,
      data: [],
    }
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

    this.getData()
  },
  methods: {
    jump(link) {
      base.href(link)
    },
    getData() {
      var url = '/reqxml?action=27401&path=/time_invest/invest_st_more',
        that = this
      window.ajax.run(
        url,
        '',
        function(res) {
          $('.loader-wrapper').hide()
          res = JSON.parse(res.BINDATA)
          if (res.code == '0') {
            that.data = res.resultData
          } else {
            $('.loader-wrapper').hide()
            alert(res.msg)
          }
        },
        function(err) {
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
::-webkit-scrollbar {
  display: none;
}
::before,
::after {
  box-sizing: border-box;
}
#content {
  overflow: auto;
}

.list {
  padding-top: 25px;
  background-color: #fff;
}
.list ul {
  padding-bottom: 12px;
}
.list li {
  margin: 0 20px;
  padding-bottom: 18px;
  position: relative;
}
.list li:first-child {
  padding-top: 0;
}
.list li:not(:first-child) {
  padding-top: 20.5px;
}
.list li:not(:first-child)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(220, 220, 220, 0.9);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
}
.list li .time {
  font-family: PingFangSC-Light;
  font-size: 13px;
  color: #999999;
  letter-spacing: 0;
  position: absolute;
  left: 0;
  bottom: 14px;
}
.list .left {
  float: left;
  max-width: 229px;
  text-align: left;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #4a4a4a;
  line-height: 22px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.list .right {
  float: right;
  width: 100px;
  height: 71px;
  background: url(../assets/pic1.png) no-repeat center;
  background-size: 100% 100%;
}
.list li::after {
  content: '';
  clear: both;
  height: 0;
  width: 100%;
  display: block;
}

#header-area {
  position: relative;
  height: 64px;
  background: -webkit-linear-gradient(
    top,
    rgba(254, 254, 254, 1),
    rgba(252, 252, 252, 0)
  );
}
.android #header-area {
  height: 44px;
}
.iphoneX #header-area {
  height: 88px;
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
