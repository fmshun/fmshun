import 'core-js/fn/object/assign'
import 'core-js/fn/promise'
import Vue from 'vue'
import App from './App.vue'
import Dialog from '@zl/dialog'
// HTML头部标签
import VueMeta from 'vue-meta'
Vue.use(VueMeta)
Vue.use(Dialog)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
