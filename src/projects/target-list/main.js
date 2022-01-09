import 'core-js/fn/object/assign'
import 'core-js/fn/promise'
import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import loadScripts from '@/utils/loadScripts'
import FastClick from 'fastclick'

FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.use(VueMeta)
Vue.prototype.$loadScripts = loadScripts
new Vue({
  render: (h) => h(App),
}).$mount('#app')
