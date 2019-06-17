<!-- 答题地区列表-->
<template>
  <div class="v-wrap">
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.add && !dataList.length">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加地区</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column align="center" label="序号" type="index" width="68">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column align="center" label="活动名称" prop="title"></el-table-column>
      <el-table-column align="center" label="公司名称" prop="orgName" v-if="userInfo.username === 'admin'" ></el-table-column>
      <el-table-column align="center" label="省份" prop="provinceName">
        <template slot-scope="scope">{{scope.row.activeTypeName==='区域活动'?scope.row.provinceName: '-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="市区" prop="cityName">
        <template slot-scope="scope">{{scope.row.activeTypeName==='区域活动'?scope.row.cityName: '-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="活动类型" prop="activeTypeName"></el-table-column>
      <el-table-column align="center" label="时间类型" prop="timeTypeName"></el-table-column>
      <el-table-column align="center" label="时间段" width="200px">
        <template
          slot-scope="scope"
        >{{scope.row.timeTypeName==="临时活动"?scope.row.timeStart+' ~ '+scope.row.timeEnd: '-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="stateType">
        <template slot-scope="scope">{{scope.row.stateType===0? '正常': '冻结'}}</template>
      </el-table-column>
      <el-table-column align="center" label="总题数" prop="total"></el-table-column>
      <el-table-column align="center" label="每次竞赛题数" prop="matterNumber"></el-table-column>
      <el-table-column align="center" label="操作" width="200" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <!--<el-button size="mini" @click="toShowEdit(scope.row)" type="primary" plain>编辑</el-button>-->
          <el-button size="mini" v-if="btnVisible && btnVisible.viewAnswer" type="primary" plain @click="$router.push(`/operation/answerModule/answerList??provinceId=${scope.row.provinceId ||''}&cityId=${scope.row.cityId ||''}&matterAreaId=${scope.row.id}&orgId=${scope.row.orgId || ''}`)">查看详情</el-button>
          <el-button size="mini" v-if="btnVisible && btnVisible.delete" :disabled="scope.row.provinceName === '默认'" @click="toDelete(scope.row)" type="danger" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增，编辑答题区域弹窗 -->
    <answerAreaEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj"  :type="editInfo.type"  @success="getList" />
  </div>
</template>

<script>
import answerAreaEditDialog from './components/answerAreaEditDialog'
export default {
  name: 'answerAreaList',
  components: { answerAreaEditDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        flag: 1,
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
      // btnList.topButton = !btnList.userAdd && !btnList.userDeleteMulti && !btnList.userDeleteAll && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.viewAnswer && !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取商品地区列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/matterAreaController/getAllMatterArea', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
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
    // 删除区域
    toDelete (row) {
      this.$confirm('是否删除该记录，相应的题目也会删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            let res = await this.$post('/system/matterAreaController/deletedMatterArea', { areaId: row.id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.getList()
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
