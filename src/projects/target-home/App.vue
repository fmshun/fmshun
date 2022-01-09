<template>
  <div id="app">
    <!-- 有缓存组件 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <!-- 无缓存组件 -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  metaInfo: {
    title: '目标盈定投',
  },
}
</script>
