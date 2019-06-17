<!-- 回收报表 -->
<template>
  <div class="v-wrap">
    <el-form  :model="formData" class="v-form v-form-search" label-width="0"  @submit.native.prevent>
      <!--<areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData" @change="getCommunityList"/>-->
      <el-form-item label="" style="width: 40%">
        <el-radio-group v-model="currentBtn" size="small" @change="setTimeRange">
          <el-radio-button :label="7">近7天</el-radio-button>
          <el-radio-button :label="30">近30天</el-radio-button>
        </el-radio-group>
        <!--<button class="selectBtn el-button el-button&#45;&#45;text el-button&#45;&#45;medium" :class="{'active' : currentBtn === 7}" @click="setTimeRange(7)">近7天</button>-->
        <!--<button class="selectBtn el-button el-button&#45;&#45;text el-button&#45;&#45;medium" :class="{'active' : currentBtn === 30}" @click="setTimeRange(30)">近30天</button>-->
        <el-date-picker v-model="formData.timeArr" :picker-options="pickerOptions" type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width: calc( 100% - 160px ); margin-left: 25px" @change="timeChange"> </el-date-picker>
      </el-form-item>
      <areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData" @change="getCommunityList"/>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" icon="el-icon-download" v-if="btnVisible && btnVisible.download" @click="toDownload">导出报表</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="mainLoading">
      <div class="v-top-info">数据实时统计</div>
      <TableList :data-list="dataList" :titleList="titleList" :formData="formData" @sortList="sortList"/>
      <PageInfo :formData="formData" :page-sizes="[10, 15, 20]" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
      <!--<div class="v-page" v-if="formData.total">
        <el-pagination :current-page="formData.page" :page-size="formData.size" layout="total, sizes, prev, pager, next, jumper"  @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="formData.total"> </el-pagination>
      </div>-->
      <ChartView :data-list="dataList" :titleList="titleList" ref="chartRef"/>
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
      formData: {
        page: 1,
        size: 10,
        total: 0,
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        timeArr: [],
        sortType: '' // 0：总积分降序；1：总积分升序；2：总重量降序；3：总重量升序
      },
      communityList: [],
      dataList: [],
      titleList: [
        { name: '玻璃', filed1: 'glassWeight', filed2: 'glassIntegral', color: '#5045F6' },
        { name: '家电', filed1: 'householdElectricAppliancesNum', filed2: 'householdElectricAppliancesIntegral', color: '#F6D54A', type: 1 },
        { name: '金属', filed1: 'metalWeight', filed2: 'metalIntegral', color: '#F69846' },
        { name: '塑料', filed1: 'plasticWeight', filed2: 'plasticIntegral', color: '#45DBF7' },
        { name: '衣物', filed1: 'clothingWeight', filed2: 'clothingIntegral', color: '#F845F1' },
        { name: '纸张', filed1: 'paperWeight', filed2: 'paperIntegral', color: '#44AFF0' },
        { name: '厨余', filed1: 'foodWasteWeight', filed2: 'foodWasteIntegral', color: '#AD46F3' },
        { name: '有毒有害', filed1: 'toxicAndHarmfulWeight', filed2: 'toxicAndHarmfulIntegral', color: '#FF4343' },
        { name: '减量类', filed1: 'decrementClassWeight', filed2: 'decrementClassIntegral', color: '#5045F6' },
        { name: '其他', filed1: 'otherWeight', filed2: 'otherIntegral', color: '#4777F5' }
      ],
      pickerOptions: {
        // disabledDate: this.disabledDate,
        onPick: this.onPick
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      // btnList.topButton = !btnList.add && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      // btnList.tableButton = !btnList.edit && !btnList.delete && !btnList.integralChange && !btnList.integralDetail && !btnList.resetPassword && !btnList.stopOrOpen ? null : true
      return btnList
    }
  },
  created () {
    this.setTimeRange(7)
    // this.getList()
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.startDateStr = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endDateStr = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      this.mainLoading = true
      let res = await this.$post('integral/getIntegralReport/getIntegralReport', reqData, false, 30)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
      this.$nextTick(() => {
        this.$refs.chartRef.initCart()
      })
    },
    // 排序
    sortList (sortType) {
      this.formData.sortType = sortType
      this.getList()
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      this.formData.communityId = ''
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId
      }
      let res = await this.$post('community/community/getCommunityList', req)
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 切换页面 - 页码
    handleCurrentChange (val) {
      this.formData.page = val
      this.getList()
    },
    // 切换页面 - 页size
    handleSizeChange (val) {
      this.formData.page = 1
      this.formData.size = val
      this.getList()
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
      start.setTime(start.getTime() - 3600 * 1000 * 24 * dayNum)
      this.formData.timeArr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')]
      this.toSearch()
    },
    timeChange (val) {
      console.log('时间修改', val)
      this.currentBtn = 0
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
  .selectBtn{
    padding: 4px 6px;
    &.active{
      background: $color-primary;
      color: #fff;
    }
  }
</style>
