import base from 'base'

//边距配制
var EdgeConfig = {
  andriod: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  iphone: {
    top: 20,
    right: 0,
    bottom: 0,
    left: 0,
  },
  iphoneX: {
    top: 40,
    right: 0,
    bottom: 34,
    left: 0,
  },
  iphoneXR: {
    top: 40,
    right: 0,
    bottom: 34,
    left: 0,
  },
  iphoneXSMax: {
    top: 40,
    right: 0,
    bottom: 34,
    left: 0,
  },
}
//系统类型判断
var SystemType = {
  /**
   * 判断是否为android平台
   */
  isAndroid: function() {
    return navigator.appVersion.toLocaleLowerCase().indexOf('android') > 0
  },

  /**
   * 判断是否为iOS平台
   */
  isIOS: function() {
    return (
      navigator.appVersion.toLocaleLowerCase().indexOf('iphone') > 0 ||
      navigator.appVersion.toLocaleLowerCase().indexOf('ipad') > 0
    )
  },
  /**
   * 判断是否是iphonex
   */
  isIphoneX: function() {
    return (
      /iphone/gi.test(window.navigator.userAgent) &&
      window.devicePixelRatio &&
      // window.devicePixelRatio === 3 &&
      window.screen.width === 375 &&
      window.screen.height === 812
    )
  },
  //iphone xr
  isIphoneXR: function() {
    return (
      /iphone/gi.test(window.navigator.userAgent) &&
      window.devicePixelRatio &&
      window.devicePixelRatio === 2 &&
      window.screen.width === 414 &&
      window.screen.height === 896
    )
  },
  // xs max
  isIphoneXSMax: function() {
    return (
      /iphone/gi.test(window.navigator.userAgent) &&
      window.devicePixelRatio &&
      window.devicePixelRatio === 3 &&
      window.screen.width === 414 &&
      window.screen.height === 896
    )
  },
}
/**
 * NavigationBar 头部导航
 * @method NavigationBar
 * @param {obj} option
 */
var NavigationBar = function(option) {
  this.option = {
    mountDom: option.mountDom || '.main', //需要挂载的dom class
    title: option.title || '',
    rightTitle: option.rightTitle || '',
    leftEvent: option.leftEvent,
    rightEvent: option.rightEvent,
    callback: option.callback,
    updateNextTop: option.updateNextTop || false,
  }
  this.init()
}
NavigationBar.prototype = {
  //初始化
  init: function() {
    this.createHtml()
      .updateHtml()
      .bindEvent()
  },
  //页面事件绑定
  bindEvent: function() {
    var _this = this
    //左侧返回
    $('.navigation-bar .left').on('click', function() {
      if (_this.option.leftEvent) {
        _this.option.leftEvent()
      } else {
        base.href('http://action:3413')
      }
    })
    //右侧事件
    $('.navigation-bar .right').on('click', function() {
      if (_this.option.rightEvent) {
        _this.option.rightEvent()
      }
    })
  },
  //导航栏html创建
  createHtml: function() {
    var _this = this
    var option = this.option
    var system = this.systemJudge()
    var html = '<div class="navigation-bar ' + system + '">'
    html += '<div class="navigation-bar-bg"></div>'
    html +=
      '<div class="navigation-bar-wrap" style="padding-top:' +
      EdgeConfig[system].top +
      'px">'
    html += '<div class="navigation-bar-menu">'
    html += '<div class="left">'
    html += '</div>'
    html += '<div class="title">'
    html += option.title
    html += '</div>'
    html += '<div class="right">'
    html += option.rightTitle
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    $('body')
      .addClass(system)
      .find(option.mountDom)
      .prepend(html)

    return this
  },
  updateHtml: function() {
    var _this = this
    if (this.callTimer) {
      clearTimeout(this.callTimer)
    }
    this.callTimer = setTimeout(function() {
      var navHeight = parseFloat(
        getComputedStyle(document.querySelector('.navigation-bar'), null).height
      )
      if (_this.option.updateNextTop) {
        $('.navigation-bar')
          .next()
          .css({
            top: navHeight,
          })
      }
      if (_this.option.callback) {
        _this.option.callback({
          height: navHeight,
        })
      }
    }, 300)

    return this
  },
  //系统判断
  systemJudge: function() {
    var className = ''
    if (SystemType.isAndroid()) {
      className = 'andriod'
    } else if (SystemType.isIphoneX()) {
      className = 'iphoneX'
    } else if (SystemType.isIphoneXR()) {
      className = 'iphoneXR'
    } else if (SystemType.isIphoneXSMax()) {
      className = 'iphoneXSMax'
    } else {
      className = 'iphone'
    }
    return className
  },
}
export default NavigationBar
