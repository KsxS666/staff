<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" class="date-box">
        <el-date-picker v-model="formData.timeArr" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" value-format="yyyy-MM"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.topButton">
      <el-button class="v-button" v-if="btnVisible.fileDownload" type="warning" icon="el-icon-download" plain @click="toDownloadFile">下载导入模板</el-button>
      <el-button class="v-button" v-if="btnVisible.import" type="info" icon="el-icon-upload2" plain @click="importInfo.visible = true">导入</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="小区" prop="communityName"  align="center"> </el-table-column>
      <el-table-column label="楼号" prop="building"  align="center"> </el-table-column>
      <el-table-column label="单元" prop="unit" align="center"> </el-table-column>
      <el-table-column label="门牌号" prop="doorNumber" align="center"> </el-table-column>
      <el-table-column label="投放类型" prop="castType"  align="center"> </el-table-column>
      <el-table-column label="投放次数" prop="castCount"  align="center"> </el-table-column>
      <el-table-column label="积分" prop="integral"  align="center"> </el-table-column>
      <el-table-column label="投放时间" prop="monthStr"  align="center"> </el-table-column>
      <el-table-column label="积分状态" prop="monthStr"  align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.taskStatus === 0">待处理</span>
          <span v-else-if="scope.row.taskStatus === 1" class="v-green">已领取</span>
          <span v-else-if="scope.row.taskStatus === 2" class="v-yellow">待领取</span>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <importDialog v-model="importInfo.visible" :communityList="communityList"/>
  </div>
</template>

<script>
import importDialog from './components/importDialog'
export default {
  name: 'footWasteByHuzhou',
  components: { importDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityId: '',
        timeArr: [],
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      communityList: [], // 小区=
      importInfo: {
        visible: false
      }
    }
  },
  created () {
    this.getList()
    this.getCommunityList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.import && !btnList.fileDownload ? null : true
      return btnList
    }
  },
  methods: {
    // 获取列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.timeStart = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.timeEnd = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/houseFoodWaste/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      let res = await this.$post('community/community/getCommunityList', { cityId: '50853' })
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 查询
    toSearch () {
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
    // 下载导入模板
    toDownloadFile () {
      window.open('https://ajwl-file.oss-cn-shenzhen.aliyuncs.com/%E4%BD%8F%E6%88%B7%E5%8E%A8%E4%BD%99%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
