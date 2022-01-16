<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
  import Main from './views/financing-search'
  export default {
    name: 'App',
    components: { Main },
    mounted() {
      let _this = this
      window.getbackurl = window.GetBackUrl = function () {
        let appVersion = navigator.appVersion.toLocaleLowerCase()
        if (appVersion.indexOf('android') > 0) {
          _this.$router.back(-1)
        }
      }
    },
  }
</script>

<style>
  html,
  body,
  #app {
    height: 100%;
    padding-top: 0 !important;
    overflow: hidden;
    background: #f7f7f7;

    /* 禁止点击后出现背景，只用于iOS */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .loader-wrapper {
    position: fixed;
    z-index: 99999999 !important;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
  }

  body,
  h3,
  p {
    padding: 0;
    margin: 0;
  }

  #app {
    font-family: PingFangSC-Regular, 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 16px;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  input,
  textarea {
    padding: 0;
    margin: 0;
    -webkit-user-select: auto;
    /* webkit浏览器 */
    outline: none;
  }

  img[src=''] {
    opacity: 0;
  }
</style>