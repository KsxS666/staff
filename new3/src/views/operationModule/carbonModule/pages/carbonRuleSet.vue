<!-- 新闻类型列表-->
<template>
  <div>
    <div class="v-other-btn-list">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加减碳规则</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="行为名称" prop="name" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">投放</span>
          <span v-else-if="scope.row.type === 1">预约</span>
          <span v-else>浇水</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="putName" align="center">
        <template slot-scope="scope">
          {{scope.row.type === 0 ? scope.row.putName: '-'}}
        </template>
      </el-table-column>
      <el-table-column label="重量（kg）" prop="weight" align="center">
        <template slot-scope="scope">
          {{scope.row.type === 0 ? scope.row.weight: '-'}}
        </template>
      </el-table-column>
      <el-table-column label="减碳值（g）" prop="energy" align="center"></el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增，编辑减碳规则弹窗 -->
    <ruleEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" @success="getList"/>
  </div>
</template>

<script>
import ruleEditDialog from '../components/ruleEditDialog'
export default {
  name: 'newsList',
  components: { ruleEditDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
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
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.userAdd && !btnList.userDeleteMulti && !btnList.userDeleteAll && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.userEdit && !btnList.userWasteRecode && !btnList.userDelete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取减碳规则列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/energyRule/getPage', reqData)
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
    // 删除减碳规则
    toDelete (id) {
      this.$confirm('确定删除该规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('user/energyRule/delete', { id })
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
    }
  }
}
</script>
