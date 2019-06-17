<!-- SIM卡列表-->
<template>
  <div class="">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-select v-model="formData.status" placeholder="请选择状态" clearable>
          <el-option label="正常" :value="0"></el-option>
          <el-option label="预警" :value="1"></el-option>
          <el-option label="欠费" :value="2"></el-option>
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
      <el-table-column label="卡号" prop="iccid" align="center"></el-table-column>
      <el-table-column label="总流量(kb)" prop="flowTotal" align="center"></el-table-column>
      <el-table-column label="已使用(kb)" prop="flowUsed" align="center"></el-table-column>
      <el-table-column label="剩余流量(kb)" prop="flowAllowance" align="center"></el-table-column>
      <el-table-column label="设备编码" prop="equipmentCode" align="center"></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row.status === 0 ? '正常' : (scope.row.status === 1 ? '预警' : '欠费')}} -->
          <span v-if="scope.row.status === 0" class="v-green">正常</span>
          <span v-if="scope.row.status === 1" class="v-yellow">预警</span>
          <span v-if="scope.row.status === 2" class="v-red">欠费</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center" v-if="btnVisible && btnVisible.delete">
        <template slot-scope="scope">
          <el-button plain size="mini" type="danger" @click="toDelete(scope.row.iccid)">删除</el-button>
        </template>
      </el-table-column>
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
        status: '',
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
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.tableButton = !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取SIM卡列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/simCard/getPage', reqData)
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
        status: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    },
    // 删除SIM卡
    toDelete (iccid) {
      this.$confirm('确定删除该SIM卡？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('equipment/simCard/delete', { iccid })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
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
