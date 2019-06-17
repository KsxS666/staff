<template>
  <div class="box">
    <h4 class="title">垃圾分类回收统计图</h4>
    <div class="tipBox">
      <el-radio-group v-model="currentBtn" size="small" @change="setTimeRange">
        <el-radio-button :label="7">近7天</el-radio-button>
        <el-radio-button :label="30">近30天</el-radio-button>
      </el-radio-group>
      <el-date-picker v-model="formData.timeArr" size="small" :picker-options="pickerOptions" type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="" @change="timeChange"> </el-date-picker>
      <el-button  size="small"  type="primary" @click="getList">查 询</el-button>
    </div>
    <div id="wasteTypeChart" v-loading="mainLoading"></div>
  </div>
</template>

<script>
export default {
  name: 'WasteType',
  data () {
    return {
      mainLoading: false,
      currentBtn: 0,
      formData: {
        timeArr: []
      },
      topData: {},
      dataList: [],
      pickerOptions: {
        // disabledDate: this.disabledDate,
        onPick: this.onPick
      },
      typeTitleList: [
        { name: '玻璃', key: 'glassWeight', color: '#5045F6' },
        { name: '金属', key: 'metalWeight', color: '#F69846' },
        { name: '塑料', key: 'plasticWeight', color: '#45DBF7' },
        { name: '衣物', key: 'clothingWeight', color: '#F845F1' },
        { name: '纸张', key: 'paperWeight', color: '#44AFF0' },
        { name: '厨余', key: 'foodWasteWeight', color: '#AD46F3' },
        { name: '有毒有害', key: 'toxicAndHarmfulWeight', color: '#FF4343' },
        { name: '其他', key: 'otherWeight', color: '#4777F5' }
      ]
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.myChart = this.$charts.init(document.getElementById('wasteTypeChart'), null, { renderer: 'svg' })
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
      let res = await this.$post('integral/overview/getRegenerantDetailReport', reqData)
      this.mainLoading = false
      if (res.code === 0) {
        this.topData = res.data
        this.dataList = res.data.reportList || []
        this.dataList.map(ele => {
          ele['total'] = (ele.clothingWeight + ele.foodWasteWeight + ele.glassWeight + ele.metalWeight + ele.otherWeight + ele.paperWeight + ele.plasticWeight + ele.toxicAndHarmfulWeight).toFixed(4)
        })
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
      this.currentBtn = 0
      this.getList()
    },
    // 渲染图表
    initCart () {
      let XData = []
      let XDataAll = []
      let YList = [] // 每个类型对应 重量
      this.dataList.map(item => {
        XData.push(item.dateStr.substring(8))
        XDataAll.push({ date: item.dateStr, total: item.total })
        this.typeTitleList.map(titleItem => {
          if (!YList[titleItem.name]) {
            YList[titleItem.name] = []
          }
          YList[titleItem.name].push({
            weight: item[titleItem.key] || 0,
            color: titleItem.color
          })
        })
      })
      // console.log('YlIST', YList)
      let legendList = [] // legend 的数组
      let series = [] // 每个小区对应 重量的series数组
      for (let key in YList) {
        let weightList = []
        let color = ''
        YList[key].map(item => {
          weightList.push(item.weight)
          color = item.color
        })
        legendList.push(key)
        series.push({
          // name: `${key}积分`,
          name: key,
          id: `${key}`,
          data: weightList,
          type: 'bar',
          stack: '重量',
          barMaxWidth: 40,
          // barWidth: 20, // 柱图宽度
          itemStyle: {
            normal: {
              color: color
            }
          }
        })
      }
      if (!series.length) {
        this.myChart.clear()
        return
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
          confine: true,
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => { // 自定义显示
            if (!params || !params.length) {
              return ''
            }
            // let formatterStr = ` ${params[0].axisValue}<br>`
            let formatterStr = ` ${XDataAll[params[0].dataIndex].date}<br>总重量：${XDataAll[params[0].dataIndex].total}kg<br>`
            params.map(item => {
              formatterStr += `${item.marker}${item.seriesId}：${item.value}kg<br>`
            })
            return formatterStr
          }
        },
        legend: {
          data: legendList,
          top: '20px',
          right: '30px',
          itemGap: 30,
          // icon: 'Rect',
          textStyle: {
            color: '#999'
          }
        },
        grid: {
          bottom: '30px',
          left: '60px',
          top: '80px',
          right: '30px'
        },
        /* grid: {
          top: '80px',
          left: '134px',
          right: '134px'
        }, */
        calculable: true,
        xAxis: [
          {
            type: 'category',
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
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: true,
            name: '重量',
            nameTextStyle: {
              color: '#999'
            },
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
          }
        ],
        series: series
      }

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },
    // 重新渲染视图
    resizeChart () {
      this.myChart.resize()
    },
    // 设置时间
    setTimeRange (dayNum) {
      this.currentBtn = dayNum
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * dayNum)
      this.formData.timeArr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')]
      this.getList()
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
    flex: 3;
  }
  .tipBox{
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-date-editor{
      margin: 0 10px;
    }
  }

  #wasteTypeChart {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 120px);
    min-height: 300px;
    overflow: hidden;
  }
</style>
