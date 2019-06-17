<!--回收物资源量-->
<template>
  <section id="efoodwaste"></section>
</template>

<script>
export default {
  name: 'efoodwaste',
  data () {
    return {
      dataList: [],
      chart: null
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    if (window) {
      window.addEventListener('resize', this._resizeHandler) // 监听窗口的变化
    }
    this.initChart()
  },
  methods: {
    // 获取图表数据
    async getList () {
      let res = await this.$post('equipment/indexCount/castRecycleBucketReport')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
    },
    // echarts初始化
    initChart () {
      this.chart = this.$charts.init(document.getElementById('efoodwaste'))
      this.setBarChartOptions()
    },
    setBarChartOptions () { // 配置图表
      let dataList = this.dataList || []
      if (dataList.length) {
        dataList.map((ele) => {
          if (parseInt(ele.month) < parseInt(10)) {
            ele.month = parseInt(`0${ele.month}`)
          }
        })
      }
      var xData = []
      var yData = []
      var min = 0 // 最小值的定义
      dataList.map((ele) => {
        xData.push(ele.month)
        yData.push(ele.recycleBucketNum)
      })
      const option = {
        // backgroundColor: '#111c4e',
        title: {
          text: '厨余回收量柱状图',
          top: '5%',
          left: '4%',
          textStyle: {
            color: '#06ebff',
            fontWeight: 'normal',
            fontSize: 16,
            fontFamily: 'Microsoft YaHei'
          }
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              opacity: 0
            }
          }
          // formatter: function (prams) {
          //   if (prams[0].data === min) {
          //     return '合格率：0%'
          //   } else {
          //     return '合格率：' + prams[0].data + '%'
          //   }
          // }
        },
        legend: {
          data: ['直接访问', '背景'],
          show: false
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '6%',
          top: '20%',
          containLabel: true,
          z: 22
        },
        xAxis: [{
          type: 'category',
          gridIndex: 0,
          data: xData,
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#46428c'
            }
          },
          axisLabel: {
            show: true,
            color: '#b0eaf8',
            fontSize: 12
          }
        }],
        yAxis: [{
          type: 'value',
          gridIndex: 0,
          splitLine: {
            show: false
          },
          axisTick: {
            lineStyle: {
              width: 0.5,
              type: 'solid'
            }
          },
          min: min,
          max: 400,
          axisLine: {
            lineStyle: {
              color: '#46428c',
              show: false
            }
          },
          axisLabel: {
            color: '#b0eaf8',
            formatter: '{value} '
          }
        },
        {
          type: 'value',
          gridIndex: 0,
          min: min,
          max: 100,
          splitNumber: 5,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(22,61,128,0.5)', 'rgba(250,250,250,0)']
            }
          }
        }
        ],
        series: [{
          name: '回收量',
          type: 'bar',
          barWidth: '38%',
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: new this.$charts.graphic.LinearGradient(
                0, 0, 0, 1, [{
                  offset: 0,
                  color: '#47eded'
                },
                {
                  offset: 0.39,
                  color: '#48bee1'
                },
                {
                  offset: 1,
                  color: '#488ed4'
                }
                ]
              )
            }
          },
          data: yData,
          zlevel: 11

        }

        ]
      }

      this.chart.setOption(option)
    },
    _resizeHandler () {
      if (this.chart) {
        setTimeout(() => {
          this.chart.resize()
        }, 200)
      }
    }
  },
  watch: {
    dataList: {
      handler (val) {
        this.setBarChartOptions(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #efoodwaste{
    height: 44%;
    background-image: url(../../../assets/new3.png);
    background-size: 100% 100%;
    background-position: center;
    margin-bottom: 16px;
    z-index: 2;
  }
</style>
