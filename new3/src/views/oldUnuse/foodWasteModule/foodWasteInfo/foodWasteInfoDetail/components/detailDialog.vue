<!-- 厨余垃圾- 详情- 查看明细 -->
<template>
  <v-dialog title="查看明细" class="" :visible="value" :before-close="beforeClose" width="700px">
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="name"  align="center"> </el-table-column>
      <el-table-column label="抽检时间" prop="createTime"  align="center"> </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{scope.row.communityName}}{{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0">未抽检</span>
          <span v-else-if="scope.row.status===1" class="v-green">合格</span>
          <span v-else-if="scope.row.status===2" class="v-red">不合格</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'detailDialog',
  props: {
    value: Boolean,
    infoObj: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      mainLoading: false,
      formData: {
        size: 10000
      },
      dataList: []
    }
  },
  methods: {
    async getDetailList () {
      if (this.infoObj.detailList) {
        this.dataList = this.infoObj.detailList
        return
      }
      this.mainLoading = true
      let res = await this.$post('community/admin/foodWasteDetail/getPage', this.formData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.infoObj.detailList = this.dataList
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return
      this.formData.communityId = this.infoObj.communityId
      this.formData.time = this.infoObj.time
      this.dataList = []
      this.getDetailList()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
