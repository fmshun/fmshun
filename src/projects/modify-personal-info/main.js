import 'core-js/fn/object/assign'
import 'core-js/fn/promise'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Toast from '@zl/toast'
import Dialog from '@zl/dialog'
import loadScripts from '@/utils/loadScripts'
Vue.use(Toast)
Vue.use(Dialog)
Vue.prototype.$loadScripts = loadScripts
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
