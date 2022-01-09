<template>
  <div
    :class="{ target_home: isHome, android: isAndroid }"
    class="rule_container"
  >
    <div class="rule_num flex flex_center flex_middle">
      <div>{{ strNowYield }}</div>
      <span>%TEST</span>
    </div>
    <!-- <img src="./assets/ruler.png" alt="">
    <img src="./assets/ruler2.png" alt=""> -->
    <div class="rule_content">
      <img class="rule_pointer" src="./assets/pointer.png" alt />
      <div class="rule_content_2">
        <div class="rule_body_contianer">
          <div class="rule_body">
            <!-- 78 28 -->
            <div
              v-for="(item, index) in arr"
              :key="index"
              class="rule_one"
              style="width: 39px;height:28px"
            >
              <img
                style="width: 39px;height:14px"
                src="./assets/ruler.png"
                alt=""
              />
              <br />
              <span v-if="item % 2 == 0" class="scale-v">{{ item }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
      isAndroid: false,
      myRule: null,
      nowYield: 0,
      arr: [],
      oneW: 0,
      scrollX: 0,
      maxW: 0,
      minW: 0,
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
    this.isAndroid = !base.isIOS() ? true : false
    this.nowYield = this.initYield
    this.initData()
    this.initScroll()
  },
  methods: {
    initData() {
      this.arr = []
      for (let i = this.min; i <= this.max; i++) {
        this.arr.push(i)
        /* if (i < this.max) {
          let i2 = i
          for (var index = 1; index < 10; index++) {
            i2 = base.calculate(i2, 0.1, '+')
            this.arr.push(i2)
          }
        } */
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
            let totalW = document.querySelector('.rule_body').clientWidth
            _this.oneW = 39 /* base.calculate(totalW, _this.arr.length - 1, '/') */
            let IScroll = window.IScroll
            _this.myRule = new IScroll('.rule_content_2', {
              scrollX: true,
              scrollY: false,
              bounce: false,
              // mouseWheel: true,
              //加入以下三个可解决
              disablePointer: true,
              disableTouch: false,
              disableMouse: true,
              probeType: 3,
              // momentum: true,
              click: base.isIOS() ? false : true,
              preventDefault: false, //不阻止事件冒泡，解决部分手机onclick失效问题
            })

            _this.maxW = -base.calculate(_this.oneW, _this.arr.length - 1, '*')

            if (_this.nowYield - _this.min > 0) {
              _this.scrollX = base.calculate(
                _this.nowYield,
                _this.min,
                '-'
              ) /*  * 10 */
              _this.scrollX = -base.calculate(_this.scrollX, _this.oneW, '*')
              _this.myRule.scrollTo(_this.scrollX, 0)
            }
            _this.myRule.on('scrollStart', () => {
              _this.disableScroll()
            })
            _this.myRule.on('scroll', () => {
              let now = -base.calculate(_this.myRule.x, _this.oneW, '/')
              now = now /* base.calculate(now, 10, '/') */ + _this.min
              // console.log(_this.nowYield,_this.myRule.x)
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
              now = now /* base.calculate(now, 10, '/') */ + _this.min
              // console.log(_this.nowYield)
              if (now >= 0) {
                _this.nowYield = now.toFixed(1)
              }
              if (_this.myRule.x >= 0) {
                _this.myRule.scrollTo(0, 0)
              } else if (_this.myRule.x < _this.maxW) {
                _this.myRule.scrollTo(_this.maxW, 0)
              } else {
                _this.myRule.scrollTo(
                  -base.calculate(
                    _this.nowYield - _this.min,
                    _this.oneW,
                    '*'
                  ) /*  *10 */,
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
