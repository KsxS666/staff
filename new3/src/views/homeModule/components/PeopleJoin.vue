<template>
  <div class="box">
    <h4 class="title">居民参与情况</h4>
    <div class="numBox">
      <div>
        <strong>{{ topData.totalRegisterNum || 0 }}<i></i></strong>
        <span>总用户量 (人)</span>
      </div>
      <div>
        <strong>{{ topData.todayCastNum || 0 }}<i></i></strong>
        <span>今日投放人数 (人)</span>
      </div>
      <div class="right">
        <strong>{{ topData.todayRegisterNum || 0 }}<i></i></strong>
        <span>今日新增用户 (人)</span>
      </div>
    </div>
    <div class="tipBox">
      <p>近30天用户注册统计图</p>
      <el-date-picker v-model="formData.timeArr" :picker-options="pickerOptions" size="small" type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="" @change="timeChange"> </el-date-picker>
    </div>
    <div id="peopleJoinChart" v-loading="mainLoading" style=" display: flex; justify-content: center; align-items: center; height: 200px"></div>
  </div>
</template>

<script>
export default {
  name: 'WasteLaunch',
  data () {
    return {
      mainLoading: false,
      formData: {
        timeArr: []
      },
      topData: {},
      dataList: [],
      pickerOptions: {
        // disabledDate: this.disabledDate,
        onPick: this.onPick
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.myChart = this.$charts.init(document.getElementById('peopleJoinChart'), null, { renderer: 'svg' })
    window.addEventListener('resize', this.resizeChart) // 监听窗口的变化
    // this.sidebarElm = document.getElementsByClassName('sidebarContainer')[0] // 侧边栏对象
    // this.sidebarElm.addEventListener('transitionend', this.resizeChart) // 监听侧边栏的变化
  },
  methods: {
    async getList () {
      let reqData = {
        startDateStr: this.formData.timeArr && this.formData.timeArr.length ? this.formData.timeArr[0] : '',
        endDateStr: this.formData.timeArr && this.formData.timeArr.length ? this.formData.timeArr[1] : ''
      }
      this.mainLoading = true
      let res = await this.$post('integral/overview/getJoinDetailReport', reqData)
      this.mainLoading = false
      if (res.code === 0) {
        this.topData = res.data
        this.dataList = res.data.reportList || []
        this.initCart()
      }
    },
    // 限制选择时间范围在31天内
    onPick (date) {
      let oldTime = this.formData.timeArr ? [...this.formData.timeArr] : []
      if (date.minDate && date.maxDate) {
        let dis = (date.minDate.getTime() - date.maxDate.getTime()) / (3600 * 1000 * 24)
        if (dis > 30 || dis < -30) {
          this.$message.warning('时间范围是31天内')
          this.$nextTick(() => {
            this.formData.timeArr = oldTime
            // this.formData.timeArr = null
          })
        }
      }
    },
    timeChange () {
      if (this.formData.timeArr && this.formData.timeArr.length) {
        let minDate = new Date(this.$moment(this.formData.timeArr[0]).format())
        let maxDate = new Date(this.$moment(this.formData.timeArr[1]).format())
        let dis = (minDate.getTime() - maxDate.getTime()) / (3600 * 1000 * 24)
        if (dis > 30 || dis < -30) {
          return false
        }
      }
      this.getList()
    },
    // 渲染图表
    initCart () {
      let XData = []
      let XDataAll = []
      let YData = []
      this.dataList.map(item => {
        XData.push(item.dateStr.substring(8))
        XDataAll.push(item.dateStr)
        YData.push(item.registerNum || 0)
      })
      if (!YData.length) {
        this.myChart.clear()
        return
      }

      let option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => { // 自定义显示
            if (!params || !params.length) {
              return ''
            }
            // let formatterStr = ` ${params[0].axisValue}<br>`
            let formatterStr = ` ${XDataAll[params[0].dataIndex]}<br>`
            /* seriesId 对应 seriesId 设置的id */
            params.map(item => {
              formatterStr += `${item.marker}人数：${item.value}<br>`
            })
            return formatterStr
          }
        },
        xAxis: {
          data: XData,
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
          }
        },
        yAxis: {
          axisLine: {
            show: false,
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
            show: true,
            lineStyle: {
              color: '#e5e5e5'
            }
          }
        },
        grid: {
          bottom: '30px',
          left: '60px',
          top: '10px',
          right: '30px'
        },
        series: [
          {
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#00E9F1'
              }
            },
            areaStyle: { opacity: 0.2 },
            data: YData
          }
        ]
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
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .box{
    flex: 1;
  }
  .numBox{
    div:nth-of-type(1){
      i{
        background-image: url("../assets/icon-people1.png");
      }
    }
    div:nth-of-type(2){
      i{
        background-image: url("../assets/icon-people2.png");
      }
    }
    div:nth-of-type(3){
      i{
        background-image: url("../assets/icon-people3.png");
      }
    }
  }
  .tipBox{
    padding: 10px 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $text-second;
  }

</style>
