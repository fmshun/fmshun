/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}
