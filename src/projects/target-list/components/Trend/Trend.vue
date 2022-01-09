<template>
  <div class="chart_content">
    <canvas></canvas>
    <img
      :style="{ bottom: yieldTop + 'px' }"
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
    <img
      :style="{ bottom: strTop, left: strLeft }"
      class="chart_dot"
      src="../../assets/chart_dot.png"
      alt
    />
  </div>
</template>

<script>
import base from 'base'

export default {
  name: 'trend',
  props: {
    nums: Array,
    index: Number,
    min: Number,
    max: Number,
    yield: Number,
  },
  data() {
    return {
      //canvas放大的倍数
      mult: 2,
      // 背景色
      bgColor: '#fff',
      // 横坐标线宽
      xAxisWidth: 1,
      // 横坐标颜色
      xAxisColor: '#F2F2F2',
      // 字体颜色
      fontColor: 'rgba(102, 102, 102, .7)',
      fontsMaxLen: 0,
      points: [],
      totalNum: 0,
      lineGradient: ['#1583FF', '#1E86F8'],
      bgGradient: ['rgba(21,131,255,0.56)', 'rgba(21,131,255,0.00)'],
      width: 0,
      height: 0,
      ele: null,
      ctx: null,
      dotleft: 0,
      dotTop: 0,
      dotW: 0,
      dotObj: {},
      yieldTop: 0,
      xLeft: 50,
    }
  },
  computed: {
    strTop() {
      let top = 0
      if (!isNaN(this.dotObj.y)) {
        top = (this.height - this.dotObj.y - this.dotW) / 2
      }
      return `${top}px`
    },
    strLeft() {
      let left = 0
      if (!isNaN(this.dotObj.x)) {
        left = (this.dotObj.x - this.dotW) / 2
      }
      return `${left}px`
    },
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
  mounted() {
    let _this = this
    _this.$nextTick(() => {
      _this.init()
    })
  },
  methods: {
    init() {
      // 初始化数据
      this.initData()
      // 清空矩形框
      this.clearRect()
      // 画矩形背景
      this.drawRectBg()
      // 画坐标轴
      this.drawAxis()
      // 画曲线
      this.drawPolyline()
      this.$forceUpdate()
    },
    initData() {
      this.dotW = document.querySelector('.chart_dot').clientWidth
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
        total = Math.ceil(base.calculate(this.max, this.min, '-') / 10) * 10,
        oneNum = base.calculate(total, 4, '/')
      this.totalNum = total
      let nowNum = Math.ceil(this.min)
      for (let i = 1; i <= 4; i++) {
        //横坐标
        this.ctx.lineWidth = this.xAxisWidth * this.mult
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.xAxisColor
        let H = base.calculate(oneH, i, '*')
        let fontsH = base.calculate(oneH, i - 1, '*')
        // 填充文字
        this.drawFonts(this.ctx, nowNum, this.height - fontsH)
        nowNum = base.calculate(nowNum, oneNum, '+')
        this.ctx.moveTo(0, H - this.ctx.lineWidth)
        this.ctx.lineTo(this.width, H - this.ctx.lineWidth)
        this.ctx.stroke()
      }
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
      ctx.fillText(str, 0, height - 10)
    },
    // 画曲线
    drawPolyline() {
      this.points = []
      // 处理每个点的数据
      let len = this.nums.length,
        space = base.calculate(this.width - this.xLeft, len - 1, '/'),
        spaceY = base.calculate(this.height, this.totalNum, '/'),
        _this = this
      _this.nums.forEach((item, index) => {
        let num = 0
        if (_this.min < 0) {
          num = base.calculate(item, _this.min, '-')
        }
        num = base.calculate(_this.totalNum, item, '-')
        num = base.calculate(num, spaceY, '*')
        _this.points.push({
          x: space * index + _this.xLeft,
          y: num,
        })
      })
      if (_this.max >= _this.yield) {
        if (_this.min < 0) {
          _this.yieldTop = base.calculate(_this.yieldTop, _this.min, '-')
        }
        _this.yieldTop = base.calculate(_this.totalNum, _this.yield, '-')
        _this.yieldTop = base.calculate(_this.yieldTop, spaceY, '*')
        _this.yieldTop = Math.abs(
          base.calculate(_this.yieldTop, _this.height, '-')
        )
        _this.yieldTop = base.calculate(_this.yieldTop, 2, '/')
      }

      _this.ctx.beginPath()
      _this.points.forEach((item, index) => {
        if (index === 0) {
          _this.ctx.moveTo(item.x, item.y)
        } else {
          let ctrlP = _this.getCtrlPoint(_this.points, index - 1)
          if (Math.abs(_this.points[index].y - _this.points[index - 1].y) < 2) {
            _this.ctx.lineTo(_this.points[index].x, _this.points[index].y)
          } else {
            _this.ctx.bezierCurveTo(
              ctrlP.pA.x,
              ctrlP.pA.y,
              ctrlP.pB.x,
              ctrlP.pB.y,
              item.x,
              item.y
            )
          }
        }
        _this.ctx.lineWidth = 1 * _this.mult
        // lineGradient
        let lineStyle = _this.ctx.createLinearGradient(6, 0, 2, _this.height),
          space = 1 / (_this.lineGradient.length - 1)
        _this.lineGradient.forEach((item, index) => {
          lineStyle.addColorStop(index * space, item)
        })
        _this.ctx.strokeStyle = lineStyle
        _this.ctx.stroke()
      })
      _this.ctx.lineTo(_this.width, _this.height - 1)
      _this.ctx.lineTo(0, _this.height - 1)
      _this.ctx.closePath()
      let color = _this.ctx.createLinearGradient(6, 0, 2, _this.height),
        spa = 1 / (_this.bgGradient.length - 1)
      _this.bgGradient.forEach((item, index) => {
        color.addColorStop(index * spa, item)
      })
      _this.ctx.fillStyle = color
      _this.ctx.fill()
      _this.dotObj = _this.points[_this.points.length - 1]
    },
    /**贝塞尔控制点
     * 贝斯曲线
     * @param {Object} ps   已知曲线将经过的坐标点
     * @param {number} i    第i个坐标点
     * @param {number} a    可以自定义的正数
     * @param {number} b    可以自定义的正数
     */
    getCtrlPoint(ps, i, a, b) {
      if (!a || !b) {
        a = 0.05
        b = 0.05
      }
      //处理两种极端情形
      if (i < 1) {
        var pAx = ps[0].x + (ps[1].x - ps[0].x) * a
        var pAy = ps[0].y + (ps[1].y - ps[0].y) * a
      } else {
        var pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * a
        var pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * a
      }
      if (i > ps.length - 3) {
        var last = ps.length - 1
        var pBx = ps[last].x - (ps[last].x - ps[last - 1].x) * b
        var pBy = ps[last].y - (ps[last].y - ps[last - 1].y) * b
      } else {
        var pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b
        var pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b
      }
      return {
        pA: {
          x: pAx,
          y: pAy,
        },
        pB: {
          x: pBx,
          y: pBy,
        },
      }
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
    width: 304px;
    height: 99px;
  }
  .line {
    position: absolute;
    // top: 0;
    left: 0;
    width: 309px;
    height: 8px;
    margin-top: 6px;
  }
  .chart_dot {
    position: absolute;
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
      top: -20px;
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
