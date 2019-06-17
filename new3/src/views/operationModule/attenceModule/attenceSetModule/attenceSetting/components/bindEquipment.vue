<!-- 批量设置有效范围弹窗 -->
<template>
  <v-dialog title="已绑定设备" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <div class="v-other-btn-list">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowBindDialog(1)">绑定设备</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList" height="500">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="设备编码" prop="equipmentCode"  align="center"> </el-table-column>
      <el-table-column label="设备名称" prop="equipmentName"  align="center"> </el-table-column>
      <el-table-column label="省市区街道" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}-{{scope.row.cityName}}-{{scope.row.districtName}}-{{scope.row.streetName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属小区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.communityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="communityAddress"  align="center"> </el-table-column>
      <el-table-column label="考勤有效范围" prop="attendanceDistance" align="center" > </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="toRelieveSingle(scope.row.id)" plain>解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="beforeClose">关闭</el-button>
    </div>
    <equipmentSelectDialog v-model="bindInfo.visible" :listByAdmin="dataList" :communityAdminId="infoObj.communityAdminId" @success="getList" />
  </v-dialog>
</template>
<script>
import equipmentSelectDialog from './equipmentSelectDialog'
export default {
  name: 'attenceSetDialog',
  components: { equipmentSelectDialog },
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    },
    equipmentIds: { // 全部勾选的设备数组
      type: Array,
      default: () => []
    },
    equipmentProperty: {
      type: String,
      default: () => '0'
    }
  },
  data () {
    return {
      mainLoading: false,
      dataList: [],
      bindInfo: {
        visible: false
      }
    }
  },
  created () {},
  methods: {
    // 获取设备列表
    async getList () {
      console.log(this.infoObj)
      let reqData = { communityAdminId: this.infoObj.communityAdminId }
      this.mainLoading = true
      let res = await this.$post('community/admin2Equipment/listByAdmin', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
    },
    toShowBindDialog () {
      this.bindInfo.visible = true
    },
    toRelieveSingle (id) {
      this.$confirm('确定解除绑定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '解除中...'
            let res = await this.$post('community/admin2Equipment/cancelBind', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('解除成功')
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
