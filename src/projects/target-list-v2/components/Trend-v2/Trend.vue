<template>
  <div class="chart_container">
    <div :id="'chart_content_' + index" class="chart_content"></div>
    <img
      :style="{ top: yieldTop + 'px' }"
      class="line"
      src="../../assets/line.png"
      alt
    />
    <div
      v-if="strYield"
      :class="[tipsStyle]"
      :style="{ top: strTop }"
      class="yield_tips"
    >
      <div class="yield_tips_txt">
        {{ strYield }}
        <span>%</span>
      </div>
    </div>
  </div>
</template>
<script>
import loadScripts from '@/utils/loadScripts'
import { Chart } from '@/libs/chart-v2.js'
export default {
  name: 'trend',
  props: {
    nums: Array,
    index: Number,
    yield: Number,
    myScroll: Object,
  },
  computed: {
    tipsStyle() {
      if (this.nums.length === 1) {
        return 'left'
      } else {
        return 'right'
      }
    },
    strYield() {
      return this.nums[this.nums.length - 1]
    },
  },
  data() {
    return {
      min: 0,
      max: 0,
      values: [],
      heights: [],
      ctx: null,
      height: 0,
      width: 0,
      oneNum: 0,
      strTop: 0,
      yieldTop: 0,
    }
  },
  created() {
    loadScripts(['/common/vendor/flexible-0.3.2/flexible.js']).then(() => {})
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.values = []
      this.heights = []
      this.min = this.nums.length > 0 ? Math.min.apply(null, this.nums) : 0
      this.max = Math.max.apply(null, [
        ...this.nums,
        isNaN(this.yield) ? 0 : this.yield,
      ])

      if (this.min == this.max) {
        this.max = this.max + 5
      }
      let _this = this
      let options = {
        dom: `#chart_content_${this.index}`,
        scale: 1.2,
        drawType: 0,
        saveImg: false,
        min: this.min,
        max: this.max,
        series: [
          {
            // 收益率
            type: 'line',
            drawType: 0,
            data: this.nums,
            lineStyle: {
              lineWidth: '1.5',
              strokeStyle: ['rgba(21, 131, 255, .3)', '#1E86F8'],
              fillStyle: ['rgba(21,131,255,0.56)', 'rgba(21,131,255,0.00)'],
              // font: '10px PingFangSC-Regular',
            },
            //节点 木有则不显示 默认不展示
            node: {
              //类型目前为元
              type: 'circle',
              drawIndex: [this.nums.length - 1], //需要画的索引号
              // size 目前为半径,后续可为数组 扩展对应类型
              size: 2.5,
              show: true,
              lineStyle: {
                strokeStyle: '#fff',
                lineWidth: 4,
                fillStyle: '#2789F7',
                shadowOffsetX: 2, // 阴影baiY轴偏移
                shadowOffsetY: 2, // 阴影X轴偏移
                shadowBlur: 5, // 模糊尺寸
                shadowColor: 'rgba(39,137,247,0.36)',
              },
              //负值
              negativeLineStyle: {
                strokeStyle: '#fff',
                lineWidth: 4,
                fillStyle: '#2789F7',
                shadowOffsetX: 2, // 阴影baiY轴偏移
                shadowOffsetY: 2, // 阴影X轴偏移
                shadowBlur: 5, // 模糊尺寸
                shadowColor: 'rgba(39,137,247,0.36)',
              },
            },
          },
        ],
        flexible: {
          left: 48,
          top: 8,
          right: 8,
          bottom: 8,
        },
        yAxis: {
          show: true,
          avgNum: 4,
          labelAlign: 'outside',
          // [上下,左右] [上,左右,下][上,右,下,左]
          margin: [0, 0, 8, 40],
          basisPoint: true,
          lineStyle: {
            lineWidth: 1,
            strokeStyle: 'rgba(0,0,0,0)',
          },
          textStyle: {
            font: '10px PingFangSC-Regular',
            fillStyle: '#c1c1c1',
            textAlign: 'left',
          },
          formatter: function(value) {
            _this.values.push(value)
            return ''
          },
        },
        grid: {
          showYgridLine: true,
          /**
           * 画辅助线
           * @param {object} ctx canvas的画图对象
           * @param {object} option 画图插件的选项对象
           */
          drawYCustomGraph: function(ctx, option) {
            _this.ctx = ctx
            let width = $(`#chart_content_${_this.index}`).innerWidth() - 16
            let height = $(`#chart_content_${_this.index}`).innerHeight() - 16
            // _this.oneNum = height / (_this.max - _this.min)
            _this.height = height
            _this.width = width
            let space = height / 4
            let add = 8
            //第二条
            ctx.beginPath()
            _this.heights[3] = space + add - 5
            ctx.moveTo(8, space + add)
            ctx.lineTo(width + 8, space + add)
            ctx.strokeStyle = '#F2F2F2'
            ctx.stroke()
            //第三条
            ctx.beginPath()
            _this.heights[2] = space * 2 + add - 5
            ctx.moveTo(8, space * 2 + add)
            ctx.lineTo(width + 8, space * 2 + add)
            ctx.strokeStyle = '#F2F2F2'
            ctx.stroke()
            //第四条
            ctx.beginPath()
            _this.heights[1] = space * 3 + add - 5
            ctx.moveTo(8, space * 3 + add)
            ctx.lineTo(width + 8, space * 3 + add)
            ctx.strokeStyle = '#F2F2F2'
            ctx.stroke()
            //第五条
            ctx.beginPath()
            _this.heights[0] = space * 4 + add - 5
            ctx.moveTo(8, space * 4 + add)
            ctx.lineTo(width + 8, space * 4 + add)
            ctx.strokeStyle = '#F2F2F2'
            ctx.stroke()
            ctx.restore()
          },
        },
      }
      new Chart(options)
      // 如果走势图没有值，依然显示横坐标轴
      if (_this.values.length == 0) {
        let valueStep = base.calculate(_this.max - _this.min, 4, '/')
        for (let i = 0; i < 5; i++) {
          _this.values.push(Number((_this.min + valueStep * i).toFixed(2)))
        }
      }
      _this.values.forEach((item, index) => {
        _this.ctx.beginPath()
        let str = `${item.toFixed(2)}%`
        _this.ctx.font = '11px "PingFangSC-Regular"'
        // 字体颜色
        _this.ctx.fillStyle = 'rgba(102, 102, 102, .7)'
        _this.ctx.fillText(str, 0, _this.heights[index])
        _this.ctx.stroke()
      })
      // 红线
      _this.oneNum = _this.height / (_this.values[4] - _this.values[0])
      _this.yieldTop =
        _this.height - (_this.yield - _this.values[0]) * _this.oneNum
      /* _this.ctx.beginPath()
      _this.ctx.setLineDash([5, 5])
      _this.ctx.shadowBlur = 6
      _this.ctx.shadowColor = 'rgba(249,141,137,0.30)'
      _this.ctx.lineWidth = 0.25
      _this.oneNum = _this.height / (_this.values[4] - _this.values[0])
      _this.ctx.moveTo(
        8,
        _this.height - (_this.yield - _this.values[0]) * _this.oneNum + 8
      )
      _this.ctx.lineTo(
        _this.width + 8,
        _this.height - (_this.yield - _this.values[0]) * _this.oneNum + 8
      )
      _this.ctx.strokeStyle = '#FF7778'
      _this.ctx.stroke() */
      // 文字话术
      let nowPonits = _this.nums[_this.nums.length - 1]
      _this.strTop =
        _this.height - (nowPonits - _this.values[0]) * _this.oneNum + 8 + 'px'
      _this.myScroll && _this.myScroll.refresh()
    },
    // 切换走势图
    changeTrend() {
      this.init()
    },
  },
}
</script>
<style lang="less">
.chart_container {
  position: relative;
}
.line {
  position: absolute;
  // top: 0;
  left: 20px;
  width: 304px;
  height: 8px;
  margin-top: 10px;
}
.yield_tips {
  position: absolute;
  z-index: 2;
  white-space: nowrap;
  // margin-bottom: 16px;
  &.left {
    left: 60px;
  }
  &.right {
    right: 0;
  }
  .yield_tips_txt {
    position: relative;
    top: -25px;
    right: 50%;
    z-index: 2;
    padding: 4px 6px;
    margin-right: -6px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    line-height: 12px;
    color: #ffffff;
    letter-spacing: 0;
    background: #1e86f8;
    border-radius: 3px;
    box-shadow: 2px 2px 4px 0 rgba(30, 134, 248, 0.24);
    span {
      position: relative;
      margin-left: -2px;
      font-size: 10px;
    }
  }
}
.chart_content {
  position: relative;
  z-index: 0;
  // 304+16 圆点
  width: 320px;
  // 108+16 圆点
  height: 132px;
  // padding-top: 6px;
  margin-top: -10px;
  // margin-bottom: -8px;
  margin-left: -8px;
}
</style>
