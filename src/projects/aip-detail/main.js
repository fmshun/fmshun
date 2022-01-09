import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import Dialog from '@zl/dialog'
import Toast from '@zl/toast'
// import vuescroll from 'vuescroll'

Vue.config.productionTip = false
Vue.use(VueMeta)
Vue.use(Dialog)
Vue.use(Toast)
new Vue({
  render: (h) => h(App),
}).$mount('#app')
