import { requestBase } from './fetch'

export const uploadUrl = `${requestBase}/system/util/upload`

/**
 * 验证手机号码
 *
 * 移动号码段:139、138、137、136、135、134、150、151、152、157、158、159、182、183、187、188、147
 * 联通号码段:130、131、132、136、185、186、145
 * 电信号码段:133、153、180、189
 *
 * @param phoneNum 手机号
 * @return Boolean
 */
export function checkPhoneNum (phoneNum) {
  // let regex = /^1[3|4|5|7|8][0-9]\d{8}$/
  let regex = /^1[0-9]\d{9}$/
  return regex.test(phoneNum)
}

/**
 * 验证国内电话号码
 * xxxx-xxxxxxxx xxxx-xxxxxxx xxx-xxxxxxxx
 *
 * @param telPhoneNum 电话号
 * @return Boolean
 * */
export function checkTelPhoneNum (telPhoneNum) {
  let regex = /\d{3}-\d{8}|\d{4}-\d{7,8}/
  return regex.test(telPhoneNum)
}

/**
 * 限制金额 和 纯数字 的数字输入限制
 *
 * */
export function limitNumInput (item, itemName, _this, isMoney) {
  let value = item[itemName]
  if (!value && value !== 0) {
    return false
  }
  value = String(value)
  if (isMoney) { // 有小数点
    value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/^\./g, '0.') // 验证第一个字符是数字而不是 .
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的

    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 保证.只出现一次，而不能出现两次以上
    value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
  } else {
    value = value.replace(/[^\d]/g, '') // 清除“数字”以外的字符
  }
  if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    value = parseFloat(value)
  }
  // 数据有变化  视图才会变
  item[itemName] = 'bbbbbbbbaaaaaaaa'
  _this.$nextTick(() => {
    item[itemName] = value + ''
  })
}

/**
 * 导出
 * xxxx-xxxxxxxx xxxx-xxxxxxx xxx-xxxxxxxx
 *
 * @param url 请求与地址
 * @req req 请求参数
 * */
export function exportFile (url, req = {}) {
  // url = `/backend/${url}?`
  url = `${requestBase}/${url}?`
  for (let item in req) {
    url = `${url}${item}=${req[item]}&`
  }
  window.open(url)
}
/* 处理时间 */
export function timeFromNow (time) {
  const now = Date.now()

  const diff = (now - time) / 1000

  if (diff < 30) {
    return '刚刚'
  }
  if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  }
  if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  }
  let dayNum = diff / (3600 * 24)
  if (dayNum <= 30) {
    return Math.floor(dayNum) + '天前'
  }
  let monthNum = dayNum / 30
  if (monthNum <= 12) {
    return Math.floor(monthNum) + '月前'
  }
  let yearNum = monthNum / 12
  return Math.floor(yearNum) + '年前'
}
