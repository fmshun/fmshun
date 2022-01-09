/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  getSmsCode:
    '/reqxml?action=27006&path=/forward&funcId=260002&moduleId=210006',
  checkSmsCode:
    '/reqxml?action=27006&path=/forward&funcId=260003&moduleId=210006',
  getVoiceCode:
    '/reqxml?action=27006&path=/forward&funcId=560001&moduleId=210006',
  checkVoiceCode:
    '/reqxml?action=27006&path=/forward&funcId=560002&moduleId=210006',
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

export const getSmsCode = (p) => ajaxRun(url.getSmsCode, p)
export const getVoiceCode = (p) => ajaxRun(url.getVoiceCode, p)
export const checkSmsCode = (p) => ajaxRun(url.checkSmsCode, p)
export const checkVoiceCode = (p) => ajaxRun(url.checkVoiceCode, p)
