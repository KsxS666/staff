<!-- 卡片生成任务列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-select filterable clearable v-model="formData.taskType" placeholder="请选择类别">
          <el-option :value="2" label="二维码"></el-option>
          <el-option :value="3" label="卡片"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-select filterable clearable v-model="formData.createStatus" placeholder="请选择状态">
          <el-option :value="1" label="生成中"></el-option>
          <el-option :value="2" label="已完成"></el-option>
          <el-option :value="3" label="生成失败"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.add">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加任务</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="类别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.taskType == 2">二维码</span>
          <span v-if="scope.row.taskType == 3">卡片</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.taskType == 2">
            <span v-if="scope.row.type == 1">垃圾袋</span>
            <span v-if="scope.row.type == 2">垃圾卷</span>
          </span>
          <span v-if="scope.row.taskType == 3">
            <span>芯片卡</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="任务数量" align="center">
        <template slot-scope="scope">{{scope.row.number}}</template>
      </el-table-column>

      <el-table-column label="已完成数量" align="center">
        <template slot-scope="scope">{{scope.row.finishNumber}}</template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.createStatus == 0">新增</span>
          <span v-else-if="scope.row.createStatus == 1">生成中</span>
          <span v-else-if="scope.row.createStatus == 2">已完成</span>
          <span v-else-if="scope.row.createStatus == 3">生成失败</span>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" align="center">
        <template slot-scope="scope">{{scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
          <el-button type="info" size="mini" v-if="btnVisible.download" @click="handleDownload(scope.row)" plain>导出</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增，编辑卡片任务弹窗 -->
    <cardTaskEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" @success="getList"/>
  </div>
</template>

<script>
import cardTaskEditDialog from './components/cardTaskEditDialog'
export default {
  name: 'cardTastList',
  components: { cardTaskEditDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        taskType: '',
        createStatus: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
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
      btnList.topButton = !btnList.userAdd && !btnList.userDeleteMulti && !btnList.userDeleteAll && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.userEdit && !btnList.userWasteRecode && !btnList.userDelete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取卡片生成任务列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.orgId = this.userInfo.orgId
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/cardTask/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
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
    // 删除卡片生成任务
    toDelete (id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/cardTask/delete', { id })
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
    handleDownload (row) {
      // const url = process.env.BASE_API + '/system/cardTask/export' + '?' + '&taskId=' + row.id + '&taskType=' + row.taskType + '&adminId=' + this.userInfo.id
      // window.open(url)
      let reqData = {
        taskId: row.id,
        taskType: row.taskType,
        adminId: this.userInfo.id
      }
      this.$utils.exportFile('system/cardTask/export', reqData)
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        taskType: '',
        createStatus: '',
        page: 1,
        size: 20,
        total: 0
      }
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
    }
  }
}
</script>
