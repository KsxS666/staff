<!-- 公益伙伴-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-select v-model="formData.roleType" placeholder="请选择角色" clearable>
          <el-option label="督导员" :value="1"></el-option>
          <el-option label="志愿者" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <areaSearch ref="areaSearch" :level="2" :formData="formData"/>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
      <el-table-column label="年龄" prop="age" align="center"></el-table-column>
      <el-table-column label="性别" prop="sexName" align="center"></el-table-column>
      <el-table-column label="所在城市" prop="address" align="center"></el-table-column>
      <el-table-column label="来源" prop="roleName" align="center"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'partnerList',
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        roleType: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: []// 主列表
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取公益伙伴列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/goodPartners/getPage', reqData)
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
        roleType: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.$refs.areaSearch.toResetValue()
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
