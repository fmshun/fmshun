/**
 * api接口统一管理
 */
import ajax from 'ajax'

const url = {
  getDetailUrl:
    '/reqxml?action=27006&path=/social/stock_bar/index_two?uid=($weakaccount)&wtoken=($weaktoken)', //涨乐吧第一屏接口
  getDetailUrlDown: '/reqxml?action=27006&path=/social/topic_posts_list_two', //涨乐吧下拉加载接口
  follow:
    '/reqxml?action=27006&path=/social/stock_bar/follow?uid=($weakaccount)&wtoken=($weaktoken)', //关注接口
}

function ajaxRun(url, params) {
  return new Promise((resolve, reject) => {
    ajax.run(url, params, resolve, reject)
  })
}

/**
 * 关注基金
 */
export const followFund = (param) => ajaxRun(url.follow, param)
