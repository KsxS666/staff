<!-- 厨余垃圾 - -详情 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-date-picker v-model="formData.time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.detailDownload">
      <el-button class="v-button" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="小区名称" prop="communityName"  align="center"> </el-table-column>
      <el-table-column label="抽检户数" prop="currentCheckNum"  align="center"> </el-table-column>
      <el-table-column label="投放重量（KG）" prop="weightTotal"  align="center"> </el-table-column>
      <el-table-column label="合格数" prop="total"  align="center"> </el-table-column>
      <el-table-column label="准确率" prop="passPercent"  align="center"> </el-table-column>
      <el-table-column label="日期" prop="time"  align="center"> </el-table-column>
      <el-table-column label="操作" width="140px" align="center" v-if="btnVisible && btnVisible.detailViewDetail">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" @click="toShowDetail(scope.row)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 查看明细 -->
    <detailDialog v-model="detailInfo.visible" :info-obj="detailInfo.infoObj"/>
  </div>
</template>

<script>
import detailDialog from './components/detailDialog'
export default {
  name: 'foodWasteInfoDetail',
  components: { detailDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityId: this.$route.query.communityId,
        time: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      detailInfo: { // 查看明细 的数据
        visible: false,
        infoObj: {}
      }
    }
  },
  created () {
    this.getList()
    // 获得该次级页面的按钮的权限 - 在父级页面中
    this.$store.dispatch('GetBtnIsShow', '/foodWasteModule/foodWasteInfoList')
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      return btnList
    }
  },
  methods: {
    // 获取用户列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('community/admin/foodWasteTotal/getDetail', reqData)
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
      this.formData.time = ''
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
    // 查看明细
    toShowDetail (data) {
      this.detailInfo.infoObj = data
      this.detailInfo.visible = true
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
