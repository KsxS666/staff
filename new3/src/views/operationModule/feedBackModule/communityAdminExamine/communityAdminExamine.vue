<!--社区管理员考核列表 -->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <!-- <areaSearch ref="areaSearch" isCommunity :level="4" :formData="formData" @change="getCommunityList"/> -->
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityAdminId" placeholder="请选择社区管理员">
          <el-option v-for="(item, i) in communityAdminList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="formData.username" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <el-table class="listTable" border v-loading="mainLoading" :data="dataList" style="width: 100%">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="社区管理员" prop="communityAdminName"  align="center"> </el-table-column>
      <el-table-column label="用户名称" prop="userName"  align="center"> </el-table-column>
      <el-table-column label="所属小区" prop="communityName"  align="center"> </el-table-column>
      <el-table-column label="专业知识" prop="majorKnowledge"  align="center">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.majorKnowledge" disabled :colors="['#409EFF', '#409EFF', '#409EFF']"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="服务态度" prop="serverAttitude"  align="center">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.serverAttitude" disabled :colors="['#409EFF', '#409EFF', '#409EFF']"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" prop="createTime"  align="center"> </el-table-column>
      <el-table-column label="备注" prop="remark" align="center"> </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityAdminId: '',
        communityId: '',
        username: '',
        page: 1,
        size: 20,
        total: 0
      },
      communityAdminList: [], // 社区管理员列表
      communityList: [], // 小区列表
      allCommunityList: [], // 所有小区列表
      dataList: [] // 主列表
    }
  },
  created () {
    this.getCommunityAdminList()
    this.getList()
    this.getCommunityList()
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('community/communityAdminCheck/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    async getCommunityAdminList () {
      let res = await this.$post('community/communityAdmin/getList')
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.communityAdminList = res.data || []
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      this.formData.communityId = ''
      let res = await this.$post('community/community/getCommunityList')
      if (res.code === 0) {
        this.communityList = res.data
        if (!this.allCommunityList.length) {
          this.allCommunityList = res.data
        }
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
        username: '',
        name: '',
        phone: '',
        page: 1,
        size: 20,
        total: 0
      }
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
    }
  }
}
</script>
