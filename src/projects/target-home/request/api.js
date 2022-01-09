/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  // 获取目标盈首页默认产品数
  getProduct:
    '/reqxml?action=27401&path=/time_invest/calcu_sorted_invest&sortName=grandExectTimes&pageSize=1&pageNum=1&noCurrency=1',
  // 获取登录状态
  getLogin: '/reqlocal?jyloginflag=',
  // 获取用户权限
  get5827:
    '/reqxml?action=5827&Token=($token)&MobileCode=($mobilecode)&Account=($account)',
  // 查询可委托基金详情
  get5882:
    '/reqxml?action=5882&Token=($token)&MobileCode=($mobilecode)&Account=($account)',
  // ($password)
  getInfo:
    '/reqxml?action=27401&path=/forward&funcId=881018&clientNo=($account)&fundAccount=($fund_account)&sysNodeId=($tztsysnodeid)&password=($password)',
  // 获取协议列表
  getPaperToSign:
    '/reqxml?action=27502&path=/financing/trade/paper_to_sign&clientNo=($account)&Token=($token)&TFrom=($tfrom)',
  // 查询弱账号是否绑定公众号
  isWechatBind:
    '/reqxml?action=27006&path=/3g/weixin/push/query_user_bindInfo&uid=($weakaccount)&wtoken=($weaktoken)',
  // 广告推荐栏
  getRecommend: '/reqxml?action=27401&path=/time_invest/advertise_info',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

// 获取目标盈首页默认产品
export const getProduct = (p) => ajaxRun(url.getProduct, p)
// 获取登录状态
export const getLogin = (p) => ajaxRun(url.getLogin, p)
// 获取用户权限
export const get5827 = (p) => ajaxRun(url.get5827, p)
// 查询可委托基金详情
export const get5882 = (p) => ajaxRun(url.get5882, p)
//
export const getInfo = (p) => ajaxRun(url.getInfo, p)
// 获取协议列表
export const getPaperToSign = (p) => ajaxRun(url.getPaperToSign, p)
// 查询弱账号是否绑定公众号
export const isWechatBind = (p) => ajaxRun(url.isWechatBind, p)
// 广告推荐栏
export const getRecommend = (p) => ajaxRun(url.getRecommend, p)

// Promise.all() 方法封装
function promiseAll(urls, params) {
  // 处理单个promise，即使里面其中一个方法reject，也当做resolve处理
  function handlePromise(url, param) {
    return new Promise((resolve /* , reject */) => {
      ajax.run(url, param, resolve, resolve)
    })
  }
  // promise对象集合
  let promiseArr = []
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i]
    let param = params && params[i]
    promiseArr.push(handlePromise(url, param))
  }
  return Promise.all(promiseArr)
}

export const ajaxAll = (urls, params) => promiseAll(urls, params)
