<template>
  <div class="top-header">
    <div class="nav-top"></div>
    <div class="nav-title">
      <div class="go-back" @click="goBack">
        <img class="back-img" src="../assets/back.png" alt="" />
      </div>
      <div class="right-operate" v-if="rightOp" @click="goQuestion">
        {{ rightOp }}
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import file from 'file'
export default {
  name: 'top-header',
  props: ['titleWord', 'rightOp'],
  data() {
    return {}
  },
  mounted() {
    //系统判断
    if (base.isIphoneX()) {
      $('.nav-top').addClass('iphoneX')
    } else if (base.isIPhone()) {
      $('.nav-top').addClass('iphone')
    }
    this.$nextTick(() => {
      $('.main-content').css('padding-top', $('.top-header').height() + 'px')
    })
  },
  methods: {
    //页面返回,返回定投专区
    goBack(e) {
      window.history.go(-1)
      // base.href('http://action:3413')
      // let url =
      //   'http://action:10061/?shownavigationbar=0&&url=/web_cft/financing-aip/aip-home.html'
      // base.href(url)
    },
    //去常见问题页面
    goQuestion() {
      file.deleteAll('prdtId.js', () => {
        base.href(
          'http://action:10061/?fullscreen=1&&topcolor=4173DA&&shownavigationbar=1&&url=/web_cft/financing-aip/usual-question.html'
        )
      })
    },
  },
}
</script>

<style lang="less" scoped>
.top-header {
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  overflow: hidden;
  background: url('../assets/bg@2x.png') 0 -2px no-repeat;
  background-size: 100% auto;
  .nav-top {
    height: 0;
  }
  .nav-top.iphone {
    height: 20px;
  }
  .nav-top.iphoneX {
    height: 40px;
  }
  .nav-title {
    box-sizing: content-box;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
    padding-top: 4.5px;
    padding-bottom: 7px;
    margin-top: 14px;
    .go-back {
      width: 50px;
      height: 100%;
      line-height: 20px;
      .back-img {
        width: 9px;
        height: 17px;
        margin-left: 14px;
        vertical-align: middle;
      }
    }
    .right-operate {
      width: 73px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 14px;
      line-height: 20px;
      color: #ffffff;
      text-align: left;
      opacity: 0.7;
    }
  }
}
</style>
