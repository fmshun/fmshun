import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
// 目标盈首页
import Home from './views/Home.vue'
// 目标盈下单页
import Set from './views/Set.vue'
// 目标盈成功页
import Success from './views/Success.vue'
// 目标盈失败页
import Fail from './views/Fail.vue'

Vue.use(VueRouter)
Vue.use(VueMeta)

export default new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      component: Home,
      meta: {
        // 缓存
        keepAlive: true,
      },
    },
    {
      path: '/set/:prdtId/:prdtCode/:yieldNum',
      name: 'set',
      component: Set,
      meta: {
        // 缓存
        keepAlive: false,
      },
    },
    {
      path:
        '/success/:cycleInfo/:prdtName/:transferInType/:aim/:aimNext/:balance/:bankNo/:bankCard',
      name: 'success',
      component: Success,
      meta: {
        // 缓存
        keepAlive: false,
      },
    },
    {
      path: '/fail/:msg',
      name: 'fail',
      component: Fail,
      meta: {
        // 缓存
        keepAlive: false,
      },
    },
  ],
})
