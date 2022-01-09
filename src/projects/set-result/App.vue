<template>
  <div id="app">
    <waiting v-show="showWaiting"></waiting>
    <div class="wrapper">
      <!-- <div class="content"></div> -->
    </div>
  </div>
</template>
<script>
import Waiting from '@/components/waiting/Waiting'
import base from 'base'
import ajax from 'ajax'
// import NavigationBar from '@/components/navigation-bar/navigation-bar'

export default {
  name: 'App',
  metaInfo: {
    title: '普通定投',
  },
  components: {
    Waiting,
  },
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function() {
      let that = this

      //   this.initHead()
      this.getData($.Deferred()).done(function() {
        that.showWaiting = false
      })
      window.GoBackOnLoad = function() {
        ajax.showLoading()
        that.getData($.Deferred()).done(function() {
          ajax.hideLoading()
        })
      }
    },
    // initHead: function() {
    //   new NavigationBar({
    //     mountDom: '.wrapper',
    //     title: '',
    //     leftEvent: function() {
    //       base.href('http://action:10002')
    //     },
    //   })
    // },
    getData: function(dtd) {
      let that = this
      let url = '/reqxml?action=27401&path=',
        option = {}
      ajax.run(
        url,
        option,
        function(data) {
          var oData
          try {
            oData = JSON.parse(data.BINDATA)
          } catch (error) {
            oData = {}
          }

          dtd.resolve()
        },
        function() {
          dtd.resolve()
        }
      )
      return dtd.promise()
    },

    preventEvent: function(event) {
      event.preventDefault()
    },
    disableScroll: function() {
      document.addEventListener('touchmove', this.preventEvent, {
        passive: false,
      })
    },
    enableScroll: function() {
      document.removeEventListener('touchmove', this.preventEvent, {
        passive: false,
      })
    },
  },
}
</script>
<style lang="less">
// @import '../../components/navigation-bar/navigation-bar.css';
@import './App.less';
</style>
