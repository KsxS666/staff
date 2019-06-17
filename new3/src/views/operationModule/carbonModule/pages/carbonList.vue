<!-- 减碳报表-->
<template>
  <div class="v">
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="手机" prop="phone" align="center"></el-table-column>
      <el-table-column label="减碳值（g）" prop="energy" align="center"></el-table-column>
      <el-table-column label="勋章等级" prop="level" align="center"></el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" @click="toShowRecordDialog(scope.row.userId)">查看记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <recordInfoDialog v-model="recordInfo.visible" :userId="recordInfo.userId" />
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
import recordInfoDialog from '../components/recordInfoDialog'
export default {
  name: 'carbonList',
  components: { recordInfoDialog },
  props: {
    btnVisible: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        userName: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      recordInfo: {
        visible: false,
        userId: ''
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取减碳报表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/tree/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    toShowRecordDialog (id) {
      this.recordInfo.userId = id
      this.recordInfo.visible = true
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
