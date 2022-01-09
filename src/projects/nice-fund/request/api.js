/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  getTest: '/reqxml?action=27006&path=/test',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

export const getTest = (p) => ajaxRun(url.getTest, p)
