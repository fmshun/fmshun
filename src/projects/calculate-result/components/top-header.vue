<template>
  <div class="top-header">
    <div class="nav-top"></div>
    <div class="nav-title">
      <div class="go-back" @click="goBack">
        <img class="back-img" src="../assets/back.png" alt="" />
      </div>
      <div class="title-word">{{ titleWord }}</div>
      <div class="right-operate"></div>
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
      $('.main-content').css('padding-top', $('.top-header').height() + 'px')
    })
  },
  methods: {
    //页面返回
    goBack(e) {
      e.cancelBubble = true
      e.stopPropagation()
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
  background-color: #3163ec;
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
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
    height: 43px;
    padding-top: 6px;
    .go-back {
      width: 50px;
      height: 100%;
      line-height: 42px;
      .back-img {
        width: 11px;
        height: 19px;
        margin-left: 14px;
        vertical-align: middle;
      }
    }
    .title-word {
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 17px;
      color: #ffffff;
      text-align: center;
      letter-spacing: 0;
    }
    .right-operate {
      width: 50px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 14px;
      color: #ffffff;
      text-align: left;
      opacity: 0.7;
    }
  }
}
</style>
