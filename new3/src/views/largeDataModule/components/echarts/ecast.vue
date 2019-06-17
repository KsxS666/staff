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
  },
  methods: {
    // 获取图表数据
    async getList () { // 获取投放类型及对应投放量数据
      let res = await this.$get('equipment/api/equipmentCast/castTypeTotalTotal')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.slice(0, 4) || [{ typeName: '金属', total: 0 }, { typeName: '衣物', total: 0 }, { typeName: '塑料', total: 0 }, { typeName: '纸张', total: 0 }]
      this.initChart()
    },
    // echarts初始化
    initChart () {
      this.chart = this.$charts.init(document.getElementById('ecast'))
      this.setPiechatOptions()
    },
    setPiechatOptions () { // 配置饼图
      for (let item of this.dataList) {
        item.name = item.typeName
        item.value = item.total
      }
      let option = {
        title: {
          text: '垃圾分类投放',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
            color: '#06EBFF'
          },
          left: '20%',
          top: '5%'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#3FB994', '#6877F4', '#8A92D0', '#55C4EB'],
        series: [
          {
            name: '垃圾分类投放',
            type: 'pie',
            radius: '48%',
            center: ['50%', '57%'],
            data: this.dataList,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            // eslint-disable-next-line no-dupe-keys
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                }
              },
              labelLine: { show: true }
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
      deep: true,
      handler (val) {
        this.setPiechatOptions(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #ecast{
    height: calc((38% - 32px));
    background-image: url(../../assets/card7.png);
    background-size: 100% 100%;
    background-position: center;
    z-index: 2;
  }
</style>
