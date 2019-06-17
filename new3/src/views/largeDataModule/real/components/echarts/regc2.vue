<template>
  <section id="regc"></section>
</template>

<script>
export default {
  name: 'regc',
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
      let res = await this.$post('equipment/indexCount/castUserJoinRateReport')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
    },
    // echarts初始化
    initChart () {
      this.chart = this.$charts.init(document.getElementById('regc'))
      this.setBarChatOptions()
    },
    setBarChatOptions () {
      let dataList = this.dataList
      let titleArr = []
      let percentArr = []
      let valueArr = []
      if (dataList.length) {
        dataList.map((ele) => {
          if (parseInt(ele.month) < parseInt(10)) {
            ele.month = `0${ele.month}`
          }
          ele.month = `${ele.month}月`
          ele.percentage = this.toPercent(ele.percentage)
          titleArr.push(ele.month)
          percentArr.push(ele.percentage)
          valueArr.push(parseInt(ele.percentage))
        })
      }
      // var titlename2 = [{data: 1}, {data: 2}, {data: 10}]
      // titlename2.map(item => {
      //   if (item.data < 10) {
      //     item.data = `0${item.data}`
      //   }
      // })
      // console.log('titlename2333', titlename2)
      // var titlename = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((ele) => {
      //   if (ele.length < 2) {
      //     ele = `0${ele}`
      //   }
      //   return ele
      // })
      // console.log('titlename2', titlename)
      const option = {
        xAxis: {
          show: false
        },
        grid: {
          left: '13%',
          right: '15%',
          bottom: '5%',
          top: '14%'
        },
        yAxis: [{
          show: true,
          data: dataList.length ? titleArr : ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
          inverse: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#121845',
            fontWeight: 'bold',
            padding: 4,
            backgroundColor: '#06EBFF',
            borderRadius: 3,
            rich: {
              lg: {
                backgroundColor: '#339911',
                color: '#fff',
                borderRadius: 15,
                // padding: 5,
                align: 'center',
                width: 15,
                height: 15
              }
            }
          }
        }, {
          show: true,
          inverse: true,
          data: dataList.length ? percentArr : ['0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%'],
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '条',
          type: 'bar',
          yAxisIndex: 0,
          data: valueArr,
          barWidth: '42%',
          itemStyle: {
            normal: {
              barBorderRadius: 4,
              color: {
                type: 'bar',
                colorStops: [{
                  offset: 0,
                  color: '#488ed4' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#47eded' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false

              }
            }
          },
          label: {
            normal: {
              show: false,
              position: 'inside',
              formatter: '{c}%'
            }
          }
        }, {
          name: '框',
          type: 'bar',
          yAxisIndex: 1,
          barGap: '-100%',
          data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          barWidth: '42%',
          itemStyle: {
            normal: {
              color: 'none',
              borderColor: '#00c1de',
              borderWidth: 1,
              barBorderRadius: 4
            }
          }
        } ]
      }
      this.chart.setOption(option)
    },
    toPercent (point) {
      return `${point * 100}%`
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
      // deep: true,
      handler (val) {
        this.setBarChatOptions(val)
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._resizeHandler) // 监听窗口的变化
  }
}
</script>

<style lang="scss" scoped>
  #regc{
    height: calc(70% - 20px);
    background-image: url(../../../assets/new2.png);
    background-size: 100% 100%;
    background-position: center;
    margin-bottom: 16px;
    z-index: 2;
    min-width: 363px;
  }
</style>
