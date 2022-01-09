<template>
  <div class="chart_container">
    <div class="chart_content">
      <img
        :style="{ top: yieldTop + 'px' }"
        class="line"
        src="../../assets/line.png"
        alt
      />
      <div :class="[tipsStyle]" :style="{ bottom: strTop }" class="yield_tips">
        <div class="yield_tips_txt">
          {{ strYield }}
          <span>%</span>
        </div>
      </div>
      <canvas></canvas>
    </div>
  </div>
</template>
<script>
import dot from '../../assets/chart_dot.png'

import base from 'base'
import loadScripts from '@/utils/loadScripts'

export default {
  name: 'trend',
  props: {
    nums: Array,
    index: Number,
    yield: Number,
  },
  data() {
    return {
      //canvas放大的倍数
      mult: 2,
      // 横坐标线宽
      xAxisWidth: 1,
      // 横坐标颜色
      xAxisColor: '#F2F2F2',
      // 背景色
      bgColor: '#fff',
      // 字体颜色
      fontColor: 'rgba(102, 102, 102, .7)',
      width: 0,
      height: 0,
      ele: null,
      ctx: null,
      // 最小值
      min: 0,
      // 最大值
      max: 0,
      points: [],
      xLeft: 16,
      num: 0,
      lineGradient: ['rgb(190,221,255)', '#1E86F8'],
      bgGradient: ['rgba(21,131,255,0.56)', 'rgba(21,131,255,0.00)'],
      // 横线
      horizontalLineNum: 4,
      // 8*2
      paddingTop: 16,
      paddingBottom: 0,
      txtWidth: 0,
      yieldTop: 0,
    }
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
    strTop() {
      let top = 0
      if (this.points.length > 0) {
        let dotObj = this.points[this.points.length - 1]
        if (!isNaN(dotObj.y)) {
          top = (this.height - dotObj.y - 16) / 2
        }
      }

      return `${top}px`
    },
  },
  mounted() {
    let _this = this
    _this.$nextTick(() => {
      _this.init()
    })
  },
  methods: {
    // 切换走势图
    changeTrend() {
      this.init()
    },
    init() {
      // 初始化数据
      this.initData()
      // 清空canvas
      this.clearRect()
      // 画坐标轴
      this.drawAxis()
      // 画曲线
      this.drawPolyline()
      // 画圆点
      this.drawPoint()
    },
    initData() {
      // 获取数组中最大最小值
      this.min = Math.min.apply(null, this.nums)
      this.max = Math.max.apply(null, this.nums)
      if (this.min == this.max) {
        this.min -= 0.02
        this.max += 0.02
      }
      // canvas宽度重置
      this.ele = document.querySelectorAll('canvas')[this.index]
      this.width = this.ele.clientWidth * this.mult
      this.height = this.ele.clientHeight * this.mult
      this.ele.width = this.width
      this.ele.height = this.height
      this.ctx = this.ele.getContext('2d')
    },
    // 清空矩形框
    clearRect() {
      this.ctx.clearRect(0, 0, this.width, this.height)
    },
    // 画矩形背景
    drawRectBg() {
      this.ctx.beginPath()
      this.ctx.fillStyle = this.bgColor
      this.ctx.fillRect(0, 0, this.width, this.height)
    },
    // 画坐标轴
    drawAxis() {
      let oneH = base.calculate(this.height, 4, '/'),
        oneNum = base.calculate(this.max - this.min, 4, '/')
      // canvas的高度 / （最大值-最低值）
      this.num = base.calculate(this.height, this.max - this.min, '/')
      for (let i = 1; i <= 4; i++) {
        //横坐标
        this.ctx.lineWidth = this.xAxisWidth * this.mult
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.xAxisColor
        let H = base.calculate(oneH, i, '*')
        let fontsH = base.calculate(oneH, i - 1, '*')
        // 填充文字
        this.drawFonts(
          this.ctx,
          Number((this.min + oneNum * (i - 1)).toFixed(2)),
          this.height - fontsH
        )
        this.ctx.moveTo(0, H - this.ctx.lineWidth)
        this.ctx.lineTo(this.width - this.xLeft, H - this.ctx.lineWidth)
        this.ctx.stroke()
      }
    },
    // 画曲线
    drawPolyline() {
      this.points = []
      let nCanvasWidth = this.width - this.txtWidth - this.xLeft,
        nCanvasHeight = this
          .height /*  - this.paddingTop - this.paddingBottom */,
        // canvas的高度 / （最大值-最低值）
        num = this.getPixPerVal(nCanvasHeight),
        _this = this,
        space = base.calculate(nCanvasWidth, this.nums.length - 1, '/')

      _this.nums.forEach((item, index) => {
        _this.points.push({
          x: space * index + _this.txtWidth,
          y: _this.height - (item - _this.min) * num,
        })
      })

      if ((this.yield - _this.min) * num + _this.paddingTop + 5 > this.height) {
        _this.yieldTop = -12
      } else {
        _this.yieldTop =
          (this.height -
            ((this.yield - _this.min) * num + _this.paddingTop + 5)) /
          2
      }

      _this.ctx.beginPath()
      _this.points.forEach((item, index) => {
        if (index === 0) {
          _this.ctx.moveTo(item.x, item.y)
        } else {
          _this.ctx.lineTo(item.x, item.y)
        }
        _this.ctx.lineWidth = 1 * _this.mult
        // lineGradient
        let lineStyle = _this.ctx.createLinearGradient(
            0,
            0,
            _this.width - 6,
            0
          ),
          space = 1 / (_this.lineGradient.length - 1)
        _this.lineGradient.forEach((item, index) => {
          lineStyle.addColorStop(index * space, item)
        })
        _this.ctx.strokeStyle = lineStyle
        _this.ctx.stroke()
      })
      _this.ctx.lineTo(_this.width - _this.xLeft, _this.height)
      _this.ctx.lineTo(_this.txtWidth, _this.height)
      _this.ctx.closePath()
      let color = _this.ctx.createLinearGradient(0, 0, 0, _this.height),
        spa = 1 / (_this.bgGradient.length - 1)
      _this.bgGradient.forEach((item, index) => {
        color.addColorStop(index * spa, item)
      })
      _this.ctx.fillStyle = color
      _this.ctx.fill()
    },
    // 画圆点
    drawPoint() {
      this.ctx.save()
      this.ctx.fillStyle = '#2789F7'
      this.ctx.shadowOffsetX = 2 // 阴影baiY轴偏移
      this.ctx.shadowOffsetY = 2 // 阴影X轴偏移
      this.ctx.shadowBlur = 5 // 模糊尺寸
      this.ctx.shadowColor = 'rgba(39,137,247,0.36)' // 颜色

      let now = this.points[this.points.length - 1]

      this.ctx.beginPath()
      if (isNaN(now.x)) {
        now.x = 8
      }

      if (now.y + 10 > this.height) {
        now.y = this.height - 10
      }

      /* if(now.y < 5){
        now.y += 5
      } */

      this.ctx.arc(now.x, now.y, 5, 0, 2 * Math.PI)
      this.ctx.strokeStyle = '#fff'
      this.ctx.lineWidth = 8
      this.ctx.stroke()
      this.ctx.fill()
    },
    // 填充文字
    drawFonts(ctx, num, height) {
      let str = `${num}%`
      if (str.length > this.fontsMaxLen) {
        this.fontsMaxLen = str.length
      }
      ctx.font = '22px "PingFangSC-Regular"'
      // 字体颜色
      ctx.fillStyle = this.fontColor

      let w = str.length * 15
      if (w > this.txtWidth) {
        this.txtWidth = w
      }

      ctx.fillText(str, 0, height - 10)
    },
    getPixPerVal(height) {
      let v = this.max - this.min //最高价格和最低价格的差
      if (v === 0) {
        v = 0.04 //数值全一样情况
        this.max += 0.02
        this.min -= 0.02
      }
      return height / v //一个像数代表多少价格
    },
  },
}
</script>

<style lang="less">
.chart_content {
  position: relative;
  padding-top: 6px;
  canvas {
    display: block;
    // 304+8 圆点
    width: 312px;
    // 99+8 圆点
    height: 107px;
    margin-top: -8px;
    // border: 1px solid red;
  }
  .line {
    position: absolute;
    // top: 0;
    left: 0;
    width: 304px;
    height: 8px;
    margin-top: 3px;
  }
  .chart_dot {
    position: absolute;
    z-index: 10;
    display: block;
    width: 19px;
    height: 19px;
  }
  .yield_tips {
    position: absolute;
    white-space: nowrap;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
    .yield_tips_txt {
      position: relative;
      top: -15px;
      padding: 4px 6px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      line-height: 12px;
      color: #ffffff;
      letter-spacing: 0;
      // left: -100%;
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
}
</style>
