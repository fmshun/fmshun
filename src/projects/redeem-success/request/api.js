/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  // 查询弱账号是否绑定公众号
  isWechatBind:
    '/reqxml?action=27006&path=/3g/weixin/push/query_user_bindInfo&uid=($weakaccount)&wtoken=($weaktoken)',
  // 查询成功信息
  successInfo:
    '/reqxml?action=27401&path=/forward&funcId=881015&clientNo=($account)&fundAccount=($fund_account)&sysNodeId=($tztsysnodeid)',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

export const successInfo = (p) => ajaxRun(url.successInfo, p)
export const isWechatBind = (p) => ajaxRun(url.isWechatBind, p)
