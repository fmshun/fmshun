<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
import Main from './views/usual-question'
export default {
  name: 'App',
  metaInfo: {
    title: '常见问题',
  },
  components: { Main },
  mounted() {
    let _this = this
    window.getbackurl = window.GetBackUrl = function() {
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
  padding-top: 0 !important;
  -webkit-user-select: none;
  user-select: none;
  background-color: #fff;

  /* 禁止点击后出现背景，只用于iOS */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-overflow-scrolling: touch;
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

/* 禁止ios 的长按复制功能 */
* {
  -webkit-touch-callout: none; /* 系统默认菜单被禁用 */
  -webkit-user-select: none; /* webkit浏览器 */
  -khtml-user-select: none; /* 早期浏览器 */
  -moz-user-select: none; /* 火狐 */
  -ms-user-select: none; /* IE10 */
  user-select: none;
}
input,
textarea {
  padding: 0;
  margin: 0;
  -webkit-user-select: auto; /* webkit浏览器 */
  outline: none;
}
img[src=''] {
  opacity: 0;
}
</style>
