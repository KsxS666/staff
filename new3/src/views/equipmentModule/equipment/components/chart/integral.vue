<template>
  <div id ="chart-box3" class="card"></div>
</template>

<script>
export default {
  props: {
    integralList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dataList: [],
      chart: null
    }
  },
  created () {
    // this.getList()
  },
  mounted () {
    if (window) {
      window.addEventListener('resize', this._resizeHandler) // 监听窗口的变化
    }
    this.initChart()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._resizeHandler) // 监听窗口的变化
  },
  methods: {
    initChart () {
      this.chart = this.$charts.init(document.getElementById('chart-box3'), null, { renderer: 'svg' })
      this.setChart()
    },
    setChart () {
      let integralList = this.integralList
      // if (!integralList || !integralList.length) {
      //   this.chart.clear()
      //   return
      // }
      let option = {
        title: {
          text: '积分比例',
          subtext: !integralList || !integralList.length ? '暂无数据' : '',
          top: '10',
          left: '10',
          textStyle: {
            fontSize: 14,
            fontWeight: 400,
            color: '#A3A3A3'
          }
        },
        color: ['#30CA89', '#45BDF7', '#FFE600', '#FF9936', '#FF4343', '#AD46F3', '#4777F5', '#5AD7A3', '#F845F1', '#24BF72', '#FF7335', '#FFDE00', '#5045F6'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: '积分比例',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: integralList,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
    integralList: {
      deep: true,
      handler () {
        this.setChart()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #chart-box3{
    width: 100%;
    height: 195px;
    flex: 1
  }
  .card{
    background: #FFFFFF;
    box-shadow: -3px 5px 10px #DEDEDE;
    border-radius: 8px;
  }
</style>
