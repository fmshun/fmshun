// import 'core-js/fn/object/assign'
// import 'core-js/fn/promise'
import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import Dialog from '@zl/dialog'
// import loadScripts from '@/utils/loadScripts'
import FastClick from 'fastclick'

FastClick.attach(document.body)
Vue.config.productionTip = false
Vue.use(VueMeta)
Vue.use(Dialog)
// Vue.prototype.$loadScripts = loadScripts

// this.$loadScripts(['/common/scripts/file.js', '/common/scripts/local.js']).then(() => {
//     // todoNextAction()
// })
new Vue({
  render: (h) => h(App),
}).$mount('#app')
