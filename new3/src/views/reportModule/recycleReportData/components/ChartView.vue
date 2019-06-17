<template>
  <div id="eChart" style=" margin: 40px 0 ;display: flex; justify-content: center; align-items: center; height: 600px"></div>
</template>

<script>
export default {
  name: 'ChartView',
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
    // this.initCart()
  },
  methods: {
    // 渲染图表
    initCart () {
      let XText = []
      let YDataTotal = {} // 每个小区各自总积分、总重量的对象
      let YList = [] // 每个类型对应小区的积分和重量
      this.dataList.map(item => {
        XText.push(item.communityName)
        YDataTotal[item.communityName] = {
          integral: item.integralTotal || 0,
          weight: item.weightTotal || 0
        }
        this.titleList.map(titleItem => {
          if (!YList[titleItem.name]) {
            YList[titleItem.name] = []
          }
          YList[titleItem.name].push({
            integral: item[titleItem.filed2] || 0,
            weight: item[titleItem.filed1] || 0,
            type: titleItem.type || 0,
            color: titleItem.color
          })
        })
      })
      let legendList = [] // legend 的数组
      let seriesIntegral = [] // 每个小区对应 积分的series数组
      let seriesWeight = [] // 每个小区对应 重量的series数组
      for (let key in YList) {
        let integralList = []
        let weightList = []
        let color = ''
        let type = null
        YList[key].map(item => {
          integralList.push(item.integral)
          weightList.push(item.weight)
          color = item.color
          type = item.type
        })
        legendList.push(key)
        // legendList.push(`${key}积分`)
        // legendList.push(`${key}${type ? '件数' : '重量'}`)
        seriesIntegral.push({
          // name: `${key}积分`,
          name: key,
          id: `${key}积分`,
          data: integralList,
          type: 'bar',
          stack: '积分',
          selfData: type,
          barMaxWidth: 40,
          // barWidth: 20, // 柱图宽度
          itemStyle: {
            normal: {
              color: color
            }
          }
        })
        seriesWeight.push({
          name: key,
          // name: `${key}${type ? '件数' : '重量'}`,
          id: `${key}${type ? '件数' : '重量'}`,
          data: weightList,
          type: 'bar',
          stack: '重量',
          selfData: type,
          barMaxWidth: 40,
          // barWidth: 20, // 柱图宽度
          yAxisIndex: 1, // 对应YAxis 的 第二个
          itemStyle: {
            normal: {
              color: color
            }
          }
        })
      }
      // console.log('YList', YList, YList.length, seriesIntegral.concat(seriesWeight))
      if (!seriesIntegral.concat(seriesWeight).length) {
        this.myChart.clear()
        return
      }
      // 为积分每个柱子头部添加一个总积分的
      seriesIntegral[seriesIntegral.length - 1].label = {
        normal: {
          show: true,
          position: 'top',
          formatter (params) {
            return YDataTotal[params.name].integral || 0
          }
        }
      }
      // 为重量每个柱子头部添加一个总重量的
      seriesWeight[seriesWeight.length - 1].label = {
        normal: {
          show: true,
          position: 'top',
          formatter (params) {
            return `${YDataTotal[params.name].weight || 0}`
          }
        }
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
          },
          formatter: (params) => { // 自定义显示
            if (!params || !params.length) {
              return ''
            }
            // let formatterStr = ` ${params[0].axisValue}<br>`
            let formatterStr = ` ${params[0].axisValue}<br>
                                 -总积分：${YDataTotal[params[0].name].integral || 0}<br>
                                 -总重量：${YDataTotal[params[0].name].weight || 0}kg<br>`
            /* seriesId 对应 seriesId 设置的id */
            params.map(item => {
              formatterStr += `${item.marker}${item.seriesId}：${item.value}${item.seriesId.indexOf('重量') !== -1 ? 'kg' : ''}<br>`
            })
            return formatterStr
          }
        },
        legend: {
          data: legendList,
          top: 0,
          // icon: 'Rect',
          textStyle: {
            color: '#999'
          }
        },
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
            name: '积分',
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
          },
          {
            type: 'value',
            show: true,
            name: '重量（KG）/ 件数',
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
        series: seriesIntegral.concat(seriesWeight),
        // series: [
        //   {
        //     name: '得分',
        //     data: YData,
        //     type: 'bar',
        //     barWidth: 20, // 柱图宽度
        //     itemStyle: {
        //       normal: {
        //         // 柱状的颜色 --渐变色
        //         color: '#00CD7A'
        //       }
        //     }
        //   }
        // ],
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
