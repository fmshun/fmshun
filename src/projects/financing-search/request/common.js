/**
 * 公共方法
 */
import ajax from 'ajax'
function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}
let common = {
  url: {
    getSelfStockList: '/reqlocal?selfstocklist=',
    getAppUserType: '/reqlocal?appUserType=',
    isLogin: '/reqlocal?weakaccount=&weaktoken=&jyloginflag=&account=',
  },
  /**
   * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数
   * @param func 执行函数
   * @param wait 时间间隔
   * @param options 如果你想禁用第一次首先执行的话，传递{leading: false}，
   *                如果你想禁用最后一次执行的话，传递{trailing: false}
   * @returns {Function}
   */
  throttle: function(func, wait, options) {
    var context, args, result
    var timeout = null
    var previous = 0
    if (!options) options = {}
    var later = function() {
      previous = options.leading === false ? 0 : new Date().getTime()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
    return function() {
      var now = new Date().getTime()
      if (!previous && options.leading === false) previous = now
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  },
  /**
   * 判断是否登录
   */
  isLogin: function(callback) {
    let self = this
    ajaxRun(self.url.isLogin).then((oData) => {
      if (oData) {
        var weakAccount = oData.WEAKACCOUNT
        var account = oData.ACCOUNT
        var token = oData.WEAKTOKEN
        var jylogin = oData.JYLOGINFLAG

        var loginFlag = {
          login: false,
          uid: weakAccount,
          account: account,
          weakLogin: false,
        }
        if (
          token &&
          token != '' &&
          token != '($WEAKTOKEN)' &&
          typeof token != 'undefined'
        ) {
          //弱账户登录
          loginFlag.weakLogin = true
        }
        if (jylogin > 1) {
          //强账户登录
          loginFlag.login = true
        }
        if (typeof callback == 'function') {
          callback(loginFlag)
        }
      } else {
        callback()
      }
    })
  },
}
export default common
