<!--键盘-->
//
输入框默认用户最多只能输入9位整数+2位小数，并根据输入数字进行万位及以上的实时输入提示。
// 当输入金额超过万元时，在万位底部后方显示“万”字； //
每多输入一位，则底部固定区域显示中文翻译对应单位，即万、十万、百万、千万、亿
<template>
  <div class="keyboard" ref="keyboard">
    <div class="kLeft fl">
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
        <li class="two">00</li>
        <li>0</li>
        <li class="decimal">.</li>
      </ul>
    </div>
    <div class="kRight fl">
      <ul>
        <li class="delete">
          <img src="./images/buyNew15.png" />
        </li>
        <li class="confirm blue">确认</li>
      </ul>
    </div>
  </div>
</template>
<script>
import Waiting from '@/components/waiting/Waiting'
import base from 'base'
import ajax from 'ajax'

export default {
  name: 'Keyboard',
  props: {
    inputData: String,
    maxLength: Number,
    // confirmHighlight: Boolean,
  },
  data() {
    return {}
  },
  mounted() {
    this.bindEvent()
  },
  methods: {
    //   type：[] val为修改之后的inputval
    emitHandler: function(type) {
      this.inputData = this.checkDataLength()
      this.$emit('listenKeyboardClick', type, this.inputData)
    },
    checkDataLength: function() {
      if (this.inputData.indexOf('.') != -1) {
        // 有小数
        let newArray = this.inputData.split('.')
        if (newArray[1].length < 3) {
          return this.inputData
        }
        return newArray[0] + '.' + newArray[1].substr(0, 2)
      } else {
        // 没有小数
        if (this.inputData.length > this.maxLength) {
          return this.inputData.substr(0, this.maxLength)
        }
        return this.inputData
      }
    },
    bindEvent: function() {
      let _this = this
      //   $('#keyboard li')
      let jqRoot = $(this.$refs.keyboard)
      jqRoot
        .find('li')
        .unbind()
        .on('click', function(event) {
          // 点击效果
          $(this).addClass('on')
          setTimeout(function() {
            jqRoot.find('li').removeClass('on')
          }, 200)

          if ($(this).hasClass('delete')) {
            //删除键
            _this.inputData = _this.inputData.substr(
              0,
              _this.inputData.length - 1
            )
            _this.emitHandler('delete')
          } else if ($(this).hasClass('confirm')) {
            //确定键
            _this.emitHandler('confirm')
          } else if ($(this).hasClass('decimal')) {
            //小数点
            if (_this.inputData.indexOf('.') == -1) {
              _this.inputData = _this.inputData + '.'
            }
            _this.emitHandler('decimal')
          } else {
            // 正常输入回调
            if (_this.inputData !== '0') {
              // 小数点不超过两位
              if (_this.inputData.indexOf('.') != -1) {
                let newArray = _this.inputData.split('.')
                if (newArray[1].length < 2) {
                  _this.inputData = _this.inputData + $(this).html()
                }
              } else {
                _this.inputData = _this.inputData + $(this).html()
              }
              if (_this.inputData === '00') {
                //首次输入00转换为0
                _this.inputData = '0'
              }
            }
            _this.emitHandler('numClick')
          }

          event.stopPropagation() //  阻止事件冒泡
        })
    },
    //校验是否两位小数
    two: function(num) {
      var reg = /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/
      var isMoneyFormatRight = reg.test(num)
      return isMoneyFormatRight
    },
  },
}
</script>

<style lang="less">
@import './keyboard.less';
</style>
