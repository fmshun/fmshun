/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  getProductInfo: '/reqxml?action=27401&path=/time_invest/calculator',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

/**
 * 获取产品详情设置
 */
export const getProductInfo = (param) => ajaxRun(url.getProductInfo, param)
