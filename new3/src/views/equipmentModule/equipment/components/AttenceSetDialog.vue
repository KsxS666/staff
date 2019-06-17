<!-- 桶列表弹窗 -->
<template>
  <v-dialog title="设置考勤" class="dialogWrap" :visible.sync="value" width="700px" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="绑定管理员">
        <el-select filterable clearable multiple v-model="formData.adminIdArr">
          <el-option v-for="(item, i) in adminList" :key="i" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'attenceSetDialog',
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      mainLoading: false,
      isEdit: false,
      formData: {
        page: 1,
        size: 100,
        total: 0
      },
      dataList: [],
      adminList: [], // 管理员列表
      bareInfo: { // 桶信息
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      }
    }
  },
  created () {
    // this.getList()
  },
  mounted () {
    this.getAdminList()
  },
  methods: {
    // 获取桶列表
    async getList () {
      if (this.infoObj.dataList && !this.isEdit) { // 之前有加载过的 直接读取
        this.dataList = this.infoObj.dataList
        return true
      }
      let reqData = {
        orgId: this.infoObj.orgId,
        equipmentCode: this.infoObj.equipmentCode
      }
      this.mainLoading = true
      let res = await this.$post('equipment/barrel/findByEquipmentId', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
      this.infoObj.dataList = res.data || []
    },
    // 获得管理员列表
    async getAdminList () {
      let res = await this.$post('system/admin/getList')
      if (res.code === 0) {
        this.adminList = res.data.filter(item => {
          return item.username !== 'admin'
        })
      }
    },
    // 显示桶"新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改  3是查看
      this.bareInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.bareInfo.visible = true
      this.bareInfo.infoObj = data
    },
    edit () {
      this.isEdit = true
    },
    // 删除桶
    toDelete (id) {
      this.$confirm('确定删除该桶？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('equipment/barrel/delete', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.isEdit = true
              this.getList()
            } else {
              res.msg && this.$message.error(res.msg)
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
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return false
      this.getList()
    }
  }
}
</script>
