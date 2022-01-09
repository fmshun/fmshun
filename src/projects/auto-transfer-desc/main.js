import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import Toast from '@zl/toast'

Vue.config.productionTip = false
Vue.use(VueMeta)
Vue.use(Toast)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
