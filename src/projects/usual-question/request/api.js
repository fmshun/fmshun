/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  getAnswer: '/reqxml?action=27006&path=/time_invest/qa',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

/**
 * 获取常见问题
 */
export const getAnswer = (param) => ajaxRun(url.getAnswer, param)
