<!-- 桶列表弹窗 -->
<template>
  <v-dialog title="桶列表" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <div class="v-other-btn-list">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">新增桶</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="桶类型" prop="equipmentTypeName" align="center"> </el-table-column>
      <el-table-column label="工作状态" prop="workingStateName" align="center"> </el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" style="text-align: center">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  <!-- 新增、编辑桶弹窗 -->
  <bareEditDialog v-model="bareInfo.visible" :type="bareInfo.type" :infoObj="bareInfo.infoObj"  :equipmentInfo="infoObj" @success="getList" @edit="edit" />
  </v-dialog>
</template>

<script>
import bareEditDialog from './bareEditDialog'
export default {
  name: 'bareListDialog',
  components: { bareEditDialog },
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
