<template>
  <div class="nav-top-w">
    <div class="top">
      <div class="left" @click="clickLeftEvent"></div>
      <div class="tabs">
        <div class="tab">{{ title || '基金定投' }}</div>
      </div>
    </div>
    <!-- <div class="bar"></div> -->
  </div>
</template>
<script>
import base from 'base'
export default {
  name: 'navtop',
  props: {
    title: String,
    leftEvent: Function,
    nextDom: String,
  },
  data() {
    return {}
  },
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
      if (this.leftEvent) {
        this.leftEvent()
      } else {
        base.href('http://action:3413')
      }
    },
  },
}
</script>
<style lang="less">
// .navtop-position-update {
//   // 65+8
//   margin-top: 73px;
// }
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
  //   .navtop-position-update {
  //     //   45+8
  //     margin-top: 53px;
  //   }
}

.iphoneX {
  .nav-top-w {
    padding-top: 40px;
  }
  &#use-nav-top-app {
    padding-top: 98px;
  }
  //   .navtop-position-update {
  //     //   85+8
  //     margin-top: 93px;
  //   }
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
      //   bottom: 0;
      left: 0;
      text-align: center;

      .tab {
        display: inline-block;
        min-width: 110px;
        font-family: PingFangSC-Medium;
        font-size: 19px;
        color: #000000;
      }
    }
  }
  //   .bar {
  //     width: 100%;
  //     height: 10px;
  //     background-color: #fafafa;
  //   }
}
</style>
