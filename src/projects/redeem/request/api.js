/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  // 获取赎回页面基本数据
  getData: '/reqxml?action=27401&path=/forward&funcId=881020',
  // 赎回申请提交
  submitData: '/reqxml?action=27401&path=/forward&funcId=881021',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

export const getData = (p) => ajaxRun(url.getData, p)
export const submitData = (p) => ajaxRun(url.submitData, p)
