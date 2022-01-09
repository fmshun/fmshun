/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  getCalResult: '/reqxml?action=27401&path=/time_invest/calculate_result',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

/**
 * 获取结算结果
 * @params prdtId 产品id
 * @params startDate 开始日期
 * @params endDate 结束日期
 * @params periodType 定投间隔类型
 * @params amount 每期金额
 * @params aipDay
 */
export const getCalResult = (param) => ajaxRun(url.getCalResult, param)
