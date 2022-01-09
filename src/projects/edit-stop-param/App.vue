// 目标止盈参数页面
<template>
  <div class="edit-stop-param" id="use-nav-top-app">
    <navtop title="目标止盈参数"></navtop>
    <!-- 设置目标收益率： -->
    <div class="set-rate-w">
      <p class="title">设置目标收益率：</p>
      <p class="desc">可选择达成目标收益率，自动卖出，锁定收益！</p>
      <div class="rate-swiper-w">
        <!-- <p class="tip">请滑动指针选择数值</p> -->
        <!-- <Rule ref="mychild" :activeNum="yieldNum" :min="min" :max="max"></Rule> -->
        <Rule ref="mychild" :initYield="yieldNum" :min="min" :max="max"></Rule>
        <p class="under-desc">请滑动标尺选择数值</p>
      </div>
    </div>

    <!-- 达到目标收益率后： -->
    <div class="set-stop-w">
      <p class="title">达到目标收益率后：</p>
      <div
        class="set-stop"
        @click="selectTypeHander(0, $event)"
        :class="selectedType === 0 ? 'selected' : ''"
      >
        <div class="inner">
          <p class="l1">
            自动赎回
            <i>(至华泰账户)</i>
          </p>
          <p class="l2">达成目标后自动赎回，锁定收益，并回款到华泰账户</p>
        </div>
      </div>
      <div
        class="set-stop"
        @click="selectTypeHander(1, $event)"
        :class="selectedType === 1 ? 'selected' : ''"
      >
        <div class="inner">
          <p class="l1">继续定投</p>
          <p class="l2">我们会提醒您目标达成，但不影响定投的继续执行</p>
        </div>
      </div>
      <div
        class="set-stop"
        @click="selectTypeHander(2, $event)"
        :class="selectedType === 2 ? 'selected' : ''"
      >
        <div class="inner">
          <p class="l1">终止定投</p>
          <p class="l2">我们会提醒您目标达成，并终止该定投继续扣款</p>
        </div>
      </div>
    </div>
    <div class="btn-ensure highlight" @click="btnEnsureHandler">
      <div class>确定</div>
    </div>
  </div>
</template>
<script>
import base from 'base'
import local from 'local'
import loadScripts from '@/utils/loadScripts'
import Rule from '@/components/rule/Rule'
// import Rule from '@/components/rule-v2/Rule'
import navtop from '@/components/nav-top/nav-top'
import { stopParamInfos } from '@/components/Common'

export default {
  name: 'App',
  metaInfo: {
    title: '目标止盈参数',
  },
  components: {
    Rule,
    navtop,
  },
  data() {
    return {
      yieldNum: base.getUrlParameter('yieldNum')
        ? parseFloat(base.getUrlParameter('yieldNum'))
        : 6, //目标收益率
      min: 0,
      max: 100,
      selectedType: base.getUrlParameter('selectedType')
        ? parseInt(base.getUrlParameter('selectedType'))
        : 0, //自动赎回0, 继续定投1，终止定投2
      isModify: base.getUrlParameter('isModify'), //是否来自修改流程
    }
  },
  created() {
    loadScripts(['/common/scripts/prompt.js']).then(() => {})
  },
  computed: {
    strResumeType: function() {
      return stopParamInfos[this.resumeType]
    },
  },
  mounted() {
    base.href('http://action:10066?isShowDarkStatusBar=1')
    $('.loader-wrapper').hide()
    window.getbackurl = window.GetBackUrl = this.btnEnsureHandler
  },
  methods: {
    selectTypeHander: function(selectedType) {
      this.selectedType = selectedType
    },
    btnEnsureHandler: function() {
      let _this = this
      if (
        this.isModify == 1 &&
        Number(base.getUrlParameter('accountRate')) >=
          _this.$refs.mychild.nowYield
      ) {
        new Prompt({
          id: 'modify-tip-pop',
          title: ' ',
          content: '不可以将目标收益率修改至低于目前持仓收益率',
          align: 'left',
          buttons: {
            btnNo: 1,
            left: {
              label: '知道了',
              callback: function() {},
            },
          },
        })
        return
      }
      local.saveObject(
        {
          financing_aip_edit_stop_param: JSON.stringify({
            yieldNum: _this.$refs.mychild.nowYield,
            selectedType: _this.selectedType,
          }),
        },
        function() {
          base.href('http://action:3413')
        }
      )
    },
  },
}
</script>
<style lang="less">
@import '../../components/Prompt.css';
@import './App.less';
.prompt.center .content {
  padding: 6px 20px 20px 25px;
}
// .edit-stop-param >>>
.rule_container .rule_content::before {
  bottom: 20px;
}
</style>
