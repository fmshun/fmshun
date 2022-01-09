/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  // 我的定投
  getData: '/reqxml?action=27017&path=/time_invest/my_invest',
  // 走势图
  // type=2&clientNo=666600275301&subFundAccount=666600275301&bgnDt=20200628
  getTrend: '/reqxml?action=27401&path=/time_invest/fixed_investment_trend',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

// 获取目标盈列表
export const getData = (p) => ajaxRun(url.getData, p)
// 走势图
export const getTrend = (p) => ajaxRun(url.getTrend, p)

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
