<template>
  <div class="home">
    this is page1.html
    <div id="nav">
      <router-link to="/demo">Demo</router-link>
      |
      <router-link to="/self">self</router-link>
      |
      <router-link to="/demoFullPage">DemoFullPage</router-link>
      |
      <!--      跳往其他页面可以直接用a标签-->
      <a href=",/demo.html#/fullPage">DemoFullPage by a</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
}
</script>

<style scoped>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
