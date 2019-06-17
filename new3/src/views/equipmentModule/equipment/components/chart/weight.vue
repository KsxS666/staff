<template>
  <div id ="chart-box2" class="card"></div>
</template>

<script>
export default {
  props: {
    weightList: {
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
      this.chart = this.$charts.init(document.getElementById('chart-box2'), null, { renderer: 'svg' })
      this.setChart()
    },
    setChart () {
      let weightList = this.weightList
      // if (!weightList || !weightList.length) {
      //   this.chart.clear()
      //   return
      // }
      let option = {
        title: {
          text: '投放量比例',
          subtext: !weightList || !weightList.length ? '暂无数据' : '',
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
            name: '投放量比例',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            // data: [
            //   { value: 335, name: '直接访问' },
            //   { value: 310, name: '邮件营销' },
            //   { value: 234, name: '联盟广告' },
            //   { value: 135, name: '视频广告' },
            //   { value: 1548, name: '搜索引擎' }
            // ],
            data: weightList,
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
    weightList: {
      deep: true,
      handler () {
        this.setChart()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #chart-box2{
    width: 100%;
    height: 195px;
    flex: 1;
    margin-bottom: 20px;
  }
  .card{
    background: #FFFFFF;
    box-shadow: -3px 5px 10px #DEDEDE;
    border-radius: 8px;
  }
</style>
