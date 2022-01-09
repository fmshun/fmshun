import Vue from 'vue'
import App from './App.vue'
import Toast from '@zl/toast'
import VueMeta from 'vue-meta'
Vue.use(VueMeta)
Vue.use(Toast)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
