/**
 * 数字 转换成 万 / 亿 单位
 *
 * */
function handleNumber(value) {
  value = parseFloat(value)
  return value >= 100000000 ? ((Math.floor(value / 10000000) / 10) + '亿') : value > 10000 ? (Math.floor(value / 1000) / 10) + '万' : value
}
module.exports = {
  handleNumber: handleNumber
}