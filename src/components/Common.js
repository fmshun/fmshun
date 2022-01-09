import base from 'base'
// 获取页面高度
export const getClientHeight = () => {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  }
  return clientHeight
}
// 字符串转json
export const StringToJSON = (str) => {
  let obj = {}
  try {
    obj = JSON.parse(str)
  } catch (err) {
    base.log(err)
  }
  return obj
}

// 手机操作系统名称
export const SysName = () => {
  let className = ''
  if (base.isAndroid()) {
    className = 'andriod'
  } else if (base.isIphoneX()) {
    className = 'iphoneX'
  } else if (base.isIphoneXR()) {
    className = 'iphoneXR'
  } else if (base.isIphoneXSMax()) {
    className = 'iphoneXSMax'
  } else {
    className = 'iphone'
  }
  return className
}

/**
 * 千位处理符
 * @param num 数字（字符串形式）
 * @return 1234->1,234
 */
export const thousandBitSeparator = (num) => {
  //千位处理符
  if (-1000 < num && num < 1000) {
    return num
  } else {
    var result = [],
      counter = 0
    var left = ''
    var right = ''
    if (num == undefined) {
      return num
    }
    if (num != '0' && num != '0.00' && num.charAt(0) != '0') {
      left = num.charAt(0)
    } else {
      return num
    }
    num = num.substring(1)
    // console.log(num);
    var tmp = num.split('.')
    num = tmp[0]
    if (typeof tmp[1] != 'undefined') {
      right = '.' + tmp[1]
    }
    num = (num || 0).toString().split('')
    if (!isNaN(left)) {
      //第一位是数字
      for (let i = num.length - 1; i >= 0; i--) {
        counter++
        result.unshift(num[i])
        if (!(counter % 3)) {
          result.unshift(',')
        }
      }
    } else {
      for (let i = num.length - 1; i >= 0; i--) {
        counter++
        result.unshift(num[i])
        if (!(counter % 3) && i != 0) {
          result.unshift(',')
        }
      }
    }
    return left + result.join('') + right
  }
}

/**
 * 添加单位
 * @param num 数字（字符串形式）
 * @return 万/十万....
 */
export const unitNum = (num) => {
  let moneyLength = num.split('.')[0].length
  let moneyUnitMap = {
    '5': '万',
    '6': '十万',
    '7': '百万',
    '8': '千万',
    '9': '亿',
    '10': '十亿',
    '11': '百亿',
    '12': '千亿',
    '13': '万亿',
    '14': '十万亿',
    '15': '百万亿',
    '16': '千万亿',
  }
  if (moneyUnitMap[moneyLength]) {
    return moneyUnitMap[moneyLength]
  }
  return ''
}

/* GRID0: Array(2)
    0: "基金代码|基金名称|基金公司代码|基金公司名称|基金净值|是否首次|首次起购金额|非首次起购金额|首次最少金额|非首次最少金额|追加金额|折扣|产品权限|是否QD|是否可赎回|申购认购单位|单人上限|产品规模上限|剩余额度|单笔上限|单日上限|最低定投起点|"
    1: "110011|易方达中小盘|11|易方达|4.53650000|0|10.00|20.00|10.00|2 */
export const getCounterValue = (data, attr) => {
  if (data && data.GRID0 && attr) {
    let arr = data.GRID0
    let b = arr.map((item) => {
      return item.split('|')
    })
    if (typeof attr === 'string') {
      return b[1][b[0].indexOf(attr)]
    }
  }
}

// 定投周期数据
export const cycleInfos = {
  periods: ['每日', '每周', '每两周', '每月'],
  rates: [
    // 每日
    ['每个交易日'],
    // 每周
    ['周一', '周二', '周三', '周四', '周五'],
    // 每两周
    ['周一', '周二', '周三', '周四', '周五'],
    // 每月
    [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
    ],
  ],
}
export const stopParamInfos = ['自动赎回', '继续定投', '终止定投']
export const stockZSInfos = ['中证500', '沪深300', '创业板指'] //均线策略参考指数
export const stockJXInfos = ['250日均线', '500日均线'] //均线策略参考均线
// url
export const urls = {
  // 公募基金详情页 + 产品代码
  fundDetail:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode=',
  // 交易规则页面
  rule:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/trade-rule.html?prdtCode=',
  // 赎回成功页
  redeemSuccess:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&fullscreen=1&&url=/web_cft/financing-aip/redeem-success.html',
  redeemSuccessTEST: 'http://localhost:8080/redeem-success.html',
  // 赎回失败页 + 错误信息
  redeemFail:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/redeem-fail.html?error=',
  redeemFailTEST: 'http://localhost:8080/redeem-fail.html?error=',
  // 已完结定投 + 来源页 需要添加10090
  finishedList:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/finished-list.html?from=',
  // 我的目标盈
  targetList: `http://action:10090/?url=${encodeURIComponent(
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/target-list-v2.html'
  )}`,
  // 搜索页
  search:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&isShowDarkStatusBar=1&&url=/web_cft/financing-aip/financing-search.html?type=1',
  // 登录
  login: 'http://action:10090/?jsfuncname=',
  // 绑定微信url
  weChat:
    'http://action:10092/?url=http%3a%2f%2faction%3a10061%2f%3ffullscreen%3d1%26%26type%3d9%26%26url%3d%2fzlcftajax%2fwechat-bind%2fmain.htm',
  // 定投详情页 ?prdtCode=000877&subFundAccount=123
  aipDetail:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-detail.html',
  // 定投专区首页
  aipHome:
    'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-home.html',
  // 定投排行
  fundRanking:
    'http://action:10061/?fullscreen=1&&topColor=FF8400&&type=101&&url=/app/financing/channels/fixed-investment/fund-ranking/index.htm',
}
