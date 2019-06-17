<!-- 回收量走势折线图 -->
<template>
  <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
  <div id="recycleChart"
       style="display: flex; justify-content: center; align-items: center; width: 100%; height: 270px"></div>
</template>

<script>
// import echarts from 'echarts'

export default {
  name: 'recycleChart',
  props: {
    year: {
      type: Number,
      default: 2018
    }
  },
  data () {
    return {
      sidebarElm: null, // 侧边栏对象
      myChart: null,
      XText: [], // X轴文本
      YDataJoinRate: [], // Y轴的 参与率
      YDataLanchRate: [], // Y轴的 投放率
      YDataPassRate: [] // Y轴的 合格率
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获得数据
    async getData () {
      let res = await this.$post('user/communityStatistics/getReportByTotalRecycle', { year: this.year })
      if (res.code === 0) {
        let data = res.data.recycleTotalRateList || []
        this.XText = []
        this.YDataJoinRate = []
        this.YDataLanchRate = []
        this.YDataPassRate = []
        data.map(item => {
          this.XText.push(item.month + '月')
          this.YDataJoinRate.push(this.handleData(item.currentMonthJoinRate))
          this.YDataLanchRate.push(this.handleData(item.currentMonthLanchRate))
          this.YDataPassRate.push(this.handleData(item.currentMonthPassRate))
        })
        this.initCart()
        window.addEventListener('resize', this.resizeChart) // 监听窗口的变化
        this.sidebarElm = document.getElementsByClassName('sidebarContainer')[0] // 侧边栏对象
        this.sidebarElm.addEventListener('transitionend', this.resizeChart) // 监听侧边栏的变化
      }
    },
    handleData (num) { // 小数--> 百分率 保留一位小数 大于100 = 100
      if (num > 1) {
        num = 1
      }
      num = num * 100
      return Number(num.toFixed(1))
    },
    // 渲染图表
    initCart () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$charts.init(document.getElementById('recycleChart'))
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          // formatter: '{b}<br/> ' +
          //   '<span class="chartDot" style="background-color:#c23531;"></span>参与率：{c0}%<br/> ' +
          //   '<span class="chartDot" style="background-color:#2f4554;"></span>投放率：{c1}%<br/> ' +
          //   '<span class="chartDot" style="background-color:#61a0a8;"></span>合格率：{c2}%'
          formatter: (params) => { // 自定义显示
            if (!params || !params.length) {
              return ''
            }
            let formatterStr = `${params[0].axisValue}<br>`
            params.map(item => {
              formatterStr += `${item.marker}${item.seriesName}：${item.value}%<br>`
            })
            return formatterStr
          }
        },
        legend: { // 提示颜色轴的
          data: ['参与率', '投放率', '准确率']
        },
        xAxis: { // X轴数据
          // X轴的对象
          data: this.XText,
          axisLabel: {
            // inside: true,
            textStyle: {
              color: '#999'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e5e5e5'
            }
          }
          // z: 10
        },
        yAxis: { // Y轴数据
          show: false // 是否显示Y轴
          // name : '百分率%',
          // axisLabel: {
          //   formatter: '{value} %'
          // },
          // boundaryGap: true,
        },
        // 参与率  投放率 合格率
        series: [
          {
            name: '参与率',
            type: 'line',
            data: this.YDataJoinRate,
            itemStyle: {
              normal: {
                color: '#27c6db', // 折线颜色
                lineStyle: {
                  width: 3 // 折线宽度
                }
                //   // 折线上面点上面的文字
                //   label: { show: true, position: 'top', textStyle: { color: '#bbbbbb' } }
              }
            }
          },
          {
            name: '投放率',
            type: 'line',
            data: this.YDataLanchRate,
            itemStyle: { normal: { color: '#7360ed', lineStyle: { width: 3 } } }
          },
          {
            name: '准确率',
            type: 'line',
            data: this.YDataPassRate,
            itemStyle: { normal: { color: '#e860ed', lineStyle: { width: 3 } } }
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },
    // 重新渲染视图
    resizeChart () {
      this.myChart.resize()
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeChart) // 取消监听窗口的变化
    this.sidebarElm.removeEventListener('transitionend', this.resizeChart) // 取消监听侧边栏的变化
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  .chartDot {
    display: inline-block;
    margin-right: 5px;
    border-radius: 10px;
    width: 10px;
    height: 10px;
  }

</style>
