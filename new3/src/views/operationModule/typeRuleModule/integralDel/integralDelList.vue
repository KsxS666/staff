<!-- 积分删除记录列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <div style="margin-right: 20px">
        <el-radio-group v-model="currentBtn" size="medium" @change="setTimeRange">
          <el-radio-button :label="0">今天</el-radio-button>
          <el-radio-button :label="1">昨天</el-radio-button>
          <el-radio-button :label="7">近7天</el-radio-button>
          <el-radio-button :label="30">近30天</el-radio-button>
        </el-radio-group>
      </div>
      <el-form-item label="" class="date-box">
        <el-date-picker ref="datePicker" v-model="timeArr" :picker-options="pickOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="memberName" align="center"></el-table-column>
      <el-table-column label="用户手机号" prop="memberPhone" align="center"></el-table-column>
      <el-table-column label="地区" align="center">
        <template slot-scope="scope">
          {{scope.row.provinceName + scope.row.cityName + scope.row.districtName}}
        </template>
      </el-table-column>
      <el-table-column label="投放类型" prop="putName" align="center">
        <template slot-scope="scope">{{scope.row.putName ? scope.row.putName : '-'}}</template>
      </el-table-column>
      <el-table-column label="操作类型" prop="operateName" align="center"></el-table-column>
      <el-table-column label="重量/数量" prop="weight" align="center">
        <template slot-scope="scope">{{scope.row.weight ? scope.row.weight : '-'}}</template>
      </el-table-column>
      <el-table-column label="操作积分" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operateIntegral>0" class="v-green">{{scope.row.operateIntegral}}</span>
          <span v-else class="v-red">{{scope.row.operateIntegral}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前积分" prop="integral" align="center"></el-table-column>
      <el-table-column label="累计积分" prop="cumulativeIntegral" align="center"></el-table-column>
      <el-table-column label="操作员（姓名）" prop="operatorName" align="center"></el-table-column>
      <el-table-column label="操作时间" prop="operateTime" align="center"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'integralDelList',
  data () {
    return {
      mainLoading: false,
      timeArr: [],
      currentBtn: 30,
      pickOptions: {
        disabledDate (time) {
          let curDate = (new Date()).getTime()
          let three = 90 * 24 * 3600 * 1000
          let threeMonths = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeMonths
        }
      },
      formData: { // 请求参数
        equipmentCode: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [] // 主列表
    }
  },
  created () {
    this.setTimeRange(30)
  },
  methods: {
    // 获取积分删除记录列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.startTime = this.timeArr ? this.timeArr[0] : ''
      reqData.endTime = this.timeArr ? this.timeArr[1] : ''
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('integral/deletedRecords/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 设置时间
    setTimeRange (dayNum) {
      this.currentBtn = dayNum
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * dayNum)
      this.timeArr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')]
      this.getList()
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        sourceCode: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.setTimeRange(30)
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
    }
  }
}
</script>
