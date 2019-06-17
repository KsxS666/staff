<!-- 考勤管理列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入手机号" v-model="formData.adminPhone" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入管理员昵称" v-model="formData.adminName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible.topButton">
      <el-button v-if="btnVisible.add" class="v-button" type="primary" icon="el-icon-circle-plus-outline" @click="toShowEditDialog(1)" plain>新增考勤</el-button>
      <router-link v-if="btnVisible.timeSet" to="/operation/attenceReport/attenceTimeSet"><el-button type="primary" plain icon="el-icon-edit">设置考勤时间</el-button></router-link>
      <router-link v-if="btnVisible.rangeSet" to="/equipmentModule/equipment/equipmentList"><el-button class="v-button" type="primary" icon="el-icon-edit" plain>设置有效范围</el-button></router-link>
      <el-button v-if="equipmentIds.length" class="v-button" type="primary" icon="el-icon-check" @click="toShowBatchDialog">设置</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="管理员昵称" prop="adminName" align="center"></el-table-column>
      <el-table-column label="手机号" prop="adminPhone" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="250" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button v-if="btnVisible.viewEquipment" type="primary" size="mini" plain @click="toShowBindEquipmentDialog(scope.$index)">查看设备</el-button>
          <el-button v-if="btnVisible.removeRel" type="danger" size="mini" plain @click="toRelieve(scope.row.communityAdminId )">解除绑定关系</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增考勤 -->
    <attenceSetEditDialog v-model="editInfo.visible" />
    <!-- 已绑定设备弹窗 -->
    <bindEquipment v-model="bindEquipmentInfo.visible" :infoObj="bindEquipmentInfo.infoObj" />
  </div>
</template>

<script>
import attenceSetEditDialog from './components/attenceSetEditDialog'
import bindEquipment from './components/bindEquipment'
export default {
  name: 'attenceSetting',
  components: { attenceSetEditDialog, bindEquipment },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        adminPhone: '',
        adminName: '',
        equipmentCode: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      equipmentIds: [],
      editInfo: {
        visible: false,
        infoObj: {}
      },
      bindEquipmentInfo: {
        visible: false,
        infoObj: {}
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.add && !btnList.rangeSet && !btnList.timeSet ? null : true
      btnList.tableButton = !btnList.viewEquipment && !btnList.removeRel ? null : true
      return btnList
    }
  },
  methods: {
    // 获取满桶列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('/community/admin2Equipment/getAdminPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    toShowBindEquipmentDialog (index) {
      let data = null
      data = this.dataList[index]
      this.bindEquipmentInfo.visible = true
      this.bindEquipmentInfo.infoObj = data
    },
    toShowEditDialog () {
      this.editInfo.visible = true
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
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
        adminPhone: '',
        adminName: '',
        equipmentCode: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    },
    toRelieve (communityAdminId) {
      this.$confirm('确定解除绑定关系？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '解除中...'
            let res = await this.$post('community/admin2Equipment/cancelBind', { communityAdminId })
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
