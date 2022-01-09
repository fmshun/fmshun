<template>
  <div class="loading-error">
    <div class="error-img">
      <img src="../../info-live/assets/common-error-bg.png" alt="" />
    </div>
    <div class="error-msg">
      <span>页面加载失败，请稍后再试</span>
    </div>
  </div>
</template>

<script>
// import imgUrl from '';
export default {
  name: 'loading-error',
  data() {
    return {
      // imgUrl: imgUrl,
    }
  },
  methods: {
    reloadCurrent() {
      window.location.reload()
    },
  },
}
</script>

<style lang="less" scoped>
.loading-error {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 220;
  overflow: hidden;
  background-color: #fff;
}
.error-img {
  margin-top: 34%;
  text-align: center;
  img {
    width: 138px;
    height: 138px;
  }
}
.error-msg {
  margin-top: 18px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 15px;
  line-height: 22px;
  color: #c5c5c5;
  text-align: center;
  letter-spacing: 0.6px;
  .error-reload {
    color: #6ea6e8;
  }
}
</style>
