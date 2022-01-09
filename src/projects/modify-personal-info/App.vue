<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  metaInfo: {
    title: '修改个人信息',
  },
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
/* @import '../../../node_modules/normalize.css'; */
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  color: #555;
  background-color: #f0f0f0;
}
html {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}
input,
textarea,
select {
  width: 100%;
  color: #555;
  border: none;
}
a:hover,
a:active,
input,
:focus {
  outline: none;
}
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
legend,
button,
input,
textarea,
th,
td {
  padding: 0;
  margin: 0;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary,
time,
mark,
audio,
video {
  display: block;
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: #2c3e50;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
