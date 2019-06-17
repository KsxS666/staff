<template>
  <div :id="`eChart${type}`" style=" margin: 40px 0 ;display: flex; justify-content: center; align-items: center; width: calc( (100vw - 400px) / 2  ); height: 600px"></div>
</template>

<script>
export default {
  name: 'ChartView',
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number, // 1 投放量 2 积分 3次数
      default: 1
    }
  },
  mounted () {
    this.myChart = this.$charts.init(document.getElementById(`eChart${this.type}`), null, { renderer: 'svg' })
    window.addEventListener('resize', this.resizeChart) // 监听窗口的变化
    // this.sidebarElm = document.getElementsByClassName('sidebarContainer')[0] // 侧边栏对象
    // this.sidebarElm.addEventListener('transitionend', this.resizeChart) // 监听侧边栏的变化
    // this.initCart()
  },
  methods: {
    // 渲染图表
    initCart () {
      let XText = []
      // let YData = []
      let data = []
      this.dataList.map(item => {
        let value = 0
        switch (this.type) {
          case 1:
            value = item.weight
            break
          case 2:
            value = item.integral
            break
          case 3:
            value = item.castTimes
            break
        }
        XText.push(item.name)
        data.push({
          name: item.name,
          value: value || 0
        })
      })
      // console.log('YList', YList, YList.length, seriesIntegral.concat(seriesWeight))
      if (!data.length) {
        this.myChart.clear()
        return
      }
      // 基于准备好的dom，初始化echarts实例
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: `爱家分类垃圾${this.type === 1 ? '投放量' : (this.type === 2 ? '积分' : '投放次数')}比例`,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
          formatter: '{b}: {c} ({d}%)'
          // itemGap: 60,
          // axisPointer: { // 坐标轴指示器，坐标轴触发有效
          //   type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          // },
          // formatter: (params) => { // 自定义显示
          //   if (!params || !params.length) {
          //     return ''
          //   }
          //   // let formatterStr = ` ${params[0].axisValue}<br>`
          //   let formatterStr = ` ${params[0].axisValue}<br>
          //                        -总积分：${YDataTotal[params[0].name].integral || 0}<br>
          //                        -总重量：${YDataTotal[params[0].name].weight || 0}kg<br>`
          //   /* seriesId 对应 seriesId 设置的id */
          //   params.map(item => {
          //     formatterStr += `${item.marker}${item.seriesId}：${item.value}${item.seriesId.indexOf('重量') !== -1 ? 'kg' : ''}<br>`
          //   })
          //   return formatterStr
          // }
        },
        legend: {
          data: XText,
          top: 40,
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
        color: [
          '#FBA019', '#54B3FD', '#F0559C', '#61D675',
          '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
          '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
          '#07a2a4', '#c6b38e', '#9a7fd1', '#588dd5', '#f5994e',
          '#c05050', '#a5e7f0', '#a0a7e6', '#c9ab00', '#7eb00a',
          '#6f5553', '#f5e8c8', '#eaf889', '#82b6e9', '#c14089'
        ],
        series: [
          {
            type: 'pie',
            // name: '面积模式',
            radius: '50%',
            // radius: [40, 100], // 实现环形图，[内半径，外半径]
            center: ['50%', '65%'], // 圆心坐标
            // roseType: 'area',
            x: '50%',
            // label: {
            //   formatter: '{b}：{c}',
            //   // fontWeight: 'bold',
            //   fontSize: 14
            // },
            // labelLine: {
            //   length: 2
            // },
            data: data
          }
        ],
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
    // this.sidebarElm.removeEventListener('transitionend', this.resizeChart) // 取消监听侧边栏的变化
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
