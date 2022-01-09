<template>
  <div :class="{ target_home: isHome }" class="rule_container">
    <div class="rule_num flex flex_center">
      <div>{{ strNowYield }}</div>
      <span>%</span>
    </div>
    <div class="rule_content">
      <!-- <img class="rule_pointer" src="./assets/pointer.png" alt /> -->
      <div class="rule_body">
        <div class="scroll">
          <div
            v-for="(item, index) in arr"
            :key="index"
            :style="{ width: index == 0 ? '42px' : '41px' }"
            class="rule_one"
          >
            <img
              :style="{ width: index == 0 ? '42px' : '41px' }"
              style="width: 41px"
              class="rule_one_img"
              :src="index == 0 ? ruler1 : ruler"
              alt
            />
            <div v-if="item % 2 == 0" class="rule_one_txt">{{ item }}%</div>
            <div v-if="item == 99" class="rule_one_txt">{{ item + 1 }}%</div>
          </div>
        </div>
        <img class="rule_pointer" src="./assets/pointer.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import ruler1 from './assets/ruler1.png'
import ruler from './assets/ruler.png'

import base from 'base'
import local from 'local'
import loadScripts from '@/utils/loadScripts'
// -----------plugin
import * as plugin from '@/components/Common'
export default {
  name: 'Rule',
  props: {
    initYield: Number,
    // 最小值
    min: Number,
    // 最大值
    max: Number,
    // 是否是目标盈首页
    isHome: Boolean,
  },
  data() {
    return {
      ruler1: ruler1,
      ruler: ruler,
      arr: [],
      nowYield: 0,
      myRule: null,
      oneW: 4.1,
      scrollX: 0,
    }
  },
  computed: {
    strNowYield() {
      let val = Number(this.nowYield)
      if (val < this.min) {
        val = this.min
      }
      if (val > this.max) {
        val = this.max
      }
      return val.toFixed(1)
    },
  },
  mounted() {
    this.nowYield = this.initYield
    this.initData()
    this.initScroll()
  },
  methods: {
    initData() {
      this.arr = []
      for (let i = this.min; i < this.max; i++) {
        this.arr.push(i)
      }
    },
    preventEvent: function(event) {
      event.preventDefault()
    },
    disableScroll: function() {
      let ele = this.isHome ? $('.wrapper') : $('.edit-stop-param')
      ele.get(0).addEventListener('touchmove', this.preventEvent, {
        passive: false,
      })
    },
    enableScroll: function() {
      let ele = this.isHome ? $('.wrapper') : $('.edit-stop-param')
      ele.get(0).removeEventListener('touchmove', this.preventEvent, {
        passive: false,
      })
    },
    initScroll() {
      let _this = this
      loadScripts(['/common/vendor/iscroll-5.2.0/iscroll-probe.js']).then(
        () => {
          _this.$nextTick(() => {
            let IScroll = window.IScroll
            _this.myRule = new IScroll('.rule_body', {
              scrollX: true,
              scrollY: false,
              bounce: false,
              // 只有touch才触发
              disablePointer: true,
              disableTouch: false,
              disableMouse: true,
              probeType: 3,
              click: base.isIOS() ? false : true,
              preventDefault: false, //不阻止事件冒泡，解决部分手机onclick失效问题
            })

            _this.maxW = -base.calculate(_this.oneW * 10, _this.arr.length, '*')

            if (_this.nowYield - _this.min > 0) {
              _this.scrollX =
                base.calculate(_this.nowYield, _this.min, '-') * 10
              _this.scrollX = -base.calculate(_this.scrollX, _this.oneW, '*')
              _this.myRule.scrollTo(_this.scrollX, 0)
            }

            _this.myRule.on('scrollStart', () => {
              _this.disableScroll()
            })

            _this.myRule.on('scroll', () => {
              let now = -base.calculate(_this.myRule.x, _this.oneW, '/')
              now = base.calculate(now, 10, '/') + _this.min
              if (now >= 0) {
                _this.nowYield = now.toFixed(1)
              }
              if (_this.myRule.x > 0) {
                _this.myRule.scrollTo(0, 0)
              } else if (_this.myRule.x < _this.maxW) {
                _this.myRule.scrollTo(_this.maxW, 0)
              }
            })

            _this.myRule.on('scrollEnd', () => {
              let now = -base.calculate(_this.myRule.x, _this.oneW, '/')
              now = base.calculate(now, 10, '/') + _this.min
              if (now >= 0) {
                _this.nowYield = now.toFixed(1)
              }
              if (_this.myRule.x >= 0) {
                _this.myRule.scrollTo(0, 0)
              } else if (_this.myRule.x < _this.maxW) {
                _this.myRule.scrollTo(_this.maxW, 0)
              } else {
                _this.myRule.scrollTo(
                  -base.calculate(_this.nowYield - _this.min, _this.oneW, '*') *
                    10,
                  0
                )
              }
              _this.$nextTick(() => {
                _this.enableScroll()
              })
            })
          })
        }
      )
    },
    changeStartYield() {
      let _this = this
      if (!_this.isHome) {
        return
      }
      //读取目标设置数值
      local.readObject(
        {
          financing_aip_edit_stop_param: '',
        },
        (data) => {
          local.saveObject(
            {
              financing_aip_edit_stop_param: '',
            },
            () => {
              if (!data.FINANCING_AIP_EDIT_STOP_PARAM) {
                return
              }
              let oData = plugin.StringToJSON(
                data.FINANCING_AIP_EDIT_STOP_PARAM
              )
              if (_this.nowYield == oData.yieldNum) {
                return
              }
              _this.now =
                _this.space + (_this.nowYield - oData.yieldNum) * _this.oneW
              _this.nowYield = oData.yieldNum
              _this.scrollX =
                base.calculate(_this.nowYield, _this.min, '-') * 10
              _this.scrollX = -base.calculate(_this.scrollX, _this.oneW, '*')
              _this.myRule.scrollTo(_this.scrollX, 0)
            }
          )
        }
      )
    },
  },
}
</script>

<style lang="less">
@import '../Common.less';
@import './Rule.less';
</style>
