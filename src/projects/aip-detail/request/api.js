/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  getData:'/reqxml?action=27006&path=/financing/tyc/thousand_investment&TFrom=($tfrom)',
  getConfig:'/reqlocal?jyloginflag=',
  
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}
export const getData = (p) => ajaxRun(url.getData, p)

export const getConfig = (p) => ajaxRun(url.getConfig, p)
