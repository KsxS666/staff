<!-- 累计投放次数柱状图表 -->
<template>
  <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
  <div id="launChart"
       style="display: flex; justify-content: center; align-items: center; width: 100%; height: 400px"></div>
</template>

<script>

// import echarts from 'echarts'

export default {
  name: 'launchChar',
  props: {
    year: {
      type: Number,
      default: 2018
    }
  },
  data () {
    return {
      sidebarElm: null,
      myChart: null,
      XText: [], // X轴文本
      YData: [] // Y轴的每个柱状的高度
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      let res = await this.$post('user/communityStatistics/getReportByTotalLanch', { year: this.year })
      if (res.code === 0) {
        let data = res.data.lanchCountReportList || []
        this.XText = []
        this.YData = []
        data.map(item => {
          this.XText.push(item.month + '月')
          this.YData.push(item.currentMonthLanchCount)
        })
        this.initCart()
        window.addEventListener('resize', this.resizeChart) // 监听窗口的变化
        this.sidebarElm = document.getElementsByClassName('sidebarContainer')[0] // 侧边栏对象
        this.sidebarElm.addEventListener('transitionend', this.resizeChart) // 监听侧边栏的变化
      }
    },
    // 渲染图表
    initCart () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$charts.init(document.getElementById('launChart'))
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: ''
        },
        tooltip: {},
        // legend: {
        //   data:['销量']
        // },
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
          },
          z: 10
        },
        yAxis: { // Y轴数据
          show: false // 是否显示Y轴
        },
        series: [
          {
            type: 'bar',
            barWidth: 20, // 柱图宽度
            itemStyle: {
              normal: {
                // 柱状的颜色 --渐变色
                color: new this.$charts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#0263e4' },
                    { offset: 0.5, color: '#2480e8' },
                    { offset: 1, color: '#469dec' }
                  ]
                ),
                label: { // 柱状上面的文字
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#bbbbbb'
                  }
                }
              }
            },
            data: this.YData
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

<style scoped lang="scss" rel="stylesheet/scss">

</style>
