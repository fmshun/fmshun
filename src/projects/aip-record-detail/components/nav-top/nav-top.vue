<template>
  <div class="nav-top-w">
    <div class="top">
      <div class="left" @click="clickLeftEvent"></div>
      <div class="tabs">
        <div class="tab">定投记录详情</div>
      </div>
    </div>
  </div>
</template>
<script>
import base from 'base'
export default {
  name: 'navtop',
  mounted() {
    if (this.nextDom) {
      $(this.nextDom).addClass('navtop-position-update')
    }
    if (base.isAndroid()) {
      $('#use-nav-top-app').addClass('android')
    } else if (base.isIphoneX()) {
      $('#use-nav-top-app').addClass('iphoneX')
    }
  },
  methods: {
    clickLeftEvent: function() {
      base.href('http://action:3413')
    },
  },
}
</script>
<style lang="less">
#use-nav-top-app {
  padding-top: 78px;
}
.android {
  .nav-top-w {
    padding-top: 13px;
    .tab {
      font-weight: bold;
    }
  }
  &#use-nav-top-app {
    padding-top: 71px;
  }
}

.iphoneX {
  .nav-top-w {
    padding-top: 40px;
  }
  &#use-nav-top-app {
    padding-top: 98px;
  }
}
.nav-top-w {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  padding-top: 20px;
  background-color: white;

  .top {
    position: relative;
    display: -webkit-box;
    height: 48px;
    line-height: 48px;
    -webkit-box-pack: justify;

    .left {
      position: relative;
      z-index: 1;
      min-width: 50px;
      background: url(./images/back.png) no-repeat center;
      -webkit-background-size: 8px 16px;
      background-size: 12px 20px;
    }

    .tabs {
      position: absolute;
      right: 0;
      left: 0;
      text-align: center;

      .tab {
        display: inline-block;
        min-width: 110px;
        font-family: PingFangSC-Regular;
        font-size: 19px;
        color: #000000;
      }
    }
  }
}
</style>
