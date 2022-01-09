/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  // 获取用户权限
  get5827:
    '/reqxml?action=5827&Token=($token)&MobileCode=($mobilecode)&Account=($account)',
  // 查询可委托基金详情
  get5882:
    '/reqxml?action=5882&Token=($token)&MobileCode=($mobilecode)&Account=($account)',
  getInfo:
    '/reqxml?action=27401&path=/forward&funcId=881018&clientNo=($account)&fundAccount=($fund_account)&sysNodeId=($tztsysnodeid)&password=($password)',
  // 获取协议列表
  getPaperToSign:
    '/reqxml?action=27502&path=/financing/trade/paper_to_sign&clientNo=($account)&Token=($token)&TFrom=($tfrom)',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

export const get5827 = (p) => ajaxRun(url.get5827, p)
export const get5882 = (p) => ajaxRun(url.get5882, p)
export const getInfo = (p) => ajaxRun(url.getInfo, p)
export const getPaperToSign = (p) => ajaxRun(url.getPaperToSign, p)
