<!-- 设备类型列表 -->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.type" placeholder="请选择类型">
          <el-option label="设备" :value="1"></el-option>
          <el-option label="桶" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.add">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加设备类型</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList" :cell-style="setIconCellStyle">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="类型名称" prop="name" align="center"> </el-table-column>
      <el-table-column align="center" label='所属类型'>
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">设备</span>
          <span v-else>桶</span>
        </template>
      </el-table-column>
      <el-table-column label="颜色" prop="color" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.color">{{scope.row.color}} <em :style ="{width:'20px',height: '20px', float: 'right', borderRadius: '50%', marginRight: '20px',background: scope.row.color}"></em></span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="图表图标" prop="color" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.chartImg" width="50" height="50" v-if="scope.row.chartImg">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="列表图标" prop="color" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.listImg" width="50" height="50" v-if="scope.row.listImg">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"  align="center"> </el-table-column>
      <el-table-column label="操作" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible && btnVisible.edit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" v-if="btnVisible && btnVisible.delete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增 编辑 设备类型弹窗 -->
    <equipmentTypeListEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" @success="getList"/>
  </div>
</template>

<script>
import equipmentTypeListEditDialog from './components/equipmentTypeListEditDialog'
export default {
  name: 'equipmentTypeList',
  components: { equipmentTypeListEditDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        name: '',
        type: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      importUrl: `${this.$requestBase}/user/user/importExcel`,
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
      btnList.tableButton = !btnList.edit && !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取用户列表
    async getList () {
      let reqData = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/equipmentType/getPage', reqData)
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
        name: '',
        type: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    },
    // 设置图标cell背景色
    setIconCellStyle ({ columnIndex }) {
      if (columnIndex === 4) {
        return 'background: #f1f2f3'
      }
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
    // 删除设备类型
    toDelete (id) {
      this.$confirm('确定删除该类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('equipment/equipmentType/delete', { id })
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

<style scoped lang="scss" rel="stylesheet/scss">

</style>
