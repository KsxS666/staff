<!-- 清桶列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input v-model="formData.equipmentCode" placeholder="请输入设备编码"></el-input>
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
      <el-table-column label="重量" prop="weight" align="center"></el-table-column>
      <el-table-column label="清桶人" prop="communityAdminName" align="center"></el-table-column>
      <el-table-column label="清桶时间" prop="createTime" align="center"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'equipmentClearList',
  data () {
    return {
      mainLoading: false,
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
    this.getList()
  },
  methods: {
    // 获取清桶列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/cleanBarrelRecord/getPage', reqData)
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
