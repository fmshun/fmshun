<template>
  <div class="top-header">
    <div class="nav-top"></div>
    <div class="nav-title">
      <div class="go-back" @click="goBack">
        <img class="back-img" src="../assets/back@2x.png" alt="" />
      </div>
      <div class="mid-title">
        发帖
      </div>
      <div class="right-operate">发布</div>
    </div>
  </div>
</template>

<script>
import base from 'base'
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
      $('.main-content').css('top', $('.top-header').height() + 'px')
    })
  },
  methods: {
    //页面返回
    goBack(e) {
      base.href('http://action:3413')
    },
  },
}
</script>

<style lang="less" scoped>
.top-header {
  position: fixed;
  z-index: 1000;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ececec;
  box-shadow: inset 0 0 0 0 #ececec;
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
    justify-content: space-between;
    height: 48px;
    padding-top: 4px;
    .go-back {
      width: 50px;
      height: 18px;
      margin-top: 17px;
      .back-img {
        width: 10px;
        height: 18px;
        margin-left: 15px;
      }
    }
    .mid-title {
      padding-top: 8px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 17px;
      color: #000000;
      text-align: center;
      letter-spacing: 0;
    }
    .right-operate {
      padding-top: 9px;
      margin-right: 20px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 16px;
      color: #1e86f8;
      letter-spacing: 0;
    }
  }
}
</style>
