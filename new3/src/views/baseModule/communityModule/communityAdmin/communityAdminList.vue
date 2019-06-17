<!-- 社区管理员列表 -->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入昵称" v-model="formData.name" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入账号" v-model="formData.username" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入手机号" v-model="formData.phone" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && ( btnVisible.add || btnVisible.setAppointmentTime )">
      <el-button class="v-button" v-if="btnVisible.add" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加社区管理员</el-button>
      <el-button class="v-button" v-if="btnVisible.setAppointmentTime" type="info" icon="el-icon-setting" plain @click="toAppointSetDialog(1)">配置预约时间</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="name"  align="center"> </el-table-column>
      <el-table-column label="账号" prop="username"  align="center"> </el-table-column>
      <el-table-column label="手机" prop="phone"  align="center"> </el-table-column>
      <el-table-column label="角色" prop="identity"  align="center">
        <template slot-scope="scope">
          {{scope.row.identity === 0 ? '督导员' : '管理员'}}
        </template>
      </el-table-column>
      <el-table-column label="所属公司" prop="orgName"  align="center"> </el-table-column>
      <el-table-column label="创建时间" prop="createTime"  align="center"> </el-table-column>
      <el-table-column label="操作" width="360px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.edit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" v-if="btnVisible.bindCommunity" type="success" @click="toShowBindDialog(scope.row)">绑定社区</el-button>
          <el-button plain size="mini" v-if="btnVisible.resetPassword" type="warning" @click="toResetPwd(scope.row.id)">重置密码</el-button>
          <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 编辑、查看、修改的弹窗 -->
    <AdminEditDialog v-model="editInfo.visible" :type="editInfo.type" :infoObj="editInfo.infoObj" @success="getList"/>
    <!-- 重置密码弹窗 -->
    <ResetPwdDialog v-model="resetPwd.visible" :id="resetPwd.id"/>
    <!-- 绑定社区弹窗 -->
    <bindCommunityDialog v-model="bindCommunityInfo.visible" :infoObj="bindCommunityInfo.infoObj"/>
    <!-- 绑定设备弹窗 -->
    <bindEquipmentDialog v-model="bindEquipmentInfo.visible" :infoObj="bindEquipmentInfo.infoObj"/>
    <!-- 预约时间段配置弹窗 -->
    <appointSetDialog v-model="appointSetInfo.visible" />
  </div>
</template>

<script>
import AdminEditDialog from './components/adminEditDialog'
import ResetPwdDialog from './components/resetPwdDialog'
import bindCommunityDialog from './components/bindCommunityDialog'
import bindEquipmentDialog from './components/bindEquipmentDialog'
import appointSetDialog from './components/appointSetDialog'

export default {
  name: 'communityAdminList',
  components: { AdminEditDialog, ResetPwdDialog, bindCommunityDialog, appointSetDialog, bindEquipmentDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        username: '',
        name: '',
        phone: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      },
      resetPwd: { // 重置密码的数据
        visible: false,
        id: null
      },
      bindCommunityInfo: { // 绑定社区的数据
        visible: false,
        infoObj: {}
      },
      bindEquipmentInfo: { // 绑定设备的数据
        visible: false,
        infoObj: {}
      },
      appointSetInfo: { // 预约时间段配置
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
      btnList.tableButton = !btnList.edit && !btnList.delete && !btnList.bindCommunity && !btnList.resetPassword && !btnList.bindEquipment ? null : true
      return btnList
    }
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('community/communityAdmin/getPage', reqData)
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
        username: '',
        name: '',
        phone: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.formData.page = 1
      this.getList()
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
    },
    // 显示 "新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改  3是查看
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 显示预约时间配置弹窗
    toAppointSetDialog () {
      this.appointSetInfo.visible = true
    },
    // 删除管理员
    toDelete (id) {
      this.$confirm('确定删除该社区管理员？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('community/communityAdmin/delete', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
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
    // 重置密码
    toResetPwd (id) {
      this.resetPwd.id = id
      this.resetPwd.visible = true
    },
    // 绑定社区
    toShowBindDialog (data) {
      this.bindCommunityInfo.infoObj = data
      this.bindCommunityInfo.visible = true
    },
    // 绑定设备
    toShowBindEquipmentDialog (data) {
      this.bindEquipmentInfo.infoObj = data
      this.bindEquipmentInfo.visible = true
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
