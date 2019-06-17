<template>
  <v-dialog title="巡检" class="dialogWrap" :visible.sync="value" width="70%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.inspectionStatus" placeholder="请选择巡检状态">
          <el-option label="未巡检" :value="0"></el-option>
          <el-option label="已巡检" :value="1"></el-option>
          <el-option label="已拒绝" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList" height="660px">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='设备编码' prop="equipmentCode"></el-table-column>
      <el-table-column align="center" label='设备名称' prop="equipmentName"></el-table-column>
      <el-table-column label="设备类型" align="center" prop="equipmentTypeName"></el-table-column>
      <el-table-column label="卡号" align="center" prop="cardNo"></el-table-column>
      <el-table-column label="垃圾类型" align="center" prop="typeName"></el-table-column>
      <el-table-column label="巡检状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.inspectionStatus === 1" class="v-green">已巡检</span>
          <span v-if="scope.row.inspectionStatus === 0" class="v-gray">未巡检</span>
          <span v-if="scope.row.inspectionStatus === 2" class="v-red">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="投递重量（g）" align="center">
        <template slot-scope="scope">
          {{scope.row.weight}}
        </template>
      </el-table-column>
      <el-table-column label="投递时间" align="center" prop="createTime" width="200"></el-table-column>
      <el-table-column label="巡检时间" align="center" prop="inspectionTime" width="200"></el-table-column>
      <el-table-column label="积分" align="center" prop="integral"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <div slot="footer" style="text-align: center">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'castDialog',
  props: {
    value: Boolean,
    equipmentCode: { // 表单数据
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      mainLoading: false,
      dataList: [],
      formData: {
        equipmentCode: '',
        inspectionStatus: '',
        page: 1,
        size: 20,
        total: 0
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 获取投放列表
    async getCast () {
      let reqData = Object.assign({}, this.formData)
      reqData.orgId = this.userInfo.orgId
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/equipmentCast/getPage', reqData)
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
      this.getCast()
    },
    // 切换页面 - 页size
    handleSizeChange (val) {
      this.formData.page = 1
      this.formData.size = val
      this.getCast()
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getCast()
    },
    // 清空
    toClearForm () {
      this.formData = {
        equipmentCode: this.equipmentCode,
        inspectionStatus: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.getCast()
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData.equipmentCode = this.equipmentCode
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.getCast()
    }
  }
}
</script>

<style scoped>
</style>
