<!-- 管理员日志列表 -->
<template>
  <div class="v-wrap">
    <el-table class="listTable" border v-loading="mainLoading" :data="dataList" style="width: 100%">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="账号" prop="username"  align="center"> </el-table-column>
      <el-table-column label="昵称" prop="name"  align="center"> </el-table-column>
      <el-table-column label="操作时间" prop="createTime"  align="center"> </el-table-column>
      <el-table-column label="操作类型" prop="content"  align="left"> </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'AdminLogList',
  data () {
    return {
      mainLoading: false,
      formData: {
        page: 1,
        size: 20,
        total: 0
      },
      dataList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      this.mainLoading = true
      let res = await this.$post('system/adminLog/getPage', this.formData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
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

<style scoped>

</style>
