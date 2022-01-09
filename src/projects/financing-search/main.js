import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'
FastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
