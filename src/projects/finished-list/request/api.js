/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  // 获取已完结定投列表
  getData:
    '/reqxml?action=27017&path=/time_invest/cleared_invest_list&clientNo=($account)',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

// 获取已完结定投列表
export const getData = (p) => ajaxRun(url.getData, p)
