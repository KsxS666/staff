<template>
  <div id="eChart" style=" margin: 40px 0 ;display: flex; justify-content: center; align-items: center; height: 600px"></div>
</template>

<script>
export default {
  name: 'chartView',
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    titleList: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    this.myChart = this.$charts.init(document.getElementById('eChart'))
    window.addEventListener('resize', this.resizeChart) // 监听窗口的变化
    this.sidebarElm = document.getElementsByClassName('sidebarContainer')[0] // 侧边栏对象
    this.sidebarElm.addEventListener('transitionend', this.resizeChart) // 监听侧边栏的变化
    this.initCart()
  },
  methods: {
    // 渲染图表
    initCart () {
      let XText = []
      let YList = [] // 每个类型对应小区的 小区总户数 注册户数 注册人数
      let YData = []
      this.dataList.map(item => {
        XText.push(item.name)
        YList[item.name] = {
          totalHouse: item.totalHouse || 0,
          registerHouse: item.registerHouse || 0,
          registerUser: item.registerUser || 0
        }
      })
      let totalHouse = []
      let registerHouse = []
      let registerUser = []
      for (let key in YList) {
        totalHouse.push(YList[key].totalHouse)
        registerHouse.push(YList[key].registerHouse)
        registerUser.push(YList[key].registerUser)
      }
      YData.push({
        name: '小区总户数',
        data: totalHouse,
        type: 'bar',
        // stack: '小区',
        barMaxWidth: 40
      })
      YData.push({
        name: '注册户数',
        data: registerHouse,
        type: 'bar',
        // stack: '小区',
        barMaxWidth: 40
      })
      YData.push({
        name: '注册人数',
        data: registerUser,
        type: 'bar',
        // stack: '小区',
        barMaxWidth: 40
      })
      // console.log('YList', YList, YList.length, seriesIntegral.concat(seriesWeight))
      if (!YData.length) {
        this.myChart.clear()
        return
      }
      // 基于准备好的dom，初始化echarts实例
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          itemGap: 60,
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['小区总户数', '注册户数', '注册人数'],
          top: 0,
          // icon: 'Rect',
          textStyle: {
            color: '#999'
          }
        },
        color: ['#00c1f1', '#f1aa00', '#ed94f0'],
        grid: {
          top: '80px',
          left: '134px',
          right: '134px'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: XText,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e5e5e5'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            },
            name: '小区',
            nameTextStyle: {
              color: '#999'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: true,
            name: '人数',
            nameTextStyle: {
              color: '#999'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#e5e5e5'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: YData,
        noDataLoadingOption: {
          text: '暂无数据',
          effect: 'bubble',
          effectOption: {
            effect: {
              n: 0
            }
          }
        }
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
  // watch: {
  //   dataList () {
  //     // this.initCart()
  //   }
  // }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
