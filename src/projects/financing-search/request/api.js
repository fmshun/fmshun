/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  get_sorted_invest:
    '/reqxml?action=27401&path=/time_invest/calcu_sorted_invest',
  get_hot_invest: '/reqxml?action=27401&path=/time_invest/hot_invest',
  get_calcu_search: '/reqxml?action=27401&path=/time_invest/calcu_search',
  get_collect_hold: '/reqxml?action=27401&path=/time_invest/collect_hold',
  get_foot_print: '/reqxml?action=27401&path=/time_invest/foot_print',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}
/**
 * 获取定投排行列表
 */
export const getSortedInvest = (param) => ajaxRun(url.get_sorted_invest, param)
/**
 * 获取人气定投列表
 */
export const getHotInvest = (param) => ajaxRun(url.get_hot_invest, param)
/**
 * 获取搜索结果列表
 */
export const getCalcuSearch = (param) => ajaxRun(url.get_calcu_search, param)
/**
 * 获取持仓列表
 */
export const getCollectHold = (param) => ajaxRun(url.get_collect_hold, param)
/**
 * 获取可进行定投的足迹基金
 * @params prdtIdList 产品ID列表，多个之间英文逗号分隔
 */
export const getFootPrint = (param) => ajaxRun(url.get_foot_print, param)
