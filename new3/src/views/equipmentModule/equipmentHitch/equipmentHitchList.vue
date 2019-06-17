<!-- 故障列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="" class="date-box">
        <el-date-picker v-model="timeArr" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
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
      <el-table-column label="设备编码" prop="equipmentCode" align="center"></el-table-column>
      <el-table-column label="设备名称" prop="equipmentName" align="center"></el-table-column>
      <el-table-column label="设备类型" prop="typeName" align="center"></el-table-column>
      <el-table-column label="故障时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="故障原因" prop="reason" align="center"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'equipmentHitchList',
  data () {
    return {
      mainLoading: false,
      timeArr: [],
      formData: { // 请求参数
        startTime: '',
        endTime: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [] // 主列表
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取故障列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.startTime = this.timeArr ? this.timeArr[0] : ''
      reqData.endTime = this.timeArr ? this.timeArr[1] : ''
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/faultBarrelRecord/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
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
      this.timeArr = []
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
    }
  }
}
</script>
