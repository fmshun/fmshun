// 兼容
import 'core-js/fn/object/assign'
import 'core-js/fn/promise'

import Vue from 'vue'
import App from './App.vue'
// 路由
import router from './router'
// 弹窗
import Toast from '@zl/toast'
import Dialog from '@zl/dialog'
// 引入文件
import loadScripts from '@/utils/loadScripts'

Vue.use(Toast)
Vue.use(Dialog)

Vue.prototype.$loadScripts = loadScripts
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
