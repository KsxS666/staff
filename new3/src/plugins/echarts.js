
import Vue from 'vue'
// 再引入你需要使用的图表类型，标题，提示信息等
// eslint-disable-next-line
const echarts = equire([
  // 写上你需要的
  'bar',
  'pie',
  'geo',
  'line',
  'legend',
  'title',
  'tooltip'
])

Vue.prototype.$charts = echarts
export default echarts
