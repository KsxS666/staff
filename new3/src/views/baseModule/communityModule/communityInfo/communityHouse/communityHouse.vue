<!-- 社区- 查看住户 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入楼号/年段" v-model="formData.building" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入单元/班级" v-model="formData.unit" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入门牌号" v-model="formData.doorNumber" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select clearable="" placeholder="请选择入驻状态" v-model="formData.registerFlag">
          <el-option label="未入驻" :value="0"></el-option>
          <el-option label="已入驻" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.topButton">
      <el-button class="v-button" type="primary" v-if="btnVisible.userAdd" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加住户</el-button>
      <el-button class="v-button" type="warning" v-if="btnVisible.userFileDownload" icon="el-icon-download" plain @click="toDownloadFile">下载导入模板</el-button>
      <el-button class="v-button" type="info" icon="el-icon-upload2" plain @click="toShowInsertEditDialog">批量导入文件</el-button>
      <el-button class="v-button" type="success" v-if="btnVisible.userDownload" icon="el-icon-download" plain @click="toDownload">导出住户</el-button>
      <el-button class="v-button" type="danger" v-if="btnVisible.userDeleteMulti" icon="el-icon-delete" plain @click="toDelete(2)">批量删除</el-button>
      <el-button class="v-button" type="danger" v-if="btnVisible.userDeleteAll" icon="el-icon-delete" plain @click="toDelete(3)">全部删除</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList" @selection-change="handleSelectionChange">>
      <el-table-column type="selection" :selectable="checkSelect"></el-table-column>
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="所属小区" prop="communityName"  align="center"> </el-table-column>
      <el-table-column label="楼号/年段" prop="building"  align="center"> </el-table-column>
      <el-table-column label="单元/班级" prop="unit"  align="center"> </el-table-column>
      <el-table-column label="门牌号" prop="doorNumber"  align="center"> </el-table-column>
      <el-table-column label="入驻状态" align="center">
        <template slot-scope="scope">
          {{scope.row.userCount > 0 ? '已入驻' : '未入驻'}}
        </template>
      </el-table-column>
      <el-table-column label="住户是否入住" align="center">
        <template slot-scope="scope">
          {{scope.row.joinFlag?'已入住':'未入住'}}
        </template>
      </el-table-column>
      <el-table-column label="家庭当前积分" prop="integral"  align="center"> </el-table-column>
      <el-table-column label="家庭累计积分" prop="cumulativeIntegral"  align="center"> </el-table-column>
      <el-table-column label="操作" width="360px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.userEdit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" v-if="btnVisible.userWasteRecode" type="info" @click="$router.push(`/baseData/communityModule/footWasteLaunch?id=${scope.row.id}`)">查看厨余记录</el-button>
          <el-button plain size="mini" v-if="btnVisible.userDelete" type="danger" @click="toDelete(1, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增 编辑 -->
    <communityHouseEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" @success="getList"/>
    <!-- 批量导入文件弹窗 -->
    <insertDialog v-model="insertInfo.visible"  @success="getList" />
  </div>
</template>

<script>
import communityHouseEditDialog from './components/communityHouseEditDialog'
import insertDialog from './components/insertDialog'
export default {
  name: 'communityHouse',
  components: { communityHouseEditDialog, insertDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityId: this.$route.query.id,
        building: '', // 楼号/年级
        unit: '', // 单元/班级
        doorNumber: '', // 门牌号
        registerFlag: '', // 0:未入住, 1:已入住
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      multiSelect: [], // 多选的结果列表
      // communityList: [], // 社区 列表
      // allCommunityList: [], // 所有的社区的列表
      importUrl: `${this.$requestBase}/user/house/importExcel`,
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      },
      insertInfo: { // 编辑、新增 的数据
        visible: false
      }
    }
  },
  created () {
    this.getList()
    // 获得该次级页面的按钮的权限 - 在父级页面中
    this.$store.dispatch('GetBtnIsShow', '/baseData/communityModule/communityList')
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
    // 获取用户列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/house/getPage', reqData)
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
        communityId: this.$route.query.id,
        building: '', // 楼号/年级
        unit: '', // 单元/班级
        doorNumber: '', // 门牌号
        registerFlag: '', // 0:未入住, 1:已入住
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
    },
    // 判断表格项是否是可勾选的
    checkSelect (row) {
      return row.userCount === 0
    },
    // 列表多选的结果
    handleSelectionChange (val) {
      this.multiSelect = val
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
    // 显示批量导入窗口
    toShowInsertEditDialog () {
      this.insertInfo.visible = true
    },
    // 删除用户
    toDelete (type, id) { // type 1是单个删除 2是 批量删除 3是全部删除
      let text = 'la'
      let req = {}
      switch (type) {
        case 1:
          req.ids = id
          text = '确定删除该住户？'
          break
        case 2:
          if (!this.multiSelect.length) {
            this.$message.error('请先选择数据')
            return
          }
          let arr = this.multiSelect.map(item => {
            return item.id
          })
          req.ids = arr.join(',')
          text = `确定删除这 ${arr.length} 住户？`
          break
        case 3:
          req.communityId = this.formData.communityId
          text = '确定删除全部住户？'
          break
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('user/house/delete', req)
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
    // 批量导入的返回
    importSuccess (res) {
      if (res.code === 0) {
        this.$message.success('导入成功')
        this.getList()
      } else {
        res.msg && this.$message.error(res.msg)
      }
    },
    // 导出用户
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/user/house/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('user/house/export', req)
    },
    // 下载导入模板
    toDownloadFile () {
      window.open('http://ajwl-file.oss-cn-shenzhen.aliyuncs.com/%E4%BD%8F%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
