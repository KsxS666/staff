<!-- 回收报表 -->
<template>
  <div class="v-wrap">
    <el-form  :model="formData" class="v-form v-form-search" label-width="0"  @submit.native.prevent>
      <el-form-item label="" style="width: 40%">
        <el-radio-group v-model="currentBtn" size="small" @change="setTimeRange">
          <el-radio-button :label="0">今天</el-radio-button>
          <el-radio-button :label="-1">昨天</el-radio-button>
          <el-radio-button :label="7">近7天</el-radio-button>
          <el-radio-button :label="30">近30天</el-radio-button>
        </el-radio-group>
        <el-date-picker v-model="formData.timeArr" :picker-options="pickerOptions" type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width: calc( 100% - 300px ); margin-left: 25px" @change="timeChange"> </el-date-picker>
      </el-form-item>
      <areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData"/>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="mainLoading" class="listBox">
      <TableList class="box" :data-list="dataList"  :formData="formData"/>
      <el-tabs v-model="activeName" type="border-card" class="box" @tab-click="handleClick" v-show="dataList && dataList.length">
        <el-tab-pane label="投放量" name="1">
          <ChartView :data-list="dataList" :type="1" ref="chartRef1"/>
        </el-tab-pane>
        <el-tab-pane label="积分" name="2">
          <ChartView :data-list="dataList" :type="2" ref="chartRef2"/>
        </el-tab-pane>
        <el-tab-pane label="次数" name="3">
          <ChartView :data-list="dataList" :type="3" ref="chartRef3"/>
        </el-tab-pane>
      </el-tabs>
      <!--<ChartView class="box chart" :data-list="dataList" :titleList="titleList" ref="chartRef"/>-->
    </div>
  </div>
</template>

<script>
import TableList from './components/TableList'
import ChartView from './components/ChartView'
export default {
  name: 'recycleReportList',
  components: { ChartView, TableList },
  data () {
    return {
      mainLoading: false,
      currentBtn: 0,
      activeName: '1',
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        timeArr: []
        // sortType: '' // 0：总积分降序；1：总积分升序；2：总重量降序；3：总重量升序
      },
      dataList: [],
      pickerOptions: {
        // disabledDate: this.disabledDate,
        onPick: this.onPick
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.setTimeRange(30)
    // this.getList()
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.startDateStr = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endDateStr = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      this.mainLoading = true
      let res = await this.$post('integral/getIntegralReport/getRegenerantCatReport', reqData, false, 30)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
      this.$nextTick(() => {
        // this.$refs[`chartRef${this.activeName}`].initCart()
        this.$refs.chartRef1.initCart()
        this.$refs.chartRef2.initCart()
        this.$refs.chartRef3.initCart()
      })
    },
    // 排序
    sortList (sortType) {
      this.formData.sortType = sortType
      this.getList()
    },
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    handleClick () {
      // this.$refs[`chartRef${this.activeName}`].initCart()
      // console.log(val, this.activeName)
    },
    toDownload () {
      let reqData = Object.assign({}, this.formData)
      reqData.adminId = this.userInfo.id
      reqData.startDateStr = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endDateStr = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      delete reqData.page
      delete reqData.size
      delete reqData.total
      this.$utils.exportFile('integral/getIntegralReport/exportIntegralReport', reqData)
    },
    // 设置时间
    setTimeRange (dayNum) {
      this.currentBtn = dayNum
      const end = new Date()
      const start = new Date()
      if (dayNum < 0) {
        start.setTime(start.getTime() + 3600 * 1000 * 24 * dayNum)
        end.setTime(end.getTime() + 3600 * 1000 * 24 * dayNum)
      } else {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * dayNum)
      }
      this.formData.timeArr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')]
      this.toSearch()
    },
    timeChange (val) {
      console.log('时间修改', val)
      this.currentBtn = null
    },
    // 限制选择时间范围在31天内
    onPick (date) {
      // let oldTime = this.formData.timeArr ? [...this.formData.timeArr] : []
      // if (date.minDate && date.maxDate) {
      //   let dis = (date.minDate.getTime() - date.maxDate.getTime()) / (3600 * 1000 * 24)
      //   if (dis > 30 || dis < -30) {
      //     this.$message.warning('时间范围是31天内')
      //     this.$nextTick(() => {
      //       this.formData.timeArr = oldTime
      //       // this.formData.timeArr = null
      //     })
      //   }
      // }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .listBox{
    display: flex;
    align-items: flex-start;
    .box{
      flex: 1;
      &+.box{
        margin-left: 20px;
      }
    }
  }
</style>
