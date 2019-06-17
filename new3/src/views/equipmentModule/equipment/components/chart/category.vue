<template>
  <div id ="chart-box" class="card"></div>
</template>

<script>
export default {
  props: {
    castTypeList: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      chart: null
    }
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
      this.chart = this.$charts.init(document.getElementById('chart-box'), null, { renderer: 'svg' })
    },
    setChart () {
      let dataList = this.castTypeList.typeList ? this.castTypeList.typeList : []
      let xData = []
      let yData = []
      dataList.map(ele => {
        xData.push(ele.type)
        // yData.push(parseFloat(ele.percent))
        yData.push({
          value: parseFloat(ele.percent),
          name: ele.type
        })
      })
      let option = {
        title: {
          text: '桶类比例',
          subtext: !yData || !yData.length ? '暂无数据' : '',
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
        renderer: 'svg',
        series: [
          {
            name: '桶类比例',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: yData,
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
    castTypeList: {
      deep: true,
      handler () {
        this.setChart()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #chart-box{
    width: 100%;
    height: 33%;
    /*height: 195px;*/
    flex: 1;
    margin-bottom: 20px;
  }
  .card{
    background: #FFFFFF;
    box-shadow: -3px 5px 10px #DEDEDE;
    border-radius: 8px;
  }
</style>
