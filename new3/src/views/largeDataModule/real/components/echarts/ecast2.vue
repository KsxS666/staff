<!--垃圾分类投放饼图-->
<template>
  <section id="ecast"></section>
</template>

<script>
export default {
  name: 'ecast',
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
    async getList () { // 获取投放类型及对应投放量数据
      let res = await this.$post('equipment/indexCount/castTypeTotal')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || [{ typeName: '金属', total: 0 }, { typeName: '衣物', total: 0 }, { typeName: '塑料', total: 0 }, { typeName: '纸张', total: 0 }]
    },
    // echarts初始化
    initChart () {
      this.chart = this.$charts.init(document.getElementById('ecast'))
      this.setPiechatOptions()
    },
    setPiechatOptions () { // 配置饼图
      let dataList = this.dataList.length ? this.dataList : [{ typeName: '金属', total: 0 }, { typeName: '衣物', total: 0 }, { typeName: '塑料', total: 0 }, { typeName: '纸张', total: 0 }]
      let data = []
      if (dataList.length) {
        dataList.map((ele) => {
          let obj = { name: ele.typeName, value: ele.total / 1000 }
          data.push(obj)
        })
      }
      const option = {
        title: {
          text: '垃圾分成统计饼图(单位：kg)',
          x: 'center',
          top: '5%',
          left: '4%',
          right: '20%',
          textStyle: {
            color: '#06ebff',
            fontWeight: 'normal',
            fontSize: 16,
            fontFamily: 'SourceHanSansCN-Regular'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        calculable: true,
        color: ['#6380eb', '#3fb994', '#55e6eb', '#8a92d0', '#6877f4', '#b9a93f', '#55c4eb', '#0a80d4'],
        series: [
          {
            name: '垃圾分成统计',
            type: 'pie',
            radius: [30, '65%'],
            center: ['50%', '55%'],
            roseType: 'radius',
            data,
            label: {
              formatter: '{b}：{c}',
              fontWeight: 'bold',
              fontSize: 14
            },
            labelLine: {
              length: 2
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
    dataList: {
      handler (val) {
        this.setPiechatOptions(val)
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._resizeHandler) // 监听窗口的变化
  }
}
</script>

<style lang="scss" scoped>
  #ecast{
    height: calc((56% - 16px));
    background-image: url(../../../assets/new3.png);
    background-size: 100% 100%;
    background-position: center;
    z-index: 2;
  }
</style>
