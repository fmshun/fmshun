import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import Home from './views/Home.vue'
import ConfirmInfo from './views/ConfirmInfo'
import PhoneVerify from './views/PhoneVerify'
import BusinessFail from './views/BusinessFail'
import BusinessSuccess from './views/BusinessSuccess'

Vue.use(VueRouter)
Vue.use(VueMeta)

export default new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/self',
      component: Home,
    },
    {
      path: '',
      component: ConfirmInfo,
    },
    {
      path: '/index',
      beforeEnter() {
        window.location = '/'
      },
    },
    {
      path: '/demo',
      beforeEnter() {
        window.location = '/demo.html'
      },
    },
    {
      path: '/demoFullPage',
      beforeEnter() {
        window.location = '/demo.html#/fullPage'
      },
    },
    {
      path: '/verify',
      component: PhoneVerify,
    },
    {
      path: '/fail',
      component: BusinessFail,
    },
    {
      path: '/success',
      component: BusinessSuccess,
    },
  ],
})
