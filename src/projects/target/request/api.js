/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  // 获取登录状态
  getLogin: '/reqlocal?jyloginflag=',
  // 获取目标盈首页默认产品数
  getProduct:
    '/reqxml?action=27401&path=/time_invest/calcu_sorted_invest&sortName=grandExectTimes&pageSize=1&pageNum=1&noCurrency=1',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

export const getLogin = (p) => ajaxRun(url.getLogin, p)
export const getProduct = (p) => ajaxRun(url.getProduct, p)
