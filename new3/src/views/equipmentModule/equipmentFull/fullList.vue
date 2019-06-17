<!-- 垃圾袋列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入设备编码" v-model="formData.equipmentCode" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入设备名称" v-model="formData.equipmentName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
      <el-table-column label="所属小区" prop="communityName" align="center"></el-table-column>
      <el-table-column label="设备编码" prop="equipmentCode" align="center"></el-table-column>
      <el-table-column label="设备名称" prop="equipmentName" align="center"></el-table-column>
      <el-table-column label="设备类型" prop="equipmentTypeName" align="center"></el-table-column>
      <el-table-column label="满桶时间" prop="createTime" align="center"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'fullList',
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        name: '',
        equipmentCode: '',
        communityId: '',
        equipmentName: '',
        page: 1,
        size: 20,
        total: 0
      },
      communityList: [],
      dataList: [] // 主列表
    }
  },
  created () {
    this.getList()
    this.getCommunityList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 获取满桶列表
    async getList () {
      let reqData = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/barrelFullAlert/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 获取社区列表
    async getCommunityList () {
      this.formData.communityId = ''
      let res = await this.$post('community/community/getCommunityList')
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        cardNumber: '',
        type: '',
        binding: '',
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
