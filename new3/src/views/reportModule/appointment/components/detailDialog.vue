<!-- 预约列表 --  已完成 查看原因 -->
<template>
  <v-dialog title="查看详情" class="" :visible="value" :before-close="beforeClose" width="650px">
    <!-- <el-form v-if="formData.stateCode === 2" :model="formData" class="v-form" label-width="140px">
      <el-form-item label="拒绝原因：">{{formData.reason}}</el-form-item>
    </el-form>
    <el-form v-else :model="formData" class="v-form" label-width="140px">
      <el-form-item label="回收类型：">{{formData.typeCodeName}}</el-form-item>
      <el-form-item label="回收重量/数量：">{{formData.weighG}}{{formData.typeRule===0?'g':'个'}}</el-form-item>
      <el-form-item label="赠送积分：">{{formData.integral}}</el-form-item>
      <el-form-item label="备注：">{{formData.typeNote}}</el-form-item>
    </el-form> -->
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="回收类型" align="center" prop="typeName"></el-table-column>
      <el-table-column label="回收重量/数量" align="center" prop="weight"></el-table-column>
      <el-table-column label="赠送积分" align="center" prop="integral"></el-table-column>
    </el-table>
    <!-- <el-button v-show="formData.stateCode === 2" class="mgt" size="mini" type="danger" plain>查看拒绝原因</el-button> -->
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
      dataList: [],
      formData: { // 请求参数
        page: 1,
        size: 20,
        total: 0
      }
    }
  },
  created () {
    // this.getList() // 获取预约详情
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('integral/appointmentBill/getBills', { appointmentId: reqData.id })
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
      this.formData.total = res.data.totalNum
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return
      Object.assign(this.formData, this.infoObj)
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .mgt{
    margin-top: 10px
  }
</style>
